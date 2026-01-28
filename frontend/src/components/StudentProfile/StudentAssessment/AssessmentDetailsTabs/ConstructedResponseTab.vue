<template>
  <div class="constructed-response-tab">
    <div class="info-section mb-6" v-if="constructedResponseItems.length > 0">
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
            <strong>Scaled Score:</strong>
            <span>{{ totalScaledScore }}</span>
          </div>
          <div class="info-item">
            <strong>Max Scaled Score:</strong>
            <span>{{ totalMaxScaledScore }}</span>
          </div>
        </div>
      </div>
    </div>

    <v-row>
      <v-col cols="12">
          <div v-if="constructedResponseItems.length === 0" class="text-center py-4">
            <v-icon size="48" color="grey">{{ emptyStateIcon }}</v-icon>
            <p class="text-grey mt-2">{{ emptyStateMessage }}</p>
          </div>

          <div v-else>
            <v-data-table
              :items="constructedResponseItems"
              :headers="questionHeaders"
              :items-per-page="10"
              :items-per-page-options="[10, 25, 50, -1]"
              class="elevation-1"
              item-key="uniqueKey"
              :sort-by="[{ key: 'itemNumber', order: 'asc' }]"
              show-current-page
            >
              <template v-slot:item.itemNumber="{ item }">
                <strong>{{ item.itemNumber }}</strong>
              </template>

              <template v-slot:item.questionNumber="{ item }">
                <span>{{ item.questionNumber }}</span>
              </template>

              <template v-slot:item.itemType="{ item }">
                <v-chip
                  :color="item.itemType === 'Mark' ? 'primary' : 'secondary'"
                  size="small"
                >
                  {{ item.itemType }}
                </v-chip>
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
  name: 'ConstructedResponseTab',
  props: {
    assessmentData: {
      type: Object,
      required: true
    },
    studentDetail: {
      type: Object,
      required: true
    },
    constructedResponseItems: {
      type: Array,
      required: true
    },
    computedTotals: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['written', 'oral'].includes(value)
    }
  },
  computed: {
    questionHeaders() {
      return [
        { title: 'Item #', key: 'itemNumber', sortable: true, align: 'center', width: '70px' },
        { title: 'Question #', key: 'questionNumber', sortable: true, align: 'center', width: '90px' },
        { title: 'Type', key: 'itemType', sortable: true, align: 'center', width: '80px' },
        { title: 'Raw Score', key: 'rawScore', sortable: true, align: 'center', width: '90px' },
        { title: 'Max Raw Score', key: 'maxRawScore', sortable: true, align: 'center', width: '80px' },
        { title: 'Scaling Factor', key: 'scalingFactor', sortable: true, align: 'center', width: '90px' },
        { title: 'Scaled Score', key: 'scaledScore', sortable: true, align: 'center', width: '100px' },
        { title: 'Max Scaled Score', key: 'maxScaledScore', sortable: true, align: 'center', width: '100px' }
      ]
    },

    emptyStateIcon() {
      return this.type === 'oral' ? 'mdi-microphone-outline' : 'mdi-pencil-outline'
    },

    emptyStateMessage() {
      return this.type === 'oral'
        ? 'No oral constructed response items found for this assessment.'
        : 'No written constructed response items found for this assessment.'
    },

    totalRawScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalRawScore
      }
      const total = this.constructedResponseItems.reduce((sum, item) => {
        if (item.itemType === 'Mark' && item.rawScore !== 'NR' && item.rawScore !== '-') {
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
      const total = this.constructedResponseItems.reduce((sum, item) => {
        if (item.itemType === 'Mark' && item.maxRawScore !== '-') {
          return sum + parseFloat(item.maxRawScore)
        }
        return sum
      }, 0)
      return this.formatNumber(total)
    },

    totalScaledScore() {
      if (this.computedTotals) {
        return this.computedTotals.totalScaledScore
      }
      const total = this.constructedResponseItems.reduce((sum, item) => {
        if (item.itemType === 'Mark' && item.scaledScore !== 'NR' && item.scaledScore !== '-') {
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
      const total = this.constructedResponseItems.reduce((sum, item) => {
        if (item.itemType === 'Mark' && item.maxScaledScore !== '-') {
          return sum + parseFloat(item.maxScaledScore)
        }
        return sum
      }, 0)
      return this.formatNumber(total)
    },

    answeredItems() {
      if (this.computedTotals) {
        return this.computedTotals.answeredItems
      }
      return this.constructedResponseItems.filter(item =>
        item.itemType === 'Mark' && item.rawScore !== 'NR' && item.rawScore !== '-' && parseFloat(item.rawScore) > 0
      ).length
    },

    markItems() {
      if (this.computedTotals) {
        return this.computedTotals.markItems
      }
      return this.constructedResponseItems.filter(item => item.itemType === 'Mark').length
    },

    responseRate() {
      if (this.markItems === 0) return '0.00'
      const responded = this.answeredItems
      return ((responded / this.markItems) * 100).toFixed(2)
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
.constructed-response-tab {
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
