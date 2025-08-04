export function createSurveyModal() {
  // Check if modal already exists to avoid duplicates
  const existingModal = document.getElementById("surveyModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="surveyModal" class="modal">
      <div class="modal-content survey-modal-content">
        <span class="close-button close-button-top-right" onclick="cerrarModal('surveyModal')" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px; color: var(--text-primary);">
          <i class="material-icons">close</i>
        </span>
        <h2 class="modal-title">Confirmación de Sondeo</h2>
        <p class="modal-description">Se ha generado un enlace para el sondeo. Puedes abrirlo directamente o copiar los enlaces para usarlo más tarde.</p>

        

        <div class="modal-actions">
          <button id="copySurveyLinkBtn" class="button-secondary">
            <i class="material-icons">content_copy</i> Copiar Enlace Pre-rellenado
          </button>
          <button id="copyAutoSendSurveyLinkBtn" class="button-secondary">
            <i class="material-icons">send</i> Copiar Enlace de Envío Automático
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  console.log("Survey modal created and added to DOM");
}