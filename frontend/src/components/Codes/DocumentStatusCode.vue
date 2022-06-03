<template>
  <div>
    <p>A student's Transcript, Student Achievement Report (TVR) and Certificate(s) will show a status as the student progresses through the system.  The list of document statuses are maintained in this table.  Documents will show In Progress until the student graduates, once a student graduates and the final documents are created, the documents will show a status of Completed. If, and only if, the student has completed the SCCP program and the User moves the SCCP student to a graduation program will the students existing documents get Archived.</p>
    <DisplayTable
        title="Program Certificate Transcripts"
        v-bind:items="documentStatusCodes"
        v-bind:fields="documentStatusCodesFields"
        id="code"
        showFilter="true"
    >
        <template #cell(effectiveDate)="row">
        {{ row.item.effectiveDate | formatSimpleDate }}
        </template>
        <template #cell(expiryDate)="row">
        {{ row.item.expiryDate | formatSimpleDate }}
        </template>
    </DisplayTable>
  </div>
</template>

<script>

import {
  mapGetters
} from "vuex";

import DisplayTable from "@/components/DisplayTable";
import GraduationCommonService from "@/services/GraduationCommonService.js";

export default {
  name: 'DocumentStatusCode',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationCommonService.getDocumentStatusCodes(this.token)
    .then((response) => {
      this.documentStatusCodes = response.data;
    })
    .catch((error) => {
      this.$bvToast.toast("ERROR " + error.response.statusText, {
        title: "ERROR" + error.response.status,
        variant: "danger",
        noAutoHide: true,
      });
    });
  },
  data: function() {
    return {
      documentStatusCodes: [],
      documentStatusCodesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15"
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        }
      ],
    };
  },
  computed: {
    ...mapGetters({  
      token: "auth/getToken",
      role: "getRoles"
    }),
  },
  methods: {
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
