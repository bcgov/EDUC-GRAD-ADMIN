<template>
  <div>
    <slot></slot>
    <div>
      <v-card no-body header="Assessment Requirements">
        <v-card-text class="p-3">
          <h3>Assessment Requirements</h3>
          <v-data-table
            v-if="hasGradStatus"
            :items="formattedGradStatusAssessments"
            :headers="reqAssessments"
            :items-per-page="-1"
            showFilter="true"
            hide-default-footer
          >
            <template v-slot:item.gradReqMet="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  {{ item.gradReqMet }}
                  <span v-if="item.used && item.used != true">{{
                    item.used
                  }}</span>
                  <span v-if="item.notCompleted">{{ item.notCompleted }}</span>
                  <span v-if="item.projected">{{ item.projected }}</span>
                  <span v-if="item.failed">{{ item.failed }}</span>
                  <span v-if="item.duplicate">{{ item.duplicate }}</span>
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-card no-body header="Course Requirements">
        <v-card-text class="p-3">
          <h3>Course Requirements</h3>
          <v-data-table
            v-if="hasGradStatus && gradStatusCourses"
            :items="formattedGradStatusCourses"
            :headers="reqCourses"
            :items-per-page="-1"
            showFilter="true"
            hide-default-footer
          >
            <template v-slot:item.gradReqMet="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="gradReqsMet">
                  {{ item.gradReqMet }}
                  <span v-if="item.used && item.used != true">{{
                    item.used
                  }}</span>
                  <span v-if="item.notCompleted">{{ item.notCompleted }}</span>
                  <span v-if="item.projected">{{ item.projected }}</span>
                  <span v-if="item.failed">{{ item.failed }}</span>
                  <span v-if="item.duplicate">{{ item.duplicate }}</span>
                  <span v-if="item.careerPrep">{{ item.careerPrep }}</span>
                  <span v-if="item.locallyDeveloped">{{
                    item.locallyDeveloped
                  }}</span>
                  <span v-if="item.boardAuthorityAuthorized">{{
                    item.boardAuthorityAuthorized
                  }}</span>
                  <span v-if="item.cutOffCourse">{{ item.cutOffCourse }}</span>
                  <span v-if="item.grade10Course">{{
                    item.grade10Course
                  }}</span>
                  <span v-if="item.lessCreditCourse">{{
                    item.lessCreditCourse
                  }}</span>
                  <span v-if="item.restricted">{{ item.restricted }}</span>
                  <span v-if="item.independentDirectedStudies">{{
                    item.independentDirectedStudies
                  }}</span>
                </div>
              </div>
            </template>
            <template v-slot:item.gradReqMetDetail="{ item }">
              <div class="d-flex flex-column text-md-left">
                <div class="">
                  {{ item.gradReqMetDetail ? item.gradReqMetDetail : " " }}
                </div>
              </div>
            </template>
          </v-data-table>
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
      formattedGradStatusCourses: "getFormattedGradStatusCourses",
      formattedGradStatusAssessments: "getFormattedGradStatusAssessments",
    }),
  },
  data: function () {
    return {
      reqAssessments: [
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

            if (!item.used || item.used == false) {
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
      reqCourses: [
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
