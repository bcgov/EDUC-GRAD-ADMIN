<template>
  <v-card class="p-3">
    <v-overlay
      v-model="batchLoading"
      class="align-center justify-center"
      contained
    >
      <v-progress-circular
        v-if="batchLoading"
        indeterminate
        color="primary"
        size="64"
      >
      </v-progress-circular>
    </v-overlay>
    <div class="d-flex justify-space-between align-center">
      <v-card-title> Batch Job #{{ selectedBatchId }} students </v-card-title>

      <!-- Slot for close button -->
      <slot name="close"></slot>
    </div>

    <!-- No results message-->
    <p v-if="totalElements < 1 && !batchLoading">
      There are no results to display.<br />
      Please select another Job Execution ID.
    </p>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="batchDataFields"
      :items="batchData"
      :items-length="totalElements"
      :loading="batchLoading"
      item-value="id"
      @update:options="loadItems"
    >
      <template v-slot:item.pen="{ item }">
        <v-btn
          :id="'pen' + item.pen"
          text
          small
          variant="plain"
          class="v-btn-link"
          @click="findStudentByPen(item.pen)"
        >
          {{ item.pen }}
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import sharedMethods from "../../sharedMethods";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useAppStore } from "@/store/modules/app";
import { mapActions, mapState } from "pinia";
export default {
  name: "batchJobSearch",
  components: {},
  props: ["selectedBatchId"],
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      batchData: [],
      totalElements: 0,
      itemsPerPage: 10,
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
          key: "schoolOfRecordName",
          title: "School of Record",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
    };
  },

  computed: {
    ...mapState(useAppStore, ["getSchoolById"]),
  },
  created() {
    this.loadStudent = sharedMethods.loadStudent;
  },
  watch: {
    selectedBatchId: function () {
      //handle when a selectedBatchId changes
      this.loadItems({
        page: 1,
        itemsPerPage: this.itemsPerPage,
        sortBy: this.sortBy,
      });
    },
  },
  methods: {
    loadItems({ page, itemsPerPage, sortBy }) {
      this.batchLoading = true;
      StudentService.getBatchHistory(
        this.selectedBatchId,
        this.itemsPerPage == -1 ? this.totalElements : this.itemsPerPage,
        page - 1
      )
        .then((response) => {
          this.batchData = response.data.content;
          this.batchData.forEach((item) => {
            const school = this.getSchoolById(item.schoolOfRecordId);
            // Add the school information to the item
            item.schoolOfRecordName = school.mincode;
          });
          this.totalElements = response.data.totalElements;
          this.batchLoading = false;
        })
        .catch((error) => {
          if (error.response.status) {
            this.batchLoading = false;
          }
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
            console.log(error);
            this.snackbarStore.showSnackbar(
              "There was an error with the Student API",
              "error",
              5000
            );
          });
      }
    },
  },
};
</script>
