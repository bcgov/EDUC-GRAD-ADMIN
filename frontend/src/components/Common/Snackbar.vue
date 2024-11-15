<template>
  <v-snackbar
    v-model="snackbarStore.isVisible"
    :timeout="snackbarStore.timeout"
    :color="snackbarStore.color"
    location="top right"
    multi-line
  >
    <h3>{{ snackbarStore.title }}</h3>
    <p>{{ snackbarStore.message }}</p>
    <template v-slot:actions>
      <v-icon class="mx-3" color="white" text @click="close">mdi-close</v-icon>
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
