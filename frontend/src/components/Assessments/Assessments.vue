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
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: "Assessments",
  components: {
    DisplayTable: DisplayTable,
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
