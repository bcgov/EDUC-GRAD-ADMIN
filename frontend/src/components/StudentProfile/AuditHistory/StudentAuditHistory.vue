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
    </v-tabs>
    <v-card-text class="px-0">
      <v-window v-model="selectedTab">
        <v-window-item value="studentChangeHistory">
          <v-data-table
            :sortBy="sortBy"
            :items="studentHistory"
            :headers="studentChangeFields"
            :items-per-page="50"
            item-value="historyID"
            density="compact"
          >
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                {{ hisotryID }}
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
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'program')}">{{ item.program }}</span>
            </template>
            <template v-slot:item.programCompletionDate="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'programCompletionDate')}">{{ item.programCompletionDate }}</span>
            </template>
            <template v-slot:item.studentStatus="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'studentStatus')}">{{ item.studentStatus }}</span>
            </template>
            <template v-slot:item.studentGrade="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'studentGrade')}">{{ item.studentGrade }}</span>
            </template>
            <template v-slot:item.schoolOfRecord="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'schoolOfRecord')}">{{ item.schoolOfRecord }}</span>
            </template>
            <template v-slot:item.schoolAtGrad="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'schoolAtGrad')}">{{ item.schoolAtGrad }}</span>
            </template>
            <template v-slot:item.consumerEducationRequirementMet="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'],  'consumerEducationRequirementMet')}">{{ item.consumerEducationRequirementMet }}</span>
            </template>
            <template v-slot:item.honoursStanding="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'honoursStanding')}">{{ item.honoursStanding }}</span>
            </template>
            <template v-slot:item.gpa="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'gpa')}">{{ item.gpa }}</span>
            </template>
            <template v-slot:item.recalculateProjectedGrad="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'recalculateProjectedGrad')}">{{ item.recalculateProjectedGrad }}</span>
            </template>
            <template v-slot:item.recalculateGradStatus="{ item }">
              <span :class="{'important-change': changeLoaded && item['changed'] && isBold(item['changed'], 'recalculateGradStatus')}">{{ item.recalculateGradStatus }}</span>
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
          important: true,
        },
        {
          key: "programCompletionDate",
          title: "Program Completion Date",
          sortable: false,
          important: true,
        },
        {
          key: "studentStatus",
          title: "Status",
          sortable: false,
          important: true,
        },
        {
          key: "studentGrade",
          title: "Grade",
          sortable: false,
          important: true,
        },
        {
          key: "schoolOfRecord",
          title: "School of Record",
          sortable: false,
          important: true,
        },
        {
          key: "schoolAtGrad",
          title: "School at Graduation",
          sortable: false,
          important: true,
        },
        {
          key: "consumerEducationRequirementMet",
          title: "Consumer Ed",
          sortable: false,
          important: true,
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
          important: true,
        },
        {
          key: "recalculateProjectedGrad",
          title: "Recalc Projected Grad",
          sortable: false,
          important: true,
        },
        {
          key: "recalculateGradStatus",
          title: "Recalc Grad",
          sortable: false,
          important: true,
        },
        {
          key: "batchId",
          title: "Batch ID",
          sortable: false,
        },
      ],
      changeLoaded: false,
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
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  watch: {
    studentHistory: function () {
      // New date to old date
      this.studentHistory.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
      this.highlightStudentHistoryChanges();
    },
    // optionalProgramHistory: function () {
    //   this.highlightOptionalProgramHistoryChanges();
    // },
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
      for (const [index, value] of this.studentHistory.entries()) {
        // temp entry to build our change highlight
        let tempList = [];
        for (const field of this.studentChangeFields) {
          if (
            index > 0 &&
            field.key != "data-table-expand" &&
            field.key != "updateDate" &&
            field.key != "activityCode" &&
            field.key != "updateUser" &&
            field.important
          ) {
            // Check if important data has been changed
            if (value[field.key] !== this.studentHistory[index - 1][field.key]) {
              tempList.push(field.key)
            }
          } 
        }
        if (index > 0 && tempList)
          this.studentHistory[index - 1]['changed'] = tempList
      }

      this.changeLoaded = true;
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
    isBold(changedList, key) {
      for (let i in changedList) {
        if (key == changedList[i]) return true
      }

      return false
    },
    getGlobalIndex(localIndex) {
      return localIndex + (this.pagination.page - 1) * this.pagination.itemsPerPage
    }
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

:deep(.value-changed) {
  font-weight: bold;
}

.important-change {
  font-weight: bold;
}
</style>
