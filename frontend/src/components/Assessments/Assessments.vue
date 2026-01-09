<template>
  <div>
    <div class="d-flex justify-space-between align-center ml-3 mt-5 mr-3 mb-6">
      <h3 class="my-0">Assessments</h3>
      <DownloadLink
        label="Download CSV"
        icon="mdi-download"
        :downloadAction="StudentAssessmentService.downloadAssessmentTypeCodesCSV"
        @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
        @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
      />
    </div>
    <DisplayTable
      v-if="assessments"
      v-bind:items="assessments"
      v-bind:fields="assessmentFields"
      id="assessmentCode"
      showFilter="true"
      class="pt-16"
    >
    </DisplayTable>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";
import DownloadLink from "@/components/Common/DownloadLink.vue";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";

export default {
  name: "Assessments",
  components: {
    DisplayTable: DisplayTable,
    DownloadLink: DownloadLink,
  },
  async beforeMount() {
    try {
      await this.getAssessmentTypeCodes(false);
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
      assessmentTypeCodes: "assessmentTypeCodes",
    }),
    assessments() {
      return this.assessmentTypeCodes || [];
    }
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      StudentAssessmentService: StudentAssessmentService,
      assessmentFields: [
        {
          key: "assessmentTypeCode",
          title: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Assessment Name",
          sortable: true,
          class: "w-40",
        },
        {
          key: "language",
          title: "Language",
          sortable: true,
          class: "w-5 text-center",
        },
        {
          key: "effectiveDate",
          title: "Start Date",
          sortable: true,
          class: "w-20",
          value: (item) => this.formatDate(item.effectiveDate)
        },
        {
          key: "expiryDate",
          title: "End Date",
          sortable: true,
          class: "w-20",
          value: (item) => this.formatDate(item.expiryDate)
        },
      ],
    };
  },
  methods: {
    ...mapActions(useAppStore, ["getAssessmentTypeCodes"]),
    formatDate(date) {
      return this.$filters.formatSimpleDate(date);
    },
  },
};
</script>
