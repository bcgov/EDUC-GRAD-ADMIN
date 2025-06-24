<template>
  <div class="graduation-status">
    <v-btn
      v-if="hasPermissions('STUDENT', 'updateGradStatus')"
      @click="editGradStatus"
      :disabled="allSet || mergedStudent"
    >
      Edit
      <v-progress-circular v-if="searchLoading" indeterminate color="green">
      </v-progress-circular>
    </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <v-card no-body title="GRAD Status">
        <v-card-text class="p-3">
          <!-- Alerts -->
          <div class="alerts">
            <!-- Info callout in edit form when student status is MER/Merged -->
            <div v-if="mergedStudent">
              <v-alert
                type="info"
                variant="tonal"
                border="start"
                class="width-fix-content"
              >
                <h4 class="alert-heading">Student status: Merged</h4>
                <p class="locked-message">
                  This student's status is set to 'Merged'. Their data cannot be
                  changed.
                </p>
              </v-alert>
            </div>
            <!-- Warning callout in edit form when student status is N/Not Active -->
            <div
              v-if="
                studentGradStatus &&
                studentGradStatus.studentStatus == 'N' &&
                showEdit
              "
            >
              <v-alert
                type="warning"
                variant="tonal"
                border="start"
                class="width-fix-content"
              >
                <h4 class="alert-heading">Student status: Not active</h4>
                <p class="locked-message">
                  This student's status is set to 'Not active'. Re-activate
                  their record by setting their 'Student status' to 'Active' if
                  they are enrolled in a school.
                </p>
              </v-alert>
            </div>
            <!-- Warning callout in edit form when student status is TER/Terminated -->
            <div
              v-else-if="
                studentGradStatus &&
                studentGradStatus.studentStatus == 'TER' &&
                showEdit
              "
            >
              <v-alert
                type="warning"
                variant="tonal"
                border="start"
                class="width-fix-content"
              >
                <h4 class="alert-heading">Student status: Terminated</h4>
                <p class="locked-message">
                  This student's status is set to 'Terminated'. Re-activate
                  their record by setting their 'Student status' to 'Current' if
                  they are enrolled in a school.
                </p>
              </v-alert>
            </div>
            <!-- Warning callout in edit form when student status is ARC/Archived -->
            <div
              v-else-if="
                studentGradStatus &&
                studentGradStatus.studentStatus == 'ARC' &&
                showEdit
              "
            >
              <v-alert
                type="warning"
                variant="tonal"
                border="start"
                class="width-fix-content"
              >
                <h4 class="alert-heading">Student status: Archived</h4>
                <p class="locked-message">
                  This student is not active. Re-activate by setting their
                  status to "Current" if they are currently attending school
                </p>
              </v-alert>
            </div>
            <!-- Warning callout in edit form when student status is DEC/Deceased -->
            <div
              v-else-if="
                studentGradStatus &&
                studentGradStatus.studentStatus == 'DEC' &&
                showEdit
              "
            >
              <v-alert
                type="warning"
                variant="tonal"
                border="start"
                class="width-fix-content"
              >
                <h4 class="alert-heading">Student status: Deceased</h4>
                <p class="locked-message">
                  Warning: This student is showing as "Deceased".
                </p>
              </v-alert>
            </div>
          </div>
          <!-- Alerts End -->
          <!-- <p>$v: {{ v$ }}</p>
          <p>editedGradStatus: {{ editedGradStatus }}</p> -->
          <v-table
            style="max-width: 600px; width: 600px; margin: auto"
            class="pt-3"
            density="compact"
            aria-label="edit grad status"
          >
            <tbody>
              <!-- Program -->
              <tr>
                <td class="">
                  <strong>Program: </strong><br />
                  <!-- Warning if student grade is not AN or AD when on 1950 program -->
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus
                        .ifProgramIs1950studentGradeMustbeADorAN.$invalid ==
                      true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifProgramIs1950studentGradeMustbeADorAN.$message
                    }}
                  </div>
                  <!-- Warning if program changes that optional programs will be dropped from the student -->
                  <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus
                        .ifEditedGradStatusProgramHasChangedWarning.$invalid ==
                      true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifEditedGradStatusProgramHasChangedWarning.$message
                    }}
                  </div>
                  <!-- Warning if student is moved to a program that is closed-->
                  <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus.ifClosedProgramWarning.$invalid ==
                      true
                    "
                  >
                    {{ v$.editedGradStatus.ifClosedProgramWarning.$message }}
                  </div>
                  <v-select
                    data-cy="program-select"
                    :disabled="disableProgramInput"
                    v-model="editedGradStatus.program"
                    :items="programOptions"
                    item-title="programCode"
                    item-value="programCode"
                    label="Select"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  ></v-select>
                </td>
              </tr>

              <!-- END program edit -->
              <!-- Program completion date -->
              <tr>
                <td>
                  <strong>Program completion date: (YYYY-MM)</strong><br />
                  <!-- Warning if program completion date for SCCP is out of range -->
                  <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus
                        .ifProgramCompletionDatePriorToStartOfProgram
                        .$invalid == true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifProgramCompletionDatePriorToStartOfProgram.$message
                    }}
                  </div>
                  <!-- Warning if program completion date contains non-numeric values -->
                  <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus.ifProgramCompletionDateInvalid
                        .$invalid == true
                    "
                  >
                    {{
                      v$.editedGradStatus.ifProgramCompletionDateInvalid
                        .$message
                    }}
                  </div>
                  <v-text-field
                    data-cy="program-completion-date-textfield"
                    v-model="editedGradStatus.programCompletionDate"
                    label="Date"
                    maxLength="7"
                    density="compact"
                    variant="outlined"
                    clearable
                    class="mt-4"
                    :disabled="
                      editedGradStatus.program != 'SCCP' ||
                      (studentGradStatus.programCompletionDate &&
                        new Date(studentGradStatus.programCompletionDate) <=
                          new Date())
                    "
                  ></v-text-field>
                </td>
              </tr>
              <!-- END program completion date edit -->
              <!-- Student status -->
              <tr>
                <td>
                  <strong>Student status: </strong>
                  <br />
                  <v-select
                    data-cy="student-status-select"
                    v-model="editedGradStatus.studentStatus"
                    :items="studentStatusOptions"
                    item-title="label"
                    item-value="code"
                    label="Select"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  ></v-select>
                </td>
              </tr>
              <!-- END Student status edit -->
              <!-- Student grade -->
              <tr>
                <td>
                  <strong>Student grade: </strong><br />
                  <!-- Warning if student is not on 1950 program and grade is AN/AD.
                  *Note that we have existing SCCP students with AD/AN, but future students on SCCP program should not have a grade of AN/AD -->
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus
                        .ifProgramIsNot1950studentGradeCannotBeADorAN
                        .$invalid == true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifProgramIsNot1950studentGradeCannotBeADorAN.$message
                    }}
                  </div>
                  <v-select
                    data-cy="student-grade-select"
                    v-model="editedGradStatus.studentGrade"
                    :items="gradeOptions"
                    item-title="text"
                    item-value="value"
                    label="Select"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  ></v-select>
                </td>
              </tr>
              <!-- Student grade End-->
              <!-- School of record-->
              <tr>
                <td>
                  <strong>School of record:</strong><br />
                  <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus.ifSchoolOfRecordTranscriptEligibility
                        .$invalid == true
                    "
                  >
                    Please select a school
                  </div>
                  <!-- "Warning, Transcript Eligibility flag is not set to Y -->

                  <div hidden>
                    {{
                      v$.editedGradStatus.ifSchoolOfRecordTranscriptEligibility
                    }}
                    {{ v$.editedGradStatus.ifSchoolOfRecordGrades10To12 }}
                  </div>
                  <div
                    class="bg-warning"
                    v-if="warningFlags.schoolOfRecord10To12Warning == true"
                  >
                    Warning: School
                    {{
                      getSchoolMincodeById(editedGradStatus.schoolOfRecordId)
                    }}
                    is not reported with grade 10-12 enrolments.
                  </div>

                  <div
                    class="bg-warning"
                    v-if="warningFlags.schoolOfRecordTranscriptWarning == true"
                  >
                    Warning: School
                    {{
                      getSchoolMincodeById(editedGradStatus.schoolOfRecordId)
                    }}
                    is not authorized to issue Transcripts.
                  </div>

                  <!-- Warning if school of record missing; Samara to investigate if we use this since msg is same as scoolOfRecordWarning -->

                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus.ifSchoolOfRecordIsEmpty.$invalid ==
                      true
                    "
                  >
                    {{ v$.editedGradStatus.ifSchoolOfRecordIsEmpty.$message }}
                  </div>
                  <!-- Warning if school of record is closed NEW-->
                  <div v-if="warningFlags.schoolWarning" class="bg-warning">
                    This School is closed, changes should be to historical
                    activity only
                  </div>
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus.ifProgramIs1950AndOffshore.$invalid ==
                      true
                    "
                  >
                    {{
                      v$.editedGradStatus.ifProgramIs1950AndOffshore.$message
                    }}
                  </div>
                  <v-autocomplete
                    data-cy="school-of-record-autoselect"
                    v-model="editedGradStatus.schoolOfRecordId"
                    :disabled="disableSchoolOfRecord"
                    label="Select a school"
                    :items="getSchoolsList"
                    :item-title="schoolTitle"
                    item-value="schoolId"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  >
                    <template v-slot:label="label">
                      {{ label.label }}
                    </template>

                    <template v-slot:append-inner>
                      <OpenStatusBadge
                        v-if="editedGradStatus.schoolOfRecordId"
                        :compact="false"
                        :openedDateString="
                          getSchoolById(editedGradStatus.schoolOfRecordId)
                            ?.openedDate
                        "
                        :closedDateString="
                          getSchoolById(editedGradStatus.schoolOfRecordId)
                            ?.closedDate
                        "
                      />
                    </template>

                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :key="item.value">
                        <template v-slot:append>
                          <OpenStatusBadge
                            :openedDateString="item.raw.openedDate"
                            :closedDateString="item.raw.closedDate"
                          />
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </td>
              </tr>
              <!-- School of record End-->
              <!-- School at graduation-->
              <tr>
                <td>
                  <strong>School at graduation:</strong><br />
                  <div hidden>
                    {{ v$.editedGradStatus.ifSchoolAtGradGrades10To12 }}
                    <!-- {{
                      v$.editedGradStatus.ifSchoolAtGradTranscriptEligibility
                    }} -->
                  </div>

                  <!-- <div
                    class="bg-warning"
                    v-if="
                      v$.editedGradStatus.ifSchoolAtGradTranscriptEligibility
                        .$invalid == true
                    "
                  >
                    Please select a school
                  </div> -->
                  <div
                    class="bg-warning"
                    v-if="warningFlags.schoolAtGrad10To12Warning == true"
                  >
                    Warning: School
                    {{ getSchoolMincodeById(editedGradStatus.schoolAtGradId) }}
                    is not reported with grade 10-12 enrolments.
                  </div>
                  <div
                    class="bg-warning"
                    v-if="warningFlags.schoolAtGradTranscriptWarning == true"
                  >
                    Warning: School
                    {{ getSchoolMincodeById(editedGradStatus.schoolAtGradId) }}
                    is not authorized to issue Transcripts.
                  </div>
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus
                        .ifSchoolAtGraduationEmptyAndProgramCompletionNotEmpty
                        .$invalid == true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifSchoolAtGraduationEmptyAndProgramCompletionNotEmpty
                        .$message
                    }}
                  </div>
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus
                        .ifSchoolAtGradIdProgramIs1950AndOffshore.$invalid ==
                      true
                    "
                  >
                    {{
                      v$.editedGradStatus
                        .ifSchoolAtGradIdProgramIs1950AndOffshore.$message
                    }}
                  </div>
                  <!-- <v-autocomplete
                    data-cy="school-at-graduation-autoselect"
                    v-model="editedGradStatus.schoolAtGradId"
                    label="Select a school"
                    :items="getSchoolsList"
                    :item-title="schoolTitle"
                    item-value="schoolId"
                    variant="outlined"
                    class="mt-4"
                    density="compact"
                    :disabled="disableSchoolAtGrad"
                  >
                    <template v-slot:label="label">
                      {{ label.label }}
                    </template>
                  </v-autocomplete> -->
                  <p
                    data-cy="school-at-graduation-text"
                    v-if="editedGradStatus?.schoolAtGradId"
                  >
                    {{
                      getSchoolById(editedGradStatus?.schoolAtGradId)?.mincode
                    }}
                    -
                    {{
                      getSchoolById(editedGradStatus?.schoolAtGradId)
                        ?.displayName
                    }}
                  </p>
                </td>
              </tr>
              <!-- School at graduation End-->
              <!-- Honours standing-->
              <tr>
                <td>
                  <strong>Honours standing:</strong><br />
                  <span v-if="studentGradStatus.honoursStanding">
                    {{ studentGradStatus.honoursStanding }}</span
                  ><span v-else><br /></span>
                </td>
              </tr>
              <!-- Honours standing End-->
              <!-- GPA-->
              <tr>
                <td>
                  <strong>GPA:</strong><br />
                  <span
                    v-if="studentGradStatus.gpa && studentGradStatus.gpa > 0"
                    >{{ studentGradStatus.gpa }}</span
                  ><span v-else><br /></span>
                </td>
              </tr>
              <!-- GPA End -->
              <!-- Optional Programs -->
              <tr>
                <td>
                  <strong>Optional Programs</strong><br />
                  <ul
                    class="p-0"
                    v-if="
                      optionalPrograms[0] &&
                      optionalPrograms[0].studentOptionalProgramData
                    "
                    id="optional-programs"
                  >
                    <li
                      v-for="item in optionalPrograms"
                      :key="item.optionalProgramCode"
                    >
                      {{ item.optionalProgramName }}
                    </li>
                  </ul>
                  <span v-else><br /></span>
                </td>
              </tr>
              <!-- Optional Programs End -->
              <!-- Adult start date -->
              <tr>
                <td>
                  <strong>Adult start date: (YYYY-MM-DD)</strong><br />
                  <!-- Warning if adult start date contains non-numeric values -->
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus.ifAdultStartDateInvalid.$invalid ==
                      true
                    "
                  >
                    {{ v$.editedGradStatus.ifAdultStartDateInvalid.$message }}
                  </div>
                  <div
                    class="bg-error"
                    v-if="
                      v$.editedGradStatus.ifProgramIs1950ButNoAdultStartDate
                        .$invalid == true
                    "
                  >
                    {{
                      v$.editedGradStatus.ifProgramIs1950ButNoAdultStartDate
                        .$message
                    }}
                  </div>
                  <v-text-field
                    data-cy="adult-start-date-textfield"
                    :disabled="editedGradStatus.program != '1950'"
                    v-model="editedGradStatus.adultStartDate"
                    label="Date"
                    maxLength="10"
                    density="compact"
                    variant="outlined"
                    class="mt-4"
                    clearable
                  ></v-text-field>
                </td>
              </tr>
              <!-- Adult start date End -->
              <!-- Consumer education requirement met -->
              <tr>
                <td>
                  <strong>Consumer education requirement met:</strong><br />
                  <span
                    v-if="studentGradStatus.consumerEducationRequirementMet"
                  >
                    {{
                      studentGradStatus.consumerEducationRequirementMet
                    }}</span
                  >
                </td>
              </tr>
              <!-- Consumer education requirement met End -->
              <!-- Recalculate Grad Status -->
              <tr>
                <td>
                  <strong>Recalculate Grad Status:</strong><br />
                  <v-select
                    data-cy="recalculate-grad-select"
                    :disabled="!allowUpdateRecalcFlags"
                    v-model="editedGradStatus.recalculateGradStatus"
                    :items="recalcFlags"
                    item-title="text"
                    item-value="value"
                    label="Select"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  ></v-select>
                </td>
              </tr>
              <!-- Recalculate Grad Status End -->
              <!-- Recalculate Projected Grad -->
              <tr>
                <td>
                  <strong>Recalculate Projected Grad:</strong><br />
                  <v-select
                    data-cy="recalculate-projected-select"
                    :disabled="!allowUpdateRecalcFlags"
                    v-model="editedGradStatus.recalculateProjectedGrad"
                    :items="recalcFlags"
                    item-title="text"
                    item-value="value"
                    label="Select"
                    variant="outlined"
                    density="compact"
                    class="mt-4"
                  ></v-select>
                </td>
              </tr>
              <!-- Recalculate Projected Grad End-->
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions
          class="sticky-form-actions"
          v-if="allowUpdateGradStatus"
        >
          <v-btn color="error" variant="outlined" @click="cancelGradStatus">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            id="save-status-btn"
            color="error"
            variant="flat"
            :disabled="blockSave"
            @click="saveGraduationStatus(studentId)"
          >
            Save Grad Status
          </v-btn>
        </v-card-actions>
      </v-card>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { mapState, mapActions } from "pinia";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useAppStore } from "../../../store/modules/app";
