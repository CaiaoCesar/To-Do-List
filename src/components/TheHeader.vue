<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <p class="lead">
      Bem-vindo ao CommitDone! Sua branch de tarefas está esperando por um push de produtividade 💻🚀!
    </p>
  </div>
</template>

<style scoped>
.green {
  color: #198754;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.lead {
  font-size: 1.25rem;
  color: #495057;
  margin-bottom: 0;
}

</style>
