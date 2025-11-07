<!-- TaskCard.vue -->
<template>
  <div class="card h-100 task-card" 
       :class="`state-${state.id}`"
       draggable="true"
       @dragstart="onDragStart(task, $event, state.id)"
       @dragend="onDragEnd"
       :style="{ borderLeftColor: state.color }">
    
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge" :class="getPriorityBadgeClass(task.priority)">
          {{ getPriorityText(task.priority) }}
        </span>
        <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
      </div>

      <h5 class="card-title" :class="{ 'text-decoration-line-through': state.id === 'completed' }">
        {{ task.title }}
      </h5>

      <div class="card-text">
        <p class="mb-1"><small><strong>Data/Hora:</strong> {{ task.dateTime ? new
          Date(task.dateTime).toLocaleString() : 'Não definida' }}</small></p>
        <p class="mb-2"><small><strong>Descrição:</strong> {{ task.description || 'Nenhuma descrição' }}</small></p>
      </div>

      <div class="d-flex justify-content-between pt-2">
        <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: Object,
  state: Object
});

</script>




