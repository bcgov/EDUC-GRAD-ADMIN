<template>
  <div>
    <slot></slot>
    <div>
      <b-card no-body header="Assessment Requirements">
        <b-card-text class="p-3">
          <DisplayTable
            v-if="hasGradStatus"
            :items="gradStatusAssessments"
            :fields="fields2"
            showFilter="true"
            title="RequirementDetailsAssessments"
          >
            <template #cell(gradReqMet)="row">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  <span v-if="row.item.used">
                    {{ row.item.gradReqMet ? row.item.gradReqMet : "" }}
                  </span>
                  <span v-if="!row.item.used">Not Used</span>
                  <span v-if="row.item.notCompleted">No Attempt</span>
                  <span v-if="row.item.projected">Registration</span>
                  <span v-if="row.item.failed">Not Completed</span>
                  <span v-if="row.item.duplicate">Repeat</span>
                </div>
              </div>
            </template>
          </DisplayTable>
        </b-card-text>
      </b-card>
      <b-card no-body header="Course Requirements">
        <b-card-text class="p-3">
          <DisplayTable
            v-if="hasGradStatus && gradStatusCourses"
            :items="gradStatusCourses"
            :fields="fields"
            showFilter="true"
            title="RequirementDetailsCourses"
          >
            <template #cell(gradReqMet)="row">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  {{row.value}}
                </div>
              </div>
            </template>
            <template #cell(gradReqMetDetail)="row">
              <div class="d-flex flex-column text-md-left">
                <div class="">
                  {{
                    row.item.gradReqMetDetail ? row.item.gradReqMetDetail : " "
                  }}
                </div>
              </div>
            </template>
          </DisplayTable>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "GRADRequirementDetails",
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    ...mapGetters({
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
          label: "Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "assessmentName",
          label: "Name",
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
          key: "specialCase",
          label: "Special Case",
          sortable: true,
          class: "text-left",
        },
        {
          key: "exceededWriteFlag",
          label: "Exceeded Writes",
          sortable: true,
          class: "text-left",
        },
        {
          key: "proficiencyScore",
          label: "Proficiency Score",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReqMet",
          label: "Reqts Met",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReqMetDetail",
          label: "Reqt Name",
          sortable: true,
          class: "text-left",
        },
      ],
      fields: [
        { key: "more", label: "" },
        {
          key: "courseCode",
          label: "Code",
          sortable: true,
          class: "text-left",
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
          label: "Interim %",
          class: "text-md-center",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCoursePercentage",
          label: "Completed Course %",
          class: "text-md-center ",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedCourseLetterGrade",
          label: "LG",
          class: "text-md-center",
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
          key: "gradReqMet",
          label: "Reqts Met",
          sortable: true,
          class: "text-left",
          sortByFormatted: true,
          formatter: (value, key, item) => {
            let formattedValue = value;

            if (!item.used) {
              formattedValue = "Not Used";
            }
            if (item.notCompleted) {
              formattedValue += ", Incomplete Course"
            }
            if (item.projected) {
              formattedValue += ", Registration or Interim"
            }
            if (item.failed) {
              formattedValue += ", Failed"
            }
            if (item.duplicate) {
              formattedValue += ", Repeat"
            }
            if (item.careerPrep) {
              formattedValue += ", Career Prep course"
            }
            if (item.locallyDeveloped) {
              formattedValue += ", Locally Developed course"
            }
            if (item.boardAuthorityAuthorized) {
              formattedValue += ", Board/Authority Authorized Course"
            }
            if (item.cutOffCourse) {
              formattedValue += ", Course taken after Program Expiry Date"
            }
            if (item.grade10Course) {
              formattedValue += ", Grade 10 ineligible (1995 program)"
            }
            if (item.lessCreditCourse) {
              formattedValue += ", Courses with credits &lt; 4 ineligible"
            }
            if (item.restricted) {
              formattedValue += ", Course restricted against another course"
            }

            return formattedValue;
          },
        },
        {
          key: "gradReqMetDetail",
          label: "Reqt Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "creditsUsedForGrad",
          label: "Credits Used",
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
.card-header {
  font-weight: 700 !important;
}
.gradReqsMet span + span::before {
  content: ", ";
}
.gradstatus-tabs .card {
  margin-top: 70px;
}
</style>
