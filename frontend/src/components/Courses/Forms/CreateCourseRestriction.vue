<template>
  <div>
    <v-btn class="float-right" color="primary" @click="dialog = true">
      + Add Course Restriction
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Add Course Restriction</span>
        </v-card-title>

        <v-form ref="restrictionForm">
          <v-card-text>
            <v-stepper v-model="step">
              <v-stepper-header>
                <v-stepper-item :value="1" title="Restriction Details" />
                <v-divider />
                <v-stepper-item :value="2" title="Confirmation" />
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item :value="1">
                  <p>Enter Main Course</p>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="mainCourseCode"
                        label="Course Code"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="mainCourseLevel"
                        label="Course Level"
                      />
                    </v-col>
                  </v-row>
                  <v-card v-if="mainCourseInfo.courseName == 'NOT FOUND'">
                    NOT FOUND
                  </v-card>
                  <v-card
                    variant="tonal"
                    class="mt-4"
                    v-else-if="mainCourseInfo.courseName"
                  >
                    <v-card-title> </v-card-title>
                    <v-card-text>
                      <div class="d-flex align-center p-0 m-0">
                        <strong>{{ mainCourseInfo.courseName }}</strong>
                        <v-spacer></v-spacer>
                        <OpenStatusBadge
                          :openedDateString="mainCourseInfo.startDate"
                          :closedDateString="mainCourseInfo.endDate"
                        />
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <p>
                            <strong>Code:</strong>
                            {{ mainCourseInfo.courseCode }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>Start Date:</strong>
                            {{ mainCourseInfo.startDate }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>End Date:</strong>
                            {{ mainCourseInfo.endDate }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>Level:</strong>
                            {{ mainCourseInfo.courseLevel }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <p class="mt-6">Enter Restricted Course</p>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="restrictedCourseCode"
                        label="Course Code"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="restrictedCourseLevel"
                        label="Course Level"
                      />
                    </v-col>
                  </v-row>

                  <v-card
                    variant="tonal"
                    class="mt-4"
                    v-if="restrictedCourseInfo"
                  >
                    <v-card-title>
                      <strong>Restricted Course Information</strong>
                    </v-card-title>
                    <v-card-text>
                      <div class="d-flex align-center p-0 m-0">
                        <strong>{{ restrictedCourseInfo.courseName }}</strong>
                        <v-spacer></v-spacer>
                        <OpenStatusBadge
                          :openedDateString="restrictedCourseInfo.startDate"
                          :closedDateString="restrictedCourseInfo.endDate"
                        />
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <p>
                            <strong>Code:</strong>
                            {{ restrictedCourseInfo.courseCode }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>Start Date:</strong>
                            {{ restrictedCourseInfo.startDate }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>End Date:</strong>
                            {{ restrictedCourseInfo.endDate }}
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <p>
                            <strong>Level:</strong>
                            {{ restrictedCourseInfo.courseLevel }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <p>Enter Restriction Start and End Dates</p>
                  <v-row>
                    <v-col>
                      <v-text-field label="Restriction Start Date" />
                    </v-col>
                    <v-col>
                      <v-text-field label="Restriction End Date" />
                    </v-col>
                  </v-row>
                </v-stepper-window-item>

                <v-stepper-window-item :value="2">
                  <v-card class="pa-4">
                    <v-card-title class="text-h6">
                      Confirm Course Information
                    </v-card-title>

                    <v-card-text>
                      <v-row>
                        <v-col cols="6">
                          <h4 class="text-subtitle-1 font-weight-medium">
                            Main Course
                          </h4>
                          <p>
                            <strong>Name:</strong>
                            {{ mainCourseInfo.courseName }}
                          </p>
                          <p>
                            <strong>Code:</strong>
                            {{ mainCourseInfo.courseCode }}
                          </p>
                          <p>
                            <strong>Level:</strong>
                            {{ mainCourseInfo.courseLevel }}
                          </p>
                        </v-col>

                        <v-col cols="6">
                          <h4 class="text-subtitle-1 font-weight-medium">
                            Restricted Course
                          </h4>
                          <p>
                            <strong>Name:</strong>
                            {{ restrictedCourseInfo.courseName }}
                          </p>
                          <p>
                            <strong>Code:</strong>
                            {{ restrictedCourseInfo.courseCode }}
                          </p>
                          <p>
                            <strong>Level:</strong>
                            {{ restrictedCourseInfo.courseLevel }}
                          </p>
                        </v-col>
                      </v-row>

                      <v-list density="compact" class="pt-0">
                        <v-list-item>
                          <v-list-item-title>Start Date</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ restrictedCourseInfo.startDate }}
                          </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-title>End Date</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ restrictedCourseInfo.endDate }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>
              </v-stepper-window>
            </v-stepper>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn v-if="step > 1" @click="step--">Back</v-btn>
            <v-btn v-if="step < 2" color="primary" @click="step++">Next</v-btn>
            <v-btn v-else color="success" @click="submit">Finish</v-btn>
            <v-btn text @click="cancel">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { useAccessStore } from "@/store/modules/access";
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";
import { mapState } from "pinia";

export default {
  name: "CourseRestrictions",
  components: { OpenStatusBadge },
  data() {
    return {
      dialog: false,
      step: 1,
      mainCourseCode: "",
      mainCourseLevel: "",
      mainCourseInfo: "",
      restrictedCourseCode: "",
      restrictedCourseLevel: "",
      restrictedCourseInfo: "",
      snackbarStore: useSnackbarStore(),

      // placeholders for debounced functions
      debouncedFetchMainCourse: null,
      debouncedFetchRestrictedCourse: null,
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
  created() {
    this.debouncedFetchMainCourse = debounce(this.triggerCourseFetch, 400);
    this.debouncedFetchRestrictedCourse = debounce(
      this.triggerRestrictedCourseFetch,
      400
    );
  },
  watch: {
    mainCourseCode() {
      this.mainCourseInfo = "";
      this.debouncedFetchMainCourse();
    },
    mainCourseLevel() {
      this.mainCourseInfo = "";
      this.debouncedFetchMainCourse();
    },
    restrictedCourseCode() {
      this.restrictedCourseInfo = "";
      this.debouncedFetchRestrictedCourse();
    },
    restrictedCourseLevel() {
      this.restrictedCourseInfo = "";
      this.debouncedFetchRestrictedCourse();
    },
  },
  methods: {
    async triggerCourseFetch() {
      if (this.mainCourseCode && this.mainCourseLevel) {
        try {
          const response = await CourseService.getCourseByCodeAndLevel(
            this.mainCourseCode,
            this.mainCourseLevel
          );

          if (response.data?.courseName) {
            this.mainCourseInfo = response.data;
            console.log("1");
          } else {
            this.mainCourseInfo = { courseName: "NOT FOUND" };
            console.log("2");
          }
        } catch (error) {
          if (error.response?.status === 404) {
            this.mainCourseInfo = { courseName: "NOT FOUND" };
            console.log("404 - Course Not Found");
          } else {
            console.error("Error fetching course:", error);
            this.mainCourseInfo = { courseName: "ERROR" };
          }
        }
      } else {
        this.mainCourseInfo = "";
        console.log("3");
      }
    },
    async triggerRestrictedCourseFetch() {
      if (this.restrictedCourseCode && this.restrictedCourseLevel) {
        try {
          const response = await CourseService.getCourseByCodeAndLevel(
            this.restrictedCourseCode,
            this.restrictedCourseLevel
          );

          if (response.data?.courseName) {
            this.restrictedCourseInfo = response.data;
          } else {
            this.restrictedCourseInfo = { courseName: "NOT FOUND" };
          }
        } catch (error) {
          if (error.response?.status === 404) {
            this.restrictedCourseInfo = { courseName: "NOT FOUND" };
            console.log("404 - Restricted Course Not Found");
          } else {
            console.error("Error fetching restricted course:", error);
            this.restrictedCourseInfo = { courseName: "ERROR" };
          }
        }
      } else {
        this.restrictedCourseInfo = "";
      }
    },
    cancel() {
      this.dialog = false;
      this.resetForm();
    },
    resetForm() {
      this.step = 1;
      this.mainCourseCode = "";
      this.mainCourseLevel = "";
      this.mainCourseInfo = "";
      this.restrictedCourseCode = "";
      this.restrictedCourseLevel = "";
      this.restrictedCourseInfo = "";
    },
    submit() {
      // Submit logic here
    },
  },
};
</script>

<style scoped></style>
