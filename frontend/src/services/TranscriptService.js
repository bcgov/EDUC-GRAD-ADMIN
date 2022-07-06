import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
});

export default {
    getTranscriptMessage(token) {
        const headers = { Accept: 'application/json','Content-Type': 'application/json', 'Authorization': 'Bearer '+ token }
        return apiClient.get('/api/v1/studentgraduation/transcript/gradmessages',{ headers })

    },
};