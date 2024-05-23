<template>
  <div>
    <h3>Signature Block</h3>
    <p>Signature block(s) used on students' certificates and transcript.</p>
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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
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
        // {
        //   key: "effectiveDate",
        //   label: "Effective date",
        //   sortable: true,
        // },
        // {
        //   key: "expiryDate",
        //   label: "Expiry date",
        //   sortable: true,
        // },
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
