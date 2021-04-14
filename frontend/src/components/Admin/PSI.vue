<template>
  <div>
  <p>PSI</p>
  {{psi}}
  <!-- <table class="table table-striped table-bordered">
      <thead>
          <tr>
              <th></th>
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
  </table> -->
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import PSIService from "@/services/PSIService.js";
export default {
  name: 'PSI',
  created() {
     PSIService.getPSI(this.token)
      .then((response) => {
        this.psi = response.data;
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        //console.log('There was an error:' + error.response);
      });
  },
  data: function() {
    return {
      psi: [],
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
