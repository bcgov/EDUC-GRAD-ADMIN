<template>
  <div>
    <h1>Course Search</h1>
    <div>
      <b-card no-body>
        <b-tabs pills card vertical>
          <b-tab title="Course Search" active>
            <b-card-text>
              <div class="row">
                <b-input class="col-4 my-2 ml-3" v-model="courseCode" placeholder="Course Code: BI"/>
                <b-button class="col-4 my-2 mx-1" @click="getAllCourses">Search</b-button>
              </div>
              <!-- <input type="submit" @click="searchCourseByCourseCode"> -->
              <table v-if="courses" class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Level</th>
                    <th>Course Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Work Experience</th>
                    <th>Generic Course Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course.courseName">
                    <td>{{course.courseCode}}</td>
                    <td>{{course.courseLevel}}</td>
                    <td>{{course.courseName}}</td>
                    <td>{{course.startDate}}</td>
                    <td>{{course.endDate}}</td>
                    <td>{{course.workExpFlag}}</td>
                    <td>{{course.genericCourseType}}</td>
                  </tr>
                </tbody>
              </table>
            </b-card-text>
          </b-tab>
          <b-tab title="Course Restrictons">
            <b-card-text>
              Course Restrictions
              <DisplayTable v-bind:items="courseRestrictions" v-bind:fields="courseRestrictionFields"></DisplayTable>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>

  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import CourseService from '@/services/CourseService.js';
  import DisplayTable from '@/components/DisplayTable.vue';
  export default {
    name: "courses",
    components: {
      DisplayTable: DisplayTable
    },
    data() {
      return {
        courses: {},
        courseRestrictions:{},
        courseRestrictionFields: [
          { key: 'courseRestrictionId', label: 'ID', sortable: true, sortDirection: 'desc' },
          { key: 'mainCourse', label: 'Course', sortable: true, class: 'text-center' },
          { key: 'restrictedCourse', label: 'Restricted Course', sortable: true, sortDirection: 'desc' },
          { key: 'restrictedCourseLevel', label: 'Course Level', sortable: true, class: 'text-center' },
          { key: 'restrictionStartDate', label: 'Start Date', sortable: true, sortDirection: 'desc' },
          { key: 'restrictionEndDate', label: 'End Date', sortable: true, class: 'text-center' },
          { key: 'actions', label: 'Actions' }
        ],
        courseCode: "",
        show: false,
        displayMessage: null,
      };
    },
    computed: {
      ...mapGetters({
        token: "getToken"
      }),
    },
    created() {
      this.getAllCourses();
      this.getAllCourseRestrictions();
    },
    methods: {
      searchCourseByCourseCode() {
        CourseService.getCourses(this.courseCode, this.token)
          .then((response) => {
            this.courses = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      },
      getAllCourses() {
        CourseService.getAllCourses(this.token)
          .then((response) => {
            this.courses = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      },
      getAllCourseRestrictions(){
          CourseService.getCourseRestrictions(this.token)
          .then((response) => {
            this.courseRestrictions = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      },
      getAllCourseRestriction(mainCourseLevel, mainCourseCode){
          CourseService.getCourseRestriction(mainCourseLevel, mainCourseCode, this.token)
          .then((response) => {
            this.courseRestrictions = response.data;
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      }


    },
  };
</script>

<style scoped>
  .close-record {
    float: right;
  }

  .tab-loading {
    color: green !important;
  }

  .profile-name {
    padding-bottom: 10px;
  }
</style>