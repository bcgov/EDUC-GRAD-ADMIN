<template>
  <div class="container pt-2">
    <PenSearch></PenSearch>
    <br />
    <b-card-group deck>
      <b-card title="Mincode" header-tag="header" footer-tag="footer">
        <template #header>
          <h6 class="mb-0">Search for school</h6>
        </template>
        <b-card-text><b-input></b-input></b-card-text>
        <b-button href="#" variant="primary">Search</b-button>
      </b-card>
      <b-card title="School" header-tag="header" footer-tag="footer">
        <template #header>
          <h6 class="mb-0">Search for school report</h6>
        </template>
        <b-card-text><b-input></b-input></b-card-text>
        <b-button href="#" variant="primary">Search</b-button>
      </b-card>
      <b-card title="Program" header-tag="header" footer-tag="footer">
        <template #header>
          <h6 class="mb-0">Search for program</h6>
        </template>
        <b-card-text><b-input></b-input></b-card-text>
        <b-button href="#" variant="primary">Search</b-button>
      </b-card>
    </b-card-group>
  </div>
</template>
<script>
export default {
  components: {},
};
</script>
