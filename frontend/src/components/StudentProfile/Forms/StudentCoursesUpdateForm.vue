<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1260px">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-if="hasPermissions('STUDENT', 'courseUpdate')" @click="openDialog" v-bind="props" color="success"
            icon="mdi-pencil" density="compact" variant="text" />
        </slot>
      </template>

      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Edit Student Courses</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="close" />
          </v-row>
          <v-card-subtitle>{{ studentPenAndName }}</v-card-subtitle>
        </v-card-title>

        <v-card-text>
          <CourseDetailsInput :course="selectedCourseToUpdate" update>
          </CourseDetailsInput>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="bcGovBlue" variant="flat" class="text-none" density="default" @click="confirmUpdate">
            Save Student Course(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
  name: "StudentCoursesUpdateForm",
  components: { CourseDetailsInput },

  props: {
    course: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      selectedCourseToUpdate: {}
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentPenAndName: "formattedStudentName",
      studentStore() {
        return useStudentStore();
      },
    }),
  },

  methods: {
    openDialog() {
      this.dialog = true;
      this.selectedCourseToUpdate = JSON.parse(JSON.stringify(this.course));
    },
    close() {
      this.dialog = false;
    },

    async confirmUpdate() {

      try {
        delete this.selectedCourseToUpdate.courseDetails
        delete this.selectedCourseToUpdate.createUser
        delete this.selectedCourseToUpdate.createDate
        delete this.selectedCourseToUpdate.updateDate
        delete this.selectedCourseToUpdate.updateUser
        delete this.selectedCourseToUpdate.courseExam
        delete this.selectedCourseToUpdate.customizedCourseName
        delete this.selectedCourseToUpdate.equivOrChallenge
        delete this.selectedCourseToUpdate.fineArtsAppliedSkills
        delete this.selectedCourseToUpdate.customizedCourseName
        delete this.selectedCourseToUpdate.relatedCourseDetails
        delete this.selectedCourseToUpdate.relatedCourseId
        delete this.selectedCourseToUpdate.interimPercent
        delete this.selectedCourseToUpdate.interimLetterGrade
        delete this.selectedCourseToUpdate.equivalencyOrChallenge

        delete this.selectedCourseToUpdate.credits


        await this.studentStore.updateStudentCourse(this.selectedCourseToUpdate);
        this.close();
      } catch (error) {
        console.error("Failed to update student courses:", error);
      }
    },

    hasPermissions(module, permission) {
      return true; // Replace with actual logic
    },
  },

  validations() {
    return {
      selectedCourseToUpdate: {
        // example rule: at least one field required
        courseCode: { required: helpers.withMessage('Course code is required', required) },
        // Add more validations depending on the course object structure
      },
    };
  },

};
</script>