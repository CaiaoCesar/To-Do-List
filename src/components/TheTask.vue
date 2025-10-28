<script setup>
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-4">
    <!-- Input -->
    <input class="form-control form-control-lg mb-3 w-75" 
           type="text" 
           id="task" 
           placeholder="Digite a atividade que deseja realizar">
    
    <!-- Select -->
    <select class="form-select mb-3 w-75" name="priority" id="priority">
      <option value="0">Sem prioridade</option>
      <option value="1">Urgente</option>
      <option value="2">Importante</option>
      <option value="3">Normal</option>
    </select>
    
    <!-- Botão -->
    <button class="btn btn-success btn-lg w-75" 
            id="btn-add-task" 
            type="submit">
      Adicionar Tarefa
    </button>
  </div>
</template>

<style scoped>
</style>