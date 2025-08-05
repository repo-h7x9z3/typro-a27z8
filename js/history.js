export function initializeHistory() {
  // Inicializar componentes y eventos del historial
  const historyModal = document.getElementById("historyModal");
  const openHistoryBtn = document.getElementById("openHistoryBtn");
  const historyFilter = document.getElementById("historyFilter");
  const filterDateFrom = document.getElementById("filterDateFrom");
  const filterDateTo = document.getElementById("filterDateTo");
  const exportHistoryBtn = document.getElementById("exportHistoryBtn");
  const importHistoryBtn = document.getElementById("importHistoryBtn");
  const importHistoryInput = document.getElementById("importHistoryInput");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  // Configurar event listeners
  if (openHistoryBtn) {
    openHistoryBtn.addEventListener("click", () => {
      if (historyModal) {
        historyModal.style.display = "flex";
        mostrarHistorial();
      }
    });
  }

  if (historyFilter) {
    historyFilter.addEventListener("input", mostrarHistorial);
  }

  if (filterDateFrom) {
    filterDateFrom.addEventListener("change", mostrarHistorial);
  }

  if (filterDateTo) {
    filterDateTo.addEventListener("change", mostrarHistorial);
  }

  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener("click", exportarHistorial);
  }

  if (importHistoryBtn && importHistoryInput) {
    importHistoryBtn.addEventListener("click", () => {
      importHistoryInput.click();
    });

    importHistoryInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        importarHistorial(e.target.files[0]);
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", limpiarHistorial);
  }

  // Exponer funciones globalmente para uso en HTML
  window.mostrarHistorial = mostrarHistorial;
  window.exportarHistorial = exportarHistorial;
  window.limpiarHistorial = limpiarHistorial;
  window.importarHistorial = importarHistorial;
}

export function exportarHistorial() {
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  console.log("Historial data before export:", historial); // Debugging log
  if (historial.length === 0) {
    alert("No hay historial para exportar.");
    showNotification("No hay historial para exportar.", "error");
    return;
  }
  // Extract observation text and typification from each entry
  const contenidoHistorial = historial.map((entry) => {
    let entryParts = [];
    if (typeof entry !== "string" && entry.typificationType) {
      entryParts.push(`Tipo de Tipificación: ${entry.typificationType}`);
    }
    // Removed "Detalle de Tipificación" as per user request
    entryParts.push(`Observación: ${entry.text || entry || "N/A"}`); // Handle old string format or new object format

    return entryParts.join("\n");
  });
  console.log("Extracted content for export:", contenidoHistorial); // Debugging log

  // For debugging: show the first observation in a notification
  if (contenidoHistorial.length > 0) {
    showNotification(
      `Exportando: "${contenidoHistorial[0].substring(0, 50)}..."`,
      "info"
    );
  }

  const tituloArchivo = "HISTORIAL DE TIPIFICACIONES";
  const separador = "\n----------------------------------------\n";
  const contenido =
    tituloArchivo + separador + contenidoHistorial.join(separador); // Add title and separated by multiple hyphens
  const fecha = new Date().toISOString().slice(0, 10);
  const blob = new Blob([contenido], { type: "text/plain; charset=utf-8" }); // Ensure UTF-8
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `historial_tipificacion_${fecha}.txt`;
  link.click();
  URL.revokeObjectURL(link.href); // Clean up the URL object
  showNotification("Historial exportado correctamente.");
}

export function limpiarHistorial() {
  showHistoryConfirmationModal(
    "¿Está seguro de que desea limpiar todo el historial?",
    () => {
      localStorage.removeItem("historial");
      mostrarHistorial();
      window.showNotification("Historial limpiado exitosamente.", "success");
    }
  );
}

