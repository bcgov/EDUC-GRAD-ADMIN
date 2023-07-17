import ApiService from '../common/apiService';

export default {
  downloadDISTRUNUSER(batchId, transmissionMode=null){
    if(transmissionMode){
      return ApiService.apiAxios.get('/api/v1/distribute/download/' + batchId + '?transmissionMode=' + transmissionMode);  
    }else{
      return ApiService.apiAxios.get('/api/v1/distribute/download/' + batchId);  
    }
    
  }
}