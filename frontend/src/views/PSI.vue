<template>
  <div>
    <h1>Post Secondary Institutions</h1>
    <b-card v-for="item in psi" :key="item.message"  sub-title="" class="my-2">
      <b-card-text>
        <div class="row col-12">
          <div class="col-12">
            <h2>{{item.psiName}}</h2>
          </div>
          <div class="address col-3">
            <strong>Address:</strong><br/>
            <div class="pl-3">
              {{item.address1}}<br/>
              {{item.postal}}<br/>
              {{item.city}},{{item.provinceCode}}<br/>
              Country Code: {{item.countryCode}}
            </div>

            <div><strong>Contact:</strong><br/>
              <strong>Fax:</strong> {{item.fax}}<br/>
              <strong>Phone:</strong> {{item.phone1}}<br/>
            </div>
          </div>
  
          <div>
            <strong>School Information:</strong>
            <div class="pl-3">
              CSL Code: {{item.cslCode}}<br/>
              Attention Name: {{item.attentionName}}<br/>
              Open: {{item.openFlag}}<br/>
              Transmission Mode: {{ item.transmissionMode }}<br/>
              PSI Grouping: {{item.psiGrouping}}<br/>
              Code: {{item.psiCode}}<br/>
              <div v-if="item.psiUrl != ' '">
                <b-link class="btn btn-primary" v-bind:href="item.psiUrl">Website</b-link>
              </div>
            </div>
          </div>
        </div>
      </b-card-text>
    </b-card>




  </div>
</template>

<script>
  import PSIService from '@/services/PSIService.js';
  import {
    mapGetters
  } from "vuex";
  export default {
    name: "psi",
    components: {

    },
    data() {
      return {
        psi: {},
        psiFields: ["psiName", "address1", "city", "provinceCode", "countryCode", "attentionName", "transmissionMode"]
      }
    },

    computed: {
      ...mapGetters({
        token: "getToken"
      }),
    },
    created() {
      PSIService.getPSI(this.token).then((res) => {
        this.psi = res.data;
      }).catch((error) => {
        // eslint-disable-next-line
        console.log('There was an error adding psi information:' + error.response);
      });
    },
    methods: {

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