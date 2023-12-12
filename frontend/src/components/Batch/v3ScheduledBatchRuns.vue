<template>
  <div>
    <div v-if="adminDashboardLoading">LOADING</div>
    <div v-if="!scheduledJobs.length">No Scheduled Jobs</div>

    <DisplayTable
      title="Job/Runs"
      :items="scheduledJobs"
      v-bind:fields="scheduledJobFields"
      id="id"
      sortBy="status"
      :sortDesc="true"
      :showFilter="false"
      pagination="true"
      disableDeletefield="status"
      disableDeleteIfValue="COMPLETED"
      deleteLabel="Cancel"
      store="batchprocessing"
      delete="removeScheduledJobs"
    >
      <template #cell(jobExecutionId)="row">
        <b-btn
          v-if="row.item.status == 'COMPLETED'"
          :id="'batch-job-id-btn' + row.item.jobExecutionId"
          variant="link"
          size="xs"
        >
          {{ row.item.jobExecutionId }}
        </b-btn>
        <b-btn v-else disabled variant="link" size="xs">
          {{ row.item.jobExecutionId }}
        </b-btn>
        <b-popover
          :target="'batch-job-id-btn' + row.item.jobExecutionId"
          triggers="focus"
          :ref="'popover-' + row.item.jobExecutionId"
        >
          <template #title>Search batch job</template>
          <b-btn
            :id="'batch-job-id-btn' + row.item.jobExecutionId"
            variant="link"
            size="xs"
            @click="setBatchId(row.item.jobExecutionId, 'batch')"
          >
            All results
          </b-btn>
        </b-popover>
      </template>
      <template #cell(failedStudentsProcessed)="row">
        <b-btn
          v-if="row.item.failedStudentsProcessed != 0"
          variant="link"
          size="xs"
          @click="setBatchId(row.item.jobExecutionId, 'error')"
        >
          {{ row.item.failedStudentsProcessed }}
        </b-btn>
        <div v-if="row.item.failedStudentsProcessed == 0">
          {{ row.item.failedStudentsProcessed }}
        </div>
      </template>
      <template #cell(jobParameters)="row">
        <div>
          <b-btn
            variant="outline primary"
            style="color: #666"
            size="sm"
            @click="row.toggleDetails"
            class="more-button"
          >
            <img
              v-show="!row.detailsShowing"
              src="../../assets/images/icon-right.svg"
              width="9"
              aria-hidden="true"
              alt=""
            />
            <img
              v-show="row.detailsShowing"
              src="../../assets/images/icon-down.svg"
              height="5"
              aria-hidden="true"
              alt=""
            />
          </b-btn>
        </div>
      </template>
      <template #row-details="row">
        <b-card class="px-0">
          <div
            v-for="(value, key) in row.item.jobParameters.payload"
            :key="key"
          >
            <span v-if="value != null"
              ><span v-if="value.length != 0"
                >{{ key }} : {{ value }}</span
              ></span
            >
          </div>
        </b-card>
      </template>
    </DisplayTable>
  </div>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { isProxy, toRaw } from "vue";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { mapState, mapActions } from "pinia";
export default {
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      adminDashboardLoading: false,
      scheduledJobFields: [
        {
          key: "jobParameters",
          label: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "id",
          label: "ID",
          sortable: true,
          class: "text-left",
        },
        {
          key: "jobName",
          label: "Job Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "cronExpression",
          label: "CRON (Sec Min Hr Date Month)",
          sortable: true,
          class: "text-left",
        },

        {
          key: "createUser",
          label: "Scheduled By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
          class: "text-left",
        },
        {
          key: "delete",
          label: "Delete",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  created() {
    this.getScheduledJobs();
  },
  computed: {
    ...mapState(useBatchProcessingStore, {
      scheduledJobs: "getScheduledBatchRuns",
    }),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setScheduledBatchJobs"]),
    getScheduledJobs() {
      BatchProcessingService.getScheduledBatchJobs().then((response) => {
        this.setScheduledBatchJobs(response.data);
      });
    },
    addScheduledJob(request) {
      BatchProcessingService.addScheduledJob(request)
        .then(() => {
          //update the admin dashboard
          this.getScheduledJobs();
          this.$bvToast.toast("Request has successfully been scheduled", {
            title: "SCHEDULING USER REQUEST",
            variant: "success",
            noAutoHide: true,
          });
        })
        .catch((error) => {
          if (error) {
            this.$bvToast.toast("There was an error scheduling your request", {
              title: "SCHEDULING ERROR",
              variant: "success",
              noAutoHide: true,
            });
          }
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
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
