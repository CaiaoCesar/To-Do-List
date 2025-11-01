<script setup>

/*
 <div class="alert alert-success" role="alert">
    <strong>Tarefa concluída.</strong>
  </div>
  <div class="alert alert-warn" role="alert">
    <strong>Você tem tarefas em andamento.</strong>
  </div>
  <div class="alert alert-danger" role="alert">
    <strong>Você tem tarefas pendentes.</strong>
  </div>
*/
</script>

<template>
  <div class="d-flex align-items-center justify-content-between mb-0">
    <h5 class="mb-0">Progresso:</h5>
    <div class="progress flex-grow-1">
      <div class="progress-bar w-100 bg-alert">
        <span class="font-bold text-white heading-100">100%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
