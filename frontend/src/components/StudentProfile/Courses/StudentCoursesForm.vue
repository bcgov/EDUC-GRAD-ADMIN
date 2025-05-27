<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-if="hasPermissions('STUDENT', 'courseUpdate')" color="bcGovBlue" prepend-icon="mdi-plus"
        class="text-none" @click="openCreateStudentCoursesDialog()" text="Add Student Courses" />
    </template>

    <v-card title="Add Student Courses">
      <v-stepper alt-labels show-actions v-model=step>
        <template v-slot:default>
          <v-stepper-header>
            <v-stepper-item title="Select Courses" value="1"></v-stepper-item>
            <v-stepper-item title="Enter Details" value="2"></v-stepper-item>
            <v-stepper-item title="Confirmation" value="3"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item value="1">
              TODO: Add fields to get course list and table to manage built list (similar to batch processing add
              student,
              school, district, etc.)
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              TODO: Add repeating form for each course
            </v-stepper-window-item>
            <v-stepper-window-item value="3">
              TODO: Add confirmation and error vs success response
            </v-stepper-window-item>
          </v-stepper-window>
        </template>
      </v-stepper>
      <v-card-actions>
        <v-btn v-if="step == 0" @click="closeCreateStudentCourseDialog()" color="error" variant="outlined"
          class="text-none">Cancel</v-btn>
        <v-btn v-else @click="step--" color="bcGovBlue" variant="outlined" :disabled="disableBackButton()">Back</v-btn>
        <v-spacer />
        <v-btn v-if="step < 2" @click="step++" color="bcGovBlue" variant="outlined">Next</v-btn>
        <v-btn v-else @click="submitForm()" color="error" variant="flat" class="text-none">Add Student Courses</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import { useAccessStore } from "@/store/modules/access";
import { mapState } from "pinia";

export default {
  data() {
    return {
      dialog: false,
      step: 0,
    }
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
  methods: {
    openCreateStudentCoursesDialog() {
      this.step = 0,
        this.clearForm();
      this.dialog = true;
    },
    closeCreateStudentCourseDialog() {
      this.dialog = false;
    },
    clearForm() {
      console.log("TODO: Implement clearForm(0)")
    },
    submitForm() {
      console.log("TODO: Implement form submission")
    },
    // helpers for button states
    disableBackButton() {
      //TODO: add logic to disable back button AFTER user submits courses to API
      return false;
    },
  }
}
</script>
