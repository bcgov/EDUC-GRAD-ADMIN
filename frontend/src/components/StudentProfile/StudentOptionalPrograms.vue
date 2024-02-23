<template>
  <div>
    <b-alert variant="primary" show
      ><i class="fa-solid fa-circle-info"></i> This student is on the
      <strong>{{ studentGradStatus.program }}</strong> Graduation
      Program</b-alert
    >
    <div class="table-responsive">
      <div v-if="!optionalPrograms" class="container">
        This student does not have any optional programs.
      </div>
      <DisplayTable
        v-if="optionalPrograms"
        id="optionalProgramID"
        :items="optionalPrograms"
        :striped="false"
        :fields="optionalProgramsfields"
        showFilter="true"
        title="Optional Programs"
        disableDeletefield="optionalProgramCode"
        disableDeleteIfValue="CP"
        deleteLabel="Delete"
        store="student"
        delete="removeOptionalProgram"
      >
        <template v-slot:create>
          <OptionalProgramsForm></OptionalProgramsForm>
        </template>

        <template #cell(optionalNonGradReasons)="row">
          <div v-if="row.item.studentOptionalProgramData">
            <div
              v-if="
                row.item.studentOptionalProgramData.optionalNonGradReasons ==
                  null &&
                row.item.studentOptionalProgramData.optionalRequirementsMet !=
                  null
              "
            >
              <span
                v-if="
                  row.item.studentOptionalProgramData.optionalRequirementsMet
                    .length != 0
                "
                >All requirements have been met</span
              >
            </div>
            <div v-else>
              <div
                class="p-2"
                v-if="
                  row.item.studentOptionalProgramData.optionalNonGradReasons &&
                  row.item.studentOptionalProgramData.optionalNonGradReasons
                    .length == 0 &&
                  row.item.studentOptionalProgramData.optionalRequirementsMet
                    .length > 0
                "
              >
                All requirements have been met
              </div>
            </div>
            <span
              v-if="
                row.item.studentOptionalProgramData.optionalNonGradReasons &&
                row.item.studentOptionalProgramData.optionalNonGradReasons
                  .length == 0 &&
                row.item.studentOptionalProgramData.optionalRequirementsMet &&
                row.item.studentOptionalProgramData.optionalRequirementsMet
                  .length == 0
              "
              >n/a</span
            >
          </div>
          <ul
            v-if="
              row.item.studentOptionalProgramData &&
              row.item.studentOptionalProgramData.optionalNonGradReasons != null
            "
            id="optionalNonGradReasons"
          >
            <li
              v-for="optionalNonGradReasons in row.item
                .studentOptionalProgramData.optionalNonGradReasons"
              :key="optionalNonGradReasons.rule"
            >
              <strong
                >{{ optionalNonGradReasons.rule }} -
                {{ optionalNonGradReasons.description }}</strong
              >
            </li>
          </ul>
          <div v-else>n/a</div>
        </template>
        <template #cell(optionalProgramName)="row">
          <div class="pt-2">
            {{ row.item.optionalProgramName }} ({{
              row.item.optionalProgramCode
            }}) <br />
            {{ $filters.formatTime(row.item.OptionalProgramCompletionDate) }}
          </div>
        </template>
        <template #cell(optionalReqMet)="row">
          <div v-if="row.item.studentOptionalProgramData">
            <b-table
              v-if="
                row.item.optionalProgramCode == 'BC' ||
                row.item.optionalProgramCode == 'BD' ||
                row.item.optionalProgramCode == 'AN' ||
                row.item.optionalProgramCode == 'AD' ||
                row.item.programCode == 'SCCP'
              "
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalRequirementsMet
              "
              :fields="fields"
              thead-class="d-none"
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.rule }}</strong> -
                  {{ row2.item.description }}
                </div>
              </template>
            </b-table>
            <b-table
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalStudentCourses
                  .studentCourseList
              "
              :fields="fields"
              filter="null"
              :filter-function="filterGradReqCourses"
              thead-class="d-none"
              v-if="row.item.studentOptionalProgramData.optionalStudentCourses"
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.gradReqMetDetail }}</strong
                  ><br />
                  {{ row2.item.courseCode }} {{ row2.item.courseLevel }} -
                  {{ $filters.formatYYYYMMDate(row2.item.sessionDate) }} ({{
                    row2.item.courseName
                  }})
                </div>
              </template>
            </b-table>
            <b-table
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalStudentAssessments
                  .studentAssessmentList
              "
              :fields="fields"
              filter="null"
              :filter-function="filterGradReqCourses"
              thead-class="d-none"
              v-if="
                row.item.studentOptionalProgramData.optionalStudentAssessments
              "
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.gradReqMetDetail }}</strong
                  ><br />
                  {{ row2.item.assessmentCode }} -
                  {{ $filters.formatYYYYMMDate(row2.item.sessionDate) }} ({{
                    row2.item.assessmentName
                  }})
                </div>
              </template>
            </b-table>
          </div>
        </template>
        <template #cell(more)="row">
          <b-btn
            v-if="
              row.item.optionalProgramName ==
                '2018 Graduation Program Career Program' ||
              row.item.optionalProgramName == 'Adult Career Program' ||
              row.item.optionalProgramName == 'Career Program'
            "
            variant="outline primary"
            style="color: #666"
            size="sm"
            @click="row.toggleDetails"
            class="more-button"
          >
            <img
              v-show="!row.detailsShowing"
              src="../../assets/images/icon-right.svg"
              width="9"
              aria-hidden="true"
              alt=""
            />
            <img
              v-show="row.detailsShowing"
              src="../../assets/images/icon-down.svg"
              height="5"
              aria-hidden="true"
              alt=""
            />
          </b-btn>
        </template>
        <template #row-details="">
          <!-- <b-card class="px-0">
            <strong>Career Programs</strong>
            <hr />
            <ul id="student-career-programs">
              <li v-for="item in careerPrograms" :key="item.careerProgramName">
                {{ item.careerProgramName }} ({{ item.careerProgramCode }})
              </li>
            </ul>
          </b-card> -->
          <b-card class="col-6">
            <DisplayTable
              v-if="careerPrograms"
              :items="careerPrograms"
              :striped="false"
              :fields="careerProgramsFields"
              :showFilter="false"
              :pagination="false"
              title="Career Programs"
            >
              <template #cell(careerProgramName)="row3">
                {{ row3.item.careerProgramName }}
                ({{ row3.item.careerProgramCode }})
              </template>
            </DisplayTable>
          </b-card>
        </template>
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import { useStudentStore } from "../../store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
import OptionalProgramsForm from "@/components/Forms/OptionalProgramsForm.vue";
export default {
  name: "StudentOptionalPrograms",
  components: {
    DisplayTable: DisplayTable,
    OptionalProgramsForm: OptionalProgramsForm,
  },

  computed: {
    ...mapState(useStudentStore, {
      optionalPrograms: "getStudentOptionalPrograms",
      careerPrograms: "getStudentCareerPrograms",
      studentGradStatus: "getStudentGradStatus",
    }),
  },
  data: function () {
    return {
      fields: [
        {
          key: "gradReqMetDetail",
          label: "Grad Requirement Met",
          class: "text-left",
        },
      ],
      optionalProgramsfields: [
        { key: "more", label: "" },
        { key: "programCode", label: "Graduation Program" },
        { key: "optionalProgramName", label: "Optional Program" },
        { key: "optionalReqMet", label: "Requirements Met" },
        { key: "optionalNonGradReasons", label: "Requirements Not Met" },
        {
          key: "optionalProgramCompletionDate",
          label: "Optional Program Completion Date",
        },
        { key: "delete", label: "Delete" },
      ],
      careerProgramsFields: [
        { key: "careerProgramName", label: "Career Program" },
        { key: "delete", label: "Delete" },
      ],
    };
  },
  methods: {
    filterGradReqCourses(row) {
      if (row.gradReqMet.length > 0) {
        return true;
      }
    },
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
</style>
