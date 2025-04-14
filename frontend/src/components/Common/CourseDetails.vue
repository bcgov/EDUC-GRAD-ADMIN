<template>
  <div v-if="course.courseTitle">
    <span
      variant="text"
      v-ripple
      @click="courseDialog = !courseDialog"
      class="span-btn text-left px-0 d-block"
    >
      {{ course }}
    </span>
    <v-dialog v-model="courseDialog" max-width="600px">
      <v-card :title="dialogTitle">
        <v-card-text>
          <div class="my-1">
            <strong>Instruction Language: </strong>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
    title: String,
  },
  computed: {},
  methods: {
    dialogTitle() {
      if (!!this.title) {
        return this.title;
      } else {
        return this.course.courseTitle;
      }
    },
  },
  data() {
    return {
      courseDialog: false,
    };
  },
};
</script>
