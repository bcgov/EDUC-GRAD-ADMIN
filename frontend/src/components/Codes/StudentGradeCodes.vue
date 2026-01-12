<template>
  <div>
    <div class="d-flex justify-space-between align-center ml-2 mt-5 mr-3 mb-6">
      <div>
        <h3>Student Grade Codes</h3>

      </div>
      <DownloadLink
        label="Download CSV"
        icon="mdi-download"
        :downloadAction="CodesService.downloadStudentGradeCodesCSV"
        @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
        @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
      />
    </div>
    <p class="ml-2">
      Student grade codes refer to a students' grade codes in the GRAD system.
    </p>
    <DisplayTable
      v-bind:items="studentGradeCodes"
      v-bind:fields="studentGradeCodesFields"
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
import DownloadLink from "@/components/Common/DownloadLink.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import {mapActions, mapState} from "pinia";
import { useAppStore } from "@/store/modules/app";
import CodesService from "@/services/CodesService.js";

export default {
  name: "GradeCodes",
  components: {
    DisplayTable: DisplayTable,
    DownloadLink: DownloadLink,
  },
  async beforeMount() {
    try {
      await this.getStudentGradeCodes(false);
    } catch (e) {
      if (e.response.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      CodesService: CodesService,
      studentGradeCodesFields: [
        {
          key: "studentGradeCode",
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
        {
          key: "expected",
          title: "Expected",
          sortable: true,
        },
        {
          key: "displayOrder",
          title: "Display Order",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, {
      studentGradeCodesData: "studentGradeCodes",
    }),
    studentGradeCodes() {
      return this.studentGradeCodesData || [];
    }
  },
  methods: {
    ...mapActions(useAppStore, ["getStudentGradeCodes"]),
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
