<template>
  <div>
    <h3 class="ml-3 mt-5">Optional Programs</h3>
    <DisplayTable
      v-bind:items="graduationOptionalPrograms"
      v-bind:fields="graduationOptionalProgramsFields"
      id="id"
      showFilter="true"
      isOptionalProgram="true"
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
import CodesService from "@/services/CodesService.js";
import DisplayTable from "../DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";

export default {
  name: "GraduationOptionalProgram",
  props: {},
  computed: {},
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
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
    // IMPROVEMENT: get this from app store
    CodesService.getOptionalProgramCodes()
      .then((response) => {
        this.graduationOptionalPrograms = response.data;
      })
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
