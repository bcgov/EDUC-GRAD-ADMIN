<template>
  <v-card class="p-3">
    <div class="d-flex justify-space-between align-center">
      <v-card-title> Batch Job #{{ selectedBatchId }} students </v-card-title>

      <!-- Slot for close button -->
      <slot name="close"></slot>
    </div>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
      size="64"
    >
      Loading...
    </v-progress-circular>

    <!-- No results message-->
    <p v-if="rows < 1">
      There are no results to display.<br />
      Please select another Job Execution ID.
    </p>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="batchDataFields"
      :items="batchData"
      :items-length="totalElements"
      :loading="loading"
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
    </v-data-table-server>
  </v-card>
</template>

<script>
import sharedMethods from "../../sharedMethods";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "batchJobSearch",
  components: {},
  props: ["selectedBatchId"],
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      batchData: [],
      perPage: 10,
      rows: 0,
      loading: false,
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
          key: "schoolOfRecord",
          title: "School of Record",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
    };
  },

  computed: {
    currentPageChange() {
      return this.userSelectedPage;
    },
  },
  created() {
    this.loadStudent = sharedMethods.loadStudent;
    this.getAdminDashboardData(this.selectedBatchId, 0);
  },
  watch: {
    selectedBatchId: function () {
      this.getAdminDashboardData(this.selectedBatchId, 0);
    },
    currentPageChange: function () {
      if (this.userSelectedPage !== null) {
        this.getAdminDashboardData(this.selectedBatchId, this.userSelectedPage);
      }
    },
  },
  methods: {
    loadItems({ page, itemsPerPage, sortBy }) {
      this.batchLoading = true;
      StudentService.getBatchHistory(this.selectedBatchId, page - 1)
        .then((response) => {
          this.batchData = response.data.content;
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
      StudentService.getBatchHistory(batchId, page)
        .then((response) => {
          this.batchData = response.data.content;
          this.rows = response.data.totalElements;
          this.itemsPerPage = response.data.size;
          this.batchLoading = false;
        })
        .catch((error) => {
          if (error.response.status) {
            this.isBatchLoading = false;
          }
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
            // eslint-disable-next-line
            this.snackbarStore.showSnackbar(
              "Student cannot be found on the GRAD or PEN database",
              "error",
              5000
            );
          });
      }
    },
  },
};
</script>
