<template>
  <div>
    <p>Digitized signatures used on students' certificates and transcript.</p>
    <DisplayTable
      title="Report Types"
      v-bind:items="digitalSignatures"
      v-bind:fields="digitalSignaturesFields"
      showFilter="true"
      id="signatureId"
    >         
    <template #cell(signatureContent)="row">
            <b-card header="" class="overflow-hidden">
                  <b-row no-gutters>
                    <b-col md="6">
                      <b-card-img :src="'data:image/png;base64, ' + row.item.signatureContent"></b-card-img>         
                    </b-col>
                  </b-row>
                </b-card>
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
  name: 'DigitalSignatures',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
      GraduationCommonService.getDigitalSignatures(this.token)
      .then((response) => {
      
        this.digitalSignatures = response.data;
      })
      // eslint-disable-next-line
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
      digitalSignatures: [],
      digitalSignaturesFields: [
        {
          key: "signatureContent",
          label: "Signature",
          sortable: true,
        },
        {
          key: "gradReportSignatureCode",
          label: "Code",
          sortable: true,
        },   
        {
          key: "gradReportSignatureName",
          label: "Signature Name",
          sortable: true,
        },
        {
          key: "districtName",
          label: "District Name",
          sortable: true,
        },
        {
          key: "updatedTimestamp",
          label: "Last Updated",
          sortable: true,
        },                 
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
