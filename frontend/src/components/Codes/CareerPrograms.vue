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
      v-bind:items="careerPrograms"
      v-bind:fields="careerProgramFields"
      id="code"
      showFilter="true"
    >
      <template #cell(startDate)="row">
        {{ row.item.startDate | formatYYYYMMDate }}
      </template>
      <template #cell(endDate)="row">
        {{ row.item.endDate | formatYYYYMMDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
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
      careerProgramFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "description",
          label: "Program",
          sortable: true,
        },
        {
          key: "startDate",
          label: "Start Date",
          sortable: true,
        },
        {
          key: "endDate",
          label: "End Date",
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
