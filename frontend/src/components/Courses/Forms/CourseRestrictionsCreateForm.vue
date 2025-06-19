<template>
  <v-dialog v-model="dialog" persistent max-width="1024">
    <template v-slot:activator="{ props }">
      <div class="pr-14">
        <v-btn class="text-none mt-4" color="bcGovBlue" prepend-icon="mdi-plus"
          @click="openCreateCoursRestrictionsDialog()" text="Add Course Restriction" :disabled="!hasPermissions('COURSE', 'restrictionUpdate')"/>
      </div>
    </template>
      
    <v-card>
      <v-card-title><v-row no-gutters>
          <div class="v-card-title">Add Course Restriction</div>
          <v-spacer /> <v-btn icon="mdi-close" density="compact" rounded="sm"
            @click="closeCreateCoursRestrictionsDialog()" />
        </v-row>
      </v-card-title>
      <v-stepper alt-labels show-actions v-model="step">
        <template v-slot:default>
          <v-stepper-header>
            <v-stepper-item title="Restriction&nbsp;Details" value="1" no-wrap> </v-stepper-item>
            <v-stepper-item title="Confirmation" value="2"></v-stepper-item>
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item value="1">
              <CourseRestrictionsDetailsInput :courseRestriction="courseRestriction" ref="CourseRestrictionsDetailsInputRef" create />
            </v-stepper-window-item>

            <v-stepper-window-item value="2">
              <v-expansion-panels>
                <v-expansion-panel v-if="createCourseRestrictionResponse.hasPersisted !== null">
                  <v-expansion-panel-title class="d-flex align-center justify-space-between">

                    <div class="d-flex align-center flex-grow-1">
                      <v-icon :color="createCourseRestrictionResponse.hasPersisted === false
                          ? 'error'
                          : 'success'
                        " class="mr-2">
                        {{
                          createCourseRestrictionResponse.hasPersisted === false
                            ? "mdi-close-circle"
                            : "mdi-check-circle"
                        }}
                      </v-icon>

                      <span>
                        {{ createCourseRestrictionResponse.mainCourse }}
                        {{ createCourseRestrictionResponse.mainCourseLevel }} –
                        {{ createCourseRestrictionResponse.restrictedCourse }}
                        {{ createCourseRestrictionResponse.restrictedCourseLevel }}
                        {{
                          createCourseRestrictionResponse.hasPersisted === false
                            ? " failed to add course restriction"
                            : " added to course restriction"
                        }}
                      </span>

                      <v-spacer />
                      <span class="text-caption text-grey-darken-1">
                        {{
                          (() => {
                            const errors = createCourseRestrictionResponse.validationIssues.filter(
                              (i) => i.validationIssueSeverityCode === "ERROR"
                            ).length;
                            const warnings = createCourseRestrictionResponse.validationIssues.filter(
                              (i) => i.validationIssueSeverityCode === "WARNING"
                            ).length;

                            const parts = [];
                            if (errors > 0) parts.push(`${errors} error(s)`);
                            if (warnings > 0)
                              parts.push(`${warnings} warning(s)`);
                            return parts.join(", ");
                          })()
                        }}
                      </span>
                    </div>

                    <template #actions>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <div v-if="createCourseRestrictionResponse.validationIssues.length > 0">
                      <v-alert v-for="(issue, i) in createCourseRestrictionResponse.validationIssues" :key="i" :type="issue.validationIssueSeverityCode === 'ERROR'
                          ? 'error'
                          : 'warning'
                        " dense outlined class="mb-2">
                        {{ issue.validationIssueMessage }}
                      </v-alert>
                    </div>
                    <div v-else>
                      <v-alert type="success" dense outlined>
                        No validation issues.
                      </v-alert>
                    </div>
                    <pre></pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-alert v-if="createCourseRestrictionResponse.hasPersisted === null" type="info" class="mb-4"
                border="start" elevation="2" variant="tonal">
                <div class="mb-2">
                  You are about to add the following course restriction:
                </div>
                <ul class="pl-4">
                  <strong>Main Course</strong>
                  <div>
                    {{ courseRestriction.mainCourse.courseCode }} {{ courseRestriction.mainCourse.courseLevel }} –
                    {{ courseRestriction.mainCourse.courseName }}
                  </div>
                  <strong>Restricted Course</strong>
                  <div>
                    {{ courseRestriction.restrictedCourse.courseCode }} {{
                      courseRestriction.restrictedCourse.courseLevel }} –
                    {{ courseRestriction.restrictedCourse.courseName }}
                  </div>
                  <strong>Restriction Start Date</strong>
                  <div>
                    {{ courseRestriction.restrictionStartDate || '–' }}
                  </div>
                  <strong>Restriction End Date</strong>
                  <div>
                    {{ courseRestriction.restrictionEndDate || '–' }}
                  </div>
                </ul>
              </v-alert>
            </v-stepper-window-item>


          </v-stepper-window>
        </template>
      </v-stepper>
      <v-card-actions>
        <v-btn v-if="step == 0" @click="closeCreateCoursRestrictionsDialog()" color="error" variant="outlined"
          class="text-none">Cancel</v-btn>
        <v-btn v-else-if="step == 1" @click="step--" color="bcGovBlue" variant="outlined"
          :disabled="validationStep">Back</v-btn>
        <v-spacer />
        <v-btn v-if="step < 1" @click="step++" color="bcGovBlue" variant="outlined"
          :disabled="courseRestriction.hasValidationError">Next</v-btn>

        <v-btn v-else-if="step == 1 && !validationStep" @click="submitForm" color="error" variant="flat"
          class="text-none" :disabled="courseRestriction.hasValidationError">
          Add Course Restriction
        </v-btn>
        <v-btn v-else-if="step == 1 && validationStep" @click="closeCreateCoursRestrictionsDialog" color="error"
          variant="flat" class="text-none">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAccessStore } from "@/store/modules/access";
