<template>
  <div>
    <div class="table-responsive">
      <div v-if="!courses" class="container">
        This student does not have any courses.
      </div>
      <DisplayTable
        v-if="courses"
        :items="courses"
        :fields="fields"
        :id="id"
        showFilter="true"
        title="studentCourse"
        :delete="{
          disable: {
            condition: 'OR',
            criteria: [],
          },
          label: 'Delete',
          action: 'removeStudentCourse',
        }"
      >
        <!-- <template #thead-top="">
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
        </template> -->
        <!-- <template #cell(sessionDate)="row">
          {{ $filters.formatYYYYMMDate(row.value) }}
        </template>
        <template #cell(courseName)="row">
          <b-btn
            v-b-modal="
              item.raw.courseCode +
              item.raw.courseLevel +
              item.raw.sessionDate +
              'modal'
            "
            variant="link"
            >{{ item.raw.courseName }}</b-btn
          >

          <b-modal
            :id="
              item.raw.courseCode +
              item.raw.courseLevel +
              item.raw.sessionDate +
              'modal'
            "
            :title="item.raw.courseName"
            ok-title="Close"
            ok-only
          >
            <div class="row py-1">
              <div class="col">
                <strong>Instruction Language:</strong>
              </div>
              <div class="col">{{ item.raw.courseDetails.language }}</div>
            </div>
            <div class="row py-1">
              <div class="col"><strong>Start Date:</strong></div>
              <div class="col">
                {{
                  $filters.formatSimpleDate(item.raw.courseDetails.startDate)
                }}
              </div>
            </div>
            <div class="row py-1">
              <div class="col"><strong>End Date:</strong></div>
              <div class="col">
                {{ $filters.formatSimpleDate(item.raw.courseDetails.endDate) }}
              </div>
            </div>
            <div class="row py-1">
              <div class="col"><strong>Credits:</strong></div>
              <div class="col">{{ item.raw.courseDetails.numCredits }}</div>
            </div>
            <div class="row py-1">
              <div class="col"><strong>Work Experience:</strong></div>
              <div class="col">
                {{ item.raw.courseDetails.workExpFlag }}
              </div>
            </div>
            <div class="row py-1">
              <div class="col">
                <strong>Generic Course Type:</strong>
              </div>
              <div class="col">
                {{ item.raw.courseDetails.genericCourseType }}
              </div>
            </div>
          </b-modal>
        </template> -->

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <ul v-if="item.raw.hasRelatedCourse">
                <li v-if="item.raw.customizedCourseName">
                  <strong>Customized Course Title:</strong>
                  {{ item.raw.customizedCourseName }}
                </li>
                <li v-if="item.raw.relatedCourse">
                  <strong>Related Course:</strong>
                  {{ item.raw.relatedCourse }}
                </li>
                <li v-if="item.raw.relatedLevel">
                  <strong>Related Course Level:</strong>
                  {{ item.raw.relatedLevel }}
                </li>
                <li v-if="item.raw.relatedCourseName">
                  <strong>Related Course Name:</strong>
                  {{ item.raw.relatedCourseName }}
                </li>
                <li v-if="item.raw.alternateCourseName">
                  <strong>Alternate Course Name:</strong>
                  {{ item.raw.alternateCourseName }}
                </li>
                <li v-if="item.raw.bestSchoolPercent">
                  <strong>Best School Percent:</strong>
                  {{ item.raw.bestSchoolPercent }}
                </li>
                <li v-if="item.raw.bestExamPercent">
                  <strong>Best Exam Percent:</strong>
                  {{ item.raw.bestExamPercent }}
                </li>
                <li v-if="item.raw.metLitNumRequirement">
                  <strong>Assessment Equivalent:</strong>
                  {{ item.raw.metLitNumRequirement }}
                </li>
                <li v-if="item.raw.specialCase">
                  <strong>Special Case:</strong> {{ item.raw.specialCase }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import { useStudentStore } from "../../store/modules/student";
import { mapState, mapActions } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentCourses",
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    ...mapState(useStudentStore, {
      courses: "getStudentCourses",
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
    ...mapActions(useStudentStore, [
      "setHasGradStatusPendingUpdates",
      "setHasGradStatusPendingUpdates",
    ]),
    openModal(courseCode) {
      // Set the data property to true to show the modal
      this.modalState = true;
      // You can do something with courseCode if needed
    },
    closeModal() {
      // Set the data property to false to close the modal
      this.modalState = false;
    },
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
