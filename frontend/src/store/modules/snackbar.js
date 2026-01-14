import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const isVisible = ref(false);
  const message = ref("");
  const color = ref("success");
  const timeout = ref(5000);
  const title = ref("");

  const showSnackbar = (msg = "", col = "success", time = 7500, ti = "") => {
    // Clear any existing timeout logic before setting a new one
    // (This part is often handled implicitly by the Vue component, but good to check)

    message.value = msg;
    color.value = col;
    timeout.value = time;
    title.value = ti;
    isVisible.value = true;

    // Auto-hide logic
    setTimeout(() => {
      isVisible.value = false;
    }, timeout.value);
  };

  // --- NEW: Dedicated function for 403/Error messages ---
  const showError = (msg, ti = "Access Denied") => {
    // We use a longer timeout for important error messages
    showSnackbar(msg, "error", 10000, ti);
  };
  // --------------------------------------------------------

  return { isVisible, message, color, timeout, showSnackbar, title, showError }; // <-- Expose showError
});
