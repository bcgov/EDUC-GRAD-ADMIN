<template>
  <div>    
    <v-dialog v-model="dialog" persistent max-width="1024">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-bind="props" color="success" icon="mdi-pencil" density="compact" variant="text" 
          @click="openUpdateCoursRestrictionsDialog()" :disabled="!hasPermissions('COURSE', 'restrictionUpdate')"/>
        </slot>
      </template>

      <v-card>
        <template v-slot:title>
          <v-row no-gutters>
            <div class="v-card-title">Edit Course Restriction</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="close" />
          </v-row>
        </template>
        <v-card-text>
          <CourseRestrictionsDetailsInput :courseRestriction="selectedCourseRestriction" update />
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="bcGovBlue" variant="flat" class="text-none" density="default" @click="submitForm"
            :disabled="selectedCourseRestriction.hasValidationError">
            Save Course Restriction
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import CourseRestrictionsDetailsInput from "@/components/Courses/Forms/FormInputs/CourseRestrictionsDetailsInput.vue";
import { useAccessStore } from "@/store/modules/access";
import { useCourseStore } from "@/store/modules/course.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { toRaw } from "vue";
export default {
  name: "CourseRestrictionsUpdateForm",
  components: { CourseRestrictionsDetailsInput },
  props: {
    selectedCourseRestrictionToUpdate: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const dialog = ref(false);
    return {
      dialog,
    };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useCourseStore, {
      selectedCourseRestriction: (state) => state.courseRestrictionToSave,
    })
  },
  methods: {
    ...mapActions(useCourseStore, [
      "clearCourseRestriction",
      "updateCourseRestriction",
      "loadCourseRestrictions"
    ]),
    openUpdateCoursRestrictionsDialog() {
      this.dialog = true;
      this.updateSelectedCourseRestriction(this.selectedCourseRestrictionToUpdate);
    },
    async submitForm() {
      this.updateCourseRestrictionMessages = [];
      const updateCourseRestrictionRequestBody = toRaw(this.selectedCourseRestriction);
      try {
        // Call API and get response
        await this.updateCourseRestriction(updateCourseRestrictionRequestBody).then((response) => {
          if (response?.hasPersisted) {
              this.loadCourseRestrictions();
              this.snackbarStore.showSnackbar("Course Restriction Updated", "success", 10000);
          } else {
              this.snackbarStore.showSnackbar("Failed to update Course Restriction", "error", 10000);
          }
        });
      } catch (error) {
        console.error("Error updating course restriction form:", error);
        this.snackbarStore.showSnackbar("Failed to update Course Restriction", "error", 10000);        
      }
      this.close();
    },
    close() {
      this.dialog = false;
      this.clearCourseRestriction();
    },
    updateSelectedCourseRestriction(courseRestrictionToUpdate) {
        this.selectedCourseRestriction.courseRestrictionId = courseRestrictionToUpdate.courseRestrictionId,
        this.selectedCourseRestriction.restrictionStartDate = courseRestrictionToUpdate.restrictionStartDate ? courseRestrictionToUpdate.restrictionStartDate.replace("/", "-") : null,
        this.selectedCourseRestriction.restrictionEndDate = courseRestrictionToUpdate.restrictionEndDate ? courseRestrictionToUpdate.restrictionEndDate.replace("/", "-") : null,
        this.selectedCourseRestriction.mainCourse = { "courseCode": courseRestrictionToUpdate.mainCourse, "courseLevel": courseRestrictionToUpdate.mainCourseLevel, "courseID": courseRestrictionToUpdate.mainCourseID },
        this.selectedCourseRestriction.restrictedCourse = { "courseCode": courseRestrictionToUpdate.restrictedCourse, "courseLevel": courseRestrictionToUpdate.restrictedCourseLevel, "courseID": courseRestrictionToUpdate.restrictedCourseID };
      },    
  },
};
</script>
