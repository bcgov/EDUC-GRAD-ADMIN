 
 <template>    
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/courses">Courses</router-link>
  </div>
</template>
  
<script>
export default {
  props: {
    course: Object
  }
};
</script>
   
   <style scoped>
   #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
   </style> 
