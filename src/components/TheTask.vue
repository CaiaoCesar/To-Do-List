<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import TheProgress from './TheProgress.vue';
import Swal from 'sweetalert2'
import confetti from 'canvas-confetti';

// ✅ ESTADOS PADRÃO + ESTADOS CUSTOMIZADOS
const defaultStates = [
  { id: 'pending', name: 'Pendentes', color: '#ffc107', icon: 'clock', order: 0 },
  { id: 'completed', name: 'Concluídas', color: '#198754', icon: 'check-circle', order: 999 }
];

const customStates = ref([]);
const pendingTasks = ref([]);
const completedTasks = ref([]);
const allTasks = ref([]);
const draggedState = ref(null);

// ✅ VARIÁVEIS PARA DRAG & DROP
const draggedTask = ref(null);
const dragSource = ref(null);


// ✅ CARREGAR ESTADOS CUSTOMIZADOS
function loadCustomStates() {
  try {
    const savedStates = JSON.parse(localStorage.getItem("customStates")) || [];
    customStates.value = savedStates;
  } catch {
    customStates.value = [];
  }
}

// ✅ TODOS OS ESTADOS COMBINADOS
const allStates = computed(() => {
  return [...defaultStates, ...customStates.value].sort((a, b) => a.order - b.order);
});

// ✅ OBTER TAREFAS POR ESTADO
function getTasksByState(stateId) {
  return allTasks.value.filter(task => task.state === stateId);
}

// ✅ ADICIONAR NOVO ESTADO
function addCustomState() {
  Swal.fire({
    title: 'Criar Novo Estado',
    html: `
      <input id="stateName" class="swal2-input" placeholder="Nome do estado (ex: Em Andamento)">
      <input id="stateColor" type="color" class="swal2-input" value="#17a2b8">
      <select id="stateIcon" class="swal2-input">
        <option value="gear">Engrenagem</option>
        <option value="rocket">Foguete</option>
        <option value="clock">Relógio</option>
        <option value="hourglass">Ampulheta</option>
        <option value="flag">Bandeira</option>
        <option value="star">Estrela</option>
        <option value="heart">Coração</option>
        <option value="lightbulb">Lâmpada</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Criar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#stateName').value;
      const color = Swal.getPopup().querySelector('#stateColor').value;
      const icon = Swal.getPopup().querySelector('#stateIcon').value;

      if (!name) {
        Swal.showValidationMessage('Por favor, digite um nome para o estado');
        return false;
      }

      return { name, color, icon };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const newState = {
        id: 'custom_' + Date.now(),
        name: result.value.name,
        color: result.value.color,
        icon: result.value.icon,
        order: customStates.value.length + 1
      };

      customStates.value.push(newState);
      saveCustomStates();

      Swal.fire({
        title: 'Estado Criado!',
        text: `"${result.value.name}" foi adicionado com sucesso`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

// ✅ SALVAR ESTADOS CUSTOMIZADOS
function saveCustomStates() {
  localStorage.setItem("customStates", JSON.stringify(customStates.value));
}

// ✅ EDITAR ESTADO
function editState(state) {
  Swal.fire({
    title: 'Editar Estado',
    html: `
      <input id="stateName" class="swal2-input" value="${state.name}">
      <input id="stateColor" type="color" class="swal2-input" value="${state.color}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#stateName').value;
      const color = Swal.getPopup().querySelector('#stateColor').value;

      if (!name) {
        Swal.showValidationMessage('Por favor, digite um nome para o estado');
        return false;
      }

      return { name, color };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      state.name = result.value.name;
      state.color = result.value.color;
      saveCustomStates();
      loadTasks(); // Recarregar para aplicar mudanças
    }
  });
}

