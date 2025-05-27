<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ props }">
        <!-- Let parent override with their own button via activator slot -->
        <slot name="activator" v-bind="props">
          <!-- Default internal buttons if no external activator slot is provided -->
          <v-btn
            v-if="
              hasPermissions('STUDENT', 'courseUpdate') && courseBatchDelete
            "
            v-bind="props"
            :disabled="courseIds.length === 0"
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
          Delete Student Course<span v-if="courseIds.length > 1">s</span>
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

          Are you sure you want to delete the following course ID<span
            v-if="courseIds.length > 1"
            >s</span
          >?
          <ul class="pl-4">
            <li v-for="id in courseIds" :key="id">
              <strong>{{ id }}</strong>
            </li>
          </ul>
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
            Delete Course<span v-if="courseIds.length > 1">s</span>
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
    courseIds: {
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
        await studentStore.deleteStudentCourses(props.courseIds);
        close();
      } catch (error) {
        console.error("Failed to delete student courses:", error);
      }
    };

    const hasPermissions = (module, permission) => {
      return true; // Replace with actual logic
    };

    const anyUsedForGraduation = computed(() =>
      props.courseIds.some((id) => studentStore.isCourseUsedForGraduation?.(id))
    );

    const anyHasExamRecord = computed(() =>
      props.courseIds.some((id) => studentStore.hasAssociatedExam?.(id))
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
