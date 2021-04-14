 
<template>    
 
      <div>
        <div class="alert alert-dismissible alert-success">
          <button type="button" class="close" data-dismiss="alert">×</button>
          <div class="message"><strong><div v-html="message"></div></strong></div>
        </div>
      </div>
   
</template>
  
<script>
export default {
  props: {
    message: String
  },
  created() {
    //Check for any messages from routes
    this.message = this.$route.params.message;
  }

};

</script>
<style scoped>
.message{
  text-align:center;
  z-index:1;
}

</style>
