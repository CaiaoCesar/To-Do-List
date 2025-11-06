<script setup>
import { ref, onMounted, nextTick } from 'vue';
import TheProgress from './TheProgress.vue';
import Swal from 'sweetalert2'
import confetti from 'canvas-confetti';

const pendingTasks = ref([]);
const completedTasks = ref([]);

// ✅ VARIÁVEIS PARA DRAG & DROP
const draggedTask = ref(null);
const dragSource = ref(null);

// ✅ FUNÇÕES DE DRAG & DROP PARA TAREFAS 
function onDragStart(task, event, source) {
  draggedTask.value = task;
  dragSource.value = source;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', task.id);

  // ✅ Adiciona classe ao elemento correto
  const card = event.target.closest('.task-card, .completed-task') || event.target;
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
function onDropColumn(event, targetColumn) {
  event.preventDefault();
  
  // Remove efeitos visuais
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over-column');
  });

  if (!draggedTask.value || !dragSource.value) return;

  // Se a tarefa está sendo movida para uma coluna diferente
  if (dragSource.value !== targetColumn) {
    if (targetColumn === 'completed') {
      // Movendo para concluídas → Concluir tarefa
      completeTask(draggedTask.value.id);
    } else {
      // Movendo para pendentes → Reabrir tarefa
      reopenTask(draggedTask.value.id);
    }
  }

  draggedTask.value = null;
  dragSource.value = null;
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

  if (!dateTimeTask) {
    Swal.fire({
      title: "Atenção!",
      text: "Informe a data e hora para realizar a atividade!",
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
    completed: false,
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

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    pendingTasks.value = savedTasks.filter(task => !task.completed);
    completedTasks.value = savedTasks.filter(task => task.completed);
  } catch {
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
    title: '<i class="fa-solid fa-bullhorn fa-beat-fade" style="color: #e00b0b;"></i> Missão Cumprida!',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;"><strong>Parabéns!</strong> <br>Você concluiu mais uma tarefa!</p>
        <div style="font-size: 3rem;"><i class="fa-solid fa-trophy fa-fade" style="color: #efe706;"></i></div>
      </div>
    `,
    width: 400,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    showConfirmButton: true,
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#ffc107',
    allowHtml: true
  });
}

function completeTask(taskId) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task =>
    task.id === taskId ? { ...task, completed: true } : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  nextTick(() => {
    loadTasks();
    triggerCelebration();
  });
}

function triggerReopenMessage() {
  Swal.fire({
    title: '<i class="fa-solid fa-arrow-rotate-left fa-beat" style="color: #74C0FC;"></i> Tarefa Reaberta',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
          A tarefa foi movida de volta para <strong>pendentes</strong>.
        </p>
        <div style="font-size: 2.5rem;"><i class="fa-solid fa-clipboard-list fa-bounce" style="color: #edf1f7;"></i></div>
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
    allowHtml: true
  });
}

function reopenTask(taskId) {
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task =>
    task.id === taskId ? { ...task, completed: false } : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  nextTick(() => {
    loadTasks();
    triggerReopenMessage();
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
    <button type="button" class="btn btn-success btn-lg mt-0 mb-4" data-bs-toggle="modal" data-bs-target="#modalSave">
      Adicionar atividade
    </button>

    <!-- Modal -->
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

    <TheProgress :completed-tasks="completedTasks" :pending-tasks="pendingTasks" />

    <div class="container mt-4 w-100 .bg-warning">
      <div class="row">
        <!-- COLUNA PENDENTES -->
        <div class="col-12 col-lg-6">
          <div v-if="pendingTasks.length > 0" class="mb-5">
            <h3 class="text-center mb-4">
              <FontAwesomeIcon icon="clock" class="me-2 text-warning" />
              Tarefas Pendentes: {{ pendingTasks.length }}
              <small class="text-muted d-block mt-1" style="font-size: 0.8rem;">
                <FontAwesomeIcon icon="arrows-up-down-left-right" style="color: #ef7401;" /> 
                Mova a tarefa para mudar de estado e marcar como concluída.
              </small>
            </h3>
            
            <!-- Área de Drop para Pendentes -->
            <div class="drop-zone pending-drop-zone" 
                 @dragover="onDragOverColumn($event)"
                 @drop="onDropColumn($event, 'pending')">
              
              <div class="row justify-content-start g-3">
                <div v-for="task in pendingTasks" :key="task.id" 
                     class="col-12 col-md-6 col-xl-6">
                  <div class="card h-100 task-card" draggable="true" 
                       @dragstart="onDragStart(task, $event, 'pending')"
                       @dragend="onDragEnd">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge" :class="getPriorityBadgeClass(task.priority)">
                          {{ getPriorityText(task.priority) }}
                        </span>
                        <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
                      </div>

                      <h5 class="card-title">{{ task.title }}</h5>

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
            </div>
          </div>

          <!-- Estado vazio para pendentes -->
          <div v-else class="text-center empty-column">
            <div class="card mx-auto">
              <div class="card-body text-center">
                <h5>Nenhuma tarefa pendente</h5>
                <p class="text-muted">Arraste tarefas concluídas para cá para reabri-las</p>
              </div>
            </div>
          </div>
        </div>

      <!-- SEÇÃO 2: TAREFAS CONCLUÍDAS COM DRAG & DROP -->
      <div class="col-12 col-lg-6 .bg-success">
          <div v-if="completedTasks.length > 0" class="mb-5">
            <h3 class="text-center mb-4">
              <FontAwesomeIcon icon="check-circle" class="me-2 text-success" />
              Tarefas Concluídas: {{ completedTasks.length }}
              <small class="text-muted d-block mt-1" style="font-size: 0.8rem;">
                <FontAwesomeIcon icon="arrows-up-down-left-right" style="color: #ef7401;" /> 
                Mova a tarefa para reabrir e assim retornar o estado para pendente.
              </small>
            </h3>

         <!-- Área de Drop para Concluídas -->
            <div class="drop-zone completed-drop-zone"
                 @dragover="onDragOverColumn($event)"
                 @drop="onDropColumn($event, 'completed')">
              
              <div class="horizontal-scroll-container">
                <div class="horizontal-scroll-content">
                  <div v-for="task in completedTasks" :key="task.id" class="horizontal-card">
                    <div class="card h-100 completed-task" draggable="true"
                         @dragstart="onDragStart(task, $event, 'completed')"
                         @dragend="onDragEnd">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <span class="badge bg-success">Concluída</span>
                          <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
                        </div>

                        <h6 class="card-title text-decoration-line-through">{{ task.title }}</h6>

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
              </div>
            </div>
          </div>
          
          <!-- Estado vazio para concluídas -->
          <div v-else class="text-center empty-column">
            <div class="card mx-auto">
              <div class="card-body text-center">
                <h5>Nenhuma tarefa concluída</h5>
                <p class="text-muted">Arraste tarefas pendentes para cá para concluí-las</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado completamente vazio -->
      <div v-if="pendingTasks.length === 0 && completedTasks.length === 0" class="text-center">
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
.task-card {
  transition: all 0.3s ease;
  cursor: grab;
  user-select: none;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.dragging {
  opacity: 0.6;
  transform: rotate(3deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.task-card.drag-over {
  border: 2px dashed #198754;
  background-color: rgba(25, 135, 84, 0.05);
  transform: scale(1.02);
}

.completed-task {
  cursor: grab;
  user-select: none;
  transition: all 0.3s ease;
}

.completed-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.completed-task:active {
  cursor: grabbing;
}

.completed-task.dragging {
  opacity: 0.6;
  transform: rotate(3deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.completed-task.drag-over {
  border: 2px dashed #198754;
  background-color: rgba(25, 135, 84, 0.05);
  transform: scale(1.02);
}

.drop-zone {
  min-height: 200px;
  border: 2px dashed transparent;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
}

.drop-zone.drag-over-column {
  border-color: #198754;
  background-color: rgba(25, 135, 84, 0.05);
}

.pending-drop-zone.drag-over-column {
  border-color: #ffc107;
  background-color: rgba(255, 193, 7, 0.05);
}

.completed-drop-zone.drag-over-column {
  border-color: #198754;
  background-color: rgba(25, 135, 84, 0.05);
}

.empty-column {
  opacity: 0.7;
}

.empty-column .card {
  border: 2px dashed #dee2e6;
  background-color: #f8f9fa;
}

.task-card, .completed-task {
  transition: all 0.3s ease;
  cursor: grab;
  user-select: none;
}

.task-card:hover, .completed-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-card:active, .completed-task:active {
  cursor: grabbing;
}

.task-card.dragging, .completed-task.dragging {
  opacity: 0.6;
  transform: rotate(3deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

.completed-task {
  opacity: 0.85;
  border-left: 4px solid #198754;
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
</style>
