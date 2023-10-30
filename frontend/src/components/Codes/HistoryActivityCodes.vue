<template>
  <div>
    <p>
      Student history records are created by certain GRAD processes and User
      initiated activity. Each record will be associated with a history activity
      code.
    </p>
    <DisplayTable
      title="Program Certificate Transcripts"
      v-bind:items="historyActivityCode"
      v-bind:fields="historyActivityCodeFields"
      id="code"
      showFilter="true"
    >
      <template #cell(effectiveDate)="row">
        {{ $filters.formatSimpleDate(row.item.effectiveDate) }}
      </template>
      <template #cell(expiryDate)="row">
        {{ $filters.formatSimpleDate(row.item.expiryDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import StudentService from "@/services/StudentService.js";

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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      historyActivityCode: [],
      historyActivityCodeFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
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
