import { defineStore } from "pinia";
import { useSnackbarStore } from "../../store/modules/snackbar";
import CourseService from "@/services/CourseService.js";

const initialState = () => ({
    courseRestrictions: [],
    courseRestrictionToSave: {
        courseRestrictionId: "", //Will be set during UPDATE
        mainCourse: {},
        restrictedCourse: {},
        restrictionStartDate: "",
        restrictionEndDate: "",
        hasValidationError: true,
    }
});
export const useCourseStore = defineStore("course", {
    namespaced: true,
    state: () => ({       
        courseRestrictions : initialState().courseRestrictions,
        courseRestrictionToSave : initialState().courseRestrictionToSave       
    }),
    getters: {
        getCourseRestrictions: (state) => state.courseRestrictions,
    },
    actions: {
        clearCourseRestriction() {
            this.$patch(state => {
                state.courseRestrictionToSave = { ...initialState().courseRestrictionToSave };
            });
        },
        // Save course restriction
        async createCourseRestriction(courseRestriction) {
            try {
                const response = await CourseService.createCourseRestriction(this.toCourseRestrictionPayload(courseRestriction));
                return response.data;
            } catch (error) {
                console.error("Error creating course restriction: ", error);
                return error;
            }
        },
        // Save course restriction
        async updateCourseRestriction(courseRestriction) {
            try {
                const response = await CourseService.updateCourseRestriction(courseRestriction.courseRestrictionId, this.toCourseRestrictionPayload(courseRestriction));
                return response.data;
            } catch (error) {
                console.error("Error updating course restriction: ", error);
                return error;
            }
        },
        // Get course restrictions
        async loadCourseRestrictions() {
            try {
                const response = await CourseService.getCourseRestrictions();
                this.courseRestrictions = response.data;
                return response.data;
            } catch (error) {
                console.error("Error fetching course restrictions: ", error);
                useSnackbarStore().showError("Failed to fetch course restrictions.");
                return error;
            }
        },
        toCourseRestrictionPayload(courseRestriction) {
            return {
                mainCourse: courseRestriction.mainCourse?.courseCode,
                mainCourseLevel: courseRestriction.mainCourse?.courseLevel,
                restrictedCourse: courseRestriction.restrictedCourse?.courseCode,
                restrictedCourseLevel: courseRestriction.restrictedCourse?.courseLevel,
                restrictionStartDate: courseRestriction.restrictionStartDate,
                restrictionEndDate: courseRestriction.restrictionEndDate
            }
        },
    },
})