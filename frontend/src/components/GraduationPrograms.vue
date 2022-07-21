<template>
  <div>
    <div v-if="!selectedProgramCode">
      <DisplayTable v-bind:items="graduationPrograms" title="Program" v-bind:fields="graduationProgramsFields" id="programCode" showFilter="true"
        v-bind:role="roles" pagination="true">
        <template #cell(effectiveDate)="row">
            {{ row.item.effectiveDate | formatSimpleDate }}
        </template>
        <template #cell(expiryDate)="row">
            {{ row.item.expiryDate | formatSimpleDate }}
        </template>
        <template #cell(assessmentReleaseDate)="row">
          {{ row.item.assessmentReleaseDate | formatSimpleDate }}
        </template>
      </DisplayTable>
    </div>
    <router-view v-bind:key="$route.fullPath"></router-view>    
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "@/components/DisplayTable";
import sharedMethods from '../sharedMethods';
import { mapGetters } from "vuex";
export default {
  name: "GraduationPrograms",
  components: {
     DisplayTable: DisplayTable,
  },
  props: {},
  computed: {
    ...mapGetters('auth', ['roles'])
  },
  data: function () {
    return {   
      show: false,
      isHidden: false,
      opened: [],
      graduationPrograms: [],
      templates: [
        {
          name: "programCode",
          field: "programCode"
        }
      ],
      graduationProgramsFields: [
        {
          key: 'programCode',
          label: 'Program code',
          sortable: true,
          sortDirection: 'desc',
          editable: true,
        },
        {
          key: 'programName',
          label: 'Program name',
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: 'associatedCredential',
          label: 'Associated Credential',
          sortable: true,
          sortDirection: 'desc',
          editable: true,
        },   
        {
          key: 'assessmentReleaseDate',
          label: 'Do Not Report Assessments After Last Release Date',
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
      selectedProgramCode: "",
      selectedProgramId: "",
    };
  },
  created() {  
    this.showNotification = sharedMethods.showNotification 
    ProgramManagementService.getGraduationPrograms()
      .then((response) => {
        this.graduationPrograms = response.data;
      })
      .catch((error) => {
        this.showNotification("danger", "There was an error: "+ error.response);
      });    
  },
  methods: {
    onClickChild(value) {
      this.selectedProgramId = value;
    },
    selectGradRule(programCode) {
      this.selectedProgramCode = programCode;
    },
    resetProgramCode(){
      this.selectedProgramCode = '';
    },
    getCourseName: function (cid) {
      let result = "";
      this.courses.filter(function (n) {
        if (n.id === cid) {
          result = n.name;
          return result;
        }
      });
      return result;
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
