<template>
  <div>
    <v-alert v-if="!assessments?.length" class="container">
      This student does not have any assessments.
    </v-alert>
    <v-data-table
        v-if="processedAssessments"
        :items="processedAssessments"
        :headers="fields"
        showFilter="true"
        hide-default-footer
    >
      <template
          v-slot:item.data-table-expand="{
          item,
          internalItem,
          toggleExpand,
          isExpanded,
        }"
      >
        <td v-if="item.hasMoreInfo === 'Y'">
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
      <template v-slot:item.assessmentName="{ item }">
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                :text="item.assessmentType?.label || item.assessmentTypeCode"
                variant="plain"
                class="m-1 p-1 text-left v-btn-link"
            >
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card :title="item.assessmentType?.label || item.assessmentTypeCode">
                  <v-card-text>
                    <div class="row py-1">
                      <div class="col">
                        <strong>Language:</strong>
                      </div>
                      <div class="col">
                        {{ item.assessmentType?.language }}
                      </div>
                    </div>
                    <div class="row py-1">
                      <div class="col"><strong>Start Date:</strong></div>
                      <div class="col">
                        {{ $filters.formatSimpleDate(item.assessmentType?.effectiveDate) }}
                      </div>
                    </div>
                    <div class="row py-1">
                      <div class="col"><strong>End Date:</strong></div>
                      <div class="col">
                        {{ $filters.formatSimpleDate(item.assessmentType?.expiryDate) }}
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" @click="isActive.value = false"></v-btn>
                  </v-card-actions>
                </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <ul v-if="item.hasMoreInfo === true">
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
    </v-data-table>
  </div>
</template>
<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import { mapState } from "pinia";
import {useAssessmentsStore} from "@/store/modules/assessments";
export default {
  name: "StudentAssessments",
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const assessmentStore = useAssessmentsStore();
    return { studentStore, appStore, assessmentStore };
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, { assessments: "studentAssessments" }),
    //...mapState(useAppStore, {assessmentTypeCodes: "assessmentTypeCodes"}),
    ...mapState(useAssessmentsStore, {assessmentTypeCodes: "assessmentTypeCodes"}),
    processedAssessments() {
      if (!this.assessments) return [];
      
      return this.assessments.map(assessment => ({
        ...assessment,
        assessmentType: this.assessmentTypeCodes.get(assessment.assessmentTypeCode) || null,
        //assessmentSession: this.assessmentSessions.find(session => session.sessionId === assessment.sessionId) || null
      }));
    }
  },

  async mounted() {
    await this.assessmentStore.getAssessmentTypeCodes();
    //await this.useAssessmentsStore.getAssessmentSessions();
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
          key: "assessmentTypeCode",
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
          value: (item) => `${item.courseYear}/${item.courseMonth}`,
        },
        {
          key: "provincialSpecialCaseCode",
          title: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "wroteFlag",
          title: "Wrote Flag",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
          value:(item) => item.wroteFlag === true ? 'Y' : 'N'
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
          value:(item) => item.numberOfAttempts >= 3 ? 'Y' : 'N'
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

<style scoped>

</style>