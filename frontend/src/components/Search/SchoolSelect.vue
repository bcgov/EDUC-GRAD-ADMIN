<template>
  <v-autocomplete
      data-cy="school-autocomplete"
      v-model="internalValue"
      :disabled="disabled"
      :label="label"
      :items="items"
      :item-title="itemTitle"
      item-value="schoolId"
      variant="outlined"
      density="compact"
      class="form__input"
  >

    <template #label="slotProps">
      {{ slotProps.label }}
    </template>

    <template #append-inner>
      <OpenStatusBadge
          v-if="internalValue"
          :compact="false"
          :openedDateString="currentSchool?.openedDate"
          :closedDateString="currentSchool?.closedDate"
      />
    </template>

    <template #item="{ props, item }">
      <v-list-item v-bind="props" :key="item.value">
        <template #append>
          <OpenStatusBadge
              :openedDateString="item.raw.openedDate"
              :closedDateString="item.raw.closedDate"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { computed } from 'vue';
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  label: {
    type: String,
    default: 'Select a school',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: true, // getSchoolsList
  },
  itemTitle: {
    type: [String, Function],
    default: 'schoolName', // or whatever your field is
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// derive current school from items rather than calling a service
const currentSchool = computed(() =>
    props.items.find((s) => s.schoolId === props.modelValue)
);
</script>
