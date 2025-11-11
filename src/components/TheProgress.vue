<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  completedTasks: {
    type: Array,
    default: () => []
  },
  pendingTasks: {
    type: Array,
    default: () => []
  },
  allTasks: {
    type: Array,
    default: () => []
  },
  customStates: {
    type: Array,
    default: () => []
  }
});

const progressPercentage = ref(0);
const totalTasks = ref(0);
const completedCount = ref(0);
const customStatesCount = ref(0);

function calculateProgress() {
  completedCount.value = props.completedTasks.length;
  customStatesCount.value = props.allTasks.filter(task =>
    task.state && task.state.startsWith('custom_')
  ).length;

  totalTasks.value = props.allTasks.length;

  if (totalTasks.value === 0) {
    progressPercentage.value = 0;
  } else {
    // Progresso considera tarefas concluídas + bônus por tarefas em estados customizados
    const baseProgress = (completedCount.value / totalTasks.value) * 100;
    const customBonus = (customStatesCount.value / totalTasks.value) * 25; // Bônus de 25%
    progressPercentage.value = Math.min(Math.round(baseProgress + customBonus), 100);
  }
}

function getProgressBarClass() {
  if (progressPercentage.value === 0) return 'bg-secondary';
  if (progressPercentage.value < 30) return 'bg-danger';
  if (progressPercentage.value < 70) return 'bg-warning';
  if (progressPercentage.value < 100) return 'bg-info';
  return 'bg-success';
}

function getAlertMessage() {
  if (totalTasks.value === 0) {
    return { message: 'Crie sua primeira tarefa para começar!', type: 'secondary' };
  }
  if (progressPercentage.value === 100) {
    return { message: 'Excelente! Todas as tarefas concluídas!', type: 'success' };
  }
  if (customStatesCount.value > 0) {
    return { message: `${customStatesCount.value} tarefa(s) em fluxo personalizado!`, type: 'info' };
  }
  if (progressPercentage.value >= 70) {
    return { message: 'Ótimo progresso! Continue assim!', type: 'info' };
  }
  if (progressPercentage.value >= 30) {
    return { message: 'Bom ritmo! Mantenha o foco!', type: 'warning' };
  }
  return { message: 'Vamos começar! Organize suas tarefas!', type: 'danger' };
}

watch(() => [props.completedTasks, props.pendingTasks, props.allTasks], () => {
  calculateProgress();
}, { deep: true, immediate: true });

onMounted(() => {
  calculateProgress();
});
</script>

<template>
  <div class="container mt-4">
    <div class="alert text-center" :class="`alert-${getAlertMessage().type}`" role="alert">
      <strong>{{ getAlertMessage().message }}</strong>
    </div>

    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0 me-3">Progresso das Tarefas:</h5>
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
            {{ progressPercentage }}%
          </span>
        </div>
      </div>
    </div>

    <div class="row text-center mt-3">
      <div class="col-3">
        <div class="card bg-light">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Total</h6>
            <span class="fw-bold fs-5">{{ totalTasks }}</span>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card bg-success text-white">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Concluídas</h6>
            <span class="fw-bold fs-5">{{ completedCount }}</span>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card bg-info text-white">
          <div class="card-body py-2">
            <h6 class="card-title mb-1">Em Fluxo</h6>
            <span class="fw-bold fs-5">{{ customStatesCount }}</span>
          </div>
        </div>
      </div>
      <div class="col-3">
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
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
