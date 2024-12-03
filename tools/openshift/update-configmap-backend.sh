###########################################################
#ENV VARS
###########################################################
ENV=$1
APP_NAME=$2
OPENSHIFT_NAMESPACE=$3
BASE_URL=$4
SOAM_PUBLIC_KEY=$5
SOAM_CLIENT_ID=$6
SOAM_CLIENT_SECRET=$7
SITEMINDER_LOGOUT_ENDPOINT=$8
UI_PUBLIC_KEY=$9
UI_PRIVATE_KEY=${10}
REDIS_PASSWORD=${11}
SPLUNK_TOKEN=${12}

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
###########################################################
#Setup for config-maps
###########################################################
echo Creating config map "$APP_NAME"-backend-config-map
oc create -n "$OPENSHIFT_NAMESPACE" configmap "$APP_NAME"-backend-config-map \
  --from-literal=NODE_ENV=openshift \
  --from-literal=LOG_LEVEL=info \
  --from-literal=SERVER_FRONTEND="https://$BASE_URL" \
  --from-literal=SOAM_PUBLIC_KEY="$SOAM_PUBLIC_KEY" \
  --from-literal=SOAM_CLIENT_ID="$SOAM_CLIENT_ID" \
  --from-literal=SOAM_CLIENT_SECRET="$SOAM_CLIENT_SECRET" \
  --from-literal=SOAM_URL="https://soam-$ENV.apps.silver.devops.gov.bc.ca" \
  --from-literal=SOAM_DISCOVERY="https://soam-$ENV.apps.silver.devops.gov.bc.ca/auth/realms/master/.well-known/openid-configuration" \
  --from-literal=IDIR_IDP_HINT=keycloak_bcdevexchange_idir \
  --from-literal=SITEMINDER_LOGOUT_ENDPOINT="$SITEMINDER_LOGOUT_ENDPOINT" \
  --from-literal=ISSUER=GRAD_ADMIN_APPLICATION \
  --from-literal=SESSION_MAX_AGE='1800000' \
  --from-literal=TOKEN_EXPIRES_IN='1800000' \
  --from-literal=UI_PUBLIC_KEY="$UI_PUBLIC_KEY" \
  --from-literal=UI_PRIVATE_KEY="$UI_PRIVATE_KEY" \
  --from-literal=GRAD_ROLE_ADMIN=GRAD_SYSTEM_COORDINATOR \
  --from-literal=GRAD_PROGRAM_AREA_BA=GRAD_PROGRAM_AREA_BA \
  --from-literal=GRAD_ROLE_INFO_OFFICER=GRAD_INFO_OFFICER \
  --from-literal=REDIS_HOST=redis \
  --from-literal=REDIS_PORT=6379 \
  --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" \
  --from-literal=BATCH_API_URL="http://educ-grad-batch-graduation-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=STUDENT_GRADUATION_API_URL="http://educ-grad-student-graduation-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=GRADUATION_API_URL="http://educ-grad-graduation-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=COURSE_API_URL="http://educ-grad-course-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=GRAD_STUDENT_API_URL="http://educ-grad-student-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=PROGRAM_API_URL="http://educ-grad-program-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=DISTRIBUTION_API_URL="http://educ-grad-distribution-api.e8a97a-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=ASSESSMENT_API_URL="http://educ-grad-assessment-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=GRADUATION_REPORT_API_URL="http://educ-grad-graduation-report-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=GRAD_REPORT_API_URL="http://educ-grad-report-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --from-literal=GRAD_TRAX_API_URL="http://educ-grad-trax-api.77c02f-$ENV.svc.cluster.local:8080/api/v1" \
  --dry-run=client -o yaml | oc apply -f -

echo Creating config map "$APP_NAME"-flb-sc-config-map
oc create -n "$OPENSHIFT_NAMESPACE" configmap "$APP_NAME"-flb-sc-config-map \
  --from-literal=fluent-bit.conf="$FLB_CONFIG" \
  --from-literal=parsers.conf="$PARSER_CONFIG" \
  --dry-run=client -o yaml | oc apply -f -
