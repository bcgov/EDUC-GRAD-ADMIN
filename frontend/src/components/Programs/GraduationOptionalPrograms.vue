<template>
  <div>
    <DisplayTable
      v-bind:items="graduationOptionalPrograms"
      title="Optional Programs"
      v-bind:fields="graduationOptionalProgramsFields"
      id="id"
      showFilter="true"
      isOptionalProgram="true"
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
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";
import { showNotification } from "../../utils/common.js";


export default {
  name: "GraduationOptionalProgram",
  props: {},
  computed: {
  },
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      opened: [],
      graduationOptionalPrograms: [],
      selectedProgramId: "",
      selectedId: "",
      graduationOptionalProgramsFields: [
        {
          key: "graduationProgramCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optProgramCode",
          title: "Optional Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optionalProgramName",
          title: "Optional Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "associatedCredential",
          title: "Associated Credential",
          sortable: true,
          sortDirection: "desc",
          editable: true,
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
  created() {
    this.showNotification = showNotification;
    ProgramManagementService.getOptionalPrograms()
      .then((response) => {
        this.graduationOptionalPrograms = response.data;
      })
      .catch(() => {
        this.showNotification(
          "danger",
          "There was an error with the web service."
        );
      });
  },
  methods: {
    onClickButton(id) {
      this.$emit("clicked", id);
    },
    resetProgramId() {
      this.selectedProgramId = "";
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