export function guardarEnHistorial(observacion, rut, formData, url) {
  let historial = JSON.parse(localStorage.getItem("historial")) || [];
  const selectedTypification = localStorage.getItem("selectedTypification"); // Get the selected typification
  const newEntry = {
    text: observacion,
    date: new Date().toISOString(),
    rut: rut,
    formData: formData,
    url: url,
    typificationType: selectedTypification, // Store the typification type
  };

  // Check if an entry with the same RUT already exists
  const existingIndex = historial.findIndex((entry) => entry.rut === rut);

  if (existingIndex !== -1) {
    // If an entry exists, replace it with the new one (most recent)
    historial[existingIndex] = newEntry;
  } else {
    // If no entry exists, add the new one to the beginning
    historial.unshift(newEntry);
  }

  localStorage.setItem("historial", JSON.stringify(historial));
  // No need to call mostrarHistorial here as it's not visible
}

export function importarHistorial(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const entries = content
        .split("\n\n")
        .filter((line) => line.trim() !== "");
      let historial = JSON.parse(localStorage.getItem("historial")) || [];

      entries.forEach((entryText) => {
        historial.unshift({
          text: entryText,
          date: new Date().toISOString(), // Assign current date for imported entries
        });
      });

      localStorage.setItem("historial", JSON.stringify(historial));
      mostrarHistorial();
      window.showNotification("Historial importado exitosamente.", "success");
    } catch (error) {
      console.error("Error al importar historial:", error);
      window.showNotification("Error al importar historial.", "error");
    }
  };
  reader.readAsText(file);
}

import { construirYEnviarSondeo } from "./survey.js";
import { createSurveyPersisteModal } from "./surveyPersisteModal.js";
import { construirYEnviarSondeoPersiste } from "./surveyPersiste.js";

