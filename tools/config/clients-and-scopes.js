const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const mustache = require('mustache');

// Load config
const clientsConfigPath = path.resolve(__dirname, 'clients-config.json');
const rolesConfigPath = path.resolve(__dirname, 'keycloak-roles.json');
const clients = JSON.parse(fs.readFileSync(clientsConfigPath, 'utf8'));
const roles = JSON.parse(fs.readFileSync(rolesConfigPath, 'utf8'));
const httpsAgent = new https.Agent();

const keycloakUrl = process.env.KEYCLOAK_URL;
const realm = process.env.KEYCLOAK_REALM;
const openshiftApi = process.env.OPENSHIFT_SERVER;
const gradNamespace = `${process.env.GRAD_NAMESPACE}-${process.env.TARGET_ENV}`;
const openshiftToken = process.env.OPENSHIFT_TOKEN;
const env = process.env.TARGET_ENV;

async function getOpenShiftSecret(openshiftApi, openshiftToken, namespace, secretName) {
  const url = `${openshiftApi}/api/v1/namespaces/${namespace}/secrets/${secretName}`;
  try {
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${openshiftToken}` },
      httpsAgent
    });

    const encodedData = resp.data.data;
    const decodedData = {};

    for (const [key, value] of Object.entries(encodedData)) {
      decodedData[key] = Buffer.from(value, 'base64').toString('utf-8');
    }

    return decodedData;
  } catch (err) {
    throw new Error(`Failed to retrieve secret "${secretName}": ${err.response?.data?.message || err.message}`);
  }
}

async function getAccessToken({username, password}) {
  const url = `${keycloakUrl}/auth/realms/${realm}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', 'admin-cli');
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(url, params);
  return response.data.access_token;
}

async function getClientByClientId(token, clientId) {
  const url = `${keycloakUrl}/auth/admin/realms/${realm}/clients?clientId=${encodeURIComponent(clientId)}`;
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(url, { headers });

  return response.data.length > 0 ? response.data[0] : null;
}

async function createClient(token, client) {
  const url = `${keycloakUrl}/auth/admin/realms/${realm}/clients`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const data = {
    ...client
  };

  const response = await axios.post(url, data, { headers });
  return response.headers.location.split('/').pop();
}

async function getClientUUID(accessToken, targetClientId) {
  const url = `${keycloakUrl}/auth/admin/realms/${realm}/clients`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { clientId: targetClientId }
  });

  const client = res.data.find(c => c.clientId === targetClientId);
  if (!client) throw new Error(`Client '${targetClientId}' not found.`);
  return client.id;
}

async function deleteClient(token, targetClientId) {
  try {
    const clientUUID = await getClientUUID(token, targetClientId);

    const deleteUrl = `${keycloakUrl}/auth/admin/realms/${realm}/clients/${clientUUID}`;
    await axios.delete(deleteUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ Client '${targetClientId}' deleted.`);
  } catch (err) {
    console.error(`❌ Error deleting client:`, err.response?.data || err.message);
  }
}

async function doesRoleExist(token, roleName) {
  const url = `${keycloakUrl}/auth/admin/realms/${realm}/roles/${encodeURIComponent(roleName)}`;
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.get(url, { headers, validateStatus: () => true });
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  throw new Error(`Unexpected ${res.status}: ${JSON.stringify(res.data)}`);
}

async function createRealmRole(token, roleName) {
  const url = `${keycloakUrl}/auth/admin/realms/${realm}/roles`;
  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.post(url, {
    name: roleName
  }, { headers });
  if (res.status === 201) console.log(`Created role: "${roleName}"`);
}

async function ensureScopeExists(token, scopeName) {
  const headers = { Authorization: `Bearer ${token}` };
  const scopesUrl = `${keycloakUrl}/auth/admin/realms/${realm}/client-scopes`;

  const response = await axios.get(scopesUrl, { headers });
  let scope = response.data.find(s => s.name === scopeName.trim());

  if (!scope) {
    console.log(`➕ Creating missing scope "${scopeName}"...`);
    await axios.post(scopesUrl, {
      name: scopeName,
      protocol: "openid-connect",
      attributes: {
        "include.in.token.scope": "true",
        "display.on.consent.screen": "true"
      }
    }, { headers });

    const updatedList = await axios.get(scopesUrl, { headers });
    scope = updatedList.data.find(s => s.name === scopeName.trim());
  }

  return scope;
}

async function assignScopes(token, clientId, scopeNames) {
  const headers = { Authorization: `Bearer ${token}` };

  for (const scopeName of scopeNames || []) {
    const scope = await ensureScopeExists(token, scopeName);
    if (!scope) continue;

    const assignUrl = `${keycloakUrl}/auth/admin/realms/${realm}/clients/${clientId}/default-client-scopes/${scope.id}`;
    try {
      await axios.put(assignUrl, null, { headers });
      console.log(`✅ Assigned scope "${scope.name}" to client.`);
    } catch (err) {
      if (err.response?.status === 409) {
        console.log(`ℹ️ Scope "${scope.name}" already assigned.`);
      } else {
        console.error(`❌ Failed to assign scope "${scope.name}":`, err.message);
      }
    }
  }
}

(async () => {
  try {
    const kcCredentials = await getOpenShiftSecret(openshiftApi, openshiftToken, gradNamespace, 'grad-kc-admin');
    const token = await getAccessToken(kcCredentials);
    const url = 'grad.gov.bc.ca'
    const rootUrl = (env !== 'prod') ?`${env}.${url}` : url;

    // set up clients
    for (let client of clients) {
      console.log(`🚀 Processing client "${client.clientId}"...`);
      client = JSON.parse(mustache.render(JSON.stringify(client), {rootUrl: rootUrl}));
      if (env === 'dev' && Array.isArray(client.redirectUris)) {
        client.redirectUris.push(`http://localhost*`);
      }

      let existingClient = await getClientByClientId(token, client.clientId);
      let clientIdValue;
      let clientSecret;

      if (existingClient) {
        clientSecret = existingClient.secret;
        client.secret = clientSecret;
        await deleteClient(token, client.clientId);
        console.log(`🔄 Deleted client "${client.clientId}".`);
      }

      clientIdValue = await createClient(token, client);
      console.log(`➕ Created client "${client.clientId}".`);

      await assignScopes(token, clientIdValue, client.defaultClientScopes);
    }

    console.log(`✅ All clients processed.`);

    // roles processing
    for(let role of roles){
      const roleExists = await doesRoleExist(token, role);
      if(roleExists){
        console.log(`Role: "${role}" already exists. Skipping... `);
      } else {
        await createRealmRole(token, role);
      }
    }
    console.log(`✅ All roles processed.`);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    process.exit(1);
  }
})();