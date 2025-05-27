<template>
  <div>
    <v-card>
      <!-- Info Alerts -->
      <v-alert
        type="info"
        variant="tonal"
        border="start"
        class="mt-6 mb-0 ml-1 py-3 width-fit-content"
      >
        Until student course CRUD is live, student courses will not be kept in
        sync via ongoing updates. Instead there will be a gradual data
        migration.
      </v-alert>
      <v-alert
        color="debug"
        variant="tonal"
        icon="mdi-progress-wrench"
        border="start"
        class="mt-6 mb-0 ml-1 py-3 width-fit-content"
      >
        Data shown is using old course API endpoints since we are working ahead
        of backend changes. Table below should use the newly added endpoints in
        the student API.
      </v-alert>

      <v-card-text>
        <v-alert v-if="!courses" class="container">
          This student does not have any courses.
        </v-alert>

        <v-row no-gutters>
          <StudentCoursesDeleteForm courseBatchDelete :courseIds="selected">
          </StudentCoursesDeleteForm>
          <v-spacer />
          <StudentCoursesForm />
        </v-row>

        <v-data-table
          v-if="courses"
          v-model="selected"
          :items="courses"
          :headers="fields"
          :items-per-page="'-1'"
          show-select
        >
          <template
            v-slot:item.data-table-expand="{
              item,
              internalItem,
              toggleExpand,
              isExpanded,
            }"
          >
            <td v-if="item.hasRelatedCourse == 'Y'">
              <v-btn
                variant="text"
                density="comfortable"
                @click="toggleExpand(internalItem)"
                class="v-data-table__expand-icon"
                :class="{ 'v-data-table__expand-icon--active': isExpanded }"
                :icon="
                  isExpanded(internalItem)
                    ? 'mdi-chevron-down'
                    : 'mdi-chevron-right'
                "
              />
            </td>
          </template>

          <template v-slot:item.courseName="{ item }">
            <v-dialog max-width="500">
              <template #activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  color="surface-variant"
                  :text="item.courseName"
                  variant="plain"
                  class="m-1 p-1 text-left v-btn-link"
                />
              </template>

              <template #default="{ isActive }">
                <v-card :title="item.courseName">
                  <v-card-text>
                    <div
                      class="row py-1"
                      v-for="(label, key) in courseDetailsMap"
                      :key="key"
                    >
                      <div class="col">
                        <strong>{{ label }}:</strong>
                      </div>
                      <div class="col">
                        {{
                          key.includes("Date")
                            ? $filters.formatSimpleDate(item.courseDetails[key])
                            : item.courseDetails[key]
                        }}
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text="Close" @click="isActive.value = false" />
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <ul v-if="item.hasRelatedCourse">
                  <li
                    v-for="(label, key) in expandedDetailsMap"
                    :key="key"
                    v-if="item[key]"
                  >
                    <strong>{{ label }}:</strong> {{ item[key] }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>

          <template v-slot:item.edit="{ item }">
            <v-dialog
              v-model="
                editDialog[
                  item.courseCode + item.courseLevel + item.sessionDate
                ]
              "
            >
              <template #activator="{ props }">
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
                <template #title>
                  Edit Student Course
                  <strong
                    >{{ item.courseCode }} {{ item.courseLevel }} -
                    {{ item.sessionDate }}</strong
                  >
                </template>
                TODO: Implement edit for single course using the repeatable add
                student course form component
                <v-card-actions>
                  <v-btn
                    color="error"
                    variant="outlined"
                    class="text-none"
                    density="default"
                    @click="
                      closeEditModal(
                        item.courseCode + item.courseLevel + item.sessionDate
                      )
                    "
                    >Cancel</v-btn
                  >
                  <v-spacer />
                  <v-btn
                    color="error"
                    variant="flat"
                    class="text-none"
                    density="default"
                    @click="
                      saveStudentCourse(
                        item.courseCode + item.courseLevel + item.sessionDate
                      )
                    "
                    >Save Student Course</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template v-slot:item.delete="{ item }">
            <StudentCoursesDeleteForm :courseIds="[item.id]">
            </StudentCoursesDeleteForm>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { mapState, mapActions } from "pinia";
import StudentCoursesDeleteForm from "@/components/StudentProfile/Forms/StudentCoursesDeleteForm.vue";
import StudentCoursesForm from "@/components/StudentProfile/Forms/StudentCoursesForm.vue";

export default {
  name: "StudentCourses_BETA",
  components: {
    StudentCoursesForm,
    StudentCoursesDeleteForm,
  },
  computed: {
    ...mapState(useStudentStore, {
      courses: "studentCourses",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      hasGradStatusPendingUpdates: "getHasGradStatusPendingUpdates",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    courseDetailsMap() {
      return {
        language: "Instruction Language",
        startDate: "Start Date",
        endDate: "End Date",
        numCredits: "Credits",
        workExpFlag: "Work Experience",
        genericCourseType: "Generic Course Type",
      };
    },
    expandedDetailsMap() {
      return {
        customizedCourseName: "Customized Course Title",
        relatedCourse: "Related Course",
        relatedLevel: "Related Course Level",
        relatedCourseName: "Related Course Name",
        alternateCourseName: "Alternate Course Name",
        bestSchoolPercent: "Best School Percent",
        bestExamPercent: "Best Exam Percent",
        metLitNumRequirement: "Assessment Equivalent",
        specialCase: "Special Case",
      };
    },
  },
  watch: {
    courses() {
      //reset selected when course list is refreshed
      this.selected = [];
    },
  },
  data() {
    return {
      selected: [],
      editDialog: {},
      fields: [
        { key: "data-table-expand", title: "", sortable: false },
        { key: "id", title: "ID", sortable: true },
        { key: "courseCode", title: "Code", sortable: true },
        { key: "courseLevel", title: "Level", sortable: true },
        { key: "courseSession", title: "Session", sortable: true },
        {
          key: "interimPercent",
          title: "%",
          sortable: true,
          class: "text-md-right",
        },
        { key: "interimLetterGrade", title: "LG", sortable: true },
        {
          key: "completedCoursePercentage",
          title: "%",
          sortable: true,
          class: "text-md-right",
        },
        { key: "completedCourseLetterGrade", title: "LG", sortable: true },
        { key: "equivOrChallenge", title: "Ch", sortable: true },
        { key: "credits", title: "Credits", sortable: true },
        { key: "fineArtsAppliedSkills", title: "As", sortable: true },
        { key: "courseName", title: "Course Title", sortable: true },
        { key: "edit", title: "Edit" },
        { key: "delete", title: "Delete" },
      ],
    };
  },
  methods: {
    ...mapActions(useStudentStore, [
      "setHasGradStatusPendingUpdates",
      "deleteStudentCourses",
    ]),
    closeEditModal(modalKey) {
      this.editDialog[modalKey] = false;
    },
    saveStudentCourse(modalKey) {
      console.log("TODO: Submit edits for student course");
      this.closeEditModal(modalKey);
    },
  },
};
</script>

<style scoped>
.width-fit-content {
  width: fit-content;
}
.v-btn-link {
  text-transform: none;
  justify-content: flex-start;
}
</style>
