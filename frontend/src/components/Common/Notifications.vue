<template>
  <v-snackbar v-model:visible="isVisible" :timeout="timeout" top right>
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      message: '',
      timeout: 6000, // Default timeout for the snackbar
    };
  },
  methods: {
    show(message, timeout = this.timeout) {
      this.message = message;
      this.timeout = timeout;
      this.isVisible = true;
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>