<template>
    <v-data-table class="mb-4" hide-default-footer dense :headers="courseMergeHeaders" :items-per-page="-1"
        v-model="tableItems" :items="tableItems" :item-value="(item) => item">
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
            <span style="font-size: 0.875rem;">
                <v-textarea label="Add note:" placeholder="Max 255 Characters" variant="outlined"
                    v-model="item.source.note"></v-textarea>
            </span>
        </template>
        <template v-slot:item.target="{ item }">
            <span style="font-size: 0.875rem;">
                <v-textarea label="Add note:" placeholder="Max 255 Characters" variant="outlined"
                    v-model="item.target.note"></v-textarea>
            </span>
        </template>
    </v-data-table>
    <div class="d-flex flex-column" style="position: relative;margin-top: -3.125rem;">
    <v-checkbox v-model="notesToMerge.mergeCompleted">
        <template v-slot:label>
            <strong>I acknowledge that the merging of student data has been completed</strong>
        </template>
    </v-checkbox>
    </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
    name: "StudentMergeConfirmation",
    components: {
    },
    setup() {
        return { v$: useVuelidate() };
    },
    computed: {
        ...mapState(useStudentStore, {
            notesToMerge: (state) => state.merge.note
        }),
        ...mapState(useStudentStore, {
            studentMergeTimestamp: (state) => state.student.auditHistory.sort((a, b) => a.updateDate - b.updateDate).find(audit => audit.studentStatus === "MER").updateDate
        }),
        tableItems() {
            return [
                { source: this.sourceStudentNote, target: this.targetStudentNote }
            ];
        }
    },
    props: {
        sourceStudentData: {
            type: Object,
            required: true
        },
        targetStudentData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            mergeCompleted: false,
            sourceStudentNote: {
                note: this.getDefaultNote(),
                studentID: this.sourceStudentData.studentID
            },
            targetStudentNote: {
                note: this.getDefaultNote(),
                studentID: this.targetStudentData.studentID
            },            
            courseMergeHeaders: [
                {
                    key: "source",
                    title: "Source Student",
                    sortable: false,
                    width: "45%",
                    cellProps: {
                        class: "pa-0 mr-2 py-5",
                    },
                },
                {
                    key: "empty",
                    title: "",
                    sortable: false,
                    width: "2%",
                    cellProps: {
                        class: "pa-0 mr-2 py-5",
                    },
                },
                {
                    key: "target",
                    title: "Target Student",
                    width: "45%",
                    sortable: false,
                    cellProps: {
                        class: "pa-0 mr-2 py-5",
                    },
                },
            ]
        };
    },
    mounted() {
        this.notesToMerge.source = this.sourceStudentNote;
        this.notesToMerge.target = this.targetStudentNote;
    },
    validations() {
    },
    watch: {
        'sourceStudentNote.note'(newVal) {
            this.notesToMerge.source = this.sourceStudentNote;
        },
        'targetStudentNote.note'(newVal) {
            this.notesToMerge.target = this.targetStudentNote;
        },
    },
    methods: {
        getFormattedStudentInfo(studentData) {
            return `${studentData.pen} ${studentData.legalLastName}, ${studentData.legalFirstName}`;
        },
        getDefaultNote() {
            return "The reconciliation of data between the merged PEN " + this.sourceStudentData.pen
                + " and the true PEN " + this.targetStudentData.pen + " has been completed.";
        }
    },
};
</script>
