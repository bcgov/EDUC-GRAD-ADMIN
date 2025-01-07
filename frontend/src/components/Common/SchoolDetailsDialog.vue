<template>
  <div v-if="school">
    <v-btn
      variant="text"
      @click="schoolDialog = !schoolDialog"
      class="text-left px-0"
      >{{ school.displayName }}<br />{{ school.mincode }}</v-btn
    >
    <v-dialog v-model="schoolDialog" max-width="600px">
      <v-card :title="title">
        <!-- <pre>{{ school }}</pre> -->
        <v-card-text>
          <div>
            <strong>District </strong
            >{{ getDistrictById(school.districtId)?.districtNumber }} -
            {{ getDistrictById(school.districtId)?.displayName }}
          </div>
          <div>
            <strong>School Code and Name </strong>{{ school.mincode }} -
            {{ school.displayName }}
          </div>
          <div>
            <strong>Open Date </strong
            >{{ $filters.formatSimpleDate(school.openedDate) }}
          </div>
          <div>
            <strong>Close Date </strong
            >{{ $filters.formatSimpleDate(school.closedDate) }}
          </div>
          <div>
            <strong>Can Issue Transcripts? </strong
            >{{ school.canIssueTranscripts }}
          </div>
          <div>
            <strong>Can Issue Certificates? </strong
            >{{ school.canIssueCertificates }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";

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
    }),
  },
  data() {
    return {
      schoolDialog: false,
      title: "School Details",
    };
  },
  created() {
    if (this.props?.title) {
      this.title = this.props?.title;
    }
  },
  setup(props) {
    //console.log(props);
  },
};
</script>

<style></style>
