<script setup>
import TheHeader from './components/TheHeader.vue'
import TheTask from './components/TheTask.vue';
import TheProgress from './components/TheProgress.vue';
</script>

<template>
   <div class="container-fluid min-vh-100 d-flex flex-column">
    <header class="header py-4">
      <div class="container">
         <div class="row align-items-center justify-content-center text-center">
            <div class="col-auto">
              <TheHeader msg="CommitDone" />
            </div>
            <div class="col-auto">
              <img class="logo mt-5" alt="CommitDone logo" id="logo" src="./assets/logo.png" width="125" height="125" />
            </div>
          </div>
      </div>
    </header>
    <main class="grow d-flex align-items-center justify-content-center py-0">
      <TheTask />
    </main>

   <TheProgress/>
  </div>
</template>

<style>
html,body{
  background-color: #acdeb2;
  color: black;
  margin: 0;
  padding: 0;
  height: 100%;
}

.logo {
  max-width: 100%;
  height: auto;
}

#app {
  height: 100%;
}
</style>
