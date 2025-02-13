###########################################################
#ENV VARS
###########################################################
ENV=$1
APP_NAME=$2
OPENSHIFT_NAMESPACE=$3
BASE_URL=$4
SOAM_CLIENT_SECRET=$5
REDIS_PASSWORD=$6
SPLUNK_TOKEN=$7
COMMON_NAMESPACE=$8
GRAD_NAMESPACE=$9
GRAD_BUSINESS_NAMESPACE=${10}
SOAM_SERVICE_CLIENT_SECRET=${11}
STUDENT_ADMIN_NAMESPACE=${12}

SOAM_KC_REALM_ID="master"
SOAM_KC=soam-$ENV.apps.silver.devops.gov.bc.ca
SOAM_KC_LOAD_USER_ADMIN=$(oc -n $COMMON_NAMESPACE-$ENV -o json get secret sso-admin-${ENV} | sed -n 's/.*"username": "\(.*\)"/\1/p' | base64 --decode)
SOAM_KC_LOAD_USER_PASS=$(oc -n $COMMON_NAMESPACE-$ENV -o json get secret sso-admin-${ENV} | sed -n 's/.*"password": "\(.*\)",/\1/p' | base64 --decode)

nodeEnv="openshift"
if [ "$ENV" = "dev" ]
then
  nodeEnv="local"
fi
siteMinderLogoutUrl=""
if [ "$ENV" != "prod" ]
then
  siteMinderLogoutUrl="https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
else
  siteMinderLogoutUrl="https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl="
fi

echo Fetching SOAM token
TKN=$(curl -s \
  -d "client_id=admin-cli" \
  -d "username=$SOAM_KC_LOAD_USER_ADMIN" \
  -d "password=$SOAM_KC_LOAD_USER_PASS" \
  -d "grant_type=password" \
  "https://$SOAM_KC/auth/realms/$SOAM_KC_REALM_ID/protocol/openid-connect/token" | jq -r '.access_token')

echo Fetching public key from SOAM
fullKey=$(curl -sX GET "https://$SOAM_KC/auth/admin/realms/$SOAM_KC_REALM_ID/keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TKN" \
  | jq -r '.keys | .[] | select(.algorithm == "RS256") | .publicKey')

echo Fetching public key from SOAM
soamFullPublicKey="-----BEGIN PUBLIC KEY----- $fullKey -----END PUBLIC KEY-----"
newline=$'\n'
formattedPublicKey="${soamFullPublicKey:0:26}${newline}${soamFullPublicKey:27:64}${newline}${soamFullPublicKey:91:64}${newline}${soamFullPublicKey:155:64}${newline}${soamFullPublicKey:219:64}${newline}${soamFullPublicKey:283:64}${newline}${soamFullPublicKey:347:64}${newline}${soamFullPublicKey:411:9}${newline}${soamFullPublicKey:420}"

echo Generating private and public keys
ssh-keygen -b 4096 -t rsa -f tempPenBackendkey -m pem -q -N ""
UI_PRIVATE_KEY_VAL="$(cat tempPenBackendkey)"
UI_PUBLIC_KEY_VAL="$(ssh-keygen -f tempPenBackendkey -e -m pem)"
echo Removing key files
rm tempPenBackendkey
rm tempPenBackendkey.pub


