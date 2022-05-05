<template>
  <div class="psi-view">
    <h1>Post Secondary Institutions</h1>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Post Secondary Institutions" active>
          <form v-on:submit.prevent>
            <div class="advanced-search-form">
              <div class="row my-3">
                <div class="advanced-search-field col-12 col-md-2">
                  <label>PSI Code</label>
                  <div
                    href="#"
                    v-on:click="advancedSearchInput.psiCode.contains = !advancedSearchInput.psiCode.contains"
                    v-bind:class="{active: advancedSearchInput.psiCode.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="PSI code starts with"
                  >
                    [.*]
                  </div>
                  <b-input
                    class="form__input"
                    v-model="advancedSearchInput.psiCode.value"
                    placeholder=""
                    tabindex="1"
                  />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label>PSI Name</label>
                  <div
                    href="#"
                    v-on:click="advancedSearchInput.psiName.contains = !advancedSearchInput.psiName.contains"
                    v-bind:class="{active: advancedSearchInput.psiName.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="PSI name starts with"
                  >
                    [.*]
                  </div>
                  <b-input
                    class="form__input"
                    v-model="advancedSearchInput.psiName.value"
                    placeholder=""
                    tabindex="2"
                  />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label>CSL Code</label>
                  <div
                    href="#"
                    v-on:click="advancedSearchInput.cslCode.contains = !advancedSearchInput.cslCode.contains"
                    v-bind:class="{active: advancedSearchInput.cslCode.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="CSL code starts with"
                  >
                    [.*]
                  </div>
                  <b-input
                    class="form__input"
                    v-model="advancedSearchInput.cslCode.value"
                    placeholder=""
                    tabindex="3"
                  />
                </div>
                <div class="advanced-search-field col-12 col-md-1">
                  <label>Open Flag</label>
                  <b-form-select v-model="advancedSearchInput.openFlag.value" :options="options"  tabindex="4"></b-form-select>
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label>Transmission Mode</label>
                  <div
                    href="#"
                    v-on:click="advancedSearchInput.transmissionMode.contains = !advancedSearchInput.transmissionMode.contains"
                    v-bind:class="{active: advancedSearchInput.transmissionMode.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="Transmission mode starts with"
                  >
                    [.*]
                  </div>
                  <b-input
                    class="form__input"
                    v-model="advancedSearchInput.transmissionMode.value"
                    placeholder=""
                    tabindex="5"
                  />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label>Psi Grouping</label>
                  <div
                    href="#"
                    v-on:click="advancedSearchInput.psiGrouping.contains = !advancedSearchInput.psiGrouping.contains"
                    v-bind:class="{active: advancedSearchInput.psiGrouping.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="Psi Grouping mode starts with"
                  >
                    [.*]
                  </div>
                  <b-input
                    class="form__input"
                    v-model="advancedSearchInput.psiGrouping.value"
                    placeholder=""
                    tabindex="6"
                  />
                </div>
              </div>
              <div class="row">
                <div class="advanced-search-button">
                  <button
                    v-on:click="advancePSISearch"
                    v-if="!advancedSearchLoading"
                    class="btn btn-primary"
                    tabindex="6"
                  >
                    Search
                  </button>
                  <button
                    class="btn btn-success"
                    v-if="advancedSearchLoading"
                    tabindex="6"
                  >
                    Search
                  </button>
                  <button
                    @click="clearInput"
                    class="btn btn-outline-primary mx-2"
                  >
                    Reset
                  </button>
                  <b-spinner v-if="advancedSearchLoading" label="Loading"
                    >Loading</b-spinner
                  >
                </div>
              </div>

              <div v-if="psiResults">
                <div v-if="totalResults > 0" class="row">
                  <div class="search-results-message my-3 col-12 col-md-8">
                    <strong>{{ totalResults }}</strong> PSIs found.
                  </div>
                </div>
                <div v-if="advancedSearchMessage" class="row">
                  <div class="search-results-message my-5 col-12 col-md-8">
                    <strong>{{ advancedSearchMessage }}</strong>
                  </div>
                </div>
              </div>
              
            </div>
          </form>
          <b-card-text>
            <DisplayTable
              :items="psiResults"
              :fields="psiFields"
              :showFilter="true"
              :pagination="true"
              title="PSI"
            >
              <template #cell(more)="row">
                <b-btn
                  variant="outline primary"
                  style="color: #666"
                  size="sm"
                  @click="row.toggleDetails"
                  class="more-button"
                >
                  <img v-show="!row.detailsShowing" src="../assets/images/icon-right.svg" width="9px" aria-hidden="true" alt=""/>
                  <img v-show="row.detailsShowing" src="../assets/images/icon-down.svg" height="5px" aria-hidden="true" alt=""/>
                </b-btn>
              </template>
              <template #row-details="row">
                <b-card class="px-0">
                  <ul>
                    <li v-if="row.item.address1">
                      <strong>Address:</strong> {{ row.item.address1 }}
                    </li>
                    <li v-if="row.item.city">
                      <strong>City:</strong> {{ row.item.city }}
                    </li>
                    <li v-if="row.item.provinceCode">
                      <strong>Province Code:</strong>
                      {{ row.item.provinceCode }}
                    </li>
                    <li v-if="row.item.provinceName">
                      <strong>Province Name:</strong>
                      {{ row.item.provinceName }}
                    </li>
                    <li v-if="row.item.countryCode">
                      <strong>Country Code:</strong> {{ row.item.countryCode }}
                    </li>
                    <li v-if="row.item.postal">
                      <strong>Postal Code:</strong> {{ row.item.postal }}
                    </li>
                    <li v-if="row.item.phone1">
                      <strong>Phone:</strong> {{ row.item.phone }}
                    </li>
                    <li v-if="row.item.fax">
                      <strong>Fax:</strong> {{ row.item.fax }}
                    </li>
                  </ul>
                </b-card>
              </template>
            </DisplayTable>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import TRAXService from "@/services/TRAXService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import { mapGetters } from "vuex";
