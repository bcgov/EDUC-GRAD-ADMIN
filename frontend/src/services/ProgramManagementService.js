import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
});

export default {
    getAlgorithmRules(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token };
        return apiClient.get('/api/v1/studentgraduation/algo/algorithm-rules',{ headers});
    },
    getLetterGrades(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/studentgraduation/lgSc/lettergrade',{ headers });
    },
    getSpecialCases(token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/studentgraduation/lgSc/specialcase',{ headers });
    },
    getGraduationPrograms(token) { 
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/programs',{ headers });
    },
    getProgramRules(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/allprogramrules',{ headers })
    },
    getProgramRule(programCode, token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/programrules?programCode=' + programCode,{ headers })
    },
    getAllOptionalProgramRules(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/alloptionalprogramrules',{ headers })
    },
    getOptionalPrograms(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/optionalprograms',{ headers })
    },
    
    //Program CRUD
    createProgram(program, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.post('/api/v1/program/programs',program,{ headers })
    },
    deleteProgram(id, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.delete('/api/v1/program/programs/' + id, { headers })
    },
    updateProgram(program, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.put('/api/v1/program/programs',program,{ headers })
    },   
    //Optional Programs CRUD
    createOptionalProgram(optionalProgram, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.post('/api/v1/program/optionalprograms',optionalProgram,{ headers })
    },
    deleteOptionalProgram(id, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.delete('/api/v1/program/optionalprograms/' + id, { headers })
    },
    updateSpecialProgram(optionalProgram, token){
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.put('/api/v1/program/optionalprograms',optionalProgram,{ headers })
    },    
    getCareerPrograms(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/careerprogram',{ headers });
    },
    getRequirementTypes(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json','Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/program/gradrequirementtype',{ headers });
    },      
};