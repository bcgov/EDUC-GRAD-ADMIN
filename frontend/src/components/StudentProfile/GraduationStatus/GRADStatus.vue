<template>
  <div class="graduation-status">
    <b-card no-body header="GRAD Status">
      <b-card-text class="p-3">
        <b-button-group
          v-if="allowUpdateGradStatus"
          class="gradstatus-actions float-right"
        >
          <div v-if="!showEdit && allowUpdateGradStatus">
            <b-link
              href="#"
              class="edit"
              disabled
              v-if="studentGradStatus.studentStatus === 'MER'"
              v-on:click="editGradStatus"
              size="sm"
              variant="primary"
            >
              Edit
            </b-link>
            <b-link
              href="#"
              class="edit"
              v-else
              v-on:click="editGradStatus"
              size="sm"
              variant="primary"
            >
              Edit
            </b-link>
          </div>
          <div v-if="showEdit">
            <b-button-group>
              <b-button
                :disabled="disableSaveButton"
                v-on:click="saveGraduationStatus(studentId)"
                size="sm"
                variant="primary"
                >Save</b-button
              >

              <b-button
                v-on:click="cancelGradStatus"
                size="sm"
                variant="outline-primary"
                >Cancel</b-button
              >
            </b-button-group>
          </div>
        </b-button-group>
        <!-- Info callout in edit form when student status is MER/Merged -->
        <div
          v-if="studentGradStatus && studentGradStatus.studentStatus == 'MER'"
        >
          <b-alert show variant="info" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Merged</h4>
            <p class="locked-message">
              This student's status is set to 'Merged'. Their data cannot be
              changed.
            </p>
          </b-alert>
        </div>
        <!-- Warning callout in edit form when student status is N/Not Active -->
        <div
          v-if="
            studentGradStatus &&
            studentGradStatus.studentStatus == 'N' &&
            showEdit
          "
        >
          <b-alert show variant="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Not active</h4>
            <p class="locked-message">
              This student's status is set to 'Not active'. Re-activate their
              record by setting their 'Student status' to 'Active' if they are
              enrolled in a school.
            </p>
          </b-alert>
        </div>
        <!-- Warning callout in edit form when student status is TER/Terminated -->
        <div
          v-else-if="
            studentGradStatus &&
            studentGradStatus.studentStatus == 'TER' &&
            showEdit
          "
        >
          <b-alert show variant="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Terminated</h4>
            <p class="locked-message">
              This student's status is set to 'Terminated'. Re-activate their
              record by setting their 'Student status' to 'Current' if they are
              enrolled in a school.
            </p>
          </b-alert>
        </div>
        <!-- Warning callout in edit form when student status is ARC/Archived -->
        <div
          v-else-if="
            studentGradStatus &&
            studentGradStatus.studentStatus == 'ARC' &&
            showEdit
          "
        >
          <b-alert show variant="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Archived</h4>
            <p class="locked-message">
              This student is not active. Re-activate by setting their status to
              "Current" if they are currently attending school
            </p>
          </b-alert>
        </div>
        <!-- Warning callout in edit form when student status is DEC/Deceased -->
        <div
          v-else-if="
            studentGradStatus &&
            studentGradStatus.studentStatus == 'DEC' &&
            showEdit
          "
        >
          <b-alert show variant="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Deceased</h4>
            <p class="locked-message">
              Warning: This student is showing as "Deceased".
            </p>
          </b-alert>
        </div>

        <table
          role="presentation"
          aria-label="edit grad status"
          class="table table-hover table-sm"
        >
          <tbody>
            <tr v-if="!showEdit">
              <td class="w-50"><strong>Program: </strong></td>
              <td class="w-50">
                <span v-b-tooltip.hover title="Program">{{
                  studentGradStatus.program
                }}</span>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td class="w-50">
                <strong>Program: </strong>
                <div v-if="editedGradStatus.program == '1950'">
                  <!-- Warning if student grade is not AN or AD when on 1950 program -->
                  <div
                    class="form-validation-message text-danger"
                    v-if="
                      !(
                        editedGradStatus.studentGrade == 'AD' ||
                        editedGradStatus.studentGrade == 'AN'
                      )
                    "
                  >
                    Student grade should be one of <strong>AD or AN</strong> if
                    the student program is 1950
                  </div>
                </div>

                <!-- Warnig if program changes that optional programs will be dropped from the student -->
                <div
                  v-if="editedGradStatus.program != studentGradStatus.program"
                >
                  <div
                    v-if="warningFlags.programChangeWarning"
                    class="form-validation-message text-danger"
                  >
                    Warning, any optional programs associated with the original
                    program will be <strong>deleted</strong>. You must add back
                    in any pertinent optional programs once you have saved the
                    changes to Program.
                  </div>
                </div>
                <!-- Warning if student is moved to a program that is closed-->
                <div
                  v-if="warningFlags.closedProgramWarning"
                  class="form-validation-message text-warning"
                >
                  Warning: This program is closed.
                </div>
              </td>
              <td class="w-50">
                <b-form-select
                  :disabled="disableProgramInput"
                  size="sm"
                  v-model="editedGradStatus.program"
                  :options="programOptions"
                  value-field="programCode"
                  text-field="programCode"
                ></b-form-select>
              </td>
            </tr>
            <!-- END program edit -->
            <tr v-if="!showEdit">
              <td><strong>Program completion date: </strong></td>
              <td>
                {{
                  $filters.formatYYYYMMDate(
                    studentGradStatus.programCompletionDate
                  )
                }}
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>Program completion date: (YYYY-MM)</strong><br />
                <!-- Warning if program completion date for SCCP is out of range -->
                <div
                  v-if="errorFlags.rangeError.programCompletionDate"
                  class="form-validation-message text-danger"
                >
                  The program completion date cannot be prior to the start of
                  the program&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <!-- Warning if program completion date contains non-numeric values -->
                <div
                  v-if="errorFlags.numberError.programCompletionDate"
                  class="form-validation-message text-danger"
                >
                  The program completion date format is invalid. Please follow
                  the date format <strong>YYYY/MM</strong>
                </div>
              </td>
              <td>
                <b-input
                  :disabled="
                    editedGradStatus.program != 'SCCP' ||
                    (studentGradStatus.programCompletionDate &&
                      new Date(studentGradStatus.programCompletionDate) <=
                        new Date())
                  "
                  size="sm"
                  type="text"
                  maxLength="7"
                  v-model="editedGradStatus.programCompletionDate"
                  :formatter="formatYYYYMMDate"
                ></b-input>
              </td>
            </tr>
            <!-- END program completion date edit -->

            <tr v-if="!showEdit">
              <td><strong>Student status: </strong></td>
              <td>
                <span v-if="studentGradStatus.studentStatus">{{
                  studentGradStatus.studentStatusName
                }}</span>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td><strong>Student status: </strong></td>
              <td class="p-1">
                <b-form-select
                  size="sm"
                  v-model="editedGradStatus.studentStatus"
                  :options="studentStatusOptions"
                  value-field="code"
                  text-field="label"
                  :disabled="disableStudentStatus"
                ></b-form-select>
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>Student grade: </strong></td>
              <td>
                <span v-if="studentGradStatus.studentGrade">{{
                  studentGradStatus.studentGrade
                }}</span>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>Student grade: </strong>
                <!-- Warning if student is not on 1950 program and grade is AN/AD.
                *Note that we have existing SCCP students with AD/AN, but future students on SCCP program should not have a grade of AN/AD -->
                <div v-if="editedGradStatus.program != '1950'">
                  <div
                    class="form-validation-message text-danger"
                    v-if="
                      editedGradStatus.studentGrade == 'AD' ||
                      editedGradStatus.studentGrade == 'AN'
                    "
                  >
                    Student grade should not be AD or AN for this program
                  </div>
                </div>
              </td>
              <td>
                <b-form-select
                  size="sm"
                  :disabled="disableStudentGrade"
                  v-model="editedGradStatus.studentGrade"
                  :options="gradeOptions"
                >
                </b-form-select>
              </td>
            </tr>

            <tr v-if="!showEdit">
              <td><strong>School of record: </strong></td>
              <td>
                <b-button
                  class="p-0 text-left"
                  v-b-modal.modal-1
                  variant="link"
                  @click="
                    getSchoolInfo(
                      studentGradStatus.schoolOfRecord,
                      'schoolOfRecord'
                    )
                  "
                >
                  {{
                    studentGradStatus.schoolName
                      ? studentGradStatus.schoolName
                      : schoolOfRecord.schoolName
                  }}<br />
                  {{ studentGradStatus.schoolOfRecord }}</b-button
                >

                <b-modal
                  id="modal-1"
                  title="School Information"
                  ok-title="Close"
                  ok-only
                >
                  <table role="presentation" aria-label="grad status">
                    <tbody v-if="schoolOfRecord.districtName">
                      <tr>
                        <td>
                          <strong>District:</strong>
                          {{ schoolOfRecord.districtName }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>School Code and Name:</strong> <br />
                          {{
                            schoolOfRecord.minCode +
                            " " +
                            schoolOfRecord.schoolName
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status: </strong>
                          {{
                            schoolOfRecord.openFlag == "Y" ? "Open" : "Closed"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Independent type:</strong>
                          {{ schoolOfRecord.independentDesignation }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Independent affiliation:</strong>
                          {{ schoolOfRecord.independentAffiliation }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transcript eligible:</strong>
                          {{ schoolOfRecord.transcriptEligibility }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Dogwood eligibility:</strong>
                          {{ schoolOfRecord.certificateEligibility }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-modal>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>School of record:</strong><br />
                <!-- Warning if school of record missing; Samara to investigate if we use this since msg is same as scoolOfRecordWarning -->
                <div
                  v-if="errorFlags.emptyError.schoolOfRecordMissing"
                  class="form-validation-message text-warning"
                >
                  A student <strong>must</strong> have a school of record.
                  Please enter a school code &nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <!-- Warning if school of record is closed -->
                <div
                  v-if="warningFlags.schoolOfRecordWarning"
                  class="form-validation-message text-warning"
                >
                  This School is closed, changes should be to historical
                  activity only&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <!-- Warning if school does not exist/school not found -->
                <div
                  v-if="warningFlags.schoolNotFoundWarning"
                  class="form-validation-message text-danger"
                >
                  Invalid school entered, school does not exist on the school
                  table&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <!-- Warning if school code for school of record is not 8 digits -->
                <div
                  v-if="warningFlags.schoolOfRecordInputWarning"
                  class="form-validation-message text-danger"
                >
                  Please enter at least 8 digits&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolFound"
                  class="form-validation-message text-success"
                >
                  {{ editedGradStatus.schoolName }} found.
                </div>
              </td>
              <td>
                <b-input
                  size="sm"
                  type="text"
                  maxlength="8"
                  minength="8"
                  :disabled="disableSchoolOfRecord"
                  v-model="editedGradStatus.schoolOfRecord"
                ></b-input>
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>School at graduation: </strong></td>
              <td>
                <b-button
                  v-if="studentGradStatus && studentGradStatus.schoolAtGrad"
                  class="p-0 text-left"
                  v-b-modal.modal-2
                  variant="link"
                  @click="
                    getSchoolInfo(
                      studentGradStatus.schoolOfRecord,
                      'schoolAtGrad'
                    )
                  "
                >
                  {{
                    studentGradStatus.schoolAtGradName
                      ? studentGradStatus.schoolAtGradName
                      : schoolAtGraduation.schoolName
                  }}<br />
                  {{ studentGradStatus.schoolAtGrad }}
                </b-button>
                <b-modal
                  id="modal-2"
                  title="School Information"
                  ok-title="Close"
                  ok-only
                >
                  <table
                    role="presentation"
                    aria-label="edit graduation status"
                  >
                    <tbody v-if="schoolAtGraduation.districtName">
                      <tr>
                        <td>
                          <strong>District:</strong>
                          {{ schoolAtGraduation.districtName }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>School Code and Name:</strong> <br />
                          {{
                            schoolAtGraduation.minCode +
                            " " +
                            schoolAtGraduation.schoolName
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status:</strong>
                          {{
                            schoolAtGraduation.openFlag == "Y"
                              ? "Open"
                              : "Closed"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Independent type:</strong>
                          {{ schoolAtGraduation.independentDesignation }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Independent affiliation:</strong>
                          {{ schoolAtGraduation.independentAffiliation }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Transcript eligible:</strong>
                          {{ schoolAtGraduation.transcriptEligibility }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Dogwood eligibility:</strong>
                          {{ schoolAtGraduation.certificateEligibility }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-modal>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>School at graduation:</strong><br />
                <div
                  v-if="warningFlags.schoolAtGraduationWarning"
                  class="form-validation-message text-warning"
                >
                  Warning: This School is closed, changes should be to
                  historical activity only&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="errorFlags.emptyError.schoolAtGraduation"
                  class="form-validation-message text-danger"
                >
                  If program completion date is not blank, school at graduation
                  cannot be blank&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="warningFlags.schoolAtGraduationNotFoundWarning"
                  class="form-validation-message text-warning"
                >
                  Invalid school entered, school does not exist on the school
                  table&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="warningFlags.schoolAtGraduationInputWarning"
                  class="form-validation-message text-danger"
                >
                  Please enter at least 8 digits&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolAtGraduationFound"
                  class="form-validation-message text-success"
                >
                  {{ editedGradStatus.schoolAtGradName }} found.
                </div>

                <!-- Warning if school code for school of record is Offshore and program is 1950 -->
                <div
                  v-if="errorFlags.other.offshore1950"
                  class="form-validation-message text-danger"
                >
                  Offshore schools do not support the Adult Graduation
                  Program&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
              </td>
              <td>
                <b-input
                  :disabled="disableSchoolAtGrad"
                  size="sm"
                  type="text"
                  maxlength="8"
                  v-model="editedGradStatus.schoolAtGrad"
                ></b-input>
              </td>
            </tr>
            <tr>
              <td><strong>Honours standing:</strong></td>
              <td>
                <span v-if="studentGradStatus.honoursStanding">
                  {{ studentGradStatus.honoursStanding }}</span
                >
              </td>
            </tr>
            <tr>
              <td><strong>GPA:</strong></td>
              <td>
                <span
                  v-if="studentGradStatus.gpa && studentGradStatus.gpa > 0"
                  >{{ studentGradStatus.gpa }}</span
                >
              </td>
            </tr>
            <tr>
              <td><strong>Optional Programs</strong></td>
              <td>
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
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>Adult start date: </strong></td>
              <td>
                <span v-if="studentGradStatus.adultStartDate">{{
                  $filters.formatSimpleDate(studentGradStatus.adultStartDate)
                }}</span>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>Adult start date: (YYYY-MM-DD)</strong>
                <!-- Warning if adult start date contains non-numeric values -->
                <div
                  v-if="errorFlags.numberError.adultStartDate"
                  class="form-validation-message text-danger"
                >
                  The adult start date format is invalid. Please follow the date
                  format <strong>YYYY-MM-DD</strong>
                </div>
                <div
                  v-if="errorFlags.emptyError.adultStartDate"
                  class="form-validation-message text-danger"
                >
                  Students on the 1950 Program <strong>must</strong> have an
                  adult start date. Please enter a valid date.
                </div>
              </td>
              <td>
                <b-input
                  :disabled="editedGradStatus.program != '1950'"
                  size="sm"
                  type="text"
                  maxLength="10"
                  v-model="editedGradStatus.adultStartDate"
                ></b-input>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td><strong>Consumer education requirement met:</strong></td>
              <td>
                <b-form-select
                  size="sm"
                  v-model="editedGradStatus.consumerEducationRequirementMet"
                  :options="consumerEducRecMet"
                  :disabled="disableConsumerEdReqMet"
                >
                </b-form-select>
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>Consumer education requirement met:</strong></td>
              <td>
                <span v-if="studentGradStatus.consumerEducationRequirementMet">
                  {{ studentGradStatus.consumerEducationRequirementMet }}</span
                >
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>Recalculate Grad Status:</strong></td>
              <td>
                {{ String(studentGradStatus.recalculateGradStatus) }}
              </td>
            </tr>
            <tr v-else>
              <td><strong>Recalculate Grad Status:</strong></td>
              <td>
                <b-form-select
                  size="sm"
                  v-model="editedGradStatus.recalculateGradStatus"
                  :options="recalcFlags"
                  :disabled="!allowUpdateRecalcFlags"
                />
              </td>
            </tr>
            <tr v-if="!showEdit">
              <td><strong>Recalculate Projected Grad:</strong></td>
              <td>
                {{ String(studentGradStatus.recalculateProjectedGrad) }}
              </td>
            </tr>
            <tr v-else>
              <td><strong>Recalculate Projected Grad:</strong></td>
              <td>
                <b-form-select
                  size="sm"
                  v-model="editedGradStatus.recalculateProjectedGrad"
                  :options="recalcFlags"
                  :disabled="!allowUpdateRecalcFlags"
                />
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { onUpdated, onMounted } from "vue";
import { useAppStore } from "../../../store/modules/app";
import { useStudentStore } from "../../../store/modules/student";
import { useAccessStore } from "../../../store/modules/access";
import {
  containsAnyLetters,
  parseStudentStatus,
  showNotification,
} from "../../../utils/common.js";
import SchoolService from "@/services/SchoolService.js";
import sharedMethods from "../../../sharedMethods";
import StudentService from "@/services/StudentService.js";

export default {
  name: "GRADStatus",
  created() {
    this.showNotification = showNotification;
    this.containsAnyLetters = containsAnyLetters;
    this.parseStudentStatus = parseStudentStatus;
  },
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  computed: {
    ...mapState(useStudentStore, {
      optionalPrograms: "getStudentOptionalPrograms",
      studentId: "getStudentId",
      studentGradStatus: "getStudentGradStatus",
    }),
    ...mapState(useAppStore, {
      programOptions: "getProgramOptions",
      studentStatusOptions: "getStudentStatusOptions",
    }),
    ...mapState(useAccessStore, {
      allowUpdateGradStatus: "allowUpdateGradStatus",
      allowUpdateRecalcFlags: "allowUpdateRecalcFlags",
    }),
    studentGradeChange() {
      return this.editedGradStatus.studentGrade;
    },
    programChange() {
      return this.editedGradStatus.program;
    },
    programCompletionDateChange() {
      return this.editedGradStatus.programCompletionDate;
    },
    schoolOfRecordChange() {
      return this.editedGradStatus.schoolOfRecord;
    },
    schoolAtGradChange() {
      return this.editedGradStatus.schoolAtGrad;
    },
    adultStartDateChange() {
      return this.editedGradStatus.adultStartDate;
    },
    disableSaveButton() {
      return this.disableSave;
    },
    recalculateFlag() {
      return this.studentGradStatus.recalculateGradStatus;
    },
    recalculateProjectedGradFlag() {
      return this.studentGradStatus.recalculateProjectedGrad;
    },
  },
  data() {
    return {
      programCompletionEffectiveDateList: [],
      programEffectiveDate: "",
      programExpiryDate: "",
      dismissSecs: 3, // remove?
      dismissCountDown: 0, // remove?
      showModal: false,
      showEdit: false,
      show: false,
      notificationMessage: "",
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
        other: {
          programGrade: false,
          programComplete: false,
          offshore1950: false,
        },
      },
      // Validation flags that do NOT prevent submission of GRAD status form
      warningFlags: {
        closedProgramWarning: false,
        programChangeWarning: false,
        schoolOfRecordWarning: false,
        schoolNotFoundWarning: false,
        schoolOfRecordInputWarning: false, //look at moving to error flags, but fine for now since backend prevents submission
        schoolAtGraduationWarning: false,
        schoolAtGraduationNotFoundWarning: false,
        schoolAtGraduationInputWarning: false,
      },
      projectedStudentGradStatus: [],
      updateStatus: [],
      schoolOfRecord: "",
      schoolOfRecordStatus: "",
      schoolFound: false,
      schoolAtGraduation: "",
      schoolAtGraduationStatus: "",
      schoolAtGraduationFound: false,
      editedGradStatus: {},
      studentUngradReason: "",
      disableSave: false,
      disableSchoolAtGrad: false,
      disableStudentGrade: false,
      disableProgramInput: false,
      disableConsumerEdReqMet: false,
      disableStudentStatus: false,
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
      consumerEducRecMet: [
        { text: "Y", value: "Y" },
        { text: "N", value: "N" },
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

  watch: {
    studentGradeChange: function () {
      if (
        this.editedGradStatus.studentGrade == "AD" ||
        this.editedGradStatus.studentGrade == "AN"
      ) {
        if (this.editedGradStatus.program == "1950") {
          this.errorFlags.other.programGrade = false;
          if (this.editedGradStatus.schoolOfRecord == "") {
            this.errorFlags.emptyError.schoolOfRecordMissing = true;
          } else {
            this.errorFlags.emptyError.schoolOfRecordMissing = false;
          }
        } else {
          this.errorFlags.other.programGrade = true;
        }
      }
      if (
        this.editedGradStatus.studentGrade != "AD" &&
        this.editedGradStatus.studentGrade != "AN"
      ) {
        if (this.editedGradStatus.program !== "1950") {
          this.errorFlags.other.programGrade = false;
          if (this.editedGradStatus.schoolOfRecord == "") {
            this.errorFlags.emptyError.schoolOfRecordMissing = true;
          } else {
            this.errorFlags.emptyError.schoolOfRecordMissing = false;
          }
        } else {
          this.errorFlags.other.programGrade = true;
        }
      }
      this.validateFields();
    },
    programChange: function () {
      // Samara to look at cleaning this up
      this.warningFlags.programChangeWarning = true;
      if (
        this.studentGradStatus.programCompletionDate &&
        this.studentGradStatus.program != "SCCP"
      ) {
        this.disableProgramInput = true;
        this.disableStudentGrade = true;
        this.disableConsumerEdReqMet = true;
        this.disableSchoolAtGrad = false;
      } else {
        this.disableProgramInput = false;
        this.disableStudentGrade = false;
        this.disableConsumerEdReqMet = false;
        this.disableSchoolAtGrad = true;
      }
      if (this.editedGradStatus.program == "1950") {
        // check adult start date
        if (this.editedGradStatus.adultStartDate) {
          this.errorFlags.emptyError.adultStartDate = false;
        } else {
          this.errorFlags.emptyError.adultStartDate = true;
        }
        // check that grade is AN or AD for 1950 program
        if (
          this.editedGradStatus.studentGrade == "AD" ||
          this.editedGradStatus.studentGrade == "AN"
        ) {
          this.errorFlags.other.programGrade = false;
        } else {
          this.errorFlags.other.programGrade = true;
        }
        // check that school of record is NOT offshore
        if (this.editedGradStatus.schoolOfRecord.search(/^103.*/) >= 0) {
          this.errorFlags.other.offshore1950 = true;
        } else {
          this.errorFlags.other.offshore1950 = false;
        }
      } else {
        this.errorFlags.emptyError.adultStartDate = false;
        if (
          this.editedGradStatus.studentGrade == "AD" ||
          this.editedGradStatus.studentGrade == "AN"
        ) {
          this.errorFlags.other.programGrade = true;
        } else {
          this.errorFlags.other.programGrade = false;
        }
      }
      if (this.ifProgramsWithExpiry(this.editedGradStatus.program)) {
        this.warningFlags.closedProgramWarning = true;
      } else {
        this.warningFlags.closedProgramWarning = false;
      }

      //clear out whatever the user had for the program completion date
      if (
        this.editedGradStatus.hasOwnProperty("programCompletionDate") &&
        this.studentGradStatus.programCompletionDate !=
          this.editedGradStatus.programCompletionDate
      ) {
        this.editedGradStatus.programCompletionDate =
          this.studentGradStatus.programCompletionDate;
      }

      // clear out whatever the user had for the adult start date
      if (
        this.editedGradStatus.hasOwnProperty("adultStartDate") &&
        this.studentGradStatus.adultStartDate !=
          this.editedGradStatus.adultStartDate
      ) {
        this.editedGradStatus.adultStartDate =
          this.studentGradStatus.adultStartDate;
      }
      this.validateFields();
    },
    programCompletionDateChange: function () {
      let programNameSearch = this.editedGradStatus.program;
      for (let programOpt of this.programOptions) {
        if (programOpt.programCode == programNameSearch) {
          this.programEffectiveDate = programOpt.effectiveDate;
          this.programExpiryDate = programOpt.expiryDate;
        }
      }

      if (this.editedGradStatus.programCompletionDate) {
        if (
          this.containsAnyLetters(this.editedGradStatus.programCompletionDate)
        ) {
          this.errorFlags.numberError.programCompletionDate = true;
        } else {
          this.errorFlags.numberError.programCompletionDate = false;
          this.validCompletionDate(this.editedGradStatus.programCompletionDate);
        }
      } else {
        this.errorFlags.numberError.programCompletionDate = false;
      }
      this.validateFields();
    },
    schoolOfRecordChange: function () {
      if (this.editedGradStatus.schoolOfRecord == "") {
        this.errorFlags.emptyError.schoolOfRecordMissing = true;
      } else {
        this.errorFlags.emptyError.schoolOfRecordMissing = false;
      }
      if (this.editedGradStatus.schoolOfRecord?.length < 8) {
        this.warningFlags.schoolOfRecordWarning = false;
        this.warningFlags.schoolNotFoundWarning = false;
        this.warningFlags.schoolOfRecordInputWarning = true;
        this.validateFields();
        return;
      } else if (
        this.studentGradStatus.program == "1950" &&
        this.editedGradStatus.schoolOfRecord.search(/^103.*/) >= 0
      ) {
        this.errorFlags.other.offshore1950 = true;
      } else {
        this.errorFlags.other.offshore1950 = false;
      }

      if (
        this.editedGradStatus.schoolOfRecord ==
        this.studentGradStatus.schoolOfRecord
      ) {
        this.warningFlags.schoolOfRecordWarning = false;
        this.warningFlags.schoolNotFoundWarning = false;
        this.warningFlags.schoolOfRecordInputWarning = false;
        this.schoolFound = false;
      } else {
        if (this.editedGradStatus.schoolOfRecord?.length == 8) {
          this.warningFlags.schoolNotFoundWarning = false;
          this.warningFlags.schoolOfRecordWarning = false;
          this.warningFlags.schoolOfRecordInputWarning = false;
          this.schoolFound = false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolOfRecord)
            .then((response) => {
              this.schoolOfRecordStatus = response.data.openFlag;
              if (response.statusText == "No Content") {
                this.warningFlags.schoolNotFoundWarning = true;
              } else {
                this.warningFlags.schoolNotFoundWarning = false;
                if (this.schoolOfRecordStatus == "N") {
                  this.warningFlags.schoolOfRecordWarning = true;
                }
                this.schoolFound = true;
                this.editedGradStatus.schoolName = response.data.schoolName;
              }
            })
            .catch((error) => {
              if (error.response.data.code == "404") {
                this.showNotification("danger", "School cannot be found");
              }
            });
        } else {
          this.warningFlags.schoolNotFoundWarning = true;
        }
      }
      this.validateFields();
    },
    schoolAtGradChange: function () {
      if (this.editedGradStatus.schoolAtGrad == "") {
        if (this.editedGradStatus.programCompletionDate != "") {
          this.errorFlags.emptyError.schoolAtGraduation = true;
        } else {
          this.errorFlags.emptyError.schoolAtGraduation = false;
        }
      } else {
        this.errorFlags.emptyError.schoolAtGraduation = false;
      }

      if (
        this.editedGradStatus.schoolAtGrad &&
        this.editedGradStatus.schoolAtGrad.length < 8
      ) {
        this.warningFlags.schoolAtGraduationWarning = false;
        this.warningFlags.schoolAtGraduationNotFoundWarning = false;
        this.warningFlags.schoolAtGraduationInputWarning = true;
        this.schoolAtGraduationFound = false;
        return;
      } else {
        this.warningFlags.schoolAtGraduationInputWarning = false;
      }
      if (
        this.editedGradStatus.schoolAtGrad ==
        this.studentGradStatus.schoolAtGrad
      ) {
        this.warningFlags.schoolAtGraduationWarning = false;
        this.warningFlags.schoolAtGraduationNotFoundWarning = false;
        this.warningFlags.schoolAtGraduationInputWarning = false;
        this.schoolAtGraduationFound = false;
      } else {
        if (this.editedGradStatus.schoolAtGrad.length == 8) {
          this.warningFlags.schoolAtGraduationNotFoundWarning = false;
          this.warningFlags.schoolAtGraduationWarning = false;
          this.warningFlags.schoolAtGraduationInputWarning = false;
          this.schoolAtGraduationFound = false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolAtGrad)
            .then((response) => {
              this.schoolAtGraduationStatus = response.data.openFlag;
              if (response.statusText == "No Content") {
                this.warningFlags.schoolAtGraduationNotFoundWarning = true;
              } else {
                this.warningFlags.schoolAtGraduationNotFoundWarning = false;
                if (this.schoolAtGraduationStatus == "N") {
                  this.warningFlags.schoolAtGraduationWarning = true;
                }
                this.schoolAtGraduationFound = true;
                this.editedGradStatus.schoolAtGradName =
                  response.data.schoolName;
              }
            })
            .catch((error) => {
              if (error.response.data.code == "404") {
                this.showNotification("danger", "School cannot be found");
              }
            });
        } else {
          this.warningFlags.schoolAtGraduationInputWarning = true;
        }
      }
      this.validateFields();
    },
    adultStartDateChange: function () {
      if (
        this.editedGradStatus.program == "1950" &&
        !this.editedGradStatus.adultStartDate
      ) {
        this.errorFlags.emptyError.adultStartDate = true;
      } else {
        this.errorFlags.emptyError.adultStartDate = false;
      }

      if (this.editedGradStatus.adultStartDate) {
        if (
          this.containsAnyLetters(this.editedGradStatus.adultStartDate) ||
          this.editedGradStatus.adultStartDate.length < 8
        ) {
          this.errorFlags.numberError.adultStartDate = true;
        } else {
          this.errorFlags.numberError.adultStartDate = false;
          this.validAdultStartDate(this.editedGradStatus.adultStartDate);
        }
      }
      this.validateFields();
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
    // getStudentReportsAndCertificates: function () {
    //   this.$root.$emit("studentProfile");
    // },
    // getStudentGraduationOptionalPrograms: function () {
    //   this.$root.$emit("refreshStudentGraduationOptionalPrograms");
    // },
    refreshStudentHistory: function () {
      this.$root.$emit("refreshStudentHistory");
    },
    sortStudentStatus(code) {
      return this.parseStudentStatus(code, this.studentStatusOptions);
    },
    validCompletionDate(date) {
      // format date to valid SCCP date
      if (this.editedGradStatus.program === "SCCP") {
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
    validateFields() {
      // assume able to save until positive error flag
      this.disableSave = false;

      for (let errorType in this.errorFlags) {
        for (let flag in this.errorFlags[errorType]) {
          if (this.errorFlags[errorType][flag] === true) {
            this.disableSave = true;
            return;
          }
        }
        if (this.disableSave) {
          return;
        }
      }
    },
    editGradStatus() {
      // reset object
      this.editedGradStatus = {};

      //If the student has a programCompletionDate disable input fields
      this.warningFlags.schoolOfRecordWarning = false;
      this.warningFlags.schoolNotFoundWarning = false;
      if (this.studentGradStatus.program != "1986-EN") {
        this.disableConsumerEdReqMet = true;
      } else {
        this.disableConsumerEdReqMet = false;
      }
      if (
        this.studentGradStatus.programCompletionDate != null &&
        this.studentGradStatus.program !== "SCCP"
      ) {
        this.disableProgramInput = true;
        this.disableStudentStatus = false;
      } else {
        this.disableProgramInput = false;
        this.disableStudentStatus = false;
      }

      if (
        this.studentGradStatus.studentStatus == "TER" ||
        this.studentGradStatus.studentStatus == "N"
      ) {
        this.disableProgramInput = false;
        this.disableStudentStatus = false;
      }
      this.showEdit = true;
      if (this.studentGradStatus.programCompletionDate) {
        this.$set(
          this.editedGradStatus,
          "programCompletionDate",
          this.studentGradStatus.programCompletionDate
        );
      } else {
        this.$set(this.editedGradStatus, "programCompletionDate", null);
      }
      this.$set(this.editedGradStatus, "pen", this.studentGradStatus.pen);
      this.$set(
        this.editedGradStatus,
        "program",
        this.studentGradStatus.program
      );
      this.$set(
        this.editedGradStatus,
        "studentGrade",
        this.studentGradStatus.studentGrade
      );
      this.$set(
        this.editedGradStatus,
        "schoolName",
        this.studentGradStatus.schoolName
      );
      this.$set(
        this.editedGradStatus,
        "schoolOfRecord",
        this.studentGradStatus.schoolOfRecord
      );
      this.$set(
        this.editedGradStatus,
        "schoolAtGrad",
        this.studentGradStatus.schoolAtGrad
      );
      this.$set(
        this.editedGradStatus,
        "schoolAtGradName",
        this.studentGradStatus.schoolAtGradName
      );
      this.$set(
        this.editedGradStatus,
        "studentStatus",
        this.studentGradStatus.studentStatus
      );
      this.$set(
        this.editedGradStatus,
        "studentID",
        this.studentGradStatus.studentID
      );
      this.$set(this.editedGradStatus, "gpa", this.studentGradStatus.gpa);
      this.$set(
        this.editedGradStatus,
        "honoursStanding",
        this.studentGradStatus.honoursStanding
      );
      this.$set(
        this.editedGradStatus,
        "adultStartDate",
        this.studentGradStatus.adultStartDate
      );
      this.$set(
        this.editedGradStatus,
        "consumerEducationRequirementMet",
        this.studentGradStatus.consumerEducationRequirementMet
      );
      this.$set(
        this.editedGradStatus,
        "recalculateGradStatus",
        this.studentGradStatus.recalculateGradStatus
      );
      this.$set(
        this.editedGradStatus,
        "recalculateProjectedGrad",
        this.studentGradStatus.recalculateProjectedGrad
      );
      this.validateFields();
    },

    cancelGradStatus() {
      this.showEdit = false;

      this.warningFlags.schoolOfRecordWarning = false;
      this.warningFlags.schoolNotFoundWarning = false;
      this.errorFlags.numberError.adultStartDate = false;
      this.errorFlags.numberError.programCompletionDate = false;
    },
    saveGraduationStatus(id) {
      //add the user info
      this.editedGradStatus.updatedBy = this.username;
      this.editedGradStatus.studentID = id;
      this.editedGradStatus.pen = this.studentPen;
      //process the program completion date
      if (this.editedGradStatus.programCompletionDate == "") {
        this.editedGradStatus.programCompletionDate = null;
      }
      if (this.editedGradStatus.programCompletionDate != null) {
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
        }
      }
      if (this.editedGradStatus.schoolOfRecord == "") {
        this.editedGradStatus.schoolOfRecord = null;
      }
      if (this.editedGradStatus.schoolAtGrad == "") {
        this.editedGradStatus.schoolAtGrad = null;
      }
      if (
        this.studentGradStatus.program == "1950" &&
        this.editedGradStatus.program != "1950"
      ) {
        this.editedGradStatus.adultStartDate = "";
        this.studentGradStatus.adultStartDate = "";
      }
      StudentService.editGraduationStatus(id, this.editedGradStatus)
        .then((response) => {
          this.updateStatus = response.data;
          this.setStudentGradStatus(response.data);
          this.loadStudentReportsAndCertificates();
          // this.getStudentReportsAndCertificates();
          this.loadStudentOptionalPrograms(id);
          // this.refreshStudentHistory();
          this.loadStudentHistory(id);
          this.loadStudentOptionalProgramHistory(id);
          this.studentGradStatus.studentStatusName = this.sortStudentStatus(
            response.data.studentStatus
          );
          this.getSchoolInfo(response.data.schoolOfRecord, "schoolOfRecord");
          this.getSchoolInfo(response.data.schoolAtGrad, "schoolAtGrad");
          this.showEdit = false;
          this.editedGradStatus = {};

          this.showNotification("success", "GRAD Status Saved");
        })
        .catch((error) => {
          //eslint-disable-next-line
          console.log(error);
          if (this.editedGradStatus.programCompletionDate != null) {
            this.editedGradStatus.programCompletionDate =
              this.editedGradStatus.programCompletionDate
                .replace("-", "/")
                .substring(0, 7);
          }
          if (error.response) {
            if (error.response.data) {
              this.notificationMessage = error.response.data.message;
            }
          }
          this.showNotification("danger", this.notificationMessage);
        });
    },

    getSchoolInfo(mincode, type) {
      if (mincode != null) {
        SchoolService.getSchoolInfo(mincode)
          .then((response) => {
            if (type == "schoolOfRecord") {
              this.schoolOfRecord = response.data;
            }
            if (type == "schoolAtGrad") {
              this.schoolAtGraduation = response.data;
            }
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log("There was an error:" + error.response);
          });
      }
    },
    ifProgramsWithExpiry(program) {
      for (let p of this.programsWithExpiry) {
        if (program == p) {
          return true;
        }
      }
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
