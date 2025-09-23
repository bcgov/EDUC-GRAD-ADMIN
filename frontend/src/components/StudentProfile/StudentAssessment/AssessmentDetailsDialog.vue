<template>
  <v-dialog v-model="dialog" max-width="1600px" persistent class="assessment-details-dialog">
    <v-card class="assessment-details-card">
      <v-card-title class="text-h5 d-flex align-center">
        <span class="font-weight-bold">Assessment Details</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>


      <v-card-text class="assessment-details-content" :class="{ 'no-scroll': isLoading }">
        <div v-if="isLoading" class="skeleton-container">
          <v-skeleton-loader
            type="heading"
            class="mb-4"
            height="32"
          ></v-skeleton-loader>

          <v-skeleton-loader
            type="chip, chip, chip, chip"
            class="mb-4"
            height="48"
          ></v-skeleton-loader>

          <div class="skeleton-content-area">
            <v-skeleton-loader
              type="table-heading"
              class="mb-2"
              height="40"
            ></v-skeleton-loader>
            <v-skeleton-loader
              type="table-tbody"
              class="mb-4"
              height="400"
            ></v-skeleton-loader>
          </div>
        </div>

        <div v-else>
          <div class="mb-4">
            <h3 class="text-h6 mb-2">
              {{ assessmentHeaderText }}
            </h3>
          </div>

          <v-tabs v-model="activeTab" color="primary" class="assessment-tabs">
            <v-tab value="summary">Summary</v-tab>
            <v-tab value="selected-response">Selected Response</v-tab>
            <v-tab value="constructed-written">Constructed Response - Written</v-tab>
            <v-tab v-if="hasOralComponent" value="constructed-oral">Constructed Response - Oral</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4 assessment-window">
            <v-window-item value="summary" class="assessment-window-item">
              <AssessmentSummaryTab
                :student-assessment-data="assessmentData"
                :student-detail="studentDetail"
                :component-scores="componentScores"
              />
            </v-window-item>

            <v-window-item value="selected-response" class="assessment-window-item">
              <SelectedResponseTab
                :assessment-data="assessmentData"
                :student-detail="studentDetail"
                :selected-response-items="selectedResponseItems"
                :computed-totals="getSelectedResponseTotals()"
              />
            </v-window-item>

            <v-window-item value="constructed-written" class="assessment-window-item">
              <ConstructedResponseTab
                :assessment-data="assessmentData"
                :student-detail="studentDetail"
                :constructed-response-items="constructedResponseItems.written"
                :computed-totals="getConstructedResponseTotals('written')"
                type="written"
              />
            </v-window-item>

            <v-window-item v-if="hasOralComponent" value="constructed-oral" class="assessment-window-item">
              <ConstructedResponseTab
                :assessment-data="assessmentData"
                :student-detail="studentDetail"
                :constructed-response-items="constructedResponseItems.oral"
                :computed-totals="getConstructedResponseTotals('oral')"
                type="oral"
              />
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>

      <v-card-actions v-if="!isLoading">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import AssessmentSummaryTab from './AssessmentDetailsTabs/AssessmentSummaryTab.vue'
import SelectedResponseTab from './AssessmentDetailsTabs/SelectedResponseTab.vue'
import ConstructedResponseTab from './AssessmentDetailsTabs/ConstructedResponseTab.vue'

