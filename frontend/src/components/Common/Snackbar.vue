<template>
  <v-snackbar
    v-model="snackbarStore.isVisible"
    :timeout="snackbarStore.timeout"
    :color="snackbarStore.color"
    location="top right"
  >
    {{ snackbarStore.message }}
    <template v-slot:action>
      <v-btn color="white" text @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useSnackbarStore } from "../../store/modules/snackbar";

// Using the snackbar store
const snackbarStore = useSnackbarStore();

// Close function to hide the snackbar
const close = () => {
  snackbarStore.isVisible = false;
};
</script>

<style scoped>
/* Add any custom styling if needed */
</style>
