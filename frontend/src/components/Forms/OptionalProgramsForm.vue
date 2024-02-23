<template>
  <div>
    <!-- btn to open optional program edit form-->
    <b-btn
      >Add Optional Program
      <i
        class="fas fa-plus"
        aria-hidden="true"
        @click="editStudentOptionalPrograms = true"
      ></i
    ></b-btn>

    <DisplayModal
      header="Add Optional Program"
      :showModal="editStudentOptionalPrograms"
    >
      <template v-slot:body> I'm the optional programs form </template>

      <template v-slot:footer>
        <b-btn
          variant="danger"
          size="xs"
          class="float-right"
          @click="editStudentOptionalPrograms = false"
          >Close</b-btn
        >
      </template>
    </DisplayModal>
  </div>
</template>

<script>
import DisplayModal from "../DisplayModal.vue";

export default {
  name: "HelloWorld",
  props: ["header", "showModal"],
  components: {
    DisplayModal: DisplayModal,
  },
  data() {
    return {
      editStudentOptionalPrograms: false,
    };
  },
};
</script>

<style>
.modal-body {
  height: fit-content;
  width: fit-content;
  margin: 5rem auto;
}

.modal-body .card-footer,
.modal-body .card-header {
  background-color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0);
}

.display-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
</style>

<style scoped>
:deep(.card-header) {
  font-weight: 700;
}
</style>
