import { defineStore } from "pinia";
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";

export const useCourseStore = defineStore("course", {
    namespaced: true,
    snackbarStore: useSnackbarStore(),
    state: () => ({
        courseRestrictions: [],
        courseRestriction: {
            courseRestrictionId: "",
            mainCourse: "",
            mainCourseLevel: "",
            restrictedCourse: "",
            restrictedCourseLevel: "",
            restrictionStartDate: "",
            restrictionEndDate: ""
        },
        courseRestrictionToSave: {
            courseRestrictionId: "", //Will be set ONLY when updating
            mainCourse: {},
            restrictedCourse: {},
            restrictionStartDate: "",
            restrictionEndDate: "",
            hasValidationError: true,
        },
    }),
    actions: {
        clearCourseRestriction() {
            this.courseRestriction = {
                courseRestrictionId: "",
                mainCourse: "",
                mainCourseLevel: "",
                restrictedCourse: "",
                restrictedCourseLevel: "",
                restrictionStartDate: "",
                restrictionEndDate: ""
            };
            this.courseRestrictionToSave = {
                courseRestrictionId: "", //Will be set ONLY when updating
                mainCourse: {},
                restrictedCourse: {},
                restrictionStartDate: "",
                restrictionEndDate: "",
                hasValidationError: true,
        };
        },
        // Save course restriction
        async createCourseRestriction(courseRestrictionToSave) {
            try {
                this.populateCourseRestriction(courseRestrictionToSave)
                const response = await CourseService.createCourseRestriction(this.courseRestriction);
                return response.data;
            } catch (error) {
                console.error("Error saving course restriction: ", error);
                return error;
            }
        },
        // Save course restriction
        async updateCourseRestriction(courseRestrictionToSave) {
            try {
                this.populateCourseRestriction(courseRestrictionToSave)
                const response = await CourseService.updateCourseRestriction(courseRestrictionToSave.courseRestrictionId, this.courseRestriction);
                return response.data;
            } catch (error) {
                console.error("Error saving course restriction: ", error);
                return error;
            }
        },
        // Get course restrictions
        async getCourseRestrictions() {
            try {
                const response = await CourseService.getCourseRestrictions();
                this.courseRestrictions = response.data;
                return response.data;
            } catch (error) {
                console.error("Error fetching course restrictions: ", error);
                this.snackbarStore.showError("Failed to fetch course restrictions.");
                return error;
            }
        },
        populateCourseRestriction(courseRestrictionValue) {
            this.courseRestriction.mainCourse = courseRestrictionValue.mainCourse?.courseCode;
            this.courseRestriction.mainCourseLevel = courseRestrictionValue.mainCourse?.courseLevel;
            this.courseRestriction.restrictedCourse = courseRestrictionValue.restrictedCourse?.courseCode;
            this.courseRestriction.restrictedCourseLevel = courseRestrictionValue.restrictedCourse?.courseLevel;
            this.courseRestriction.restrictionStartDate = courseRestrictionValue.restrictionStartDate;
            this.courseRestriction.restrictionEndDate = courseRestrictionValue.restrictionEndDate;
        }
    },
})