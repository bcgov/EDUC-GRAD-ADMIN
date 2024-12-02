###########################################################
#ENV VARS
###########################################################
envValue=$1
APP_NAME=$2
GRAD_NAMESPACE=$3
HOST_ROUTE=$4

###########################################################
#Setup for config-maps
###########################################################
echo Creating config map "$APP_NAME"-config-map
oc create -n "$GRAD_NAMESPACE"-"$envValue" configmap "$APP_NAME"-config-map \
  --from-literal=EDUC_HELLO="Hello world" \
  --from-literal=VUE_APP_TRAX_API_HOST="http://educ-grad-trax-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_BATCH_GRADUATION_API_HOST="http://educ-grad-batch-graduation-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_EDUC_GRAD_VERSION="v1.7.0" \
  --from-literal=VUE_APP_STUDENT_GRADUATION_API_HOST="http://educ-grad-student-graduation-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=TZ="America/Vancouver" \
  --from-literal=VUE_APP_GRADUATION_API_HOST="http://educ-grad-graduation-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_KEYCLOAK_AUTH_HOST="https://soam-dev.apps.silver.devops.gov.bc.ca" \
  --from-literal=EDUC_GRAD_ENV="DEV" \
  --from-literal=HOST_ROUTE="$HOST_ROUTE" \
  --from-literal=VUE_APP_ASSESSMENT_API_HOST="http://educ-grad-assessment-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=config.js="var config=(function(){return{VUE_APP_BASE_URL=\"https://dev.grad.gov.bc.ca\"};})();" \
  --from-literal=VUE_APP_BASE_URL="$HOST_ROUTE" \
  --from-literal=EDUC_GRAD_VERSION="v1.7.0" \
  --from-literal=VUE_APP_COURSE_API_HOST="http://educ-grad-course-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_STUDENTS_API_HOST="http://educ-grad-student-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_GRADUATION_REPORT_API_HOST="http://educ-grad-graduation-report-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_GRAD_REPORT_API_HOST="http://educ-grad-report-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --from-literal=VUE_APP_PROGRAM_API_HOST="http://educ-grad-program-api.$GRAD_NAMESPACE.svc.cluster.local:8080" \
  --dry-run=client -o yaml | oc apply -f -

