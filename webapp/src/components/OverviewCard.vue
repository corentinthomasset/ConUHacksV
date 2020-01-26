<template>
    <div id="overview" class="card">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "OverviewCard"
}
</script>

<style scoped>
#overview{
    display: block;
    color: #fff;
    background: linear-gradient(45deg, #FDD835, #FFA000);
    border-radius: 15px;
    margin: 30px auto;
    padding: 15px;
    box-shadow: 0 0 20px rgba(253, 216, 53, 0.5), 0 0 10px rgba(0, 0, 0, 0.1);
}

#overview h1{
    font-size: 1.2em;
    color: #fff;
    font-weight: 400;
    margin: 0;
    text-align: center;
}

#overview h2{
    margin: 0;
    font-size: .8em;
    font-weight: 400;
    text-align: center;
}

#overview .icon{
    font-size: 2.5em;
    display: block;
    margin: 5px auto;
}

</style>
