<template>
  <div>
    <v-data-table
      :headers="scheduledRoutinesFields"
      :items="batchRoutines"
      :items-per-page="5"
      class="elevation-1"
      :show-filter="false"
    >
      <template v-slot:item.enabled="{ item }">
        <v-switch
          :disabled="!hasPermissions('BATCH', 'toggleBatchRoutines')"
          v-model="switchState[item.id]"
          :label="switchState[item.id] ? 'Enabled' : 'Disabled'"
          :color="switchState[item.id] ? 'green' : ''"
          @click="prepareToggleRoutine(item)"
        ></v-switch>
      </template>
      <template v-slot:item.updateDate="{ item }">
        {{ item.updateDate.replace("T", ", ") }}
      </template>
    </v-data-table>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialogVisible" max-width="300">
      <v-card>
        <v-card-title class="headline">Please Confirm</v-card-title>
        <v-card-text>
          <p>Please confirm that you want to update.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmToggle">Confirm</v-btn>
          <v-btn color="grey" text @click="cancelToggle">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar
      v-model="snackbarVisible"
      :timeout="3000"
      :color="snackbarColor"
    >
      {{ snackbarMessage }}
      <v-btn text @click="snackbarVisible = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { useAccessStore } from "../../store/modules/access";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      dialogVisible: false,
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarColor: "",
      jobTypeToToggle: null,
      processingIdToToggle: null,
      switchState: {}, // Store the visual state of the switches
      originalState: null, // Store the original state of the toggle
      scheduledRoutinesFields: [
        { key: "jobType", title: "Type", sortable: true },
        { key: "cronExpression", title: "Cron Expression", sortable: true },
        {
          key: "scheduleOccurrence",
          title: "Scheduled Occurrence",
          sortable: true,
        },
        { key: "createUser", title: "Created By", sortable: true },
        { key: "updateUser", title: "Updated By", sortable: true },
        { key: "updateDate", title: "Updated Date/Time", sortable: true },
        { key: "enabled", title: "Enabled", sortable: true },
      ],
    };
  },
  created() {
    BatchProcessingService.batchProcessingRoutines()
      .then((response) => {
        this.setBatchRoutines(response.data);

        // Initialize switch state for each routine based on the enabled status using slice
        let updatedSwitchState = { ...this.switchState };
        response.data.forEach((item) => {
          updatedSwitchState = {
            ...updatedSwitchState,
            [item.id]: item.enabled === "Y",
          };
        });
        this.switchState = updatedSwitchState;
      })
      .catch((error) => {
        this.showSnackbar("ERROR " + error.response.statusText, "error");
      });
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setBatchRoutines"]),

    prepareToggleRoutine(item) {
      this.jobTypeToToggle = item.jobType;
      this.processingIdToToggle = item.id;
      this.originalState = item.enabled; // Store the original state
      this.dialogVisible = true; // Show the confirmation dialog
    },

    confirmToggle() {
      const item = this.batchRoutines.find(
        (routine) => routine.jobType === this.jobTypeToToggle
      );
      if (item) {
        // Update the actual enabled state after confirmation
        item.enabled = item.enabled === "Y" ? "N" : "Y";
        this.switchState[item.id] = item.enabled === "Y"; // Reflect in UI
      }

      BatchProcessingService.batchProcessingToggleRoutine(
        this.jobTypeToToggle,
        this.processingIdToToggle
      )
        .then(() => {
          this.showSnackbar("Job Updated", "success");
          this.dialogVisible = false; // Hide the dialog after confirming
        })
        .catch((error) => {
          this.showSnackbar("ERROR " + error.response.statusText, "error");
          this.dialogVisible = false; // Hide the dialog in case of an error
        });
    },

    cancelToggle() {
      // Revert the visual switch state to the original state
      const item = this.batchRoutines.find(
        (routine) => routine.jobType === this.jobTypeToToggle
      );
      if (item) {
        this.switchState[item.id] = this.originalState === "Y"; // Revert to original state
      }
      this.dialogVisible = false; // Close the dialog
    },

    showSnackbar(message, type) {
      this.snackbarMessage = message;
      this.snackbarVisible = true;
      this.snackbarColor = type === "error" ? "red" : "success";
    },
  },
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRoutines: "getBatchRoutines",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
