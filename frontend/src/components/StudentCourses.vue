<template>
  <div>
    <div class="table-responsive">
      <div v-if="!courses" class="container">
        This student does not have any courses.
      </div>
      <DisplayTable
        v-if="courses"
        :items="courses"
        v-bind:filterOn="toFilterItem"
        :fields="fields"
        showFilter="true"
        title="studentCourse"
      >
        <template #thead-top="">
          <b-tr class="table-row-header-group top-row">
            <b-th colspan="1" class="table-header-group text-center"></b-th>
            <b-th colspan="3" class="table-header-group text-center">
              <div></div
            ></b-th>
            <b-th colspan="2" class="table-header-group text-center">
              <div>Interim</div>
            </b-th>
            <b-th colspan="2" class="table-header-group text-center"
              ><div>Final</div></b-th
            >
            <b-th colspan="1">Eq/</b-th>
            <b-th colspan="1"></b-th>
            <b-th colspan="1">Fa</b-th>
          </b-tr>
        </template>
        <template #cell(courseName)="row">
          <div class="d-flex flex-column text-md-left">
            <div class="">
              <b-button
                :id="
                  'popover-button-event' +
                  row.item.courseCode +
                  row.item.courseLevel +
                  row.item.sessionDate
                "
                variant="link"
                class="m-0 p-0 text-left"
              >
                {{ row.item.courseName }}
              </b-button>
            </div>
            <b-popover
              :ref="
                'popover' +
                row.item.courseCode +
                row.item.courseLevel +
                row.item.sessionDate
              "
              triggers="focus"
              :target="
                'popover-button-event' +
                row.item.courseCode +
                row.item.courseLevel +
                row.item.sessionDate
              "
              :title="row.item.courseName"
            >
              <div class="row py-1">
                <div class="col-7">
                  <strong>Instruction Language:</strong>
                </div>
                <div class="col-5">{{ row.item.courseDetails.language }}</div>
              </div>
              <div class="row py-1">
                <div class="col-7"><strong>Start Date:</strong></div>
                <div class="col-5">
                  {{ row.item.courseDetails.startDate | formatSimpleDate }}
                </div>
              </div>
              <div class="row py-1">
                <div class="col-7"><strong>End Date:</strong></div>
                <div class="col-5">
                  {{ row.item.courseDetails.endDate | formatSimpleDate }}
                </div>
              </div>
              <div class="row py-1">
                <div class="col-7"><strong>Credits:</strong></div>
                <div class="col-5">{{ row.item.courseDetails.numCredits }}</div>
              </div>
              <div class="row py-1">
                <div class="col-7"><strong>Work Experience:</strong></div>
                <div class="col-5">
                  {{ row.item.courseDetails.workExpFlag }}
                </div>
              </div>
              <div class="row py-1">
                <div class="col-7">
                  <strong>Generic Course Type:</strong>
                </div>
                <div class="col-5">
                  {{ row.item.courseDetails.genericCourseType }}
                </div>
              </div>
            </b-popover>
          </div>
        </template>
        <template #cell(more)="row">
          <b-btn
            v-if="row.item.hasRelatedCourse == 'Y'"
            variant="outline primary"
            style="color: #666"
            size="sm"
            @click="row.toggleDetails"
            class="more-button"
          >
            <img
              v-show="!row.detailsShowing"
              src="../assets/images/icon-right.svg"
              width="9px"
              aria-hidden="true"
              alt=""
            />
            <img
              v-show="row.detailsShowing"
              src="../assets/images/icon-down.svg"
              height="5px"
              aria-hidden="true"
              alt=""
            />
          </b-btn>
        </template>
        <template #row-details="row">
          <b-card class="px-0">
            <ul>
              <li v-if="row.item.customizedCourseName">
                <strong>Customized Course Title:</strong>
                {{ row.item.customizedCourseName }}
              </li>
              <li v-if="row.item.relatedCourse">
                <strong>Related Course:</strong> {{ row.item.relatedCourse }}
              </li>
              <li v-if="row.item.relatedLevel">
                <strong>Related Course Level:</strong>
                {{ row.item.relatedLevel }}
              </li>
              <li v-if="row.item.relatedCourseName">
                <strong>Related Course name:</strong>
                {{ row.item.relatedCourseName }}
              </li>
              <li v-if="row.item.alternateCourseName">
                <strong>Alternate Course name:</strong>
                {{ row.item.alternateCourseName }}
              </li>
              <li v-if="row.item.bestSchoolPercent">
                <strong>Best School Percent:</strong>
                {{ row.item.bestSchoolPercent }}
              </li>
              <li v-if="row.item.bestExamPercent">
                <strong>Best Exam Percent:</strong>
                {{ row.item.bestExamPercent }}
              </li>
              <li v-if="row.item.metLitNumRequirement">
                <strong>Assessment Equivalent:</strong>
                {{ row.item.metLitNumRequirement }}
              </li>
              <li v-if="row.item.specialCase">
                <strong>Special case:</strong> {{ row.item.specialCase }}
              </li>
            </ul>
          </b-card>
        </template>
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentCourses",
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    ...mapGetters({
      courses: "student/getStudentCourses",
      gradStatusCourses: "student/gradStatusCourses",
      studentGradStatus: "student/getStudentGradStatus",
      hasGradStatus: "student/studentHasGradStatus",
      hasGradStatusPendingUpdates: "student/getHasGradStatusPendingUpdates",
    }),
  },
  data: function () {
    return {
      toFilterItem: ["courseCode", "courseLevel", "sessionDate", "courseName"],
      fields: [
        { key: "more", label: "" },
        {
          key: "courseCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "courseLevel",
          label: "Level",
          sortable: true,
          class: "text-left",
        },
        {
          key: "sessionDate",
          label: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "interimPercent",
          label: "%",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-right",
        },
        {
          key: "interimLetterGrade",
          label: "LG",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "completedCoursePercentage",
          label: "%",
          class: "text-md-right ",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCourseLetterGrade",
          label: "LG",
          class: "text-md-left",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "equivOrChallenge",
          label: "Ch",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "credits",
          label: "Credits",
          sortable: true,
          class: "text-center",
        },
        {
          key: "fineArtsAppliedSkills",
          label: "As",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseName",
          label: "Course title",
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
      filters: {
        name: {
          value: "",
          keys: ["courseCode"],
        },
      },
    };
  },
  methods: {
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
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
          this.$store.dispatch("student/setHasGradStatusPendingUpdates", true);
        } else {
          this.$store.dispatch("student/setHasGradStatusPendingUpdates", false);
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
</style>
