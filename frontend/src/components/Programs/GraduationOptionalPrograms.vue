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
import DisplayTable from "../DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: "GraduationOptionalProgram",
  props: {},
  components: {
    DisplayTable: DisplayTable,
  },
  async beforeMount() {
    try {
      await this.getOptionalProgramCodes(false);
    } catch (e) {
      if (e.response?.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  computed: {
    ...mapState(useAppStore, {
      graduationOptionalPrograms: "optionalProgramOptions",
    }),
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      opened: [],
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
  methods: {
    ...mapActions(useAppStore, ["getOptionalProgramCodes"]),
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
