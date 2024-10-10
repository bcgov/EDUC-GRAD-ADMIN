<template>
  <div>
    <DisplayTable
      title="Routines"
      :items="this.batchRoutines"
      v-bind:fields="scheduledRoutinesFields"
      id="id"
      :showFilter="false"
      pagination="true"
    >
      <template v-slot:item.enabled="{ item }">
        <v-switch
          :disabled="!hasPermissions('BATCH', 'toggleBatchRoutines')"
          :model-value="getSwitchValue(item)"
          label="Enable"
          @change="toggleRoutine(item.jobType, item.id)"
        ></v-switch>
      </template>
    </DisplayTable>
  </div>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { useAccessStore } from "../../store/modules/access";
import { mapState, mapActions } from "pinia";
export default {
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      scheduledRoutinesFields: [
        {
          key: "jobType",
          title: "Type",
          sortable: true,
          class: "text-left",
        },
        {
          key: "cronExpression",
          title: "Cron Expression",
          sortable: true,
          class: "text-left",
        },
        {
          key: "scheduleOccurrence",
          title: "Scheduled Occurence",
          sortable: true,
          class: "text-left",
        },
        {
          key: "createUser",
          title: "Created By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "updateUser",
          title: "Updated By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "updateDate",
          title: "Updated Date/Time",
          sortable: true,
          class: "text-left",
        },
        {
          key: "enabled",
          title: "Enabled",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  created() {
    BatchProcessingService.batchProcessingRoutines()
      .then((response) => {
        this.setBatchRoutines(response.data);
      })
      .catch((error) => {
        this.makeToast("ERROR " + error.response.statusText, "danger");
      });
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setBatchRoutines"]),
    getSwitchValue(item) {
      return item.enabled === "Y";
    },
    toggleRoutine(jobType, processingId) {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to update.", {
          title: "Please Confirm",
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
            let r = "routine" + jobType + "Enabled";
            this.$refs[r].localChecked = !this.$refs[r].localChecked;
          }
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(err);
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
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRoutines: "getBatchRoutines",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
