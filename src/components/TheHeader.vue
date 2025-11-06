<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="header-content">
    <h1 class="text-center mb-3"><strong>{{ msg }}</strong></h1>
    <p class="lead text-center">
      Bem-vindo ao CommitDone!<br> Sua branch de tarefas está esperando por um push de produtividade!
      <FontAwesomeIcon icon="laptop" style="color: #207178;" />
      <FontAwesomeIcon icon="pen-to-square" style="color: #207178;"/>
      <FontAwesomeIcon icon="hourglass-half" style="color: #207178;"/>
      <FontAwesomeIcon icon="rocket" style="color: #207178;"/>
    </p>
  </div>
</template>

<style scoped>
.header-content {
  color: #207178;
}

.lead {
  font-size: 1.25rem;
  color: #495057;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: #207178;
  font-size: 2.5rem;
  font-weight: 700;
}
</style>
