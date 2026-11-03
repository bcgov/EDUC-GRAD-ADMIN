<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          color="success"
          icon="mdi-pencil"
          density="compact"
          variant="text"
          @click="openUpdateDigitalSignatureDialog()"
          :disabled="!hasPermissions('CODES', 'updateDigitalSignature')"
        />
      </template>

      <v-card>
        <template v-slot:title>
          <v-row no-gutters>
            <div class="v-card-title">
              Edit Digital Signature
              {{ digitalSignatureToUpdate.gradReportSignatureCode }}
            </div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              variant="outlined"
              color="error"
              class="mt-2"
              @click="close"
            />
          </v-row>
        </template>
        <v-card-text>
          <v-form ref="digitalSignatureForm" v-model="isFormValid">
            <v-img
              :src="'data:image/png;base64, ' + signatureContent"
              max-height="150"
              class="mb-4"
            ></v-img>
            <v-file-input
              v-model="signatureFile"
              label="Replace Signature (PNG, max 1 MB)"
              accept="image/png"
              variant="outlined"
              density="comfortable"
              prepend-icon="mdi-draw"
              :rules="signatureFileRules"
              @update:modelValue="onSignatureFileSelected"
            ></v-file-input>
            <v-text-field
              v-model="signatureName"
              label="Signature Name"
              variant="outlined"
              density="comfortable"
              :rules="requiredColumnTextRules"
            ></v-text-field>
            <v-text-field
              v-model="organizationName"
              label="Organization"
              variant="outlined"
              density="comfortable"
              :rules="requiredColumnTextRules"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            class="text-none"
            density="default"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="bcGovBlue"
            variant="flat"
            class="text-none"
            density="default"
            @click="submitForm"
            :loading="isSaving"
            :disabled="!isFormValid || isSaving || signatureFileBeingRead !== null"
          >
            Save Digital Signature
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ReportService from "@/services/ReportService.js";
import { useAccessStore } from "@/store/modules/access";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";

const MAX_SIGNATURE_FILE_BYTES = 1024 * 1024;
// DIGITAL_SIGNATURE name and organization columns are VARCHAR2(64 BYTE)
const MAX_COLUMN_TEXT_BYTES = 64;

function getSelectedFile(files) {
  return Array.isArray(files) ? files[0] : files;
}

export default {
  name: "DigitalSignatureUpdateForm",
  props: {
    digitalSignatureToUpdate: {
      type: Object,
      required: true,
    },
  },
  emits: ["saved"],
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      dialog: false,
      isFormValid: false,
      isSaving: false,
      signatureName: "",
      organizationName: "",
      signatureContent: "",
      signatureFile: null,
      // set while FileReader loads the selected file, so Save can't send the previous image
      signatureFileBeingRead: null,
      signatureFileRules: [
        (files) => {
          const selectedFile = getSelectedFile(files);
          if (!selectedFile) {
            return true;
          }
          if (selectedFile.type !== "image/png") {
            return "Signature must be a PNG file";
          }
          return (
            selectedFile.size <= MAX_SIGNATURE_FILE_BYTES ||
            "Signature must be 1 MB or smaller"
          );
        },
      ],
      requiredColumnTextRules: [
        (value) => !!value?.trim() || "Required",
        (value) =>
          new TextEncoder().encode(value || "").length <=
            MAX_COLUMN_TEXT_BYTES ||
          `Must be ${MAX_COLUMN_TEXT_BYTES} bytes or fewer (accented and special characters count as 2 or more)`,
      ],
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
  methods: {
    async openUpdateDigitalSignatureDialog() {
      this.signatureName = this.digitalSignatureToUpdate.gradReportSignatureName;
      this.organizationName =
        this.digitalSignatureToUpdate.gradReportSignatureOrganizationName;
      this.signatureContent = this.digitalSignatureToUpdate.signatureContent;
      this.signatureFile = null;
      this.signatureFileBeingRead = null;
      this.dialog = true;
      // validate prefilled values so Save is enabled when only the image changes
      await this.$nextTick();
      this.$refs.digitalSignatureForm?.validate();
    },
    onSignatureFileSelected(files) {
      const selectedFile = getSelectedFile(files);
      // a new selection, or clearing the input, makes any read still in progress stale
      this.signatureFileBeingRead = null;
      if (!selectedFile) {
        this.signatureContent = this.digitalSignatureToUpdate.signatureContent;
        return;
      }
      if (
        selectedFile.type !== "image/png" ||
        selectedFile.size > MAX_SIGNATURE_FILE_BYTES
      ) {
        return;
      }
      this.signatureFileBeingRead = selectedFile;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (this.signatureFileBeingRead !== selectedFile) {
          return;
        }
        // strip the "data:image/png;base64," prefix; the API expects plain base64
        this.signatureContent = event.target.result.split(",")[1];
        this.signatureFileBeingRead = null;
      };
      reader.onerror = () => {
        if (this.signatureFileBeingRead !== selectedFile) {
          return;
        }
        this.signatureFileBeingRead = null;
        this.signatureFile = null;
        this.signatureContent = this.digitalSignatureToUpdate.signatureContent;
        this.snackbarStore.showSnackbar(
          "Could not read the signature file, please select it again",
          "error",
          10000
        );
      };
      reader.readAsDataURL(selectedFile);
    },
    async submitForm() {
      this.isSaving = true;
      try {
        await ReportService.saveDigitalSignature({
          signatureId: this.digitalSignatureToUpdate.signatureId,
          gradReportSignatureCode:
            this.digitalSignatureToUpdate.gradReportSignatureCode,
          gradReportSignatureName: this.signatureName.trim(),
          gradReportSignatureOrganizationName: this.organizationName.trim(),
          signatureContent: this.signatureContent,
        });
        this.snackbarStore.showSnackbar(
          "Digital Signature Updated",
          "success",
          10000
        );
        this.$emit("saved");
        this.close();
      } catch (error) {
        console.error("Error updating digital signature:", error);
        // only 400s carry the report API's validation messages; anything else is a raw server error
        const validationMessage =
          error.response?.status === 400 ? error.response.data?.message : null;
        this.snackbarStore.showSnackbar(
          validationMessage ||
            "Failed to update Digital Signature, please try again",
          "error",
          10000
        );
      } finally {
        this.isSaving = false;
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
