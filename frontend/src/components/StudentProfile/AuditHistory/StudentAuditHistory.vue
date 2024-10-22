<template>
  <v-card no-body>
    <v-tabs v-model="selectedTab">
      <v-tab value="studentChangeHistory"
        ><v-chip>Student Change History</v-chip></v-tab
      >
      <v-tab value="optionalProgramChangeHistory"
        ><v-chip>Optional Program Change History</v-chip></v-tab
      >
    </v-tabs>
    <v-card-text>
      <v-window v-model="selectedTab">
        <v-window-item value="studentChangeHistory">
          <v-data-table
            :sortBy="sortBy"
            :items="studentHistory"
            :headers="studentChangeFields"
            :items-per-page="'-1'"
            item-value="historyID"
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

            <!-- Attempt at dynamic rendering of slots -->
            <!-- <template
              v-for="header in studentChangeFields.filter(
                (field) => field.key != 'data-table-expand'
              )"
              v-slot:[`item.${header.key}`]="{ item }"
            >
              <slot :name="`item.${header.key}`" :value="item[header.key]">
                <div v-if="header.key == 'activityCode'">
                  {{ item.data.activityCodeDescription }}
                </div>
                <div v-else-if="header.key == 'updateDate'">
                  {{ $filters.formatTime(item.data.updateDate) }}
                </div>
                <div v-else-if="header.key == 'data-table-expand'">EXPAND</div>
                <div
                  v-else
                  :class="item[header.key].changed ? 'value-changed' : ''"
                >
                  {{ item[header.key].value }}
                </div>
              </slot>
            </template> -->
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
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import { useStudentStore } from "../../../store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "StudentAuditHistory",
  components: {
    DisplayTable: DisplayTable,
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentId: "getStudentId",
      studentHistory: "getStudentAuditHistory",
      optionalProgramHistory: "getStudentOptionalProgramAuditHistory",
      studentUngradReasons: "getStudentUngradReasons",
      studentNotes: "getStudentNotes",
    }),
    // flattenedStudentChangeHighlight() {
    //   return this.studentChangeHighlight.map((item) => ({
    //     ...item,
    //     createDateValue: item.createDate.value,
    //   }));
    // },
  },
  data: function () {
    return {
      selectedTab: 0,
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
        },
        {
          key: "program",
          title: "Program",
        },
        {
          key: "programCompletionDate",
          title: "Program Completion Date",
        },
        {
          key: "studentStatus",
          title: "Status",
        },
        {
          key: "studentGrade",
          title: "Grade",
        },
        {
          key: "schoolOfRecord",
          title: "School of Record",
        },
        {
          key: "schoolAtGrad",
          title: "School at Graduation",
        },
        {
          key: "consumerEducationRequirementMet",
          title: "Consumer Ed",
        },
        {
          key: "honoursStanding",
          title: "Honours",
        },
        {
          key: "gpa",
          title: "GPA",
        },
        {
          key: "recalculateProjectedGrad",
          title: "Recalc Projected Grad",
        },
        {
          key: "recalculateGradStatus",
          title: "Recalc Grad",
        },
        {
          key: "batchId",
          title: "Batch ID",
        },
      ],
      studentChangeHighlight: [],
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
    // this.highlightStudentHistoryChanges();
    // this.highlightOptionalProgramHistoryChanges();
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  watch: {
    studentHistory: function () {
      this.highlightStudentHistoryChanges();
    },
    optionalProgramHistory: function () {
      this.highlightOptionalProgramHistoryChanges();
    },
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
    highlightStudentHistoryChanges() {
      const changes = [];

      for (const [index, value] of this.studentHistory.entries()) {
        // temp entry to build our change highlight
        let tempEntry = {};
        for (const field of this.studentChangeFields) {
          if (
            index > 0 &&
            field.key != "createDate" &&
            field.key != "data-table-expand" &&
            field.key != "activityCode"
          ) {
            tempEntry[field.key] = {
              value: value[field.key],
              changed:
                value[field.key] !== this.studentHistory[index - 1][field.key],
            };
          } else {
            tempEntry[field.key] = {
              value: value[field.key],
              changed: true,
            };
          }
          tempEntry["data"] = value;
        }
        changes.push(tempEntry);
      }

      console.log(changes);

      this.studentChangeHighlight = changes;
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

:deep(.value-changed) {
  font-weight: bold;
}
</style>
