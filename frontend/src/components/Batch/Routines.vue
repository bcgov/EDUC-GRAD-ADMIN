<template>
  <v-container>
    <v-row>
      <v-col>
        <display-table
          :title="'Routines'"
          :items="scheduledRoutines"
          :fields="scheduledRoutinesFields"
          :id="'id'"
          :showFilter="false"
          :pagination="true"
        >
          <template v-slot:cell(enabled)="row">
            <v-switch
              v-model="row.item.enabled"
              @change="toggleRoutine(row.item.jobType, row.item.id)"
              :disabled="!allowToggleRoutines"
              label="Enabled"
            ></v-switch>
          </template>
        </display-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { mapState } from "pinia";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { useAccessStore } from "../../store/modules/access";

export default {
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      scheduledRoutines: [],
      scheduledRoutinesFields: [
        {
          key: "jobType",
          label: "Type",
          sortable: true,
          class: "text-left",
        },
        {
          key: "cronExpression",
          label: "Cron Expression",
          sortable: true,
          class: "text-left",
        },
        {
          key: "scheduleOccurrence",
          label: "Scheduled Occurence",
          sortable: true,
          class: "text-left",
        },
        {
          key: "createUser",
          label: "Created By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "updateUser",
          label: "Updated By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "updateDate",
          label: "Updated Date/Time",
          sortable: true,
          class: "text-left",
        },
        {
          key: "enabled",
          label: "Enabled",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  created() {
    BatchProcessingService.batchProcessingRoutines()
      .then((response) => {
        this.scheduledRoutines = response.data;
      })
      .catch((error) => {
        this.makeToast("ERROR " + error.response.statusText, "danger");
      });
  },
  methods: {
    toggleRoutine(jobType, processingId) {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to update this routine.", {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "Confirm",
          cancelTitle: "Cancel",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((confirm) => {
          if (confirm) {
            BatchProcessingService.batchProcessingToggleRoutine(
              jobType,
              processingId
            )
              .then(() => {
                this.makeToast("Job Updated", "success");
              })
              .catch((error) => {
                this.makeToast("ERROR " + error.response.statusText, "danger");
              });
          } else {
            // Reset the switch if the user cancels
            this.$set(
              this.scheduledRoutines.find((item) => item.id === processingId),
              "enabled",
              !this.scheduledRoutines.find((item) => item.id === processingId)
                .enabled
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    makeToast(message, variant) {
      this.$bvToast.toast(message, {
        title: message,
        variant: variant,
        noAutoHide: true,
      });
    },
  },
  props: {
    jobId: String,
  },
  computed: {
    ...mapState(useAccessStore, {
      allowToggleRoutines: "allowToggleRoutines",
    }),
  },
};
</script>

<style scoped>
/* Your scoped styles here */
</style>