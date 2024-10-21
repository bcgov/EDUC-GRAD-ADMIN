<template>
  <div>
    <v-alert
      type="info"
      variant="tonal"
      border="start"
      class="width-fit-content"
      >This student is on the
      <strong>{{ studentGradStatus.program }}</strong> Graduation
      Program</v-alert
    >
    <div>
      <v-alert v-if="!studentOptionalPrograms">
        This student does not have any optional programs.
      </v-alert>
      <OptionalProgramsForm />
      <v-data-table
        v-if="studentOptionalPrograms"
        :items="studentOptionalPrograms"
        :headers="studentOptionalProgramsFields"
        :items-per-page="'-1'"
        hide-default-footer
      >
        <template v-slot:item.optionalProgramName="{ item }">
          <div class="pt-2">
            {{ item.optionalProgramName }} ({{ item.optionalProgramCode }})
            <br />
            {{ item.optionalProgramCompletionDate }}
          </div>
        </template>

        <template v-slot:item.optionalReqMet="{ item }">
          <div v-if="item.studentOptionalProgramData">
            <v-data-table
              v-if="
                item.optionalProgramCode == 'BC' ||
                item.optionalProgramCode == 'BD' ||
                item.optionalProgramCode == 'AN' ||
                item.optionalProgramCode == 'AD' ||
                item.programCode == 'SCCP'
              "
              :items="item.studentOptionalProgramData.optionalRequirementsMet"
              :headers="requirementsMetHeaders"
              hide-default-header
              hide-default-footer
            >
              <template v-slot:item.rule="{ item }">
                <div class="p-2">
                  <strong>{{ item.rule }}</strong> - {{ item.description }}
                </div>
              </template>
            </v-data-table>
            <v-data-table
              :items="
                filteredGradReqCourses(
                  item.studentOptionalProgramData.optionalStudentCourses
                    .studentCourseList
                )
              "
              :headers="studentCourseListHeaders"
              v-if="
                item.studentOptionalProgramData.optionalStudentCourses &&
                filteredGradReqCourses(
                  item.studentOptionalProgramData.optionalStudentCourses
                    .studentCourseList
                )?.length > 0
              "
              hide-default-header
              hide-default-footer
            >
              <template v-slot:item.gradReqMetDetail="{ item }">
                <div class="p-2">
                  <strong>{{ item.gradReqMetDetail }}</strong
                  ><br />
                  {{ item.courseCode }} {{ item.courseLevel }} -
                  {{ $filters.formatYYYYMMDate(item.sessionDate) }} ({{
                    item.courseName
                  }})
                </div>
              </template>
            </v-data-table>
            <v-data-table
              :items="
                filteredGradReqAssessments(
                  item.studentOptionalProgramData.optionalStudentAssessments
                    .studentAssessmentList
                )
              "
              :headers="studentCourseListHeaders"
              v-if="
                item.studentOptionalProgramData.optionalStudentAssessments &&
                filteredGradReqAssessments(
                  item.studentOptionalProgramData.optionalStudentAssessments
                    .studentAssessmentList
                )?.length
              "
              hide-default-header
              hide-default-footer
            >
              <template v-slot:item.gradReqMetDetail="{ item }">
                <div class="p-2">
                  <strong>{{ item.gradReqMetDetail }}</strong
                  ><br />
                  {{ item.assessmentCode }} -
                  {{ $filters.formatYYYYMMDate(item.sessionDate) }} ({{
                    item.assessmentName
                  }})
                </div>
              </template>
            </v-data-table>
          </div>
        </template>

        <template v-slot:item.optionalNonGradReasons="{ item }">
          <div v-if="item.studentOptionalProgramData">
            <div
              v-if="
                item.studentOptionalProgramData.optionalNonGradReasons ==
                  null &&
                item.studentOptionalProgramData.optionalRequirementsMet != null
              "
            >
              <span
                v-if="
                  item.studentOptionalProgramData.optionalRequirementsMet
                    .length != 0
                "
                >ALL requirements have been met</span
              >
            </div>
            <div v-else>
              <div
                v-if="
                  item.studentOptionalProgramData.optionalNonGradReasons &&
                  item.studentOptionalProgramData.optionalNonGradReasons
                    .length == 0 &&
                  item.studentOptionalProgramData.optionalRequirementsMet
                    .length > 0
                "
              >
                ALL Requirements have been met
              </div>
            </div>
            <span
              v-if="
                item.studentOptionalProgramData.optionalNonGradReasons &&
                item.studentOptionalProgramData.optionalNonGradReasons.length ==
                  0 &&
                item.studentOptionalProgramData.optionalRequirementsMet &&
                item.studentOptionalProgramData.optionalRequirementsMet
                  .length == 0
              "
              >n/a</span
            >
          </div>
          <ul
            v-if="
              item.studentOptionalProgramData &&
              item.studentOptionalProgramData.optionalNonGradReasons != null
            "
            id="optionalNonGradReasons"
          >
            <li
              v-for="optionalNonGradReason in item.studentOptionalProgramData
                .optionalNonGradReasons"
              :key="optionalNonGradReason.rule"
            >
              <strong
                >{{ optionalNonGradReason?.rule }} -
                {{ optionalNonGradReason?.description }}</strong
              >
            </li>
          </ul>
          <div v-else>n/a</div>
        </template>

        <template v-slot:item.optionalProgramCompletionDate="{ item }">
          {{ $filters.formatYYYYMMDate(item.optionalProgramCompletionDate) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-dialog
            v-model="deleteDialog[item.id]"
            v-if="
              item?.studentOptionalProgramData?.optionalProgramCode !== 'CP'
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="error"
                icon="mdi-delete-forever"
                density="compact"
                variant="outline"
              ></v-btn>
            </template>
            <v-card
              title="Delete Student Optional Program"
              max-width="500px"
              class="mx-auto"
            >
              <v-divider color="error" class="mt-0 mx-4" />
              <!-- START Optional Program Delete Warnings and Errors -->
              <v-alert
                v-if="v$.ifStudentStatusArchived.$invalid"
                type="warning"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusArchived.$message }}</p>
              </v-alert>
              <v-alert
                v-else-if="v$.ifStudentStatusDeceased.$invalid"
                type="warning"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusDeceased.$message }}</p>
              </v-alert>
              <v-alert
                v-else-if="v$.ifStudentStatusTerminated.$invalid"
                type="warning"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusTerminated.$message }}</p>
              </v-alert>
              <v-alert
                v-if="
                  !(
                    v$.ifStudentStatusMerged.$invalid ||
                    v$.ifProgramComplete.$invalid
                  )
                "
                type="warning"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>WARNING</strong></p>
                <p>
                  You are about to delete the
                  <strong
                    >{{ item.optionalProgramCode }} -
                    {{ item.optionalProgramName }}</strong
                  >
                  Optional Program from this student
                </p>
              </v-alert>

              <v-alert
                v-else-if="v$.ifStudentStatusMerged.$invalid"
                type="error"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>ERROR</strong></p>
                <p>{{ v$.ifStudentStatusMerged.$message }}</p>
              </v-alert>
              <v-alert
                v-else-if="v$.ifProgramComplete.$invalid"
                type="error"
                variant="tonal"
                border="start"
                class="mx-4 my-4"
              >
                <p><strong>ERROR</strong></p>
                <p>{{ v$.ifProgramComplete.$message }}</p>
              </v-alert>
              <!-- END Optional Program Delete Warnings and Errors -->
              <v-divider class="mx-4" />
              <v-card-actions class="mx-2 mb-2">
                <v-btn
                  color="bcGovBlue"
                  variant="outlined"
                  class="text-none"
                  density="default"
                  @click="deleteDialog[item.id] = false"
                  >Cancel</v-btn
                >
                <v-spacer />
                <v-btn
                  :disabled="
                    v$.ifStudentStatusMerged.$invalid ||
                    v$.ifProgramComplete.$invalid
                  "
                  color="error"
                  variant="flat"
                  class="text-none"
                  density="default"
                  @click="deleteStudentOptionalProgram(item)"
                  >DELETE</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template
          v-slot:item.data-table-expand="{
            item,
            internalItem,
            toggleExpand,
            isExpanded,
          }"
        >
          <td v-if="item?.optionalProgramCode == 'CP'">
            <v-btn
              variant="text"
              density="comfortable"
              @click="toggleExpand(internalItem)"
              class="v-data-table__expand-icon"
              :class="{ 'v-data-table__expand-icon--active': isExpanded }"
              :icon="
                isExpanded(internalItem)
                  ? 'mdi-chevron-down'
                  : 'mdi-chevron-right'
              "
            >
            </v-btn>
          </td>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card class="my-3 mx-0">
                <v-data-table
                  :items="studentCareerPrograms"
                  :headers="studentCareerProgramsHeaders"
                  :items-per-page="'-1'"
                  hide-default-footer
                >
                  <template v-slot:item.actions="{ item }">
                    <v-dialog v-model="deleteDialog[item.id]">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="error"
                          icon="mdi-delete-forever"
                          density="compact"
                          variant="outline"
                        ></v-btn>
                      </template>
                      <v-card
                        title="Delete Student Career Program"
                        max-width="500px"
                        class="mx-auto"
                      >
                        <v-divider color="error" class="mt-0 mx-4" />
                        <!-- START Career Program Delete Warnings and Errors -->
                        <v-alert
                          v-if="v$.ifStudentStatusArchived.$invalid"
                          type="warning"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>WARNING</strong></p>
                          <p>{{ v$.ifStudentStatusArchived.$message }}</p>
                        </v-alert>
                        <v-alert
                          v-else-if="v$.ifStudentStatusDeceased.$invalid"
                          type="warning"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>WARNING</strong></p>
                          <p>{{ v$.ifStudentStatusDeceased.$message }}</p>
                        </v-alert>
                        <v-alert
                          v-else-if="v$.ifStudentStatusTerminated.$invalid"
                          type="warning"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>WARNING</strong></p>
                          <p>{{ v$.ifStudentStatusTerminated.$message }}</p>
                        </v-alert>

                        <v-alert
                          v-if="
                            !(
                              v$.ifStudentStatusMerged.$invalid ||
                              v$.ifProgramComplete.$invalid
                            )
                          "
                          type="warning"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>WARNING</strong></p>
                          <p>
                            You are about to delete the
                            <strong
                              >{{ item.careerProgramCode }} -
                              {{ item.careerProgramName }}</strong
                            >
                            Career Program from this student
                          </p>
                        </v-alert>
                        <v-alert
                          v-else-if="v$.ifStudentStatusMerged.$invalid"
                          type="error"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>ERROR</strong></p>
                          <p>{{ v$.ifStudentStatusMerged.$message }}</p>
                        </v-alert>
                        <v-alert
                          v-else-if="v$.ifProgramComplete.$invalid"
                          type="error"
                          variant="tonal"
                          border="start"
                          class="mx-4 my-4"
                        >
                          <p><strong>ERROR</strong></p>
                          <p>{{ v$.ifProgramComplete.$message }}</p>
                        </v-alert>
                        <!-- END Career Program Delete Warnings and Errors -->
                        <v-divider class="mx-4" />
                        <v-card-actions class="mx-2 mb-2">
                          <v-btn
                            color="bcGovBlue"
                            variant="outlined"
                            class="text-none"
                            density="default"
                            @click="deleteDialog[item.id] = false"
                            >Cancel</v-btn
                          >
                          <v-spacer />
                          <v-btn
                            :disabled="
                              v$.ifStudentStatusMerged.$invalid ||
                              v$.ifProgramComplete.$invalid
                            "
                            color="error"
                            variant="flat"
                            class="text-none"
                            density="default"
                            @click="deleteStudentCareerProgram(item)"
                            >DELETE</v-btn
                          >
                        </v-card-actions></v-card
                      >
                    </v-dialog>
                  </template>
                </v-data-table>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
