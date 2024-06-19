<template>
  <div>
    <slot></slot>
    <div>
      <v-card no-body header="Assessment Requirements">
        <v-card-text class="p-3">
          <h3>Assessment Requirements</h3>
          <DisplayTable
            v-if="hasGradStatus"
            :items="gradStatusAssessments"
            :fields="fields2"
            showFilter="true"
          >
            <template v-slot:item.gradReqMet="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  {{ item.raw.gradReqMet }}
                </div>
              </div>
            </template>
          </DisplayTable>
        </v-card-text>
      </v-card>
      <v-card no-body header="Course Requirements">
        <v-card-text class="p-3">
          <h3>Course Requirements</h3>
          <DisplayTable
            v-if="hasGradStatus && gradStatusCourses"
            :items="gradStatusCourses"
            :fields="fields"
            showFilter="true"
          >
            <template v-slot:item.gradReqMet="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  {{ item.raw.gradReqMet }}
                </div>
              </div>
            </template>
            <template v-slot:item.gradReqMetDetail="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="">
                  {{
                    item.raw.gradReqMetDetail ? item.raw.gradReqMetDetail : " "
                  }}
                </div>
              </div>
            </template>
          </DisplayTable>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStudentStore } from "../../store/modules/student";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "GRADRequirementDetails",
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    ...mapState(useStudentStore, {
      courses: "getStudentCourses",
      gradStatusCourses: "gradStatusCourses",
      gradStatusAssessments: "gradStatusAssessments",
      studentRequirementDetailGRADStudentCoursess: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      hasGradStatusPendingUpdates: "getHasGradStatusPendingUpdates",
    }),
  },
  data: function () {
    return {
      fields2: [
        {
          key: "assessmentCode",
          title: "Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "assessmentName",
          title: "Name",
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
          key: "specialCase",
          title: "Special Case",
          sortable: true,
          class: "text-left",
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          class: "text-left",
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReqMet",
          title: "Reqts Met",
          sortable: true,
          class: "text-left",
          sortByFormatted: true,
          formatter: (value, key, item) => {
            let formattedValue = value;

            if (!item.used) {
              formattedValue = "Not Used";
            }
            if (item.notCompleted) {
              formattedValue += ", No Attempt";
            }
            if (item.projected) {
              formattedValue += ", Registration";
            }
            if (item.failed) {
              formattedValue += ", Not Completed";
            }
            if (item.duplicate) {
              formattedValue += ", Repeat";
            }

            return formattedValue;
          },
        },
        {
          key: "gradReqMetDetail",
          title: "Reqt Name",
          sortable: true,
          class: "text-left",
        },
      ],
      fields: [
        { key: "more", title: "" },
        {
          key: "courseCode",
          title: "Code",
          sortable: true,
          class: "text-left",
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
          title: "Interim %",
          class: "text-md-center",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCoursePercentage",
          title: "Completed Course %",
          class: "text-md-center ",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCourseLetterGrade",
          title: "LG",
          class: "text-md-center",
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
          key: "gradReqMet",
          title: "Reqts Met",
          sortable: true,
          class: "text-left",
          sortByFormatted: true,
          formatter: (value, key, item) => {
            let formattedValue = value;

            if (!item.used) {
              formattedValue = "Not Used";
            }
            if (item.notCompleted) {
              formattedValue += ", Incomplete Course";
            }
            if (item.projected) {
              formattedValue += ", Registration or Interim";
            }
            if (item.failed) {
              formattedValue += ", Failed";
            }
            if (item.duplicate) {
              formattedValue += ", Repeat";
            }
            if (item.careerPrep) {
              formattedValue += ", Career Prep course";
            }
            if (item.locallyDeveloped) {
              formattedValue += ", Locally Developed course";
            }
            if (item.boardAuthorityAuthorized) {
              formattedValue += ", Board/Authority Authorized Course";
            }
            if (item.cutOffCourse) {
              formattedValue += ", Course taken after Program Expiry Date";
            }
            if (item.grade10Course) {
              formattedValue += ", Grade 10 ineligible (1995 program)";
            }
            if (item.lessCreditCourse) {
              formattedValue += ", Courses with credits < 4 ineligible";
            }
            if (item.restricted) {
              formattedValue += ", Course restricted against another course";
            }
            if (item.independentDirectedStudies) {
              formattedValue += ", Independent Directed Studies course";
            }

            return formattedValue;
          },
        },
        {
          key: "gradReqMetDetail",
          title: "Reqt Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "creditsUsedForGrad",
          title: "Credits Used",
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
    createRef(pen, code, level, sessionDate) {
      return pen.trim() + code.trim() + level.trim() + sessionDate.trim();
    },
  },
};
</script>

<style scoped>
.table :deep(th),
.table :deep(td) {
  border-top: none !important;
}

.table :deep(th) svg {
  display: none !important;
}

:deep(.highlight) {
  background: aliceblue !important;
}
:deep(.card-header) {
  font-weight: 700 !important;
}
.gradReqsMet :deep(span + span::before) {
  content: ", ";
}
.gradstatus-tabs .card {
  margin-top: 70px;
}
</style>
