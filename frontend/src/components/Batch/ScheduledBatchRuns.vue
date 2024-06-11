<template>
  <div>
    <div v-if="adminDashboardLoading">LOADING</div>
    <div v-if="!scheduledJobs.length">No Scheduled Jobs</div>
    {{ scheduledJobs }}
    <DisplayTable
      title="Job/Runs"
      :items="scheduledJobs"
      :fields="scheduledJobFields"
      id="id"
      :showFilter="false"
      :sortBy="[{ key: 'status', order: 'desc' }]"
      :delete="{
        disable: {
          condition: 'OR',
          criteria: [
            {
              field: 'status',
              value: 'COMPLETED',
            },
          ],
        },
        label: 'Cancel',
        action: 'removeScheduledJobs',
      }"
      store="batchprocessing"
    >
      <template v-slot:item.jobParameters="{ item, headers }">
        <v-btn
          v-if="item.raw.status == 'COMPLETED'"
          :id="'batch-job-id-btn' + item.raw.jobExecutionId"
          size="xs"
        >
          {{ item.raw.jobExecutionId }}
        </v-btn>
        <v-btn v-else disabled size="xs">
          {{ item.raw.jobExecutionId }}
        </v-btn>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-card>
              <v-card-text>
                <div
                  v-for="(value, key) in item.raw.jobParameters.payload"
                  :key="key"
                >
                  <span v-if="value != null"
                    ><span v-if="value.length != 0"
                      >{{ key }} : {{ value }}</span
                    ></span
                  >
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>
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
          key: "data-table-expand",
          title: "",

          sortable: true,
          class: "text-left",
        },

        {
          key: "id",
          title: "ID",
          sortable: true,
          class: "text-left",
        },
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
        {
          key: "status",
          title: "Status",
          sortable: true,
          class: "text-left",
        },
        {
          key: "delete",
          title: "Delete",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  created() {},
  computed: {
    ...mapState(useBatchProcessingStore, {
      scheduledJobs: "getScheduledBatchRuns",
    }),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setScheduledBatchJobs"]),

    addScheduledJob(request) {
      BatchProcessingService.addScheduledJob(request)
        .then(() => {
          //update the admin dashboard
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
