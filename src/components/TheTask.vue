<script setup>
import { ref, onMounted } from 'vue';
import TheProgress from './TheProgress.vue'; 

// ✅ Arrays reativos separados para pendentes e concluídas
const pendingTasks = ref([]);
const completedTasks = ref([]);

function saveTask() {
  let titleTask = document.getElementById("task").value;
  let priorityTask = document.getElementById("priority").value;
  let dateTimeTask = document.getElementById("date-time").value;
  let descriptionTask = document.getElementById("description").value;

  // ✅ VALIDAÇÃO
  if (!titleTask.trim() || !dateTimeTask.trim()) {
    alert("Informe os campos necessários (Atividade e Data/Hora)!");
    return;
  }

  // ✅ CRIAR NOVA TAREFA COM ID ÚNICO
  const newTask = {
    id: Date.now(),
    title: titleTask,
    priority: priorityTask,
    dateTime: dateTimeTask,
    description: descriptionTask,
    completed: false,
    createdAt: new Date().toISOString()
  };

  // ✅ CARREGAR TAREFAS EXISTENTES DO LOCALSTORAGE
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  // ✅ ADICIONAR NOVA TAREFA NO INÍCIO DO ARRAY (para aparecer à direita)
  existingTasks.unshift(newTask);
  
  // ✅ SALVAR ARRAY ATUALIZADO NO LOCALSTORAGE
  localStorage.setItem("tasks", JSON.stringify(existingTasks));

  alert("Atividade adicionada com sucesso!");

  // ✅ LIMPAR CAMPOS DO MODAL
  document.getElementById("task").value = "";
  document.getElementById("priority").value = "0";
  document.getElementById("date-time").value = "";
  document.getElementById("description").value = "";

  // ✅ FECHAR MODAL
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalSave"));
  modal.hide();

  // ✅ ATUALIZAR LISTA DE TAREFAS
  loadTasks();
}

function loadTasks() {
  // ✅ CARREGAR TAREFAS DO LOCALSTORAGE
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  // ✅ SEPARAR TAREFAS PENDENTES E CONCLUÍDAS
  pendingTasks.value = savedTasks.filter(task => !task.completed);
  completedTasks.value = savedTasks.filter(task => task.completed);
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

function completeTask(taskId) {
  // ✅ MARCAR TAREFA COMO CONCLUÍDA
  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task => 
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  loadTasks();
}

function deleteTask(taskId) {
  // ✅ REMOVER TAREFA
  if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    loadTasks();
  }
}

