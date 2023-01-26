<template>
  <div class="graduation-status">
    <b-card no-body header="GRAD status">
      <b-card-text class="p-3">
        <b-button-group
          v-if="allowUpdateGradStatus"
          class="gradstatus-actions float-right"
        >
          <div v-if="!showEdit">
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
        <!-- <div v-if="studentGradStatus">
          <div v-if="recalculateFlag && recalculateProjectedGradFlag">
            <b-alert show variant="info" class="p-3 mb-1">
              <h4 class="alert-heading">Gradution data has changed for this student</h4>
              <p class="locked-message">
                The students' data will get updated tonight via the batch processes. However you can also immediately update the students' data as follows:
              </p>
              <ul class="locked-message">
                <li>Run the Graduate Student to update the student graduation status and credentials or the Update Student Reports if the student has graduated</li>
                <li>Run the Projected final marks and registrations to ensure the students’ TVR report is up-to-date.</li>
              </ul>
              <p class="locked-message">
                NOTE: this message will remain until the student gets run through the nightly batch processes to ensure the projected graduation report, the graduation report and the non-graduate report are updated for the School Secure WEB (TSW).
              </p>
            </b-alert>
          </div> 
          <div v-if="recalculateFlag && !recalculateProjectedGradFlag">
            <b-alert show variant="info" class="p-3 mb-1">
              <h4 class="alert-heading">Gradution data has changed for this student</h4>
              <p class="locked-message">
                The students' data will get updated tonight via the batch processes. However you can also immediately update the students' data as follows:
              </p>
              <ul class="locked-message">
                <li>Run the Graduate Student to update the student graduation status and credentials or run Update Student Reports if the student has graduated</li>
              </ul>
              <p class="locked-message">
                NOTE: this message will remain until the student gets run through the nightly batch processes to ensure the graduation report and the non-graduate report are updated for the School Secure WEB (TSW).
              </p>
            </b-alert>
          </div> 
          <div v-if="!recalculateFlag && recalculateProjectedGradFlag">
            <b-alert show variant="info" class="p-3 mb-1">
              <h4 class="alert-heading">Graduation data has changed for this student and has been updated, however, the students' TVR is not up-to-date.</h4>
              <p class="locked-message">
                The students' TVR data will get updated tonight via the batch processes.  However you can also immediately update the students' data as follows:
              </p>
              <ul class="locked-message">
                <li>Run the Projected final marks and registrations to ensure the students’ TVR report is up-to-date.</li>
              </ul>
              <p class="locked-message">
                NOTE: this message will remain until the student gets run through the nightly batch processes to ensure the projected graduation report is updated for the School Secure WEB (TSW).
              </p>
            </b-alert>
          </div>  
        </div> -->

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
        <div v-if="dateInFutureWarning">
          <b-alert show variant="warning" class="p-3 mb-1">
            <p class="locked-message">
              Program Completion date cannot be in the future if a student has
              completed SCCP.
            </p>
          </b-alert>
        </div>
        <div v-if="dateBlankWarning">
          <b-alert show variant="warning" class="p-3 mb-1">
            <p class="locked-message">
              Program Completion date cannot be blank. Please use Undo
              Completion from the Run Graduation Algorithm dropdown.
            </p>
          </b-alert>
        </div>
        <div v-if="notANumberWarning">
          <b-alert show variant="warning" class="p-3 mb-1">
            <p class="locked-message">
              Program Completion format invalid. Please follow date format
              YYYY/MM/DD for SCCP or YYYY/MM for other Programs.
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
                <div
                  v-if="editedGradStatus.program != studentGradStatus.program"
                >
                  <div
                    v-if="programChangeWarning"
                    class="form-validation-message text-danger"
                  >
                    Warning, any optional programs associated with the original
                    program will be <strong>deleted</strong>. You must add back
                    in any pertinent optional programs once you have saved the
                    changes to Program.
                  </div>
                </div>
                <div
                  v-if="closedProgramWarning"
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
              <td>{{ studentGradStatus.programCompletionDate }}</td>
            </tr>
            <tr v-if="showEdit">
              <td v-if="editedGradStatus.program != 'SCCP'">
                <strong>Program completion date: (YYYY/MM)</strong><br />
                <div
                  v-if="programCompletionDateRangeError"
                  class="form-validation-message text-danger"
                >
                  The program completion date is out of date range&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
              </td>
              <td v-else-if="editedGradStatus.program == 'SCCP'">
                <strong>Program completion date: (YYYY/MM/DD)</strong><br />
                <div
                  v-if="programCompletionDateRangeError"
                  class="form-validation-message text-danger"
                >
                  The program completion date is out of date range&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
              </td>
              <td>
                <b-input
                  :disabled="
                    editedGradStatus.programCompletionDate &&
                    editedGradStatus.programCompletionDate.length > 0
                  "
                  size="sm"
                  type="text"
                  maxLength="10"
                  @keyup="dateFormatYYYYMMDD()"
                  v-model="editedGradStatus.programCompletionDate"
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
                  v-if="studentGradStatus.schoolOfRecord"
                  class="p-0 text-left"
                  id="school-of-record-popover"
                  variant="link"
                  @click="
                    getSchoolInfo(
                      studentGradStatus.schoolOfRecord,
                      'schoolOfRecord'
                    )
                  "
                >
                  {{ studentGradStatus.schoolName }}<br />
                  {{ studentGradStatus.schoolOfRecord }}
                </b-button>
                <b-popover
                  :boundary-padding="50"
                  delay="800"
                  target="school-of-record-popover"
                  title="School Information"
                  triggers="focus"
                  v-if="studentGradStatus.schoolOfRecord"
                >
                  <table role="presentation" aria-label="grad status">
                    <tbody>
                      <tr>
                        <td>
                          <strong>District:</strong>
                          {{ schoolOfRecord.districtName }}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>School name:</strong> <br />
                          {{ schoolOfRecord.schoolName }}
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
                </b-popover>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>School of record:</strong><br />
                <div
                  v-if="schoolOfRecordMissing"
                  class="form-validation-message text-warning"
                >
                  This School is closed, changes should be to historical
                  activity only&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolOfRecordWarning"
                  class="form-validation-message text-warning"
                >
                  This School is closed, changes should be to historical
                  activity only&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolNotFoundWarning"
                  class="form-validation-message text-danger"
                >
                  Invalid school entered, school does not exist on the school
                  table&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolOfRecordInputWarning"
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
                  id="school-at-graduation-popover"
                  variant="link"
                  @click="
                    getSchoolInfo(
                      studentGradStatus.schoolAtGrad,
                      'schoolAtGrad'
                    )
                  "
                >
                  {{ studentGradStatus.schoolAtGradName }}<br />
                  {{ studentGradStatus.schoolAtGrad }}
                </b-button>
                <b-popover
                  v-if="studentGradStatus && studentGradStatus.schoolAtGrad"
                  :boundary-padding="50"
                  delay="800"
                  target="school-at-graduation-popover"
                  title="School Information"
                  triggers="focus"
                >
                  <table
                    role="presentation"
                    aria-label="edit graduation status"
                  >
                    <tr>
                      <td>
                        <strong>District:</strong>
                        {{ schoolAtGraduation.districtName }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>School name:</strong> <br />
                        {{ schoolAtGraduation.schoolName }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Status:</strong>
                        {{
                          schoolAtGraduation.openFlag == "Y" ? "Open" : "Closed"
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
                  </table>
                </b-popover>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>School at graduation:</strong><br />
                <div
                  v-if="schoolAtGraduationWarning"
                  class="form-validation-message text-warning"
                >
                  Warning: This School is closed, changes should be to
                  historical activity only&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolAtGradProgramCompletionDateMessage"
                  class="form-validation-message text-danger"
                >
                  If program completion date is not blank, school at graduation
                  cannot be blank&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolAtGraduationNotFoundWarning"
                  class="form-validation-message text-warning"
                >
                  Invalid school entered, school does not exist on the school
                  table&nbsp;&nbsp;<i
                    class="fas fa-exclamation-triangle"
                    aria-hidden="true"
                  ></i>
                </div>
                <div
                  v-if="schoolAtGraduationInputWarning"
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
                  studentGradStatus.adultStartDate
                }}</span>
              </td>
            </tr>
            <tr v-if="showEdit">
              <td>
                <strong>Adult start date: </strong>
              </td>
              <td>
                <b-input
                  :disabled="editedGradStatus.program != '1950'"
                  size="sm"
                  type="text"
                  maxLength="10"
                  @keyup="dateFormatYYYYMMDD()"
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
            <tr></tr>
          </tbody>
        </table>
        <b-alert show variant="info" class="p-3 mb-1">
          <p>
            <strong>DEBUG</strong><br />&nbsp;recalc grad:
            {{ String(recalculateFlag) }}<br />&nbsp;recalc projected grad:
            {{ String(recalculateProjectedGradFlag) }}
          </p>
        </b-alert>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SchoolService from "@/services/SchoolService.js";
import sharedMethods from "../../sharedMethods";
import StudentService from "@/services/StudentService.js";

export default {
  name: "GRADStatus",
  computed: {
    ...mapGetters("auth", ["roles"]),
    ...mapGetters("useraccess", ["allowUpdateGradStatus"]),
    ...mapGetters({
      optionalPrograms: "getStudentOptionalPrograms",
      programOptions: "app/getProgramOptions",
      studentStatusOptions: "app/getStudentStatusOptions",
      studentId: "getStudentId",
      studentGradStatus: "getStudentGradStatus",
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
    ...mapGetters({
      optionalPrograms: "student/getStudentOptionalPrograms",
      programOptions: "app/getProgramOptions",
      studentStatusOptions: "app/getStudentStatusOptions",
      studentId: "student/getStudentId",
      studentGradStatus: "student/getStudentGradStatus",
    }),
  },
  data() {
    return {
      programCompletionEffectiveDateList: [],
      programCompletionDateRangeError: false,
      programChangeWarning: false,
      programEffectiveDate: "",
      programExpiryDate: "",
      errorMessage: "",
      dismissSecs: 3,
      dismissCountDown: 0,
      showModal: false,
      showTop: false,
      showEdit: false,
      show: false,
      projectedStudentGradStatus: [],
      updateStatus: [],
      schoolOfRecord: "",
      schoolOfRecordStatus: "",
      schoolOfRecordMissing: false,
      schoolOfRecordWarning: false,
      schoolNotFoundWarning: false,
      schoolOfRecordInputWarning: false,
      dateBlankWarning: false,
      schoolFound: false,
      schoolAtGradProgramCompletionDateMessage: false,
      schoolAtGraduation: "",
      schoolAtGraduationStatus: "",
      schoolAtGraduationWarning: false,
      schoolAtGraduationNotFoundWarning: false,
      schoolAtGraduationInputWarning: false,
      schoolAtGraduationFound: false,
      editedGradStatus: {},
      studentUngradReason: "",
      disableSave: false,
      notANumberWarning: false,
      disableSchoolAtGrad: false,
      disableProgramInput: false,
      disableConsumerEdReqMet: false,
      disableStudentStatus: false,
      dateInFutureWarning: false,
      closedProgramWarning: false,
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
      programsWithExpiry: [
        "1986-EN",
        "1996-EN",
        "1996-PF",
        "2004-EN",
        "2004-PF",
      ],
    };
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
    this.containsAnyLetters = sharedMethods.containsAnyLetters;
  },
  watch: {
    studentGradeChange: function () {
      if (
        this.editedGradStatus.studentGrade == "AD" ||
        this.editedGradStatus.studentGrade == "AN"
      ) {
        if (this.editedGradStatus.program == "1950") {
          if (this.editedGradStatus.schoolOfRecord == "") {
            this.schoolOfRecordMissing = true;
            this.disableSave = true;
          } else {
            this.schoolOfRecordMissing = false;
            this.disableSave = false;
          }
        } else {
          this.disableSave = true;
        }
      }
      if (
        this.editedGradStatus.studentGrade != "AD" &&
        this.editedGradStatus.studentGrade != "AN"
      ) {
        if (this.editedGradStatus.program == "1950") {
          this.disableSave = true;
        } else {
          if (this.editedGradStatus.schoolOfRecord == "") {
            this.schoolOfRecordMissing = true;
            this.disableSave = true;
          } else {
            this.schoolOfRecordMissing = false;
            this.disableSave = false;
          }
          if (this.editedGradStatus.schoolOfRecord == "") {
            this.schoolOfRecordMissing = true;
            this.disableSave = true;
          } else {
            this.schoolOfRecordMissing = false;
            this.disableSave = false;
          }
        }
      }
    },
    programChange: function () {
      this.programChangeWarning = true;
      if (
        this.studentGradStatus.programCompletionDate &&
        this.studentGradStatus.program != "SCCP"
      ) {
        this.disableProgramInput = true;
        this.disableSave = true;
      } else {
        this.disableProgramInput = false;
        this.disableSave = false;
      }
      if (this.editedGradStatus.program == "1950") {
        if (
          this.editedGradStatus.studentGrade == "AD" ||
          this.editedGradStatus.studentGrade == "AN"
        ) {
          this.disableSave = false;
        } else {
          this.disableSave = true;
        }
      } else {
        if (
          this.editedGradStatus.studentGrade == "AD" ||
          this.editedGradStatus.studentGrade == "AN"
        ) {
          this.disableSave = true;
        } else {
          this.disableSave = false;
        }
      }
      if (this.ifProgramsWithExpiry(this.editedGradStatus.program)) {
        this.closedProgramWarning = true;
      } else {
        this.closedProgramWarning = false;
      }
    },
    programCompletionDateChange: function () {
      let programNameSearch = this.editedGradStatus.program;
      for (let programOpt of this.programOptions) {
        if (programOpt.programCode == programNameSearch) {
          this.programCompletionEffectiveDateList.push(programOpt);
        }
      }
      this.programEffectiveDate = new Date(
        this.programCompletionEffectiveDateList[0].effectiveDate
      );
      this.programExpiryDate = new Date(
        this.programCompletionEffectiveDateList[0].expiryDate
      );

      if (this.editedGradStatus.program === "SCCP") {
        this.disableSave = !this.validCompletionDate(
          new Date(this.editedGradStatus.programCompletionDate),
          this.programEffectiveDate,
          this.programExpiryDate
        );
      }

      if (this.editedGradStatus.programCompletionDate) {
        if (
          this.containsAnyLetters(this.editedGradStatus.programCompletionDate)
        ) {
          this.notANumberWarning = true;
          this.disableSave = true;
        } else {
          this.notANumberWarning = false;
          this.disableSave = false;
        }
      }
    },
    schoolOfRecordChange: function () {
      if (this.editedGradStatus.schoolOfRecord.length == "") {
        this.disableSave = true;
      } else {
        this.schoolOfRecordMissing = false;
        this.disableSave = false;
      }
      if (this.editedGradStatus.schoolOfRecord.length < 8) {
        this.schoolOfRecordWarning = false;
        this.schoolNotFoundWarning = false;
        this.schoolOfRecordInputWarning = true;
        return;
      }
      if (
        this.editedGradStatus.schoolOfRecord ==
        this.studentGradStatus.schoolOfRecord
      ) {
        this.schoolOfRecordWarning = false;
        this.schoolNotFoundWarning = false;
        this.schoolOfRecordInputWarning = false;
        this.schoolFound = false;
      } else {
        if (this.editedGradStatus.schoolOfRecord.length == 8) {
          this.schoolNotFoundWarning = false;
          this.schoolOfRecordWarning = false;
          this.schoolOfRecordInputWarning = false;
          this.schoolFound = false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolOfRecord)
            .then((response) => {
              this.schoolOfRecordStatus = response.data.openFlag;
              if (response.statusText == "No Content") {
                this.schoolNotFoundWarning = true;
              } else {
                this.schoolNotFoundWarning = false;
                if (this.schoolOfRecordStatus == "N") {
                  this.schoolOfRecordWarning = true;
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
          this.schoolNotFoundWarning = true;
        }
      }
    },
    schoolAtGradChange: function () {
      if (this.editedGradStatus.schoolAtGrad == "") {
        if (this.editedGradStatus.programCompletionDate != "") {
          this.disableSave = true;
          this.schoolAtGradProgramCompletionDateMessage = true;
        } else {
          this.disableSave = false;
          this.schoolAtGradProgramCompletionDateMessage = false;
        }
      } else {
        this.disableSave = false;
        this.schoolAtGradProgramCompletionDateMessage = false;
      }

      if (
        this.editedGradStatus.schoolAtGrad &&
        this.editedGradStatus.schoolAtGrad.length < 8
      ) {
        this.schoolAtGraduationWarning = false;
        this.schoolAtGraduationNotFoundWarning = false;
        this.schoolAtGraduationInputWarning = true;
        this.schoolAtGraduationFound = false;
        return;
      } else {
        this.schoolAtGraduationInputWarning = false;
      }
      if (
        this.editedGradStatus.schoolAtGrad ==
        this.studentGradStatus.schoolAtGrad
      ) {
        this.schoolAtGraduationWarning = false;
        this.schoolAtGraduationNotFoundWarning = false;
        this.schoolAtGraduationInputWarning = false;
        this.schoolAtGraduationFound = false;
      } else {
        if (this.editedGradStatus.schoolAtGrad.length == 8) {
          this.schoolAtGraduationNotFoundWarning = false;
          this.schoolAtGraduationWarning = false;
          this.schoolAtGraduationInputWarning = false;
          this.schoolAtGraduationFound = false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolAtGrad)
            .then((response) => {
              this.schoolAtGraduationStatus = response.data.openFlag;
              if (response.statusText == "No Content") {
                this.schoolAtGraduationNotFoundWarning = true;
              } else {
                this.schoolAtGraduationNotFoundWarning = false;
                if (this.schoolAtGraduationStatus == "N") {
                  this.schoolAtGraduationWarning = true;
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
          this.schoolAtGraduationInputWarning = true;
        }
      }
    },
    adultStartDateChange: function () {
      if (this.editedGradStatus.adultStartDate) {
        if (this.containsAnyLetters(this.editedGradStatus.adultStartDate)) {
          this.notANumberWarning = true;
          this.disableSave = true;
        } else {
          this.notANumberWarning = false;
          this.disableSave = false;
        }
      }
    },
  },
  methods: {
    getStudentReportsAndCertificates: function () {
      this.$root.$emit("studentProfile");
    },
    getStudentGraduationOptionalPrograms: function () {
      this.$root.$emit("refreshStudentGraduationOptionalPrograms");
    },
    refreshStudentHistory: function () {
      this.$root.$emit("refreshStudentHistory");
    },
    getStudentStatus(code) {
      return sharedMethods.getStudentStatus(code, this.studentStatusOptions);
    },

    dateFormatYYYYMM() {
      let value = this.editedGradStatus.programCompletionDate;
      this.editedGradStatus.programCompletionDate = value.replace(
        /^([\d]{4})([\d]{2})$/,
        "$1/$2"
      );
    },

    dateFormatYYYYMMDD() {
      let value = this.editedGradStatus.programCompletionDate;
      this.editedGradStatus.programCompletionDate = value.replace(
        /^([\d]{4})([\d]{2})([\d]{2})$/,
        "$1/$2/$3"
      );
    },

    validCompletionDate(date, start, end) {
      return (!start || date < end) && (!end || date > start);
      // how to handle null
    },
    editGradStatus() {
      //If the student has a programCompletionDate disable input fields
      this.schoolOfRecordWarning = false;
      this.schoolNotFoundWarning = false;
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
        this.disableSchoolAtGrad = false;
        this.disableStudentStatus = false;
      } else {
        this.disableProgramInput = false;
        this.disableStudentStatus = false;
        this.disableSchoolAtGrad = true;
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
    },

    cancelGradStatus() {
      this.showEdit = false;
      this.studentUngradReason = "";
      this.schoolOfRecordWarning = false;
      this.schoolNotFoundWarning = false;
      this.dateBlankWarning = false;
      this.dateInFutureWarning = false;
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
      StudentService.editGraduationStatus(id, this.editedGradStatus)
        .then((response) => {
          this.updateStatus = response.data;
          this.getStudentReportsAndCertificates();
          this.studentGradStatus.pen = response.data.pen;
          this.studentGradStatus.program = response.data.program;
          this.studentGradStatus.programCompletionDate =
            response.data.programCompletionDate;
          this.studentGradStatus.honoursStanding =
            response.data.honoursStanding;
          this.studentGradStatus.gpa = response.data.gpa;
          this.studentGradStatus.studentGrade = response.data.studentGrade;
          this.studentGradStatus.schoolName = this.editedGradStatus.schoolName;
          this.studentGradStatus.schoolOfRecord = response.data.schoolOfRecord;
          this.studentGradStatus.schoolAtGradName =
            this.editedGradStatus.schoolAtGradName;
          this.studentGradStatus.schoolAtGrad = response.data.schoolAtGrad;
          this.studentGradStatus.studentStatus = response.data.studentStatus;
          this.studentGradStatus.recalculateGradStatus =
            response.data.recalculateGradStatus;
          this.studentGradStatus.updatedTimestamp =
            response.data.updatedTimestamp;
          this.studentGradStatus.adultStartDate = response.data.adultStartDate;
          this.studentGradStatus.consumerEducationRequirementMet =
            response.data.consumerEducationRequirementMet;
          this.getStudentGraduationOptionalPrograms();
          this.refreshStudentHistory();
          this.studentGradStatus.studentStatusName = this.getStudentStatus(
            response.data.studentStatus
          );
          this.showTop = !this.showTop;
          this.showEdit = false;

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
              this.errorMessage = error.response.data.message;
            }
          }
          this.showNotification("danger", this.errorMessage);
        });
    },

    getSchoolInfo(mincode, type) {
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
.graduation-status table tr td {
  vertical-align: top;
  height: 42px !important;
}
.card-body {
  border-bottom: 1px solid #ccc;
}
.card {
  margin-bottom: 10px;
}
.card-header {
  font-weight: 700;
}
.gradstatus-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}
.edit {
  padding: 10px;
}
.form-validation-message {
  font-size: 11px;
}
.form-control:disabled {
  color: #6c757d;
  background-color: #e9ecef;
}
a.disabled {
  color: #6c757d;
  pointer-events: none;
}
</style>
