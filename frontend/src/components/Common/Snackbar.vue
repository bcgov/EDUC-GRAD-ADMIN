<template>
  <v-snackbar
    v-model="snackbarStore.isVisible"
    :timeout="snackbarStore.timeout"
    :color="snackbarStore.color"
    location="top right"
    vertical
  >
    {{ snackbarStore.message }}

    <!-- Action slot for Close Button -->
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
.v-overlay__content .v-snackbar__wrapper {
  position: absolute !important;
  top: 0 !important;
}
</style>
