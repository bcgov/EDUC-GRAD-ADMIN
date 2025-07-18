<template>
  <div>   
    <v-row>
      <h3 class="ml-4 mt-5">Course Restrictions</h3>
      <v-spacer />   
      <span v-if="enableCRUD()">   
        <CourseRestrictionsCreateForm  />
      </span>
    </v-row>
    <v-spacer />
    <v-row no-gutters>
        <v-row id="filter" class="mt-4 ">
        <v-col lg="8" class="px-0 float-left"></v-col>
        <v-col sm="12" lg="4" class="my-1 pr-3 table-filter p-0">
          <v-row>
            <v-col cols="12">
              <v-form>
                <v-text-field
                  v-model="rawSearchInput"
                  @update:modelValue="onSearchInput"
                  label="Filter"
                  variant="outlined"
                  density="comfortable"
                  debounce="500"
                  placeholder=""
                  append-icon="mdi-close"
                  @click:append="clearSearchInput"
                  class="mt-2"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-data-table v-if="courseRestrictions.length > 0" v-model="selected" :items="courseRestrictions"
        :headers="courseRestrictionFields" :item-value="(item) => item" :items-per-page="defaultItemsPerPage"
        title="courseRestriction" :search="search">
        <template v-slot:item.restrictionStartDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.restrictionStartDate) }}
        </template>
        <template v-slot:item.restrictionEndDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.restrictionEndDate) }}
        </template>
        <template v-slot:item.edit="{ item }" v-if="enableCRUD()">
          <CourseRestrictionsUpdateForm :selectedCourseRestrictionToUpdate="item">
          </CourseRestrictionsUpdateForm>
        </template>

      </v-data-table>
    </v-row>
  </div>
</template>
<script>
import { useAppStore } from "@/store/modules/app";
import { useCourseStore } from "@/store/modules/course.js";
import { mapState, mapActions } from "pinia";
import CourseRestrictionsCreateForm from "@/components/Courses/Forms/CourseRestrictionsCreateForm.vue";
import CourseRestrictionsUpdateForm from "@/components/Courses/Forms/CourseRestrictionsUpdateForm.vue";
export default {
  name: "CourseRestrictions",
  components: {
    CourseRestrictionsCreateForm: CourseRestrictionsCreateForm,
    CourseRestrictionsUpdateForm: CourseRestrictionsUpdateForm
  },
  computed: {
    ...mapState(useCourseStore, {
      courseRestrictions: "getCourseRestrictions",
    }),
  },
  created() {
    this.loadCourseRestrictions();
  },
  data() {
    return {
      defaultItemsPerPage: 20,
      courseRestrictionFields: [
        {
          key: "mainCourse",
          title: "Course Code Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "mainCourseLevel",
          title: "Course Level Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourse",
          title: "Course Code Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourseLevel",
          title: "Course Level Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionStartDate",
          title: "Restriction Start Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionEndDate",
          title: "Restriction End Date",
          sortable: true,
          class: "text-left",
        },
        ...(this.enableCRUD()
    ? [
        {
          key: "edit",
          title: "Edit",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        },
      ]
    : []),    
      ],
      rawSearchInput: '', 
      search: '',
      selected: []
    };
  },
  methods: {
    ...mapActions(useCourseStore, [
      "loadCourseRestrictions",
    ]),
    ...mapActions(useAppStore, [
      "enableCRUD",
    ]),
    onSearchInput(value) {
      this.search = value?.replace("-","/");
    },
    clearSearchInput() {
      this.search = '';
      this.rawSearchInput= ''; 
    }
  },
};
</script>
<style scoped></style>
