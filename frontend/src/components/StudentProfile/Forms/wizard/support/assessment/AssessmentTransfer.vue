<template>
    <div v-for="(value, key) in assessmentReconciliation" :key="key">
        <v-row no-gutters v-if="value.length >= 0">

            <v-alert :type="getProperty(key, 'type')" class="mb-4" border="start" elevation="2" variant="tonal">
                <div class="mb-2">
                    {{ value.length }} / {{ totalNoOfAssessments }} {{ getProperty(key, 'headerSuffix') }}
                </div>
            </v-alert>
            <v-data-table v-if="value.length > 0" :items="value" class="mb-4" hide-default-footer
                :headers="assessmentTransferHeaders(key)" :items-per-page="-1">
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
                    <div style="max-width:98%;font-size: 0.875rem;">
                        <AssessmentReview :assessment="item.source" />
                    </div>
                </template>
                <template v-slot:item.target="{ item }">
                    <span v-if="item.target" style="max-width:98%;font-size: 0.875rem;">
                        <AssessmentReview :assessment="item.target" />
                    </span>
                    <span v-else :class="getProperty(key, 'style')" style="font-size: 1rem;">{{ item.message }}</span>
                </template>
                <template v-if="key === 'info'" v-slot:item.delete="{ item }">
                    <v-btn @click="removeAssessmentInfo(item.source)" color="error" icon="mdi-close-circle"
                        variant="text" class="float-center">
                    </v-btn>
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
    name: "AssessmentTransfer",
    components: {
        AssessmentReview,
    },
    setup() {
        return { v$: useVuelidate() };
    },
    computed: {
        ...mapState(useStudentStore, {
            assessmentsToTransfer: (state) => state.transfer.assessments,
        }),
        totalNoOfAssessments() {
            return (
                this.assessmentReconciliation.info.length +
                this.assessmentReconciliation.conflicts.length +
                this.assessmentReconciliation.errors.length ||
                0
            );
        },
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
                    headerSuffix: "assessments can be transferred"
                },
                conflicts: {
                    type: "warning",
                    style: "text-none",
                    headerSuffix: "assessments have conflicts and cannot be transferred"
                },
                errors: {
                    type: "error",
                    style: "text-error",
                    headerSuffix: "assessments have errors and cannot be transferred"
                }
            }
        };
    },
    mounted() {
        if (this.assessmentReconciliation?.info?.length) {
            this.assessmentReconciliation.info.forEach((item) => {
                const source = item.source;
                if (source) {
                    this.addAssessmentsToTransfer(source);
                }
            });
        }
    },
    validations() {
    },
    watch: {
    },
    methods: {
        ...mapActions(useStudentStore, [
            "addAssessmentsToTransfer",
            "removeAssessmentFromTransfer",
        ]),
        assessmentTransferHeaders(key) {
            let transferHeaders = [
                {
                    key: "source",
                    title: "Source Student",
                    sortable: false,
                    width: key === 'info' ? "64%" : "60%",
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                },
                {
                    key: "target",
                    title: "Target Student",
                    width: key === 'info' ? "38%" : "40%",
                    sortable: false,
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                },
            ];
            if (key === 'info') {
                transferHeaders.push({
                    key: "delete",
                    title: "Remove",
                    width: "2%",
                    sortable: false,
                    cellProps: {
                        class: "pa-0 mr-2",
                    },
                });
            }
            return transferHeaders;
        },
        getFormattedStudentInfo(studentData) {
            return `${studentData.pen} ${studentData.legalLastName}, ${studentData.legalFirstName}`;
        },
        removeAssessmentInfo(item) {
            this.assessmentReconciliation.info = this.assessmentReconciliation.info.filter(assessment => !(assessment.source.assessmentID === item.assessmentID && assessment.source.assessmentSession === item.assessmentSession));
            this.removeAssessmentFromTransfer(item.assessmentID, item.assessmentSession);
        },
        getProperty(key, property) {
            const section = this.assessmentReconciliationProperties[key];
            if (section && property in section) {
                return section[property];
            }
            console.warn(`Property "${property}" not found in "${key}"`);
            return null;
        }
    }
};
</script>
