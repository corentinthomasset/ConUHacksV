<template>
  <div id="app" :delivery="user.deliveryService">
    <router-view/>
  </div>
</template>

<script>
import User from "./store/Models/User";

export default {
  name: 'app',
  computed: {
    user(){
      return User.query().with('boxes').all()[0].deliveryService;
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap');
html{
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(#fff, #f3f9ff);
  min-height: 100vh;
}

body{
  max-width: 500px;
  display: block;
  margin: auto;
}

#header h1{
  font-weight: 300;
  color: rgba(0,0,0,.6);
  text-align: center;
  margin-top: 60px;
  margin-bottom: 0;
}

#header h5{
  font-weight: 400;
  color: rgba(0,0,0,.2);
  text-align: center;
  margin-top: 0;
  margin-bottom: 40px;
  font-size: .9em;
}

h2.separator{
  color: rgba(0,0,0,.4);
  font-size: .9em;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
}

#app{
  padding: 15px;
}

</style>
