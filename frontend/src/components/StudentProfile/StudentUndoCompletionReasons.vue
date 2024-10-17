<template>
  <div>
    <p v-if="studentUngradReasons.length === 0">
      Student has no undo completion reasons to show
    </p>
    <v-data-table
      :items="studentUngradReasons"
      :headers="[
        {
          key: 'createDate',
          title: 'Undo Completion Date',
          class: 'px-0 py-2 w-15',
        },
        {
          key: 'undoCompletionReasonCode',
          title: 'Code',
          class: 'px-0 py-2 w-10',
        },
        {
          key: 'undoCompletionReasonDescription',
          title: 'Reason',
          class: 'px-0 py-2 w-80',
        },
        {
          key: 'createUser',
          title: 'User',
          class: 'px-0 py-2 w-80',
        },
      ]"
    >
    </v-data-table>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { mapState } from "pinia";
import { isProgramComplete } from "@/utils/common.js";
export default {
  name: "StudentOptionalPrograms",
  components: {},

  computed: {
    ...mapState(useStudentStore, {
      studentUngradReasons: "getStudentUngradReasons",
    }),
  },
  data: function () {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.table th,
.table td {
  border-top: none !important;
}

.table th svg {
  display: none !important;
}

.highlight {
  background: aliceblue !important;
}
.card-header {
  font-weight: 700 !important;
}
.gradReqsMet span + span::before {
  content: ", ";
}
</style>