// ✅ EXCLUIR ESTADO
function deleteState(state) {
  Swal.fire({
    title: 'Excluir Estado?',
    text: `Todas as tarefas em "${state.name}" voltarão para "Pendentes"`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Mover tarefas deste estado para Pendentes
      const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = existingTasks.map(task =>
        task.state === state.id ? { ...task, state: 'pending' } : task
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      // Remover estado
      customStates.value = customStates.value.filter(s => s.id !== state.id);
      saveCustomStates();
      loadTasks();

      Swal.fire('Excluído!', 'O estado foi removido.', 'success');
    }
  });
}

// ✅ DRAG & DROP PARA REORDENAR ESTADOS
function onStateDragStart(state, event) {
  draggedState.value = state;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', state.id);

  const header = event.target.closest('.state-header');
  if (header) {
    header.classList.add('state-dragging');
  }
}

function onStateDragOver(event, targetState) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  if (!draggedState.value || draggedState.value.id === targetState.id) return;

  const header = event.target.closest('.state-header');
  if (header) {
    header.classList.add('state-drag-over');
  }
}

function onStateDragLeave(event) {
  const header = event.target.closest('.state-header');
  if (header) {
    header.classList.remove('state-drag-over');
  }
}

function onStateDrop(event, targetState) {
  event.preventDefault();

  document.querySelectorAll('.state-header').forEach(header => {
    header.classList.remove('state-drag-over', 'state-dragging');
  });

  if (!draggedState.value || draggedState.value.id === targetState.id) return;

  reorderStates(draggedState.value, targetState);
  draggedState.value = null;
}

function onStateDragEnd() {
  document.querySelectorAll('.state-header').forEach(header => {
    header.classList.remove('state-drag-over', 'state-dragging');
  });
  draggedState.value = null;
}

// ✅ REORDENAR ESTADOS
function reorderStates(draggedState, targetState) {
  // Não permitir reordenar estados padrão
  if (!draggedState.id.startsWith('custom_') || !targetState.id.startsWith('custom_')) {
    Swal.fire({
      title: 'Atenção!',
      text: 'Estados padrão (Pendentes e Concluídas) não podem ser reordenados.',
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  const draggedIndex = customStates.value.findIndex(s => s.id === draggedState.id);
  const targetIndex = customStates.value.findIndex(s => s.id === targetState.id);

  if (draggedIndex === -1 || targetIndex === -1) return;

  // Remove o estado arrastado
  const [movedState] = customStates.value.splice(draggedIndex, 1);

  // Insere na nova posição
  customStates.value.splice(targetIndex, 0, movedState);

  // Atualiza a ordem numérica
  updateStatesOrder();

  saveCustomStates();
}

// ✅ ATUALIZAR ORDEM NUMÉRICA DOS ESTADOS
function updateStatesOrder() {
  customStates.value.forEach((state, index) => {
    state.order = index + 1; // +1 porque pending tem order 0
  });
}

// ✅ FUNÇÕES DE DRAG & DROP PARA TAREFAS
function onDragStart(task, event, source) {
  draggedTask.value = task;
  dragSource.value = source;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', task.id);

  // ✅ Adiciona classe ao elemento correto
  const card = event.target.closest('.task-card') || event.target;
  card.classList.add('dragging');
}

function onDragOverColumn(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  // Adiciona efeito visual na coluna de destino
  const dropZone = event.currentTarget;
  dropZone.classList.add('drag-over-column');
}

// ✅ DROP ENTRE COLUNAS (CONCLUIR/REABRIR)
function onDropColumn(event, targetState) {
  event.preventDefault();

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over-column');
  });

  if (!draggedTask.value || !dragSource.value) return;

  // Se a tarefa está sendo movida para um estado diferente
  if (dragSource.value !== targetState) {
    moveTaskToState(draggedTask.value.id, targetState);
  }

  draggedTask.value = null;
  dragSource.value = null;
}

// ✅ MOVER TAREFA PARA OUTRO ESTADO
function moveTaskToState(taskId, newState) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task =>
    task.id === taskId ? { ...task, state: newState } : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  loadTasks();

  // Animações especiais para estados padrão
  if (newState === 'completed') {
    triggerCelebration();
  } else if (newState === 'pending' && dragSource.value !== 'pending') {
    triggerReopenMessage();
  }
}

