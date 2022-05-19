<template>
  <div >
    <DisplayTable :items="assessments" :fields="fields" showFilter=true title="Assessments">
        <template #cell(assessmentName)="row">
          <div class="d-flex flex-column text-md-left">
              <div class="">
                <b-button
                  :id="
                    'popover-button-event' +
                    row.item.assessmentCode +
                    row.item.sessionDate
                  "
                  variant="link"
                  class="m-0 p-0 text-left"
                  >
                    {{row.item.assessmentName}}
                  </b-button
                >
              </div>
              <b-popover
                :ref="'popover'+row.item.assessmentCode +
                  row.item.sessionDate"
                triggers="focus"
                :target="
                  'popover-button-event' +
                  row.item.assessmentCode +
                  row.item.sessionDate
                "
                :title="row.item.assessmentName"
              >
              
       
                  <div>
                    <td><strong>Assessment Code:</strong> {{row.item.assessmentDetails.assessmentCode}}</td>
                  </div>
                  <div>
                    <strong>Asessment Name:</strong><br> {{row.item.assessmentDetails.assessmentName}}
                  </div>
                  <div>
                    <strong>Language:</strong> {{row.item.assessmentDetails.language}}
                  </div>
                  <div>
                    <strong>Start Date:</strong> {{row.item.assessmentDetails.startDate | formatTime}}
                  </div>
                  <div>
                    <strong>End Date:</strong> {{row.item.assessmentDetails.endDate | formatTime}}
                  </div>
              </b-popover>
            </div>
        </template>
        <template #cell(more)="row">
          <b-btn
            variant="outline primary"
            style="color: #666"
            size="sm"
            @click="row.toggleDetails"
            class="more-button"
            v-if="row.item.hasMoreInfo"
          >
            <img v-show="!row.detailsShowing" src="../assets/images/icon-right.svg" width="9px" aria-hidden="true" alt=""/>
            <img v-show="row.detailsShowing" src="../assets/images/icon-down.svg" height="5px" aria-hidden="true" alt=""/>
          </b-btn>
        </template>
        <template #row-details="row">
          <b-card class="px-0">
            <ul>
              <li v-if="row.item.mincodeAssessment">
                <strong>Assessment Centre:</strong> {{ row.item.mincodeAssessment }}
              </li>
              <li v-if="row.item.mincodeAssessmentName">
                <strong>Assessment Centre Name:</strong> {{ row.item.mincodeAssessmentName }}
              </li>                
            </ul>
          </b-card>
        </template>
      </DisplayTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentAssessments",
  components: {
    DisplayTable: DisplayTable
  },
  props: {},
  computed: {
    ...mapGetters({
      assessments: "getStudentAssessments",
    }),
  },
  data: function() {
    return {
      fields: [
        { key: "more", label: "" },
        {
          key: "assessmentCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "sessionDate",
          label: "Session",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "specialCase",
          label: "Special case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "exceededWriteFlag",
          label: "Exceeded writes",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center"
        },
        {
          key: "proficiencyScore",
          label: "Proficiency score",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center"
        },        
        {
          key: "assessmentName",
          label: "Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-left w-50"
        },
      ]
    }
  },
  methods: {

  },
};
</script>

