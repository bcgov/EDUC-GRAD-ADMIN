<template>
  <div>
    <v-alert v-if="!historicActivities?.length" class="container">
      This student does not have any historic activities.
    </v-alert>
    <v-row no-gutters>
    </v-row>
    <v-data-table
        v-if="historicActivities"
        :items="historicActivities"
        :headers="columns"
        :loading="isLoadingHistoricActivities"
        showFilter="true"
    >
      <template v-slot:item.date="{ item }">
        {{ $filters.formatSimpleDate(item.date) }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import ApiService from "@/common/apiService";
import {mapState} from "pinia";
import {useStudentStore} from "@/store/modules/student";
import {useSnackbarStore} from "@/store/modules/snackbar";
export default {
  name: "HistoricActivity",
  async mounted() {
    await this.loadStudentHistoricActivity();
  },
  computed: {
    ...mapState(useStudentStore, {studentID: "getStudentId"}),
    snackbarStore() {
      return useSnackbarStore();
    },
  },
  data: function () {
    return {
      columns: [
        {
          key: "date",
          title: "Date"
        },
          {
            key: "time",
            title: "Time",
            value: (item) => new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
          },
        {
          key: "type",
          title: "Type"
        },
        {
          key: "program",
          title: "Program"
        },
        {
          key: "userID",
          title: "User ID"
        },
        {
          key: "batch",
          title: "Batch"
        },
        {
          key: "seqNo",
          title: "Seq #"
        }
      ],
      historicActivities: [],
      isLoadingHistoricActivities: false,
    };
  },
  methods: {
    loadStudentHistoricActivity() {
      this.isLoadingHistoricActivities = true;

      ApiService.apiAxios.get(`/api/student/${this.studentID}/historicActivity`)
        .then((response) => {
          console.log('Historic Activity API Response:', response?.data);
          this.historicActivities = response?.data || [];
        })
        .catch((error) => {
          if (error.response?.status) {
            this.snackbarStore.showSnackbar(
                "Failed to load student historic activities",
                "error",
                5000
            );
          }
        })
        .finally(() => {
          this.isLoadingHistoricActivities = false;
        });
    },
  }
};
</script>

<style scoped>

</style>