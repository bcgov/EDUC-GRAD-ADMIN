<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert v-if="$slots.inputWarning" type="info" class="pb-2">
          <slot name="inputWarning"></slot>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: {},

  validations() {
    return {};
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  methods: {},
  props: {},

  computed: {},
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
