<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1024">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-bind="props" color="success" icon="mdi-pencil" density="compact" variant="text" />
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
import { ref, computed } from "vue";
import CourseRestrictionsDetailsInput from "@/components/Courses/Forms/FormInputs/CourseRestrictionsDetailsInput.vue";
import { useAccessStore } from "@/store/modules/access";
import { useCourseStore } from "@/store/modules/course.js";
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
    const courseStore = useCourseStore();
    const hasPermissions = (module, permission) => {
      return true; // Replace with actual permission check
    };

    return {
      dialog,
      hasPermissions,
    };
  },
  data() {
    return {
      selectedCourseRestriction: {
        mainCourse: {},
        restrictedCourse: {},
        restrictionStartDate: "",
        restrictionEndDate: "",
      },
    };
  },
  watch: {
    selectedCourseRestrictionToUpdate: {
      immediate: true,
      handler(newVal) {
        this.updateSelectedCourseRestriction(newVal);
      },
    },
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useCourseStore, {
      courseRestrictionToSave: (state) => state.courseRestrictionToSave,
      courseRestriction: (state) => state.courseRestriction,
    })
  },
  methods: {
    ...mapActions(useCourseStore, [
      "clearCourseRestriction",
      "updateCourseRestriction",
      "getCourseRestrictions"
    ]),
    async submitForm() {
      this.updateCourseRestrictionMessages = [];
      const updateCourseRestrictionRequestBody = toRaw(this.selectedCourseRestriction);
      try {
        // Call API and get response
        await this.updateCourseRestriction(updateCourseRestrictionRequestBody).then((response) => {
          this.createCourseRestrictionResponse = response;
          if (this.createCourseRestrictionResponse.hasPersisted) {
            this.getCourseRestrictions();
          }
        });
      } catch (error) {
        console.error("Error creating course restriction form:", error);
      }
      this.close();
    },
    close() {
      this.dialog = false;
      this.clearCourseRestriction();
      this.updateSelectedCourseRestriction(this.selectedCourseRestrictionToUpdate);
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
