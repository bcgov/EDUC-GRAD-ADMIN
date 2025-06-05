<template>
  <div v-if="student">
    <v-btn
      variant="plain"
      color="error"
      v-ripple
      @click="studentDialog = !studentDialog"
      class="v-btn-link text-left px-0 d-block"
      v-if="more"
    >
      more
    </v-btn>
    <v-dialog v-model="studentDialog" max-width="600px">
      <v-card>
        <v-card-title
          ><v-row no-gutters>
            <div class="mt-2 ml-2">PEN Demographics - Adopt Student</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              @click="studentDialog = !studentDialog"
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
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  props: {
    student: Object,
    title: String,
    more: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useAppStore, {
      schoolByMincode: "schoolByMincode",
    }),
  },
  methods: {},
  data() {
    return {
      studentDialog: false,
    };
  },
};
</script>

<style scoped></style>
