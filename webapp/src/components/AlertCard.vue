<template>
    <li class="alert_card">
        <div class="alert_card_head">
            <h1 @click="goToBox()">Delivery at {{alert.box.name}}</h1>
            <div>
                <h2>{{new Date(+alert.date).toLocaleString()}}</h2>
                <font-awesome-icon @click="deleteAlert()" class="icon" :icon="['fal', 'times']"/>
            </div>
        </div>
        <img @click="goToBox()" :src="alert.attachment"/>
    </li>
</template>

<script>
import Alert from "../store/Models/Alert";

export default {
    name: "AlertCard",
    props: ['alert'],
    methods:{
        deleteAlert(){
            Alert.delete(this.alert.id);
        },
        goToBox(){
            this.$router.push({name: 'box', params: {boxId: this.alert.box.id}});
        }
    }
}
</script>

<style scoped>
.alert_card{
    cursor: pointer;
}

.alert_card_head{
    color: rgba(0,0,0,.7);
    background: #fff;
    border-radius: 15px;
    margin: auto;
    padding: 10px 15px;
    box-shadow: 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.alert_card_head h1{
    font-size: .9em;
    font-weight: 400;
    margin: 0;
}

.alert_card_head h2{
    margin: 0;
    font-size: .8em;
    font-weight: 400;
    text-align: center;
    color: rgba(0,0,0,.3);
}

.alert_card_head > div{
     display: flex;
     align-items: center;
 }

.alert_card_head > div > .icon{
    margin-left: 15px;
    cursor: pointer;
}

.alert_card img{
    width: 100%;
    display: block;
    margin: 5px auto;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0, 137, 255, 0.02), 0 0 10px rgba(0, 0, 0, 0.05);
}

</style>
