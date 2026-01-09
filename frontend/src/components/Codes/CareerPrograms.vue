<template>
  <div>
    <h3 class="ml-2 mt-5">Career Program Codes</h3>
    <p class="ml-2 w-66">
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
      <template v-slot:item.startDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.startDate) }}
      </template>
      <template v-slot:item.endDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.endDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: "CareerPrograms",
  components: {
    DisplayTable: DisplayTable,
  },
  async beforeMount() {
    try {
      await this.getCareerProgramCodes(false);
    } catch (e) {
      if (e.response?.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  computed: {
    ...mapState(useAppStore, {
      careerProgramOptions: "careerProgramOptions",
    }),
    careerPrograms() {
      return this.careerProgramOptions || [];
    }
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      careerProgramFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          class: "w-15",
        },
        {
          key: "description",
          title: "Program",
          sortable: true,
        },
        {
          key: "startDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "endDate",
          sortDirection: "asc",
          title: "Expiry Date",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    ...mapActions(useAppStore, ["getCareerProgramCodes"]),
  },
};
</script>

<style>
/* .table th,
.table td {
  border-top: none !important;
} */
</style>
