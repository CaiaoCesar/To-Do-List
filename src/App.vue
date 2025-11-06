<script setup>
import TheHeader from './components/TheHeader.vue'
import TheTask from './components/TheTask.vue';
import TheFooter from './components/TheFooter.vue';
</script>

<template>
  <div id="app" class="container-fluid min-vh-100 d-flex flex-column p-0">
    <header class="header py-3 bg-light">
      <div class="container">
        <div class="row align-items-center justify-content-center text-center">
          <div class="col-auto">
            <TheHeader msg="CommitDone" />
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow-1 d-flex align-items-start justify-content-center py-3">
      <div class="container-fluid px-3 px-md-4">
        <TheTask />
      </div>
    </main>

    <TheFooter/>
  </div>
</template>

<style scoped>
.container-fluid {
  background-color: #bfe3c0;
  margin: 0;
  padding: 0;
}

.header {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
}
</style>

<style>
html, body {
  background-color: #bfe3c0;
  color: black;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* Garante que o app ocupe toda a largura */
#app {
  min-height: 100vh;
  width: 100%;
  max-width: 100% !important;
}
</style>
