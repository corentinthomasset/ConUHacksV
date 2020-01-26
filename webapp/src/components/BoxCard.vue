<template>
    <li class="box-card" @click="goToBox()">
        <h1>{{box.name}}</h1>
        <font-awesome-icon :class="iconClass" :icon="['fal', 'pennant']"/>
    </li>
</template>

<script>
export default {
    name: "BoxCard",
    props: ['box'],
    computed: {
        iconClass(){
            if(this.box.flag){
                return ['icon', 'red']
            } else {
                return 'icon'
            }
        }
    },
    methods: {
        goToBox(){
            this.$router.push({name: 'box', params: {boxId: this.box.id}});
        }
    }
}
</script>

<style scoped>
.box-card{
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

.box-card h1{
    font-size: 1.2em;
    font-weight: 400;
    margin: 0;
}

.box-card > div{
    display: flex;
    align-items: center;
}

.box-card > .icon{
    color: rgba(0,0,0,.2);
}

.box-card  > .icon.red{
    color: #d30e00;
}

</style>
