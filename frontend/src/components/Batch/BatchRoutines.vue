<template>
  <v-container>
    <v-overlay
      v-model="isBatchRoutinesLoading"
      class="align-center justify-center"
      contained
    >
      <v-progress-circular
        v-if="isBatchRoutinesLoading"
        indeterminate
        color="primary"
        size="64"
      >
      </v-progress-circular>
    </v-overlay>
    <v-data-table
      :headers="scheduledRoutinesFields"
      :items="displayBatchRoutines"
      :items-per-page="5"
      class="elevation-1"
      :show-filter="false"
    >
      <template v-slot:item.startTime="{ item }">
        <span>{{ getStartTimeLabel(item) }}</span>
      </template>
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
      <template v-slot:item.actions="{ item }">
        <div
          v-if="item.jobType === 'REGALG'"
          class="routine-action-cell routine-action-icons"
        >
          <v-tooltip text="Manually start REGALG">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-play"
                variant="text"
                color="primary"
                @click="handleManualStart"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Change start time">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil"
                variant="text"
                color="primary"
                :disabled="isPipelineRunning"
                @click="openStartTimeDialog(item)"
              />
            </template>
          </v-tooltip>
        </div>
        <div v-else class="routine-action-cell">
          <span class="text-body-2 text-medium-emphasis">Linked</span>
        </div>
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

    <v-dialog v-model="startTimeDialogVisible" max-width="420">
      <v-card>
        <v-card-title class="headline">Change Start Time</v-card-title>
        <v-card-text>
          <div class="text-body-2 mb-4">
            Set the REGALG start time. TVRRUN will continue to follow REGALG
            after completion.
          </div>
          <v-text-field
            v-model="selectedStartTime"
            type="time"
            label="Start Time"
            density="comfortable"
            :min="minimumStartTime"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="startTimeDialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveStartTime">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="manualStartDialogVisible" max-width="520">
      <v-card>
        <v-card-title class="headline">Another Batch Is Running</v-card-title>
        <v-card-text>
          <p class="mb-4">
            A REGALG or TVRRUN batch appears to be running already. Do you want
            to proceed anyway?
          </p>
          <div
            v-for="run in activePipelineRuns"
            :key="run.jobExecutionId"
            class="text-body-2 mb-2"
          >
            {{ run.jobType }} batch {{ run.jobExecutionId }} is
            {{ run.status.toLowerCase() }}.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelManualStart">No</v-btn>
          <v-btn color="primary" @click="confirmManualStart">Yes</v-btn>
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
  </v-container>
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
      startTimeDialogVisible: false,
      manualStartDialogVisible: false,
      selectedStartTime: "",
      selectedRoutine: null,
      activePipelineRuns: [],
      switchState: {}, // Store the visual state of the switches
      originalState: null, // Store the original state of the toggle
      scheduledRoutinesFields: [
        { key: "jobType", title: "Type", sortable: true },
        { key: "startTime", title: "Start Time", sortable: false },
        { key: "createUser", title: "Created By", sortable: true },
        { key: "updateUser", title: "Updated By", sortable: true },
        { key: "updateDate", title: "Updated Date/Time", sortable: true },
        { key: "enabled", title: "Enabled", sortable: true },
        { key: "actions", title: "", sortable: false, align: "center" },
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

    openStartTimeDialog(item) {
      this.selectedRoutine = item;
      this.selectedStartTime = this.getRoutineTimeValue(item);
      this.startTimeDialogVisible = true;
    },

    saveStartTime() {
      if (!this.isSelectedStartTimeValid) {
        this.showSnackbar(
          "Start time must be later than the current time",
          "error"
        );
        return;
      }
      this.startTimeDialogVisible = false;
      this.showSnackbar(
        "Start time save is ready for batch API wiring",
        "success"
      );
    },

    handleManualStart() {
      BatchProcessingService.getBatchPipelineStatus()
        .then((response) => {
          const activeRuns = response?.data?.activeRuns ?? [];
          if (activeRuns.length > 0) {
            this.activePipelineRuns = activeRuns;
            this.manualStartDialogVisible = true;
            return;
          }
          this.runManualStartRequest();
        })
        .catch((error) => {
          this.showSnackbar("ERROR " + error.response.statusText, "error");
        });
    },

    confirmManualStart() {
      this.manualStartDialogVisible = false;
      this.runManualStartRequest();
    },

    cancelManualStart() {
      this.manualStartDialogVisible = false;
      this.activePipelineRuns = [];
    },

    runManualStartRequest() {
      BatchProcessingService.runManualRegalgBatch()
        .then((response) => {
          const batchId = response?.data?.batchId;
          const message = batchId
            ? `Batch ${batchId} scheduled`
            : "Batch scheduled";
          this.activePipelineRuns = [];
          this.showSnackbar(message, "success");
        })
        .catch((error) => {
          this.showSnackbar("ERROR " + error.response.statusText, "error");
        });
    },

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

    getRoutineTimeValue(item) {
      if (!item?.cronExpression) {
        return "";
      }
      const cronParts = item.cronExpression.trim().split(/\s+/);
      if (cronParts.length < 3) {
        return "";
      }
      const minutes = cronParts[1].padStart(2, "0");
      const hours = cronParts[2].padStart(2, "0");
      return `${hours}:${minutes}`;
    },

    getStartTimeLabel(item) {
      if (item.jobType === "TVRRUN") {
        return "Follows REGALG";
      }
      const timeValue = this.getRoutineTimeValue(item);
      if (!timeValue) {
        return "--";
      }
      const [hours, minutes] = timeValue.split(":").map(Number);
      const displayDate = new Date();
      displayDate.setHours(hours, minutes, 0, 0);
      return new Intl.DateTimeFormat("en-CA", {
        hour: "numeric",
        minute: "2-digit",
      }).format(displayDate);
    },
  },
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRoutines: "getBatchRoutines",
      isBatchRoutinesLoading: "getIsGettingBatchRoutinesLoading",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    displayBatchRoutines() {
      const allowedTypes = ["REGALG", "TVRRUN"];
      return this.batchRoutines.filter((routine) =>
        allowedTypes.includes(routine.jobType)
      );
    },
    minimumStartTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },
    isSelectedStartTimeValid() {
      if (!this.selectedStartTime) {
        return false;
      }
      return this.selectedStartTime >= this.minimumStartTime;
    },
    isPipelineRunning() {
      return false;
    },
  },
};
</script>

<style scoped>
.routine-action-icons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
}

.routine-action-cell {
  display: flex;
  justify-content: flex-end;
  padding-right: 0.75rem;
  width: 100%;
}
</style>
