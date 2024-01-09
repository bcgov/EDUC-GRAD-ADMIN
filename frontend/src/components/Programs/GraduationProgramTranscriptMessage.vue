<template>
  <div id="transcript-message">
    <DisplayTable
      v-bind:items="transcriptMessages"
      title="Transcript Message"
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
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";

export default {
  name: "GraduationProgramTranscriptMessage",
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
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
          label: "Program Code",
          sortable: true,
          editable: true,
        },
        {
          key: "messageTypeCode",
          label: "Message Type Code",
          sortable: true,
          editable: true,
        },
        {
          key: "gradMainMessage",
          label: "Main Message",
          sortable: true,
          editable: true,
        },
        {
          key: "gradDateMessage",
          label: "Date Message",
          sortable: true,
          editable: true,
        },
        {
          key: "graduationSchool",
          label: "Graduation School",
          sortable: true,
          editable: true,
        },
        {
          key: "honourNote",
          label: "Honour Note",
          sortable: true,
          editable: true,
        },
        {
          key: "adIBProgramMessage",
          label: "AD and IB Program Message",
          sortable: true,
          editable: true,
        },
        {
          key: "frenchImmersionMessage",
          label: "French Immersion Message",
          sortable: true,
          editable: true,
        },
        {
          key: "careerProgramMessage",
          label: "Career Program Message",
          sortable: true,
          editable: true,
        },
        {
          key: "gradProjectedMessage",
          label: "Grad Projected Message",
          sortable: true,
          editable: true,
        },
        {
          key: "honourProjectedNote",
          label: "Honour Projected Note",
          sortable: true,
          editable: true,
        },
      ],
    };
  },
  created() {
    ProgramManagementService.getTranscriptMessage()
      .then((response) => {
        this.transcriptMessages = response.data;
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.log("There was an error:", error.response);
      });
  },
};
</script>
