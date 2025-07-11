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
        <v-btn v-if="step < 1" @click="nextStep" color="bcGovBlue" variant="outlined"
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
import { useSnackbarStore } from "@/store/modules/snackbar";

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
      snackbarStore: useSnackbarStore(),
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
        hasPersisted: null        
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
    nextStep() {
    this.createCourseRestrictionResponse = this.getDefaultCourseRestrictionResponse()
    this.validationStep = false;
    this.step++; 
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
          this.validationStep = true;
          if (response?.hasPersisted) {
            this.loadCourseRestrictions();
            this.snackbarStore.showSnackbar("Course Restriction added", "success", 10000);
          } else {
            this.snackbarStore.showSnackbar("Failed to add Course Restriction", "error", 10000);
          }
          this.closeCreateCoursRestrictionsDialog();
        });
      } catch (error) {
        console.error("Error creating course restriction form:", error);
        this.snackbarStore.showSnackbar("Failed to add Course Restriction", "error", 5000);
      }
    },
  },
};
</script>
