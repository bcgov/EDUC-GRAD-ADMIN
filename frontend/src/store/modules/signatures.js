import { defineStore } from "pinia";
import { useSnackbarStore } from "../../store/modules/snackbar";
import SignaturesService from "@/services/SignaturesService";

const initialState = () => ({
    digitalSignatures: [],
    digitalSignatureToSave: {
        signatureId: "",
        gradReportSignatureCode: "",
        gradReportSignatureName: "",
        gradReportSignatureOrganizationName: "",
        signatureContent: "",
        hasValidationError: true,
    }
});

export const useReportStore = defineStore("report", {
    namespaced: true,
    state: () => ({
        digitalSignatures: initialState().digitalSignatures,
        digitalSignatureToSave: initialState().digitalSignatureToSave
    }),
    getters: {
        getDigitalSignatures: (state) => state.digitalSignatures,
    },
    actions: {
        clearDigitalSignature() {
            this.$patch(state => {
                state.digitalSignatureToSave = { ...initialState().digitalSignatureToSave };
            });
        },

        // Create digital signature
       /* async createDigitalSignature(digitalSignature) {
            try {
                const response = await ReportService.createDigitalSignature(
                    this.toDigitalSignaturePayload(digitalSignature)
                );
                return response.data;
            } catch (error) {
                console.error("Error creating digital signature: ", error);
                return error;
            }
        },*/

        // Update digital signature
        async updateDigitalSignature(digitalSignature) {
            try {
                const response = await SignaturesService.updateDigitalSignature(
                    digitalSignature.gradReportSignatureCode,
                    this.toDigitalSignaturePayload(digitalSignature)
                );
                return response.data;
            } catch (error) {
                console.error("Error updating digital signature: ", error);
                return error;
            }
        },

        // Load all digital signatures
        async loadDigitalSignatures() {
            try {
                const response = await SignaturesService.getDigitalSignatures();
                this.digitalSignatures = response.data;
                return response.data;
            } catch (error) {
                console.error("Error fetching digital signatures: ", error);
                useSnackbarStore().showError("Failed to fetch digital signatures.");
                return error;
            }
        },

        // Transform to API payload format
        toDigitalSignaturePayload(digitalSignature) {
            return {
                gradReportSignatureCode: digitalSignature.gradReportSignatureCode,
                gradReportSignatureName: digitalSignature.gradReportSignatureName,
                gradReportSignatureOrganizationName: digitalSignature.gradReportSignatureOrganizationName,
                signatureContent: digitalSignature.signatureContent, // Base64 string
            };
        },
    },
});