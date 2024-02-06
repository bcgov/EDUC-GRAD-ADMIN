<template>
  <div>
    <v-progress-circular model-value="batchLoading"></v-progress-circular>
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
    <DisplayTable
      title="Job/Runs"
      :items="batchData"
      :fields="batchDataFields"
      id="id"
      :showFilter="false"
      :pagination="false"
    >
      <template v-slot:item.pen="{ item }">
        <v-btn
          :id="'pen' + item.raw.pen"
          text
          small
          @click="findStudentByPen(item.raw.pen)"
        >
          {{ item.raw.pen }}
        </v-btn>
      </template>
      <template v-slot:item.schoolOfRecord="{ item }">
        <div v-if="item.raw.schoolOfRecord">{{ item.raw.schoolOfRecord }}</div>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sharedMethods from "../../sharedMethods";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import StudentService from "@/services/StudentService.js";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "batchJobSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  props: ["selectedErrorId"],
  data() {
    return {
      batchData: [],
      perPage: 10,
      rows: 0,
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
          key: "error",
          title: "Error",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters("auth", ["token"]),

    currentPageChange() {
      return this.userSelectedPage;
    },
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
    this.loadStudent = sharedMethods.loadStudent;
    this.getAdminDashboardData(this.selectedErrorId, 0);
  },
  watch: {
    selectedErrorId: function () {
      this.getAdminDashboardData(this.selectedErrorId, 0);
    },
    currentPageChange: function () {
      if (this.userSelectedPage !== null) {
        this.getAdminDashboardData(this.selectedErrorId, this.userSelectedPage);
      }
    },
  },
  methods: {
    getAdminDashboardData(batchId, page) {
      this.batchData = [];
      this.rows = 0;
      this.batchLoading = true;
      if (page) {
        if (page > 0) {
          page = page - 1;
        }
      }
      BatchProcessingService.getBatchErrors(batchId, page)
        .then((response) => {
          this.batchData = response.data.errorList;
          this.rows = response.data.totalElements;
          this.batchLoading = false;
        })
        .catch((error) => {
          // if (error.response.status) {
          //   this.$bvToast.toast("ERROR " + error.response.statusText, {
          //     title: "ERROR" + error.response.status,
          //     variant: "danger",
          //     noAutoHide: true,
          //   });
          //   this.isBatchLoading = false;
          // }
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
            console.log("Batch Admin Load: " + error);
            this.showNotification(
              "danger",
              "Student cannot be found on the GRAD or PEN database"
            );
          });
      }
    },
  },
};
</script>

<style scoped></style>
