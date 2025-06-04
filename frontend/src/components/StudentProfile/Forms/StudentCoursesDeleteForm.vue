<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ props }">
        <!-- Let parent override with their own button via activator slot -->
        <slot name="activator" v-bind="props">
          <!-- Default internal buttons if no external activator slot is provided -->
          <v-btn
            v-if="
              hasPermissions('STUDENT', 'courseUpdate') && courseBatchDelete
            "
            v-bind="props"
            :disabled="selectedCoursesToDelete.length === 0"
            color="error"
            class="text-none"
            prepend-icon="mdi-delete-forever"
          >
            Delete Selected Courses
          </v-btn>

          <v-btn
            v-else-if="hasPermissions('STUDENT', 'courseUpdate')"
            v-bind="props"
            color="error"
            icon="mdi-delete-forever"
            density="compact"
            variant="text"
          />
        </slot>
      </template>

      <v-card>
        <template v-slot:title>
          <v-row no-gutters>
            <div class="v-card-title">Delete Student Course</div>
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
        </template>

        <v-card-text>
          <v-alert
            v-if="anyUsedForGraduation"
            type="info"
            variant="tonal"
            border="start"
            class="mt-6 mb-0 ml-1 py-3 width-fit-content"
          >
            One or more of these courses have been used to meet a graduation
            requirement.
          </v-alert>

          <v-alert
            v-if="anyHasExamRecord"
            type="info"
            variant="tonal"
            border="start"
            class="mt-6 mb-0 ml-1 py-3 width-fit-content"
          >
            One or more of these courses have an associated exam record.
          </v-alert>

          <v-alert
            v-if="selectedCoursesToDelete.length > 0"
            type="warning"
            border="left"
            prominent
            class="pl-4"
          >
            You are about to remove the following courses from student:
            {{ studentId }}
            <ul>
              <li v-for="course in selectedCoursesToDelete" :key="course.id">
                <strong
                  >{{ course.courseID }} {{ course.courseName }}
                  {{ course.courseLevel }} {{ course.courseSession }}</strong
                >
              </li>
            </ul>
          </v-alert>
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
            color="error"
            variant="flat"
            class="text-none"
            density="default"
            @click="confirmDelete"
          >
            Delete Course<span v-if="selectedCoursesToDelete.length > 1"></span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStudentStore } from "@/store/modules/student";

export default {
  name: "StudentCoursesDeleteForm",
  props: {
    selectedCoursesToDelete: {
      type: Array,
      required: true,
    },
    courseBatchDelete: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const dialog = ref(false);
    const studentStore = useStudentStore();

    const close = () => {
      dialog.value = false;
    };

    const confirmDelete = async () => {
      try {
        const request = props.selectedCoursesToDelete.map((item) => item.id);
        await studentStore.deleteStudentCourses(request);
        close();
      } catch (error) {
        console.error("Failed to delete student courses:", error);
      }
    };

    const hasPermissions = (module, permission) => {
      return true; // Replace with actual logic
    };

    const anyUsedForGraduation = computed(() =>
      props.selectedCoursesToDelete.some((id) =>
        studentStore.isCourseUsedForGraduation?.(id)
      )
    );

    const anyHasExamRecord = computed(() =>
      props.selectedCoursesToDelete.some((id) =>
        studentStore.hasAssociatedExam?.(id)
      )
    );

    return {
      dialog,
      close,
      confirmDelete,
      hasPermissions,
      anyUsedForGraduation,
      anyHasExamRecord,
    };
  },
};
</script>