export default {
  name: 'AssessmentDetailsDialog',
  components: {
    AssessmentSummaryTab,
    SelectedResponseTab,
    ConstructedResponseTab
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    assessmentData: {
      type: Object,
      default: () => ({})
    },
    studentDetail: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      activeTab: 'summary',
      isLoading: true,
      assessmentDetailsLoaded: false
    }
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolById: "getSchoolById",
    }),

    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
        if (!value) {
          this.isLoading = true
          this.assessmentDetailsLoaded = false
        }
      }
    },

    assessmentHeaderText() {
      if (!this.assessmentData || !this.studentDetail?.assessmentDetails) {
        return 'Assessment Details'
      }

      const assessmentCode = this.assessmentData.assessmentTypeCode || ''
      const session = this.getSessionText()
      const form = this.getFormCode()

      return `${assessmentCode} - ${session} - Form ${form}`
    },

    hasOralComponent() {
      if (!this.studentDetail?.assessmentDetails?.assessmentForms) {
        return false
      }

      return this.studentDetail.assessmentDetails.assessmentForms.some(form =>
        form.assessmentComponents?.some(component => this.isOralComponent(component))
      )
    },

    assessmentForms() {
      if (!this.studentDetail?.assessmentDetails?.assessmentForms || !this.assessmentData?.assessmentFormID) {
        return []
      }

      const matchingForm = this.studentDetail.assessmentDetails.assessmentForms.find(
        form => form.assessmentFormID === this.assessmentData.assessmentFormID
      )

      return matchingForm ? [matchingForm] : []
    },

    componentScores() {
      try {
        const componentMap = new Map()

        const selectedName = this.getComponentDisplayName('MUL_CHOICE', null)
        componentMap.set(selectedName, {
          name: selectedName,
          rawScore: 0,
          maxRawScore: 0,
          scaledScore: 0,
          maxScaledScore: 0,
          nonResponses: 0,
          type: 'MUL_CHOICE',
          subType: null
        })

        // Calculate Selected Response scores
        this.selectedResponseItems.forEach(item => {
          const comp = componentMap.get(selectedName)
          const rawScore = item.rawScore
          const scaledScore = item.scaledScore

          if (rawScore !== 'NR' && rawScore !== '-') {
            comp.rawScore += parseFloat(rawScore) || 0
          } else if (rawScore === 'NR') {
            comp.nonResponses += 1
          }

          comp.maxRawScore += parseFloat(item.maxRawScore) || 0

          if (scaledScore !== 'NR' && scaledScore !== '-') {
            comp.scaledScore += parseFloat(scaledScore) || 0
          }
          comp.maxScaledScore += parseFloat(item.maxScaledScore) || 0
        })

        const writtenName = this.getComponentDisplayName('OPEN_ENDED', 'WRITTEN')
        componentMap.set(writtenName, {
          name: writtenName, rawScore: 0, maxRawScore: 0, scaledScore: 0, maxScaledScore: 0, nonResponses: 0, type: 'OPEN_ENDED', subType: 'WRITTEN'
        })
        const oralName = this.getComponentDisplayName('OPEN_ENDED', 'ORAL')
        componentMap.set(oralName, {
          name: oralName, rawScore: 0, maxRawScore: 0, scaledScore: 0, maxScaledScore: 0, nonResponses: 0, type: 'OPEN_ENDED', subType: 'ORAL'
        })

        // Process Constructed Response components
        this.assessmentForms.forEach(form => {
          form.assessmentComponents?.forEach(component => {
            if (component.componentTypeCode === 'OPEN_ENDED') {
              const isOral = this.isOralComponent(component)
              const comp = componentMap.get(isOral ? oralName : writtenName)
              const questions = component.assessmentQuestions || []
              // Answers may now live on the top-level assessmentStudentComponents for the student.
              const answers = this.getStudentAnswersForComponent(component.assessmentComponentID) || component.assessmentAnswers || component.studentAnswers || []

              // Group questions by master question number (question sets)
              const questionSets = new Map()
              questions.forEach(q => {
                const key = q.masterQuestionNumber
                if (!questionSets.has(key)) questionSets.set(key, [])
                questionSets.get(key).push(q)
              })

              questionSets.forEach(questionSet => {
                // Find the canonical question (QUESTION_NUMBER = MASTER_QUESTION_NUMBER)
                const canonical = questionSet.find(q => q.questionNumber === q.masterQuestionNumber)

                if (canonical) {
                  // Max scores: only count the canonical question
                  const qv = parseFloat(canonical.questionValue) || 0
                  const sf = this.getScaleFactor(canonical.scaleFactor)

                  comp.maxRawScore += qv
                  comp.maxScaledScore += qv * sf

                  // Student scores: find the best answer in this question set
                  let bestAnswer = null
                  let bestScore = -1

                  questionSet.forEach(question => {
                    const answer = answers.find(a => a.assessmentQuestionID === question.assessmentQuestionID)
                    if (answer && answer.score != null && answer.score > bestScore) {
                      bestScore = answer.score
                      bestAnswer = answer
                    }
                  })

                  // Add student scores if they answered at least one question in the set
                  if (bestAnswer) {
                    comp.rawScore += parseFloat(bestAnswer.score) || 0

                    // For scaled score, use the scale factor from the canonical question
                    comp.scaledScore += (parseFloat(bestAnswer.score) || 0) * sf
                  } else {
                    // No answer found for any question in this set = non-response
                    comp.nonResponses += 1
                  }
                }
              })
            }
          })
        })

        return Array.from(componentMap.values()).filter(comp =>
          comp.rawScore > 0 || comp.maxRawScore > 0 || comp.scaledScore > 0 || comp.maxScaledScore > 0 || comp.nonResponses > 0
        )
      } catch (error) {
        console.error('Error in componentScores computed property:', error)
        return []
      }
    },

    selectedResponseItems() {
      const items = []
      const choicePath = this.studentDetail.selectedResponseChoicePath

      this.assessmentForms.forEach(form => {
        form.assessmentComponents?.forEach(component => {
          if (component.componentTypeCode === 'MUL_CHOICE') {
            const questions = component.assessmentQuestions || []
            const studentAnswers = this.getStudentAnswersForComponent(component.assessmentComponentID) || component.assessmentAnswers || component.studentAnswers || []

            const filteredQuestions = questions.filter(question => {
              if (choicePath === 'I' && question.taskCode === 'E') {
                return false
              }
              if (choicePath === 'E' && question.taskCode === 'I') {
                return false
              }
              return true
            })

            filteredQuestions.forEach(question => {
              const studentAnswer = this.findStudentAnswer(question, studentAnswers)

              items.push({
                itemNumber: question.itemNumber,
                questionNumber: question.questionNumber,
                rawScore: this.formatRawScore(studentAnswer),
                maxRawScore: this.formatNumber(question.questionValue),
                scaledScore: this.formatScaledScore(studentAnswer, question),
                maxScaledScore: this.formatNumber(question.questionValue * this.getScaleFactor(question.scaleFactor)),
                originalQuestion: question,
                originalAnswer: studentAnswer
              })
            })
          }
        })
      })

      return items.sort((a, b) => a.itemNumber - b.itemNumber)
    },

    constructedResponseItems() {
      try {
        const writtenItems = []
        const oralItems = []

        this.assessmentForms.forEach(form => {
          form.assessmentComponents?.forEach(component => {
            if (component.componentTypeCode === 'OPEN_ENDED') {
              const questions = component.assessmentQuestions || []
              const choices = component.assessmentChoices || []
              const studentAnswers = this.getStudentAnswersForComponent(component.assessmentComponentID)
              const studentChoices = this.getStudentChoicesForComponent(component.assessmentComponentID)
              const isOral = this.isOralComponent(component)
              const targetArray = isOral ? oralItems : writtenItems

              // Group questions by item number
              const itemGroups = new Map()

              questions.forEach(question => {
                const itemNumber = question.itemNumber
                if (!itemGroups.has(itemNumber)) {
                  itemGroups.set(itemNumber, [])
                }
                itemGroups.get(itemNumber).push(question)
              })

              // Process each item group
              itemGroups.forEach((itemQuestions, itemNumber) => {
                if (itemQuestions.length > 1) {
                  // Multiple questions for this item = choice scenario
                  let chosenQuestion = null

                  // Strategy 1: Look for explicit choice record from student choices
                  const studentChoiceRecord = studentChoices.find(choice => {
                    // Find the matching choice in component.assessmentChoices to get item number
                    const assessmentChoice = choices.find(ac => ac.assessmentChoiceID === choice.assessmentChoiceID)
                    return assessmentChoice && assessmentChoice.itemNumber === itemNumber
                  })

                  if (studentChoiceRecord) {
                    // Find the matching choice in component.assessmentChoices
                    const assessmentChoice = choices.find(ac => ac.assessmentChoiceID === studentChoiceRecord.assessmentChoiceID)
                    if (assessmentChoice && assessmentChoice.chosenQuestionNumber) {
                      chosenQuestion = itemQuestions.find(q => q.questionNumber === assessmentChoice.chosenQuestionNumber)
                    }
                  }

                  // Strategy 2: If no explicit choice record, find the question with the highest score
                  if (!chosenQuestion) {
                    let maxScore = -1
                    itemQuestions.forEach(question => {
                      const answer = studentAnswers.find(a => a.assessmentQuestionID === question.assessmentQuestionID)
                      if (answer && answer.score != null && answer.score > maxScore) {
                        maxScore = answer.score
                        chosenQuestion = question
                      }
                    })
                  }

                  // Strategy 3: If still no chosen question, pick the first answered question
                  if (!chosenQuestion) {
                    const answeredQuestions = itemQuestions.filter(question => {
                      return studentAnswers.some(answer =>
                        answer.assessmentQuestionID === question.assessmentQuestionID &&
                        answer.score != null
                      )
                    })
                    chosenQuestion = answeredQuestions[0]
                  }

                  // Strategy 4: If still no chosen question, pick the first question in the item
                  if (!chosenQuestion) {
                    chosenQuestion = itemQuestions[0]
                  }

                  // For choice scenarios, we need to add TWO rows:
                  // 1. A "Choice" row showing which question was selected
                  targetArray.push({
                    uniqueKey: `choice-${itemNumber}-${chosenQuestion.questionNumber}`,
                    itemNumber: itemNumber,
                    questionNumber: chosenQuestion.questionNumber,
                    itemType: 'Choice',
                    rawScore: '-',
                    maxRawScore: '-',
                    scaledScore: '-',
                    maxScaledScore: '-',
                    originalChoice: { itemNumber, chosenQuestionNumber: chosenQuestion.questionNumber }
                  })

                  // 2. A "Mark" row showing the actual scores for the chosen question
                  const studentAnswer = studentAnswers.find(answer =>
                    answer.assessmentQuestionID === chosenQuestion.assessmentQuestionID
                  )

                  targetArray.push({
                    uniqueKey: `question-${itemNumber}-${chosenQuestion.questionNumber}`,
                    itemNumber: itemNumber,
                    questionNumber: chosenQuestion.questionNumber,
                    itemType: 'Mark',
                    rawScore: this.formatRawScore(studentAnswer),
                    maxRawScore: this.formatNumber(chosenQuestion.questionValue || 0),
                    scaledScore: this.formatScaledScore(studentAnswer, chosenQuestion),
                    maxScaledScore: this.formatNumber((chosenQuestion.questionValue || 0) * this.getScaleFactor(chosenQuestion.scaleFactor)),
                    originalQuestion: chosenQuestion,
                    originalAnswer: studentAnswer
                  })
                } else {
                  // Single question for this item - just add the mark row
                  const question = itemQuestions[0]
                  const studentAnswer = studentAnswers.find(answer =>
                    answer.assessmentQuestionID === question.assessmentQuestionID
                  )

                  targetArray.push({
                    uniqueKey: `question-${itemNumber}-${question.questionNumber}`,
                    itemNumber: itemNumber,
                    questionNumber: question.questionNumber,
                    itemType: 'Mark',
                    rawScore: this.formatRawScore(studentAnswer),
                    maxRawScore: this.formatNumber(question.questionValue || 0),
                    scaledScore: this.formatScaledScore(studentAnswer, question),
                    maxScaledScore: this.formatNumber((question.questionValue || 0) * this.getScaleFactor(question.scaleFactor)),
                    originalQuestion: question,
                    originalAnswer: studentAnswer
                  })
                }
              })

              // Add any standalone choice items from student choices that don't have corresponding questions
              studentChoices.forEach(studentChoice => {
                const assessmentChoice = choices.find(ac => ac.assessmentChoiceID === studentChoice.assessmentChoiceID)
                if (assessmentChoice) {
                  const existingItem = targetArray.find(item =>
                    item.itemNumber === assessmentChoice.itemNumber &&
                    item.questionNumber === (assessmentChoice.chosenQuestionNumber || assessmentChoice.questionNumber)
                  )

                  // Only add if this choice doesn't already have a corresponding question item
                  if (!existingItem) {
                    targetArray.push({
                      uniqueKey: `choice-${assessmentChoice.itemNumber}-${assessmentChoice.chosenQuestionNumber || assessmentChoice.questionNumber}`,
                      itemNumber: assessmentChoice.itemNumber,
                      questionNumber: assessmentChoice.chosenQuestionNumber || assessmentChoice.questionNumber,
                      itemType: 'Choice',
                      rawScore: '-',
                      maxRawScore: '-',
                      scaledScore: '-',
                      maxScaledScore: '-',
                      originalChoice: assessmentChoice
                    })
                  }
                }
              })
            }
          })
        })

        return {
          written: writtenItems.sort((a, b) => {
            if (a.itemNumber !== b.itemNumber) {
              return a.itemNumber - b.itemNumber
            }
            // Sort by item type - Choice first, then Mark
            if (a.itemType !== b.itemType) {
              return a.itemType === 'Choice' ? -1 : 1
            }
            return a.questionNumber - b.questionNumber
          }),
          oral: oralItems.sort((a, b) => {
            if (a.itemNumber !== b.itemNumber) {
              return a.itemNumber - b.itemNumber
            }
            // Sort by item type - Choice first, then Mark
            if (a.itemType !== b.itemType) {
              return a.itemType === 'Choice' ? -1 : 1
            }
            return a.questionNumber - b.questionNumber
          })
        }
      } catch (error) {
        console.error('Error in constructedResponseItems computed property:', error)
        return {
          written: [],
          oral: []
        }
      }
    }
  },

  watch: {
    modelValue(newVal) {
      if (newVal && !this.assessmentDetailsLoaded) {
        this.loadAssessmentDetails()
      }
    },

    studentDetail: {
      handler(newVal) {
        if (newVal && this.modelValue) {
          this.assessmentDetailsLoaded = true
          this.isLoading = false
        }
      },
      immediate: true
    }
  },

  methods: {
    async loadAssessmentDetails() {
      this.isLoading = true

      if (this.studentDetail && Object.keys(this.studentDetail).length > 0) {
        this.assessmentDetailsLoaded = true
        this.isLoading = false
      }
    },

    getStudentAnswersForComponent(assessmentComponentID) {
      if (!this.studentDetail || !this.studentDetail.assessmentStudentComponents) return null
      const comp = this.studentDetail.assessmentStudentComponents.find(c => c.assessmentComponentID === assessmentComponentID)
      if (!comp) return null
      return comp.assessmentAnswers || comp.assessmentStudentAnswers || comp.studentAnswers || null
    },

    getStudentChoicesForComponent(assessmentComponentID) {
      if (!this.studentDetail || !this.studentDetail.assessmentStudentComponents) return null
      const comp = this.studentDetail.assessmentStudentComponents.find(c => c.assessmentComponentID === assessmentComponentID)
      if (!comp) return null
      return comp.assessmentStudentChoices || comp.assessmentChoices || null
    },

    isOralComponent(component) {
      if (component.componentSubTypeCode === 'ORAL' || component.componentTypeCode === 'ORAL') {
        return true
      }

      if (component.assessmentQuestions && component.assessmentQuestions.length > 0) {
        return component.assessmentQuestions.some(q =>
          q.conceptCode?.includes('ORAL') ||
          q.conceptCode?.includes('SPEAKING') ||
          q.conceptCode?.includes('COMMUNICATION') ||
          q.taskCode === 'O' ||
          q.claimCode?.includes('ORAL')
        )
      }

      return false
    },

    closeDialog() {
      this.dialog = false
      this.activeTab = 'summary'
    },

    getSessionText() {
      if (!this.assessmentData.courseYear || !this.assessmentData.courseMonth) {
        return ''
      }
      const year = this.assessmentData.courseYear
      const month = this.assessmentData.courseMonth.padStart(2, '0')
      return `${year}/${month}`
    },

    getFormCode() {
      if (!this.studentDetail?.assessmentDetails?.assessmentForms) {
        return ''
      }
      const formByAssessmentFormID = this.studentDetail.assessmentDetails.assessmentForms.filter(assessmentForm => assessmentForm.assessmentFormID === this.assessmentData.assessmentFormID)[0]
      return formByAssessmentFormID?.formCode || ''
    },

    getComponentDisplayName(componentType, componentSubType) {
      if (componentType === 'MUL_CHOICE') {
        return 'Selected Response'
      } else if (componentType === 'OPEN_ENDED') {
        if (componentSubType === 'ORAL') {
          return 'Constructed Response - Oral'
        } else {
          return 'Constructed Response - Written'
        }
      }
      return componentType
    },

    findStudentAnswer(question, studentAnswers) {
      if (!studentAnswers || !Array.isArray(studentAnswers)) return null
      let answer = studentAnswers.find(answer =>
        answer.assessmentQuestionID === question.assessmentQuestionID
      )

      if (!answer) {
        answer = studentAnswers.find(answer =>
          answer.questionNumber === question.questionNumber ||
          answer.itemNumber === question.itemNumber
        )
      }

      return answer
    },

    formatRawScore(studentAnswer) {
      if (!studentAnswer || studentAnswer.score === null || studentAnswer.score === undefined) {
        return 'NR'
      }
      return this.formatNumber(studentAnswer.score)
    },

    formatScaledScore(studentAnswer, question) {
      if (!studentAnswer || studentAnswer.score === null || studentAnswer.score === undefined) {
        return 'NR'
      }
      const scaleFactor = this.getScaleFactor(question.scaleFactor)
      const scaledScore = studentAnswer.score * scaleFactor
      return this.formatNumber(scaledScore)
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0.00'
      return parseFloat(value).toFixed(2)
    },

    getSelectedResponseTotals() {
      const totals = {
        totalRawScore: 0,
        totalMaxRawScore: 0,
        totalScaledScore: 0,
        totalMaxScaledScore: 0,
        answeredItems: 0,
        responseRate: 0
      }

      this.selectedResponseItems.forEach(item => {
        if (item.rawScore !== 'NR') {
          totals.totalRawScore += parseFloat(item.rawScore)
          totals.answeredItems += 1
        }
        totals.totalMaxRawScore += parseFloat(item.maxRawScore)

        if (item.scaledScore !== 'NR' && item.scaledScore !== '-') {
          totals.totalScaledScore += parseFloat(item.scaledScore)
        }
        totals.totalMaxScaledScore += parseFloat(item.maxScaledScore)
      })

      if (this.selectedResponseItems.length > 0) {
        totals.responseRate = ((totals.answeredItems / this.selectedResponseItems.length) * 100).toFixed(2)
      }

      totals.totalRawScore = this.formatNumber(totals.totalRawScore)
      totals.totalMaxRawScore = this.formatNumber(totals.totalMaxRawScore)
      totals.totalScaledScore = this.formatNumber(totals.totalScaledScore)
      totals.totalMaxScaledScore = this.formatNumber(totals.totalMaxScaledScore)

      return totals
    },

    getConstructedResponseTotals(type) {
      const constructedItems = this.constructedResponseItems || { written: [], oral: [] }
      const items = type === 'oral' ? constructedItems.oral : constructedItems.written
      const groups = new Map()

      items.forEach(item => {
        if (item.itemType !== 'Mark') return
        const q = item.originalQuestion || {}
        const key = q.masterQuestionNumber ?? q.questionNumber ?? item.questionNumber
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key).push(item)
      })

      const totals = {
        totalRawScore: 0,
        totalMaxRawScore: 0,
        totalScaledScore: 0,
        totalMaxScaledScore: 0,
        answeredItems: 0,
        markItems: 0
      }

      groups.forEach(group => {
        // pick canonical item (questionNumber == masterQuestionNumber) else first
        const canonical =
            group.find(it => {
              const q = it.originalQuestion || {}
              return q.questionNumber === q.masterQuestionNumber
            }) || group[0]

        const q = canonical.originalQuestion || {}
        const qv = parseFloat(q.questionValue) || 0
        const sf = this.getScaleFactor(q.scaleFactor)

        // Max from canonical only
        totals.totalMaxRawScore += qv
        totals.totalMaxScaledScore += qv * sf

        // Student from canonical only (NR => 0)
        if (canonical.rawScore !== 'NR' && canonical.rawScore !== '-') {
          const raw = parseFloat(canonical.rawScore) || 0
          totals.totalRawScore += raw
          totals.answeredItems += 1
        }
        if (canonical.scaledScore !== 'NR' && canonical.scaledScore !== '-') {
          totals.totalScaledScore += parseFloat(canonical.scaledScore) || 0
        }
      })

      totals.totalRawScore = this.formatNumber(totals.totalRawScore)
      totals.totalMaxRawScore = this.formatNumber(totals.totalMaxRawScore)
      totals.totalScaledScore = this.formatNumber(totals.totalScaledScore)
      totals.totalMaxScaledScore = this.formatNumber(totals.totalMaxScaledScore)

      return totals
    },

    getScaleFactor(scaleFactor) {
      if (scaleFactor === null || scaleFactor === undefined || scaleFactor === '') {
        return 0
      }

      const numericValue = parseFloat(scaleFactor)
      if (isNaN(numericValue)) {
        return 0
      }

      return numericValue / 100
    }
  }
}
</script>

