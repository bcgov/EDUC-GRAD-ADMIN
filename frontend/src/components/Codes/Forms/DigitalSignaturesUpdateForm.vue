<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="800">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-bind="props" color="success" icon="mdi-pencil" density="compact" variant="text"
                 @click="openUpdateDigitalSignatureDialog()" :disabled="!hasPermissions('DIGITALSIGNATURES', 'signatureUpdate')"/>
        </slot>
      </template>

      <v-card>
        <template v-slot:title>
          <v-row no-gutters>
            <div class="v-card-title">Edit Digital Signature</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
                   @click="close" />
          </v-row>
        </template>
        <v-card-text>
          <DigitalSignatureDetailsInput :digitalSignature="selectedDigitalSignature" update />
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="bcGovBlue" variant="flat" class="text-none" density="default" @click="submitForm"
                 :disabled="selectedDigitalSignature.hasValidationError">
            Save Digital Signature
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import DigitalSignatureDetailsInput from "@/components/Codes/Forms/FormInputs/DigitalSignatureDetailsInput.vue";
import { useAccessStore } from "@/store/modules/access";
import { useReportStore } from "@/store/modules/signatures.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { toRaw } from "vue";

export default {
  name: "DigitalSignaturesUpdateForm",
  components: { DigitalSignatureDetailsInput },
  props: {
    selectedDigitalSignatureToUpdate: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    return {
      dialog,
    };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useReportStore, {
      selectedDigitalSignature: (state) => state.digitalSignatureToSave,
    })
  },
  methods: {
    ...mapActions(useReportStore, [
      "clearDigitalSignature",
      "updateDigitalSignature",
      "loadDigitalSignatures"
    ]),
    openUpdateDigitalSignatureDialog() {
      this.dialog = true;
      this.updateSelectedDigitalSignature(this.selectedDigitalSignatureToUpdate);
    },
    async submitForm() {
      const updateDigitalSignatureRequestBody = toRaw(this.selectedDigitalSignature);
      try {
        // Call API and get response
        await this.updateDigitalSignature(updateDigitalSignatureRequestBody).then((response) => {
          if (response?.signatureId) {
            this.loadDigitalSignatures();
            this.snackbarStore.showSnackbar("Digital Signature Updated", "success", 10000);
          } else {
            this.snackbarStore.showSnackbar("Failed to update Digital Signature", "error", 10000);
          }
        });
      } catch (error) {
        console.error("Error updating digital signature:", error);
        this.snackbarStore.showSnackbar("Failed to update Digital Signature", "error", 10000);
      }
      this.close();
    },
    close() {
      this.dialog = false;
      this.clearDigitalSignature();
    },
    updateSelectedDigitalSignature(digitalSignatureToUpdate) {
      //this.selectedDigitalSignature.signatureId = digitalSignatureToUpdate.signatureId;
      //this.selectedDigitalSignature.gradReportSignatureCode = digitalSignatureToUpdate.gradReportSignatureCode;
      this.selectedDigitalSignature.gradReportSignatureName = digitalSignatureToUpdate.gradReportSignatureName;
      this.selectedDigitalSignature.gradReportSignatureOrganizationName = digitalSignatureToUpdate.gradReportSignatureOrganizationName;
      this.selectedDigitalSignature.signatureContent = digitalSignatureToUpdate.signatureContent;
      this.selectedDigitalSignature.hasValidationError = false; // Set to false initially, form will validate
    },
  },
};
</script>