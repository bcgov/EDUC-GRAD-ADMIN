<template>
  <div>
    <div v-if="!assessments" class="container">
      This student does not have any assessments.
    </div>
    <DisplayTable
      v-if="assessments"
      :items="assessments"
      :fields="fields"
      showFilter="true"
      title="Assessments"
      :id="id"
    >
      <!-- <template v-slot:item.sessionDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.value) }}
      </template> -->
      <template v-slot:item.assessmentName="{ item }">
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  color="surface-variant"
                  :text="item.assessmentName"
                  variant="flat"
                  class="m-1 p-1 text-left"
                >
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card :title="item.assessmentName">
                  <v-card-text>
                    <div class="row py-1">
                      <div class="col">
                        <strong>Language:</strong>
                      </div>
                      <div class="col">
                        {{ item.assessmentDetails.language }}
                      </div>
                    </div>
                    <div class="row py-1">
                      <div class="col"><strong>Start Date:</strong></div>
                      <div class="col">
                        {{
                          $filters.formatSimpleDate(
                            item.assessmentDetails.startDate
                          )
                        }}
                      </div>
                    </div>
                    <div class="row py-1">
                      <div class="col"><strong>End Date:</strong></div>
                      <div class="col">
                        {{
                          $filters.formatSimpleDate(
                            item.assessmentDetails.endDate
                          )
                        }}
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="Close Dialog"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
        </v-dialog>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <ul v-if="item.hasMoreInfo == true">
              <li v-if="item.mincodeAssessment">
                <strong>Assessment Centre:</strong>
                {{ item.mincodeAssessment }}
              </li>
              <li v-if="item.mincodeAssessmentName">
                <strong>Assessment Centre Name:</strong>
                {{ item.mincodeAssessmentName }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import { useStudentStore } from "../../store/modules/student";
import { mapState } from "pinia";
export default {
  name: "StudentAssessments",
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  components: {
    DisplayTable: DisplayTable,
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, { assessments: "getStudentAssessments" }),
  },
  data: function () {
    return {
      detailsShowing: false,
      fields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "assessmentCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "sessionDate",
          title: "Session",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "specialCase",
          title: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "assessmentName",
          title: "Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-left w-50",
        },
      ],
    };
  },
};
</script>