import { useStudentStore } from "../../../store/modules/student";
import { useAccessStore } from "../../../store/modules/access";
import {
  containsAnyLetters,
  parseStudentStatus,
} from "../../../utils/common.js";

import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";

import sharedMethods from "../../../sharedMethods";
import StudentService from "@/services/StudentService.js";
import InstituteService from "@/services/InstituteService.js";
export default {
  name: "GRADStatusForm",
  components: {
    OpenStatusBadge: OpenStatusBadge,
  },
  created() {
    this.containsAnyLetters = containsAnyLetters;
    this.parseStudentStatus = parseStudentStatus;
  },
  setup() {
    const studentStore = useStudentStore();
    return { studentStore, v$: useVuelidate() };
  },
  computed: {
    ...mapState(useStudentStore, {
      optionalPrograms: "getStudentOptionalPrograms",
      studentId: "getStudentId",
      studentGradStatus: "getStudentGradStatus",
      editedGradStatus: "getEditedGradStatus",
    }),
    ...mapState(useAppStore, {
      programOptions: "getProgramOptions",
      studentStatusOptions: "getStudentStatusOptions",
      getSchoolsList: "getSchoolsList",
      getSchoolMincodeById: "getSchoolMincodeById",
      getSchoolById: "getSchoolById",
    }),
    ...mapState(useAccessStore, {
      allowUpdateGradStatus: "allowUpdateGradStatus",
      allowUpdateRecalcFlags: "allowUpdateRecalcFlags",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    studentGradeChange() {
      return this.editedGradStatus?.studentGrade;
    },
    programChange() {
      return this.editedGradStatus?.program;
    },
    programCompletionDateChange() {
      return this.editedGradStatus?.programCompletionDate;
    },
    schoolOfRecordChange() {
      return this.editedGradStatus?.schoolOfRecord;
    },
    schoolOfRecordIdChange() {
      return this.editedGradStatus?.schoolOfRecordId;
    },
    schoolAtGradChange() {
      return this.editedGradStatus?.schoolAtGrad;
    },
    schoolAtGradIdChange() {
      return this.editedGradStatus?.schoolAtGradId;
    },
    adultStartDateChange() {
      return this.editedGradStatus?.adultStartDate;
    },
    recalculateFlag() {
      return this.studentGradStatus?.recalculateGradStatus;
    },
    recalculateProjectedGradFlag() {
      return this.studentGradStatus?.recalculateProjectedGrad;
    },
    allSet() {
      if (this.getSchoolsList?.length == 0) {
        return true;
      } else {
        this.searchLoading = false;
        return false;
      }
    },
    mergedStudent() {
      if (this.studentGradStatus?.studentStatus === "MER") {
        return true;
      } else {
        this.searchLoading = false;
        return false;
      }
    },
  },
  data() {
    return {
      searchLoading: true,
      snackbarStore: useSnackbarStore(),
      dialog: false,
      programEffectiveDate: "",
      programExpiryDate: "",
      showEdit: false,
      show: false,
      // Validation flags that PREVENT submission of GRAD Status form
      errorFlags: {
        numberError: {
          programCompletionDate: false,
          adultStartDate: false,
        },
        rangeError: {
          programCompletionDate: false,
        },
        emptyError: {
          adultStartDate: false,
          schoolOfRecordMissing: false,
          schoolAtGraduation: false,
        },
      },
      // Validation flags that do NOT prevent submission of GRAD status form
      warningFlags: {
        closedProgramWarning: false,
        schoolWarning: false, //look at moving to error flags, but fine for now since backend prevents submission
        schoolOfRecordTranscriptWarning: false,
        schoolAtGradTranscriptWarning: false,
        schoolOfRecord10To12Warning: false,
        schoolAtGrad10To12Warning: false,
      },
      updateStatus: [],
      schoolOfRecord: "",
      schoolAtGraduation: "",
      blockSave: false,
      disableSchoolAtGrad: false,
      disableStudentGrade: false,
      disableProgramInput: false,
      disableConsumerEdReqMet: false,
      disableSchoolOfRecord: false,
      gradeOptions: [
        { text: "08", value: "8" },
        { text: "09", value: "9" },
        { text: "10", value: "10" },
        { text: "11", value: "11" },
        { text: "12", value: "12" },
        { text: "HS - Homeschool", value: "HS" },
        { text: "OT - Other", value: "OT" },
        { text: "AD - Adult expected to graduate", value: "AD" },
        { text: "AN - Adult not expected to graduate", value: "AN" },
      ],
      recalcFlags: [
        { text: "Y", value: "Y" },
        { text: "null", value: null },
      ],
      programsWithExpiry: [
        "1986-EN",
        "1996-EN",
        "1996-PF",
        "2004-EN",
        "2004-PF",
      ],
    };
  },
  validations() {
    return {
      editedGradStatus: {
        ifProgramIs1950studentGradeMustbeADorAN: helpers.withMessage(
          "Student grade should be one of AD or AN if the student program is 1950",
          (value) => {
            let { program, studentGrade } = this.editedGradStatus;
            return program !== "1950" || ["AD", "AN"].includes(studentGrade);
          }
        ),
        ifEditedGradStatusProgramHasChangedWarning: helpers.withMessage(
          "Warning, any optional programs associated with the original program will be deleted. You must add back in any pertinent optional programs once you have saved the changes to Program.",
          (value) => {
            return (
              this.editedGradStatus?.program === this.studentGradStatus?.program
            );
          }
        ),
        ifClosedProgramWarning: helpers.withMessage(
          "Warning: This program is closed.",
          (value) => {
            return !this.warningFlags?.closedProgramWarning;
          }
        ),
        ifProgramIs1950ButNoAdultStartDate: helpers.withMessage(
          "Students on the 1950 Program must have an adult start date. Please enter a valid date.",
          (value) => {
            return (
              this.editedGradStatus?.program !== "1950" ||
              this.editedGradStatus?.adultStartDate
            );
          }
        ),
        ifProgramIs1950AndOffshore: helpers.withMessage(
          "Offshore schools do not support the Adult Graduation Program.",
          (value) => {
            return (
              this.editedGradStatus?.program !== "1950" ||
              this.getSchoolById(this.editedGradStatus?.schoolOfRecordId)
                ?.schoolCategoryCode != "OFFSHORE"
            );
          }
        ),
        ifSchoolAtGradIdProgramIs1950AndOffshore: helpers.withMessage(
          "Offshore schools do not support the Adult Graduation Program.",
          (value) => {
            return (
              this.editedGradStatus?.program !== "1950" ||
              this.getSchoolById(this.editedGradStatus?.schoolAtGradId)
                ?.schoolCategoryCode != "OFFSHORE"
            );
          }
        ),
        // End of Program Validations
        // Program Completion Date
        ifProgramCompletionDatePriorToStartOfProgram: helpers.withMessage(
          "The program completion date cannot be prior to the start of the program",
          (value) => {
            return !this.errorFlags?.rangeError?.programCompletionDate;
          }
        ),
        ifProgramCompletionDateInvalid: helpers.withMessage(
          "The program completion date format is invalid. Please follow the date format YYYY/MM",
          (value) => {
            return (
              !this.errorFlags?.numberError?.programCompletionDate ||
              !this.containsAnyLetters(
                this.editedGradStatus?.programCompletionDate
              )
            );
          }
        ),

        ifEditedGradStatusProgramNotSCCP: helpers.withMessage(
          "Student Grade Validation message",
          (value) => {
            let { program } = this.editedGradStatus;
            let { programCompletionDate } = this.studentGradStatus;
            return (
              program === "SCCP" ||
              (programCompletionDate &&
                new Date(programCompletionDate) <= new Date())
            );
          }
        ),
        // End Program Completion Date
        ifProgramIsNot1950studentGradeCannotBeADorAN: helpers.withMessage(
          "Student grade should not be AD or AN for this program",
          (value) => {
            let { program, studentGrade } = this.editedGradStatus;
            return program === "1950" || !["AD", "AN"].includes(studentGrade);
          }
        ),
        // SchoolOfRecord
        ifSchoolOfRecordGrades10To12: helpers.withMessage(
          () => {
            if (this.editedGradStatus?.schoolOfRecordId) {
              return this.isSchoolGrades10To12(
                "schoolOfRecord",
                this.editedGradStatus?.schoolOfRecordId
              ); // Call your dynamic function here
            }
          },
          (value) => {
            return this.editedGradStatus?.schoolOfRecordId;
          }
        ),
        ifSchoolOfRecordTranscriptEligibility: helpers.withMessage(
          () => {
            if (this.editedGradStatus?.schoolOfRecordId) {
              return this.isSchoolTranscriptEligible(
                "schoolOfRecord",
                this.editedGradStatus?.schoolOfRecordId
              ); // Call your dynamic function here
            }
          },
          (value) => {
            return this.editedGradStatus?.schoolOfRecordId;
          }
        ),
        ifSchoolOfRecordIsEmpty: helpers.withMessage(
          "A student must have a school of record. Please enter a school code",
          (value) => {
            return this.editedGradStatus?.schoolOfRecordId;
          }
        ),
        ifSchoolOfRecordIsValid: helpers.withMessage(
          () => {
            if (this.editedGradStatus?.schoolOfRecordId) {
              return this.validateSchoolInfo(
                this.editedGradStatus?.schoolOfRecordId
              );
            }
          },
          (value) => {
            return this.editedGradStatus?.schoolOfRecordId;
          }
        ),
        //School at Grad
        ifSchoolAtGradGrades10To12: helpers.withMessage(
          () => {
            if (this.editedGradStatus?.schoolAtGradId) {
              return this.isSchoolGrades10To12(
                "schoolAtGrad",
                this.editedGradStatus?.schoolAtGradId
              ); // Call your dynamic function here
            }
          },
          (value) => {
            return this.editedGradStatus?.schoolAtGradId;
          }
        ),
        // ifSchoolAtGradTranscriptEligibility: helpers.withMessage(
        //   () => {
        //     if (this.editedGradStatus.schoolAtGradId) {
        //       return this.isSchoolTranscriptEligible(
        //         "schoolAtGrad",
        //         this.editedGradStatus.schoolAtGradId
        //       );
        //     }
        //   },
        //   (value) => {
        //     return this.editedGradStatus.schoolAtGradId;
        //   }
        // ),
        ifSchoolAtGraduation: helpers.withMessage(
          () => {
            if (this.editedGradStatus?.schoolAtGradId) {
              return this.validateSchoolInfo(
                this.editedGradStatus?.schoolAtGradId
              ); // Call your dynamic function here
            }
          },
          (value) => {
            return this.editedGradStatus?.schoolAtGradId;
          }
        ),
        ifSchoolAtGraduationEmptyAndProgramCompletionNotEmpty:
          helpers.withMessage(
            "If program completion date is not blank, school at graduation cannot be blank",
            (value) => {
              let { program, programCompletionDate, schoolAtGradId } =
                this.editedGradStatus;
              return (
                program == "SCCP" || !programCompletionDate || schoolAtGradId
              );
            }
          ),
        ifAdultStartDateInvalid: helpers.withMessage(
          "The adult start date format is invalid. Please follow the date format YYYY-MM-DD",
          (value) => {
            let adultStartDate = this.editedGradStatus?.adultStartDate;
            return (
              !adultStartDate ||
              (!this.containsAnyLetters(adultStartDate) &&
                !adultStartDate.length < 8)
            );
          }
        ),
      },
    };
  },
  watch: {
    programChange: function () {
      if (
        this.editedGradStatus.hasOwnProperty("adultStartDate") &&
        this.studentGradStatus?.adultStartDate !=
          this.editedGradStatus?.adultStartDate
      ) {
        this.editedGradStatus.adultStartDate =
          this.studentGradStatus.adultStartDate;
      }
      this.checkForErrors();
    },
    programCompletionDateChange: function () {
      //not a validation function
      let programNameSearch = this.editedGradStatus.program;
      for (let programOpt of this.programOptions) {
        if (programOpt?.programCode == programNameSearch) {
          this.programEffectiveDate = programOpt.effectiveDate;
          this.programExpiryDate = programOpt.expiryDate;
        }
      }
      if (this.editedGradStatus?.programCompletionDate) {
        if (
          !this.containsAnyLetters(this.editedGradStatus?.programCompletionDate)
        ) {
          this.errorFlags.numberError.programCompletionDate = false;
          this.validCompletionDate(
            this.editedGradStatus?.programCompletionDate
          );
        }
      } else {
        this.errorFlags.numberError.programCompletionDate = false;
      }
      this.checkForErrors();
    },
    adultStartDateChange: function () {
      if (this.editedGradStatus?.adultStartDate) {
        if (
          !this.containsAnyLetters(this.editedGradStatus?.adultStartDate) ||
          this.editedGradStatus?.adultStartDate?.length > 8
        ) {
          this.validAdultStartDate(this.editedGradStatus?.adultStartDate);
        }
      }
      this.checkForErrors();
    },
    studentGradeChange: function () {
      this.checkForErrors();
    },
    schoolOfRecordChange: function () {
      this.checkForErrors();
    },
    schoolOfRecordIdChange: function () {
      this.checkForErrors();
    },
    schoolAtGradIdChange: function () {
      this.checkForErrors();
    },
  },

  methods: {
    ...mapActions(useStudentStore, [
      "setStudentGradStatus",
      "loadStudentReportsAndCertificates",
      "loadStudentOptionalPrograms",
      "loadStudentHistory",
      "loadStudentOptionalProgramHistory",
    ]),
    schoolTitle(item) {
      // Customize this method to return the desired format
      if (item) {
        return `${item.mincode} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    sortStudentStatus(code) {
      return this.parseStudentStatus(code, this.studentStatusOptions);
    },
    validCompletionDate(date) {
      // format date to valid SCCP date
      if (this.editedGradStatus?.program === "SCCP") {
        this.editedGradStatus.programCompletionDate =
          sharedMethods.dateFormatYYYYMM(date);
      }
      let start = this.programEffectiveDate
        ? new Date(this.programEffectiveDate)
        : null;
      let end = this.programExpiryDate
        ? new Date(this.programExpiryDate)
        : null;
      let compareDate = date ? new Date(date) : null;
      this.errorFlags.numberError.programCompletionDate = !compareDate;

      let inRange =
        (!start || compareDate > start) && (!end || compareDate < end);
      this.errorFlags.rangeError.programCompletionDate = !inRange;
      return inRange && compareDate;
    },
    validAdultStartDate(date) {
      // format date to valid adult start date
      this.editedGradStatus.adultStartDate =
        sharedMethods.dateFormatYYYYMMDD(date);
    },
    editGradStatus() {
      // reset object
      // this.editedGradStatus = {};
      this.dialog = true;
      this.editedGradStatus.pen = this.studentGradStatus.pen;
      this.editedGradStatus.program = this.studentGradStatus.program;
      this.editedGradStatus.studentGrade = this.studentGradStatus.studentGrade;
      this.editedGradStatus.schoolOfRecordName =
        this.studentGradStatus.schoolOfRecordName;
      this.editedGradStatus.schoolOfRecord =
        this.studentGradStatus.schoolOfRecord;
      this.editedGradStatus.schoolOfRecordId =
        this.studentGradStatus.schoolOfRecordId;
      this.editedGradStatus.schoolAtGrad = this.studentGradStatus.schoolAtGrad;
      this.editedGradStatus.schoolAtGradId =
        this.studentGradStatus.schoolAtGradId;
      this.editedGradStatus.schoolAtGradName =
        this.studentGradStatus.schoolAtGradName;
      this.editedGradStatus.studentStatus =
        this.studentGradStatus.studentStatus;
      this.editedGradStatus.studentID = this.studentGradStatus.studentID;
      this.editedGradStatus.gpa = this.studentGradStatus.gpa;
      this.editedGradStatus.honoursStanding =
        this.studentGradStatus.honoursStanding;
      this.editedGradStatus.adultStartDate =
        this.studentGradStatus.adultStartDate;
      this.editedGradStatus.consumerEducationRequirementMet =
        this.studentGradStatus.consumerEducationRequirementMet;
      this.editedGradStatus.recalculateGradStatus =
        this.studentGradStatus.recalculateGradStatus;
      this.editedGradStatus.recalculateProjectedGrad =
        this.studentGradStatus.recalculateProjectedGrad;
      if (
        this.studentGradStatus?.programCompletionDate &&
        this.studentGradStatus?.program != "SCCP"
      ) {
        this.disableProgramInput = true;
        this.disableStudentGrade = true;
        this.disableConsumerEdReqMet = true;
        this.disableSchoolAtGrad = false;
      } else if (
        this.studentGradStatus?.programCompletionDate &&
        this.studentGradStatus?.program == "SCCP"
      ) {
        this.disableProgramInput = false;
        this.disableStudentGrade = false;
        this.disableConsumerEdReqMet = false;
        this.disableSchoolAtGrad = false;
      } else {
        this.disableProgramInput = false;
        this.disableStudentGrade = false;
        this.disableConsumerEdReqMet = false;
        this.disableSchoolAtGrad = true;
      }

      if (this.studentGradStatus?.program != "1986-EN") {
        this.disableConsumerEdReqMet = true;
      } else {
        this.disableConsumerEdReqMet = false;
      }
      if (
        this.studentGradStatus?.programCompletionDate != null &&
        this.studentGradStatus?.program !== "SCCP"
      ) {
        this.disableProgramInput = true;
      } else {
        this.disableProgramInput = false;
      }

      if (
        this.studentGradStatus?.studentStatus == "TER" ||
        this.studentGradStatus?.studentStatus == "N"
      ) {
        this.disableProgramInput = false;
      }
      this.showEdit = true;
      if (this.studentGradStatus?.programCompletionDate) {
        this.editedGradStatus.programCompletionDate =
          this.studentGradStatus.programCompletionDate;
      } else {
        this.editedGradStatus.programCompletionDate = null;
      }

      this.checkForErrors();
    },
    cancelGradStatus() {
      this.dialog = false;
      this.editedGradStatus = {};
      this.errorFlags.numberError.programCompletionDate = false;
    },
    checkForErrors() {
      const validationChecks = [
        this.v$.editedGradStatus.ifAdultStartDateInvalid,
        this.v$.editedGradStatus.ifProgramIs1950ButNoAdultStartDate,
        this.v$.editedGradStatus.ifSchoolOfRecordIsEmpty,
        this.v$.editedGradStatus
          .ifSchoolAtGraduationEmptyAndProgramCompletionNotEmpty,
        this.v$.editedGradStatus.ifProgramIs1950studentGradeMustbeADorAN,
        this.v$.editedGradStatus.ifProgramIsNot1950studentGradeCannotBeADorAN,
        this.v$.editedGradStatus.ifProgramIs1950AndOffshore,
        this.v$.editedGradStatus.ifSchoolAtGradIdProgramIs1950AndOffshore,
      ];

      // If any of the validations are invalid, blockSave will be true
      this.blockSave = validationChecks.some((check) => check.$invalid);
    },
    saveGraduationStatus(id) {
      //add the user info
      this.editedGradStatus.updatedBy = this.username;
      this.editedGradStatus.studentID = id;
      this.editedGradStatus.pen = this.studentPen;
      //process the program completion date
      if (this.editedGradStatus?.programCompletionDate == "") {
        this.editedGradStatus.programCompletionDate = null;
      }
      if (this.editedGradStatus?.programCompletionDate != null) {
        this.editedGradStatus.programCompletionDate =
          this.editedGradStatus.programCompletionDate.replace("/", "-");
        let date;
        try {
          date = new Date(this.editedGradStatus.programCompletionDate);
          this.editedGradStatus.programCompletionDate = date
            .toISOString()
            .split("T")[0];
        } catch (error) {
          // eslint-disable-next-line
          console.log(error);
          this.snackbarStore.showSnackbar(error, "error", 5000);
        }
      }
      if (this.editedGradStatus?.schoolOfRecord == "") {
        this.editedGradStatus.schoolOfRecord = null;
      }
      if (this.editedGradStatus?.schoolAtGradId == "") {
        this.editedGradStatus.schoolAtGradId = null;
      }
      if (
        this.studentGradStatus?.program == "1950" &&
        this.editedGradStatus?.program != "1950"
      ) {
        this.editedGradStatus.adultStartDate = "";
        this.studentGradStatus.adultStartDate = "";
      }
      StudentService.editGraduationStatus(id, this.editedGradStatus)
        .then((response) => {
          this.dialog = false;
          this.updateStatus = response.data;
          this.setStudentGradStatus(response.data);
          this.loadStudentReportsAndCertificates();
          this.loadStudentOptionalPrograms(id);
          this.loadStudentHistory(id);
          this.loadStudentOptionalProgramHistory(id);
          this.studentGradStatus.studentStatusName = this.sortStudentStatus(
            response.data.studentStatus
          );
          this.showEdit = false;
          this.editedGradStatus = {};
          this.snackbarStore.showSnackbar("GRAD Status Saved", "success", 5000);
        })
        .catch((error) => {
          if (this.editedGradStatus.programCompletionDate != null) {
            this.editedGradStatus.programCompletionDate =
              this.editedGradStatus.programCompletionDate
                .replace("-", "/")
                .substring(0, 7);
          }
          //eslint-disable-next-line
          console.log(error?.response?.data);
          this.snackbarStore.showSnackbar(
            error?.response?.data?.message,
            "error",
            5000
          );
        });
    },
    validateSchoolInfo(schoolToValidateId) {
      this.warningFlags.schoolWarning = false;
      let schoolInfo = this.getSchoolById(schoolToValidateId);
      this.warningFlags.schoolWarning = !this.isSchoolOpen(schoolInfo);
    },
    async isSchoolGrades10To12(type, schoolId) {
      try {
        this.warningFlags.schoolOfRecord10To12Warning = false;
        this.warningFlags.schoolAtGrad10To12Warning = false;
        const schoolGradesToCheck = ["GRADE10", "GRADE11", "GRADE12"];
        // Create a Set from the schoolGradesToCheck array for efficient lookups.
        const gradesToCheckSet = new Set(schoolGradesToCheck);
        // Calling out to institute for GRADES
        const response = await InstituteService.getSchoolById(schoolId);
        const schoolGrades = response?.data?.grades;
        for (const grade of schoolGrades) {
          // If the current grade's schoolGradeCode is in the Set, return true.
          if (gradesToCheckSet.has(grade.schoolGradeCode)) {
            return true;
          }
        }
        // If none of the grades matched, return false and switch on the warning flags.
        if (type == "schoolOfRecord") {
          this.warningFlags.schoolOfRecord10To12Warning = true;
        } else {
          this.warningFlags.schoolAtGrad10To12Warning = true;
        }
        return false;
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error fetching school data:", error);
      }
    },
    isSchoolTranscriptEligible(type, schoolId) {
      let school = this.getSchoolById(schoolId);
      if (school) {
        if (type == "schoolOfRecord") {
          this.warningFlags.schoolOfRecordTranscriptWarning =
            !school.canIssueTranscripts;
          return school.canIssueTranscripts;
        } else {
          this.warningFlags.schoolAtGradTranscriptWarning =
            !school.canIssueTranscripts;
          return school.canIssueTranscripts;
        }
      } else {
        // If the school is not found, return false (or handle the error as needed)
        return false;
      }
    },
    isSchoolOpen(school) {
      const openedDate = new Date(school?.openedDate);
      const closedDate = school?.closedDate
        ? new Date(school?.closedDate)
        : null;
      const currentDate = new Date();

      // Check if the openedDate is in the past and closedDate is null
      return openedDate < currentDate && closedDate === null;
    },
  },
};
</script>
<style scoped>
:deep(.graduation-status) table tr td {
  vertical-align: top;
  height: 42px !important;
}
:deep(.card-body) {
  border-bottom: 1px solid #ccc;
}
:deep(.card) {
  margin-bottom: 10px;
}
:deep(.card-header) {
  font-weight: 700;
}
:deep(.gradstatus-actions) {
  position: absolute;
  top: 10px;
  right: 10px;
}
:deep(.edit) {
  padding: 10px;
}
:deep(.form-validation-message) {
  font-size: 11px;
}
:deep(.form-control:disabled) {
  color: #6c757d;
  background-color: #e9ecef;
}
:deep(a.disabled) {
  color: #6c757d;
  pointer-events: none;
}
</style>