// Store Imports
import { useStudentStore } from "../../store/modules/student";
import { mapState, mapActions } from "pinia";

// Component Imports
import DisplayTable from "@/components/DisplayTable.vue";
import OptionalProgramsForm from "@/components/Forms/OptionalProgramsForm.vue";

// Shared functions & validations
import { isProgramComplete, applyDisplayOrder } from "@/utils/common.js";

// vuelidate
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";

export default {
  name: "StudentOptionalPrograms",
  components: {
    DisplayTable: DisplayTable,
    OptionalProgramsForm: OptionalProgramsForm,
  },
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentOptionalPrograms: "getStudentOptionalPrograms",
      studentCareerPrograms: "getStudentCareerPrograms",
      studentGradStatus: "getStudentGradStatus",
    }),
  },
  validations() {
    return {
      ifStudentStatusMerged: helpers.withMessage(
        'This student is showing as merged. Student GRAD Optional Program data cannot be updated for students with a status of "MER" merged.',
        (value) => {
          console.log(this.studentGradStatus.studentStatus);
          return !(this.studentGradStatus.studentStatus == "MER");
        }
      ),
      ifStudentStatusDeceased: helpers.withMessage(
        "This student is showing as deceased.",
        (value) => {
          return !(this.studentGradStatus.studentStatus == "DEC");
        }
      ),
      ifStudentStatusArchived: helpers.withMessage(
        'This student is not active. Re-activate by setting their status to "CUR" if they are currently attending school.',
        (value) => {
          return !(this.studentGradStatus.studentStatus == "ARC");
        }
      ),
      ifStudentStatusTerminated: helpers.withMessage(
        'This student has been terminated. Re-activate by setting their status to "CUR" if they are currently attending school.',
        (value) => {
          return !(this.studentGradStatus.studentStatus == "TER");
        }
      ),
      ifProgramComplete: helpers.withMessage(
        `This student has a program completion date of ${this.studentGradStatus.programCompletionDate}. You must undo completion to be able to edit the Optional Programs for this student.`,
        (value) => {
          return !this.isProgramComplete(
            this.studentGradStatus.programCompletionDate,
            this.studentGradStatus.program
          );
        }
      ),
    };
  },
  data: function () {
    return {
      deleteDialog: {},
      requirementsMetHeaders: [
        {
          key: "rule",
          label: "Grad Requirement Met",
          class: "text-left",
        },
      ],
      studentCourseListHeaders: [
        {
          key: "gradReqMetDetail",
          label: "Grad Requirement Met",
          class: "text-left",
        },
      ],

      studentCareerProgramsHeaders: [
        { key: "careerProgramCode", title: "Career Program Code" },
        { key: "careerProgramName", title: "Career Program Name" },
        { key: "actions", title: "Delete" },
      ],
      studentOptionalProgramsFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        { key: "programCode", title: "Graduation Program" },
        { key: "optionalProgramName", title: "Optional Program" },
        { key: "optionalReqMet", title: "Requirements Met" },
        { key: "optionalNonGradReasons", title: "Requirements Not Met" },
        {
          key: "optionalProgramCompletionDate",
          title: "Optional Program Completion Date",
        },
        { key: "actions", title: "Delete" },
      ],
    };
  },
  methods: {
    ...mapActions(useStudentStore, {
      removeStudentOptionalProgram: "removeStudentOptionalProgram",
      removeStudentCareerProgram: "removeStudentCareerProgram",
    }),
    isProgramComplete(date, program) {
      return isProgramComplete(date, program);
    },
    filterGradReqItems(item) {
      if (item.gradReqMet?.length > 0) {
        return true;
      }
    },
    filteredGradReqCourses(courses) {
      return courses?.filter((course) => this.filterGradReqItems(course));
    },
    filteredGradReqAssessments(assessments) {
      return assessments?.filter((assessment) =>
        this.filterGradReqItems(assessment)
      );
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
    deleteStudentOptionalProgram(optionalProgram) {
      this.removeStudentOptionalProgram(optionalProgram.optionalProgramID);
      this.deleteDialog[optionalProgram.id] = false;
    },
    deleteStudentCareerProgram(careerProgram) {
      this.removeStudentCareerProgram(careerProgram.careerProgramCode);
      this.deleteDialog[careerProgram.id] = false;
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

:deep(th) {
  font-weight: bold !important;
}
</style>
