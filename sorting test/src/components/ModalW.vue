<template>
    <div class="modal-w">
        <header class="header">
            <h3 class="m-heading">How many people?</h3>
            <button class="m-close" v-on:click="$emit('isModalOpen', false)">&times;</button>
        </header>
        <main class="main">
            <label class="m-desc" for="m-input">Enter a number of how many people you want to add to the list.</label>
            <input type="number" class="m-input" max="100" min="20" id="m-input"
                v-bind:quantityPeople="quantityPeople" v-on:input="$emit('input', $event.target.value)">
        </main>
        <footer class="footer">
            <button class="m-btn btn m-btn-cancel" v-on:click="$emit('isModalOpen', false)">Cancel</button>
            <button class="m-btn btn m-btn-start" v-on:click="$emit('startSorting', true)">Start</button>
        </footer>
    </div>
</template>

<script>

export default {
  	name: 'ModalW',
    props:{
        isModalOpen: Boolean,
        quantityPeople: Number
    },
}

</script>

<style scoped>
    .modal-w{
        background: #FFFFFF;
		border-radius: 5px;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.101972);
		border: 1px solid #DDDDDD;
		display: flex;
		flex-direction: column;
		max-width: fit-content;
		margin: 0 auto;
        padding: 17px 17px 20px 20px;
    }


    .header{
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0 0 20px 0;
    }

    .m-heading{
        font-weight: bold;
        font-size: 18px;
        line-height: 21px;
    }

    .m-close{
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
        font-size: 22px;
        color: #999;
    }

    .main{
        border-top: 1px solid #CCCCCC;
        border-bottom: 1px solid #CCCCCC;
        padding: 20px 0 50px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .m-desc{
        font-size: 13px;
        line-height: 18px;
        color: #555;
        margin: 0 0 14px 0;
    }

    .m-input{
        background: #FFFFFF;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        border-radius: 5px;
        outline: none;
        font-size: 13px;
        line-height: 15px;
        padding: 12px 0 12px 14px;
    }

    .footer{
        display: flex;
        justify-content: flex-end;
        padding: 20px 0 0 0;
    }

    .m-btn{
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        padding: 12px 22px;
    }

    .m-btn-cancel{
        background: #eee;
        color: #555;
        margin: 0 10px 0 0;
    }

    .m-btn-cancel:hover{
        background: #555;
        color: #eee;
    }

    .m-btn-cancel:active{
        background: rgb(131, 130, 130);
        color: #eee;
    }

    .m-btn-start:hover{
        background: rgb(236, 236, 236);
        color: #FF8D00;
    }

    .m-btn-start:active{
        background: rgb(241, 241, 241);
        color: #FF8D00;
    }
</style>
