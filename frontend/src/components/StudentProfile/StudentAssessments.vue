<template>
  <div>
    <DisplayTable
      :items="assessments"
      :fields="fields"
      showFilter="true"
      title="Assessments"
    >
      <template #cell(sessionDate)="row">
        {{ $filters.formatYYYYMMDate(row.value) }}
      </template>
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
              {{ row.item.assessmentName }}
            </b-button>
          </div>
          <b-popover
            :ref="'popover' + row.item.assessmentCode + row.item.sessionDate"
            triggers="focus"
            :target="
              'popover-button-event' +
              row.item.assessmentCode +
              row.item.sessionDate
            "
            :title="row.item.assessmentName"
          >
            <div>
              <strong>Language:</strong>
              {{ row.item.assessmentDetails.language }}
            </div>
            <div>
              <strong>Start Date:</strong>
              {{
                $filters.formatSimpleDate(row.item.assessmentDetails.startDate)
              }}
            </div>
            <div>
              <strong>End Date:</strong>
              {{
                $filters.formatSimpleDate(row.item.assessmentDetails.endDate)
              }}
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
          <img
            v-show="!row.detailsShowing"
            src="../../assets/images/icon-right.svg"
            width="9"
            aria-hidden="true"
            alt=""
          />
          <img
            v-show="row.detailsShowing"
            src="../../assets/images/icon-down.svg"
            height="5"
            aria-hidden="true"
            alt=""
          />
        </b-btn>
      </template>
      <template #row-details="row">
        <b-card class="px-0">
          <ul>
            <li v-if="row.item.mincodeAssessment">
              <strong>Assessment Centre:</strong>
              {{ row.item.mincodeAssessment }}
            </li>
            <li v-if="row.item.mincodeAssessmentName">
              <strong>Assessment Centre Name:</strong>
              {{ row.item.mincodeAssessmentName }}
            </li>
          </ul>
        </b-card>
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
          label: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "wroteFlag",
          label: "Wrote Flag",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "exceededWriteFlag",
          label: "Exceeded Writes",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "proficiencyScore",
          label: "Proficiency Score",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "assessmentName",
          label: "Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-left w-50",
        },
      ],
    };
  },
  methods: {},
};
</script>
