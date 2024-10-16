<template>
  <div>
    <!-- Button to open the dialog -->
    <v-btn color="primary" @click="showDialog = true">Add Note</v-btn>

    <!-- v-dialog for adding notes -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Note</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="onSubmit" @reset="onReset">
            <v-textarea
              v-model="newNote.note"
              label="Add note:"
              placeholder="Max 255 Characters"
              :rules="[
                (value) =>
                  !value || value.length <= 255 || 'Max 255 characters',
              ]"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="onSubmit">Add</v-btn>
          <v-btn text @click="showDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="(studentNote, studentNoteIndex) in studentNotes"
          :key="studentNote.id"
        >
          <v-card class="mb-2" outlined>
            <v-card-title>
              <span>{{ studentNote.createUser }}</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="onEditNote(studentNote)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="showAddButton"
                icon
                @click="onDelete(studentNote.id)"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              <strong>Created:</strong>
              {{ $filters.formatTime(studentNote.createDate) }}
            </v-card-subtitle>
            <v-card-text>
              <div v-if="showEditForm != studentNote.id">
                {{ studentNote.note }}
              </div>
              <v-textarea
                v-if="showEditForm == studentNote.id"
                v-model="editedNote.note"
                placeholder="Max 255 Characters"
                :rules="[
                  (value) =>
                    !value || value.length <= 255 || 'Max 255 characters',
                ]"
                rows="3"
                max-rows="6"
              ></v-textarea>
              <v-btn
                v-if="showSave && showEditForm == studentNote.id"
                color="primary"
                @click="onSaveEditedNote(studentNoteIndex, editedNote)"
              >
                Save
              </v-btn>
              <v-btn
                v-if="showEditForm == studentNote.id"
                text
                @click="cancelEdit()"
              >
                Cancel
              </v-btn>
            </v-card-text>
          </v-card>
        </v-list-item>
      </v-list-item-group>
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
        StudentService.addStudentNotes(editedNote)
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
        StudentService.addStudentNotes(this.newNote)
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
      StudentService.deleteStudentNotes(noteID);
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
