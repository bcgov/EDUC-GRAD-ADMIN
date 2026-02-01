import ApiService from "../common/apiService";

export default {
    // Get all digital signatures
    getDigitalSignatures() {
        return ApiService.apiAxios.get("/api/reports/signatures");
    },

    // Create a new digital signature
    /*createDigitalSignature(json) {
        return ApiService.apiAxios.post("/api/reports/digitalSignature", json);
    },*/

    // Update an existing digital signature
    updateDigitalSignature(signatureId, json) {
        return ApiService.apiAxios.put(
            `/api/reports/digitalSignature/${signatureId}`,
            json
        );
    },


};