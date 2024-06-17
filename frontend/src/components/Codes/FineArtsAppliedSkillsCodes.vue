<template>
  <div>
    <p>A list of Fine Arts Applied Skills Codes maintained in this table.</p>
    {{fineArtsAppliedSkillsTypes}}
    <DisplayTable
        title="Fine Arts Applied Skills Codes"
        v-bind:items="fineArtsAppliedSkillsTypes"
        v-bind:fields="fineArtsAppliedSkillsTypesFields"
        id=""
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
import CourseService from "@/services/CourseService";

export default {
  name: "FineArtsAppliedSkillsTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    CourseService.getFineArtsAppliedSkillsTypes()
        .then((response) => {
          this.fineArtsAppliedSkillsTypes = response.data;
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
      fineArtsAppliedSkillsTypes: [],
      fineArtsAppliedSkillsTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
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
