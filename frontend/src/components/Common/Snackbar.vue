<template>
  <v-snackbar
    v-model="isVisible"
    :timeout="timeout"
    :color="color"
    location="top right"
  >
    {{ message }}
    <template v-slot:action>
      <v-btn color="white" text @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "success",
  },
  timeout: {
    type: Number,
    default: 5000,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isVisible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue;
  }
);

const close = () => {
  isVisible.value = false;
  emit("update:modelValue", false);
};
</script>

<style scoped>
/* Add any custom styling if needed */
</style>
