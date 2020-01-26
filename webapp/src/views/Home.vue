<template>
  <div id="home" v-if="!delivery">
    <div id="header">
      <h1>Hi {{user.firstName}}!</h1>
      <h5><font-awesome-icon :icon="['fal', 'clock']"/> {{now}}</h5>
    </div>
    <OverviewCard>
      <font-awesome-icon class="icon" :icon="overviewIcon"/>
      <h1>{{recap}}</h1>
      <h2>You checked your mail <timeago :datetime="lastCheck"/></h2>
    </OverviewCard>
    <div v-if="alerts.length">
      <h2 class="separator"><font-awesome-icon :icon="['fal', 'bell']"/> Alerts</h2>
      <ul class="card_list">
        <AlertCard v-for="alert in alerts" :key="alert.id" :alert="alert"/>
      </ul>
    </div>
    <h2 class="separator"><font-awesome-icon :icon="['fal', 'mail-bulk']"/> Boxes</h2>
    <ul class="card_list">
      <BoxCard v-for="box in boxes" :key="box.id" :box="box"/>
      <li id="add_box"></li>
    </ul>
  </div>
  <div id="tap" v-else>
    <div id="action_button">
      <div>
        <h1>TAP to start</h1>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import User from "../store/Models/User";
import OverviewCard from "../components/OverviewCard";
import Box from "../store/Models/Box";
import Alert from "../store/Models/Alert";
import AlertCard from "../components/AlertCard";
import BoxCard from "../components/BoxCard";

export default {
  name: 'home',
  components: {BoxCard, AlertCard, OverviewCard},
  data(){
    return ({
      now: 0,
    })
  },
  computed: {
    user(){
      return User.query().with('boxes').all()[0];
    },
    lastCheck(){
      let box = Box.query().where('ownerEmail', this.user.email).orderBy('lastChecked', 'desc').get()[0];
      if(box){
        return box.lastChecked;
      } else {
        return 0;
      }
    },
    boxes(){
      return Box.query().where('ownerEmail', this.user.email).all();
    },
    recap(){
      let flagged = Box.query().where('flag', true).count();
      if(flagged === 1){
        return `1 box needs to be checked!`;
      } else if(flagged > 1){
        return `${flagged} boxes need to be checked!`;
      } else {
        return `All boxes are empty!`
      }
    },
    overviewIcon(){
      if(this.recap !== `All boxes are empty!`){
        return ['fal', 'mail-bulk'];
      } else {
        return ['fal', 'check-circle'];
      }
    },
    alerts(){
      return Alert.query().with('box').all();
    },
    delivery(){
      return User.query().with('boxes').all()[0].deliveryService;
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.now = new Date().toLocaleTimeString();
      setInterval(()=>{
        this.now = new Date().toLocaleTimeString();
      }, 1000);
    });
  }
}
</script>

<style scoped>
.card_list{
  margin: 0;
  padding: 0;
  list-style: none;
}

#add_box{
  border-radius: 15px;
  margin: 30px auto 20px auto;
  height: 10px;
  width: 50%;
  background: #000;
  opacity: .05;
}

#action_button{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 100px auto;
  width: 150px;
  height: 150px;
  background: #fff;
  border-radius: 100%;
  text-align: center;
  cursor: pointer;
  color: #006fff;
  border: 1px solid #006fff;
  animation: greenPulse 2s infinite;
}

#action_button h1{
  font-weight: 300;
  font-size: 1.5em;
  margin: 0;
}


@keyframes greenPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 111, 255, 0.75), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(0, 111, 255, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 111, 255, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
  }
}
</style>
