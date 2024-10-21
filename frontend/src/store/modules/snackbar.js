import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSnackbarStore = defineStore('snackbar', () => {
  const isVisible = ref(false);
  const message = ref('');
  const color = ref('success');
  const timeout = ref(50000);

  const showSnackbar = (msg, col = 'success', time = 50000) => {
    console.log(msg)
    message.value = msg;
    color.value = col;
    timeout.value = time;
    isVisible.value = true;

    setTimeout(() => {
      isVisible.value = false;
    }, timeout.value);
  };

  return { isVisible, message, color, timeout, showSnackbar };
});