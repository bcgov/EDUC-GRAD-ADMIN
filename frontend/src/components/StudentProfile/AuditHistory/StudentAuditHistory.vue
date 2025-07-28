<template>
  <v-card no-body>
    <v-tabs v-model="selectedTab">
      <v-tab value="studentChangeHistory"
        ><v-chip
          class="text-none"
          color="primary"
          :variant="selectedTab == 'studentChangeHistory' ? 'flat' : 'outlined'"
          >Student Change History</v-chip
        ></v-tab
      >
      <v-tab value="optionalProgramChangeHistory"
        ><v-chip
          class="text-none"
          color="primary"
          :variant="
            selectedTab == 'optionalProgramChangeHistory' ? 'flat' : 'outlined'
          "
          >Optional Program Change History</v-chip
        ></v-tab
      >
      <v-tab value="courseChangeHistory" v-if="enableCRUD()">
        <v-chip
          class="text-none"
          color="primary"
          :variant="selectedTab === 'courseChangeHistory' ? 'flat' : 'outlined'"
        >
          Course Change History
        </v-chip>
      </v-tab>
      <v-tab value="studentAssessmentHistory" v-if="enableCRUD()">
        <v-chip
            class="text-none"
            color="primary"
            :variant="selectedTab === 'studentAssessmentHistory' ? 'flat' : 'outlined'"
        >
          Student Assessment History
        </v-chip>
      </v-tab>
    </v-tabs>
    <v-card-text class="px-0">
      <v-window v-model="selectedTab">
        <v-window-item value="studentChangeHistory">
          <v-data-table
            :sortBy="sortBy"
            :items="studentHistoryWithPrevData"
            :headers="studentChangeFields"
            :items-per-page="50"
            item-value="historyID"
            density="compact"
          >
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                {{
                  historyID
                }}
                <td :colspan="columns.length">
                  <div class="mx-5 my-5">
                    <p>
                      Changed By <strong>{{ item.updateUser }}</strong> on
                      <strong>{{
                        $filters.formatTime(item.updateDate)
                      }}</strong>
                    </p>
                    <pre>
                      {{ JSON.stringify(item, null, "\t") }}
                    </pre>
                  </div>
                </td>
              </tr>
            </template>
            <template
              v-slot:item.data-table-expand="{
                item,
                internalItem,
                toggleExpand,
                isExpanded,
              }"
            >
              <td v-if="!!item">
                <v-btn
                  variant="text"
                  density="comfortable"
                  size="small"
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
            <template v-slot:item.activityCode="{ item }">
              <i>{{ item.activityCode }}</i> -
              {{ item.activityCodeDescription }}
            </template>
            <template v-slot:item.updateDate="{ item }">
              {{ $filters.formatTime(item.updateDate) }}
            </template>

            <template v-slot:item.program="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous && item.program !== item.previous.program,
                }"
                >{{ item.program }}</span
              >
            </template>
            <template v-slot:item.programCompletionDate="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.programCompletionDate !==
                      item.previous.programCompletionDate,
                }"
                >{{ item.programCompletionDate }}</span
              >
            </template>
            <template v-slot:item.studentStatus="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.studentStatus !== item.previous.studentStatus,
                }"
                >{{ item.studentStatus }}</span
              >
            </template>
            <template v-slot:item.studentGrade="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.studentGrade !== item.previous.studentGrade,
                }"
                >{{ item.studentGrade }}</span
              >
            </template>
            <template v-slot:item.schoolOfRecord="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.schoolOfRecord !== item.previous.schoolOfRecord,
                }"
                >{{ item.schoolOfRecord }}</span
              >
            </template>
            <template v-slot:item.schoolAtGrad="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.schoolAtGrad !== item.previous.schoolAtGrad,
                }"
                >{{ item.schoolAtGrad }}</span
              >
            </template>
            <template v-slot:item.consumerEducationRequirementMet="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.consumerEducationRequirementMet !==
                      item.previous.consumerEducationRequirementMet,
                }"
                >{{ item.consumerEducationRequirementMet }}</span
              >
            </template>
            <template v-slot:item.honoursStanding="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.honoursStanding !== item.previous.honoursStanding,
                }"
                >{{ item.honoursStanding }}</span
              >
            </template>
            <template v-slot:item.gpa="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous && item.gpa !== item.previous.gpa,
                }"
                >{{ item.gpa }}</span
              >
            </template>
            <template v-slot:item.recalculateProjectedGrad="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.recalculateProjectedGrad !==
                      item.previous.recalculateProjectedGrad,
                }"
                >{{ item.recalculateProjectedGrad }}</span
              >
            </template>
            <template v-slot:item.recalculateGradStatus="{ item }">
              <span
                :class="{
                  'important-change':
                    item.previous &&
                    item.recalculateGradStatus !==
                      item.previous.recalculateGradStatus,
                }"
                >{{ item.recalculateGradStatus }}</span
              >
            </template>
          </v-data-table>
        </v-window-item>

        <v-window-item value="optionalProgramChangeHistory">
          <v-data-table
            :sortBy="sortBy"
            :items="optionalProgramHistory"
            :headers="optionalProgramChangeFields"
            :items-per-page="'-1'"
            item-value="historyId"
          >
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  <div class="mx-5 my-5">
                    <p>
                      Changed By <strong>{{ item.updateUser }}</strong> on
                      <strong>{{
                        $filters.formatTime(item.updateDate)
                      }}</strong>
                    </p>
                    <pre>
                      {{ JSON.stringify(item, null, "\t") }}
                    </pre>
                  </div>
                </td>
              </tr>
            </template>
            <template
              v-slot:item.data-table-expand="{
                item,
                internalItem,
                toggleExpand,
                isExpanded,
              }"
            >
              <td v-if="!!item">
                <v-btn
                  variant="text"
                  density="comfortable"
                  size="small"
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
            <template v-slot:item.activityCode="{ item }">
              <i>{{ item.activityCode }}</i> -
              {{ item.activityCodeDescription }}
            </template>
            <template v-slot:item.updateDate="{ item }">
              {{ $filters.formatTime(item.updateDate) }}
            </template>
          </v-data-table>
        </v-window-item>
        <v-window-item value="courseChangeHistory">
          <CourseChangeHistory />
        </v-window-item>
        <v-window-item value="studentAssessmentHistory">
          <StudentAssessmentHistory />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
