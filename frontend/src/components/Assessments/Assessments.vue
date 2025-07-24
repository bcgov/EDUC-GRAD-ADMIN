<template>
  <div>
    <h3 class="ml-3 mt-5">Assessments</h3>
    <DisplayTable
      v-if="assessments"
      v-bind:items="assessments"
      v-bind:fields="assessmentFields"
      id="assessmentCode"
      showFilter="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";
import {mapActions, mapState} from "pinia";
import {useAppStore} from "@/store/modules/app";

export default {
  name: "Assessments",
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    ...mapState(useAppStore, {assessmentTypeCodes: "assessmentTypeCodes"}),
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      assessments: [],
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
  created() {
    this.getAllAssessment();
  },
  methods: {
    ...mapActions(useAppStore, ['getAssessmentTypeCodes']),
    formatDate(date) {
      return this.$filters.formatSimpleDate(date);
    },
    async getAllAssessment() {
      try {
        await this.getAssessmentTypeCodes();
        this.assessments = Array.from(this.assessmentTypeCodes.values());
      } catch(error) {
        console.error("API error:", error);
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      }
    },
  },
};
</script>
