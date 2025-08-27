<template>
    <div v-for="(value, key) in courseReconciliation" :key="key">
        <v-row no-gutters v-if="value.length >= 0 && key !== 'errors'">
            <v-alert :type="getProperty(key, 'type')" :icon="getProperty(key, 'icon')" class="mb-4" border="start"
                elevation="2" variant="tonal">
                <div class="mb-2">
                    {{ nonExaminableCoursesToMerge[key].length }} / {{ value.length }} {{ getProperty(key, 'headerSuffix') }}
                </div>
            </v-alert>
            <v-data-table v-if="value.length > 0" v-model="nonExaminableCoursesToMerge[key]" :items="value"
                :item-value="(item) => item" class="mb-4" hide-default-footer :headers="courseMergeHeaders()"
                :show-select="key !== 'errors'" :item-selectable="isRowSelectable" :items-per-page="-1">
                <template v-slot:header.source="{ header }">
                    <router-link :to="'/student-profile/' + sourceStudentData.studentID" target="_blank">{{
                        getFormattedStudentInfo(sourceStudentData) }}<v-icon color="info"
                            :size="18">mdi-open-in-new</v-icon></router-link>
                </template>
                <template v-slot:header.target="{ header }">
                    <router-link :to="'/student-profile/' + targetStudentData.studentID" target="_blank"
                        append-icon="mdi-open-in-new">{{
                            getFormattedStudentInfo(targetStudentData) }}<v-icon color="info"
                            :size="18">mdi-open-in-new</v-icon></router-link>
                </template>
                <template v-slot:item.source="{ item }">
                    <div v-if="item.source != null" style="font-size: 0.875rem;">
                        <CourseReview :course="item.source" />
                    </div>                    
                </template>
                <template v-slot:item.target="{ item }">
                    <span v-if="item.target != null && !isRowSelected(key, item.source)" style="font-size: 0.875rem;">
                        <CourseReview :course="item.target" />
                    </span>
                    <div v-else-if="item.source != null && item.target != null && isRowSelected(key, item.source)"
                        style="font-size: 0.875rem;">
                        <div class="d-flex align-center text-disabled">
                            <v-icon small class="mr-1">mdi-minus-circle-outline</v-icon>
                            <CourseReview :course="item.target" />
                        </div>
                        <div class="d-flex align-center text-success">
                            <v-icon small class="mr-1">mdi-plus-circle-outline</v-icon>
                            <CourseReview :course="item.source" />
                        </div>
                    </div>
                    <div v-else-if="item.source != null && isRowSelected(key, item.source)" class="d-flex"
                        style="font-size: 0.875rem;">
                        <div class="d-flex align-center text-success">
                            <v-icon small class="mr-1">mdi-plus-circle-outline</v-icon>
                            <CourseReview :course="item.source" />
                        </div>
                    </div>                    
                </template>
            </v-data-table>
        </v-row>
    </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import CourseReview from "@/components/StudentProfile/Forms/wizard/common/CourseReview.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";

export default {
    name: "NonExaminableCourseMerge",
    components: {
        CourseReview,
    },
    setup() {
        return { v$: useVuelidate() };
    },
    computed: {
        ...mapState(useStudentStore, {
           nonExaminableCoursesToMerge: (state) => state.merge.nonExaminableCourses,
        }),
    },
    props: {
        sourceStudentData: {
            type: Object,
            required: true
        },
        targetStudentData: {
            type: Object,
            required: true
        },
        courseReconciliation: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            courseReconciliationProperties: {
                info: {
                    type: "info",
                    style: "text-success",
                    icon: "mdi-information",
                    headerSuffix: "Student Course(s) will be copied over from the Merged Student to the True Student"
                },
                conflicts: {
                    type: "warning",
                    style: "text-none",
                    icon: "mdi-alert",
                    headerSuffix: "Student Course(s) conflicts will be overridden on the True Student"
                },
                errors: {
                    type: "error",
                    style: "text-error",
                    icon: "mdi-close-circle", //mdi-block-helper
                    headerSuffix: "Student Course(s) will NOT be copied over from the Merged Student to the True Student due to associated exam results"
                }
            },
        };
    },
    mounted() {
    },
    validations() {
    },
    watch: {
    },
    methods: {
        courseMergeHeaders(key) {
            return [
                {
                    key: "selected",
                    title: "",
                    width: "2%",
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                },
                {
                    key: "source",
                    title: "Source Student",
                    sortable: false,
                    width: "50%",
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                },
                {
                    key: "target",
                    title: "Target Student",
                    width: "50%",
                    sortable: false,
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                },
            ];
        },
        getFormattedStudentInfo(studentData) {
            return `${studentData.pen} ${studentData.legalLastName}, ${studentData.legalFirstName}`;
        },
        getProperty(key, property) {
            const section = this.courseReconciliationProperties[key];
            if (section && property in section) {
                return section[property];
            }
            console.warn(`Property "${property}" not found in "${key}"`);
            return null;
        },
        isRowSelected(key, course) {           
            if (key === 'info' || key === 'conflicts' && course && this.nonExaminableCoursesToMerge[key].length > 0) {
                return this.nonExaminableCoursesToMerge[key].some(entry => entry.source.courseID === course?.courseID && entry.source.courseSession === course?.courseSession);
            }
            return false;
        },
        isRowSelectable(item) {
            return  item.source != null;
        }
    }
};
</script>
