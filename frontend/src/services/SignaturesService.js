import ApiService from "../common/apiService";

export default {
    // Get all digital signatures
    getDigitalSignatures() {
        return ApiService.apiAxios.get("/api/codes/signatures");
    },

    // Update an existing digital signature
    updateDigitalSignature(json) {
        return ApiService.apiAxios.post(
            "/api/codes/signatures/save",
            json
        );
    },


};