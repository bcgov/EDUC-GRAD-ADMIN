import ApiService from '../common/apiService';

export default {
  downloadDISTRUNUSER(batchId){
    return ApiService.apiAxios.get('/api/v1/distribute/download/' + batchId);
  }
}