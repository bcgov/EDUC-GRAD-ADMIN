<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="localDigitalSignature.gradReportSignatureCode"
            label="Signature Code"
            variant="outlined"
            density="comfortable"
            :rules="codeRules"
            :readonly="update"
            @update:modelValue="validateForm"
            hint="Unique code identifier (e.g., SUPT, PRIN)"
            persistent-hint
            required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="localDigitalSignature.gradReportSignatureName"
            label="Signature Name"
            variant="outlined"
            density="comfortable"
            :rules="nameRules"
            @update:modelValue="validateForm"
            hint="Display name (e.g., Superintendent, Principal)"
            persistent-hint
            required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="localDigitalSignature.gradReportSignatureOrganizationName"
            label="Organization Name"
            variant="outlined"
            density="comfortable"
            :rules="organizationRules"
            @update:modelValue="validateForm"
            hint="Organization name (e.g., BC Ministry of Education)"
            persistent-hint
            required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-file-input
            v-model="signatureFile"
            label="Signature Image"
            variant="outlined"
            density="comfortable"
            accept="image/png,image/jpeg,image/jpg"
            prepend-icon="mdi-camera"
            :rules="imageRules"
            @change="onFileChange"
            hint="Upload PNG or JPEG image (max 2MB)"
            persistent-hint
            :required="!update"
        ></v-file-input>
      </v-col>
    </v-row>

    <v-row v-if="localDigitalSignature.signatureContent">
      <v-col cols="12">
        <v-card class="pa-2" variant="outlined">
          <v-card-title class="text-subtitle-2">Current Signature Preview</v-card-title>
          <v-card-text>
            <v-img
                :src="'data:image/png;base64,' + localDigitalSignature.signatureContent"
                max-height="200"
                contain
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useReportStore } from "@/store/modules/signatures.js";
import { mapState } from "pinia";

export default {
  name: "DigitalSignatureDetailsInput",
  props: {
    digitalSignature: {
      type: Object,
      required: true,
    },
    update: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      signatureFile: null,
      /*codeRules: [
        (v) => !!v || "Signature Code is required",
        (v) => (v && v.length <= 10) || "Code must be less than 10 characters",
        (v) => /^[A-Z0-9_-]+$/.test(v) || "Code must contain only uppercase letters, numbers, underscores, and hyphens",
      ],*/
      nameRules: [
        (v) => !!v || "Signature Name is required",
        (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
      ],
      organizationRules: [
        (v) => !!v || "Organization Name is required",
        (v) => (v && v.length <= 200) || "Organization name must be less than 200 characters",
      ],
      imageRules: [
        (v) => {
          if (!this.update && !v && !this.localDigitalSignature.signatureContent) {
            return "Signature image is required";
          }
          if (v && v.length > 0) {
            const file = Array.isArray(v) ? v[0] : v;
            if (file.size > 2 * 1024 * 1024) {
              return "Image size must be less than 2MB";
            }
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
              return "Only PNG and JPEG images are allowed";
            }
          }
          return true;
        },
      ],
    };
  },
  computed: {
    ...mapState(useReportStore, {
      localDigitalSignature: (state) => state.digitalSignatureToSave,
    }),
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files?.[0] || this.signatureFile?.[0];
      if (file) {
        // Validate file
        if (file.size > 2 * 1024 * 1024) {
          this.localDigitalSignature.hasValidationError = true;
          return;
        }
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
          this.localDigitalSignature.hasValidationError = true;
          return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onload = (e) => {
          // Extract base64 string (remove data:image/png;base64, prefix)
          const base64String = e.target.result.split(',')[1];
          this.localDigitalSignature.signatureContent = base64String;
          this.validateForm();
        };
        reader.onerror = () => {
          console.error("Error reading file");
          this.localDigitalSignature.hasValidationError = true;
        };
        reader.readAsDataURL(file);
      }
    },
    validateForm() {
      // Check all required fields
      ///const hasCode = !!this.localDigitalSignature.gradReportSignatureCode;
      const hasName = !!this.localDigitalSignature.gradReportSignatureName;
      const hasOrganization = !!this.localDigitalSignature.gradReportSignatureOrganizationName;
      const hasImage = !!this.localDigitalSignature.signatureContent;

      // Validate code format
      //const codeValid = /^[A-Z0-9_-]+$/.test(this.localDigitalSignature.gradReportSignatureCode || '');

      // For update, image is optional (can keep existing)
      // For create, image is required
      const imageValid = this.update ? true : hasImage;

      this.localDigitalSignature.hasValidationError = !(
          //hasCode &&
          hasName &&
          hasOrganization &&
          codeValid &&
          imageValid
      );
    },
  },
  mounted() {
    // Initial validation
    this.validateForm();
  },
};
</script>

<style scoped>
.v-text-field {
  margin-bottom: 8px;
}
</style>