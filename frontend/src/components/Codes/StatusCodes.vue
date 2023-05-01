<template>
  <div>
    <p>Student status codes refer to a students' status in the GRAD system.</p>
    <DisplayTable
      title="Status Codes"
      v-bind:items="studentStatusCodes"
      v-bind:fields="studentStatusCodesFields"
      id="code"
      showFilter="true"
    >
      <template #cell(effectiveDate)="row">
        {{ row.item.effectiveDate | formatSimpleDate }}
      </template>
      <template #cell(expiryDate)="row">
        {{ row.item.expiryDate | formatSimpleDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
import StudentService from "@/services/StudentService.js";

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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      studentStatusCodes: [],
      studentStatusCodesFields: [
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
