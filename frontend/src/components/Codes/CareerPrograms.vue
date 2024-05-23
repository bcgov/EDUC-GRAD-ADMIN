<template>
  <div>
    <h3>Career Program Codes</h3>
    <p>
      The optional program Career Program in GRAD can be broken down further by
      specific career program code. A Student on the optional program CP, Career
      Program, would also be assigned a Career Program code(s) to identify what
      career program(s) they are on.
    </p>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      title="Career Programs"
      v-bind:items="careerPrograms"
      v-bind:fields="careerProgramFields"
      id="code"
      showFilter="true"
    >
      <template v-slot:item.startDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.raw.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.raw.endDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import ProgramManagementService from "@/services/ProgramManagementService.js";

export default {
  name: "CareerPrograms",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    ProgramManagementService.getCareerPrograms()
      .then((response) => {
        this.careerPrograms = response.data;
        this.isLoading = false;
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
      isLoading: true,
      careerPrograms: [],
      careerProgramFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "description",
          title: "Program",
          sortable: true,
        },
        {
          key: "startDate",
          title: "Start Date",
          sortable: true,
        },
        {
          key: "endDate",
          title: "End Date",
          sortable: true,
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