import { useAppStore } from "@/store/modules/app";
import CourseChangeHistory from "@/components/StudentProfile/AuditHistory/CourseChangeHistory.vue";
import StudentAssessmentHistory from "@/components/StudentProfile/AuditHistory/StudentAssessmentHistory.vue";

export default {
  name: "StudentAuditHistory",
  components: {
    StudentAssessmentHistory,
    CourseChangeHistory,
    DisplayTable: DisplayTable,
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentId: "getStudentId",
      studentHistory: "getStudentAuditHistory",
      optionalProgramHistory: "getStudentOptionalProgramAuditHistory",
      studentNotes: "getStudentNotes",
    }),
    ...mapState(useAppStore, {
      getSchoolById: "getSchoolById",
      enableCRUD: "enableCRUD",
    }),
    studentHistoryWithPrevData() {
      this.studentHistory.sort(
        (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
      );
      for (const key of Object.keys(this.studentHistory)) {
        const record = this.studentHistory[key];
        record.schoolOfRecord = !!record.schoolOfRecordId
          ? this.getSchoolById(record.schoolOfRecordId).mincode
          : null;
        record.schoolAtGrad = !!record.schoolAtGradId
          ? this.getSchoolById(record.schoolAtGradId).mincode
          : null;
      }
      return this.studentHistory.map((item, index, array) => ({
        ...item,
        previous: array[index + 1] || null,
      }));
    },
  },
  data: function () {
    return {
      selectedTab: "studentChangeHistory",
      isEdit: false,
      isDelete: false,
      isAdd: false,
      changeHistory: [],
      optionalProgramChangeHistory: [],
      testHistory: [],
      sortDesc: true,
      smallScreen: false,
      window: { width: 0, height: 0 },
      sortBy: [{ key: "updateDate", order: "desc" }],
      studentChangeFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: false,
          width: "10px",
        },
        {
          key: "updateDate",
          title: "Date",
          width: "115px",
        },
        {
          key: "activityCode",
          title: "Change",
          sortable: false,
        },
        {
          key: "updateUser",
          title: "Update User",
          sortable: false,
        },
        {
          key: "program",
          title: "Program",
          width: "50px",
          sortable: false,
        },
        {
          key: "programCompletionDate",
          title: "Program Completion Date",
          sortable: false,
        },
        {
          key: "studentStatus",
          title: "Status",
          sortable: false,
        },
        {
          key: "studentGrade",
          title: "Grade",
          sortable: false,
        },
        {
          key: "schoolOfRecord",
          title: "School of Record",
          sortable: false,
        },
        {
          key: "schoolAtGrad",
          title: "School at Graduation",
          sortable: false,
        },
        {
          key: "consumerEducationRequirementMet",
          title: "Consumer Ed",
          sortable: false,
        },
        {
          key: "honoursStanding",
          title: "Honours",
          sortable: false,
        },
        {
          key: "gpa",
          title: "GPA",
          sortable: false,
        },
        {
          key: "recalculateProjectedGrad",
          title: "Recalc Projected Grad",
          sortable: false,
        },
        {
          key: "recalculateGradStatus",
          title: "Recalc Grad",
          sortable: false,
        },
        {
          key: "batchId",
          title: "Batch ID",
          sortable: false,
        },
      ],
      optionalProgramChangeFields: [
        {
          key: "data-table-expand",
          title: "",
        },
        {
          key: "updateDate",
          title: "Date",
          width: "115px",
        },
        {
          key: "activityCode",
          title: "Change",
        },
        {
          key: "updateUser",
          title: "Update User",
          sortable: true,
        },
        {
          key: "programCode",
          title: "Program Code",
        },
        {
          key: "optionalProgramCode",
          title: "Optional Program Code",
        },
        {
          key: "optionalProgramName",
          title: "Optional Program Name",
        },
        {
          key: "optionalProgramCompletionDate",
          title: "Program Completion Date",
        },
      ],
      optionalProgramChangeHighlight: [],
      showNotes: false,
      showUngradReasons: false,
      showStudentAudit: true,
      auditTab: "studentHistory",
    };
  },
  mounted() {
    this.studentHistoryWithPrevData;
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (this.window.width < 992) {
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    },
    highlightOptionalProgramHistoryChanges() {
      const changes = [];

      for (const [index, value] of this.optionalProgramHistory.entries()) {
        // temp entry to build our change highlight
        let tempEntry = {};
        for (const field of this.optionalProgramChangeFields) {
          if (index === 0 || field.key == "createDate") {
            tempEntry[field.key] = {
              value: value[field.key],
              changed: true,
            };
          } else if (field.key != "activityCode") {
            tempEntry[field.key] = {
              value: value[field.key],
              changed:
                value[field.key] !==
                this.optionalProgramHistory[index - 1][field.key],
            };
          } else {
            tempEntry[field.key] = {
              value: value[field.key],
              changed: false,
            };
          }
          tempEntry["data"] = value;
        }
        changes.push(tempEntry);
      }

      this.optionalProgramChangeHighlight = changes;
    },
  },
};
</script>

<style scoped>
/* :deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  padding: 0 4px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  padding: 0 4px !important;
} */
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

.audit-history-tabs .card {
  margin-top: 70px;
}

.card-body p strong {
  font-size: 87.5%;
}

.important-change {
  font-weight: bold;
}
</style>
