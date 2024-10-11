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
          <DisplayTable
            :items="studentChangeHighlight"
            :fields="studentChangeFields"
            showFilter="false"
            title="Student Change History"
            :sortDesc="sortDesc"
            :sortBy="'createDate'"
          >
            {{ studentChangeHighlight }}
            <template v-slot:item.data="{ item }">
              <v-card class="px-0 mt-0">
                {{ item }}
              </v-card>
            </template>
            <template #cell(more)="row">
              <v-btn
                variant="outlined"
                size="sm"
                @click="row.toggleDetails"
                class="more-button"
              >
                <img
                  v-show="!row.detailsShowing"
                  src="../../../assets/images/icon-right.svg"
                  width="9"
                  aria-hidden="true"
                  alt=""
                />
                <img
                  v-show="row.detailsShowing"
                  src="../../../assets/images/icon-down.svg"
                  height="5"
                  aria-hidden="true"
                  alt=""
                />
              </v-btn>
            </template>

            <template #row-details="row">
              <v-card class="px-0 mt-0">
                <p>
                  <strong
                    >Changed By {{ row.item.data.updateUser }} on
                    {{ $filters.formatTime(row.item.data.updateDate) }}</strong
                  >
                </p>
                <pre>
                    {{ JSON.stringify(row.item.data, null, "\t") }}
                  </pre
                >
              </v-card>
            </template>

            <template #cell(programCompletionDate)="row">
              {{ $filters.formatYYYYMMDate(row.value.value) }}
            </template>

            <template #cell(createDate)="row">
              {{ $filters.formatTime(row.value.value) }}
            </template>

            <template #cell(activityCode)="row">
              {{ row.item.data.activityCodeDescription }}
            </template>

            <template #cell()="row">
              <div :class="row.value.changed ? 'value-changed' : ''">
                {{ row.value.value }}
              </div>
            </template>
          </DisplayTable>
        </v-window-item>

        <v-window-item value="optionalProgramChangeHistory">
          <DisplayTable
            :items="optionalProgramChangeHighlight"
            :fields="optionalProgramChangeFields"
            showFilter="false"
            title="Optional Program Change History"
            :sort-desc="true"
            :sortBy="'createDate'"
          >
            <template #cell(more)="row">
              <v-btn
                variant="outlined"
                size="sm"
                @click="row.toggleDetails"
                class="more-button"
              >
                <img
                  v-show="!row.detailsShowing"
                  src="../../../assets/images/icon-right.svg"
                  width="9"
                  aria-hidden="true"
                  alt=""
                />
                <img
                  v-show="row.detailsShowing"
                  src="../../../assets/images/icon-down.svg"
                  height="5"
                  aria-hidden="true"
                  alt=""
                />
              </v-btn>
            </template>

            <template #row-details="row">
              <v-card class="px-0 mt-0">
                <p>
                  <strong
                    >Changed By {{ row.item.data.updateUser }} on
                    {{ $filters.formatTime(row.item.data.updateDate) }}</strong
                  >
                </p>
                <pre>
                    {{ JSON.stringify(row.item.data, null, "\t") }}
                  </pre
                >
              </v-card>
            </template>

            <template v-slot:item.createDate="{ item }">
              {{ $filters.formatTime(item.createDate.value) }}
            </template>
            <template v-slot:item.activityCode="{ item }">
              {{ item.data.activityCodeDescription }}
            </template>

            <template v-slot:item="{ item }">
              {{ item }}
              <div :class="row.value.changed ? 'value-changed' : ''">
                {{ item.row.value }}
              </div>
            </template>
          </DisplayTable>
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
      studentChangeFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
        },
        {
          key: "createDate",
          title: "Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "activityCode",
          title: "Change",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateUser",
          title: "Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "program",
          title: "Program",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "programCompletionDate",
          title: "Program Completion Date",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "studentStatus",
          title: "Status",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "studentGrade",
          title: "Grade",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolOfRecord",
          title: "School of Record",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolAtGrad",
          title: "School at Graduation",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "consumerEducationRequirementMet",
          title: "Consumer Ed",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "honoursStanding",
          title: "Honours",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "gpa",
          title: "GPA",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "recalculateProjectedGrad",
          title: "Recalc Projected Grad",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "recalculateGradStatus",
          title: "Recalc Grad",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "batchId",
          title: "Batch ID",
          sortable: true,
          sortDirection: "asc",
        },
      ],
      studentChangeHighlight: [],
      optionalProgramChangeFields: [
        {
          key: "more",
          title: "",
          sortable: true,
        },
        {
          key: "createDate",
          title: "Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "activityCode",
          title: "Change",
          sortable: true,
        },
        {
          key: "updateUser",
          title: "Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "programCode",
          title: "Program Code",
          sortable: true,
        },
        {
          key: "optionalProgramCode",
          title: "Optional Program Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "optionalProgramName",
          title: "Optional Program Name",
          sortable: true,
        },
        {
          key: "optionalProgramCompletionDate",
          title: "Program Completion Date",
          sortable: true,
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
    this.highlightStudentHistoryChanges();
    this.highlightOptionalProgramHistoryChanges();
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

<style>
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

.value-changed {
  font-weight: bold;
}
</style>
