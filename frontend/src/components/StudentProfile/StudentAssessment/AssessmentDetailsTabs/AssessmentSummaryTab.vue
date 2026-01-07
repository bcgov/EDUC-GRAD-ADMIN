<template>
  <div class="assessment-summary">
    <div class="info-section mb-6">
      <div class="info-row-group mb-4">
        <div class="info-grid">
          <div class="info-item">
            <strong>Proficiency Score:</strong>
            <span v-if="studentDetail.proficiencyScore">
              {{ getDisplayValue(studentDetail.proficiencyScore) }}
            </span>
            <span v-else>-</span>
          </div>
          <div class="info-item">
            <strong>Special Case:</strong>
            <span>{{ getDisplayValue(getSpecialCaseDescription(studentDetail.provincialSpecialCaseCode)) }}</span>
          </div>
          <div class="info-item">
            <strong>IRT Score:</strong>
            <span>{{ getDisplayValue(studentDetail.irtScore) }}</span>
          </div>
          <div class="info-item">
            <strong>School of Record at Write:</strong>
            <span>{{ getDisplayValue(getSchoolOfRecordAtWrite()) }}</span>
          </div>
        </div>
      </div>

      <div class="info-row-group mb-4">
        <div class="info-grid">
          <div class="info-item">
            <strong>Assessment Centre:</strong>
            <span>{{ getDisplayValue(getAssessmentCentre()) }}</span>
          </div>
          <div class="info-item">
            <strong>Local Assessment ID:</strong>
            <span>{{ getDisplayValue(studentDetail.localAssessmentID) }}</span>
          </div>
          <div class="info-item">
            <strong>Adapted Assessment:</strong>
            <span>{{ getDisplayValue(getAdaptedAssessment()) }}</span>
          </div>
          <div class="info-item">
            <strong>Marking Session:</strong>
            <span>{{ getDisplayValue(getMarkingSession()) }}</span>
          </div>
        </div>
      </div>
    </div>

    <v-card class="mb-4">
      <v-card-title class="text-h6">Component Scores</v-card-title>
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Component</th>
              <th class="text-center">Raw Score</th>
              <th class="text-center">Max Raw Score</th>
              <th class="text-center">Scaled Score</th>
              <th class="text-center">Max Scaled Score</th>
              <th class="text-center">Non-Responses</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="component in componentScores" :key="component.name">
              <td class="font-weight-medium">{{ component.name }}</td>
              <td class="text-center">{{ formatScore(component.rawScore) }}</td>
              <td class="text-center">{{ formatScore(component.maxRawScore) }}</td>
              <td class="text-center">{{ formatScore(component.scaledScore) }}</td>
              <td class="text-center">{{ formatScore(component.maxScaledScore) }}</td>
              <td class="text-center">{{ formatScore(component.nonResponses) }}</td>
            </tr>
            <tr class="font-weight-bold bg-grey-lighten-4 border-t-sm">
              <td class="font-weight-bold">Total</td>
              <td class="text-center font-weight-bold">{{ formatScore(totalScores.rawScore) }}</td>
              <td class="text-center font-weight-bold">{{ formatScore(totalScores.maxRawScore) }}</td>
              <td class="text-center font-weight-bold">{{ formatScore(totalScores.scaledScore) }}</td>
              <td class="text-center font-weight-bold">{{ formatScore(totalScores.maxScaledScore) }}</td>
              <td class="text-center font-weight-bold">{{ formatScore(totalScores.nonResponses) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: 'AssessmentSummaryTab',
  props: {
    studentAssessmentData: {
      type: Object,
      required: true
    },
    studentDetail: {
      type: Object,
      required: true
    },
    componentScores: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolById: "getSchoolById",
    }),

    totalScores() {
      const total = {
        rawScore: 0,
        maxRawScore: 0,
        scaledScore: 0,
        maxScaledScore: 0,
        nonResponses: 0
      }

      this.componentScores.forEach(component => {
        total.rawScore += component.rawScore || 0
        total.maxRawScore += component.maxRawScore || 0
        total.scaledScore += component.scaledScore || 0
        total.maxScaledScore += component.maxScaledScore || 0
        total.nonResponses += component.nonResponses || 0
      })

      return total
    }
  },

  methods: {
    getDisplayValue(value) {
      return (value !== null && value !== undefined && value !== '') ? value : '-'
    },

    formatScore(score) {
      if (score === null || score === undefined) return '-'
      return Number(score).toFixed(2)
    },

    getSpecialCaseDescription(code) {
      if (!code) return null
      const specialCases = {
        'E': 'Exempt',
        'A': 'Aegrotat',
        'X': 'Not Completed',
        'Q': 'Disqualification'
      }
      return specialCases[code] || code
    },

    getSchoolOfRecordAtWrite() {
      const schoolId = this.studentDetail.schoolOfRecordSchoolID
      if (!schoolId) return null

      const school = this.getSchoolById(schoolId)
      return school ? `${school.mincode} - ${school.displayName}` : schoolId
    },

    getAssessmentCentre() {
      const assessmentCenterID = this.studentDetail.assessmentCenterSchoolID
      if (!assessmentCenterID) return null

      const school = this.getSchoolById(assessmentCenterID)
      return school ? `${school.mincode} - ${school.displayName}` : assessmentCenterID
    },

    getAdaptedAssessment() {
      const adaptedCode = this.studentAssessmentData.adaptedAssessmentCode
      return adaptedCode ? 'Yes' : 'No'
    },

    getMarkingSession() {
      const markingSession = this.studentAssessmentData.markingSession
      if (markingSession) {
        try {
          const date = new Date(markingSession)
          return date.toLocaleString(undefined, { month: 'long', year: 'numeric' })
        } catch {
          return markingSession
        }
      }
      return null
    }
  }
}
</script>

<style scoped>
.assessment-summary {
  max-height: 600px;
  overflow-y: auto;
}

.info-section {
  padding: 16px 0;
}

.info-row-group {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.info-item strong {
  margin-bottom: 4px;
  color: #424242;
  font-size: 0.875rem;
}

.info-item span {
  color: #616161;
  font-size: 0.875rem;
}

.v-table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.bg-grey-lighten-4 {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

.border-t-sm {
  border-top: 2px solid #e0e0e0;
}
</style>
