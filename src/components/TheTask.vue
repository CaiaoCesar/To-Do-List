<script setup>
import { ref, onMounted, nextTick } from 'vue';
import TheProgress from './TheProgress.vue';
import Swal from 'sweetalert2'
import confetti from 'canvas-confetti';

const pendingTasks = ref([]);
const completedTasks = ref([]);

function saveTask() {
  const titleTask = document.getElementById("task").value;
  const priorityTask = document.getElementById("priority").value;
  const dateTimeTask = document.getElementById("date-time").value;
  const descriptionTask = document.getElementById("description").value;

  // ✅ VALIDAÇÃO
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


  // ✅ CRIAR NOVA TAREFA
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
    // ✅ SALVAR NO LOCALSTORAGE
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    existingTasks.unshift(newTask);
    localStorage.setItem("tasks", JSON.stringify(existingTasks));

    // ✅ CORREÇÃO SIMPLES: Fechar modal usando método nativo
    const modalElement = document.getElementById("modalSave");
    if (modalElement) {
      // ✅ Método mais simples: usar o data-bs-dismiss
      const bootstrap = window.bootstrap;
      if (bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      } else {
        // ✅ Fallback: Simular clique no botão fechar
        const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        } else {
          // ✅ Último fallback: esconder manualmente
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    }

    // ✅ LIMPAR CAMPOS DO MODAL
    document.getElementById("task").value = "";
    document.getElementById("priority").value = "0";
    document.getElementById("date-time").value = "";
    document.getElementById("description").value = "";

    // ✅ ATUALIZAR A LISTA
    nextTick(() => {
      loadTasks();
    });

    // ✅ MOSTRAR CONFIRMAÇÃO
    Swal.fire({
      title: "✅ Tarefa Salva!",
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
    // ✅ CARREGAR TAREFAS DO LOCALSTORAGE
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // ✅ CORREÇÃO: Atribuir os valores diretamente para garantir reatividade
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
    title: '🎉 Missão Cumprida!',
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
    confirmButtonColor: '#ffc107'
  });
}

function completeTask(taskId) {

  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task =>
    task.id === taskId ? { ...task, completed: true } : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  // ✅ USAR nextTick PARA GARANTIR ATUALIZAÇÃO
  nextTick(() => {
    loadTasks();
    triggerCelebration();
  });
}

function triggerReopenMessage() {
  Swal.fire({
    title: '↩️ Tarefa Reaberta',
    html: `
      <div style="text-align: center;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
          A tarefa foi movida de volta para <strong>pendentes</strong>.
        </p>
        <div style="font-size: 2.5rem;">📋</div>
      </div>
    `,
    width: 380,
    background: '#e3f2fd',
    color: '#1976d2',
    showConfirmButton: true,
    confirmButtonText: 'Entendi',
    confirmButtonColor: '#1976d2',
    timer: 2500,
    timerProgressBar: true
  });
}

function reopenTask(taskId) {

  const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = existingTasks.map(task =>
    task.id === taskId ? { ...task, completed: false } : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  // ✅ USAR nextTick PARA GARANTIR ATUALIZAÇÃO
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

      // ✅ USAR nextTick PARA GARANTIR ATUALIZAÇÃO
      nextTick(() => {
        loadTasks();
        Swal.fire("Tarefa Excluída!", "", "success");
      });
    } else if (result.isDenied) {
      Swal.fire("Tarefa Mantida!", "", "info");
    }
  });
}

// ✅ CARREGAR TAREFAS QUANDO O COMPONENTE FOR MONTADO
onMounted(() => {
  loadTasks();
});

// ✅ OPCIONAL: Adicionar listener para atualizações em outras abas
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
    <!-- Botão que irá abrir o modal -->
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
            <!-- Input -->
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

            <!-- Select -->
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

            <!-- Data e Hora -->
            <div class="mb-3">
              <label for="date-time" class="form-label">Data e Hora a realizar:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-calendar" />
                </span>
                <input class="form-control" type="datetime-local" id="date-time">
              </div>
            </div>

            <!-- Descricao -->
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

    <!-- ✅ BARRA DE PROGRESSO DINÂMICA -->
    <TheProgress :completed-tasks="completedTasks" :pending-tasks="pendingTasks" />

    <!-- Área para mostrar as tarefas -->
    <div class="container mt-4 w-100">
      <!-- SEÇÃO 1: TAREFAS PENDENTES -->
      <div v-if="pendingTasks.length > 0" class="mb-5">
        <h3 class="text-center mb-4">
          <FontAwesomeIcon icon="fa-solid fa-clock" class="me-2 text-warning" />
          Tarefas Pendentes: {{ pendingTasks.length }}
        </h3>
        <div class="row justify-content-start g-3">
          <div v-for="task in pendingTasks" :key="task.id" class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 task-card">
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
                  <button class="btn btn-sm btn-success" @click="completeTask(task.id)">
                    Concluir
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteTask(task.id)">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: TAREFAS CONCLUÍDAS -->
      <div v-if="completedTasks.length > 0" class="mb-5">
        <h3 class="text-center mb-4">
          <FontAwesomeIcon icon="fa-solid fa-check-circle" class="me-2 text-success" />
          Tarefas Concluídas: {{ completedTasks.length }}
        </h3>
        <div class="horizontal-scroll-container">
          <div class="horizontal-scroll-content">
            <div v-for="task in completedTasks" :key="task.id" class="horizontal-card">
              <div class="card h-100 completed-task">
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
                    <button class="btn btn-sm btn-warning" @click="reopenTask(task.id)">
                      Reabrir
                    </button>
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
/* Seus estilos permanecem os mesmos */
.task-card {
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
