<template>
  <div>
    <h3>Student Status Codes</h3>
    <p>Student status codes refer to a students' status in the GRAD system.</p>
    <DisplayTable
      v-bind:items="studentStatusCodes"
      v-bind:fields="studentStatusCodesFields"
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
  name: "StatusCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    StudentService.getStudentStatusCodes()
      .then((response) => {
        this.studentStatusCodes = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      studentStatusCodes: [],
      studentStatusCodesFields: [
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
  computed: {},
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
