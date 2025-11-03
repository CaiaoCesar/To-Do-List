<script setup>
import { ref, onMounted, watch } from 'vue';

// ✅ Props para receber os dados das tarefas
const props = defineProps({
  completedTasks: {
    type: Array,
    default: () => []
  },
  pendingTasks: {
    type: Array,
    default: () => []
  }
});

// ✅ Estado reativo para o progresso
const progressPercentage = ref(0);
const totalTasks = ref(0);
const completedCount = ref(0);

// ✅ Função para calcular o progresso
function calculateProgress() {
  completedCount.value = props.completedTasks.length;
  totalTasks.value = props.completedTasks.length + props.pendingTasks.length;
  
  if (totalTasks.value === 0) {
    progressPercentage.value = 0;
  } else {
    progressPercentage.value = Math.round((completedCount.value / totalTasks.value) * 100);
  }
}

// ✅ Watcher para recalcular quando as tarefas mudarem
watch(() => [props.completedTasks, props.pendingTasks], () => {
  calculateProgress();
}, { deep: true, immediate: true });

// ✅ Função para determinar a cor da barra baseada no progresso
function getProgressBarClass() {
  if (progressPercentage.value === 0) return 'bg-secondary';
  if (progressPercentage.value < 30) return 'bg-danger';
  if (progressPercentage.value < 70) return 'bg-warning';
  if (progressPercentage.value < 100) return 'bg-info';
  return 'bg-success';
}

// ✅ Função para determinar o texto do alerta
function getAlertMessage() {
  if (totalTasks.value === 0) {
    return { message: 'Nenhuma tarefa criada ainda.', type: 'secondary' };
  }
  if (progressPercentage.value === 0) {
    return { message: 'Você tem tarefas pendentes. Vamos começar!', type: 'danger' };
  }
  if (progressPercentage.value === 100) {
    return { message: 'Parabéns! Todas as tarefas foram concluídas! 🎉', type: 'success' };
  }
  if (progressPercentage.value >= 70) {
    return { message: 'Ótimo progresso! Continue assim!', type: 'info' };
  }
  if (progressPercentage.value >= 30) {
    return { message: 'Você tem tarefas em andamento.', type: 'warning' };
  }
  return { message: 'Você tem tarefas pendentes.', type: 'danger' };
}

// ✅ Calcular progresso inicial
onMounted(() => {
  calculateProgress();
});
</script>

<template>
  <div class="container mt-4">
    <!-- Alert dinâmico -->
    <div class="alert" :class="`alert-${getAlertMessage().type}`" role="alert">
      <strong>{{ getAlertMessage().message }}</strong>
    </div>

    <!-- Barra de progresso -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0 me-3">Progresso:</h5>
      <div class="progress flex-grow-1" style="height: 30px;">
        <div 
          class="progress-bar progress-bar-striped progress-bar-animated" 
          :class="getProgressBarClass()"
          :style="{ width: `${progressPercentage}%` }"
          role="progressbar"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span class="fw-bold text-white">
            {{ progressPercentage }}% ({{ completedCount }}/{{ totalTasks }})
          </span>
        </div>
      </div>
    </div>

    <!-- Estatísticas detalhadas -->
    <div class="row text-center mt-3">
      <div class="col-4">
        <div class="card bg-light">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Total</h6>
            <span class="fw-bold fs-5">{{ totalTasks }}</span>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card bg-success text-white">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Concluídas</h6>
            <span class="fw-bold fs-5">{{ completedCount }}</span>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card bg-warning">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Pendentes</h6>
            <span class="fw-bold fs-5">{{ pendingTasks.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  border-radius: 15px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.5s ease-in-out;
}

.card {
  border: none;
  border-radius: 10px;
}
</style>