<template>
  <div>
    <p>Requirement type codes support how the algorithm runs program rules and optional program rules.</p>
    <DisplayTable
      title="Requirement Types"
      v-bind:items="requirementTypes"
      v-bind:fields="requirementTypesFields"
      id="code"
      showFilter="true"
    >
      <template #cell(effectiveDate)="row">
        {{ row.item.effectiveDate | formatSimpleDate }}
      </template>
      <template #cell(expiryDate)="row">
        {{ row.item.expiryDate | formatSimpleDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import DisplayTable from "@/components/DisplayTable";
import ProgramManagementService from "@/services/ProgramManagementService.js";


export default {
  name: 'RequirementTypes',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
        ProgramManagementService.getRequirementTypes(this.token)
        .then((response) => {
        
          this.requirementTypes = response.data;
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
      requirementTypes: [],
      requirementTypesFields: [
        {
          key: "reqTypeCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15"
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
