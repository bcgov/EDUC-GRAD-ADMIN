<template>
  <v-container class="d-flex justify-center">
    <v-row>
      <v-spacer />
      <v-col cols="12" md="4" lg="4">
        <v-card class="pt-3 pb-4">
          <v-card-title>
            <h4 id="login_text">Log In</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            To access the Graduation Administration Application, you must have a
            valid IDIR.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="text">
              <a :href="authRoutes.LOGIN">Login</a>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
import { Routes } from "@/utils/constants";
export default {
  name: "Login",
  data() {
    return {
      token: "",
      authRoutes: Routes,
    };
  },
  computed: {},
  methods: {},
};
</script>
