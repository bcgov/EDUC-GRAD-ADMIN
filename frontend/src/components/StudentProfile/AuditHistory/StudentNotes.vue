<template>
  <div>
    <!-- Button to open the dialog -->
    <v-row no-gutters>
      <v-spacer />
      <v-btn
        color="primary"
        @click="showDialog = true"
        prepend-icon="mdi-plus"
        class="text-none"
        >Add Student Note</v-btn
      >
    </v-row>

    <!-- v-dialog for adding notes -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Student Note</span>
        </v-card-title>
        <v-card-text class="bg-surface-light">
          <v-form @submit.prevent="onSubmit" @reset="onReset">
            <v-textarea
              v-model="newNote.note"
              label="Add note:"
              placeholder="Max 255 Characters"
              variant="outlined"
              :rules="[
                (value) =>
                  !value || value.length <= 255 || 'Max 255 characters',
              ]"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            @click="showDialog = false"
            class="text-none ml-4"
            >Cancel</v-btn
          >
          <v-spacer />
          <v-btn
            color="error"
            variant="flat"
            @click="onSubmit"
            class="text-none mr-4 mb-4"
            >Add Student Note</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-list>
      <v-list-item
        v-for="(studentNote, studentNoteIndex) in studentNotes"
        :key="studentNote.id"
      >
        <v-card class="mb-2" variant="elevated" max-width="1200px">
          <v-card-title>
            <span>{{ studentNote.createUser }}</span>
            <v-btn
              v-if="showAddButton"
              @click="onDelete(studentNote.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              class="float-right"
            >
            </v-btn>
            <v-btn
              @click="onEditNote(studentNote)"
              color="bcGovBlue"
              icon="mdi-pencil"
              variant="text"
              class="float-right"
            >
            </v-btn>
          </v-card-title>
          <v-divider class="mx-4 mt-0" />
          <v-card-text>
            <div v-if="showEditForm != studentNote.id">
              {{ studentNote.note }}
            </div>
            <v-textarea
              v-if="showEditForm == studentNote.id"
              v-model="editedNote.note"
              placeholder="Max 255 Characters"
              variant="outlined"
              :rules="[
                (value) =>
                  !value || value.length <= 255 || 'Max 255 characters',
              ]"
              rows="3"
              max-rows="6"
            ></v-textarea>
            <v-row no-gutters>
              <v-btn
                v-if="showEditForm == studentNote.id"
                color="error"
                variant="outlined"
                class="text-none mb-2"
                @click="cancelEdit()"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                v-if="showSave && showEditForm == studentNote.id"
                color="error"
                variant="flat"
                class="text-none mb-2"
                @click="onSaveEditedNote(studentNoteIndex, editedNote)"
              >
                Save
              </v-btn>
            </v-row>
          </v-card-text>
          <v-card-subtitle class="ml-0 mb-4">
            <strong>Created:</strong>
            {{ $filters.formatTime(studentNote.createDate) }}
          </v-card-subtitle>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { useStudentStore } from "../../../store/modules/student";
import { useAccessStore } from "../../../store/modules/access";
import { useAuthStore } from "../../../store/modules/auth";
import { mapState } from "pinia";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";

export default {
  name: "StudentNotes",
  computed: {
    ...mapState(useStudentStore, {
      studentNotes: "getStudentNotes",
      profile: "getStudentProfile",
    }),
    ...mapState(useAccessStore, {
      allowCreateStudentNotes: "allowCreateStudentNotes",
    }),
    ...mapState(useAuthStore, {
      userInfo: "userInfo",
    }),
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      showDialog: false, // State to control the dialog visibility
      showAddButton: true,
      showSave: false,
      showEditForm: "",
      newNote: {
        note: "",
        studentID: "",
      },
      editedNote: {
        id: "",
        note: "",
        studentID: "",
      },
    };
  },
  methods: {
    onSaveEditedNote(studentNoteIndex, editedNote) {
      if (this.editedNote.note.length <= 255) {
        StudentService.addStudentNotes(this.profile.studentID, editedNote)
          .then((response) => {
            this.snackbarStore.showSnackbar(
              "Student note saved",
              "success",
              5000
            );
            if (response.data && response.data.value) {
              this.studentNotes.splice(
                studentNoteIndex,
                1,
                response.data.value
              );
            }
            this.showEditForm = false;
          })
          .catch((error) => {
            console.log("There was an error:" + error);
            this.snackbarStore.showSnackbar(
              "There was an error:" + error.message,
              "error",
              5000
            );
          });
      } else {
        this.snackbarStore.showSnackbar(
          "Max character 255 limit exceeded.",
          "error",
          5000
        );
      }
    },
    onEditNote(note) {
      this.showSave = true;
      this.showEditForm = note.id;
      this.editedNote.note = note.note;
      this.editedNote.id = note.id;
      this.editedNote.studentID = note.studentID;
    },
    cancelEdit() {
      this.showSave = false;
      this.showEditForm = "";
      this.editedNote = {};
    },
    onSubmit() {
      if (this.newNote.note.length <= 255) {
        this.newNote.studentID = this.$route.params.studentId;
        this.newNote.createUser = this.userInfo.userName;
        this.newNote.createDate = new Date().toISOString();
        StudentService.addStudentNotes(this.profile.studentID, this.newNote)
          .then((response) => {
            if (response.data && response.data.value) {
              this.studentNotes.unshift(response.data.value);
              this.newNote.note = "";
              this.snackbarStore.showSnackbar(
                "Student note added",
                "success",
                5000
              );
              // Close the dialog after successfully adding the note
              this.showDialog = false;
            }
          })
          .catch((error) => {
            console.log("There was an error:" + error);
            this.snackbarStore.showSnackbar(
              "There was an error with the web service.",
              "error",
              5000
            );
          });
      } else {
        this.snackbarStore.showSnackbar(
          "Max character 255 limit exceeded.",
          "error",
          5000
        );
      }
    },
    onReset() {
      this.newNote.note = "";
    },
    onDelete(noteID) {
      StudentService.deleteStudentNotes(this.profile.studentID, noteID);
      const removeIndex = this.studentNotes
        .map((item) => item.id)
        .indexOf(noteID);
      this.studentNotes.splice(removeIndex, 1);
    },
  },
};
</script>

<style scoped>
.delete-button {
  position: absolute;
  right: 10px;
  top: 10px;
}
.edit-button {
  position: absolute;
  right: 80px;
  top: 10px;
}
</style>
