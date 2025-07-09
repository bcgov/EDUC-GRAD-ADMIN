<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="700px">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn
            v-if="hasPermissions('STUDENT', 'courseUpdate')"
            v-bind="props"
            color="success"
            icon="mdi-pencil"
            density="compact"
            variant="text"
          />
        </slot>
      </template>

      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Edit Student Courses</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              variant="outlined"
              color="error"
              class="mt-2"
              @click="close"
            />
          </v-row>
          <v-card-subtitle>{{ studentPenAndName }}</v-card-subtitle>
        </v-card-title>

        <v-card-text>
          <CourseDetailsInput
            v-for="(course, index) in selectedCoursesToUpdate"
            :key="course.id"
            :course="course"
            update
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            class="text-none"
            density="default"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="bcGovBlue"
            variant="flat"
            class="text-none"
            density="default"
            @click="confirmUpdate"
          >
            Save Student Course(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
  name: "StudentCoursesUpdateForm",
  components: { CourseDetailsInput },
  props: {
    selectedCoursesToUpdate: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState(useStudentStore, {
      studentPenAndName: "formattedStudentName",
    }),
  },
  setup(props) {
    const dialog = ref(false);
    const studentStore = useStudentStore();

    const close = () => {
      dialog.value = false;
    };

    const confirmUpdate = async () => {
      try {
        await studentStore.updateStudentCourses(props.selectedCoursesToUpdate);
        close();
      } catch (error) {
        console.error("Failed to update student courses:", error);
      }
    };

    const hasPermissions = (module, permission) => {
      return true; // Replace with actual permission check
    };

    return {
      dialog,
      close,
      confirmUpdate,
      hasPermissions,
      v$: useVuelidate(),
    };
  },
};
</script>
