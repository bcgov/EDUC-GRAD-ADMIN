<template>
  <div v-if="school">
    <span
      variant="text"
      v-ripple
      @click="schoolDialog = !schoolDialog"
      class="span-btn text-left px-0 d-block"
      >{{ school.displayName }}<br />{{ school.mincode }}</span
    >
    <v-dialog v-model="schoolDialog" max-width="600px">
      <v-card :title="title">
        <!-- <pre>{{ school }}</pre> -->
        <v-card-text>
          <div class="my-1">
            <strong>District </strong
            >{{ getDistrictById(school.districtId)?.districtNumber }} -
            {{ getDistrictById(school.districtId)?.displayName }}
          </div>
          <div class="my-1">
            <strong>School Code and Name </strong>{{ school.mincode }} -
            {{ school.displayName }}
          </div>
          <div class="my-1">
            <strong>Open Date </strong
            >{{ $filters.formatSimpleDate(school.openedDate) }}
          </div>
          <div class="my-1">
            <strong>Close Date </strong
            >{{ $filters.formatSimpleDate(school.closedDate) }}
          </div>
          <div class="my-1">
            <strong>School Category </strong
            >{{ displaySchoolCategoryCode(school.schoolCategoryCode) }}
          </div>
          <div class="my-1">
            <strong>Issue Transcripts </strong
            >{{ formatFlag(school.canIssueTranscripts) }}
          </div>
          <div class="my-1">
            <strong>Issue Certificates </strong
            >{{ formatFlag(school.canIssueCertificates) }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { formatFlag } from "@/utils/common.js";

export default {
  props: {
    school: Object,
    title: String,
  },
  computed: {
    ...mapState(useAppStore, {
      getDistrictById: "getDistrictById",
      displaySchoolCategoryCode: "displaySchoolCategoryCode",
    }),
  },
  methods: {
    formatFlag(flag) {
      return formatFlag(flag);
    },
  },
  data() {
    return {
      schoolDialog: false,
    };
  },
};
</script>

<style scoped>
.span-btn {
  font-size: 0.875rem;
}
.span-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
