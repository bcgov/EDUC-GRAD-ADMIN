<template>
  <div v-if="student">
    <v-btn
      variant="plain"
      color="error"
      v-ripple
      @click="
        studentStore.studentDialog =
          !studentStore.studentDialog && (showAdopt = true)
      "
      class="v-btn-link text-left px-0 d-block"
      v-if="more"
    >
      more
    </v-btn>
    <v-dialog v-model="studentStore.studentDialog" max-width="600px">
      <v-card>
        <v-card-title
          ><v-row no-gutters>
            <div class="mt-2 ml-2">PEN Demographics - Adopt Student</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              @click="studentStore.studentDialog = !studentStore.studentDialog"
              class="mt-2"
            />
          </v-row>
        </v-card-title>
        <v-card-text>
          <div class="my-1"><strong>PEN: </strong>{{ student.pen }}</div>
          <div class="my-1">
            <strong>Legal First Name: </strong>{{ student.legalFirstName }}
          </div>
          <div class="my-1">
            <strong>Legal Middle Names: </strong>{{ student.legalMiddleNames }}
          </div>
          <div class="my-1">
            <strong>Legal Last Names: </strong>{{ student.legalLastName }}
          </div>
          <div class="my-1">
            <strong>DOB: </strong>{{ $filters.formatSimpleDate(student.dob) }}
          </div>
          <div class="my-1">
            <strong>Gender Code: </strong>{{ student.sexCode }}
          </div>
          <div class="my-1">
            <strong>Postal Code: </strong>{{ student.postalCode }}
          </div>
          <div class="my-1">
            <strong>Deceased Date: </strong>{{ student.deceasedDate }}
          </div>
          <div class="my-1">
            <strong>Mincode: </strong>{{ student.mincode }} -
            {{ schoolByMincode(student.mincode).displayName }}
          </div>
          <div class="my-1">
            <strong>Local ID: </strong>{{ student.trueStudentID }}
          </div>
          <div class="my-1">
            <strong>Grade Code: </strong>{{ student.gradeCode }}
          </div>
          <div class="my-1"><strong>Memo: </strong>{{ student.memo }}</div>
          <div class="my-1">
            <strong>Grade Year: </strong>{{ student.gradeYear }}
          </div>
          <div class="my-1">
            <strong>Status Code: </strong>{{ student.statusCode }}
          </div>
          <div class="my-1">
            <v-btn @click="openStudentAdmin" class="text">Student Admin</v-btn>
          </div>
        </v-card-text>
        <v-card-actions
          class="sticky-form-actions"
          v-if="hasPermissions('STUDENT', 'adoptPENStudent')"
        >
          <v-btn
            color="error"
            variant="outlined"
            @click="studentStore.studentDialog = !studentStore.studentDialog"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="showAdopt"
            id="save-status-btn"
            color="primary"
            variant="flat"
            @click="showAdopt = !showAdopt"
          >
            Adopt PEN Student
          </v-btn>
          <v-btn
            v-if="!showAdopt"
            id="save-status-btn"
            color="error"
            variant="flat"
            @click="adoptStudent(this.student)"
          >
            Confirm Adopt PEN Student
            <v-progress-circular
              v-if="adoptLoading"
              indeterminate
              color="error"
              size="20"
            >
            </v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, storeToRefs } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { useStudentStore } from "../../store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  props: {
    student: Object,
    title: String,
    more: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAdopt: true,
      studentStore: useStudentStore(),
      snackbarStore: useSnackbarStore(),
    };
  },
  computed: {
    ...mapState(useAppStore, {
      schoolByMincode: "schoolByMincode",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useStudentStore, {
      adoptLoading: "adoptLoading",
    }),
  },
  methods: {
    ...mapActions(useStudentStore, {
      adoptStudent: "adoptStudent",
    }),

    openStudentAdmin() {
      const studentID = this.student?.studentID;
      if (!studentID) {
        this.snackbarStore.error("Student ID is missing.");
        return;
      }

      this.$router.push({
        name: "StudentAdmin",
        params: { student: studentID },
      });
    },
  },
};
</script>

<style scoped></style>
