<template>
  <div class="graduation-status">
    <v-card no-body title="GRAD Status">
      <v-card-text class="p-3">
        <GRADStatusForm class="gradstatus-actions float-right"></GRADStatusForm>

        <!-- Info callout in edit form when student status is MER/Merged -->
        <!-- <div
          v-if="studentGradStatus && studentGradStatus.studentStatus == 'MER'"
        >
          <v-alert show variant="info" type="info" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Merged</h4>
            <p class="locked-message">
              This student's status is set to 'Merged'. Their data cannot be
              changed.
            </p>
          </v-alert>
        </div> -->
        <!-- Warning callout in edit form when student status is N/Not Active -->
        <!-- <div v-if="studentGradStatus && studentGradStatus.studentStatus == 'N'">
          <v-alert show variant="tonal" type="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Not active</h4>
            <p class="locked-message">
              This student's status is set to 'Not active'. Re-activate their
              record by setting their 'Student status' to 'Active' if they are
              enrolled in a school.
            </p>
          </v-alert>
        </div> -->
        <!-- Warning callout in edit form when student status is TER/Terminated -->
        <!-- <div
          v-else-if="
            studentGradStatus && studentGradStatus.studentStatus == 'TER'
          "
        >
          <v-alert show variant="tonal" type="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Terminated</h4>
            <p class="locked-message">
              This student's status is set to 'Terminated'. Re-activate their
              record by setting their 'Student status' to 'Current' if they are
              enrolled in a school.
            </p>
          </v-alert>
        </div> -->
        <!-- Warning callout in edit form when student status is ARC/Archived -->
        <!-- <div
          v-else-if="
            studentGradStatus && studentGradStatus.studentStatus == 'ARC'
          "
        >
          <v-alert show variant="tonal" type="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Archived</h4>
            <p class="locked-message">
              This student is not active. Re-activate by setting their status to
              "Current" if they are currently attending school
            </p>
          </v-alert>
        </div> -->
        <!-- Warning callout in edit form when student status is DEC/Deceased -->
        <!-- <div
          v-else-if="
            studentGradStatus && studentGradStatus.studentStatus == 'DEC'
          "
        >
          <v-alert show variant="tonal" type="warning" class="p-3 mb-1">
            <h4 class="alert-heading">Student status: Deceased</h4>
            <p class="locked-message">
              Warning: This student is showing as "Deceased".
            </p>
          </v-alert>
        </div> -->
        <v-table density="compact" aria-label="edit grad status">
          <tbody>
            <!-- Program -->
            <tr>
              <td class="w-50"><strong>Program: </strong></td>
              <td class="w-50">
                <span>{{ studentGradStatus.program }}</span>
              </td>
            </tr>
            <!-- Program completion date -->
            <tr>
              <td><strong>Program completion date: </strong></td>
              <td>
                {{
                  $filters.formatYYYYMMDate(
                    studentGradStatus.programCompletionDate
                  )
                }}
              </td>
            </tr>
            <!-- Student status -->
            <tr>
              <td><strong>Student status: </strong></td>
              <td>
                <span v-if="studentGradStatus.studentStatus">{{
                  studentGradStatus.studentStatusName
                }}</span>
              </td>
            </tr>
            <!-- Student grade -->
            <tr>
              <td><strong>Student grade: </strong></td>
              <td>
                <span v-if="studentGradStatus.studentGrade">{{
                  studentGradStatus.studentGrade
                }}</span>
              </td>
            </tr>
            <!-- School of record -->
            <tr>
              <td><strong>School of record: </strong></td>
              <td>
                <v-btn
                  class="v-btn-link p-0 text-left"
                  variant="plain"
                  @click="
                    schoolOfRecordDialog = true;
                    getSchoolInfo(
                      studentGradStatus.schoolOfRecord,
                      'schoolOfRecord'
                    );
                  "
                >
                  {{
                    studentGradStatus.schoolName
                      ? studentGradStatus.schoolName
                      : schoolOfRecord.schoolName
                  }}<br />
                  {{ studentGradStatus.schoolOfRecord }}
                </v-btn>

                <v-dialog v-model="schoolOfRecordDialog" max-width="600px">
                  <v-card>
                    <v-card-title class="text-h6"
                      >School of record
                      <v-progress-circular
                        v-if="schoolSearchLoading"
                        indeterminate
                        color="green"
                      >
                      </v-progress-circular
                    ></v-card-title>
                    <v-card-text>
                      <v-table role="presentation" aria-label="grad status">
                        <template v-if="schoolOfRecord.districtName">
                          <tbody>
                            <tr>
                              <td><strong>District:</strong></td>
                              <td>{{ schoolOfRecord.districtName }}</td>
                            </tr>
                            <tr>
                              <td><strong>School Code and Name:</strong></td>
                              <td>
                                {{
                                  schoolOfRecord.minCode +
                                  " " +
                                  schoolOfRecord.schoolName
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Status:</strong></td>
                              <td>
                                {{
                                  schoolOfRecord.openFlag == "Y"
                                    ? "Open"
                                    : "Closed"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Independent type:</strong></td>
                              <td>
                                {{ schoolOfRecord.independentDesignation }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Independent affiliation:</strong></td>
                              <td>
                                {{ schoolOfRecord.independentAffiliation }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Transcript eligible:</strong></td>
                              <td>
                                {{ schoolOfRecord.transcriptEligibility }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Dogwood eligibility:</strong></td>
                              <td>
                                {{ schoolOfRecord.certificateEligibility }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        @click="schoolOfRecordDialog = false"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            <!-- School at graduation -->
            <tr>
              <td><strong>School at graduation: </strong></td>
              <td>
                <v-btn
                  v-if="studentGradStatus && studentGradStatus.schoolAtGrad"
                  class="p-0 text-left v-btn-link"
                  variant="plain"
                  @click="
                    schoolAtGradDialog = true;
                    getSchoolInfo(
                      studentGradStatus.schoolAtGrad,
                      'schoolAtGrad'
                    );
                  "
                >
                  {{
                    studentGradStatus.schoolAtGradName
                      ? studentGradStatus.schoolAtGradName
                      : schoolAtGraduation.schoolName
                  }}<br />
                  {{ studentGradStatus.schoolAtGrad }}
                  <v-progress-circular
                    v-if="schoolSearchLoading"
                    indeterminate
                    color="green"
                  >
                  </v-progress-circular>
                </v-btn>

                <v-dialog v-model="schoolAtGradDialog" max-width="600px">
                  <v-card>
                    <v-card-title class="text-h6"
                      >School at graduation</v-card-title
                    >
                    <v-card-text>
                      <v-table
                        role="presentation"
                        aria-label="edit graduation status"
                      >
                        <template v-if="schoolAtGraduation.districtName">
                          <tbody>
                            <tr>
                              <td><strong>District:</strong></td>
                              <td>{{ schoolAtGraduation.districtName }}</td>
                            </tr>
                            <tr>
                              <td><strong>School Code and Name:</strong></td>
                              <td>
                                {{
                                  schoolAtGraduation.minCode +
                                  " " +
                                  schoolAtGraduation.schoolName
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Status:</strong></td>
                              <td>
                                {{
                                  schoolAtGraduation.openFlag == "Y"
                                    ? "Open"
                                    : "Closed"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Independent type:</strong></td>
                              <td>
                                {{ schoolAtGraduation.independentDesignation }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Independent affiliation:</strong></td>
                              <td>
                                {{ schoolAtGraduation.independentAffiliation }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Transcript eligible:</strong></td>
                              <td>
                                {{ schoolAtGraduation.transcriptEligibility }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Dogwood eligibility:</strong></td>
                              <td>
                                {{ schoolAtGraduation.certificateEligibility }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="schoolAtGradDialog = false"
                        >Close</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            <!-- Honours standing -->
            <tr>
              <td><strong>Honours standing:</strong></td>
              <td>
                <span v-if="studentGradStatus.honoursStanding">
                  {{ studentGradStatus.honoursStanding }}</span
                >
              </td>
            </tr>
            <!-- GPA -->
            <tr>
              <td><strong>GPA:</strong></td>
              <td>
                <span
                  v-if="studentGradStatus.gpa && studentGradStatus.gpa > 0"
                  >{{ studentGradStatus.gpa }}</span
                >
              </td>
            </tr>
            <!-- Optional Programs -->
            <tr>
              <td><strong>Optional Programs:</strong></td>
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
            <!-- Adult start date -->
            <tr>
              <td><strong>Adult start date: </strong></td>
              <td>
                <span v-if="studentGradStatus.adultStartDate">{{
                  $filters.formatSimpleDate(studentGradStatus.adultStartDate)
                }}</span>
              </td>
            </tr>
            <!-- Consumer education requirement met -->
            <tr>
              <td><strong>Consumer education requirement met:</strong></td>
              <td>
                <span v-if="studentGradStatus.consumerEducationRequirementMet">
                  {{ studentGradStatus.consumerEducationRequirementMet }}</span
                >
              </td>
            </tr>
            <!-- Recalculate Grad Status -->
            <tr>
              <td><strong>Recalculate Grad Status:</strong></td>
              <td>
                {{ String(studentGradStatus.recalculateGradStatus) }}
              </td>
            </tr>
            <!-- Recalculate Projected Grad -->
            <tr>
              <td><strong>Recalculate Projected Grad:</strong></td>
              <td>
                {{ String(studentGradStatus.recalculateProjectedGrad) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "../../../store/modules/app";
import { useStudentStore } from "../../../store/modules/student";
import { useAccessStore } from "../../../store/modules/access";
import {
  containsAnyLetters,
  parseStudentStatus,
} from "../../../utils/common.js";
import SchoolService from "@/services/SchoolService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import GRADStatusForm from "./GRADStatusForm.vue";
export default {
  name: "GRADStatus",
  created() {
    this.containsAnyLetters = containsAnyLetters;
    this.parseStudentStatus = parseStudentStatus;
  },
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  components: {
    GRADStatusForm: GRADStatusForm,
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
  },
  data() {
    return {
      schoolSearchLoading: false,
      schoolAtGradDialog: false,
      schoolOfRecordDialog: false,
      snackbarStore: useSnackbarStore(),
      show: false,
      schoolOfRecord: "",
      schoolAtGraduation: "",
      programsWithExpiry: [
        "1986-EN",
        "1996-EN",
        "1996-PF",
        "2004-EN",
        "2004-PF",
      ],
    };
  },

  methods: {
    ...mapActions(useStudentStore, [
      "setStudentGradStatus",
      "loadStudentReportsAndCertificates",
      "loadStudentOptionalPrograms",
      "loadStudentHistory",
      "loadStudentOptionalProgramHistory",
    ]),
    refreshStudentHistory: function () {
      this.$root.$emit("refreshStudentHistory");
    },
    sortStudentStatus(code) {
      return this.parseStudentStatus(code, this.studentStatusOptions);
    },
    getSchoolInfo(mincode, type) {
      if (mincode != null) {
        this.schoolSearchLoading = true;
        SchoolService.getSchoolInfo(mincode)
          .then((response) => {
            if (type == "schoolOfRecord") {
              this.schoolOfRecord = response.data;
              this.schoolSearchLoading = false;
            }
            if (type == "schoolAtGrad") {
              this.schoolAtGraduation = response.data;
              this.schoolSearchLoading = false;
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
