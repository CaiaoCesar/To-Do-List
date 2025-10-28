<script setup>
import TheHeader from './components/TheHeader.vue'
import TheTask from './components/TheTask.vue';
import TheAlerts from './components/TheAlerts.vue';
</script>

<template>
  <div class="container">
    <header class="header">
      <div class="row align-items-center">
        <div class="col-md-2 order-md-2 text-end">
          <img alt="CommitDone logo" class="logo" src="./assets/logo.png" width="125" height="125" />
        </div>
        
        <div class="col-md-10 order-md-1">
          <TheHeader msg="CommitDone" />
        </div>
      </div>
      
    </header>

    <main>
      <TheTask />
    </main>

    <TheAlerts/>
  </div> 
</template>

<style>
html,body{
  background-color: #acdeb2;
  color: black;
}

.logo {
  max-width: 100%;
  height: auto;
}
</style>
