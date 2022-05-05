<template>
  <div class="container">

    <!-- Notes Section -->
    <div>
      <b-button v-b-toggle.note-collapse variant="link" v-on:click="showNotes = !showNotes" class="float-left">
        <img v-show="!showNotes" src="../assets/images/icon-right.svg" width="14px" aria-hidden="true" alt=""/>
        <img v-show="showNotes" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
      </b-button>
      <h3 class="pt-2">{{'Notes ('  + studentNotes.length + ')'}}</h3>
    </div>
    <b-collapse id="note-collapse" class="py-2">
      <StudentNotes />
    </b-collapse>
    <hr>

    <!-- Undo Completion/Ungrad reasons section -->
    <div>
      <b-button v-b-toggle.ungrad-reasons-collapse variant="link" v-on:click="showUngradReasons = !showUngradReasons" class="float-left">
        <img v-show="!showUngradReasons" src="../assets/images/icon-right.svg" width="14px" aria-hidden="true" alt=""/>
        <img v-show="showUngradReasons" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
      </b-button>
      <h3 class="pt-2">{{'Undo Completion Reasons ('  + studentUngradReasons.length + ')'}}</h3>
    </div>
    <b-collapse id="ungrad-reasons-collapse">
      <div class="pb-3 px-3">
        <b-table striped :items="studentUngradReasons" :fields='[{ key: "createDate",label: "Ungrad Date",class:"px-0 py-2 w-10"},{key: "ungradReasonCode",label: "Code",class:"px-0 py-2 w-10"},{key: "ungradReasonDescription",label: "Reason",class:"px-0 py-2 w-80"},{key: "createUser",label: "User",class:"px-0 py-2 w-80"}]'></b-table>
      </div>
    </b-collapse>
    <hr>

    <!-- Student change history -->
    <div>
      <b-button v-b-toggle.student-change-history-collapse variant="link" v-on:click="showStudentChangeHistory = !showStudentChangeHistory" class="float-left">
        <img v-show="!showStudentChangeHistory" src="../assets/images/icon-right.svg" width="14px" aria-hidden="true" alt=""/>
        <img v-show="showStudentChangeHistory" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
      </b-button>
      <h3 class="pt-2">Student change history</h3>
    </div>
    <b-collapse id="student-change-history-collapse">
      <div class="col-12" v-for="(value, index) in changeHistory.slice().reverse()" :key="value.historyID">
        <div class="row col-12 py-2" :header="studentHistory[index].historyID">
          <div class="col-4 border-bottom">
            Activity Code: <strong>{{studentHistory[index].activityCode}}</strong> on<br/>
            {{studentHistory[index].createDate | formatTime}}
          </div>
          <div class="float-left col-8 border-bottom">
            <div class="float-right w-25">
              <b-button v-b-toggle="'collapse-'+ studentHistory[index].historyID" variant="primary">
                View
              </b-button>
            </div>
            <div v-for="v in value" :key="v.historyID" class="">
              <div class="" v-if="v.pathTo != 'updateDate' 
                && v.pathTo != 'createDate' 
                && v.pathTo != 'historyID'
                && v.pathTo != 'studentGradData'
                && v.pathTo != 'activityCode'
                && v.pathTo != 'recalculateGradStatus'
                ">
                <div class="w-25 float-left"> <strong>{{v.pathTo | formatSetenceCase}}</strong>:</div>
                <div class="w-50 float-left"> {{v.lhs==null?"blank":v.lhs}} <i class="fas fa-arrow-right" aria-hidden="true"></i> {{v.rhs == null?"blank":v.rhs}}</div>
          
                <div class="w-100 float-left">
                  <b-collapse :id="'collapse-' + studentHistory[index].historyID" class="mt-2">
                    <pre>{{JSON.stringify(studentHistory[index], null, '\t')}}</pre>
                  </b-collapse>
                </div>
              </div>  
            </div> 
          </div>
        </div>
      </div>
    </b-collapse>
    <hr>

    <!-- Optional Program history -->
    <div>
      <b-button v-b-toggle.optional-program-history-collapse variant="link" v-on:click="ShowOptionalProgramHistory = !ShowOptionalProgramHistory" class="float-left">
        <img v-show="!ShowOptionalProgramHistory" src="../assets/images/icon-right.svg" width="14px" aria-hidden="true" alt=""/>
        <img v-show="ShowOptionalProgramHistory" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
      </b-button>
      <h3 class="pt-2">Optional program change history</h3>
    </div>

    <b-collapse id="optional-program-history-collapse">
    <div class="col-12" v-for="(value, index) in optionalProgramChangeHistory.slice().reverse()" :key="value.historyID">
      <div class="row col-12 py-2" :header="optionalProgramHistory[index+1].historyID">
        <div class="col-4 border-bottom">
          Edited by <strong>{{optionalProgramHistory[index+1].activityCode}}</strong> on<br/>
          {{optionalProgramHistory[index+1].createDate | formatTime}}
        </div>
        <div class="float-left col-8 border-bottom">
                <div class="float-right w-25">
                  <b-button v-b-toggle="'collapse-'+ optionalProgramHistory[index+1].historyId" variant="primary">View</b-button>
                </div>
          <div v-for="v in value" :key="v.historyId" class="">
            <div class="" v-if="v.pathTo != 'updateDate' 
              && v.pathTo != 'createDate' 
              && v.pathTo != 'historyId'
              && v.pathTo != 'studentOptionalProgramId'
              && v.pathTo != 'optionalProgramID'
              && v.pathTo != 'studentOptionalProgramData'
              && v.pathTo != 'activityCode'
              && v.pathTo != 'recalculateGradStatus'
              ">
              <div class="w-25 float-left"> <strong>{{v.pathTo | formatSetenceCase}}</strong>:</div>
              <div class="w-50 float-left"> {{v.lhs==null?"blank":v.lhs}} <i class="fas fa-arrow-right" aria-hidden="true"></i> {{v.rhs == null?"blank":v.rhs}}</div>
        
              <div class="w-100 float-left">
                <b-collapse :id="'collapse-' + optionalProgramHistory[index+1].historyId" class="mt-2">
                  <pre>{{JSON.stringify(optionalProgramHistory[index+1], null, '\t')}}</pre>
                </b-collapse>
              </div>
            </div>  
          </div> 
        </div>
      </div>
    </div>
    </b-collapse>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { DeepDiff } from 'deep-diff';
