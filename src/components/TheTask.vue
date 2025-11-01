<script setup>
  function saveTask() {
    let titleTask = document.getElementById("task").value;
    let priorityTask = document.getElementById("priority").value;
    let dateTimeTask = document.getElementById("date-time").value;
    let descriptionTask = document.getElementById("description").value;

    localStorage.setItem("task", titleTask);
    localStorage.setItem("priority", priorityTask);
    localStorage.setItem("date-time", dateTimeTask);
    localStorage.setItem("description", descriptionTask);

    alert("Atividade adicionada com sucesso!");

    // eslint-disable-next-line no-undef
    const modal = new bootstrap.Modal.getInstance(document.getElementById("meuModal"));
    modal.hide();

    showTask();
  }

  function showTask(){
    let taskMsg = document.getElementById("task-save");
    taskMsg.textContent = localStorage.getItem("task");
  }
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-0 w-100">
    <!-- Botão que irá abrir o modal -->
    <button type="button" class="btn btn-success btn-lg mt-0"
            data-bs-toggle="modal" data-bs-target="#meuModal">
      Adicionar atividade
    </button>

    <!-- Modal -->
    <div id="meuModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered"> <!-- Added modal-dialog-centered -->

        <!-- Conteúdo do modal-->
        <div class="modal-content">
          <!-- Cabeçalho do modal -->
          <div class="modal-header">
            <h3 class="modal-title">Informações da atividade</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Corpo do modal - CORRIGIDO -->
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
                <select class="form-select" name="priority" id="priority" required>
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

          <!-- Rodapé do modal -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveTask()">Salvar Alterações</button>
          </div>

        </div>

      </div>
    </div>
    <div class="container mt-3">
      <hr class="my-4">
      <div class="card" style="width:400px">
        <!-- <img class="card-img-top" src="img_avatar1.png" alt="Card image" style="width:100%"> -->
        <div class="card-body">
          <h4 class="card-title" id="title-task">Nenhuma atividade ainda</h4>
          <div class="card-text">
            <p id="priori-task">Dê prioridade a você...</p>
            <p id="time-task">No seu tempo e na sua hora.</p>
            <p id="descript-task">Que tal adicionar uma nova atividade?</p>
          </div>
          <div class="justify-content-center d-flex pt-3 mx-auto gap-5">
              <button class="btn btn-warning">Editar atividade</button>
              <button class="btn btn-success">Concluir atividade</button>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-3">
      <strong>
        <span id="task-save"></span>
      </strong>
    </p>
  </div>
</template>

<style scoped>
</style>