import { useCourseStore } from "@/store/modules/course.js";
import CourseRestrictionsDetailsInput from "@/components/Courses/Forms/FormInputs/CourseRestrictionsDetailsInput.vue";
import { mapState, mapActions } from "pinia";
import { toRaw } from "vue";
export default {
  name: "CourseRestrictionsCreateForm",
  components: {
    CourseRestrictionsDetailsInput: CourseRestrictionsDetailsInput,
  },  
  data() {
    return {
      createCourseRestrictionResponse: this.getDefaultCourseRestrictionResponse(),
      dialog: false,
      step: 0,
      validationStep: false,
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useCourseStore, {
      courseRestriction: (state) => state.courseRestrictionToSave,
    })
  },
  methods: {
    ...mapActions(useCourseStore, [
      "clearCourseRestriction",
      "createCourseRestriction",
      "loadCourseRestrictions",
    ]),
    getDefaultCourseRestrictionResponse() {
      return {
        mainCourse: "",
        mainCourseLevel: "",
        restrictedCourse: "",
        restrictedCourseLevel: "",
        restrictionStartDate: "",
        restrictionEndDate: "",
        hasPersisted: null,
        validationErrors: []
      };
    },
    openCreateCoursRestrictionsDialog() {
      (this.step = 0), this.clearForm();
      this.dialog = true;
    },
    closeCreateCoursRestrictionsDialog() {
      this.clearForm();
      this.createCourseRestrictionResponse = this.getDefaultCourseRestrictionResponse()
      this.dialog = false;
    },
    clearForm() {
      this.clearCourseRestriction();
    },
    async submitForm() {
      this.createStudentResultsMessages = [];
      try {
        const createCourseRestrictionRequestBody = toRaw(this.courseRestriction);

        // Call API and get response
        await this.createCourseRestriction(createCourseRestrictionRequestBody).then((response) => {
          this.createCourseRestrictionResponse = response;
          this.validationStep = true;
          if (this.createCourseRestrictionResponse.hasPersisted) {
            this.loadCourseRestrictions();
            this.clearForm();
          }
        });
      } catch (error) {
        console.error("Error creating course restriction form:", error);
      }
    },
  },
};
</script>
