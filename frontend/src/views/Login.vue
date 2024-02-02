<template>
  <div class="d-flex justify-content-center">
    <div class="col-sm-12 col-md-4 col-lg-4">
      <div class="container pt-3 pb-4"> 
        <b-card>
          <b-card-title class="gov-header">
            <h4 id="login_text">Log In</h4>
          </b-card-title>
          <b-card-text id="login_descriptor">
            To access the Graduation Administration Application, you must have a valid IDIR.
          </b-card-text>
          <b-card-body>
            <b-row >
              <b-button type="button" class="btn btn-primary btn-lg btn-block" :href="routes.LOGIN">
                Login
              </b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </div>  
    </div>
  </div>  
</template>

<script>
import { Routes } from '@/utils/constants';
export default {
  name: "Login",
  data() {
    return {
      token: "",
      routes: Routes
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>
