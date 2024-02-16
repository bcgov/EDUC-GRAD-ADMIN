<template>
  <div v-if="isEnvLocalHost" class="sample-pens m-3">
    <v-progress-circular v-if="searchLoading" indeterminate color="green">
    </v-progress-circular>
    Samples: V0.1.2
    <div class="row col-12">
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a00dfa87ff1')
          "
          >Student 1</a
        >
        1950 NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a0b1f6b7896')
          "
          >Student 2</a
        >
        1950 NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a0bd2497bc2')
          "
          >Student 3</a
        >
        1950 NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a06f60a6439')
          "
          >Student 4</a
        >
        1950 COMPLETED 2017/08/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a0b10330d76')
          "
          >Student 5</a
        >
        1950 COMPLETED 2019/05/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a06f60a6439')
          "
          >Student 6</a
        >
        1950 COMPLETED 2012/11/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a1baa405960')
          "
          >Student 7</a
        >
        2004-EN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a41d6d647fa')
          "
          >Student 8</a
        >
        2004-EN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a1b7186023a')
          "
          >Student 9</a
        >
        2004-EN COMPLETED 2021/02/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a1f51581eaa')
          "
          >Student 10</a
        >
        2004-PF COMPLETED 2015/06/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a2e514f0fcb')
          "
          >Student 11</a
        >
        2018-EN COMPLETED 2021/01/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a2e6d724185')
          "
          >Student 13</a
        >
        2018-EN COMPLETED 2020/11/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a2e3d7130cd')
          "
          >Student 14</a
        >
        2018-EN COMPLETED 2020/06/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a32b43b1cc5')
          "
          >Student 15</a
        >
        2018-EN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a3003f356c5')
          "
          >Student 16</a
        >
        2018-EN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a33cd244fad')
          "
          >Student 17</a
        >
        2018-EN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a32cae02ba7')
          "
          >Student 18</a
        >
        2018-PF COMPLETED 2020/06/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a3288dc765f')
          "
          >Student 19</a
        >
        2018-PF COMPLETED 2020/05/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a3288e77b17')
          "
          >Student 20</a
        >
        2018-PF COMPLETED 2020/04/01
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a3288ef7ea2')
          "
          >Student 21</a
        >
        2018-PF NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a3004627073')
          "
          >Student 22</a
        >
        2018-PF NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a338168590c')
          "
          >Student 23</a
        >
        2018-PF NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-49ffe91c03e6')
          "
          >Student 24</a
        >
        1950 NOPROG AN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a2e225977c8')
          "
          >Student 25</a
        >
        1950 NOPROG AN NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a19919c7262')
          "
          >Student 26</a
        >
        SCCP AD NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a1f06df5d06')
          "
          >Student 27</a
        >
        SCCP AD NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a335e95483b')
          "
          >Student 28</a
        >
        SCCP AD NOT COMPLETED
      </div>
      <div class="px-3 col-4">
        <a
          href="#"
          v-on:click="
            findStudentByStudentId('ac339d70-7649-1a2e-8176-4a335e8e44ae')
          "
          >Student 29</a
        >
        SCCP AD NOT COMPLETED
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { isEnvLocalHost, showNotification } from "../utils/common.js";
import { useStudentStore } from "../store/modules/student";
import StudentService from "@/services/StudentService.js";

export default {
  name: "DevStudents",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      isEnvLocalHost: isEnvLocalHost(),
      searchLoading: false,
      penInput: "",
    };
  },
  created() {
    this.showNotification = showNotification;
  },
  methods: {
    ...mapActions(useStudentStore, ["unsetStudent"]),
    closeRecord: function () {
      this.unsetStudent();
    },
    findStudentByStudentId: function (studentId) {
      this.searchLoading = true;
      StudentService.getStudentPen(studentId)
        .then((response) => {
          const responsePen = response.data.pen;
          this.findStudentByPen(responsePen);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error: " + error.response.status
            );
          }
        });
    },
    findStudentByPen: function (penInput) {
      if (penInput) {
        this.closeRecord();
        this.studentSearchResults = [];
        StudentService.getStudentByPen(penInput)
          .then((response) => {
            this.selectStudent(response.data);
          })
          .catch((err) => {
            this.searchByPenMessage = "";
            this.showNotification("danger", err);
          });
        //pen input check
      }
    },
    selectStudent: function (student) {
      this.searchLoading = false;
      this.selectedPen = student[0].pen;
      this.selectedId = student[0].studentID;
      this.$router.push({
        path: `/student-profile/${this.selectedId}`,
      });
    },
  },
};
</script>
