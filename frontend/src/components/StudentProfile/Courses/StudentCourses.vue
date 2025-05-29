<template>
  <div>
    <v-card>
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
        v-if="environment == 'local' || environment == 'dev'"
        color="debug"
        variant="tonal"
        icon="mdi-progress-wrench"
        border="start"
        class="mt-6 mb-0 ml-1 py-3 width-fit-content"
      >
        Data shown is using new endpoint in student API. Waiting on backend to
        send us course code and level so we don't need to translate each row
        item based on student course GUID
        <br />
      </v-alert>
      <v-card-text>
        <v-alert v-if="!courses" class="container">
          This student does not have any courses.
        </v-alert>
        <v-row no-gutters>
          <StudentCoursesDeleteForm
            courseBatchDelete
            :selectedCoursesToDelete="selected"
          >
          </StudentCoursesDeleteForm>
          <v-spacer />
          <StudentCoursesCreateForm />
        </v-row>
        <v-data-table
          v-if="courses"
          v-model="selected"
          :items="courses"
          :headers="fields"
          :item-value="(item) => item"
          :items-per-page="'-1'"
          title="studentCourse"
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
              >
              </v-btn>
            </td>
          </template>
          <!-- GRAD2-2811 will use this slot when we get new endpoints  -->
          <template v-slot:item.courseName="{ item }">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      color="surface-variant"
                      :text="item.courseName"
                      variant="plain"
                      class="m-1 p-1 text-left v-btn-link"
                    ></v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card :title="item.courseName">
                      <v-card-text>
                        <div class="row py-1">
                          <div class="col">
                            <strong>Instruction Language:</strong>
                          </div>
                          <div class="col">
                            {{ item.courseDetails.language }}
                          </div>
                        </div>
                        <div class="row py-1">
                          <div class="col"><strong>Start Date:</strong></div>
                          <div class="col">
                            {{
                              $filters.formatSimpleDate(
                                item.courseDetails.startDate
                              )
                            }}
                          </div>
                        </div>
                        <div class="row py-1">
                          <div class="col"><strong>End Date:</strong></div>
                          <div class="col">
                            {{
                              $filters.formatSimpleDate(
                                item.courseDetails.endDate
                              )
                            }}
                          </div>
                        </div>
                        <div class="row py-1">
                          <div class="col"><strong>Credits:</strong></div>
                          <div class="col">
                            {{ item.courseDetails.numCredits }}
                          </div>
                        </div>
                        <div class="row py-1">
                          <div class="col">
                            <strong>Work Experience:</strong>
                          </div>
                          <div class="col">
                            {{ item.courseDetails.workExpFlag }}
                          </div>
                        </div>
                        <div class="row py-1">
                          <div class="col">
                            <strong>Generic Course Type:</strong>
                          </div>
                          <div class="col">
                            {{ item.courseDetails.genericCourseType }}
                          </div>
                        </div>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                          text="Close"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Dialog">
                  <v-card-text> </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <ul v-if="item.hasRelatedCourse">
                  <li v-if="item.customizedCourseName">
                    <strong>Customized Course Title:</strong>
                    {{ item.customizedCourseName }}
                  </li>
                  <li v-if="item.relatedCourse">
                    <strong>Related Course:</strong>
                    {{ item.relatedCourse }}
                  </li>
                  <li v-if="item.relatedLevel">
                    <strong>Related Course Level:</strong>
                    {{ item.relatedLevel }}
                  </li>
                  <li v-if="item.relatedCourseName">
                    <strong>Related Course Name:</strong>
                    {{ item.relatedCourseName }}
                  </li>
                  <li v-if="item.alternateCourseName">
                    <strong>Alternate Course Name:</strong>
                    {{ item.alternateCourseName }}
                  </li>
                  <li v-if="item.bestSchoolPercent">
                    <strong>Best School Percent:</strong>
                    {{ item.bestSchoolPercent }}
                  </li>
                  <li v-if="item.bestExamPercent">
                    <strong>Best Exam Percent:</strong>
                    {{ item.bestExamPercent }}
                  </li>
                  <li v-if="item.metLitNumRequirement">
                    <strong>Assessment Equivalent:</strong>
                    {{ item.metLitNumRequirement }}
                  </li>
                  <li v-if="item.specialCase">
                    <strong>Special Case:</strong> {{ item.specialCase }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>

          <template v-slot:item.edit="{ item }">
            <StudentCoursesUpdateForm :selectedCoursesToUpdate="[item]">
            </StudentCoursesUpdateForm>
          </template>
          <template v-slot:item.delete="{ item }">
            <StudentCoursesDeleteForm :selectedCoursesToDelete="[item]">
            </StudentCoursesDeleteForm>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import { useAccessStore } from "@/store/modules/access";
import { mapState, mapActions } from "pinia";
import StudentCoursesDeleteForm from "@/components/StudentProfile/Forms/StudentCoursesDeleteForm.vue";
import StudentCoursesCreateForm from "@/components/StudentProfile/Forms/StudentCoursesCreateForm.vue";
import StudentCoursesUpdateForm from "@/components/StudentProfile/Forms/StudentCoursesUpdateForm.vue";
export default {
  name: "StudentCourses",
  components: {
    StudentCoursesCreateForm: StudentCoursesCreateForm,
    StudentCoursesDeleteForm: StudentCoursesDeleteForm,
    StudentCoursesUpdateForm: StudentCoursesUpdateForm,
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
    ...mapState(useAppStore, { environment: "getEnvironment" }),
  },
  data: function () {
    return {
      toFilterItem: [
        "courseCode",
        "courseLevel",
        "courseSession",
        "courseName",
      ],
      fields: [
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
          sortDirection: "desc",
        },
        {
          key: "courseCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "courseLevel",
          title: "Level",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseSession",
          title: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "interimPercent",
          title: "%",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-right",
        },
        {
          key: "interimLetterGrade",
          title: "LG",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "completedCoursePercentage",
          title: "%",
          class: "text-md-right ",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCourseLetterGrade",
          title: "LG",
          class: "text-md-left",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "equivOrChallenge",
          title: "Ch",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "credits",
          title: "Credits",
          sortable: true,
          class: "text-center",
        },
        {
          key: "fineArtsAppliedSkills",
          title: "As",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseName",
          title: "Course Title",
          sortable: true,
          class: "text-left",
        },
        {
          key: "edit",
          title: "Edit",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        },
        {
          key: "delete",
          title: "Delete",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        },
      ],
      gradStatusPendingUpdates: [],
      show: false,
      opened: [],
      message: "",
      achievements: [],
      InputCourse: "",
      student: [],
      InputPen: "",
      modalState: false,
      filters: {
        name: {
          value: "",
          keys: ["courseCode"],
        },
      },
      selected: [],
      editDialog: {},
      deleteDialog: {},
      multiDeleteDialog: false,
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
    compareCourses(course1, course2) {
      this.fields.forEach(function (field) {
        if (course1[field] != course2[field]) {
          return false;
        }
      });
      return true;
    },
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}

.table th svg {
  display: none !important;
}

.highlight {
  background: aliceblue !important;
}

.top-row {
  border-bottom-style: hidden;
}

.popover-body div {
  min-width: fit-content;
}

.popover-body > div > div:nth-child(2) {
  text-align: right;
}
</style>
