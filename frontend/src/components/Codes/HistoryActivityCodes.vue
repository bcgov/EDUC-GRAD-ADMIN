<template>
  <div>
    <h3>History Activity Codes</h3>
    <p>
      Student history records are created by certain GRAD processes and User
      initiated activity. Each record will be associated with a history activity
      code.
    </p>
    <DisplayTable
      v-bind:items="historyActivityCode"
      v-bind:fields="historyActivityCodeFields"
      id="code"
      showFilter="true"
    >
      <template v-slot:item.effectiveDate="{ item }">
        {{ $filters.formatSimpleDate(item.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ $filters.formatSimpleDate(item.expiryDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "HistoryActivityCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    StudentService.getStudentHistoryActivityCode()
      .then((response) => {
        this.historyActivityCode = response.data;
      })
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      historyActivityCode: [],
      historyActivityCodeFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
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
