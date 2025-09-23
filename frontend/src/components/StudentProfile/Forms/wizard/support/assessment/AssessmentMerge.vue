<template>
    <div v-for="(value, key) in assessmentReconciliation" :key="key">
        <v-row no-gutters v-if="value.length >= 0">
            <v-alert :type="getProperty(key, 'type')" :icon="getProperty(key, 'icon')" class="mb-4" border="start"
                elevation="2" variant="tonal">
                <div class="mb-2">
                    {{ assessmentsToMerge[key].length }} / {{ value.length }} {{ getProperty(key, 'headerSuffix') }}
                </div>
            </v-alert>
            <v-data-table v-if="value.length > 0" v-model="assessmentsToMerge[key]" :items="value"
                :item-value="(item) => item" class="mb-4" hide-default-footer :headers="assessmentMergeHeaders()"
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
                    <div v-if="item.source != null" style="font-size: 0.875rem;"
                        :class="{ 'text-disabled': !isRowSelectable(item) }">
                        <AssessmentReview :assessment="item.source" />
                    </div>
                </template>
                <template v-slot:item.target="{ item }">
                    <span v-if="item.target != null && !isRowSelected(key, item.source)" style="font-size: 0.875rem;"
                        :class="{ 'text-disabled': !isRowSelectable(item) }">
                        <AssessmentReview :assessment="item.target" />
                    </span>
                    <div v-else-if="item.source != null && item.target != null && isRowSelected(key, item.source)"
                        style="font-size: 0.875rem;">
                        <div class="d-flex align-center text-disabled">
                            <v-icon small class="mr-1">mdi-minus-circle-outline</v-icon>
                            <AssessmentReview :assessment="item.target" />
                        </div>
                        <div class="d-flex align-center text-success">
                            <v-icon small class="mr-1">mdi-plus-circle-outline</v-icon>
                            <AssessmentReview :assessment="item.source" />
                        </div>
                    </div>
                    <div v-else-if="item.source != null && isRowSelected(key, item.source)" class="d-flex"
                        style="font-size: 0.875rem;">
                        <div class="d-flex align-center text-success">
                            <v-icon small class="mr-1">mdi-plus-circle-outline</v-icon>
                            <AssessmentReview :assessment="item.source" />
                        </div>
                    </div>
                </template>
            </v-data-table>
        </v-row>
    </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import AssessmentReview from "@/components/StudentProfile/Forms/wizard/common/AssessmentReview.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";

export default {
    name: "AssessmentMerge",
    components: {
        AssessmentReview,
    },
    setup() {
        return { v$: useVuelidate() };
    },
    computed: {
        ...mapState(useStudentStore, {
            assessmentsToMerge: (state) => state.merge.assessments,
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
        assessmentReconciliation: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            assessmentReconciliationProperties: {
                info: {
                    type: "info",
                    style: "text-success",
                    icon: "mdi-information",
                    headerSuffix: "Student Assessment(s) will be copied over from the Merged Student to the True Student"
                },
                conflicts: {
                    type: "warning",
                    style: "text-none",
                    icon: "mdi-alert",
                    headerSuffix: "Student Assessment(s) conflicts will be overridden on the True Student"
                },
                errors: {
                    type: "error",
                    style: "text-error",
                    icon: "mdi-close-circle", //mdi-block-helper
                    headerSuffix: "Student Assessment(s) cannot be copied over if the TRUE PEN has an a proficiency score"
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
        assessmentMergeHeaders() {
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
            const section = this.assessmentReconciliationProperties[key];
            if (section && property in section) {
                return section[property];
            }
            console.warn(`Property "${property}" not found in "${key}"`);
            return null;
        },
        isRowSelected(key, assessment) {
            if (key === 'info' || key === 'conflicts' && assessment && this.assessmentsToMerge[key].length > 0) {
                return this.assessmentsToMerge[key].some(entry => entry.source.assessmentID === assessment?.assessmentID && entry.source.assessmentSession === assessment?.assessmentSession);
            }
            return false;
        },
        isRowSelectable(item) {
            return item.source != null && !this.checkIfAssessmentsAreSame(item.source, item.target);
        },
        checkIfAssessmentsAreSame(source, target) {
            if (source && target) {
                const keysToCompare = ["assessmentID", "assessmentTypeCode", "sessionID", "proficiencyScore", "provincialSpecialCaseCode", "wroteFlag", "assessmentCenterSchoolID"];
                return this.areValuesEqual(source, target, keysToCompare);
            }
            return false;
        },
        areValuesEqual(obj1, obj2, keys) {
            return keys.every(key => obj1[key] === obj2[key]);
        }
    }
};
</script>
