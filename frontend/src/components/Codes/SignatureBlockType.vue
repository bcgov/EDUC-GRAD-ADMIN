<template>
  <div>
    <h3 class="ml-2 mt-5">Signature Block</h3>
    <p class="ml-2 w-66">
      Signature block(s) used on students' certificates and transcript.
    </p>
    <DisplayTable
      v-bind:items="signatureBlock"
      v-bind:fields="signatureBlockFields"
      id=""
      showFilter="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "SignatureBlockType",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getDigitalSignaturesBlockTypes()
      .then((response) => {
        this.signatureBlock = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      signatureBlock: [],
      signatureBlockFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          title: "Signature Block",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
      ],
    };
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
