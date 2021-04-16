<template>
  <div class="studentlist">
    <h1>Student search</h1>
    <p>
      Enter a Personal Education Number (PEN) to retrieve a student’s graduation and achievement data.
    </p>

    <div>
      <form v-on:submit.prevent>
        
        <div class="form-group">
          <!-- Pen Input -->
          <div class="search">
            <b-input-group size="lg" class="mb-2">
                <b-form-input size="lg" type="search" 
                   v-model="penInput"
                  placeholder="For example: 123456789"
                  class="pen-search"
                  ref="penSearch"
                  v-on:keyup="keyHandler"
                  tabindex="1"
                 >
                 </b-form-input>
              <button v-if="!searchLoading" v-on:click="findStudentByPen" class="btn btn-primary">
                <i class="fas fa-search"></i> Search
              </button>
              <button v-if="searchLoading" class="btn btn-success">
                <i class="fas fa-search"></i> Searching
              </button>
            </b-input-group>
          </div>
          
            <b-spinner
              v-for="variant in variants"
              :variant="variant"
              :key="variant"
              v-show="searchLoading"
              class="loading-spinner"
            ></b-spinner>
          
        </div>
        </form>
        <form v-on:submit.prevent>
          <!-- advanced Search -->
          
        <a v-on:click="showAdvancedSearch" href="#" class="ml-3">Advanced search</a>
        <transition name="fade">
          <div v-if="showAdvancedSearchForm" class="advanced-search-form mx-0 px-2">
            <div class="row col-12 mb-3">
              <div class="col-12"><h2>Advance search</h2></div>
                <div class="advanced-search-field col-12 col-md-3">
                  <label>First Name </label>
                  <a 
                    href="#"
                    v-on:click="advancedSearchInput.firstName.contains = !advancedSearchInput.firstName.contains"

                    v-bind:class="{active: advancedSearchInput.firstName.contains}" 
                    class="wild-card-button" v-b-tooltip.hover title="First Name Contains">
                      [.*]
                    </a>
                  <input
                    v-model="advancedSearchInput.firstName.value"
                    placeholder="John"
                    v-on:keyup="keyHandler"
                    tabindex="2"
                  />
                </div>
                <div class="advanced-search-field col-12 col-md-3">
                <label>Last Name</label>
                <a 
                  href="#"
                  v-on:click="advancedSearchInput.lastName.contains = !advancedSearchInput.lastName.contains"
                  v-bind:class="{active: advancedSearchInput.lastName.contains}" 
                  class="wild-card-button" v-b-tooltip.hover title="Last Name Contains">
                    [.*]
                </a>
                <input
                  v-model="advancedSearchInput.lastName.value"
                  placeholder="Smith"
                  v-on:keyup="keyHandler"
                  tabindex="3"
                />
                </div>
                <div class="advanced-search-field col-12 col-md-3">
                <label>Middle Name</label>
                <a 
                  href="#"
                  v-on:click="advancedSearchInput.middleName.contains = !advancedSearchInput.middleName.contains"
                  v-bind:class="{active: advancedSearchInput.middleName.contains}" 
                  class="wild-card-button" v-b-tooltip.hover title="Middle Name Contains">
                    [.*]
                </a>
                <input
                  v-model="advancedSearchInput.middleName.value"
                  placeholder="Middle Name"
                  v-on:keyup=" keyHandler"
                  tabindex="4"
                />   
                </div>                     
                <div class="advanced-search-field  col-12 col-md-3">
                <label>Gender</label>
                <input
                  v-model="advancedSearchInput.gender.value"
                  placeholder="M|F"
                  v-on:keyup="keyHandler"
                  tabindex="5"
                />    
                </div>     
            </div>
            <div class="row col-12">
              <div class="advanced-search-field col-12 col-md-3">
                <label>Grade</label>
                <input
                  v-model="advancedSearchInput.grade.value"
                  placeholder="12"
                  v-on:keyup=" keyHandler"
                  tabindex="6"
                />   
                </div>                     
                <div class="advanced-search-field  col-12 col-md-3">
                <label>Mincode</label>
                <input
                  v-model="advancedSearchInput.mincode.value"
                  placeholder="12345678"
                  v-on:keyup="keyHandler"
                  tabindex="7"
                />    
                </div>  
                <div class="advanced-search-field col-12 col-md-3">
                <label>Local ID</label>
                <input
                  v-model="advancedSearchInput.localId.value"
                  placeholder="063"
                  v-on:keyup=" keyHandler"
                  tabindex="8"
                />   
                </div>                     
                <div class="advanced-search-field  col-12 col-md-3">
                <label>Birthdate</label>
                <input
                  v-model="advancedSearchInput.birthDate.value"
                  placeholder="MM|DD|YYYY"
                  v-on:keyup="keyHandler"
                  tabindex="9"
                />    
                </div>     
                <div class="advanced-search-button">               
                <button @click="findStudentsByAdvancedSearch" v-if="!advancedSearchLoading" class="btn btn-primary" tabindex="10">Search</button>
                <button v-if="advancedSearchLoading" class="btn btn-success">Search</button>
                <button @click="clearInput" class=" btn btn-primary mx-2">Reset</button>
                  
                </div>
                <b-spinner
                  v-for="variant in variants"
                  :variant="variant"
                  :key="variant"
                  v-show="advancedSearchLoading"
                  class="advanced-loading-spinner"
                ></b-spinner>  
            </div>
          </div>
        </transition>
        <div class="search-results-message"><strong><span v-if="message">{{ message }}</span></strong></div>
      </form>
      <p class="sample-pens">
        Samples:
        <ul>
          <li><a href="#" v-on:click="findStudentByPenSample(140341157)">140341157</a> (Exams and Assessment)</li>
          <li><a href="#" v-on:click="findStudentByPenSample(130129323)">130129323</a> (Exams and Assessment)</li>
          <li><a href="#" v-on:click="findStudentByPenSample(101696920)">101696920</a> (Exams Only)</li>
          <li><a href="#" v-on:click="findStudentByPenSample(124411075)">124411075</a> (Student Achievement Report)</li>
          <li><a href="#" v-on:click="findStudentByPenSample(141761569)">141761569</a> (Student with no Grad Status)</li>
          <li><a href="#" v-on:click="findStudentByPenSample(127863819)">127863819</a> (Achievement and Transcript)</li>
          <!--li><a href="#" v-on:click="test()">TEST CORS</a></li-->
          <!--li><a href="#" v-on:click="test2()">TEST2 CORS</a></li-->
        </ul>
      </p>

    </div>
    <transition name="fade">
    <v-table
      :data="studentSearchResults"
      class="table table-sm table-hover table-striped align-middle"
      v-show="studentSearchResults.length"
    >
      <thead slot="head" class="">
        <v-th sortKey="pen">PEN</v-th>
        <v-th sortKey="studSurname">Last name</v-th>
        <v-th sortKey="studGiven">First name</v-th>
        <v-th sortKey="studMiddle">Middle</v-th>
        <v-th sortKey="studBirth">Birthdate</v-th>
        <v-th sortKey="studGender">Gender</v-th>
        <v-th sortKey="studentGrade">Grade</v-th>
        <v-th sortKey="mincode_grad">School code</v-th>
        <v-th sortKey="schoolName">School</v-th>
        <v-th sortKey="gradRequirementYear">Program</v-th>
      </thead>
      <tbody slot="body" slot-scope="{ displayData }">
        <template v-for="row in displayData">
          <tr :key="row.pen">
            <td>
              <a href="#" v-on:click="selectStudent(row)">{{ row.pen }}</a>
            </td>
            <td>{{ row.studSurname }}</td>
            <td>{{ row.studGiven }}</td>
            <td>{{ row.studMiddle }}</td>
            <td>{{ row.studBirth }}</td>
            <td>{{ row.studSex }}</td>
            <td>{{ row.studentGrade }}</td>
            <td>{{ row.mincode_grad }}</td>
            <td>{{ row.schoolName }}</td>
            <td>{{ row.gradRequirementYear }}</td>            
          </tr>
        </template>
      </tbody>
    </v-table>
    </transition>
  </div>
