<script setup>
function saveTask() {
  let titleTask = document.getElementById("task").value;
  let priorityTask = document.getElementById("priority").value;
  let dateTimeTask = document.getElementById("date-time").value;
  let descriptionTask = document.getElementById("description").value;

  // ✅ VALIDAÇÃO CORRIGIDA - verifica se está vazio ou só espaços
  if (!titleTask.trim() || !dateTimeTask.trim()) {
    alert("Informe os campos necessários (Atividade e Data/Hora)!");
    return;
  }

  // ✅ SALVAR NO LOCALSTORAGE
  localStorage.setItem("task", titleTask);
  localStorage.setItem("priority", priorityTask);
  localStorage.setItem("date-time", dateTimeTask);
  localStorage.setItem("description", descriptionTask);

  alert("Atividade adicionada com sucesso!");

  // ✅ FECHAR MODAL DEPOIS DE SALVAR
  // eslint-disable-next-line no-undef
  const modal = bootstrap.Modal.getInstance(document.getElementById("meuModal"));
  modal.hide();

  // ✅ MOSTRAR A TAREFA SALVA
  showTask();
}

function showTask(){
  // ✅ PEGAR OS ELEMENTOS CORRETOS (onde vai mostrar os dados)
  let titleElement = document.getElementById("title-task");
  let priorityElement = document.getElementById("priori-task");
  let dateTimeElement = document.getElementById("time-task");
  let descriptionElement = document.getElementById("descript-task");

  // ✅ PEGAR VALORES DO LOCALSTORAGE
  let savedTask = localStorage.getItem("task");
  let savedPriority = localStorage.getItem("priority");
  let savedDateTime = localStorage.getItem("date-time");
  let savedDescription = localStorage.getItem("description");

  // ✅ CONVERTER PRIORIDADE NUMÉRICA EM TEXTO
  function getPriorityText(priorityValue) {
    const priorities = {
      "0": "Sem prioridade",
      "1": "Urgente", 
      "2": "Importante",
      "3": "Normal"
    };
    return priorities[priorityValue] || "Não definida";
  }

  // ✅ ATUALIZAR OS ELEMENTOS SE HOUVER DADOS
  if (savedTask && savedTask.trim() !== "") {
    titleElement.textContent = savedTask;
    priorityElement.textContent = `Prioridade: ${getPriorityText(savedPriority)}`;
    dateTimeElement.textContent = `Data/Hora: ${savedDateTime || 'Não definida'}`;
    descriptionElement.textContent = `Descrição: ${savedDescription || 'Nenhuma descrição'}`;
  } else {
    // ✅ MANTER MENSAGEM PADRÃO SE NÃO HOUVER DADOS
    titleElement.textContent = "Nenhuma atividade ainda";
    priorityElement.textContent = "Dê prioridade a você...";
    dateTimeElement.textContent = "No seu tempo e na sua hora.";
    descriptionElement.textContent = "Que tal adicionar uma nova atividade?";
  }
}

// ✅ CHAMAR showTask QUANDO O COMPONENTE FOR MONTADO
import { onMounted } from 'vue';
onMounted(() => {
  showTask();
});
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-0 w-100">
    <!-- Botão que irá abrir o modal -->
    <button type="button" class="btn btn-success btn-lg mt-0"
            data-bs-toggle="modal" data-bs-target="#meuModal">
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

    <!-- Card para mostrar as tarefas -->
    <div class="container mt-3">
      <hr class="my-4">
      <div class="card mx-auto" style="max-width: 400px;">
        <div class="card-body text-center">
          <h4 class="card-title" id="title-task">Nenhuma atividade ainda</h4>
          <div class="card-text">
            <p id="priori-task">Dê prioridade a você...</p>
            <p id="time-task">No seu tempo e na sua hora.</p>
            <p id="descript-task">Que tal adicionar uma nova atividade?</p>
          </div>
          <div class="d-flex justify-content-center pt-3 gap-3">
            <button class="btn btn-warning">Editar atividade</button>
            <button class="btn btn-success">Concluir atividade</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>