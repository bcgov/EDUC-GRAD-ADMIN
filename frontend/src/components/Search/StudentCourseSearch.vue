.<template>
  <div class="course-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="student-status"
            v-model="searchParams.studentStatus"
            label="Student Status"
            :items="studentStatusOptions"
            variant="outlined"
            clearable
            density="compact"
            v-on:keyup="keyHandler"
          ></v-select>
        </div>
        <div class="course-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolOfRecordSchoolID"
            :disabled="false"
            label="School of Record"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-autocomplete
            id="district-of-record"
            v-model="searchParams.districtOfRecord"
            label="District of Record"
            :items="districtsList"
            :item-title="districtTitle"
            item-value="districtNumber"
            variant="outlined"
            clearable
            density="compact"
            v-on:keyup="keyHandler"
          ></v-autocomplete>
        </div>
        <div class="course-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolAtGraduationSchoolID"
            :disabled="false"
            label="School at Graduation"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-autocomplete
            id="grade"
            label="Grade"
            :items="studentGradeCodes.sort((a, b) => a.studentGradeCode.localeCompare(b.studentGradeCode))"
            item-title="studentGradeCode"
            item-value="studentGradeCode"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.grade"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-autocomplete
            id="program"
            label="Program"
            :items="programOptions"
            item-title="programCode"
            item-value="programCode"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.program"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="program-complete"
            label="Program Complete?"
            :items="programCompleteOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.programComplete"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-auto">
          <v-text-field
            id="completion-date-from"
            label="Completion Date From"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.completionDateFrom"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-auto">
          <v-text-field
            id="completion-date-to"
            label="Completion Date To"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.completionDateTo"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-autocomplete
            id="course"
            label="Course"
            :items="courseOptions"
            :item-title="courseTitle"
            item-value="courseID"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.courseID"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="associated-exam"
            label="Associated Exam?"
            :items="yesNoOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.associatedExam"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="final-letter-grade"
            label="Final Letter Grade?"
            :items="yesNoOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.finalLetterGrade"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-auto">
          <v-text-field
            id="course-session-from"
            label="Course Session From"
            variant="outlined"
            density="compact"
            type="month"
            class="form__input"
            v-model="searchParams.courseSessionFrom"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-auto">
          <v-text-field
            id="course-session-to"
            label="Course Session To"
            variant="outlined"
            density="compact"
            type="month"
            class="form__input"
            v-model="searchParams.courseSessionTo"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="equivalency-challenge"
            label="Equivalency/Challenge"
            :items="equivalencyChallengeOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.equivalencyChallenge"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="course-search-field col-12 col-md-2">
          <v-select
            id="fine-arts-applied-skill"
            label="Fine Arts/Applied Skill"
            :items="fineArtsAppliedSkillOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.fineArtsAppliedSkill"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
      </v-row>
      <v-row>
        <div class="course-search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="course-search-submit"
            v-on:click="onSearchClicked"
            :loading="searchLoading"
            :disabled="searchLoading"
            variant="flat"
            color="primary"
            class="text-none"
            >Search</v-btn
          >
          <v-btn
            class="mx-2 text-none"
            id="course-search-reset-button"
            color="primary"
            variant="outlined"
            @click="clearInput"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </v-form>
    <div v-if="searchMessage" class="d-flex align-center mt-8 mb-2">
      <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="ml-1 py-3 width-fit-content"
        :text="`${searchMessage}`"
      ></v-alert>
      <v-spacer></v-spacer>
      <div class="export-link-container">
        <a
          id="export-results-link"
          @click="totalElements > 0 && !downloadLoading ? downloadReport() : null"
          :class="{ 'disabled-link': totalElements === 0, 'loading-link': downloadLoading }"
          class="export-results-link"
        >
          <v-progress-circular
            v-if="downloadLoading"
            indeterminate
            size="16"
            width="2"
            color="rgb(56, 89, 138)"
            class="mr-1"
          ></v-progress-circular>
          <v-icon v-else size="small" class="mr-1">mdi-download</v-icon>
          <span>Export Results</span>
        </a>
      </div>
    </div>

    <transition name="fade">
      <div v-if="totalPages > 0 && hasSearched" class="table-responsive">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :headers="searchResultsHeaders"
          :items="searchResults"
          :items-length="totalElements"
          :loading="searchLoading"
          item-value="id"
          @update:options="updateDataTable"
        >
          <template v-slot:item.pen="{ item }">
            <router-link :to="'/student-profile/' + item.studentID">
              {{ item.pen }}
            </router-link>
          </template>
        </v-data-table-server>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { courseSearchStore } from "@/store/modules/courseSearch";
import { useSnackbarStore } from "@/store/modules/snackbar";
import StudentCourseService from "@/services/StudentCourseService";
import SchoolSelect from "@/components/Search/SchoolSelect.vue";

