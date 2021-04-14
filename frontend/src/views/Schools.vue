<template>
  <div>
    <h1>School Search</h1>

              <b-input class="float-left col-3 mx-1 my-3" v-model="search.city" placeholder="City"/>
              <b-input class="float-left col-3 mx-1 my-3" v-model="search.schoolName" placeholder="School Name"/>
              <b-input class="float-left col-3 mx-1 my-3" v-model="search.districtName" placeholder="District Name"/>
              <b-button class="float-left col-auto mx-1 my-3" type="submit" @click="searchSchools"> Search </b-button>
              <!-- <input type="submit" @click="searchCourseByCourseCode"> -->
              <table v-if="schools" class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Mincode</th>
                    <th>School Name</th>
                    <th>District Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="school in schools" :key="school.minCode">
                    <td>{{school.minCode}}</td>
                    <td>{{school.schoolName}}</td>
                    <td>{{school.districtName}}</td>
                  </tr>
                </tbody>
              </table>


  </div>
</template>

<script>
  import SchoolService from '@/services/SchoolService.js';
    import {
    mapGetters
  } from "vuex";
  export default {
    name: "schools",
    components: {

    },
    data() {
      return {
        schools: {},
        search: {
          city:"",
          schoolName: "",
          districtName: "",
        },
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
      this.getAllSchools();
    },
    methods: {
      getAllSchools(){
        SchoolService.getAllSchools(this.token).then((res) => {
          this.schools = res.data;
        }).catch((error) => {

          // eslint-disable-next-line
          console.log('There was an error adding School information to Grad Status:' + error.response);
        });  
      },
      searchSchools(){
        this.schools = {};
        SchoolService.searchSchools(this.search, localStorage.getItem('jwt')).then((res) => {
          this.schools = res.data;
        }).catch((error) => {
          // eslint-disable-next-line
          console.log('There was an error adding School information to Grad Status:' + error.response);
        });  
      }
    }
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