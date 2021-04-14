<template>
  <div>
  <p>Special cases used for graduation</p>
  <table class="table table-striped table-bordered">
      <thead>
          <tr>
              <th>Special Case</th>
              <th>Pass Flag</th>
              <th>Description</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="specialCase in specialCases" :key="specialCase.description">
              <td>{{specialCase.specialCase}}</td>
              <td>{{specialCase.passFlag}}</td>
              <td>{{specialCase.description}}</td>
              

          </tr>
      </tbody>
  </table>
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import ProgramManagementService from "@/services/ProgramManagementService.js";
export default {
  name: 'Special Cases',
  created() {
     ProgramManagementService.getSpecialCases(this.token)
      .then((response) => {
        this.specialCases = response.data;
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        //console.log('There was an error:' + error.response);
      });
  },
  data: function() {
    return {
      specialCases: [],
    };
  },
  computed: {
    ...mapGetters({  
      token: "getToken"
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
