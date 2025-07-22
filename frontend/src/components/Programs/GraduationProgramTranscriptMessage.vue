<template>
  <div id="transcript-message">
    <h3 class="ml-3 mt-5">Transcript Messaging</h3>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      v-bind:items="transcriptMessages"
      v-bind:fields="transcriptMessageFields"
      id="transcriptMessage"
      :slots="templates"
      showFilter="true"
      pagnation="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import CodesService from "@/services/CodesService.js";
import DisplayTable from "../DisplayTable.vue";

export default {
  name: "GraduationProgramTranscriptMessage",
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      isLoading: true,
      transcriptMessages: [],
      templates: [
        {
          name: "transcriptMessage",
          field: "transcriptMessage",
        },
      ],
      transcriptMessageFields: [
        {
          key: "programCode",
          title: "Program Code",
          sortable: true,
          editable: true,
        },
        {
          key: "messageTypeCode",
          title: "Message Type Code",
          sortable: true,
          editable: true,
        },
        {
          key: "gradMainMessage",
          title: "Main Message",
          sortable: true,
          editable: true,
        },
        {
          key: "gradDateMessage",
          title: "Date Message",
          sortable: true,
          editable: true,
        },
        {
          key: "graduationSchool",
          title: "Graduation School",
          sortable: true,
          editable: true,
        },
        {
          key: "honourNote",
          title: "Honour Note",
          sortable: true,
          editable: true,
        },
        {
          key: "adIBProgramMessage",
          title: "AD and IB Program Message",
          sortable: true,
          editable: true,
        },
        {
          key: "frenchImmersionMessage",
          title: "French Immersion Message",
          sortable: true,
          editable: true,
        },
        {
          key: "careerProgramMessage",
          title: "Career Program Message",
          sortable: true,
          editable: true,
        },
        {
          key: "gradProjectedMessage",
          title: "Grad Projected Message",
          sortable: true,
          editable: true,
        },
        {
          key: "honourProjectedNote",
          title: "Honour Projected Note",
          sortable: true,
          editable: true,
        },
      ],
    };
  },
  created() {
    CodesService.getTranscriptMessageCodes()
      .then((response) => {
        this.transcriptMessages = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.log("There was an error:", error.response);
      });
  },
};
</script>
