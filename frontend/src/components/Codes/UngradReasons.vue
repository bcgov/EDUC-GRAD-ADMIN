<template>
  <div>
    <h3>Undo Completion Reasons</h3>
    <p>
      When a User performs the "Undo Completion" process (security permissions
      needed), the User must select an "Undo Completion" reason. The list of
      Undo Completion reasons are maintained in this table.
    </p>
    <DisplayTable
      v-bind:items="ungradReasons"
      v-bind:fields="ungradReasonsFields"
      id=""
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

export default {
  name: "UngradReasons",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    StudentService.getUngradReasons()
      .then((response) => {
        this.ungradReasons = response.data;
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
