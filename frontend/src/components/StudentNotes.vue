<template>
  <div>
    <div class="student-note px-3">
      <!-- Add new Note form -->
      <b-card
        title=""
        tag="article"
        class="col-12 note-card mb-3"
        v-if="showForm"
      >
        <b-form
          @submit="onSubmit"
          @reset="onReset"
          v-if="allowCreateStudentNotes"
        >
          <b-form-group id="note-form" label="Add note:" label-for="comment">
            <b-form-textarea
              id="comment"
              v-model="newNote.note"
              placeholder="Max 255 Characters"
              :state="newNote.note.length <= 255"
              required
            ></b-form-textarea>
          </b-form-group>
          <b-button-group>
            <b-button type="submit" variant="primary" size="sm" class="mr-1"
              >Add</b-button
            >
            <b-button
              type="reset"
              variant="outline-secondary"
              size="sm"
              class=""
              >Reset</b-button
            >
          </b-button-group>
        </b-form>
      </b-card>
      <!-- Notes from the store pull from the database -->
      <div
        v-for="(studentNote, studentNoteIndex) in studentNotes"
        :key="studentNote.id"
      >
        <b-card
          title=""
          no-body
          tag="article"
          class="col-12 mb-2"
          :header="'Created by ' + studentNote.createUser"
        >
          <b-card-text>
            <strong>Created:</strong> {{ studentNote.createDate | formatTime }}
            <p v-if="showEditForm != studentNote.id">{{ studentNote.note }}</p>
            <b-form-textarea
              id="textarea"
              v-if="showEditForm == studentNote.id"
              v-model="editedNote.note"
              placeholder="Max 255 Characters"
              :state="editedNote.note.length <= 255"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-button
              variant="primary"
              size="sm"
              v-if="showSave && showEditForm == studentNote.id"
              @click="onSaveEditedNote(studentNoteIndex, editedNote)"
              class=""
              >Save
            </b-button>
            <b-button
              variant="link"
              v-if="showEditForm == studentNote.id"
              size="sm"
              @click="cancelEdit()"
              class=""
              >Cancel
            </b-button>

            <b-button
              variant="link"
              size="sm"
              @click="onEditNote(studentNote)"
              class="float-right edit-button"
              >Edit
            </b-button>
            <b-button
              v-if="showAddButton"
              variant="danger"
              size="sm"
              @click="onDelete(studentNote.id)"
              class="float-right delete-button"
              >Delete
            </b-button>
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import StudentService from "@/services/StudentService.js";
import sharedMethods from "../sharedMethods";
export default {
  name: "StudentNotes",
  computed: {
    ...mapGetters({
      studentNotes: "student/getStudentNotes",
      profile: "student/getStudentProfile",
      username: "getUsername",
      userInfo: "auth/userInfo",
      allowCreateStudentNotes: "useraccess/allowCreateStudentNotes",
    }),
    ...mapGetters("useraccess", ["allowCreateStudentNotes"]),
  },
  created() {
    this.studentProfile = this.profile;
    this.showNotification = sharedMethods.showNotification;
  },
  data() {
    return {
      showForm: true,
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
      studentProfile: {},
    };
  },
  methods: {
    onSaveEditedNote(studentNoteIndex, editedNote) {
      if (this.editedNote.note.length <= 255) {
        StudentService.addStudentNotes(editedNote)
          .then((response) => {
            this.showNotification("success", "Student note saved");
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
            // eslint-disable-next-line
            console.log("There was an error:" + error);
            this.showNotification(
              "danger",
              "There was an error with the web service."
            );
          });
      } else {
        this.showNotification("danger", "Max character 255 limit exceeded.");
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
    showSubmitForm() {
      this.showForm = !this.showForm;
      this.showAddButton = !this.showAddButton;
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.newNote.note.length <= 255) {
        this.showAddButton = true;
        this.showForm = true;
        let current = new Date().toISOString().slice(0, 10);
        this.newNote.studentID = this.$route.params.studentId;
        this.newNote.createUser = this.userInfo.userName;
        this.newNote.createdTimestamp = current;
        StudentService.addStudentNotes(this.newNote)
          .then((response) => {
            if (response.data && response.data.value) {
              this.studentNotes.unshift(response.data.value);
              this.newNote.note = "";
              this.showNotification("success", "Student note added");
            }
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log("There was an error:" + error);
            this.showNotification(
              "danger",
              "There was an error with the web service."
            );
          });
      } else {
        this.showNotification("danger", "Max character 255 limit exceeded.");
      }
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.newNote.note = "";
    },
    onDelete(noteID) {
      StudentService.deleteStudentNotes(noteID);
      let removeIndex = this.studentNotes
        .map(function (item) {
          return item.id;
        })
        .indexOf(noteID);
      this.studentNotes.splice(removeIndex, 1);
      this.showNotification("success", "Student note deleted");
    },
    getNotes() {
      StudentService.getStudentNotes(this.$route.params.studentid)
        .then((response) => {
          this.studentNotes = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("There was an error:" + error);
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
        });
    },
  },
};
</script>

<style scoped>
.card {
  padding: 0px;
}
.card-text {
  padding: 19px;
}
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
