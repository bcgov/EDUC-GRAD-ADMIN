<template>
  <div class="requirements-met-and-not-met">
    <div class="requirements-not-met mb-2">
      <v-card title="Noncompletion Reasons" class="w-100">
        <v-card-text
          v-if="
            studentGradStatus.studentGradData &&
            Object.keys(studentGradStatus.studentGradData).length > 0
          "
        >
          <div v-if="!nongradReasons || !nongradReasons.length">
            <div class="p-3">All program requirements have been met</div>
          </div>
          <div v-else>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Rule</th>
                  <th class="text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in nongradReasons" :key="item.rule">
                  <td>{{ item.rule }}</td>
                  <td>{{ item.description }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="requirements-met pb-2">
      <v-card
        title="Requirements Met"
        v-if="
          studentGradStatus.studentGradData &&
          Object.keys(studentGradStatus.studentGradData).length > 0
        "
        no-body
        class="w-100"
      >
        <v-card-text class="">
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Rule</th>
                <th class="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in requirementsMet" :key="item.rule">
                <td>{{ item.rule }}</td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStudentStore } from "../../../store/modules/student";
export default {
  name: "NoncompletionReasons",
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentGradStatus: "getStudentGradStatus",
      requirementsMet: "getRequirementsMet",
      nongradReasons: "getNongradReasons",
    }),
  },
  methods: {},
};
</script>

<style scoped>
:deep(ul.requirements-met),
:deep(ul.non-grad-reasons) {
  list-style: none;
}
:deep(ul.requirements-met) li,
:deep(ul.non-grad-reasons) li {
  border-bottom: 1px solid #ccc;
}
:deep(.card-body) {
  border-bottom: 1px solid #ccc;
}
:deep(.card) {
  margin-bottom: 10px;
}

:deep(.card-header) {
  font-weight: 700;
}
</style>