<style scoped>
.v-dialog > .v-card > .v-card-title {
  background-color: #f5f5f5;
}

.info-row strong {
  min-width: 150px;
}

.v-data-table .v-data-table__wrapper {
  overflow-x: hidden;
}

.text-center.py-4 .v-icon {
  margin-bottom: 1rem;
}

.assessment-details-dialog {
  overflow-x: hidden;
}

.assessment-details-dialog .v-overlay__content {
  max-width: 100vw;
  overflow-x: hidden;
}

.assessment-details-card {
  overflow-x: hidden;
  max-width: 100%;
}

.assessment-details-content {
  overflow-x: hidden;
  max-width: 100%;
  padding-top: 0 !important;
}

.assessment-tabs {
  overflow-x: auto;
  max-width: 100%;
}

.assessment-tabs .v-tabs__container {
  overflow-x: auto;
}

.assessment-window {
  overflow-x: hidden;
  max-width: 100%;
}

.assessment-window-item {
  overflow-x: hidden;
  max-width: 100%;
}

.assessment-window-item > * {
  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 1600px) {
  .assessment-details-dialog .v-dialog {
    margin: 12px;
    max-width: calc(100vw - 24px);
  }

  .assessment-details-card {
    width: 100%;
    max-width: none;
  }
}

.assessment-window-item .v-row {
  margin: 0;
}

.assessment-window-item .v-col {
  padding: 8px;
}

/* Skeleton loader styles */
.skeleton-container {
  width: 100%;
  max-width: 100%;
}

.skeleton-content-area {
  width: 100%;
  max-width: 100%;
}

.no-scroll {
  overflow: hidden !important;
}
</style>
