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
      <template #cell(enabled)="row">
        <b-form-checkbox
          @change="toggleRoutine(row.item.jobType, row.item.id)"
          :ref="'routine' + row.item.jobType + 'Enabled'"
          :checked="row.item.enabled == 'Y' ? true : false"
          name="check-button"
          switch
        >
        </b-form-checkbox>
      </template>
    </DisplayTable>
  </div>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
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
        this.setBatchRoutines(response.data);
      })
      .catch((error) => {
        this.makeToast("ERROR " + error.response.statusText, "danger");
      });
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setBatchRoutines"]),
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
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