// ✅ OBTER POSIÇÃO DO ESTADO
function getStatePosition(state) {
  const index = allStates.value.findIndex(s => s.id === state.id);
  return index + 1; // Posição começa em 1
}

// ✅ FUNÇÕES DE DRAG & DROP PARA TAREFAS CONCLUÍDAS (HORIZONTAL)
function onDragEnd() {
  const allCards = document.querySelectorAll('.task-card, .completed-task');
  const allDropZones = document.querySelectorAll('.drop-zone');

  allCards.forEach(card => {
    card.classList.remove('dragging', 'drag-over');
  });

  allDropZones.forEach(zone => {
    zone.classList.remove('drag-over-column');
  });

  draggedTask.value = null;
  dragSource.value = null;
}

// ✅ SALVAR TAREFA ATUALIZADO
function saveTask() {
  const titleTask = document.getElementById("task").value;
  const priorityTask = document.getElementById("priority").value;
  const dateTimeTask = document.getElementById("date-time").value;
  const descriptionTask = document.getElementById("description").value;

  if (!titleTask || !titleTask.trim()) {
    Swal.fire({
      title: "Atenção!",
      text: "Informe o título da atividade!",
      icon: "warning",
      width: 400
    });
    return;
  }

  const newTask = {
    id: Date.now(),
    title: titleTask.trim(),
    priority: priorityTask,
    dateTime: dateTimeTask,
    description: descriptionTask.trim(),
    state: 'pending', // ✅ AGORA USA 'state' EM VEZ DE 'completed'
    createdAt: new Date().toISOString()
  };

  try {
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    existingTasks.unshift(newTask);
    localStorage.setItem("tasks", JSON.stringify(existingTasks));

    const modalElement = document.getElementById("modalSave");
    if (modalElement) {
      const bootstrap = window.bootstrap;
      if (bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      } else {
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        } else {
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    }

    document.getElementById("task").value = "";
    document.getElementById("priority").value = "0";
    document.getElementById("date-time").value = "";
    document.getElementById("description").value = "";

    nextTick(() => {
      loadTasks();
    });

    Swal.fire({
      title: "Tarefa Salva!",
      text: "Sua tarefa foi adicionada com sucesso.",
      icon: "success",
      width: 320,
      timer: 2000,
      showConfirmButton: false
    });

  } catch {
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível salvar a tarefa.",
      icon: "error",
      width: 400
    });
  }
}

function getColumnClass() {
  const totalStates = allStates.value.length;

  if (totalStates <= 2) {
    return 'col-12 col-lg-6';
  } else if (totalStates === 3) {
    return 'col-12 col-lg-4';
  } else {
    return 'col-12 col-lg-3';
  }
}

function getStateHint(stateId) {
  const hints = {
    'pending': 'Mova para outros estados para progredir',
    'completed': 'Mova para pendentes para reabrir'
  };
  return hints[stateId] || 'Mova tarefas para este estado';
}


// ✅ CARREGAR TAREFAS ATUALIZADO
function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // ✅ MIGRAÇÃO: converter tarefas antigas para novo formato
    const migratedTasks = savedTasks.map(task => {
      if (task.state === undefined) {
        // Se não tem state, é tarefa antiga - converter
        return {
          ...task,
          state: task.completed ? 'completed' : 'pending'
        };
      }
      return task;
    });

    allTasks.value = migratedTasks;

    // Atualizar localStorage com dados migrados
    if (savedTasks.length > 0 && savedTasks[0].state === undefined) {
      localStorage.setItem("tasks", JSON.stringify(migratedTasks));
    }

    // Agrupar tarefas por estado
    pendingTasks.value = getTasksByState('pending');
    completedTasks.value = getTasksByState('completed');
  } catch {
    allTasks.value = [];
    pendingTasks.value = [];
    completedTasks.value = [];
  }
}

