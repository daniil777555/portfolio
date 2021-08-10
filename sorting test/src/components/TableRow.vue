<template>
    <div class="row">
        <div class="cell-name cell">{{ person.name }}</div>
        <div class="cell-email cell">{{ person.email }}</div>
        <div class="cell-ptt-quantity cell">{{ person.potatoQuantity }}</div>
    </div>
</template>

<script>

export default {
  	name: 'TableRow',
    props:{
        person: Object,
    }
	
}
</script>

<style scoped>
    .row{
        cursor: pointer;
        border-top: 1px solid #DDDDDD;
        display: flex;
        padding: 0 20px;
    }

    .row:hover{
        background: #F5F5F5;
    }

    .row:last-child{
        border-bottom: 1px solid #DDDDDD;
    }

    .cell{
        font-size: 17px;
        line-height: 48px;
        flex: 1;
        text-align: left;
    }

    .cell-name{
        border-right: 1px solid #DDDDDD;
    }

    .cell-email{
        padding: 0 0 0 30px;
    }  
</style>