###########################################################
#Setup for config-maps
###########################################################
#### backend configmap
echo Creating config map "$APP_NAME"-backend-config-map
oc create -n "$OPENSHIFT_NAMESPACE" configmap "$APP_NAME"-backend-config-map \
  --from-literal=NODE_ENV=$nodeEnv \
  --from-literal=LOG_LEVEL=info \
  --from-literal=SERVER_FRONTEND="https://$BASE_URL" \
  --from-literal=SOAM_PUBLIC_KEY="$formattedPublicKey" \
  --from-literal=SOAM_CLIENT_ID="grad-admin-client" \
  --from-literal=SOAM_CLIENT_SECRET="$SOAM_CLIENT_SECRET" \
  --from-literal=SOAM_SERVICE_CLIENT_ID="grad-admin-service" \
  --from-literal=SOAM_SERVICE_CLIENT_SECRET="$SOAM_SERVICE_CLIENT_SECRET" \
  --from-literal=SOAM_URL="https://soam-$ENV.apps.silver.devops.gov.bc.ca" \
  --from-literal=SOAM_DISCOVERY="https://soam-$ENV.apps.silver.devops.gov.bc.ca/auth/realms/master/.well-known/openid-configuration" \
  --from-literal=IDIR_IDP_HINT=keycloak_bcdevexchange_idir \
  --from-literal=SITEMINDER_LOGOUT_ENDPOINT="$siteMinderLogoutUrl" \
  --from-literal=ISSUER=GRAD_ADMIN_APPLICATION \
  --from-literal=SESSION_MAX_AGE='1800000' \
  --from-literal=TOKEN_EXPIRES_IN='1800000' \
  --from-literal=UI_PUBLIC_KEY="$UI_PUBLIC_KEY_VAL" \
  --from-literal=UI_PRIVATE_KEY="$UI_PRIVATE_KEY_VAL" \
  --from-literal=GRAD_ROLE_ADMIN=GRAD_SYSTEM_COORDINATOR \
  --from-literal=GRAD_PROGRAM_AREA_BA=GRAD_PROGRAM_AREA_BA \
  --from-literal=GRAD_ROLE_INFO_OFFICER=GRAD_INFO_OFFICER \
  --from-literal=REDIS_HOST=redis \
  --from-literal=REDIS_PORT=6379 \
  --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" \
  --from-literal=BATCH_API_URL="http://educ-grad-batch-graduation-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=STUDENT_GRADUATION_API_URL="http://educ-grad-student-graduation-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=GRADUATION_API_URL="http://educ-grad-graduation-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=COURSE_API_URL="http://educ-grad-course-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=GRAD_STUDENT_API_URL="http://educ-grad-student-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=PROGRAM_API_URL="http://educ-grad-program-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=DISTRIBUTION_API_URL="http://educ-grad-distribution-api.$GRAD_BUSINESS_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=ASSESSMENT_API_URL="http://educ-grad-assessment-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=GRADUATION_REPORT_API_URL="http://educ-grad-graduation-report-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=GRAD_REPORT_API_URL="http://educ-grad-report-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=GRAD_TRAX_API_URL="http://educ-grad-trax-api.$GRAD_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=INSTITUTE_API_URL="http://institute-api-master.$COMMON_NAMESPACE-$ENV.svc.cluster.local:8080" \
  --from-literal=NATS_URL="nats://nats.$COMMON_NAMESPACE-$ENV.svc.cluster.local:4222" \
  --from-literal=STUDENT_ADMIN_URL="https://student-admin-$STUDENT_ADMIN_NAMESPACE-$ENV.apps.silver.devops.gov.bc.ca" \
  --dry-run=client -o yaml | oc apply -f -

#### splunk
SPLUNK_URL="gww.splunk.educ.gov.bc.ca"
FLB_CONFIG="[SERVICE]
   Flush        1
   Daemon       Off
   Log_Level    info
   HTTP_Server   On
   HTTP_Listen   0.0.0.0
   Parsers_File parsers.conf
[INPUT]
   Name   tail
   Path   /mnt/log/*
   Exclude_Path *.gz,*.zip
   Parser docker
   Mem_Buf_Limit 20MB
   Buffer_Max_Size 1MB
[FILTER]
   Name record_modifier
   Match *
   Record hostname \${HOSTNAME}
[OUTPUT]
   Name   stdout
   Match  absolutely_nothing_bud
   Log_Level    off
[OUTPUT]
   Name  splunk
   Match *
   Host  $SPLUNK_URL
   Port  443
   TLS         On
   TLS.Verify  Off
   Message_Key $APP_NAME
   Splunk_Token $SPLUNK_TOKEN
"
PARSER_CONFIG="
[PARSER]
    Name        docker
    Format      json
"
echo Creating config map "$APP_NAME"-flb-sc-config-map
oc create -n "$OPENSHIFT_NAMESPACE" configmap "$APP_NAME"-flb-sc-config-map \
  --from-literal=fluent-bit.conf="$FLB_CONFIG" \
  --from-literal=parsers.conf="$PARSER_CONFIG" \
  --dry-run=client -o yaml | oc apply -f -
