<script setup>

</script>

<template>
  <div class="alert alert-success" role="alert">
    <strong>Tarefa concluída.</strong>
  </div>
  <div class="alert alert-warn" role="alert">
    <strong>Você tem tarefas em andamento.</strong>
  </div>
  <div class="alert alert-danger" role="alert">
    <strong>Você tem tarefas pendentes.</strong>
  </div>

  <h2>Barra de Progresso</h2>
  <div class="progress">
    <div class="progress-bar w-100">100%</div>
  </div>
</template>

<style scoped>

</style>
