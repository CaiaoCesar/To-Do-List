<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h1 class="text-center"><strong>{{ msg }}</strong></h1>
  <p class="lead">
    Bem-vindo ao CommitDone! Sua branch de tarefas está esperando por um push de produtividade 💻🚀!
  </p>
</template>

<style scoped>

.lead {
  font-size: 1.25rem;
  color: #495057;
  margin-bottom: 0;
}

</style>
