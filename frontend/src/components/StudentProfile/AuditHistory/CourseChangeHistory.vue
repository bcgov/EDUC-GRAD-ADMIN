<template>
  <v-data-table
      :sortBy="sortBy"
      :items="courseHistory"
      :headers="courseHeaders"
      :items-per-page="'-1'"
      item-value="id"
  >
    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <th>
            <div class="d-flex align-center">
              <span
                  class="me-2 cursor-pointer"
                  @click="toggleSort(column)"
                  v-text="column.title"
                  :title="column.description"
              ></span>
              <v-icon
                  v-if="isSorted(column)"
                  :icon="getSortIcon(column)"
                  color="medium-emphasis"
              ></v-icon>
            </div>
          </th>
        </template>
      </tr>
    </template>
    <template v-slot:expanded-row="{ item }">
      <tr>
        <td :colspan="courseHeaders.length">
          <v-row dense>
            <v-col
                v-for="field in courseExamFields"
                :key="field.key"
                class="text-center"
                :title="field.description"
            >
              <div class="text-caption font-weight-bold">{{ field.label }}</div>
              <div class="text-body-2">{{ item.courseExam[field.key] ?? '' }}</div>
            </v-col>
          </v-row>
        </td>
      </tr>
    </template>
    <template
        v-slot:item.data-table-expand="{
                item,
                internalItem,
                toggleExpand,
                isExpanded,
              }"
    >
      <td v-if="!!item.courseExam">
        <v-btn
            variant="text"
            density="comfortable"
            size="small"
            @click="toggleExpand(internalItem)"
            class="v-data-table__expand-icon"
            :class="{ 'v-data-table__expand-icon--active': isExpanded }"
            :icon="
                    isExpanded(internalItem)
                      ? 'mdi-chevron-down'
                      : 'mdi-chevron-right'
                  "
        >
        </v-btn>
      </td>
    </template>
    <template v-slot:item.activityCode="{ item }">
      <i>{{ item.activityCode }}</i> -
      {{ item.activityDescription }}
    </template>
    <template v-slot:item.updateDate="{ item }">
      {{ $filters.formatTime(item.updateDate) }}
    </template>
  </v-data-table>
</template>

<script>

import {mapActions, mapState} from "pinia";
import {useStudentStore} from "@/store/modules/student";

export default {
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentId: "getStudentId",
      courseHistory: "getStudentCourseAuditHistory"
    }),
  },
  data: function () {
    return {
      courseChangeHistory: [],
      courseHeaders: [
        { key: "data-table-expand", title: "" },
        { key: "updateDate", title: "Date", width: "115px" },
        { key: "activityCode", title: "Change" },
        { key: "updateUser", title: "Update User", sortable: true },
        { key: "courseDetails.courseCode", title: "Code" },
        { key: "courseDetails.courseLevel", title: "Level" },
        { key: "courseSession", title: "Session" },
        { key: "interimPercent", title: "%", description: "Interim Percent" },
        { key: "interimLetterGrade", title: "LG", description: "Interim Letter Grade" },
        { key: "finalPercent", title: "%", description: "Final Percent" },
        { key: "finalLetterGrade", title: "LG", description: "Final Letter Grade" },
        { key: "credits", title: "Credits" },
        { key: "equivOrChallenge", title: "EC", description: "Equivalent or Challenge" },
        { key: "fineArtsAppliedSkills", title: "AS", description: "Fine Arts or Applied Skills" },
        { key: "customizedCourseName", title: "Custom Course Title" },
        {
          key: "relatedCourseDetails.courseCode",
          title: "Related Course",
          value: (item) => {
            const code = item.relatedCourseDetails?.courseCode ?? "";
            const level = item.relatedCourseDetails?.courseLevel ?? "";
            return code && level ? `${code} ${level}` : code || level || "";
          }
        }
      ],
      courseExamFields: [
        { label: "School %", key: "schoolPercentage", description: "School Percentage" },
        { label: "Best School %", key: "bestSchoolPercentage", description: "Best School Percentage" },
        { label: "Best Exam %", key: "bestExamPercentage" , description: "Best Exam Percentage"},
        { label: "Exam %", key: "examPercentage", description: "Exam Percentage" },
        { label: "To Write?", key: "toWriteFlag", description: "Will Write Exam" },
        { label: "Wrote?", key: "wroteFlag", description: "Wrote Exam" },
        { label: "Special Case", key: "specialCase" },
      ],
      sortBy: [{ key: "updateDate", order: "desc" }],
    }
  },
  created() {
    this.loadStudentCourseHistory(this.studentId);
  },
  methods: {
    ...mapActions(useStudentStore, [
      "loadStudentCourseHistory",
    ]),
  }
}
</script>