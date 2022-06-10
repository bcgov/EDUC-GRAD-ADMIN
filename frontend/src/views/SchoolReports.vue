<template>
  <div class="reports-view">
    <h1>School Reports</h1>

    <b-card no-body>
      <b-tabs card>
        <b-tab title="Search" active>
          <b-card-text>
            <b-container class="p-3">
              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <label class="col-6 p-0">Mincode</label>
                </b-col>
              </b-row>

              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <!-- TODO: wildcard div here -->
                  <b-input class="col-6" v-model="mincode" v-on:keyup="keyHandler" placeholder="" id="mincode" />
                </b-col>
              </b-row>

              <b-row class="p-3">
                <b-col align-self="baseline">
                  <div class="row">                                
                    <div class="advanced-search-button">
                      <button v-on:click="schoolReportSearch" v-if="!searchLoading" class="btn btn-primary" tabindex="6">Search</button>
                      <button class="btn btn-success" v-if="searchLoading">Search </button>
                      <button @click="clearInput" class="btn btn-outline-primary mx-2">Reset</button>    
                      <b-spinner v-if="searchLoading" label="Loading">Loading</b-spinner>            
                    </div>   
                  </div>
                </b-col>
              </b-row>
              <div v-if="reports">
                <div v-if="totalResults > 0 && !searchLoading" class="row">
                  <div class="search-results-message my-3 col-12 col-md-8"><strong>{{ totalResults }}</strong> report{{ totalResults === 1 ? '' : 's'}} found.</div>
                </div>
                <div v-if="searchMessage" class="row">
                  <div class="search-results-message my-2 col-12 col-md-8"><strong>{{ searchMessage }}</strong></div>
                </div>  
              </div>
            </b-container>

            <DisplayTable title="Results" v-bind:items="reports" v-bind:fields="reportFields" sortKey="report" id="mincode" v-bind:showFileter=true pagination="true">schoolReportSearch
              <template #cell(report)="row">
                <a
                  @click="downloadPDF(row.item.report,'application/pdf')"
                  href="#"
                  class="pdf-link float-left mt-2"
                  >
                  {{row.item.reportTypeLabel}} (PDF)
                </a>
              </template>

              <template #cell(updateDate)="row">
                {{ row.item.updateDate | formatSimpleDate }}
              </template>
            </DisplayTable>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import DisplayTable from '@/components/DisplayTable.vue';
  import GraduationCommonService from '@/services/GraduationCommonService.js';
  import sharedMethods from '../sharedMethods';
  import { mapGetters } from "vuex";

  export default {
    name: "SchoolReports",
    components: {
      DisplayTable: DisplayTable,
    },
    data() {
      return {
        url: null,
        file: [],
        mincode: "",
        totalResults: "",
        searchMessage: "",
        searchLoading: false,
        reports: {},
        reportFields: [
          {
            key: 'report',
            label: 'Report',
            sortable: true,
            sortDirection: 'asc'
          },
          {
            key: 'reportTypeCode',
            label: 'Report Type Code',
            sortable: true,
            sortDirection: 'asc'
          },
          {
            key: 'schoolOfRecord',
            label: 'School Code',
            sortable: true,
            sortDirection: 'asc'
          },
          {
            key: 'updateUser',
            label: 'Last Update User',
            sortable: true,
            sortDirection: 'asc'
          },
          {
            key: 'updateDate',
            label: 'Last Update Date',
            sortable: true,
            sortDirection: 'asc'
          },
        ],
        groupOptions: [
          { text: "Schools", value: "schools"},
          { text: "Students", value: "students"},
        ],
      }
    },
    computed: {
      ...mapGetters({
        token: "auth/getToken"
      }),
    },
    created() {
      this.showNotification = sharedMethods.showNotification
    },
    methods: {
      keyHandler: function (e){
        if (e.keyCode === 13) {
          //enter key pressed
          this.schoolReportSearch();
        }
      },
      schoolReportSearch() {
        //reset results
        this.totalResults= "";
        this.searchMessage= "";
        //let isEmpty = true;

        if(!this.mincode) {
          this.totalResults = "";
          this.searchLoading = false;
          this.searchMessage = "Enter a school mincode to view reports."
        } else {
          GraduationCommonService.getAllReportsForSchool(this.mincode, this.token)
          .then(
            (response) => {
              this.reports = response.data;
              this.searchLoading = false;
              this.totalResults = this.reports.length;
              if(this.reports.length === 0) {
                this.searchMessage = "No reports found for this school";
              }
            }
          ).catch((error) => {
            this.searchLoading = false;
            this.searchMessage = "No reports found for this school";
            this.showNotification("danger", "There was an error with the web service." + error.response);
          });
        }
      },
      clearInput: function () {
        this.reports = "";
        this.mincode = "";
      },
      downloadPDF: function (data, mimeType) {
        sharedMethods.base64ToPdfAndOpenWindow(data,mimeType)
      },
    },
  }
</script>

<style scoped>

</style>
