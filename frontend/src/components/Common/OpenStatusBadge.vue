<template>
  <v-chip
    v-if="getSchoolOpenStatus == 'Open'"
    color="success"
    variant="flat"
    :density="compact ? 'compact' : 'default'"
    >Open</v-chip
  >
  <v-chip
    v-else-if="getSchoolOpenStatus == 'Closed'"
    color="error"
    variant="flat"
    :density="compact ? 'compact' : 'default'"
    >Closed</v-chip
  >
  <v-chip
    v-else-if="getSchoolOpenStatus == 'Opening'"
    color="primary"
    variant="flat"
    :density="compact ? 'compact' : 'default'"
    >Opening</v-chip
  >
  <v-chip
    v-else-if="getSchoolOpenStatus == 'Closing'"
    color="warning"
    variant="flat"
    :density="compact ? 'compact' : 'default'"
    >Closing</v-chip
  >
</template>

<script>
import sharedMethods from "@/sharedMethods.js";

export default {
  props: {
    // school: Object,
    openedDateString: String,
    closedDateString: String,
    compact: { type: Boolean, default: true },
  },
  computed: {
    getSchoolOpenStatus() {
      //return sharedMethods.getSchoolOpenStatus(this.school);
      return sharedMethods.getSchoolOpenStatus(
        this.openedDateString,
        this.closedDateString
      );
    },
  },
};
</script>