</template>
<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import StudentService from "@/services/StudentService.js";
export default {
  name: "studentSearch",
  data() {
    return {
      studentSearchResults: [],
      searchResultMessage: "",
      message: "",
      errorMessage:"",
      penInput: "",
      selectedPen: "",
      variants: ["success"],
      searchLoading: false,
      advancedSearchLoading: false,
      showAdvancedSearchForm: false,
      advancedSearchInput: {
        firstName: {
          value: "",
          contains: false,
        },
        lastName: {
          value: "",
          contains: false,
        },
        middleName: {
          value: "",
          contains: false,
        },
        gender: {
          value: "",
          contains: false,
        },  
        grade: {
          value: "",
          contains: false,
        }, 
        mincode: {
          value: "",
          contains: false,
        },
        localId:{
          value: "",
          contains: false,
        },                
        birthDate: {
          value: "",
          contains: false,
        }
      }
    };
  },
  created() {
  },
  // beforeRouteLeave(to, from, next) {
  //   next(this.loadStudent(this.selectedPen));
  // },
  components: {},
  computed: {
    ...mapGetters({
      profile: "getStudentProfile",
      courses: "getStudentCourses",
      exams: "getStudentExams",
      gradStatus: "getStudentGradStatus",
      token: "getToken"
    }),
  },

  methods: {
    keyHandler: function(e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.studentSearchResults = [];
        if (this.penInput) {
          this.findStudentByPen();
        } else if (this.surnameInput) {
          this.findStudentBySurname();
        }
      }
    },
    findStudentByPenSample:function(pen){
      this.penInput = pen;
      this.findStudentByPen();
    },
    findStudentByPen: function() {

      //console.log("FIND STUDENT BY PEN");
      if (this.penInput) {
      this.message ="";
      this.searchLoading = true;
      this.studentSearchResults = [];
      StudentService.getStudentByPen(this.penInput, this.token)
        .then((response) => {
          if (response.data) {
            this.selectStudent(response.data);
            /*
            //select student in list
            this.searchLoading = false;
            this.studentSearchResults.push(response.data);
            this.message = "1 Student found";
            */
          }
        })
        .catch(() => {
          this.searchLoading = false;
          this.message = "Student not found";
        });
//pen input check
      }
    },
    findStudentsByAdvancedSearch: function() {
      this.message = "";
      this.errorMessage="";
      if (!this.isEmpty(this.advancedSearchInput)) {
        this.advancedSearchLoading = true;
        this.studentSearchResults = [];
        try {
          StudentService.getStudentsByAdvancedSearch(this.advancedSearchInput, this.token)
            .then((response) => {
              this.advancedSearchLoading = false;
              this.studentSearchResults = response.data;
              this.message = this.studentSearchResults.length + " student(s) found"
            })
            .catch((err) => {
              this.advancedSearchLoading = false;
              this.message = "Student not found";
              this.errorMessage = err;
              // console.log(err);
            });
        } catch (error) {
          //console.log("Error with webservice");
        }
      }else{
        this.message = "Enter at least one field to search."
      }
    },
    showAdvancedSearch: function(){
      this.showAdvancedSearchForm = true;
    },
    selectStudent: function(student) {
      this.selectedPen = student.pen;
       this.$router.push({path: `/student-profile/${this.selectedPen}`});
      //this.$router.push({ name: "student-profile", params: {pen: this.selectedPen}});
    },
    clearStudent: function() {},
    clearInput: function() {
      this.penInput = "";
      this.advancedSearchInput = {
        firstName: {
          value: "",
          contains: false,
        },
        lastName: {
          value: "",
          contains: false,
        },
        middleName: {
          value: "",
          contains: false,
        },
        gender: {
          value: "",
          contains: false,
        },  
        grade: {
          value: "",
          contains: false,
        }, 
        mincode: {
          value: "",
          contains: false,
        },
        localId:{
          value: "",
          contains: false,
        },                
        birthDate: {
          value: "",
          contains: false,
        }
      }
    },
    isEmpty(obj) {
      let isEmpty = true;
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if(obj[key] != ""){
              isEmpty = false;
            }
          }
      }
      return isEmpty;
    },

  },
};
</script>
<style scoped>
.alert,
.card,
input{
  padding: 5px;
  border-radius: 0px !important
}
.primary { color: #003366;}
.pen-search{
  width: 100%;
  margin-right: 9px;
  float: left;
  padding-left:25px;
}
h6 {
  font-size: 1.5rem;
}
.loading-spinner{
  float:left;
  margin-left: 10px;
}
.advanced-loading-spinner{
  margin-top: 32px;
}
.table-hover tbody tr:hover{
  background: #96c0e6;
}
.search{
  float:left;
}
.sample-pens{
  float:left;
  clear:both;
  margin-top: 15px;
}
.search-student-dropdown{
  border-radius: 0px;
}
.search-results-message{
    float: left;
    clear: both;
    margin-top: 5px;
}
.fade-enter-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.table th{
  border-bottom: 2px solid #5475a7;
}
.advanced-search{
  float:left;
  clear:both;
}
.advanced-search-form{
  background-color: #fff;
  margin-top: 40px;
  border: 1px solid #DEE2EB;
  padding:20px;
}
.advanced-search-field{
  padding-right: 10px;
}
.advanced-search-field label{
  float:left;
  clear:both;
  
}
.advanced-search-field input{
  float:left;
  clear:both;
  padding-left: 10px;
  width: 100%;
}
.advanced-search-button{
  margin-top: 32px;
  padding-left: 15px;
}
.wild-card-button{
  color:#DEE2EB;
  position: absolute;
  right: 21px;
  top: 40px;
  z-index: 10;
  text-decoration:none;
}
.wild-card-button:visited{
  color:#DEE2EB;
}
.wild-card-button.active{
 color:green
}
svg{
  display:none !important;
}

</style>