import sharedMethods from '../sharedMethods';
import StudentNotes from "@/components/StudentNotes";

export default {
  name: "StudentAuditHistory",
  components: {
    StudentNotes: StudentNotes,
  },
  props: {},
  computed: {
    ...mapGetters({
        studentId: "getStudentId",
        token: "getToken",
        studentHistory: 'getStudentAuditHistory',
        optionalProgramHistory: 'getStudentOptionalProgramAuditHistory',
        studentUngradReasons: "getStudentUngradReasons",
        studentNotes: "getStudentNotes",
    }),
  },
  data: function () {
    return {
        studentHistoryChangeCount:"",
        optionalProgramHistoryChangeCount:"",
        isEdit:false,
        isDelete:false,
        isAdd:false,
        changeHistory:[],
        optionalProgramChangeHistory:[],
        testHistory:[],
        fields: [
          {
            key: "change",
            label: "Change",
            sortable: true,
            sortDirection: "desc"
          },
          {
            key: "createDate",
            label: "Create date",
            sortable: true,
            sortDirection: "desc"
          },
        ],
        showNotes: false,
        showUngradReasons: false,
        showStudentChangeHistory: false,
        ShowOptionalProgramHistory: false,
    };
  },
  mounted() {
    this.showNotification = sharedMethods.showNotification
  },
  watch: {
    studentHistory: function () {
      this.loadStudentHistory();
    },
    optionalProgramHistory: function () {
      this.loadStudentOptionalProgramHistory();
    }    
  },
  methods: {
    loadStudentHistory(){  
      this.studentHistoryChangeCount = this.studentHistory.length
      for (let i = 0; i < this.studentHistoryChangeCount - 1; i++) {
          var x = DeepDiff(this.studentHistory[i], this.studentHistory[i + 1]);
          this.changeHistory.splice(i,1,x)     
      }
      for (let j = 0; j < this.changeHistory.length ; j++) {  
          for (let k = 0; k < this.changeHistory[j].length; k++) { 
              this.changeHistory[j][k].pathTo = this.changeHistory[j][k].path[0]
          }                 
      }  
    },
    loadStudentOptionalProgramHistory(){
      this.optionalProgramHistoryChangeCount = this.optionalProgramHistory.length; 
      for (let i = 0; i < this.optionalProgramHistoryChangeCount - 1; i++) {
            var x = DeepDiff(this.optionalProgramHistory[i], this.optionalProgramHistory[i + 1]);
            this.optionalProgramChangeHistory.splice(i,1,x)     
      } 
      for (let j = 0; j < this.optionalProgramChangeHistory.length ; j++) {  
        for (let k = 0; k < this.optionalProgramChangeHistory[j].length; k++) { 
            this.optionalProgramChangeHistory[j][k].pathTo = this.optionalProgramChangeHistory[j][k].path[0]
        }                 
      }
    },   
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}

.table th svg {
  display: none !important;
}

.highlight {
  background: aliceblue !important;
}

</style>