function getPriorityText(priorityValue) {
  const priorities = {
    "0": "Sem prioridade",
    "1": "Urgente",
    "2": "Importante",
    "3": "Normal"
  };
  return priorities[priorityValue] || "Não definida";
}

function getPriorityBadgeClass(priorityValue) {
  const priorityClasses = {
    "0": "bg-secondary",
    "1": "bg-danger",
    "2": "bg-warning",
    "3": "bg-info"
  };
  return priorityClasses[priorityValue] || "bg-secondary";
}

function triggerCelebration() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#198754', '#20c997', '#ffc107', '#fd7e14', '#e83e8c']
  });

  Swal.fire({
    title: '📢 Missão Cumprida!',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;"><strong>Parabéns!</strong> <br>Você concluiu mais uma tarefa!</p>
        <div style="font-size: 3rem;">🏆</div>
      </div>
    `,
    width: 400,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    showConfirmButton: true,
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#ffc107',
  });
}



function triggerReopenMessage() {
  Swal.fire({
    title: '↩ Tarefa Reaberta',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
          A tarefa foi movida de volta para <strong>pendentes</strong>.
        </p>
        <div style="font-size: 2.5rem;">📝</div>
      </div>
    `,
    width: 380,
    background: '#e3f2fd',
    color: '#1976d2',
    showConfirmButton: true,
    confirmButtonText: 'Entendi',
    confirmButtonColor: '#1976d2',
    timer: 2500,
    timerProgressBar: true,
  });
}

function deleteTask(taskId) {
  Swal.fire({
    title: "Quer excluir essa tarefa?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Sim quero.",
    denyButtonText: `Melhor não.`
  }).then((result) => {
    if (result.isConfirmed) {
      const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = existingTasks.filter(task => task.id !== taskId);

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      nextTick(() => {
        loadTasks();
        Swal.fire("Tarefa Excluída!", "", "success");
      });
    } else if (result.isDenied) {
      Swal.fire("Tarefa Mantida!", "", "info");
    }
  });
}

