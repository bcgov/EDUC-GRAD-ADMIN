<template>
  <div class="schools-view">
    <h1>Schools</h1>
    
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Search" active>
          <b-card-text>
            <b-container class="p-3">
              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <label class="col-6 p-0">Mincode</label>
                </b-col>
                <b-col>
                    <label class="col-6 p-0">School name</label>
                </b-col>
                
              </b-row>
              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <div href="#"
                    v-on:click="search.mincode.contains = !search.mincode.contains"
                    v-bind:class="{active: search.mincode.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover title="Mincode contains"
                  >
                    [.*]
                    </div>
                  <b-input v-model="search.mincode.value" v-on:keyup="keyHandler" placeholder="" id="mincode"/>
                  
                </b-col>
                <b-col>
                  <div href="#"
                    v-on:click="search.schoolName.contains = !search.schoolName.contains"
                    v-bind:class="{active: search.schoolName.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover title="School name contains"
                  >
                    [.*]
                  </div>
                  <b-input v-model="search.schoolName.value" v-on:keyup="keyHandler" placeholder="" id="schoolName"/>
                </b-col>
              </b-row>
              <b-row class="p-3">
                <b-col align-self="baseline">
                  <div class="row">                                
                    <div class="advanced-search-button">
                      <button v-on:click="advancedSchoolSearch" v-if="!searchLoading" class="btn btn-primary" tabindex="6">Search</button>
                      <button class="btn btn-success" v-if="searchLoading">Search </button>
                      <button @click="clearInput" class="btn btn-outline-primary mx-2">Reset</button>    
                      <b-spinner v-if="searchLoading" label="Loading">Loading</b-spinner>            
                    </div>   
                  </div>
                </b-col>
              </b-row>
              <div v-if="schools">
                <div v-if="totalResults > 0 && !searchLoading" class="row">
                  <div class="search-results-message my-3 col-12 col-md-8"><strong>{{ totalResults }}</strong> school record(s) found.</div>
                </div>   
                <div v-if="searchMessage" class="row">
                  <div class="search-results-message my-2 col-12 col-md-8"><strong>{{ searchMessage }}</strong></div>
                </div>  
              </div>
              
            </b-container> 

            <DisplayTable title="Results" v-bind:items="schools"
              v-bind:fields="schoolFields" sortKey="schoolName" id="mincode" v-bind:showFilter=true pagination="true"
            >advancedSchoolSearch
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
                  <b-card class="px-0 col-12">
                    <div class="col-12 col-md-5 float-left p-0">
                      <b-card header="School Details" class="overflow-hidden">
                        <b-card-text>
                          <ul class="float-left">        
                            <li v-if="row.item.address1">
                              <strong>Address:</strong> {{ row.item.address1 }}
                            </li>
                            <li v-if="row.item.city">
                              <strong>City:</strong> {{ row.item.city }}
                            </li>                
                            <li v-if="row.item.provinceCode">
                              <strong>Province Code:</strong> {{ row.item.provCode }}
                            </li>                      
                            <li v-if="row.item.provinceName">
                              <strong>Province Name:</strong> {{ row.item.provinceName}}
                            </li>
                            <li v-if="row.item.countryCode">
                              <strong>Country Code:</strong> {{ row.item.countryCode }}
                            </li>
                            <li v-if="row.item.countryName">
                              <strong>Country Name:</strong> {{ row.item.provinceName}}
                            </li>
                            <li v-if="row.item.postal">
                              <strong>Postal Code:</strong> {{ row.item.postal }}
                            </li>
                            <li v-if="row.item.schoolEmail">
                              <strong>Email:</strong> {{ row.item.schoolEmail }}
                            </li>
                            
                            <li v-if="row.item.ministryContact">
                              <strong>Ministry Contact:</strong> {{ row.item.ministryContact }}
                            </li>
                            <li v-if="row.item.schoolPhone">
                              <strong>Phone:</strong> {{ row.item.schoolPhone }}
                            </li>
                            <li v-if="row.item.schoolFax">
                              <strong>Fax:</strong> {{ row.item.schoolFax }}
                            </li>
                          </ul>
                        </b-card-text>
                      </b-card>
                    </div>
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
import SchoolService from '@/services/SchoolService.js';
import DisplayTable from '@/components/DisplayTable.vue';
import sharedMethods from '../sharedMethods';
  export default {
    name: "schools",
    components: {
      DisplayTable: DisplayTable,
    },
    data() {
      return {    
        url: null,
        file: [],
        schools: {},
        schoolFields: [
          {
            key: 'more',
            label: ''        
          },
          {
            key: 'minCode',
            label: 'Mincode',
            sortable: true,
            sortDirection: 'asc'
          },
          {
            key: 'schoolName',
            label: 'School Name',
            sortable: true,
            //sortDirection: 'desc'
          },
          {
            key: 'districtName',
            label: 'District',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'openFlag',
            label: 'Open',
            sortable: true,
            class: 'text-center'
          },
          {
            key: '',
            label: 'Schl Org',
            sortable: true,
            class: 'text-center'
          },
          {
            key: '',
            label: 'Indep Type',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'independentAffiliation',
            label: 'Indep Affil',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'transcriptEligibility',
            label: 'Tran Elig',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'certificateEligibility',
            label: 'Cert Elig',
            sortable: true,
            class: 'text-center'
          },
          {
            key: '',
            label: 'Marks Display',
            sortable: true,
            class: 'text-center'
          },
          {
            key: '',
            label: 'Append Trans',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'signatureDistrict',
            label: 'Sig Distno',
            sortable: true,
            class: 'text-center'
          },
          {
            key: '',
            label: 'New School Code',
            sortable: true,
            class: 'text-center'
          },
        ],
        totalResults: "",
        searchMessage: "",
        searchLoading: false,
        search: {
          schoolName:{
            value:"",
            contains:false
          },
          mincode:{
            value:"",
            contains:false
          }
        },
      }
    },
    created() {
      this.showNotification = sharedMethods.showNotification
    },
    methods: {
      keyHandler: function (e) {
        if (e.keyCode === 13) {
          //enter key pressed
          this.advancedSchoolSearch();
        }
      },
      onFileChange(e) {
        const file = e.target.files[0];
        this.url = URL.createObjectURL(file);
      },
      advancedSchoolSearch(){
        this.totalResults = "";
        this.searchMessage = "";
        let isEmpty = true;
        for (var key in this.search) {
          if (this.search.hasOwnProperty(key)) {
            if (this.search[key].value != "") {
              isEmpty = false;   
            }
          } //mincode
        }
        if(isEmpty){
          this.totalResults = ""
          this.searchLoading = false;
          this.searchMessage = "Enter at least one field to search."
        }else if(!isEmpty){
          this.searchLoading = true;
          this.schools = {};
          SchoolService.searchSchools(this.search).then((res) => {
            this.schools = res.data;
            this.searchLoading = false;
            this.totalResults = this.schools.length;
            if(this.schools.length == 0){
              this.searchMessage = "School cannnot be found.";
            }
          }).catch((error) => {
            this.searchLoading = false;
            this.searchMessage = "School cannnot be found.";
            this.showNotification("danger", "There was an error with the web service." + error.response);
          });  
        }
      },
      clearInput: function () {
        this.schools = "";
        for (var key in this.search) {
          if (this.search.hasOwnProperty(key)) {
            this.search[key].value = "";
            this.search[key].contains = false;
          }
        }
      },
    }
  };
</script>

<style scoped>
  .schools-view{
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
  .wild-card-button:hover{
    cursor: pointer;

  }
  .wild-card-button {
    color: #DEE2EB;
    position: absolute;
    right: 21px;
    top: 10px;
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
</style>