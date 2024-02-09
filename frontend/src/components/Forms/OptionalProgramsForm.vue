<!-- CreateProgramModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="NewOptionalProgram"> </v-btn>
    </template>

    <v-card>
      <v-card-title> Add Optional Program </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <!-- Program Name Input -->
          <v-text-field
            v-model="programName"
            label="Program Name"
            required
          ></v-text-field>

          <!-- Other form fields go here -->

          <!-- Submit Button -->
          <v-btn type="submit" color="primary">Submit</v-btn>
        </v-form>
      </v-card-text>
      <template v-slot:actions>
        <v-row justify="end">
          <!-- Use v-btn with @click to close the dialog -->
          <v-btn @click="closeCreateProgramModal" color="secondary"
            >Close</v-btn
          >
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      programName: "",
      // Add other data properties as needed
    };
  },
  methods: {
    openCreateProgramModal() {
      this.dialog = true;
    },
    closeCreateProgramModal() {
      this.dialog = false;
    },
    submitForm() {
      // Perform validation if needed
      // Then submit the form to the endpoint
      const data = {
        programName: this.programName,
        // Add other form fields as needed
      };

      // Assuming you have an endpoint to handle program creation
      axios
        .post("/api/create-program", data)
        .then((response) => {
          console.log("Program created successfully:", response.data);
          // Close the modal or perform other actions
          this.dialog = false;
        })
        .catch((error) => {
          console.error("Error creating program:", error);
          // Handle error, show error message, etc.
        });
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