onMounted(() => {
  loadCustomStates();
  loadTasks();
});

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'tasks') {
      loadTasks();
    }
  });
}
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-0 w-100">
    <div class="d-flex gap-2 mb-4">
      <button type="button" class="btn btn-success btn-lg text-white" data-bs-toggle="modal"
        data-bs-target="#modalSave">
        <FontAwesomeIcon icon="plus" class="text-white me-2" />
        Adicionar atividade
      </button>
      <button type="button" class="btn btn-primary btn-lg" @click="addCustomState">
        <FontAwesomeIcon icon="layer-group" class="text-white me-2" />
        Novo Estado
      </button>
    </div>

    <!-- Modal completo -->
    <div id="modalSave" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Informações da atividade</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label" for="task">Atividade:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-thumbtack" />
                </span>
                <input class="form-control" type="text" id="task" placeholder="Título da atividade que deseja realizar"
                  required>
              </div>
            </div>

            <div class="mb-3">
              <label for="priority" class="form-label">Nível de prioridade:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-flag" />
                </span>
                <select class="form-select" name="priority" id="priority">
                  <option value="0">Sem prioridade</option>
                  <option value="1">Urgente</option>
                  <option value="2">Importante</option>
                  <option value="3">Normal</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="date-time" class="form-label">Data e Hora a realizar:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-calendar" />
                </span>
                <input class="form-control" type="datetime-local" id="date-time">
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Descrição:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-align-left" />
                </span>
                <textarea class="form-control" id="description" rows="3"
                  placeholder="Descreva o que deseja realizar (opcional)"></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary" @click="saveTask()">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>

    <TheProgress :completed-tasks="completedTasks" :pending-tasks="pendingTasks" :all-tasks="allTasks"
      :custom-states="customStates" />

    <div class="container mt-4 w-100">
      <div class="row">
        <!-- COLUNAS DINÂMICAS PARA TODOS OS ESTADOS -->
        <div v-for="state in allStates" :key="state.id" :class="getColumnClass(state.id)" class="state-column">

          <div class="state-header d-flex justify-content-between align-items-center mb-3"
            :draggable="state.id.startsWith('custom_')" @dragstart="onStateDragStart(state, $event)"
            @dragover="onStateDragOver($event, state)" @dragleave="onStateDragLeave($event)"
            @drop="onStateDrop($event, state)" @dragend="onStateDragEnd">

            <div class="d-flex align-items-center flex-grow-1">
              <!-- Ícone de arrastar apenas para estados customizados -->
              <FontAwesomeIcon v-if="state.id.startsWith('custom_')" icon="grip-vertical"
                class="me-2 text-muted state-handle" style="cursor: grab;" />

              <h3 class="text-center mb-0 flex-grow-1">
                <FontAwesomeIcon :icon="state.icon" class="me-2" :style="{ color: state.color }" />
                {{ state.name }}: {{ getTasksByState(state.id).length }}

                <small class="text-muted d-block mt-1" style="font-size: 0.8rem;">
                  <FontAwesomeIcon icon="arrows-up-down-left-right" style="color: #ef7401;" />
                  {{ getStateHint(state.id) }}
                  <span v-if="state.id.startsWith('custom_')" class="badge bg-light text-dark ms-1">
                    Posição: {{ getStatePosition(state) }}
                  </span>
                </small>
              </h3>
            </div>

            <!-- Botões de editar/excluir para estados customizados -->
            <div v-if="state.id.startsWith('custom_')" class="state-actions ms-2">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" @click="editState(state)" title="Editar estado">
                  <FontAwesomeIcon icon="edit" />
                </button>
                <button class="btn btn-outline-danger" @click="deleteState(state)" title="Excluir estado">
                  <FontAwesomeIcon icon="trash" />
                </button>
              </div>
            </div>

          </div>

          <!-- Área de Drop para o Estado -->
          <div class="mb-4">
            <div class="drop-zone" :class="`${state.id}-drop-zone`" @dragover="onDragOverColumn($event)"
              @drop="onDropColumn($event, state.id)" :style="{ borderColor: state.color }">

              <div v-if="getTasksByState(state.id).length > 0">
                <!-- Layout vertical para Pendentes e Custom -->
                <div v-if="state.id !== 'completed'" class="row justify-content-start g-3">
                  <div v-for="task in getTasksByState(state.id)" :key="task.id" class="col-12 col-md-6 col-xl-12">
                    <div class="card h-100 task-card" :class="`state-${state.id}`" draggable="true"
                      @dragstart="onDragStart(task, $event, state.id)" @dragend="onDragEnd"
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
                          <p class="mb-2"><small><strong>Descrição:</strong> {{ task.description || 'Nenhuma descrição'
                          }}</small></p>
                        </div>

                        <div class="d-flex justify-content-between pt-2">
                          <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Layout horizontal apenas para Concluídas -->
                <div v-else class="horizontal-scroll-container">
                  <div class="horizontal-scroll-content">
                    <div v-for="task in getTasksByState(state.id)" :key="task.id" class="horizontal-card">
                      <div class="card h-100 completed-task" draggable="true"
                        @dragstart="onDragStart(task, $event, state.id)" @dragend="onDragEnd">

                        <div class="card-body">
                          <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-success">Concluída</span>
                            <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
                          </div>

                          <h6 class="card-title text-decoration-line-through">{{ task.title }}</h6>

                          <div class="card-text">
                            <p class="mb-1"><small><strong>Data/Hora:</strong> {{ task.dateTime ? new
                              Date(task.dateTime).toLocaleString() : 'Não definida' }}</small></p>
                            <p class="mb-2"><small><strong>Descrição:</strong>
                                {{ task.description || 'Nenhuma descrição'
                                }}</small></p>
                          </div>

                          <div class="d-flex justify-content-between pt-2">
                            <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estado vazio -->
              <div v-else class="text-center empty-column">
                <div class="card mx-auto">
                  <div class="card-body text-center">
                    <h5>Nenhuma tarefa {{ state.name.toLowerCase() }}</h5>
                    <p class="text-muted">Arraste tarefas de outros estados para cá</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado completamente vazio -->
      <div v-if="allTasks.length === 0" class="text-center">
        <div class="card mx-auto" style="max-width: 400px;">
          <div class="card-body text-center">
            <h4 class="card-title">Nenhuma atividade ainda</h4>
            <div class="card-text">
              <p>Dê prioridade a você...</p>
              <p>No seu tempo e na sua hora.</p>
              <p>Que tal adicionar uma nova atividade?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ESTILOS DINÂMICOS POR ESTADO */
