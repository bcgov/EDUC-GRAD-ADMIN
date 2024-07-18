<template>
  <div id="graduation-programs">
    <h3>Programs</h3>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <div v-if="!selectedProgramCode">
      <DisplayTable
        v-bind:items="graduationPrograms"
        v-bind:fields="graduationProgramsFields"
        id="programCode"
        showFilter="true"
        pagination="true"
      >
        <template v-slot:item.effectiveDate="{ item }">
          {{ $filters.formatSimpleDate(item.raw.effectiveDate) }}
        </template>
        <template v-slot:item.expiryDate="{ item }">
          {{ $filters.formatSimpleDate(item.raw.expiryDate) }}
        </template>
      </DisplayTable>
    </div>
    <router-view v-bind:key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";
import { showNotification } from "../../utils/common.js";
import { mapGetters } from "vuex";
export default {
  name: "GraduationPrograms",
  components: {
    DisplayTable: DisplayTable,
  },
  props: {},
  computed: {},
  data: function () {
    return {
      isLoading: true,
      show: false,
      isHidden: false,
      opened: [],
      graduationPrograms: [],
      templates: [
        {
          name: "programCode",
          field: "programCode",
        },
      ],
      graduationProgramsFields: [
        {
          key: "programCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "programName",
          title: "Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "associatedCredential",
          title: "Associated Credential",
          sortable: true,
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
      selectedProgramCode: "",
      selectedProgramId: "",
    };
  },
  created() {
    this.showNotification = showNotification;
    ProgramManagementService.getGraduationPrograms()
      .then((response) => {
        // filters out the "No Program" option until business is ready to implement
        const gradPrograms = response.data.filter((obj) => {
          return obj.programCode !== "NOPROG";
        });
        this.graduationPrograms = gradPrograms;
        this.isLoading = false;
      })
      .catch((error) => {
        this.showNotification(
          "danger",
          "There was an error: " + error.response
        );
      });
  },
  methods: {
    onClickChild(value) {
      this.selectedProgramId = value;
    },
    selectGradRule(programCode) {
      this.selectedProgramCode = programCode;
    },
    resetProgramCode() {
      this.selectedProgramCode = "";
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
