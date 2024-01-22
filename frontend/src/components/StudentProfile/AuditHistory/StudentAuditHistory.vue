<template>
  <div class="container">
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Student Change History">
          <DisplayTable
            :items="studentChangeHighlight"
            :fields="studentChangeFields"
            showFilter="false"
            title="Student Change History"
            :sortDesc="sortDesc"
            :sortBy="'createDate'"
          >
            <template #cell(more)="row">
              <b-btn
                variant="outline primary"
                style="color: #666"
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
              </b-btn>
            </template>

            <template #row-details="row">
              <b-card class="px-0 mt-0">
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
              </b-card>
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
        </b-tab>

        <b-tab title="Optional Program Change History">
          <DisplayTable
            :items="optionalProgramChangeHighlight"
            :fields="optionalProgramChangeFields"
            showFilter="false"
            title="Optional Program Change History"
            :sort-desc="true"
            :sortBy="'createDate'"
          >
            <template #cell(more)="row">
              <b-btn
                variant="outline primary"
                style="color: #666"
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
              </b-btn>
            </template>

            <template #row-details="row">
              <b-card class="px-0 mt-0">
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
              </b-card>
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
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { useStudentStore } from "../../../store/modules/student";
import { mapState } from "pinia";
import { showNotification } from "../../../utils/common.js";
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
          key: "more",
          label: "",
          sortable: true,
        },
        {
          key: "createDate",
          label: "Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "activityCode",
          label: "Change",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateUser",
          label: "Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "program",
          label: "Program",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "programCompletionDate",
          label: "Program Completion Date",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "studentStatus",
          label: "Status",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "studentGrade",
          label: "Grade",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolOfRecord",
          label: "School of Record",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolAtGrad",
          label: "School at Graduation",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "consumerEducationRequirementMet",
          label: "Consumer Ed",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "honoursStanding",
          label: "Honours",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "gpa",
          label: "GPA",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "recalculateProjectedGrad",
          label: "Recalc Projected Grad",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "recalculateGradStatus",
          label: "Recalc Grad",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "batchId",
          label: "Batch ID",
          sortable: true,
          sortDirection: "asc",
        },
      ],
      studentChangeHighlight: [],
      optionalProgramChangeFields: [
        {
          key: "more",
          label: "",
          sortable: true,
        },
        {
          key: "createDate",
          label: "Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "activityCode",
          label: "Change",
          sortable: true,
        },
        {
          key: "updateUser",
          label: "Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "programCode",
          label: "Program Code",
          sortable: true,
        },
        {
          key: "optionalProgramCode",
          label: "Optional Program Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "optionalProgramName",
          label: "Optional Program Name",
          sortable: true,
        },
        {
          key: "optionalProgramCompletionDate",
          label: "Program Completion Date",
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
    this.showNotification = showNotification;
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
