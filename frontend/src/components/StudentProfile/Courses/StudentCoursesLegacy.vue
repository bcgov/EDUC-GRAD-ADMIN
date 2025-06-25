<template>
  <div>
    <v-card>
      <v-card-text>
        <v-alert v-if="!courses" class="container">
          This student does not have any courses.
        </v-alert>
        <v-data-table
          v-if="courses"
          :items="courses"
          :headers="fields"
          :items-per-page="'-1'"
          showFilter="true"
          title="studentCourse"
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
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";
export default {
  name: "StudentCoursesLegacy",
  components: {},
  computed: {
    ...mapState(useStudentStore, {
      courses: "getStudentCoursesLegacy",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      hasGradStatusPendingUpdates: "getHasGradStatusPendingUpdates",
    }),
  },
  data: function () {
    return {
      toFilterItem: ["courseCode", "courseLevel", "sessionDate", "courseName"],
      fields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
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
          key: "sessionDate",
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
    };
  },
  methods: {
    ...mapActions(useStudentStore, ["setHasGradStatusPendingUpdates"]),
    openModal(courseCode) {
      // Set the data property to true to show the modal
      this.modalState = true;
      // You can do something with courseCode if needed
    },
    closeModal() {
      // Set the data property to false to close the modal
      this.modalState = false;
    },
    // toggle(id) {
    //   const index = this.opened.indexOf(id);
    //   if (index > -1) {
    //     this.opened.splice(index, 1);
    //   } else {
    //     this.opened.push(id);
    //   }
    // },
    checkForPendingUpdates() {
      if (this.hasGradStatus) {
        for (let i = 0; i < this.courses.length; i++) {
          this.courses[i].gradReqMet = this.getProgramCode(this.courses[i]);
        }
        //check for deleted courses
        for (let i = 0; i < this.gradStatusCourses.length; i++) {
          let courseDeleted = true;
          for (let j = 0; j < this.courses.length; j++) {
            if (
              this.courses[j].courseCode +
                this.courses[j].courseLevel +
                this.courses[j].sessionDate +
                this.courses[j].pen ==
              this.gradStatusCourses[i].courseCode +
                this.gradStatusCourses[i].courseLevel +
                this.gradStatusCourses[i].sessionDate +
                this.gradStatusCourses[i].pen
            ) {
              courseDeleted = false;
              break;
            }
          }
          if (courseDeleted) {
            this.gradStatusPendingUpdates.push(
              this.gradStatusCourses[i].courseName + "REMOVED"
            );
          }
        }

        if (this.gradStatusPendingUpdates.length) {
          this.setHasGradStatusPendingUpdates(true);
        } else {
          this.setHasGradStatusPendingUpdates(false);
        }
      }
    },
    compareCourses(course1, course2) {
      this.fields.forEach(function (field) {
        if (course1[field] != course2[field]) {
          return false;
        }
      });
      return true;
    },
    getProgramCode(course) {
      var result = this.gradStatusCourses.filter(function (gradStatusCourse) {
        return (
          gradStatusCourse.pen +
            gradStatusCourse.courseCode +
            gradStatusCourse.courseLevel +
            gradStatusCourse.sessionDate ==
          course.pen +
            course.courseCode +
            course.courseLevel +
            course.sessionDate
        );
      });
      if (!result.length) {
        this.gradStatusPendingUpdates.push(course.courseName + " ADDED");
        return "TBD - New Course Added";
      } else if (result[0].gradReqMet) {
        if (!this.compareCourses(result[0], course)) {
          //Course has been monified and not updated in the Grad Status Course List

          this.gradStatusPendingUpdates.push(course.courseName + "UPDATED");
          return "TBD - Modified";
        } else {
          return result[0].gradReqMet;
        }
      } else {
        return "---";
      }
    },
    createRef(pen, code, level, sessionDate) {
      return pen.trim() + code.trim() + level.trim() + sessionDate.trim();
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
