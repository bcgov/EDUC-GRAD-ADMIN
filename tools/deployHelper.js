echo "Loading deployment helpers"

def performUIDeploy(String hostRoute, String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String frontendDCRaw, String backendDCRaw, String minReplicasFE, String maxReplicasFE, String minCPUFE, String maxCPUFE, String minMemFE, String maxMemFE, String minReplicasBE, String maxReplicasBE, String minCPUBE, String maxCPUBE, String minMemBE, String maxMemBE, String targetEnv, String NAMESPACE, String commonNamespace, String caCert, String cert, String privateKey){
    script {
        if(caCert == ""){
            deployUIStage(hostRoute, stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, frontendDCRaw, backendDCRaw, minReplicasFE, maxReplicasFE, minCPUFE, maxCPUFE, minMemFE, maxMemFE, minReplicasBE, maxReplicasBE, minCPUBE, maxCPUBE, minMemBE, maxMemBE)
        }else{
            deployUIStageWithCerts(hostRoute, stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, frontendDCRaw, backendDCRaw, minReplicasFE, maxReplicasFE, minCPUFE, maxCPUFE, minMemFE, maxMemFE, minReplicasBE, maxReplicasBE, minCPUBE, maxCPUBE, minMemBE, maxMemBE, caCert, cert, privateKey)
        }
        
    }
    script{
      
      openshift.withCluster() {
        openshift.withProject("${projectEnv}") {
        

          def dcAppFE = openshift.selector('dc', "${appName}-frontend-${jobName}")
          dcAppFE.rollout().cancel()
          timeout(10) {
            try{
              dcAppFE.rollout().status('--watch=true')
            }catch(Exception e){
              //Do nothing
            }
          }
          dcAppFE.rollout().latest()
        }
      }
    }
}


def deployStage(String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURL, String minReplicas, String maxReplicas, String minCPU, String maxCPU, String minMem, String maxMem, String targetEnv) {
  openshift.withCluster() {
   openshift.withProject(projectEnv) {
     echo "Tagging ${appName} image with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-${jobName}:${tag}", "${repoName}-${jobName}:${tag}")
     def dcTemplate = openshift.process('-f',
       "${rawApiDcURL}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${appName}-${targetEnvironment}.${appDomain}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicas}",
       "MAX_REPLICAS=${maxReplicas}",
       "MIN_CPU=${minCPU}",
       "MAX_CPU=${maxCPU}",
       "MIN_MEM=${minMem}",
       "MAX_MEM=${maxMem}",
       "ENV=${targetEnv}"
     )

     echo "Applying Deployment for ${appName}"
     def dc = openshift.apply(dcTemplate).narrow('dc')
   }
  }
}

def deployStageNoEnv(String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURL, String minReplicas, String maxReplicas, String minCPU, String maxCPU, String minMem, String maxMem) {
  openshift.withCluster() {
   openshift.withProject(projectEnv) {
     echo "Tagging ${appName} image with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-${jobName}:${tag}", "${repoName}-${jobName}:${tag}")
     def dcTemplate = openshift.process('-f',
       "${rawApiDcURL}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${appName}-${targetEnvironment}.${appDomain}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicas}",
       "MAX_REPLICAS=${maxReplicas}",
       "MIN_CPU=${minCPU}",
       "MAX_CPU=${maxCPU}",
       "MIN_MEM=${minMem}",
       "MAX_MEM=${maxMem}"
     )

     echo "Applying Deployment for ${appName}"
     def dc = openshift.apply(dcTemplate).narrow('dc')
   }
  }
}

def deployUIStage(String hostRoute, String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURLFrontend, String rawApiDcURLBackend, String minReplicasFE, String maxReplicasFE, String minCPUFE, String maxCPUFE, String minMemFE, String maxMemFE, String minReplicasBE, String maxReplicasBE, String minCPUBE, String maxCPUBE, String minMemBE, String maxMemBE) {
  openshift.withCluster() {
   openshift.withProject(projectEnv) {
     echo "Tagging Image ${repoName}-backend:${jobName} with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-backend:${tag}", "${repoName}-backend:${tag}")

     echo "Tagging Image ${repoName}-frontend-static:${jobName} with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-frontend-static:${tag}", "${repoName}-frontend-static:${tag}")

     echo "Processing DeploymentConfig ${appName}-backend..."
     def dcBackendTemplate = openshift.process('-f',
       "${rawApiDcURLBackend}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${hostRoute}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicasBE}",
       "MAX_REPLICAS=${maxReplicasBE}",
       "MIN_CPU=${minCPUBE}",
       "MAX_CPU=${maxCPUBE}",
       "MIN_MEM=${minMemBE}",
       "MAX_MEM=${maxMemBE}"
     )

     def dcBackend = openshift.apply(dcBackendTemplate).narrow('dc')

     echo "Processing DeploymentConfig ${appName}-frontend-static..."
     def dcFrontendStaticTemplate = openshift.process('-f',
       "${rawApiDcURLFrontend}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${hostRoute}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicasFE}",
       "MAX_REPLICAS=${maxReplicasFE}",
       "MIN_CPU=${minCPUFE}",
       "MAX_CPU=${maxCPUFE}",
       "MIN_MEM=${minMemFE}",
       "MAX_MEM=${maxMemFE}"
     )

     echo "Applying Deployment ${appName}-frontend-static..."
     def dcFrontendStatic = openshift.apply(dcFrontendStaticTemplate).narrow('dc')
   }
  }
}

