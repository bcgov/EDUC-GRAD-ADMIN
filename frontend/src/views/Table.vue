<template>
  <div class="test">
    <DisplayTable v-bind:items="courses" v-bind:fields="fields"></DisplayTable>
    <DisplayTable v-bind:items="items" v-bind:fields="fields2"></DisplayTable>
   </div>
</template>

<script>
// @ is an alias to /src
import DisplayTable from "@/components/DisplayTable.vue"
//import { store } from "@/store.js";
  import {
    mapGetters
  } from "vuex";
export default {
  name: "test",
  data() {
    return {
       items: [
          { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
          { isActive: true, age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
          { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
          {
            isActive: false,
            age: 9,
            name: { first: 'Mini', last: 'Navarro' },
            _rowVariant: 'success'
          },
          { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
          { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
          { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
          { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
          {
            isActive: true,
            age: 87,
            name: { first: 'Larsen', last: 'Shaw' },
            _cellVariants: { age: 'danger', isActive: 'warning' }
          },
          { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
          { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
          { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
          { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
        ],
        fields2: [
          { key: 'name', label: 'Person full name', sortable: true, sortDirection: 'desc' },
          { key: 'age', label: 'Person age', sortable: true, class: 'text-center' },
          {
            key: 'isActive',
            label: 'Is Active',
            formatter: (value) => {
              return value ? 'Yes' : 'No'
            },
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'actions', label: 'Actions' }
        ],
        fields: [
          { key: 'courseCode', label: 'Course Code', sortable: true, sortDirection: 'desc' },
          { key: 'codeLevel', label: 'Code Level', sortable: true, class: 'text-center' },
          { key: 'sessionDate', label: 'Session Date', sortable: true, sortDirection: 'desc' },
          { key: 'courseName', label: 'Course Name', sortable: true, class: 'text-center' },
          { key: 'courseEquivChal', label: 'Course Equivalent Challenge', sortable: true, sortDirection: 'desc' },
          { key: 'credits', label: 'Credits', sortable: true, class: 'text-center' },
          { key: 'interimLetterGrade', label: 'Intermediate Letter Grade', sortable: true, sortDirection: 'desc' },
          { key: 'completedCoursePercentage', label: 'Completed Course Percentage'},
          {
            key: 'isActive',
            label: 'Is Active',
            formatter: (value) => {
              return value ? 'Yes' : 'No'
            },
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'actions', label: 'Actions' }
        ],
    };
    
  },
  created() {
  
  },
  methods: {

  },
  computed:{
    ...mapGetters({
      courses: "getStudentCourses",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      gradStatusPendingUpdates: "getHasGradStatusPendingUpdates"
    }),
  },
  components: {
    DisplayTable: DisplayTable

  },
};
</script>
<style scoped>
.alert,
.card,
.btn.btn-primary {
  position: inherit;
}
h6 {
  font-size: 1.5rem;
}
.find {
  padding-bottom: 1rem;
}
</style>
