<template>
  <div v-if="school">
    <v-btn
      variant="text"
      @click="schoolDialog = !schoolDialog"
      class="text-left px-0 text-none"
      >{{ school?.displayNameNoSpecialChars ?? school.displayName }}<br />{{
        school.mincode
      }}</v-btn
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
            {{ school?.displayNameNoSpecialChars ?? school.displayName }}
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
            >{{
              getInstituteCategoryByCode(school.schoolCategoryCode)?.legacyCode
            }}&nbsp;{{ school.schoolCategoryCode }}
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
    school: {
      type: Object,
      required: true,
    },
    title: String,
  },
  computed: {
    ...mapState(useAppStore, {
      getDistrictById: "getDistrictById",
      getInstituteCategoryByCode: "getInstituteCategoryByCode",
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

<style></style>
