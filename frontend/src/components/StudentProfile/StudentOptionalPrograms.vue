<template>
  <div>
    <div class="table-responsive">
      <v-alert v-if="!optionalPrograms">
        This student does not have any optional programs.
      </v-alert>

      <DisplayTable
        class="mt-12"
        :items="optionalPrograms"
        :fields="optionalProgramsfields"
        :showFilter="false"
        title="Optional Programs"
        :delete="{
          disable: {
            condition: 'OR',
            criteria: [
              {
                field: 'optionalProgramName',
                value: 'Career Program',
              },
            ],
          },
          label: 'Delete',
          action: 'removeOptionalProgram',
        }"
      >
        <template v-slot:create>
          <OptionalProgramsForm />
        </template>
        <template #bottom></template>
        <template #cell(optionalNonGradReasons)="row">
          <div v-if="row.item.studentOptionalProgramData">
            <div
              v-if="
                row.item.studentOptionalProgramData.optionalNonGradReasons ==
                  null &&
                row.item.studentOptionalProgramData.optionalRequirementsMet !=
                  null
              "
            >
              <span
                v-if="
                  row.item.studentOptionalProgramData.optionalRequirementsMet
                    .length != 0
                "
                >All requirements have been met</span
              >
            </div>
            <div v-else>
              <div
                class="p-2"
                v-if="
                  row.item.studentOptionalProgramData.optionalNonGradReasons &&
                  row.item.studentOptionalProgramData.optionalNonGradReasons
                    .length == 0 &&
                  row.item.studentOptionalProgramData.optionalRequirementsMet
                    .length > 0
                "
              >
                All requirements have been met
              </div>
            </div>
            <span
              v-if="
                row.item.studentOptionalProgramData.optionalNonGradReasons &&
                row.item.studentOptionalProgramData.optionalNonGradReasons
                  .length == 0 &&
                row.item.studentOptionalProgramData.optionalRequirementsMet &&
                row.item.studentOptionalProgramData.optionalRequirementsMet
                  .length == 0
              "
              >n/a</span
            >
          </div>
          <ul
            v-if="
              row.item.studentOptionalProgramData &&
              row.item.studentOptionalProgramData.optionalNonGradReasons != null
            "
            id="optionalNonGradReasons"
          >
            <li
              v-for="optionalNonGradReasons in row.item
                .studentOptionalProgramData.optionalNonGradReasons"
              :key="optionalNonGradReasons.rule"
            >
              <strong
                >{{ optionalNonGradReasons.rule }} -
                {{ optionalNonGradReasons.description }}</strong
              >
            </li>
          </ul>
          <div v-else>n/a</div>
        </template>

        <template v-slot:item.optionalProgramName="{ item }">
          <div class="pt-2">
            {{ item.optionalProgramName }} ({{ item.optionalProgramCode }})
            <br />
            {{ item.optionalProgramCompletionDate }}
          </div>
        </template>

        <template #cell(optionalReqMet)="row">
          <div v-if="row.item.studentOptionalProgramData">
            <b-table
              v-if="
                row.item.optionalProgramCode == 'BC' ||
                row.item.optionalProgramCode == 'BD' ||
                row.item.optionalProgramCode == 'AN' ||
                row.item.optionalProgramCode == 'AD' ||
                row.item.programCode == 'SCCP'
              "
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalRequirementsMet
              "
              :fields="fields"
              thead-class="d-none"
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.rule }}</strong> -
                  {{ row2.item.description }}
                </div>
              </template>
            </b-table>
            <b-table
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalStudentCourses
                  .studentCourseList
              "
              :fields="fields"
              filter="null"
              :filter-function="filterGradReqCourses"
              thead-class="d-none"
              v-if="row.item.studentOptionalProgramData.optionalStudentCourses"
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.gradReqMetDetail }}</strong
                  ><br />
                  {{ row2.item.courseCode }} {{ row2.item.courseLevel }} -
                  {{ $filters.formatYYYYMMDate(row2.item.sessionDate) }} ({{
                    row2.item.courseName
                  }})
                </div>
              </template>
            </b-table>
            <b-table
              :bordered="false"
              small
              :items="
                row.item.studentOptionalProgramData.optionalStudentAssessments
                  .studentAssessmentList
              "
              :fields="fields"
              filter="null"
              :filter-function="filterGradReqCourses"
              thead-class="d-none"
              v-if="
                row.item.studentOptionalProgramData.optionalStudentAssessments
              "
            >
              <template #cell(gradReqMetDetail)="row2">
                <div class="p-2">
                  <strong>{{ row2.item.gradReqMetDetail }}</strong
                  ><br />
                  {{ row2.item.assessmentCode }} -
                  {{ $filters.formatYYYYMMDate(row2.item.sessionDate) }} ({{
                    row2.item.assessmentName
                  }})
                </div>
              </template>
            </b-table>
          </div>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card v-if="item.optionalProgramCode == 'CP'">
                <v-card-text>
                  <DisplayTable
                    title="Career Programs"
                    :items="careerPrograms"
                    id="careerProgramCode"
                    :fields="careerProgramsfields"
                    :hideDefaultFooter="true"
                    :showFilter="false"
                    :delete="{
                      disable: {
                        condition: 'OR',
                        criteria: [],
                      },
                      label: 'Delete',
                      action: 'removeOptionalProgram',
                    }"
                    store="batchprocessing"
                    :showExpand="false"
                  >
                    <template #bottom></template>
                  </DisplayTable>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import { useStudentStore } from "../../store/modules/student";
import { mapState } from "pinia";
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
      optionalPrograms: "getStudentOptionalPrograms",
      careerPrograms: "getStudentCareerPrograms",
      studentProgramId: "getStudentProgram",
    }),
  },
  data: function () {
    return {
      fields: [
        {
          key: "gradReqMetDetail",
          label: "Grad Requirement Met",
          class: "text-left",
        },
      ],

      careerProgramsfields: [
        { key: "careerProgramCode", title: "Career Program Code" },
        { key: "careerProgramName", title: "Career Program Name" },
        { key: "delete", title: "delete" },
      ],
      optionalProgramsfields: [
        {
          key: "data-table-expand",
          title: "",

          sortable: true,
          class: "text-left",
        },
        { key: "optionalProgramName", title: "Optional Program" },
        { key: "optionalReqMet", title: "Requirements Met" },
        { key: "optionalNonGradReasons", title: "Requirements Not Met" },
        { key: "delete", title: "delete" },
      ],
    };
  },
  methods: {
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
</style>
