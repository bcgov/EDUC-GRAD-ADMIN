<template>
  <div class="display-modal" v-if="showModal">
    <b-card :header="header" class="modal-body">
      <slot name="body"> Hello World </slot>
      <template #footer>
        <slot name="footer"></slot>
        <!-- <b-btn
          variant="danger"
          size="xs"
          class="float-right"
          @click="show = false"
          >Close</b-btn
        > -->
      </template>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "DisplayModal",
  props: ["header", "showModal"],
  data() {
    return {};
  },
};
</script>

<style>
.card-header {
  font-weight: 700;
}

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
