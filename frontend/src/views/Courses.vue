<template>
  <div class="courses-all">
    <h1>Courses</h1>
    <div>
      <b-card no-body>
        <b-tabs card>     
          <b-tab title="Course" active>
            <form v-on:submit.prevent>
              <div class="advanced-search-form">
              <div class="row my-3">
                <div class="advanced-search-field col-12 col-md-2">
                  <label >TRAX Code</label>
                  <div href="#"
                    v-on:click="advancedSearchInput.courseCode.contains = !advancedSearchInput.courseCode.contains"
                    v-bind:class="{active: advancedSearchInput.courseCode.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover title="Course code starts with"
                  >
                    [.*]
                  </div>
                  <b-input id="trax-code-input" class="form__input" v-model="advancedSearchInput.courseCode.value" placeholder=""
                    tabindex="1" />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label >Grade Level</label>
                   <div href="#"
                    v-on:click="advancedSearchInput.courseLevel.contains = !advancedSearchInput.courseLevel.contains"
                    v-bind:class="{active: advancedSearchInput.courseLevel.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover title="Course level starts with"
                    >
                    [.*]
                  </div>
                  <b-input id="grade-level-input" class="form__input" v-model="advancedSearchInput.courseLevel.value" placeholder=""
                    tabindex="2" />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label >Course Title</label>
                  <div href="#"
                    v-on:click="advancedSearchInput.courseName.contains = !advancedSearchInput.courseName.contains"
                    v-bind:class="{active: advancedSearchInput.courseName.contains}"
                    class="wild-card-button"
                    v-b-tooltip.hover title="Course name starts with"
                  >
                    [.*]
                  </div>
                  <b-input id="course-title-input" class="form__input" v-model="advancedSearchInput.courseName.value" placeholder=""
                    tabindex="3" />
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label >Instruction Language</label>
                    <b-form-select
                      id="instruction-lang-select"
                      v-model="advancedSearchInput.language.value"
                      :options=langOptions
                    
                    ></b-form-select>
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label for="datepicker-startDate"
                    >TRAX Start Date</label
                  >
                  <b-input-group class="mb-3">
                    <b-form-input
                      id="datepicker-startDate"
                      v-model="advancedSearchInput.startDate.value"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      max="9999-12-30"
                      :date-format-options="{ year: '4-digit'}"
                      autocomplete="off"
                      tabindex="5"
                    ></b-form-input>
                  </b-input-group>     
                </div>
                <div class="advanced-search-field col-12 col-md-2">
                  <label for="datepicker-endDate"
                    >TRAX End Date</label
                  >
                  <b-input-group class="mb-3">
                    <b-form-input
                      id="datepicker-endDate"
                      v-model="advancedSearchInput.endDate.value"
                      type="date"
                      placeholder="YYYY-MM-DD"
                      max="9999-12-30"
                      :date-format-options="{ year: '4-digit'}"
                      autocomplete="off"
                      tabindex="5"
                    ></b-form-input>
                  </b-input-group>     
                </div>                
              </div>
              <div class="row">                                
                <div class="advanced-search-button">
                  <button v-on:click="advanceCourseSearch" v-if="!advancedSearchLoading" class="btn btn-primary" tabindex="6">Search</button>
                  <button  class="btn btn-success" v-if="advancedSearchLoading" tabindex="6">Search</button>
                  <button  v-on:click="clearInput('courses')" class="btn btn-outline-primary mx-2">Reset</button> <b-spinner v-if="advancedSearchLoading" label="Loading">Loading</b-spinner>               
                </div>   
              </div>

              <div v-if="courses">
                <div v-if="totalResults > 0" class="row">
                  <div class="search-results-message my-3 col-12 col-md-8"><strong>{{ totalResults }}</strong> course records found.</div>
                </div>   
                <div v-if="advancedSearchMessage" class="row">
                  <div class="search-results-message my-5 col-12 col-md-8"><strong>{{ advancedSearchMessage }}</strong></div>
                </div>    
              </div>
             
            </div>
          </form>
          <b-card-text >
            <DisplayTable title="Courses" v-bind:items="courses" v-bind:fields="courseFields" id="courseCode" :showFilter=true pagination="true"
            ></DisplayTable>
          </b-card-text>
          </b-tab>
          <b-tab title="Course restrictions">
            <b-card-text>
              <DisplayTable title="Course restrictions" v-bind:items="courseRestrictions"
                v-bind:fields="courseRestrictionFields" id="courseRestrictionId" :showFilter=true pagination="true"
               >
              </DisplayTable>
            </b-card-text>
          </b-tab>
          <b-tab title="Course requirements">
            <b-card-text>
              <form v-on:submit.prevent>
                  <div class="advanced-search-form">
                    <div class="row my-3">
                    <div class="advanced-search-field col-12 col-md-2">
                      <label >Course code</label>
                      <div href="#"
                        v-on:click="requirementsSearchInput.courseCode.contains = !requirementsSearchInput.courseCode.contains"
                        v-bind:class="{active: requirementsSearchInput.courseCode.contains}"
                        class="wild-card-button"
                        v-b-tooltip.hover title="Course code starts with"
                      >
                        [.*]
                      </div>
                      <b-input id="course-code-input" class="form__input" v-model="requirementsSearchInput.courseCode.value" placeholder=""
                        tabindex="1" />
                    </div>
                    <div class="advanced-search-field col-12 col-md-2">
                      <label >Course level</label>
                      <b-input id="course-level-input" class="form__input" v-model="requirementsSearchInput.courseLevel.value" placeholder=""
                        tabindex="2" />
                    </div>
                    <div class="advanced-search-field col-12 col-md-2">
                      <label >Rule#</label>
                      <div href="#"
                        v-on:click="requirementsSearchInput.rule.contains = !requirementsSearchInput.rule.contains"
                        v-bind:class="{active: requirementsSearchInput.rule.contains}"
                        class="wild-card-button"
                        v-b-tooltip.hover title="Rule number starts with"
                      >
                        [.*]
                      </div>
                      <b-input id="rule-number-input" class="form__input" v-model="requirementsSearchInput.rule.value" placeholder=""
                        tabindex="3" />
                    </div>               
                  </div>
                  <div class="row">                                
                    <div class="advanced-search-button">
                      <button v-on:click="courseRequirementsSearch" v-if="!courseRequirementLoading" class="btn btn-primary" tabindex="6">Search</button>
                      <button class="btn btn-success" v-if="courseRequirementLoading" tabindex="6">Search</button>
                      <button v-on:click="clearInput('requirements')" class="btn btn-outline-primary mx-2">Reset</button> <b-spinner v-if="courseRequirementLoading" label="Loading">Loading</b-spinner>               
                    </div>   
                  </div>
                  <div v-if="courseRequirements">
                    <div v-if="totalRequirementResults > 0" class="row">
                      <div class="search-results-message my-3 col-12 col-md-8"><strong>{{ totalRequirementResults }}</strong> course requirements found.</div>
                    </div>   
                    <div v-if="courseRequirementMessage" class="row">
                      <div class="search-results-message my-5 col-12 col-md-8"><strong>{{ courseRequirementMessage }}</strong></div>
                    </div> 
                  </div>
                     
                </div>
              </form>
              <DisplayTable title="Course requirements" v-bind:items="courseRequirements"
                v-bind:fields="courseRequirementFields" id="courseRestrictionId" :showFilter=true pagination="true"
              >
              </DisplayTable>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
  import sharedMethods from '../sharedMethods'
  import CourseService from '@/services/CourseService.js';
  import DisplayTable from '@/components/DisplayTable.vue';
  export default {
    name: "courses",
    components: {
      DisplayTable: DisplayTable
    },
    data() {
      return {
        advancedSearchLoading: false,
        advancedSearchMessage:"",
        courseRequirementLoading: false,
        courseRequirementMessage:"",
        courses: [],
        courseRequirements: [],
        courseRestrictions: [],
        totalResults:"",
        totalRequirementResults:"",
        advancedSearchInput: {
          courseCode:{
            value:"",
            contains:false
          },
          courseLevel:{
            value:"",
            contains:false
          },
          courseName:{
            value:"",
            contains:false
          },
          language:{
            value:"",
            contains:false
          },
          startDate:{
            value:"",
            contains:false
          },
          endDate:{
            value:"",
            contains:false
          },          
        },
        requirementsSearchInput: {
          courseCode:{
            value:"",
            contains:false
          },
          courseLevel:{
            value:"",
            contains:false
          },
          rule:{
            value:"",
            contains:false
          },
        },
        langOptions: [{ text: "EN", value: "E" },{ text: "FR", value: "F" }],
        courseFields: [     
          {
            key: 'courseCode',
            label: 'TRAX Course Code',
            sortable: true,
            sortDirection: 'desc'
          },
          {
            key: 'courseLevel',
            label: 'Grade Level',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'courseName',
            label: 'Course Title',
            sortable: true,
          },
          {
            key: 'numCredits',
            label: 'Credit Value',
            class: 'text-center',
            sortable: true,
          },
          {
            key: 'language',
            label: 'Instruction Language',
            sortable: true,
            class: 'text-center'
          },          
          {
            key: 'startDate',
            label: 'TRAX Start Date',
            sortable: true,
            sortDirection: 'desc'
          },
          {
            key: 'endDate',
            label: 'TRAX End Date',
            sortable: true,
            class: 'text-center'
          },
          {
            key: 'coRegID',
            label: 'Coreg ID',
            sortable: true,
            sortDirection: 'desc'
          },
          {
            key: 'workExpFlag',
            label: 'Work Experience',
            sortable: true,
            sortDirection: 'desc'
          },
          {
            key: 'genericCourseType',
            label: 'Generic Course Type',
            sortable: true,
            class: 'text-center'
          },

        ],
        courseRestrictionFields: [
          {
            key: 'mainCourse',
            label: 'Course Code Main',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'mainCourseLevel',
            label: 'Course Level Main',
            sortable: true,
            class: 'text-left',
            editable: true
          },          
          {
            key: 'restrictedCourse',
            label: 'Course Code Restricted',
            sortable: true,
            class: 'text-left',
            sortDirection: 'desc',
            editable: true
          },
          {
            key: 'restrictedCourseLevel',
            label: 'Course Level Restricted',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'restrictionStartDate',
            label: 'Restriction Start Date',
            sortable: true,
            class: 'text-left',
            sortDirection: 'desc',
            editable: true
          },
          {
            key: 'restrictionEndDate',
            label: 'Restriction End Date',
            sortable: true,
            class: 'text-left',
            editable: true
          }

        ],
        courseRequirementFields: [
          {
            key: 'courseCode',
            label: 'Course code',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'courseLevel',
            label: 'Course level',
            sortable: true,
            class: 'text-left',
            editable: true
          },          
          {
            key: 'courseName',
            label: 'Course name',
            sortable: true,
            class: 'text-left',
            sortDirection: 'desc',
            editable: true
          },
          {
            key: 'ruleCode',
            label: 'Rule #',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'traxReqNumber',
            label: "Transcript Req #",
            sortable: true,
            class: 'text-left',
            editable: true,
          },
          {
            key: 'requirementName',
            label: 'Requirement name',
            sortable: true,
            class: 'text-left',
            sortDirection: 'desc',
            editable: true
          },
          {
            key: 'requirementProgram',
            label: 'Requirement program',
            sortable: true,
            class: 'text-left',
            editable: true
          }
        ],
        courseCode: "",
        show: false,
        displayMessage: null,
        params:""
      };
    },
    created() {
      this.showNotification = sharedMethods.showNotification
      this.getAllCourseRestrictions();
    },
    methods: {
      clearInput: function (type) {
        this.penInput = "";
        if (type == 'requirements'){
          this.courseRequirements = "";
        } else {
          this.courses = "";
        }        
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
      advanceCourseSearch() {
        this.totalResults = ""
        this.advancedSearchMessage = "";
        this.advancedSearchLoading = true;
        this.params = new URLSearchParams();
        this.courses = [];
        let isEmpty = true;
        for (var key in this.advancedSearchInput) {
          if (this.advancedSearchInput.hasOwnProperty(key)) {
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
              if(this.advancedSearchInput.courseCode.value != ""){
                if(this.advancedSearchInput.courseCode.contains && !this.advancedSearchInput.courseCode.value.includes("*")) {            
                  this.params.append('courseCode', this.advancedSearchInput.courseCode.value + "*");  
                }else{
                  this.params.append('courseCode', this.advancedSearchInput.courseCode.value);
                }                 
              }
              if(this.advancedSearchInput.courseLevel.value != ""){
                if(this.advancedSearchInput.courseLevel.contains && !this.advancedSearchInput.courseLevel.value.includes("*")) {            
                  this.params.append('courseLevel', this.advancedSearchInput.courseLevel.value + "*");  
                }else{
                  this.params.append('courseLevel', this.advancedSearchInput.courseLevel.value);
                }                
              }
              if(this.advancedSearchInput.courseName.value != ""){
                if(this.advancedSearchInput.courseName.contains && !this.advancedSearchInput.courseName.value.includes("*")) {            
                  this.params.append('courseName', this.advancedSearchInput.courseName.value + "*");  
                }else{
                  this.params.append('courseName', this.advancedSearchInput.courseName.value);
                }   
              }
              if(this.advancedSearchInput.language.value != ""){
                if(this.advancedSearchInput.language.contains && !this.advancedSearchInput.language.value.includes("*")) {            
                  this.params.append('language', this.advancedSearchInput.language.value + "*");  
                }else{
                  this.params.append('language', this.advancedSearchInput.language.value);
                }   
              }
              if(this.advancedSearchInput.startDate.value != ""){
                this.params.append('startDate', this.advancedSearchInput.startDate.value);
              }
              if(this.advancedSearchInput.endDate.value != ""){
                this.params.append('endDate', this.advancedSearchInput.endDate.value);
              }              
            }
            CourseService.getCoursesByAdvanceSearch(this.params)
            .then((response) => {
              this.advancedSearchLoading = false;
              this.courses = response.data;
              this.totalResults = this.courses.length;
              if(this.totalResults <= 0){
                this.advancedSearchMessage = "No courses found.";      
              }
            })   
            .catch((error) => {
              this.advancedSearchLoading = false;
              if(error.response.status == 422){
                this.advancedSearchMessage = "No course record found.";
                this.showNotification("danger", "Please enter the correct search fields.");
              } else {
                this.advancedSearchMessage = "No course record found.";
                // eslint-disable-next-line
                console.log('There was an error:' + error);
                this.showNotification("danger", "There was an error with the web service.");
              }                      
            });
          } catch (error) {
            this.advancedSearchLoading = false;
            this.advancedSearchMessage = "Search Error" + error;
            this.showNotification("danger", "There was an error with the web service.");
          }   
        }   
      },
      courseRequirementsSearch() {
        this.totalRequirementResults = ""
        this.courseRequirementMessage = "";
        this.courseRequirementLoading = true;
        this.params = new URLSearchParams();
        this.courseRequirements = [];
        let isEmpty = true;
        for (var key in this.requirementsSearchInput) {
          if (this.requirementsSearchInput.hasOwnProperty(key)) {
            if (this.requirementsSearchInput[key].value != "") {
              isEmpty = false;   
            }       
          }
        }
        if(isEmpty){
          this.totalRequirementResults = ""
          this.courseRequirementLoading = false;
          this.courseRequirementMessage += "Enter at least one field to search."
        }else if(!isEmpty){
          try {
            if(this.requirementsSearchInput){
              if(this.requirementsSearchInput.courseLevel.value != ""){
                if(this.requirementsSearchInput.courseLevel.contains && !this.requirementsSearchInput.courseLevel.value.includes("*")) {            
                  this.params.append('courseLevel', this.requirementsSearchInput.courseLevel.value + "*");  
                }else{
                  this.params.append('courseLevel', this.requirementsSearchInput.courseLevel.value);
                }                
              }
              if(this.requirementsSearchInput.courseCode.value != ""){
                if(this.requirementsSearchInput.courseCode.contains && !this.requirementsSearchInput.courseCode.value.includes("*")) {            
                  this.params.append('courseCode', this.requirementsSearchInput.courseCode.value + "*");  
                }else{
                  this.params.append('courseCode', this.requirementsSearchInput.courseCode.value);
                }                 
              }          
              if(this.requirementsSearchInput.rule.value != ""){
                if(this.requirementsSearchInput.rule.contains && !this.requirementsSearchInput.rule.value.includes("*")) {            
                  this.params.append('rule', this.requirementsSearchInput.rule.value + "*");  
                }else{
                  this.params.append('rule', this.requirementsSearchInput.rule.value);
                }   
              }
            }
            CourseService.getCourseRequirements(this.params)
            .then((response) => {
              this.courseRequirementLoading = false;
              this.courseRequirements = response.data;
              this.totalRequirementResults = this.courseRequirements.length;
              if(this.totalRequirementResults <= 0){
                this.courseRequirementMessage = "No course requirements found.";      
              }
            })   
            .catch((error) => {
              this.courseRequirementLoading = false;
              this.courseRequirementMessage = "No course requirements found.";
              // eslint-disable-next-line
              console.log('There was an error:' + error);
              this.showNotification("danger", "There was an error with the web service.");
            });
          } catch (error) {
            this.courseRequirementLoading = false;
            this.courseRequirementMessage = "Search Error";
            // eslint-disable-next-line
            console.log('There was an error:' + error);
            this.showNotification("danger", "There was an error with the web service.");
          }   
        }   
      }, 
      searchCourseByCourseCode() {
        CourseService.getCourses(this.courseCode)
          .then((response) => {
            this.courses = response.data;
          })   
          .catch((error) => {
            // eslint-disable-next-line
            console.log('There was an error:' + error);
            this.showNotification("danger", "There was an error with the web service.");
          });
      },
      getAllCourses() {
        CourseService.getAllCourses()
          .then((response) => {
            this.courses = response.data;
          })
          // eslint-disable-next-line
          .catch((error) => {
            this.showNotification("danger", "There was an error with the web service.");
            // eslint-disable-next-line
            console.log('There was an error:' + error);
          });
      },
      getAllCourseRequirements() {
        CourseService.getAllCourseRequirements()
          .then((response) => {
            this.courseRequirements = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            this.showNotification("danger", "There was an error with the web service.");
            // eslint-disable-next-line
            console.log('There was an error:' + error);       
        });
      },
      getAllCourseRestrictions() {
        CourseService.getCourseRestrictions()
          .then((response) => {
            this.courseRestrictions = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            this.showNotification("danger", "There was an error with the web service.");
            // eslint-disable-next-line
            console.log('There was an error:' + error); 
        });
      },
      getAllCourseRestriction(mainCourseLevel, mainCourseCode) {
        CourseService.getCourseRestriction(mainCourseLevel, mainCourseCode)
          .then((response) => {
            this.courseRestrictions = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            this.showNotification("danger", "There was an error with the web service.");
            // eslint-disable-next-line
            console.log('There was an error:' + error); 
          });
      }
    },
  };
</script>

<style scoped>
  .courses-all{
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