import sharedMethods from '../sharedMethods'
export default {
  name: "psi",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      advancedSearchLoading: false,
      advancedSearchMessage:"",
      totalResults: "",
      params: {},
      psi: {},
      options: [
          { value: 'Y', text: 'Y' },
          { value: 'N', text: 'N' },
      ],
      psiResults: [],
      psiFields: [
        { key: "more", label: "",  sortable: true, },
        {
          key: 'psiCode',
          label: 'PSI Code',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'psiName',
          label: 'PSI Name',
          sortable: true,
        },
        {
          key: 'cslCode',
          label: 'Csl Code',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'openFlag',
          label: 'Open Flag',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'transmissionMode',
          label: 'Transmission Mode',
          sortable: true,
        },
        {
          key: 'psiGrouping',
          label: 'Psi Grouping',
          sortable: true,
        },
      ],
      advancedSearchInput: {
        psiCode: {
          value: "",
          contains: false,
        },
        psiName: {
          value: "",
          contains: false,
        },
        cslCode: {
          value: "",
          contains: false,       
        },
        openFlag: {
          value: "",
          contains: false,       
        },
        transmissionMode: {
          value: "",
          contains: false        
        },
        psiGrouping: {
          value: "",
          contains: false        
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      token: "getToken",
    }),
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
  },
  methods: {
    clearInput: function () {
      this.penInput = "";
      this.psiResults = "";
      for (var key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
      for (var reqKey in this.requirementsSearchInput) {
        if (this.requirementsSearchInput.hasOwnProperty(reqKey)) {
          this.requirementsSearchInput[reqKey].value = "";
          this.requirementsSearchInput[reqKey].contains = false;
        }
      }
    },
    getAllPSI: function () {
      TRAXService.getPSI(this.token)
      .then((res) => {
        this.psi = res.data;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(
          "There was an error adding psi information:" + error.response
        );
      });
    },
    advancePSISearch() {
      this.totalResults = "";
      this.advancedSearchMessage = "";
      this.advancedSearchLoading = true;
      this.params = new URLSearchParams();
      this.psiResults = [];
      let isEmpty = true;
      for (var key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          //console.log(obj[key])
          if (this.advancedSearchInput[key].value != "") {
            isEmpty = false;   
          }
        } 
      }
      if(isEmpty){
        this.totalResults = ""
        this.advancedSearchLoading = false;
        this.advancedSearchMessage += "Enter at least one field to search."
      }else if(!isEmpty){
        try {
          if(this.advancedSearchInput){
            if(this.advancedSearchInput.psiCode.value != ""){
              if(this.advancedSearchInput.psiCode.contains && !this.advancedSearchInput.psiCode.value.includes("*")) {            
                this.params.append('psiCode', this.advancedSearchInput.psiCode.value + "*");  
              }else{
                this.params.append('psiCode', this.advancedSearchInput.psiCode.value);
              }                 
            }
            if(this.advancedSearchInput.psiName.value != ""){
              if(this.advancedSearchInput.psiName.contains && !this.advancedSearchInput.psiName.value.includes("*")) {            
                this.params.append('psiName', this.advancedSearchInput.psiName.value + "*");  
              }else{
                this.params.append('psiName', this.advancedSearchInput.psiName.value);
              }                
            }
            if(this.advancedSearchInput.cslCode.value != ""){
              if(this.advancedSearchInput.cslCode.contains && !this.advancedSearchInput.cslCode.value.includes("*")) {            
                this.params.append('cslCode', this.advancedSearchInput.cslCode.value + "*");  
              }else{
                this.params.append('cslCode', this.advancedSearchInput.cslCode.value);
              }   
            }
            if(this.advancedSearchInput.openFlag.value != ""){             
                this.params.append('openFlag', this.advancedSearchInput.openFlag.value);   
            }      
            if(this.advancedSearchInput.transmissionMode.value != ""){
              if(this.advancedSearchInput.transmissionMode.contains && !this.advancedSearchInput.transmissionMode.value.includes("*")) {            
                this.params.append('transmissionMode', this.advancedSearchInput.transmissionMode.value + "*");  
              }else{
                this.params.append('transmissionMode', this.advancedSearchInput.transmissionMode.value);
              }   
            } 
            if(this.advancedSearchInput.psiGrouping.value != ""){
              if(this.advancedSearchInput.psiGrouping.contains && !this.advancedSearchInput.psiGrouping.value.includes("*")) {            
                this.params.append('psiGrouping', this.advancedSearchInput.psiGrouping.value + "*");  
              }else{
                this.params.append('psiGrouping', this.advancedSearchInput.psiGrouping.value);
              }   
            }             
          }//if this.advanceSearchInput
          TRAXService.getPSIByAdvanceSearch(this.params,this.token)
            .then((response) => {
              this.advancedSearchLoading = false;
              this.psiResults = response.data;
              this.totalResults = this.psiResults.length;
              if(this.totalResults <= 0){
                this.advancedSearchMessage = "No PSIs found.";      
              }
            })   
            .catch((error) => {
              this.advancedSearchLoading = false;
              this.advancedSearchMessage = "No PSIs found.";
              // eslint-disable-next-line
              console.log('There was an error:' + error);
              this.showNotification("danger", "There was an error with the web service.");
          });//TRAXService
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Search Error" + error;
          this.showNotification("danger", "There was an error with the web service.");
        }   
      }   
    },
  },
};
</script>

<style scoped>
.psi-view{
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}

.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
.table-filter{
  top: 0px !important
}
.advanced-search-form {
  background-color: #fff;
}
.wild-card-button:hover{
  cursor: pointer;
}
.wild-card-button {
  color: #DEE2EB;
  position: absolute;
  right: 21px;
  top: 40px;
  z-index: 10;
  text-decoration: none;
}

.wild-card-button:visited {
  color: #DEE2EB;
  text-decoration: none;
}

.wild-card-button.active {
  color: green
}
.search-results-message {
  float: left;
  clear: both; 
}
.advanced-search-button {
  
  padding-left: 15px;
}
</style>