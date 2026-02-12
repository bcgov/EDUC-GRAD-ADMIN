<template>
  <v-container>
    <!-- Editable Signature Name -->
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
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Editable Organization Name -->
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
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Single Signature Preview - shows current or newly uploaded -->
    <v-row v-if="displayImagePreview">
      <v-col cols="12">
        <v-card class="pa-2" variant="outlined">
          <v-card-title class="text-subtitle-2">Signature Preview</v-card-title>
          <v-card-text>
            <v-img
                :src="displayImagePreview"
                max-height="200"
                contain
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upload New Signature Image -->
    <v-row>
      <v-col cols="12">
        <v-file-input
            v-model="signatureFile"
            label="Upload New Signature (Optional)"
            variant="outlined"
            density="comfortable"
            accept="image/png,image/jpeg,image/jpg"
            prepend-icon="mdi-camera"
            :rules="imageRules"
            @change="onFileChange"
            hint="Upload PNG or JPEG image (max 2MB) - Leave empty to keep current signature"
            persistent-hint
            clearable
        ></v-file-input>
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
      uploadedImagePreview: null, // Stores the newly uploaded image preview
      nameRules: [
        (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
      ],
      organizationRules: [
        (v) => (v && v.length <= 200) || "Organization name must be less than 200 characters",
      ],
      imageRules: [
        (v) => {
          // Image is optional in update mode (can keep existing)
          if (!v || v.length === 0) {
            return true; // No file selected is OK
          }
          const file = Array.isArray(v) ? v[0] : v;
          if (file.size > 2 * 1024 * 1024) {
            return "Image size must be less than 2MB";
          }
          if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            return "Only PNG and JPEG images are allowed";
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

    // Single preview that shows either uploaded image or existing image
    displayImagePreview() {
      // If user uploaded a new image, show that
      if (this.uploadedImagePreview) {
        return this.uploadedImagePreview;
      }
      // Otherwise, show the existing signature from the store
      if (this.localDigitalSignature.signatureContent) {
        return 'data:image/png;base64,' + this.localDigitalSignature.signatureContent;
      }
      return null;
    }
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files?.[0] || this.signatureFile?.[0];

      if (!file) {
        // File was cleared - revert to showing original image
        this.uploadedImagePreview = null;
        this.validateForm();
        return;
      }

      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        this.localDigitalSignature.hasValidationError = true;
        this.uploadedImagePreview = null;
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.localDigitalSignature.hasValidationError = true;
        this.uploadedImagePreview = null;
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store preview with full data URL for display
        this.uploadedImagePreview = e.target.result;

        // Extract base64 string (remove data:image/png;base64, prefix) for API
        const base64String = e.target.result.split(',')[1];
        this.localDigitalSignature.signatureContent = base64String;
        this.validateForm();
      };
      reader.onerror = () => {
        console.error("Error reading file");
        this.localDigitalSignature.hasValidationError = true;
        this.uploadedImagePreview = null;
      };
      reader.readAsDataURL(file);
    },
    validateForm() {
      // Check required fields (code is read-only so always valid)
      const hasName = !!this.localDigitalSignature.gradReportSignatureName;
      const hasOrganization = !!this.localDigitalSignature.gradReportSignatureOrganizationName;
      const hasImage = !!this.localDigitalSignature.signatureContent;

      // For update mode, all we need is name, organization, and existing/new image
      this.localDigitalSignature.hasValidationError = !(
          hasName &&
          hasOrganization &&
          hasImage
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