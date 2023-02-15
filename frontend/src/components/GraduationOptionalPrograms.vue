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
        {{ row.item.effectiveDate | formatSimpleDate }}
      </template>
      <template #cell(expiryDate)="row">
        {{ row.item.expiryDate | formatSimpleDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "@/components/DisplayTable";
import sharedMethods from "../sharedMethods";
import { mapGetters } from "vuex";

export default {
  name: "GraduationOptionalProgram",
  props: {},
  computed: {
    ...mapGetters({}),
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
          label: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optProgramCode",
          label: "Optional Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optionalProgramName",
          label: "Optional Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "associatedCredential",
          label: "Associated Credential",
          sortable: true,
          sortDirection: "desc",
          editable: true,
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
  created() {
    this.showNotification = sharedMethods.showNotification;
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
