<template>
  <v-autocomplete
      :model-value="modelValue"
      :label="label"
      :items="getSchoolsList"
      :item-title="schoolTitle"
      item-value="schoolId"
      clearable
      :rules="rules"
      @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:label="label">
      {{ label.label }}
    </template>

    <template v-slot:append-inner>
      <OpenStatusBadge
          :compact="false"
          :openedDateString="selectedSchool?.openedDate"
          :closedDateString="selectedSchool?.closedDate"
      />
    </template>

    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" :key="item.value">
        <template v-slot:append>
          <OpenStatusBadge
              :openedDateString="item.raw.openedDate"
              :closedDateString="item.raw.closedDate"
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import OpenStatusBadge from '@/components/Common/OpenStatusBadge.vue'

export default {
  name: 'SchoolDropdown',
  components: { OpenStatusBadge },
  props: {
    modelValue: [String, Number],
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: 'getSchoolsList'
    }),
    schoolTitle() {
      return (item) => {
        if (item) {
          return `${item.mincode} - ${item.displayName}`
        } else {
          return null
        }
      }
    },
    selectedSchool() {
      return this.getSchoolsList.find(school => school.schoolId === this.modelValue)
    },
    rules() {
      if (this.required) {
        return [v => !!v || 'Required']
      }
      return []
    }
  }
}
</script>