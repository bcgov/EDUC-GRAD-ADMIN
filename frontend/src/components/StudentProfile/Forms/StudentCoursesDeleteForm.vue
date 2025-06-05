<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('STUDENT', 'courseUpdate')"
          v-bind="props"
          color="error"
          icon="mdi-delete-forever"
          density="compact"
          variant="text"
        />
      </template>

      <v-card>
        <template v-slot:title>Delete Student Course</template>

        <v-card-text>
          Are you sure you want to delete course ID
          <strong>{{ itemId }}</strong
          >?
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
            Delete Course
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStudentStore } from "@/store/modules/student"; // adjust path as needed

export default {
  name: "StudentCoursesDeleteForm",
  props: {
    itemId: {
      type: [String, Number],
      required: true,
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
        await studentStore.deleteStudentCourses([props.itemId]);
        close();
        // Optional: trigger toast/snackbar
      } catch (error) {
        console.error("Failed to delete student course:", error);
        // Optional: show error snackbar/toast
      }
    };

    const hasPermissions = (module, permission) => {
      // Replace with real permission check
      return true;
    };

    return {
      dialog,
      close,
      confirmDelete,
      hasPermissions,
    };
  },
};
</script>
