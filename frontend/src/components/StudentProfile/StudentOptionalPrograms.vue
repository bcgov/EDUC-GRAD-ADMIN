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
        :items="studentOptionalPrograms"
        :headers="studentOptionalProgramsFields"
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
              :headers="fields"
              :hide-default-header="true"
              :hide-default-footer="true"
            ></v-data-table>
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
              <v-alert
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
              <v-divider class="mx-4" />
              <v-card-actions>
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
                  :headers="studentCareerProgramsFields"
                  :hide-default-footer="true"
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
                        <v-alert
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
                        <v-divider class="mx-4" />
                        <v-card-actions>
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
import { useStudentStore } from "../../store/modules/student";
import { mapState, mapActions } from "pinia";
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
      studentOptionalPrograms: "getStudentOptionalPrograms",
      studentCareerPrograms: "getStudentCareerPrograms",
      studentGradStatus: "getStudentGradStatus",
      studentProgramId: "getStudentProgram", // Remove?
    }),
  },
  data: function () {
    return {
      deleteDialog: {},
      fields: [
        {
          key: "rule",
          label: "Grad Requirement Met",
          class: "text-left",
        },
        {
          key: "description",
          label: "Grad Requirement Met",
          class: "text-left",
        },
      ],

      studentCareerProgramsFields: [
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
