<template>
  <div class="d-flex justify-content-center">
    <div class="card col-sm-12 col-md-4 col-lg-4">
      <div class="container pt-3 pb-4"> 
        <h1>Logout Successful</h1>
        <p>Please login using the Login Portal if you require access</p>
         <a class="btn btn-primary btn-lg btn-block" href="https://soam-tools.apps.silver.devops.gov.bc.ca/auth/realms/master/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F">Login Portal</a>
      </div>  
    </div>
  </div>  
</template>

<script>

export default {
  name: "Logout",
  data() {},
  created() {},
  computed: {},
  methods: {}
}  
</script>

<style scoped>
</style>
