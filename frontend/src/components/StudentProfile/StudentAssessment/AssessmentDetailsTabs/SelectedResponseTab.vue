<template>
  <div class="selected-response-tab">
    <div class="info-section mb-6" v-if="selectedResponseItems.length > 0">
      <div class="info-row-group mb-4">
        <div class="info-grid-five">
          <div class="info-item">
            <strong>Total Raw Score:</strong>
            <span>{{ totalRawScore }}</span>
          </div>
          <div class="info-item">
            <strong>Max Raw Score:</strong>
            <span>{{ totalMaxRawScore }}</span>
          </div>
          <div class="info-item">
            <strong>Total Scaled Score:</strong>
            <span>{{ totalScaledScore }}</span>
          </div>
          <div class="info-item">
            <strong>Max Scaled Score:</strong>
            <span>{{ totalMaxScaledScore }}</span>
          </div>
          <div class="info-item">
            <strong>Response Rate:</strong>
            <span>{{ responseRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <v-row>
      <v-col cols="12">
        <div v-if="selectedResponseItems.length === 0" class="text-center py-4">
          <v-icon size="48" color="grey">mdi-help-circle-outline</v-icon>
          <p class="text-grey mt-2">No selected response questions found for this assessment.</p>
        </div>

        <div v-else>
          <v-data-table
            :items="selectedResponseItems"
            :headers="questionHeaders"
            :items-per-page="10"
            :items-per-page-options="[10, 25, 50, -1]"
            class="elevation-1"
            item-key="itemNumber"
            :sort-by="[{ key: 'itemNumber', order: 'asc' }]"
            show-current-page
          >
            <template v-slot:item.itemNumber="{ item }">
              <strong>{{ item.itemNumber }}</strong>
            </template>

            <template v-slot:item.questionNumber="{ item }">
              <span>{{ item.questionNumber }}</span>
            </template>

            <template v-slot:item.rawScore="{ item }">
              <span class="font-mono">{{ item.rawScore }}</span>
            </template>

            <template v-slot:item.scalingFactor="{ item }">
              <span class="font-mono">{{ item.scalingFactor }}</span>
            </template>

            <template v-slot:item.maxRawScore="{ item }">
              <span class="font-mono">{{ item.maxRawScore }}</span>
            </template>

            <template v-slot:item.scaledScore="{ item }">
              <span class="font-mono">{{ item.scaledScore }}</span>
            </template>

            <template v-slot:item.maxScaledScore="{ item }">
              <span class="font-mono">{{ item.maxScaledScore }}</span>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'SelectedResponseTab',
  props: {
    assessmentData: {
      type: Object,
      required: true
    },
    studentDetail: {
      type: Object,
      required: true
    },
    selectedResponseItems: {
      type: Array,
      required: true
    },
    computedTotals: {
      type: Object,
      default: null
    }
  },
  computed: {
    questionHeaders() {
      return [
        { title: 'Item #', key: 'itemNumber', sortable: true, align: 'center', width: '80px' },
        { title: 'Question #', key: 'questionNumber', sortable: true, align: 'center', width: '100px' },
        { title: 'Raw Score', key: 'rawScore', sortable: true, align: 'center', width: '90px' },
        { title: 'Max Raw Score', key: 'maxRawScore', sortable: true, align: 'center', width: '90px' },
        { title: 'Scaling Factor', key: 'scalingFactor', sortable: true, align: 'center', width: '90px' },
        { title: 'Scaled Score', key: 'scaledScore', sortable: true, align: 'center', width: '100px' },
        { title: 'Max Scaled Score', key: 'maxScaledScore', sortable: true, align: 'center', width: '100px' }
      ]
    },

    answeredItems() {
      return this.selectedResponseItems.filter(item =>
        item.rawScore !== 'NR' && parseFloat(item.rawScore) > 0
      ).length
    },

    totalRawScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalRawScore
      }
      const total = this.selectedResponseItems.reduce((sum, item) => {
        if (item.rawScore !== 'NR') {
          return sum + parseFloat(item.rawScore)
        }
        return sum
      }, 0)
      return this.formatNumber(total)
    },

    totalMaxRawScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalMaxRawScore
      }
      const total = this.selectedResponseItems.reduce((sum, item) => {
        return sum + parseFloat(item.maxRawScore)
      }, 0)
      return this.formatNumber(total)
    },

    totalScaledScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalScaledScore
      }
      const total = this.selectedResponseItems.reduce((sum, item) => {
        if (item.scaledScore !== 'NR') {
          return sum + parseFloat(item.scaledScore)
        }
        return sum
      }, 0)
      return this.formatNumber(total)
    },

    totalMaxScaledScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalMaxScaledScore
      }
      const total = this.selectedResponseItems.reduce((sum, item) => {
        return sum + parseFloat(item.maxScaledScore)
      }, 0)
      return this.formatNumber(total)
    },

    responseRate() {
      if (this.computedTotals) {
        return this.computedTotals.responseRate
      }
      if (this.selectedResponseItems.length === 0) return '0.00'
      const responded = this.answeredItems
      return ((responded / this.selectedResponseItems.length) * 100).toFixed(2)
    }
  },

  methods: {
    formatNumber(value) {
      if (value === null || value === undefined) return '0.00'
      return parseFloat(value).toFixed(2)
    }
  }
}
</script>

<style scoped>
.selected-response-tab {
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

.info-grid-five {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

.font-mono {
  font-family: 'Courier New', monospace;
}

.v-data-table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.text-center.py-4 {
  padding: 2rem;
}

.text-center.py-4 .v-icon {
  margin-bottom: 1rem;
}
</style>
