<template>
  <div>
    <p>A list of certificate types used by the GRAD system.</p>
  <DisplayTable
    title="Certificate Types"
    v-bind:items="certificateTypes"
    v-bind:fields="certificateTypesFields"
    id="code"
    showFilter="true"
  >
    <template #cell(effectiveDate)="row">
      {{ row.item.effectiveDate | formatSimpleDate }}
    </template>
    <template #cell(expiryDate)="row">
      {{ row.item.expiryDate | formatSimpleDate }}
    </template>
    <template #cell(language)="row">
        {{ row.item.language }}
    </template>
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
  name: 'CertificateTypes',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationCommonService.getCertificateTypes(this.token)
    .then((response) => {
    
      this.certificateTypes = response.data;
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
      certificateTypes: [],
      certificateTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-10"
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "language",
          label: "Language",
          sortable: true,
          class: "w-10",
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        }
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
