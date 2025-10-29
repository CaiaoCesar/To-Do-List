<script setup>
</script>

<template>
  <div class="d-flex flex-column align-items-center mt-4">
    <!-- Botão que irá abrir o modal - CORRIGIDO -->
    <button type="button" class="btn btn-success btn-lg mt-2 ms-2"
            data-bs-toggle="modal" data-bs-target="#meuModal">
      Adicionar atividade
    </button>

    <!-- Modal - CORRIGIDO -->
    <div id="meuModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog">

        <!-- Conteúdo do modal-->
        <div class="modal-content">

          <!-- Cabeçalho do modal - CORRIGIDO -->
          <div class="modal-header">
            <h3 class="modal-title">Informações da atividade</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Corpo do modal -->
          <div class="modal-body">
            <!-- Input -->
            <div class="w-75 mb-3">
              <label class="form-label" for="task">Atividade:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-thumbtack"/>
                </span>
                <input class="form-control form-control-bg"
                    type="text"
                    id="task"
                    placeholder="Título da atividade que deseja realizar"
                    required>
              </div>
            </div>

            <!-- Select -->
            <div class="w-75 mb-3">
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
            <div class="w-75 mb-3">
              <label for="date-time" class="form-label">Data e Hora de a realizar:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-calendar"/>
                </span>
                <input class="form-control" type="datetime-local" id="date-time">
              </div>
            </div>

            <!-- Descricao -->
            <div class="w-75 mb-3">
              <label for="description" class="form-label">Descrição:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <FontAwesomeIcon icon="fa-solid fa-align-left"/>
                </span>
                <textarea class="form-control" id="description" rows="3" placeholder="Descreva o que deseja realizar (opcional)"></textarea>
              </div>
            </div>
          </div>

          <!-- Rodapé do modal - CORRIGIDO -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary">Salvar Alterações</button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
