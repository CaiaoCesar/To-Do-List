<script setup>
import { ref, onMounted, watch } from 'vue';

// ✅ Props atualizados para receber todos os dados
const props = defineProps({
  completedTasks: {
    type: Array,
    default: () => []
  },
  pendingTasks: {
    type: Array,
    default: () => []
  },
  allTasks: { // ✅ NOVO: receber todas as tarefas
    type: Array,
    default: () => []
  },
  customStates: { // ✅ NOVO: receber estados customizados
    type: Array,
    default: () => []
  }
});

// ✅ Estado reativo para o progresso
const progressPercentage = ref(0);
const totalTasks = ref(0);
const completedCount = ref(0);
const inProgressCount = ref(0); // ✅ NOVO: tarefas em estados customizados

// ✅ Função para calcular o progresso ATUALIZADA
function calculateProgress() {
  completedCount.value = props.completedTasks.length;

  // ✅ CONTAR tarefas em estados customizados (consideradas "em andamento")
  inProgressCount.value = props.allTasks.filter(task =>
    !['pending', 'completed'].includes(task.state)
  ).length;

  totalTasks.value = props.allTasks.length;

  if (totalTasks.value === 0) {
    progressPercentage.value = 0;
  } else {
    // ✅ NOVA LÓGICA: considerar estados customizados como progresso parcial
    const baseProgress = (completedCount.value / totalTasks.value) * 100;
    const inProgressBonus = (inProgressCount.value / totalTasks.value) * 30; // Máximo 30% de bônus
    progressPercentage.value = Math.min(Math.round(baseProgress + inProgressBonus), 100);
  }
}

// ✅ Watcher para recalcular quando os dados mudarem
watch(() => [props.completedTasks, props.pendingTasks, props.allTasks, props.customStates], () => {
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

// ✅ Função para determinar o texto do alerta ATUALIZADA
function getAlertMessage() {
  if (totalTasks.value === 0) {
    return { message: 'Nenhuma tarefa criada ainda.', type: 'secondary' };
  }
  if (progressPercentage.value === 0 && inProgressCount.value === 0) {
    return { message: 'Você tem tarefas pendentes. Vamos começar!', type: 'danger' };
  }
  if (progressPercentage.value === 100) {
    return { message: 'Parabéns! Todas as tarefas foram concluídas! 🎉', type: 'success' };
  }
  if (inProgressCount.value > 0) {
    return { message: `Ótimo! ${inProgressCount.value} tarefa(s) em andamento.`, type: 'info' };
  }
  if (progressPercentage.value >= 70) {
    return { message: 'Ótimo progresso! Continue assim!', type: 'info' };
  }
  if (progressPercentage.value >= 30) {
    return { message: 'Bom progresso! Mantenha o ritmo!', type: 'warning' };
  }
  return { message: 'Vamos começar as tarefas!', type: 'danger' };
}

// ✅ Calcular progresso inicial
onMounted(() => {
  calculateProgress();
});
</script>

<template>
  <div class="container mt-4">
    <!-- Alert dinâmico -->
    <div class="alert text-center" :class="`alert-${getAlertMessage().type}`" role="alert">
      <strong>{{ getAlertMessage().message }}</strong>
    </div>

    <!-- Barra de progresso -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0 me-3">Progresso Geral:</h5>
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

    <!-- Estatísticas detalhadas ATUALIZADAS -->
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
            <h6 class="card-title mb-1">Estados criados</h6>
            <span class="fw-bold fs-5">{{ inProgressCount }}</span>
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
}
</style>
