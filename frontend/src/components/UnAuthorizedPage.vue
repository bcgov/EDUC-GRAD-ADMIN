<template>
  <b-container fluid class="my-16 full-height">

    <!-- login article -->
    <article id="login-banner" class="top-banner">
      <b-row align-h="center" width="100%">
        <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
          <b-main>
            <b-container  fluid>
                <b-row align-h="center">
                  <b-col xs="10" sm="10" md="10" lg="10" xl="10">
                    <b-card class="error-card" elevation="5">
                      <b-card-title class="gov-header">
                        <h4 id="error_text" style="color:red;">Unauthorized Page Access</h4>
                      </b-card-title>
                      <b-card-text id="error_message">
                        <span style="color: black; font-weight: bold">You do not have the required roles to view this page.</span>
                      </b-card-text>
                     </b-card>
                  </b-col>
              </b-row>
            </b-container>
          </b-main>
        </b-col>
      </b-row>
    </article>
  </b-container>
</template>


<style scoped>
  .error-card{
    margin-top: 5%;
  }
  .gov-header{
    color: #003366;
  }
</style>
