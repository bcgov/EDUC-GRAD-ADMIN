import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const isVisible = ref(false);
  const message = ref("");
  const color = ref("success");
  const timeout = ref(5000);
  const title = ref("");

  const showSnackbar = (msg = "", col = "success", time = 7500, ti = "") => {
    message.value = msg;
    color.value = col;
    timeout.value = time;
    isVisible.value = true;
    title.value = ti;
    setTimeout(() => {
      isVisible.value = false;
    }, timeout.value);
  };

  return { isVisible, message, color, timeout, showSnackbar, title };
});
