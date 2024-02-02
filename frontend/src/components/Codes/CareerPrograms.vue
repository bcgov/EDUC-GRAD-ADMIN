<template>
  <div>
    <p>
      The optional program Career Program in GRAD can be broken down further by
      specific career program code. A Student on the optional program CP, Career
      Program, would also be assigned a Career Program code(s) to identify what
      career program(s) they are on.
    </p>
    <DisplayTable
      title="Career Programs"
      v-bind:items="sortedCareerPrograms"
      v-bind:fields="careerProgramFields"
      id="code"
      showFilter="true"
    >
      <template #cell(startDate)="row">
        {{ $filters.formatYYYYMMDate(row.item.startDate) }}
      </template>
      <template #cell(endDate)="row">
        {{ $filters.formatYYYYMMDate(row.item.endDate) }}
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
        this.sortedCareerPrograms = this.careerPrograms.sort(
          (a, b) => a.displayOrder - b.displayOrder
        );
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
      careerPrograms: [],
      sortedCareerPrograms: [],
      careerProgramFields: [
        {
          key: "displayOrder",
          label: "Display Order",
          sortable: true,
          sortDirection: "asc",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "code",
          label: "Code",
          sortable: true,
          class: "w-15",
        },
        {
          key: "description",
          label: "Program",
          sortable: true,
        },
        {
          key: "startDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "endDate",
          label: "Expiry Date",
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
