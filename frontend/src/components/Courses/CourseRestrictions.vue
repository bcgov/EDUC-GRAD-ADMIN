<template>
  <div>
    <h3 class="ml-2 mt-5">Course Restrictions</h3>
    <CreateCourseRestriction></CreateCourseRestriction>
    <v-data-table
      title="Course restrictions"
      :items="courseRestrictions"
      :headers="courseRestrictionFields"
      id="courseRestrictionId"
      :showFilter="true"
      pagination="true"
    >
      <template v-slot:item.edit="{ item }">
        <v-dialog v-model="editDialog[item.courseRestrictionId]">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="hasPermissions('STUDENT', 'courseUpdate')"
              v-bind="props"
              color="success"
              icon="mdi-pencil"
              density="compact"
              variant="text"
            />
          </template>

          <v-card max-width="500px" class="mx-auto">
            <template v-slot:title>
              Edit Student Course
              <strong>{{ item.mainCourse }} {{ item.mainCourseLevel }}</strong>
            </template>

            <v-card-actions>
              <v-btn
                color="error"
                variant="outlined"
                @click="closeEditModal(item.courseRestrictionId)"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                color="error"
                variant="flat"
                @click="saveStudentCourse(item.courseRestrictionId)"
              >
                Save Student Course
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CreateCourseRestriction from "@/components/Courses/Forms/CreateCourseRestriction.vue";
import { useAccessStore } from "@/store/modules/access";
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";

import { mapState } from "pinia";

export default {
  name: "CourseRestrictions",
  created() {
    this.getAllCourseRestrictions();
  },
  components: {
    OpenStatusBadge,
    CreateCourseRestriction,
  },
  data() {
    return {
      formRef: null,
      formValid: true,
      mainCourseCode: "",
      mainCourseLevel: "",
      mainCourseInfo: "",
      dialog: false,
      editDialog: {},
      step: 1,
      snackbarStore: useSnackbarStore(),
      courseRestrictions: [],
      courseRestrictionFields: [
        {
          key: "mainCourse",
          title: "Course Code Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "mainCourseLevel",
          title: "Course Level Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourse",
          title: "Course Code Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourseLevel",
          title: "Course Level Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionStartDate",
          title: "Restriction Start Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionEndDate",
          title: "Restriction End Date",
          sortable: true,
          class: "text-left",
        },
        { key: "edit", title: "Edit", sortable: true, class: "text-left" },
      ],
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },

  methods: {
    getAllCourseRestrictions() {
      CourseService.getCourseRestrictions()
        .then((response) => {
          this.courseRestrictions = response.data;
        })
        .catch((error) => {
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
          console.error("Error loading restrictions:", error);
        });
    },
  },
};
</script>

<style scoped>
/* Optional styling */
</style>
