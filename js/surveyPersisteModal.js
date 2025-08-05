export function createSurveyPersisteModal() {
  // Check if modal already exists to avoid duplicates
  const existingModal = document.getElementById("surveyPersisteModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="surveyPersisteModal" class="modal">
      <div class="modal-content survey-modal-content">
        <span class="close-button close-button-top-right" onclick="cerrarModal('surveyPersisteModal')" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px; color: var(--text-primary);">
          <i class="material-icons">close</i>
        </span>
        <h2 class="modal-title">Confirmación de Cliente Persiste</h2>
        <p class="modal-description">Se ha generado un enlace para el sondeo. Copia el enlace y ábrelo en Firefox para continuar con el proceso.</p>

        

        <div class="modal-actions">
          <button id="copySurveyPersisteLinkBtn" class="button-secondary">
            <i class="material-icons">content_copy</i> Copiar Enlace Pre-rellenado
          </button>
          <button id="copyAutoSendSurveyPersisteLinkBtn" class="button-secondary">
            <i class="material-icons">send</i> Copiar Enlace de Envío Automático
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  console.log("Survey persiste modal created and added to DOM");
}
