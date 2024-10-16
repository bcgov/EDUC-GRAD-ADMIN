<template>
  <div>
    <div v-if="adminDashboardLoading">LOADING</div>
    <div v-if="!scheduledJobs.length">No Scheduled Jobs</div>

    <v-data-table
      title="Job/Runs"
      :items="sortedScheduledJobs"
      :headers="scheduledJobFields"
      id="id"
      :showFilter="false"
      :sortBy="[{ key: 'status', order: 'desc' }]"
      store="batchprocessing"
    >
      <!-- Slot for job parameters display -->
      <template v-slot:item.jobParameters="{ item }">
        {{ item.jobParameters }}
        <v-btn
          v-if="item.status == 'COMPLETED'"
          :id="'batch-job-id-btn' + item.jobExecutionId"
          small
        >
          {{ item.jobExecutionId }}
        </v-btn>

        <v-btn v-else disabled small>
          {{ item.jobExecutionId }}
        </v-btn>
      </template>

      <!-- Slot for actions (delete button) -->
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="plain"
          v-if="item.status == 'QUEUED'"
          color="error"
          @click="openDeleteDialog(item)"
          ><v-icon>mdi-delete</v-icon></v-btn
        >

        <!-- Dialog for delete confirmation -->
        <v-dialog v-model="deleteDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Delete Job</v-card-title>
            <v-card-text
              >Are you sure you want to delete job "{{
                selectedJob.jobName
              }}"?</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="deleteDialog = false">Cancel</v-btn>
              <v-btn color="error" @click="confirmDelete">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <!-- Expanded row content -->
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-card>
              <v-card-text>
                <div
                  v-for="(value, key) in item.jobParameters.payload"
                  :key="key"
                >
                  <span v-if="value != null">
                    <span v-if="value.length != 0"
                      >{{ key }} : {{ value }}</span
                    >
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { mapState, mapActions } from "pinia";

export default {
  components: {
    DisplayTable,
  },
  data() {
    return {
      adminDashboardLoading: false,
      scheduledJobFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: false,
          class: "text-left",
        },
        { key: "id", title: "ID", sortable: true, class: "text-left" },
        {
          key: "jobName",
          title: "Job Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "cronExpression",
          title: "CRON (Sec Min Hr Date Month)",
          sortable: true,
          class: "text-left",
        },
        {
          key: "createUser",
          title: "Scheduled By",
          sortable: true,
          class: "text-left",
        },
        { key: "status", title: "Status", sortable: true, class: "text-left" },
        {
          key: "actions",
          title: "Actions",
          sortable: false,
          class: "text-left",
        }, // Added actions column
      ],
      deleteDialog: false, // Controls dialog visibility
      selectedJob: null, // Holds the job selected for deletion
      snackbar: {
        show: false,
        message: "",
        color: "",
        timeout: 3000, // Snackbar timeout in milliseconds
      },
    };
  },
  computed: {
    ...mapState(useBatchProcessingStore, {
      scheduledJobs: "getScheduledBatchRuns",
    }),
    sortedScheduledJobs() {
      return [...this.scheduledJobs].sort((a, b) => {
        if (a.status === "QUEUED" && b.status !== "QUEUED") return -1;
        if (a.status !== "QUEUED" && b.status === "QUEUED") return 1;
        return 0;
      });
    },
  },
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "setScheduledBatchJobs",
      "removeScheduledJobs",
    ]),

    openDeleteDialog(item) {
      this.selectedJob = item;
      this.deleteDialog = true;
    },

    confirmDelete() {
      this.removeScheduledJobs(this.selectedJob.id)
        .then(() => {
          this.showSnackbar("Job successfully cancelled", "success");
        })
        .catch(() => {
          this.showSnackbar("Error deleting job", "error");
        })
        .finally(() => {
          this.deleteDialog = false;
        });
    },

    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
input {
  border-radius: 0px;
}
</style>
