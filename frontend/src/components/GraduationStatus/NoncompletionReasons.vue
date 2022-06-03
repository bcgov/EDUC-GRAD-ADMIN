<template>
  <div class="requirements-met-and-not-met">
    <div class="requirements-not-met pb-2">
        <b-card
          header="Noncompletion Reasons"
          class="w-100"
        >
          <b-card-text v-if="studentGradStatus.studentGradData">
            <div v-if="!nongradReasons || !nongradReasons.length">
              <ul>
                <li>All program requirements have been met</li>
              </ul>
            </div>
            <div v-else>
              <b-table :items="nongradReasons" 
                :fields='[{ key: "rule",label: "Rule", sortable: true},{key: "description",label:"Description", sortable: true}]' 
                small
                striped>
            </b-table> 
       
          </div>
        </b-card-text>
      </b-card>
    </div>
    
    <div class="requirements-met pb-2">  
      <b-card
        header="Requirements met"
        v-if="studentGradStatus.studentGradData"
        no-body
        class="w-100"
      >
        <b-card-text class=" m-3">
          <b-table :items="requirementsMet"
            :fields='[{ key: "rule",label: "Rule", sortable: true},{key: "description",label:"Description", sortable: true}]'   
            small
            striped></b-table>                 
          </b-card-text>
        </b-card>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "NoncompletionReasons",
    props: {},
    computed: {
      ...mapGetters({
        studentGradStatus: "getStudentGradStatus",
        requirementsMet: "getRequirementsMet",
        nongradReasons: "getNongradReasons"
      })
    },
    methods: {

    }
  }
</script>

<style scoped>
ul.requirements-met,
ul.non-grad-reasons {
  list-style: none;
}
ul.requirements-met li,
ul.non-grad-reasons li {
  border-bottom: 1px solid #ccc;
}
.card-body {
  border-bottom: 1px solid #ccc;
}
.card {
  margin-bottom: 10px;
}

.card-header {
  font-weight: 700;
}
</style>