def deployUIStageWithCerts(String hostRoute, String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURLFrontend, String rawApiDcURLBackend, String minReplicasFE, String maxReplicasFE, String minCPUFE, String maxCPUFE, String minMemFE, String maxMemFE, String minReplicasBE, String maxReplicasBE, String minCPUBE, String maxCPUBE, String minMemBE, String maxMemBE, String caCert, String cert, String privateKey) {
  openshift.withCluster() {
   openshift.withProject(projectEnv) {
     echo "Tagging Image ${repoName}-backend:${jobName} with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-backend:${tag}", "${repoName}-backend:${tag}")

     echo "Tagging Image ${repoName}-frontend-static:${jobName} with version ${tag}"
     openshift.tag("${sourceEnv}/${repoName}-frontend-static:${tag}", "${repoName}-frontend-static:${tag}")

     echo "Processing DeploymentConfig ${appName}-backend..."
     def dcBackendTemplate = openshift.process('-f',
       "${rawApiDcURLBackend}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${hostRoute}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicasBE}",
       "MAX_REPLICAS=${maxReplicasBE}",
       "MIN_CPU=${minCPUBE}",
       "MAX_CPU=${maxCPUBE}",
       "MIN_MEM=${minMemBE}",
       "MAX_MEM=${maxMemBE}"
     )

     def dcBackend = openshift.apply(dcBackendTemplate).narrow('dc')

     echo "Processing DeploymentConfig ${appName}-frontend-static..."
     def dcFrontendStaticTemplate = openshift.process('-f',
       "${rawApiDcURLFrontend}",
       "REPO_NAME=${repoName}",
       "JOB_NAME=${jobName}",
       "NAMESPACE=${projectEnv}",
       "APP_NAME=${appName}",
       "HOST_ROUTE=${hostRoute}",
       "TAG=${tag}",
       "MIN_REPLICAS=${minReplicasFE}",
       "MAX_REPLICAS=${maxReplicasFE}",
       "MIN_CPU=${minCPUFE}",
       "MAX_CPU=${maxCPUFE}",
       "MIN_MEM=${minMemFE}",
       "MAX_MEM=${maxMemFE}",
       "CA_CERT=${caCert}",
       "CERTIFICATE=${cert}",
       "PRIVATE_KEY=${privateKey}"
     )

     echo "Applying Deployment ${appName}-frontend-static..."
     def dcFrontendStatic = openshift.apply(dcFrontendStaticTemplate).narrow('dc')
   }
  }
}









def waitForWorkflowRunComplete(String token) {
  sleep(15)
  def latestRunId = getLatestWorkflowRun(token)
  if(!latestRunId) {
    error('No workflow run in Github Actions. Aborting the build!')
  } else {
    def count = 60  //timeout (60 * 10) seconds = 10 minutes
    def status, conclusion
    while(count-- > 0 && status != 'completed') {
      (status, conclusion) = getWorkflowRunById(token, latestRunId)
      if(status != 'completed') {
        echo "Waiting for workflow run complete: ${count}"
        sleep(10)
      }
    }

    if(status == 'completed' && conclusion != 'success') {
      error("Workflow run was ${conclusion}. Aborting the build!")
    } else if(count <= 0) {
      error('Workflow run query timed out. Aborting the build!')
    }
  }
}
def performPenRegApiDeploy(String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURL, String minReplicas, String maxReplicas, String minCPU, String maxCPU, String minMem, String maxMem, String targetEnv, String NAMESPACE, String commonNamespace){
    script{
        deployStageNoEnv(stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, rawApiDcURL, minReplicas, maxReplicas, minCPU, maxCPU, minMem, maxMem)
        dir('tools/jenkins'){
            sh "curl https://raw.githubusercontent.com/bcgov/EDUC-INFRA-COMMON/master/openshift/common-deployment/download-kc.sh | bash /dev/stdin \"${NAMESPACE}\""
        }
    }
    configMapSetup("${appName}","${appName}".toUpperCase(), NAMESPACE, "${targetEnv}", "${sourceEnv}");
    script{
      dir('tools/jenkins'){
        sh "curl https://raw.githubusercontent.com/bcgov/${repoName}/master/tools/jenkins/update-configmap.sh | bash /dev/stdin \"${targetEnv}\" \"${appName}\" \"${NAMESPACE}\" \"${commonNamespace}\""
      }
    }
    performStandardRollout(appName, projectEnv, jobName)
}

 def performPenServicesApiDeploy(String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String rawApiDcURL, String minReplicas, String maxReplicas, String minCPU, String maxCPU, String minMem, String maxMem, String targetEnv, String NAMESPACE, String commonNamespace){
   script{
     deployStageNoEnv(stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, rawApiDcURL, minReplicas, maxReplicas, minCPU, maxCPU, minMem, maxMem)
     dir('tools/jenkins'){
       sh "curl https://raw.githubusercontent.com/bcgov/EDUC-INFRA-COMMON/master/openshift/common-deployment/download-kc.sh | bash /dev/stdin \"${NAMESPACE}\""
     }
   }
   configMapSetup("${appName}","${appName}".toUpperCase(), NAMESPACE, "${targetEnv}", "${sourceEnv}");
   script{
     dir('tools/jenkins'){
       sh "curl https://raw.githubusercontent.com/bcgov/${repoName}/master/tools/jenkins/update-configmap.sh | bash /dev/stdin \"${targetEnv}\" \"${appName}\" \"${NAMESPACE}\" \"${commonNamespace}\""
     }
   }
   performStandardRollout(appName, projectEnv, jobName)
 }

return this;