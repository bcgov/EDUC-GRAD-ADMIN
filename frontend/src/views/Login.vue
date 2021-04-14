<template>
  <div class="d-flex justify-content-center">
    <div class="card col-sm-12 col-md-4 col-lg-4">
      <div class="container pt-3 pb-4"> 
        <form>
            <div class="form-group">
              <label for="id" >User ID</label>
                  <input id="id" type="text" class="form-control form-control-lg" v-model="id" required autofocus>
            </div>

            <div class="form-group">
                <label for="password" >Password</label>
                <input id="password" type="password" class="form-control form-control-lg" v-model="password" required>
            </div>
            <div>
                <button type="submit" class="btn btn-primary btn-lg btn-block" @click="submit">
                    Login
                </button>
            </div>
        </form>
      </div>  
    </div>
  </div>  
</template>

<script>
// @ is an alias to /src
import LoginService from "@/services/LoginService.js";
import { mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      token: "",
      id : "",
      password : ""
    }
  },
  created() {
      // this.token = LoginService.login();
  },
  computed: {
  ...mapGetters({
      getToken: "getToken"
    }),
  },
  methods: {
    submit(e){
      e.preventDefault()
      if (this.password.length > 0) {
        LoginService.handleSubmit(this.id, this.password).then((response) => {
            this.$store.dispatch('setToken', response.data.access_token);
        });
        
       // console.log("HELLO WORLD" + this.getToken);
      }
    }
  }
}
</script>

<style scoped>
</style>
