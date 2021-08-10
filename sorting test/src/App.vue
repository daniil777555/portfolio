<template>
    <div id="app">
        <Main />
    </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  	name: 'App',
	components: {
		Main
	},

}
</script>

<style>
	*{
		margin: 0;
		padding: 0;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #000;
		background: #e4e4e4;
		min-height: 100vh;
	}

	.cover{
		top: 0;
        position: absolute;
        height: 100vh;
        width: 100vw;
        z-index: 2;
    }
</style>
