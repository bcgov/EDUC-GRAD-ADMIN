<template>
  <div class="graduation-status">
    <v-card no-body title="GRAD Status">
      <v-card-text class="p-3">
        <GRADStatusForm class="gradstatus-actions float-right"></GRADStatusForm>
        <v-table density="comfortable" aria-label="edit grad status">
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
                <SchoolDetailsDialog
                  title="TEST"
                  :school="getSchoolById(studentGradStatus.schoolOfRecordId)"
                />
                <!-- OLD SCHOOL OF RECORD DISPLAY - DELETE -->
                <!-- <v-btn
                  class="v-btn-link p-0 text-left"
                  variant="plain"
                  :disabled="getSchoolsList.length == 0"
                  @click="
                    schoolOfRecordDialog = true;
                    getSchoolInfo(
                      studentGradStatus.schoolOfRecordId,
                      'schoolOfRecord'
                    );
                  "
                >
                  {{
                    getSchoolById(studentGradStatus.schoolOfRecordId)
                      ?.displayNameNoSpecialChars ??
                    getSchoolById(studentGradStatus.schoolOfRecordId)
                      ?.displayName
                  }}<br />
                  {{
                    getSchoolById(studentGradStatus.schoolOfRecordId)?.mincode
                  }}
                </v-btn> -->

                <!-- <v-dialog v-model="schoolOfRecordDialog" max-width="600px">
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
                        <template v-if="schoolOfRecord">
                          <tbody>
                            <tr>
                              <td><strong>District:</strong></td>
                              <td>{{ schoolOfRecord.districtId }}</td>
                            </tr>
                            <tr>
                              <td><strong>School Code and Name:</strong></td>
                              <td>
                                {{
                                  schoolOfRecord.mincode +
                                  " " +
                                  schoolOfRecord.displayName
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>School Category Code</strong></td>
                              <td>{{ schoolOfRecord.schoolCategoryCode }}</td>
                            </tr>
                            <tr>
                              <td><strong>Open Date:</strong></td>
                              <td>
                                {{
                                  $filters.formatSimpleDate(
                                    schoolOfRecord?.openedDate
                                  )
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Close Date:</strong></td>
                              <td>
                                {{
                                  $filters.formatSimpleDate(
                                    schoolOfRecord?.closedDate
                                  )
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Issue Transcript:</strong></td>
                              <td>
                                {{
                                  schoolOfRecord.canIssueTranscripts == true
                                    ? "Y"
                                    : "N"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Issue Certificate:</strong></td>
                              <td>
                                {{
                                  schoolOfRecord.canIssueCertificates == true
                                    ? "Y"
                                    : "N"
                                }}
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
                </v-dialog> -->
              </td>
            </tr>
            <!-- School at graduation -->
            <tr>
              <td><strong>School at graduation: </strong></td>
              <td>
                <SchoolDetailsDialog
                  title="TEST"
                  :school="getSchoolById(studentGradStatus.schoolAtGradId)"
                />
                <!-- OLD SCHOOL AT GRAD BTN - DELETE -->
                <!-- <v-btn
                  v-if="studentGradStatus && studentGradStatus.schoolAtGrad"
                  :disabled="getSchoolsList.length == 0"
                  class="p-0 text-left v-btn-link"
                  variant="plain"
                  @click="
                    schoolAtGradDialog = true;
                    getSchoolInfo(
                      studentGradStatus.schoolAtGradId,
                      'schoolAtGrad'
                    );
                  "
                >
                  {{
                    getSchoolById(studentGradStatus.schoolAtGradId)
                      ?.displayNameNoSpecialChars ??
                    getSchoolById(studentGradStatus.schoolAtGradId)
                      ?.displayName
                  }}<br />
                  {{ getSchoolById(studentGradStatus.schoolAtGradId)?.mincode }}
                  <v-progress-circular
                    v-if="schoolSearchLoading"
                    indeterminate
                    color="green"
                  >
                  </v-progress-circular>
                </v-btn> -->

                <!-- <v-dialog v-model="schoolAtGradDialog" max-width="600px">
                  <v-card>
                    <v-card-title class="text-h6"
                      >School at graduation</v-card-title
                    >
                    <v-card-text>
                      <v-table
                        role="presentation"
                        aria-label="edit graduation status"
                      >
                        <template v-if="schoolAtGraduation">
                          <tbody>
                            <tr>
                              <td><strong>District:</strong></td>
                              <td>{{ schoolAtGraduation.districtId }}</td>
                            </tr>
                            <tr>
                              <td><strong>School Code and Name:</strong></td>
                              <td>
                                {{
                                  schoolAtGraduation.mincode +
                                  " " +
                                  schoolAtGraduation.displayName
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Open Date:</strong></td>
                              <td>
                                {{
                                  $filters.formatSimpleDate(
                                    schoolAtGraduation?.openedDate
                                  )
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Close Date:</strong></td>
                              <td>
                                {{
                                  $filters.formatSimpleDate(
                                    schoolAtGraduation?.closedDate
                                  )
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Issue Transcript:</strong></td>
                              <td>
                                {{
                                  schoolAtGraduation.canIssueTranscripts == true
                                    ? "Y"
                                    : "N"
                                }}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Issue Certificate:</strong></td>
                              <td>
                                {{
                                  schoolAtGraduation.canIssueCertificates ==
                                  true
                                    ? "Y"
                                    : "N"
                                }}
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
                </v-dialog> -->
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
import sharedMethods from "../../../sharedMethods";
import { useSnackbarStore } from "@/store/modules/snackbar";
import GRADStatusForm from "./GRADStatusForm.vue";
import SchoolDetailsDialog from "@/components/Common/SchoolDetailsDialog.vue";

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
    SchoolDetailsDialog: SchoolDetailsDialog,
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
      getSchoolsList: "getSchoolsList",
      getSchoolById: "getSchoolById", // IDK if this will work like this
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
    //TODO refactor to use computed properties? Also look at creating a shared school details component
    getSchoolInfo(schoolId, type) {
      if (schoolId) {
        this.schoolSearchLoading = true;
        if (type === "schoolOfRecord") {
          this.schoolOfRecord = this.schoolOfRecord =
            this.getSchoolById(schoolId);
          this.schoolSearchLoading = false;
        }
        if (type === "schoolAtGrad") {
          this.schoolAtGraduation = this.getSchoolById(schoolId);
          this.schoolSearchLoading = false;
        }
      }
    },
    isSchoolOpenStatus(school) {
      const openedDate = new Date(school.openedDate);
      const closedDate = school.closedDate ? new Date(school.closedDate) : null;
      const today = new Date();

      // Remove the time part from today's date for a precise comparison
      today.setHours(0, 0, 0, 0);

      return openedDate < today && !closedDate ? "Open" : "Closed";
    },
    findSchoolByMinCode(minCode) {
      return (
        this.getSchoolsList.find((school) => school.mincode === minCode) || null
      );
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
