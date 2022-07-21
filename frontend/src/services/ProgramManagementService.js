import ApiService from '../common/apiService';

export default {
    getTranscriptMessage() {

        return ApiService.apiAxios.get('/api/v1/studentgraduation/transcript/gradmessages')
      },
    getAlgorithmRules() {
        return ApiService.apiAxios.get('/api/v1/studentgraduation/algo/algorithm-rules')
    },
    getLetterGrades() {
        return ApiService.apiAxios.get('/api/v1/studentgraduation/lgSc/lettergrade');
    },
    getSpecialCases(){
        return ApiService.apiAxios.get('/api/v1/studentgraduation/lgSc/specialcase');
    },
    getGraduationPrograms() { 
        return ApiService.apiAxios.get('/api/v1/program/programs');
    },
    getProgramRules() {
        return ApiService.apiAxios.get('/api/v1/program/allprogramrules')
    },
    getProgramRule(programCode) {
        return ApiService.apiAxios.get('/api/v1/program/programrules?programCode=' + programCode)
    },
    getAllOptionalProgramRules() {
        return ApiService.apiAxios.get('/api/v1/program/alloptionalprogramrules')
    },
    getOptionalPrograms() {
        return ApiService.apiAxios.get('/api/v1/program/optionalprograms')
    },
    getRequirementTypes() {
         return ApiService.apiAxios.get('/api/v1/program/gradrequirementtype')
    },  
    getCareerPrograms() {
        return ApiService.apiAxios.get('/api/v1/program/careerprogram')
    },
    // //Program CRUD
    // createProgram(program, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.post('/api/v1/program/programs',program,{ headers })
    // },
    // deleteProgram(id, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.delete('/api/v1/program/programs/' + id, { headers })
    // },
    // updateProgram(program, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.put('/api/v1/program/programs',program,{ headers })
    // },   
    // //Optional Programs CRUD
    // createOptionalProgram(optionalProgram, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.post('/api/v1/program/optionalprograms',optionalProgram,{ headers })
    // },
    // deleteOptionalProgram(id, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.delete('/api/v1/program/optionalprograms/' + id, { headers })
    // },
    // updateSpecialProgram(optionalProgram, token){
    //     const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    //     return apiClient.put('/api/v1/program/optionalprograms',optionalProgram,{ headers })
    // },    
  
    
};