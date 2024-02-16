<template>
  <v-container>
    <v-row>
      <v-col>
        {{ getBatchRequest }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isProxy, toRaw } from "vue";
import SchoolService from "@/services/SchoolService.js";
import { useVuelidate } from "@vuelidate/core";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { mapActions, mapState } from "pinia";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: {},
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {};
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "setSchools",
      "setGradDateFrom",
      "setGradDateTo",
    ]),
  },
  props: {},

  computed: {
    ...mapState(useBatchProcessingStore, ["getSchools", "getBatchRequest"]),
    isEmpty() {
      return this.students.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
