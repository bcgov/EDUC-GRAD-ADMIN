<template>
  <v-card class="p-3">
    <v-overlay
      v-model="batchLoading"
      class="align-center justify-center"
      contained
    >
      <v-progress-circular
        v-if="batchLoading"
        indeterminate
        color="primary"
        size="64"
      >
      </v-progress-circular>
    </v-overlay>
    <div class="d-flex justify-space-between align-center">
      <v-card-title> Batch Job #{{ selectedErrorId }} Error(s) </v-card-title>

      <!-- Slot for close button -->
      <slot name="close"></slot>
    </div>

    <!-- No results message-->
    <p v-if="totalElements < 1 && !batchLoading">
      There are no results to display.<br />
      Please select another Job Execution ID.
    </p>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      title="Job/Runs"
      :headers="batchDataFields"
      :items="batchData"
      :items-length="totalElements"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.pen="{ item }">
        <v-btn
          :id="'pen' + item.pen"
          text
          small
          variant="plain"
          class="v-btn-link"
          @click="findStudentByPen(item.pen)"
        >
          {{ item.pen }}
        </v-btn>
      </template>
      <template v-slot:item.schoolOfRecord="{ item }">
        <div v-if="item.schoolOfRecord">{{ item.schoolOfRecord }}</div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import sharedMethods from "../../sharedMethods";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import StudentService from "@/services/StudentService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "batchJobSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  props: ["selectedErrorId"],
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      batchData: [],
      perPage: 10,
      rows: 0,
      totalElements: 0,
      itemsPerPage: 10,
      currentPage: 0,
      userSelectedPage: 0,
      batchLoading: false,

      batchDataFields: [
        {
          key: "pen",
          title: "Pen",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "legalFirstName",
          title: "First Name",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "legalLastName",
          title: "Last Name",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "error",
          title: "Error",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters("auth", ["token"]),
  },
  created() {
    this.loadStudent = sharedMethods.loadStudent;
    this.getAdminDashboardData(this.selectedErrorId, 0);
  },
  watch: {
    selectedErrorId: function () {
      this.getAdminDashboardData(this.selectedErrorId, 0);
    },
  },
  methods: {
    loadItems({ page = 1, itemsPerPage, sortBy }) {
      this.batchLoading = true;
      BatchProcessingService.getBatchErrors(this.selectedErrorId, page - 1)
        .then((response) => {
          this.batchData = response.data.errorList;
          this.totalElements = response.data.totalElements;
          this.batchLoading = false;
        })
        .catch((error) => {
          if (error.response.status) {
            this.batchLoading = false;
          }
        });
    },
    getAdminDashboardData(batchId, page) {
      this.batchData = [];
      this.rows = 0;
      this.batchLoading = true;
      if (page) {
        if (page > 0) {
          page = page - 1;
        }
      }
      BatchProcessingService.getBatchErrors(batchId, page)
        .then((response) => {
          this.batchData = response.data.errorList;
          this.rows = response.data.totalElements;
          this.batchLoading = false;
        })
        .catch((error) => {
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
    findStudentByPen: function (pen) {
      if (pen) {
        StudentService.getStudentByPen(pen)
          .then((response) => {
            if (response.data) {
              this.loadStudent(response.data);
            }
          })
          .catch((error) => {
            this.snackbarStore.showSnackbar(error.message, "error", 5000);
          });
      }
    },
  },
};
</script>
