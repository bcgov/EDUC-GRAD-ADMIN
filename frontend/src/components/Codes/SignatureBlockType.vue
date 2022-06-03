<template>
  <div>
    <p>Signature block(s) used on students' certificates and transcript.</p>
  <DisplayTable
    title="Signature Block"
    v-bind:items="signatureBlock"
    v-bind:fields="signatureBlockFields"
    id=""
    showFilter="true"
  >
  </DisplayTable>
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import DisplayTable from "@/components/DisplayTable";
import GraduationCommonService from "@/services/GraduationCommonService.js";


export default {
  name: 'SignatureBlockType',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
      GraduationCommonService.getDigitalSignaturesBlockTypes(this.token)
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
  data: function() {
    return {
      signatureBlock: [],
      signatureBlockFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          label: "Signature Block",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
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
  computed: {
    ...mapGetters({  
      token: "auth/getToken",
      role: "getRoles"
    }),
  },
  methods: {
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
