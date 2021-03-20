<template>
    <div id="app">
        <Navegacion />
        <div class="container p-4">
            <Main />
        </div>
        <Footer />
    </div>
</template>

<script>
import Main from "./components/Main.vue";
import Navegacion from "./components/Navegacion.vue";
import Footer from "./components/Footer.vue";

export default {
    name: "App",
    components: {
        Main,
        Navegacion,
        Footer
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #fff;
    background-color: #2c3e50;
}

html {
    min-height: 100%;
    position: relative;
}

body {
    margin: 0;
    margin-bottom: 40px;
    background-color: #2c3e50;
}
</style>