export function mostrarHistorial() {
  let historial = JSON.parse(localStorage.getItem("historial")) || [];
  const tableBody = document.getElementById("historyTableBody");
  const filterText = document
    .getElementById("historyFilter")
    .value.toLowerCase();
  const dateFrom = document.getElementById("filterDateFrom").value;
  const dateTo = document.getElementById("filterDateTo").value;

  tableBody.innerHTML = ""; // Clear previous content

  // Backward compatibility: convert old string entries to new object format
  historial = historial.map((entry) => {
    if (typeof entry === "string") {
      return { text: entry, date: null, url: null }; // Old entries have no date or URL
    }
    return entry;
  });

  const filteredHistorial = historial.filter((entry) => {
    const textMatch = entry.text.toLowerCase().includes(filterText);
    if (!textMatch) return false;

    if (dateFrom && entry.date) {
      if (new Date(entry.date) < new Date(dateFrom)) return false;
    }
    if (dateTo && entry.date) {
      // Add 1 day to 'dateTo' to include the entire day
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      if (new Date(entry.date) > toDate) return false;
    }
    return true;
  });

  if (filteredHistorial.length > 0) {
    const tableContainer = document.createElement("div");
    tableContainer.className = "history-table-container";
    const table = document.createElement("table");
    table.className = "history-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Fecha</th>
        <th>RUT</th>
        <th>Observación</th>
        <th>Acciones</th>
      </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");

    filteredHistorial.forEach((entry) => {
      const row = document.createElement("tr");

      // 1. Date Cell
      const dateCell = document.createElement("td");
      dateCell.textContent = entry.date
        ? new Date(entry.date).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
      row.appendChild(dateCell);

      // 2. RUT Cell
      const rutCell = document.createElement("td");
      rutCell.textContent = entry.rut || "N/A";
      row.appendChild(rutCell);

      // 3. Observation Cell
      const observationCell = document.createElement("td");
      observationCell.textContent = entry.text || "N/A";
      row.appendChild(observationCell);

      // 4. Actions Cell
      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";

      // Copy Observation Button
      const copyObsButton = document.createElement("button");
      copyObsButton.title = "Copiar Observación";
      copyObsButton.innerHTML = '<i class="material-icons">content_copy</i>';
      copyObsButton.addEventListener("click", () => {
        window.copyToClipboard(entry.text);
      });
      actionsCell.appendChild(copyObsButton);

      // View/Copy Survey URL Button
      const openSurveyModalButton = document.createElement("button");
      openSurveyModalButton.title = "Abrir Sondeo";
      openSurveyModalButton.innerHTML = '<i class="material-icons">link</i>';
      openSurveyModalButton.addEventListener("click", () => {
        if (entry.url) {
          construirYEnviarSondeo(entry.url);
          window.abrirModal("surveyModal"); // Open the modal
        } else {
          window.showNotification(
            "No hay URL de sondeo para esta entrada.",
            "error"
          );
        }
      });
      actionsCell.appendChild(openSurveyModalButton);

      // Open Persistent Survey Modal Button
      const openPersisteModalButton = document.createElement("button");
      openPersisteModalButton.title = "Abrir Cliente Persiste";
      openPersisteModalButton.innerHTML =
        '<i class="material-icons">launch</i>';
      openPersisteModalButton.addEventListener("click", () => {
        const sondeoPersisteData = JSON.parse(
          localStorage.getItem("sondeoPersiste")
        );
        const surveyPersisteUrl = sondeoPersisteData
          ? sondeoPersisteData.surveyUrl
          : null;
        if (surveyPersisteUrl) {
          // Open Modal
          let modal = document.getElementById("surveyPersisteModal");
          if (!modal) {
            createSurveyPersisteModal();
          }
          construirYEnviarSondeoPersiste(surveyPersisteUrl);
          window.abrirModal("surveyPersisteModal");
        } else {
          window.showNotification(
            "No hay URL de sondeo persistente para esta entrada.",
            "error"
          );
        }
      });
      actionsCell.appendChild(openPersisteModalButton);

      // Delete Button
      const deleteButton = document.createElement("button");
      deleteButton.title = "Eliminar";
      deleteButton.innerHTML = '<i class="material-icons">delete</i>';
      deleteButton.addEventListener("click", () => {
        window.eliminarDelHistorial(entry.date);
      });
      actionsCell.appendChild(deleteButton);

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    tableBody.appendChild(tableContainer);
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="no-results">No se encontraron registros.</td>`;
    tableBody.appendChild(row);
  }
}

// Helper function to be added in the global scope or imported where needed
window.copyToClipboard = (text) => {
  if (typeof text !== "string" || !text) {
    window.showNotification("No hay observación para copiar.", "error");
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      window.showNotification(
        "¡Observación copiada al portapapeles!",
        "success"
      );
    })
    .catch((err) => {
      console.error("Error al copiar la observación:", err);
      window.showNotification("Error al copiar la observación.", "error");
    });
};

window.eliminarDelHistorial = (date) => {
  showHistoryConfirmationModal(
    "¿Está seguro de que desea eliminar este registro?",
    () => {
      let historial = JSON.parse(localStorage.getItem("historial")) || [];
      historial = historial.filter((entry) => entry.date !== date);
      localStorage.setItem("historial", JSON.stringify(historial));
      mostrarHistorial();
      window.showNotification("Registro eliminado exitosamente.", "success");
    }
  );
};

function showHistoryConfirmationModal(message, onConfirm) {
  const modal = document.getElementById("historyConfirmDeleteModal");
  const textElement = document.getElementById("historyConfirmDeleteText");
  const confirmBtn = document.getElementById("historyConfirmDeleteBtn");
  const cancelBtn = document.getElementById("historyCancelDeleteBtn");

  textElement.textContent = message;
  modal.style.display = "flex";

  const confirmHandler = () => {
    onConfirm();
    closeModal();
  };

  const cancelHandler = () => {
    closeModal();
  };

  const closeModal = () => {
    modal.style.display = "none";
    confirmBtn.removeEventListener("click", confirmHandler);
    cancelBtn.removeEventListener("click", cancelHandler);
  };

  confirmBtn.addEventListener("click", confirmHandler);
  cancelBtn.addEventListener("click", cancelHandler);
}
