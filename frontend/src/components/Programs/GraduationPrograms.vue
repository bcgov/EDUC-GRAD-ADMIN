<template>
  <div id="graduation-programs">
    <div v-if="!selectedProgramCode">
      <DisplayTable
        v-bind:items="graduationPrograms"
        title="Program"
        v-bind:fields="graduationProgramsFields"
        id="programCode"
        showFilter="true"
        v-bind:role="roles"
        pagination="true"
      >
        <template #cell(effectiveDate)="row">
          {{ $filters.formatSimpleDate(row.item.effectiveDate) }}
        </template>
        <template #cell(expiryDate)="row">
          {{ $filters.formatSimpleDate(row.item.expiryDate) }}
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
  computed: {
    ...mapGetters("auth", ["roles"]),
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
          field: "programCode",
        },
      ],
      graduationProgramsFields: [
        {
          key: "programCode",
          label: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "programName",
          label: "Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "associatedCredential",
          label: "Associated Credential",
          sortable: true,
          sortDirection: "desc",
          editable: true,
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
