<template>
  <div>
    <p v-if="studentUngradReasons.length === 0">
      Student has no undo completion reasons to show
    </p>
    <v-data-table
      :items="studentUngradReasons"
      :headers="undoCompletionReasonsHeaders"
    >
      <template v-slot:item.createDate="{ item }">
        {{ $filters.formatTime(item.createDate) }}
      </template>
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
    return {
      undoCompletionReasonsHeaders: [
        {
          key: "createDate",
          title: "Undo Completion Date",
        },
        {
          key: "undoCompletionReasonCode",
          title: "Code",
        },
        {
          key: "undoCompletionReasonDescription",
          title: "Reason",
        },
        {
          key: "createUser",
          title: "User",
        },
      ],
    };
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
