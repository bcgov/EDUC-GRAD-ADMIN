<template>
  <div>
    <h3 class="ml-2 mt-5">Undo Completion Reasons</h3>
    <p class="ml-2 w-66">
      When a User performs the "Undo Completion" process (security permissions
      needed), the User must select an "Undo Completion" reason. The list of
      Undo Completion reasons are maintained in this table.
    </p>
    <v-data-table
      :items="ungradReasons"
      :headers="ungradReasonsFields"
      id=""
      showFilter="true"
    >
      <template v-slot:item.effectiveDate="{ item }">
        {{ $filters.formatSimpleDate(item.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ $filters.formatSimpleDate(item.expiryDate) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import StudentGraduationService from "@/services/StudentGraduationService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "Undo Completion Reasons",
  components: {},
  created() {
    StudentGraduationService.getUngradReasons()
      .then((response) => {
        this.ungradReasons = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      ungradReasons: [],
      ungradReasonsFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
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