.state-column {
  margin-bottom: 2rem;
}

.task-card {
  transition: all 0.3s ease;
  cursor: grab;
  user-select: none;
  border-left: 4px solid;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%);
  border: 1px solid #dee2e6;
}

/* Estado Pendente */
.state-pending.task-card {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 50%);
  border-color: #ffeaa7;
}

/* Estado Concluído */
.completed-task {
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 50%);
  border: 1px solid #c3e6cb;
  border-left: 4px solid #28a745;
  opacity: 0.95;
}

/* Estados Customizados - cores dinâmicas */
.state-custom_.task-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%);
}

/* Drop zones com cores dinâmicas */
.drop-zone {
  min-height: 200px;
  border: 2px dashed transparent;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
}

.drop-zone.drag-over-column {
  background-color: rgba(0, 0, 0, 0.03);
}

.pending-drop-zone.drag-over-column {
  border-color: #ffc107;
  background-color: rgba(255, 193, 7, 0.05);
}

.completed-drop-zone.drag-over-column {
  border-color: #198754;
  background-color: rgba(25, 135, 84, 0.05);
}

.state-actions {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.state-header:hover .state-actions {
  opacity: 1;
}

/* Efeitos hover mantidos */
.task-card:hover,
.completed-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.task-card:active,
.completed-task:active {
  cursor: grabbing;
}

.task-card.dragging,
.completed-task.dragging {
  opacity: 0.6;
  transform: rotate(3deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.task-card.drag-over,
.completed-task.drag-over {
  border: 2px dashed #198754;
  background-color: rgba(25, 135, 84, 0.05);
  transform: scale(1.02);
}

.empty-column {
  opacity: 0.7;
}

.empty-column .card {
  border: 2px dashed #dee2e6;
  background-color: #f8f9fa;
}

.horizontal-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
  white-space: nowrap;
}

.horizontal-scroll-content {
  display: inline-flex;
  gap: 15px;
  padding: 0 10px;
}

.horizontal-card {
  display: inline-block;
  width: 280px;
  flex-shrink: 0;
}

.horizontal-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.horizontal-card .card-text,
.horizontal-card .card-title {
  white-space: normal;
  word-wrap: break-word;
}

/* ESTILOS PARA DRAG & DROP DE ESTADOS */
.state-header {
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 8px;
  cursor: default;
}

.state-header[draggable="true"] {
  cursor: grab;
}

.state-header.state-dragging {
  opacity: 0.6;
  background-color: rgba(0, 0, 0, 0.05);
  transform: rotate(2deg);
}

.state-header.state-drag-over {
  border: 2px dashed #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.state-handle:hover {
  color: #007bff !important;
}

.state-actions {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.state-header:hover .state-actions {
  opacity: 1;
}

/* Indicador visual da ordem */
.state-order-badge {
  font-size: 0.7rem;
  padding: 2px 6px;
}

/* Responsividade para múltiplas colunas */
@media (max-width: 768px) {
  .state-column {
    margin-bottom: 1rem;
  }
}
</style>
