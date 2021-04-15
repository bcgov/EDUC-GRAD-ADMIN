echo "Loading deployment helpers"

def performUIDeploy(String hostRoute, String stageEnv, String projectEnv, String repoName, String appName, String jobName, String tag, String sourceEnv, String targetEnvironment, String appDomain, String frontendDCRaw, String minReplicasFE, String maxReplicasFE, String minCPUFE, String maxCPUFE, String minMemFE, String maxMemFE, String minReplicasBE, String maxReplicasBE, String minCPUBE, String maxCPUBE, String minMemBE, String maxMemBE, String targetEnv, String NAMESPACE, String commonNamespace, String caCert, String cert, String privateKey){
    script {
        if(caCert == ""){
            deployUIStage(hostRoute, stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, frontendDCRaw, minReplicasFE, maxReplicasFE, minCPUFE, maxCPUFE, minMemFE, maxMemFE, minReplicasBE, maxReplicasBE, minCPUBE, maxCPUBE, minMemBE, maxMemBE)
        }else{
            deployUIStageWithCerts(hostRoute, stageEnv, projectEnv, repoName, appName, jobName,  tag, sourceEnv, targetEnvironment, appDomain, frontendDCRaw, minReplicasFE, maxReplicasFE, minCPUFE, maxCPUFE, minMemFE, maxMemFE, minReplicasBE, maxReplicasBE, minCPUBE, maxCPUBE, minMemBE, maxMemBE, caCert, cert, privateKey)
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