export default {
  name: "StudentCourseSearch",
  components: {
    SchoolSelect,
  },
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  data() {
    return {
      searchResults: [],
      currentPage: 1,
      itemsPerPage: 10,
      hasSearched: false,
      itemsPerPageOptions: [
        { title: "10", value: 10 },
        { title: "25", value: 25 },
        { title: "50", value: 50 },
        { title: "100", value: 100 },
      ],
      totalPages: "",
      searchMessage: "",
      errorMessage: "",
      searchLoading: false,
      downloadLoading: false,
      totalElements: "",
      studentStatusOptions: [
        { title: "Current", value: "CUR" },
        { title: "Archived", value: "ARC" },
        { title: "Deceased", value: "DEC" },
        { title: "Merged", value: "MER" },
        { title: "Terminated", value: "TER" },
      ],
      programCompleteOptions: [
        { title: "Yes", value: "yes" },
        { title: "No", value: "no" },
      ],
      yesNoOptions: [
        { title: "Yes", value: "yes" },
        { title: "No", value: "no" },
      ],
      equivalencyChallengeOptions: [
        { title: "Equivalency", value: "equivalency" },
        { title: "Challenge", value: "challenge" },
      ],
      fineArtsAppliedSkillOptions: [
        { title: "Fine Arts", value: "fineArts" },
        { title: "Applied Skills", value: "appliedSkills" },
        { title: "Both", value: "both" },
      ],
      searchResultsHeaders: [
        {
          key: "pen",
          title: "PEN",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentStatus",
          title: "Student Status",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "surname",
          title: "Surname",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "birthdate",
          title: "Birthdate",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "grade",
          title: "Grade",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "program",
          title: "Program",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "completionDate",
          title: "Completion Date",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordCode",
          title: "School of Record Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordName",
          title: "School of Record Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfGraduationCode",
          title: "School of Graduation Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfGraduationName",
          title: "School of Graduation Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "courseCode",
          title: "Course Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "courseLevel",
          title: "Course Level",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "courseSession",
          title: "Course Session",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "interimPercent",
          title: "% Interim",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "interimLG",
          title: "Interim LG",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "finalPercent",
          title: "Final %",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "finalLG",
          title: "Final LG",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "credits",
          title: "Credits",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "equivChall",
          title: "Equiv./Chall",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "fineArtsAppSkill",
          title: "Fine Arts App. Skill",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "hasExam",
          title: "Has Exam?",
          sortable: false,
          editable: false,
          class: "w-1",
        },
      ],
    };
  },
  computed: {
    ...mapState(courseSearchStore, ["searchParams"]),
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      schoolByMincode: "schoolByMincode",
      districtsList: "getDistrictList",
      studentGradeCodes: "studentGradeCodes",
      programOptions: "programOptions",
    }),
    courseOptions() {
      return this.appStore.getCoregCourses.slice().sort((a, b) => {
        return a.externalCode.localeCompare(b.externalCode);
      });
    },
  },
  created() {
    this.appStore = useAppStore();
  },
  methods: {
    courseTitle(item) {
      if (item) {
        return `${item.externalCode}`;
      }
      return "";
    },
    apiSearchParamsBuilder() {
      const apiSearchParams = {};
      const searchKeys = Object.keys(this.searchParams).filter((k) => {
        const value = this.searchParams[k];
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return !(Array.isArray(value) && value.length === 0);
      });
      searchKeys.forEach((key) => {
        if (key === "districtOfRecord") {
          const districtNumber = this.searchParams[key];

          // Find the district object to get its districtId
          const district = this.districtsList.find(d => d.districtNumber === districtNumber);

          if (!district) {
            return;
          }

          const districtId = district.districtId;

          // Filter schools by districtId (UUID)
          const schoolsInDistrict = this.getSchoolsList.filter(
            (school) => school.districtId === districtId
          );

          const schoolIds = schoolsInDistrict.map((school) => school.schoolId).join(",");

          if (schoolIds) {
            apiSearchParams[key] = schoolIds;
          }
        } else {
          apiSearchParams[key] = Array.isArray(this.searchParams[key])
            ? this.searchParams[key].join(",")
            : this.searchParams[key];
        }
      });
      return apiSearchParams;
    },

    clearInput: function () {
      this.searchResults = [];
      this.searchMessage = "";
      this.hasSearched = false;
      courseSearchStore().clearSearchParams();
    },

    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
      }
    },


    onSearchClicked() {
      this.hasSearched = true;
      this.search();
    },

    schoolTitle(item) {
      if (item) {
        const status = item.closedDate ? "Closed" : "Open";
        return `${item.mincode} - ${item.displayName} (${status})`;
      } else {
        return null;
      }
    },

    districtTitle(item) {
      if (item) {
        const status = item.districtStatusCode === "ACTIVE" ? "Open" : "Closed";
        return `${item.districtNumber} - ${item.displayName} (${status})`;
      } else {
        return null;
      }
    },

    search() {
      if (!this.hasSearched) {
        return;
      }
      this.searchLoading = true;
      let sort = {};
      StudentCourseService.getStudentCoursesBySearchCriteria(
        this.apiSearchParamsBuilder(),
        sort,
        this.currentPage,
        this.itemsPerPage
      )
        .then((response) => {
          if (response.data) {
            this.responseContent = response.data;
            // Transform the data to match our table structure
            this.searchResults = this.responseContent?.content?.map(item => this.transformCourseData(item)) || [];
            this.totalElements = this.responseContent.totalElements;
            this.totalPages = this.responseContent.totalPages;
            this.searchMessage =
              this.responseContent.totalElements === 1
                ? "1 result found"
                : this.totalElements + " results found";
          }
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Course Service: " +
                error?.response?.status
            );
          }
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },

    transformCourseData(item) {
      // Look up course code and level from coreg cache using courseID
      let courseCode = '';
      let courseLevel = '';

      if (item.courseID) {
        const courseIDStr = item.courseID.toString();
        // Look up in coreg cache
        const course = this.appStore.getCoregCourseById(courseIDStr);

        if (course) {
          courseCode = course.courseCode || '';
          courseLevel = course.courseLevel || '';
        } else {
          // If not found in cache, just show the courseID
          courseCode = courseIDStr;
          courseLevel = '';
        }
      }

      const courseSession = item.courseSession ?
        `${item.courseSession.substring(0, 4)}-${item.courseSession.substring(4, 6)}` : '';

      const birthdate = item.gradStudent?.dob ?
        new Date(item.gradStudent.dob).toISOString().split('T')[0] : '';

      const completionDate = item.gradStudent?.programCompletionDate ?
        new Date(item.gradStudent.programCompletionDate).toISOString().split('T')[0] : '';

      const equivChall = item.equivOrChallenge === 'E' ? 'E' :
                         item.equivOrChallenge === 'C' ? 'C' : '';

      const fineArtsAppSkill = item.fineArtsAppliedSkillsCode === 'F' ? 'F' :
                               item.fineArtsAppliedSkillsCode === 'A' ? 'A' :
                               item.fineArtsAppliedSkillsCode === 'B' ? 'B' : '';

      const hasExam = item.studentExamId ? 'Yes' : 'No';

      const statusMap = {
        'CUR': 'Current',
        'ARC': 'Archived',
        'DEC': 'Deceased',
        'MER': 'Merged',
        'TER': 'Terminated'
      };
      const studentStatus = statusMap[item.gradStudent?.studentStatus] || item.gradStudent?.studentStatus;

      let schoolOfRecordName = '';
      let schoolOfGraduationName = '';

      if (item.gradStudent?.schoolOfRecord) {
        const school = this.schoolByMincode(item.gradStudent.schoolOfRecord);
        if (school) {
          schoolOfRecordName = school.displayName || '';
        }
      }

      if (item.gradStudent?.schoolAtGraduation) {
        const school = this.schoolByMincode(item.gradStudent.schoolAtGraduation);
        if (school) {
          schoolOfGraduationName = school.displayName || '';
        }
      }

      return {
        studentID: item.gradStudent?.studentID,
        pen: item.gradStudent?.pen,
        studentStatus: studentStatus,
        surname: item.gradStudent?.legalLastName,
        birthdate: birthdate,
        grade: item.gradStudent?.studentGrade,
        program: item.gradStudent?.program,
        completionDate: completionDate,
        schoolOfRecordCode: item.gradStudent?.schoolOfRecord,
        schoolOfRecordName: schoolOfRecordName,
        schoolOfGraduationCode: item.gradStudent?.schoolAtGraduation,
        schoolOfGraduationName: schoolOfGraduationName,
        courseCode: courseCode,
        courseLevel: courseLevel,
        courseSession: courseSession,
        interimPercent: item.interimPercent,
        interimLG: item.interimLetterGrade,
        finalPercent: item.finalPercent,
        finalLG: item.finalLetterGrade,
        credits: item.credits,
        equivChall: equivChall,
        fineArtsAppSkill: fineArtsAppSkill,
        hasExam: hasExam
      };
    },


    updateDataTable({ page }) {
      this.currentPage = page;
      this.search();
    },

    downloadReport() {
      this.downloadLoading = true;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;
      const defaultFilename = `StudentCourseSearch-${dateStr}.csv`;

      StudentCourseService.downloadCourseStudentSearchReport(
        this.apiSearchParamsBuilder()
      )
        .then((response) => {
          if (response.data) {
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', defaultFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            this.snackbarStore.showSnackbar(
              "Report downloaded successfully",
              "success",
              5000
            );
          }
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error downloading the report: " +
                error?.response?.status
            );
          } else {
            this.snackbarStore.showSnackbar(
              "Failed to download report",
              "error",
              5000
            );
          }
        })
        .finally(() => {
          this.downloadLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.table th {
  border-bottom: 2px solid #5475a7;
}

.course-search-form {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}

.course-search-field {
  padding-right: 10px;
}

.course-search-field label {
  float: left;
  clear: both;
}

.course-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.course-search-button {
  margin-top: 32px;
  padding-left: 5px;
}

.export-link-container {
  padding-right: 15px;
}

.export-results-link {
  color: rgb(56, 89, 138) !important;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.export-results-link:hover:not(.disabled-link):not(.loading-link) {
  color: rgb(41, 66, 102);
}

.export-results-link.disabled-link {
  color: rgba(0, 0, 0, 0.38) !important;
  cursor: default;
  pointer-events: none;
}

.export-results-link.loading-link {
  cursor: default;
  pointer-events: none;
}
</style>

