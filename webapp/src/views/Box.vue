<template>
    <div id="box">
        <font-awesome-icon @click="goBack()" class="back" :icon="['fal', 'arrow-left']" v-if="!delivery"/>
        <div id="header">
            <h1>{{box.name}}</h1>
            <h5>{{box.address}}</h5>
        </div>
        <OverviewCard v-if="!delivery">
            <h1>{{recap}}</h1>
            <h2>Last check <timeago :datetime="+box.lastChecked"/></h2>
        </OverviewCard>
        <div id="action_button" :lock="box.open" @click="doStuff()">
            <div>
                <font-awesome-icon class="icon" :icon="actionIcon"/>
                <h1>{{action}}</h1>
            </div>
        </div>
    </div>
</template>

<script>
import Box from "../store/Models/Box";
import OverviewCard from "../components/OverviewCard";
import User from "../store/Models/User";
import Action from '../action';

export default {
    name: "Box",
    components: {OverviewCard},
    props: ['boxId'],
    computed: {
        box(){
            return Box.find(this.boxId);
        },
        recap(){
            let flag = this.box.flag;
            if(flag){
                return `You have mail!`;
            } else {
                return `Box is empty!`
            }
        },
        actionIcon(){
            if(this.box.open){
                return ['fal', 'lock-open'];
            } else {
                return ['fal', 'lock'];
            }
        },
        action(){
            return this.box.open ? 'Lock' : 'Unlock';
        },
        delivery(){
            return User.query().with('boxes').all()[0].deliveryService;
        }
    },
    methods: {
        goBack(){
            this.$router.push({name: 'home'});
        },
        doStuff(){
            if(this.box.open){
                Action.lock(this.box.id);
            } else {
                Action.unlock(this.box.id);
            }
        }
    }
}
</script>

<style scoped>
.back{
    font-size: 1.5em;
    position: absolute;
    top: 20px;
    left: 20px;
    opacity: .5;
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
}

#action_button .icon{
    font-size: 2.5em;
}

#action_button h1{
    font-weight: 300;
    font-size: 1.5em;
    margin: 0;
}

#action_button[lock]{
    color: #ff015f;
    border: 1px solid #ff015f;
    animation: redPulse 2s infinite;
}

#action_button:not([lock]){
    color: #07ff75;
    border: 1px solid #07ff75;
    animation: greenPulse 2s infinite;
}

@keyframes greenPulse {
     0% {
         box-shadow: 0 0 0 0 rgba(7, 255, 117, 0.75), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
     }

     70% {
         box-shadow: 0 0 0 20px rgba(7, 255, 117, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
     }

     100% {
         box-shadow: 0 0 0 0 rgba(7, 255, 117, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
     }
 }

@keyframes redPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 1, 95, 0.75), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
    }

    70% {
        box-shadow: 0 0 0 20px rgba(255, 1, 95, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(255, 1, 95, 0), 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
    }
}

</style>
