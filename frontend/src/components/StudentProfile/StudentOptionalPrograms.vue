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
        id="optionalProgramID"
        :items="optionalPrograms"
        :striped="false"
        :fields="computedOptionalProgramsFields"
        showFilter="true"
        title="Optional Programs"
        :useIconButtons="true"
        :deleteOptions="{
          disableDeletefield: 'optionalProgramCode',
          disableDeleteIfValue: 'CP',
          deleteLabel: 'Optional Program',
          deleteConfirm: 'true',
          disableDeleteBtn: disableDeleteBtn(),
        }"
        store="student"
        delete="removeStudentOptionalProgram"
      >
        <template v-slot:create>
          <OptionalProgramsForm></OptionalProgramsForm>
        </template>

        <template #delete-msg="{ optionalProgramName, optionalProgramCode }">
          <!-- ERROR if student status is MER/merged-->
          <b-alert
            variant="danger"
            show
            v-if="studentGradStatus.studentStatus === 'MER'"
          >
            <i class="fa-solid fa-circle-xmark"></i>&nbsp;
            <strong>Error</strong>
            <p>This student is showing as merged.</p>
            <p>
              Student GRAD Optional Program data cannot be updated for students
              with a status of "MER" merged.
            </p>
          </b-alert>
          <!-- ERROR if student grad program is complete -->
          <b-alert
            variant="danger"
            show
            v-else-if="
              isProgramComplete(
                studentGradStatus.programCompletionDate,
                studentGradStatus.program
              )
            "
          >
            <i class="fa-solid fa-circle-xmark"></i>&nbsp;
            <strong>Error</strong>
            <p>
              This student has a program completion date of
              {{ studentGradStatus.programCompletionDate }}.
            </p>
            <p>
              You must undo completion to be able to edit the Optional Programs
              for this student.
            </p>
          </b-alert>
          <!-- WARNING if student status is TER/terminated -->
          <b-alert
            variant="warning"
            show
            v-else-if="studentGradStatus.studentStatus === 'TER'"
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>This student has been terminated.</p>
            <p>
              Re-activate by setting their status to "CUR" if they are currently
              attending school.
            </p>
          </b-alert>
          <!-- WARNING if student status is ARC/archived -->
          <b-alert
            variant="warning"
            show
            v-else-if="studentGradStatus.studentStatus === 'ARC'"
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>This student is not active.</p>
            <p>
              Re-activate by setting their status to "CUR" if they are currently
              attending school.
            </p>
          </b-alert>
          <!-- WARNING if student status is DEC/deceased -->
          <b-alert
            variant="warning"
            show
            v-else-if="studentGradStatus.studentStatus === 'DEC'"
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>This student is showing as deceased.</p>
          </b-alert>

          <!-- WARNING if student optional program is able to be deleted -->
          <b-alert
            variant="warning"
            show
            v-if="
              !(
                studentGradStatus.studentStatus === 'MER' ||
                isProgramComplete(
                  studentGradStatus.programCompletionDate,
                  studentGradStatus.program
                )
              )
            "
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>
              You are about to remove the
              <strong
                >{{ optionalProgramName }} ({{ optionalProgramCode }})</strong
              >
              Optional Program for this student.
            </p>
          </b-alert>
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
          <b-card class="col-6">
            <DisplayTable
              v-if="careerPrograms"
              id="careerProgramCode"
              :items="careerPrograms"
              :striped="false"
              :fields="computedCareerProgramsFields"
              :showFilter="false"
              :pagination="false"
              title="Career Programs"
              :useIconButtons="true"
              :deleteOptions="{
                disableDeletefield: '',
                disableDeleteIfValue: '',
                deleteLabel: 'Career Program',
                deleteConfirm: 'true',
                disableDeleteBtn: disableDeleteBtn(),
              }"
              store="student"
              delete="removeStudentCareerProgram"
            >
              <template #delete-msg="{ careerProgramName, careerProgramCode }">
                <!-- ERROR if student status is MER/merged-->
                <b-alert
                  variant="danger"
                  show
                  v-if="studentGradStatus.studentStatus === 'MER'"
                >
                  <i class="fa-solid fa-circle-xmark"></i>&nbsp;
                  <strong>Error</strong>
                  <p>This student is showing as merged.</p>
                  <p>
                    Student GRAD Career Program data cannot be updated for
                    students with a status of "MER" merged.
                  </p>
                </b-alert>
                <!-- ERROR if student grad program is complete -->
                <b-alert
                  variant="danger"
                  show
                  v-else-if="
                    isProgramComplete(
                      studentGradStatus.programCompletionDate,
                      studentGradStatus.program
                    )
                  "
                >
                  <i class="fa-solid fa-circle-xmark"></i>&nbsp;
                  <strong>Error</strong>
                  <p>
                    This student has a program completion date of
                    {{ studentGradStatus.programCompletionDate }}.
                  </p>
                  <p>
                    You must undo completion to be able to edit the Career
                    Programs for this student.
                  </p>
                </b-alert>
                <!-- WARNING if student status is TER/terminated -->
                <b-alert
                  variant="warning"
                  show
                  v-else-if="studentGradStatus.studentStatus === 'TER'"
                >
                  <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
                  <strong>Warning</strong>
                  <p>This student has been terminated.</p>
                  <p>
                    Re-activate by setting their status to "CUR" if they are
                    currently attending school.
                  </p>
                </b-alert>
                <!-- WARNING if student status is ARC/archived -->
                <b-alert
                  variant="warning"
                  show
                  v-else-if="studentGradStatus.studentStatus === 'ARC'"
                >
                  <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
                  <strong>Warning</strong>
                  <p>This student is not active.</p>
                  <p>
                    Re-activate by setting their status to "CUR" if they are
                    currently attending school.
                  </p>
                </b-alert>
                <!-- WARNING if student status is DEC/deceased -->
                <b-alert
                  variant="warning"
                  show
                  v-else-if="studentGradStatus.studentStatus === 'DEC'"
                >
                  <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
                  <strong>Warning</strong>
                  <p>This student is showing as deceased.</p>
                </b-alert>
                <!-- WARNING if student career program is able to be deleted -->
                <b-alert
                  variant="warning"
                  show
                  v-if="
                    !(
                      studentGradStatus.studentStatus === 'MER' ||
                      isProgramComplete(
                        studentGradStatus.programCompletionDate,
                        studentGradStatus.program
                      )
                    )
                  "
                >
                  <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
                  <strong>Warning</strong>
                  <p>
                    You are about to remove the
                    <strong
                      >{{ careerProgramName }} ({{ careerProgramCode }})</strong
                    >
                    Career Program for this student.
                  </p>
                </b-alert>
              </template>
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
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { mapState } from "pinia";
import { isProgramComplete } from "@/utils/common.js";
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
    ...mapState(useAccessStore, {
      allowOptionalProgramUpdate: "allowOptionalProgramUpdate",
    }),
    computedOptionalProgramsFields() {
      return this.optionalProgramsfields.filter((field) =>
        this.allowOptionalProgramUpdate ? true : field.key != "delete"
      );
    },
    computedCareerProgramsFields() {
      return this.careerProgramsFields.filter((field) =>
        this.allowOptionalProgramUpdate ? true : field.key != "delete"
      );
    },
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
        { key: "delete", label: null },
      ],
      careerProgramsFields: [
        { key: "careerProgramName", label: "Career Program" },
        { key: "delete", label: null },
      ],
    };
  },
  methods: {
    isProgramComplete(date, program) {
      return isProgramComplete(date, program);
    },
    disableDeleteBtn() {
      return (
        this.studentGradStatus.studentStatus === "MER" ||
        this.isProgramComplete(
          this.studentGradStatus.programCompletionDate,
          this.studentGradStatus.program
        )
      );
    },
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