// ✅ CARREGAR TAREFAS QUANDO O COMPONENTE FOR MONTADO
onMounted(() => {
  loadTasks();
});
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-0 w-100">
    <!-- Botão que irá abrir o modal -->
    <button type="button" class="btn btn-success btn-lg mt-0 mb-4"
            data-bs-toggle="modal" data-bs-target="#modalSave">
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
            <!-- Input -->
            <div class="mb-3">
              <label class="form-label" for="task">Atividade:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-thumbtack"/>
                </span>
                <input class="form-control"
                    type="text"
                    id="task"
                    placeholder="Título da atividade que deseja realizar"
                    required>
              </div>
            </div>

            <!-- Select -->
            <div class="mb-3">
              <label for="priority" class="form-label">Nível de prioridade:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-flag"/>
                </span>
                <select class="form-select" name="priority" id="priority">
                  <option value="0">Sem prioridade</option>
                  <option value="1">Urgente</option>
                  <option value="2">Importante</option>
                  <option value="3">Normal</option>
                </select>
              </div>
            </div>

            <!-- Data e Hora -->
            <div class="mb-3">
              <label for="date-time" class="form-label">Data e Hora a realizar:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-calendar"/>
                </span>
                <input class="form-control" type="datetime-local" id="date-time">
              </div>
            </div>

            <!-- Descricao -->
            <div class="mb-3">
              <label for="description" class="form-label">Descrição:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-align-left"/>
                </span>
                <textarea class="form-control" id="description" rows="3" placeholder="Descreva o que deseja realizar (opcional)"></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveTask()">Salvar Alterações</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ BARRA DE PROGRESSO DINÂMICA -->
    <TheProgress 
      :completed-tasks="completedTasks"
      :pending-tasks="pendingTasks"
    />

    <!-- Área para mostrar as tarefas -->
    <div class="container mt-4 w-100">
      
      <!-- SEÇÃO 1: TAREFAS PENDENTES (Grid vertical) -->
      <div v-if="pendingTasks.length > 0" class="mb-5">
        <h3 class="text-center mb-4">Tarefas Pendentes</h3>
        <div class="row justify-content-start g-3">
          <div v-for="task in pendingTasks" :key="task.id" class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 task-card">
              <div class="card-body">
                <!-- Badge de prioridade -->
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge" :class="getPriorityBadgeClass(task.priority)">
                    {{ getPriorityText(task.priority) }}
                  </span>
                  <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
                </div>
                
                <!-- Título da tarefa -->
                <h5 class="card-title">
                  {{ task.title }}
                </h5>
                
                <!-- Detalhes da tarefa -->
                <div class="card-text">
                  <p class="mb-1"><small><strong>Data/Hora:</strong> {{ task.dateTime ? new Date(task.dateTime).toLocaleString() : 'Não definida' }}</small></p>
                  <p class="mb-2"><small><strong>Descrição:</strong> {{ task.description || 'Nenhuma descrição' }}</small></p>
                </div>

                <!-- Botões de ação -->
                <div class="d-flex justify-content-between pt-2">
                  <button 
                    class="btn btn-sm btn-success"
                    @click="completeTask(task.id)"
                  >
                    Concluir
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteTask(task.id)"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: TAREFAS CONCLUÍDAS (Rolagem horizontal) -->
      <div v-if="completedTasks.length > 0" class="mb-5">
        <h3 class="text-center mb-4">Tarefas Concluídas</h3>
        <div class="horizontal-scroll-container">
          <div class="horizontal-scroll-content">
            <div v-for="task in completedTasks" :key="task.id" class="horizontal-card">
              <div class="card h-100 completed-task">
                <div class="card-body">
                  <!-- Badge de prioridade -->
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-success">
                      Concluída
                    </span>
                    <small class="text-muted">{{ new Date(task.createdAt).toLocaleDateString() }}</small>
                  </div>
                  
                  <!-- Título da tarefa -->
                  <h6 class="card-title text-decoration-line-through">
                    {{ task.title }}
                  </h6>
                  
                  <!-- Detalhes da tarefa -->
                  <div class="card-text">
                    <p class="mb-1"><small><strong>Data/Hora:</strong> {{ task.dateTime ? new Date(task.dateTime).toLocaleString() : 'Não definida' }}</small></p>
                    <p class="mb-2"><small><strong>Descrição:</strong> {{ task.description || 'Nenhuma descrição' }}</small></p>
                  </div>

                  <!-- Botões de ação -->
                  <div class="d-flex justify-content-between pt-2">
                    <button 
                      class="btn btn-sm btn-warning"
                      @click="completeTask(task.id)"
                    >
                      Reabrir
                    </button>
                    <button 
                      class="btn btn-sm btn-danger" 
                      @click="deleteTask(task.id)"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não há tarefas -->
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
/* Estilos para as tarefas pendentes */
.task-card {
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Estilos para a rolagem horizontal das tarefas concluídas */
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
  width: 280px; /* Largura fixa para os cards horizontais */
  flex-shrink: 0;
}

/* Estilo para tarefas concluídas */
.completed-task {
  opacity: 0.85;
  border-left: 4px solid #198754;
}

/* Personalizar a barra de scroll */
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

/* Garantir que o texto dentro dos cards horizontais quebre */
.horizontal-card .card-text,
.horizontal-card .card-title {
  white-space: normal;
  word-wrap: break-word;
}
</style>