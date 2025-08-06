import {
  initializeTmo,
  loadTmoData,
  addRowToTable,
  updateAverage,
} from "./tmo.js";

import {
  initializeHistory,
  exportarHistorial,
  importarHistorial,
  limpiarHistorial,
  guardarEnHistorial,
  mostrarHistorial,
} from "./history.js";

import { renderFormFields } from "./formGenerator.js";

import {
  formDataForSurvey,
  construirYEnviarSondeo,
  collectSurveyData,
  buildSurveyUrl,
  saveSurveyUrlToHistory,
} from "./survey.js";
import { applyTheme, loadTheme } from "./themes.js";
import { handleShortcut, applyShortcutListenersToTextareas } from "./tags.js";
import { initializeConfig } from "./config.js";
import { initializeSpeedtest } from "./speedtest.js";
import { initializeLogin } from "./login.js";
import { initializeTagsModal } from "./tagsModal.js";
import { initializeAboutModal } from "./aboutModal.js";
import { createSurveyModal } from "./surveyModal.js";
import { createSurveyPersisteModal } from "./surveyPersisteModal.js"; // New import
import {
  buildSurveyPersisteUrl,
  construirYEnviarSondeoPersiste,
  collectSurveyPersisteData,
  formDataForSurveyPersiste,
  saveSurveyPersisteUrlToHistory,
} from "./surveyPersiste.js"; // New import
import { setupGenobsTabs } from "./genobs.js"; // Import the new module

// Global variable to store main form data
let mainFormData = {};

// Function to show the survey persiste modal with the latest URL
const showSurveyPersisteModal = (urlToOpen = null) => {
  let url = urlToOpen;
  if (!url) {
    const sondeoData = JSON.parse(localStorage.getItem("sondeoPersiste"));
    url = sondeoData ? sondeoData.surveyUrl : null;
  }

  if (!url) {
    window.showNotification(
      "No se pudo obtener la URL del cliente persiste.",
      "error"
    );
    return;
  }

  console.log("Opening survey persiste modal with URL:", url);

  // First ensure the modal exists
  let modal = document.getElementById("surveyPersisteModal");
  if (!modal) {
    console.log("Survey persiste modal not found, creating it...");
    createSurveyPersisteModal();
    modal = document.getElementById("surveyPersisteModal");
  }

  // Configure the survey persiste modal with the URL first
  construirYEnviarSondeoPersiste(url);

  // Then open the modal using the standard function
  abrirModal("surveyPersisteModal");

  console.log("Survey persiste modal opened");
};

// Function to handle tab switching for modals with config-like navigation
const setupConfigTabs = (modalId) => {
  const navItems = document.querySelectorAll(`#${modalId} .config-nav-item`);
  const sections = document.querySelectorAll(`#${modalId} .config-section`);

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetSection = item.dataset.section;

      // Deactivate all nav items and sections
      navItems.forEach((nav) => nav.classList.remove("active"));
      sections.forEach((sec) => sec.classList.remove("active"));

      // Activate the clicked nav item and its corresponding section
      item.classList.add("active");
      document
        .getElementById(`${targetSection}-section`)
        .classList.add("active");
    });
  });
};

// Initialize Genobs Modal
const initializeGenobsModal = () => {
  setupGenobsTabs("genobs"); // Corrected modal ID from "genobsModal" to "genobs"
};

// --- LÓGICA "ACERCA DE" ---
// Moved to DOMContentLoaded

// Function to show the survey modal with the latest URL
const showSurveyModal = (urlToOpen = null) => {
  let url = urlToOpen;
  if (!url) {
    const sondeoData = JSON.parse(localStorage.getItem("sondeo"));
    url = sondeoData ? sondeoData.surveyUrl : null;
  }

  if (!url) {
    window.showNotification("No se pudo obtener la URL del sondeo.", "error");
    return;
  }

  console.log("Opening survey modal with URL:", url);

  // First ensure the modal exists
  let modal = document.getElementById("surveyModal");
  if (!modal) {
    console.log("Survey modal not found, creating it...");
    createSurveyModal();
    modal = document.getElementById("surveyModal");
  }

  // Configure the survey modal with the URL first
  construirYEnviarSondeo(url);

  // Then open the modal using the standard function
  abrirModal("surveyModal");

  console.log("Survey modal opened");
};

// Global functions for modals and other interactions
export const abrirModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "flex";
    modal.style.visibility = "visible"; // Ensure visibility
    modal.style.opacity = "1"; // Ensure opacity
    if (id === "loginModalContainer") {
      document.body.style.overflow = "hidden"; // Prevent scrolling when login modal is open
    }
  }
};

export const cerrarModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
    if (id === "loginModalContainer") {
      document.body.style.overflow = ""; // Restore scrolling when login modal is closed
    }
  }
};

window.abrirModal = abrirModal; // Expose to global scope
window.cerrarModal = cerrarModal; // Expose to global scope

export const showObservationDetailModal = (observationText) => {
  const detailTextarea = document.getElementById("observationDetailText");
  if (detailTextarea) {
    detailTextarea.value = observationText;
    abrirModal("observationDetailModal");
  }
};
window.showObservationDetailModal = showObservationDetailModal; // Expose to global scope

export const abrirModalTipificacion = () => {
  abrirModal("modalTipificacion");
};

window.abrirModalTipificacion = abrirModalTipificacion;

window.guardarTipificacion = (tipo) => {
  const savedTypification = localStorage.getItem("selectedTypification");

  // Only clear form fields if the typification has changed
  if (tipo !== savedTypification) {
    window.limpiarFormulario();
  }

  localStorage.setItem("selectedTypification", tipo); // Save to local storage

  const tipificacionElement = document.getElementById(
    "tipificacionSeleccionada"
  );
  if (tipificacionElement) {
    tipificacionElement.textContent = `Tipificación: ${tipo}`;
  }

  window.cerrarModal("modalTipificacion");

  if (tipo === "No definida") {
    const mainContainer = document.querySelector(".main-container");
    const welcomeSection = document.getElementById("welcomeSection");

    if (mainContainer) mainContainer.style.display = "none"; // Hide main content
    if (welcomeSection) welcomeSection.style.display = "block"; // Show welcome message
  } else {
    // Only render form fields if the typification has changed
    if (tipo !== savedTypification) {
      renderFormFields(tipo); // Render form fields based on selected typification
      applyShortcutListenersToTextareas(); // Apply listeners to newly rendered fields
    }

    const mainContainer = document.querySelector(".main-container");
    const welcomeSection = document.getElementById("welcomeSection");

    if (mainContainer) mainContainer.style.display = "flex"; // Show main content
    if (welcomeSection) welcomeSection.style.display = "none"; // Hide welcome message
  }
};

// Function removed - login visibility is now handled within login.js

window.generarObservacionPrincipal = () => {
  const datosForm = document.getElementById("datosForm");
  mainFormData = {}; // Clear previous data

  const selectedTypification = localStorage.getItem("selectedTypification");

  const enviarSondeoBtn = document.getElementById("enviarSondeoBtn");
  const enviarPersisteBtn = document.getElementById("enviarPersisteBtn");

  let requiredMainFields = [];

  if (selectedTypification === "Transferencia (Soporte)") {
    requiredMainFields = [
      "clienteID",
      "clienteNombre",
      "clienteRUT",
      "clienteTelefono",
      "clienteCorreo", // New field
      "clienteContrato",
    ];
  } else {
    requiredMainFields = [
      "clienteID",
      "clienteNombre",
      "clienteRUT",
      "clienteTelefono",
      "clienteCorreo", // New field
      "clienteDireccion",
      "clienteONT",
      "clienteOLT",
      "clienteTarjeta",
      "clientePuerto",
      "clienteNodo",
      "clienteContrato",
    ];
  }

  let allMainFieldsFilled = true;
  let firstEmptyMainField = null;

  requiredMainFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      if (field.value.trim() === "") {
        allMainFieldsFilled = false;
        if (!firstEmptyMainField) {
          firstEmptyMainField = field;
        }
        field.style.border = "2px solid var(--danger-color)"; // Highlight empty field
      } else {
        field.style.border = ""; // Reset border if filled
      }
    }
  });

  if (!allMainFieldsFilled) {
    window.showNotification(
      "Por favor, complete todos los campos obligatorios del formulario principal.",
      "error"
    );
    if (firstEmptyMainField) {
      firstEmptyMainField.focus(); // Focus on the first empty field
    }
    return; // Stop the function if validation fails
  }

  const observacionForm = document.getElementById("observacionForm");
  if (observacionForm && observacionForm.value.trim() === "") {
    window.showNotification(
      "Por favor, complete el campo de observación principal.",
      "error"
    );
    observacionForm.style.border = "2px solid var(--danger-color)";
    observacionForm.focus();
    return; // Stop the function if validation fails
  } else if (observacionForm) {
    observacionForm.style.border = ""; // Reset border if filled
  }

  // Collect data from the main form
  const formElements = datosForm.elements;
  for (let i = 0; i < formElements.length; i++) {
    const element = formElements[i];
    // Exclude 'observacionForm' from being added to mainFormData with its ID as a key
    if (element.id && element.value && element.id !== "observacionForm") {
      // Map internal IDs to more readable keys for the observation
      let key = element.id;
      switch (element.id) {
        case "clienteID":
          key = "ID";
          break;
        case "clienteNombre":
          key = "NOMBRE";
          break;
        case "clienteRUT":
          key = "RUT";
          break;
        case "clienteContrato":
          key = "CONTRATO";
          break;
        case "clienteTelefono":
          key = "TELÉFONO";
          break;
        case "clienteCorreo": // New case for Correo
          key = "CORREO";
          break;
        case "clienteDireccion":
          key = "DIRECCION";
          break;
        case "clienteONT":
          key = "ONT";
          break;
        case "clienteOLT":
          key = "OLT";
          break;
        case "clienteTarjeta":
          key = "TARJETA";
          break;
        case "clientePuerto":
          key = "PUERTO";
          break;
        case "clienteNodo":
          key = "NODO";
          break;
        default:
          break;
      }
      mainFormData[key] = element.value;
    }
  }

  // Populate formDataForSurvey for the survey button
  Object.assign(formDataForSurvey, mainFormData);

  // The 'documentNumber' in localStorage should refer to the logged-in user's ID,
  // not the client's ID from the form. The client's ID is already in mainFormData["ID"]
  // and will be used correctly in formDataForSurvey.

  // Collect all survey data
  collectSurveyData();

  // Build the survey URL and store it in formDataForSurvey
  const generatedSurveyUrl = buildSurveyUrl();
  if (generatedSurveyUrl) {
    formDataForSurvey.surveyUrl = generatedSurveyUrl;
    // Save the generated URL to history immediately
    saveSurveyUrlToHistory(generatedSurveyUrl);
  }

  // Save all survey data (including the URL) to local storage
  localStorage.setItem("sondeo", JSON.stringify(formDataForSurvey));

  // Make the "Enviar Sondeo" button visible and enabled
  enviarSondeoBtn.style.display = "inline-flex";
  enviarSondeoBtn.disabled = false;

  // Make the "Enviar Sondeo Persistente" button visible and enabled
  enviarPersisteBtn.style.display = "inline-flex";
  enviarPersisteBtn.disabled = false;

  // Attach event listeners (moved from DOMContentLoaded)
  enviarSondeoBtn.onclick = () => {
    const sondeoData = JSON.parse(localStorage.getItem("sondeo"));
    const surveyUrl = sondeoData ? sondeoData.surveyUrl : null;

    if (!surveyUrl) {
      window.showNotification(
        "No se encontró URL de sondeo. Genere la observación primero.",
        "error"
      );
      return;
    }
    showSurveyModal(surveyUrl);
  };

  enviarPersisteBtn.onclick = () => {
    const sondeoPersisteData = JSON.parse(
      localStorage.getItem("sondeoPersiste")
    );
    const surveyPersisteUrl = sondeoPersisteData
      ? sondeoPersisteData.surveyUrl
      : null;

    if (!surveyPersisteUrl) {
      window.showNotification(
        "No se encontró URL de cliente persiste. Genere la observación primero.",
        "error"
      );
      return;
    }
    showSurveyPersisteModal(surveyPersisteUrl);
  };

  // Collect all survey persiste data
  collectSurveyPersisteData();

  // Build the survey persiste URL and store it in formDataForSurveyPersiste
  const generatedSurveyPersisteUrl = buildSurveyPersisteUrl();
  if (generatedSurveyPersisteUrl) {
    formDataForSurveyPersiste.surveyUrl = generatedSurveyPersisteUrl;
    // Save the generated URL to history immediately
    saveSurveyPersisteUrlToHistory(generatedSurveyPersisteUrl);
  }

  // Save all survey persiste data (including the URL) to local storage
  localStorage.setItem(
    "sondeoPersiste",
    JSON.stringify(formDataForSurveyPersiste)
  );

  // Construct a preliminary observation from main form data
  let preliminaryObservation = `NOMBRE: ${mainFormData["NOMBRE"] || ""}\n`; // NOMBRE first

  const preliminaryOrder = [
    "RUT",
    "CONTRATO",
    "DIRECCION",
    "ONT",
    "OLT",
    "TARJETA",
    "PUERTO",
    "NODO",
  ];
  preliminaryOrder.forEach((key) => {
    if (mainFormData[key]) {
      preliminaryObservation += `${key}: ${mainFormData[key]}\n`;
    }
    if (key === "NODO") {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
      // Add SOP/MOVIL/SAC, ID, TEL, CORREO after NODO, conditional on typification
      let prefix = "SOP";
      if (selectedTypification === "Movil") {
        prefix = "MOVIL";
      } else if (selectedTypification === "SAC") {
        prefix = "SAC";
      }
      preliminaryObservation += `${prefix} ${formattedDate} ID: ${
        mainFormData["ID"] || ""
      } TEL: ${mainFormData["TELÉFONO"] || ""} CORREO: ${
        mainFormData["CORREO"] || ""
      }\n`;
    }
  });
  // Add "TIENE PERDIDA DE MONITOREO?" to the observation
  if (formDataForSurvey["TIENE PERDIDA DE MONITOREO?"]) {
    preliminaryObservation += `¿Tiene perdida de monitoreo?:${formDataForSurvey["TIENE PERDIDA DE MONITOREO?"]}\n`;
  }
  for (const key in mainFormData) {
    // Exclude ID, TELÉFONO, NOMBRE, and CORREO from this loop as they are now handled
    if (
      mainFormData[key] &&
      !preliminaryOrder.includes(key) &&
      key !== "ID" &&
      key !== "TELÉFONO" &&
      key !== "NOMBRE" &&
      key !== "CORREO" &&
      key !== "clienteID" // Exclude 'clienteID' if it exists as a key
    ) {
      preliminaryObservation += `${key}: ${mainFormData[key]}\n`;
    }
  }
  // Add the content of observacionForm directly as the observation
  if (observacionForm && observacionForm.value.trim() !== "") {
    preliminaryObservation += `OBS: ${observacionForm.value.trim()}\n`;
  }
  document.getElementById("observacionCompleta").textContent =
    preliminaryObservation;
  document.getElementById("observacionCompletaContainer").style.display =
    "flex";
  document.getElementById("observacionCompletaWrapper").style.display = "block";
  copyToClipboard(preliminaryObservation); // Copy the preliminary observation
  window.abrirModal("modalCopia"); // Open the copy confirmation modal

  // Save the preliminary observation to history
  const rutForHistory = document.getElementById("clienteRUT")?.value || "N/A";
  guardarEnHistorial(
    preliminaryObservation,
    rutForHistory,
    { ...mainFormData }, // Use mainFormData for history
    formDataForSurvey.surveyUrl // Save the generated survey URL
  );
  mostrarHistorial(); // Update history display
};

window.limpiarFormulario = () => {
  console.log("Limpiar Formulario clicked");
  const datosForm = document.getElementById("datosForm");
  const observacionForm = document.getElementById("observacionForm");

  if (datosForm) datosForm.reset();
  if (observacionForm) observacionForm.value = ""; // Clear observacionForm

  const elementsToHide = [
    "observacionCompletaContainer",
    "observacionCompletaWrapper",
    "finalObservationContainer",
    "observacionFinal",
  ];

  elementsToHide.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.style.display = "none";
  });

  const elementsToEmpty = ["observacionCompleta", "observacionFinal"];
  elementsToEmpty.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.innerHTML = "";
  });

  const enviarSondeoBtn = document.getElementById("enviarSondeoBtn");
  const enviarPersisteBtn = document.getElementById("enviarPersisteBtn");

  if (enviarSondeoBtn) {
    enviarSondeoBtn.style.display = "none"; // Hide the button on clear
    enviarSondeoBtn.disabled = true; // Disable the button on clear
  }

  if (enviarPersisteBtn) {
    enviarPersisteBtn.style.display = "none"; // Hide the button on clear
    enviarPersisteBtn.disabled = true; // Disable the button on clear
  }

  mainFormData = {}; // Clear stored main form data

  // Clear fields in the genobs modal
  const genobsFields = [
    "suministroElectrico",
    "generadorElectrico",
    "tiempoFalla",
    "tipoServicio",
    "estadoOnt",
    "clienteMasiva",
    "fallaMasiva",
    "visitaTecnica",
    "soporteGenerado",
    "instalacionReparacion",
    "estadoLuces",
    "perdidaMonitoreo",
  ];

  genobsFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) field.value = "";
  });

  const extraPreguntas = document.getElementById("extraPreguntas");
  if (extraPreguntas) extraPreguntas.innerHTML = ""; // Clear dynamic questions
};

// Function to clear saved typification
window.limpiarTipificacion = () => {
  localStorage.removeItem("selectedTypification");
  const mainContainer = document.querySelector(".main-container");
  const welcomeSection = document.getElementById("welcomeSection");
  const tipificacionElement = document.getElementById(
    "tipificacionSeleccionada"
  );

  if (mainContainer) mainContainer.style.display = "none";
  if (welcomeSection) welcomeSection.style.display = "block";
  if (tipificacionElement)
    tipificacionElement.textContent = "Tipificación: No definida";

  console.log("Tipificación cleared from localStorage");
};

window.limpiarGenobsCampos = () => {
  console.log("Limpiar Genobs Campos clicked");
  // Clear fields in the genobs modal
  document.getElementById("suministroElectrico").value = "";
  document.getElementById("generadorElectrico").value = "";
  document.getElementById("tiempoFalla").value = "";
  document.getElementById("tipoServicio").value = "";
  document.getElementById("extraPreguntas").innerHTML = ""; // Clear dynamic questions
  document.getElementById("estadoOnt").value = "";
  document.getElementById("clienteMasiva").value = "";
  document.getElementById("fallaMasiva").value = "";
  document.getElementById("visitaTecnica").value = "";
  document.getElementById("soporteGenerado").value = "";
  document.getElementById("instalacionReparacion").value = "";
  document.getElementById("estadoLuces").value = "";
  document.getElementById("controlRemoto").value = "";
  document.getElementById("cambioPilas").value = "";
  document.getElementById("pruebaCruzada").value = "";
  document.getElementById("clienteReincidente").value = "";
  // Reset borders
  const fieldsToResetBorder = [
    "suministroElectrico",
    "generadorElectrico",
    "tiempoFalla",
    "tipoServicio",
    "instalacionReparacion",
    "clienteReincidente",
    "estadoLuces",
    "estadoOnt",
    "clienteMasiva",
    "fallaMasiva",
    "visitaTecnica",
    "soporteGenerado",
    "controlRemoto",
    "cambioPilas",
    "pruebaCruzada",
  ];
  fieldsToResetBorder.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.border = "";
    }
  });
  // Hide conditional TV questions
  document.getElementById("tvQuestions").style.display = "none";
  document.getElementById("tresMundosSwitchContainer").style.display = "none";
  const fallaTvSwitch = document.getElementById("fallaTvSwitch");
  if (fallaTvSwitch) {
    fallaTvSwitch.checked = false;
  }
};

// Function to validate the Genobs modal form fields
const validateGenobsForm = () => {
  const requiredFields = [
    "suministroElectrico",
    "generadorElectrico",
    "tiempoFalla",
    "tipoServicio",
    "instalacionReparacion",
    "clienteReincidente",
    "estadoLuces",
    "estadoOnt",
    "clienteMasiva",
    "fallaMasiva",
    "visitaTecnica",
    "soporteGenerado", // Ensure soporteGenerado is always validated
  ];

  let allFieldsFilled = true;
  let firstEmptyField = null;

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Always validate these fields, regardless of current tab visibility
      if (field.value === "" || field.value === "Seleccione") {
        allFieldsFilled = false;
        if (!firstEmptyField) {
          firstEmptyField = field;
        }
        field.style.border = "2px solid var(--danger-color)"; // Highlight empty field
      } else {
        field.style.border = ""; // Reset border if filled
      }
    }
  });

  // Always check conditional TV questions if the service type implies them
  const tipoServicio = document.getElementById("tipoServicio").value;
  const tvQuestionsContainer = document.getElementById("tvQuestions");

  if (
    tipoServicio === "TV HD" ||
    tipoServicio === "Peliculas" ||
    (tipoServicio === "3 MUNDOS (Todos los servicios)" &&
      tvQuestionsContainer.style.display === "block")
  ) {
    const tvRequiredFields = ["controlRemoto", "cambioPilas", "pruebaCruzada"];
    tvRequiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        if (field.value === "" || field.value === "Seleccione") {
          allFieldsFilled = false;
          if (!firstEmptyField) {
            firstEmptyField = field;
          }
          field.style.border = "2px solid var(--danger-color)";
        } else {
          field.style.border = "";
        }
      }
    });
  }

  if (!allFieldsFilled) {
    window.showNotification(
      "Por favor, complete todos los campos obligatorios.",
      "error"
    );
    if (firstEmptyField) {
      firstEmptyField.focus(); // Focus on the first empty field
    }
  }
  return allFieldsFilled;
};

window.generarObservacionFinal = () => {
  if (!validateGenobsForm()) {
    return; // Stop if validation fails
  }

  // Collect all survey data from both main form and genobs modal
  collectSurveyData();

  const {
    RUT,
    "SERVICIO CON LA FALLA": servicioFalla,
    TELÉFONO,
    CORREO, // New field
    "DIRECCIÓN CLIENTE": direccionCliente,
    ONT,
    OLT,
    TARJETA,
    PUERTO,
    NODO,
    "Suministro Eléctrico": suministroElectrico,
    "Generador Eléctrico": generadorElectrico,
    "Desde Cuando Presenta la Falla": tiempoFalla,
    "Tipo de servicio": tipoServicio,
    "Inconvenientes Instalación/Reparación": instalacionReparacion,
    "Estado Luces": estadoLuces,
    "Estado ONT": estadoOnt,
    "Cliente Masiva": clienteMasiva,
    "Falla Masiva": fallaMasiva,
    "Visita Técnica": visitaTecnica,
    "Soporte Generado": soporteGenerado,
    "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO":
      observacionCompletaSondeo,
    "Falla Respuesta Genobs": fallaRespuestaGenobs,
    "Control Remoto": controlRemoto,
    "Cambio Pilas": cambioPilas,
    "Prueba Cruzada": pruebaCruzada,
    "El cliente es reincidente": clienteReincidente,
    Decodificador,
    "Reinicio Eléctrico": reinicioElectrico,
    "Cable HDMI/AV": cableHDMIAV,
    "Observacion TV": observacionTV,
  } = formDataForSurvey;

  // Save all survey data to local storage in the 'sondeo' variable
  localStorage.setItem("sondeo", JSON.stringify(formDataForSurvey));

  // Construct the 'sondeo' string for the main observation form
  let sondeo = ``; // Removed "OBS: "
  if (tiempoFalla) sondeo += `Desde Cuando Presenta la Falla:${tiempoFalla}\n`;
  if (suministroElectrico)
    sondeo += `Tiene Suministro Eléctrico ?: ${suministroElectrico}\n`;
  if (generadorElectrico)
    sondeo += `Tiene Generador Electrico ?: ${generadorElectrico}\n`;
  if (estadoOnt) sondeo += `Estado ONT:${estadoOnt}\n`;
  if (clienteMasiva) sondeo += `Cliente Masiva:${clienteMasiva}\n`;
  if (fallaMasiva) sondeo += `Falla Masiva:${fallaMasiva}\n`;
  if (visitaTecnica) sondeo += `Visita Técnica:${visitaTecnica}\n`;
  if (controlRemoto)
    sondeo += `¿El control remoto funciona en su totalidad?:${controlRemoto}\n`;
  if (cambioPilas)
    sondeo += `¿Se realizaron cambios de pilas del control remoto?:${cambioPilas}\n`;
  if (pruebaCruzada) sondeo += `¿Se hizo prueba cruzada?:${pruebaCruzada}\n`;
  // Removed "Tiene perdida de monitoreo" from sondeo string to avoid duplication in observacionForm
  if (soporteGenerado) sondeo += `Soporte Generado:${soporteGenerado}\n`;
  if (instalacionReparacion && instalacionReparacion !== "No")
    sondeo += `Inconvenientes Instalación/Reparación: ${instalacionReparacion}\n`;
  if (fallaRespuestaGenobs)
    sondeo += `Falla Respuesta Genobs: ${fallaRespuestaGenobs}\n`;
  if (observacionCompletaSondeo) {
    // Apply cleaning similar to survey.js for this specific observation
    let cleanedSondeoObservationForForm = observacionCompletaSondeo
      .replace("obs: ", "")
      .replace("OBS:", "");
    cleanedSondeoObservationForForm = cleanedSondeoObservationForForm
      .replace(/, ,/g, ",")
      .replace(/  +/g, " ")
      .trim();
    cleanedSondeoObservationForForm = cleanedSondeoObservationForForm.replace(
      /(SI|NO|Si|No|si|no)\s*([A-Z¿])/g,
      "$1\n$2"
    );
    sondeo += `OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO: ${cleanedSondeoObservationForForm}\n`;
  }

  // Construct the full observation for clipboard and history
  let fullObservation = `NOMBRE: ${formDataForSurvey["NOMBRE"] || ""}\n`; // NOMBRE first

  // Add main form data to full observation
  const orderedKeys = [
    "RUT",
    "CORREO",
    "CONTRATO",
    "DIRECCIÓN CLIENTE",
    "ONT",
    "OLT",
    "NODO",
    "TARJETA",
    "PUERTO",
  ];

  orderedKeys.forEach((key) => {
    if (formDataForSurvey[key] && formDataForSurvey[key] !== "No") {
      fullObservation += `${key}: ${formDataForSurvey[key]}\n`;
    }
    if (key === "NODO") {
      // Add the SOP, date, ID, TEL, CORREO after NODO
      const today = new Date();
      const formattedDate = `${today.getDate()}/${
        today.getMonth() + 1
      }/${today.getFullYear()}`;
      fullObservation += `SOP ${formattedDate} ID: ${
        formDataForSurvey["ID"] || ""
      } TEL: ${TELÉFONO || ""} CORREO: ${CORREO || ""}\n`;
    }
  });

  // Add genobs modal data and other survey-related fields to full observation
  // Exclude NOMBRE from this section as it's now handled at the beginning
  if (formDataForSurvey["CONTRATO"])
    fullObservation += `CONTRATO: ${formDataForSurvey["CONTRATO"]}\n`;
  if (tiempoFalla)
    fullObservation += `Desde Cuando Presenta la Falla: ${tiempoFalla}\n`;
  if (suministroElectrico)
    fullObservation += `Suministro Eléctrico: ${suministroElectrico}\n`;
  if (generadorElectrico)
    fullObservation += `Generador Eléctrico: ${generadorElectrico}\n`;
  if (estadoOnt) fullObservation += `Estado ONT: ${estadoOnt}\n`;
  if (clienteMasiva) fullObservation += `Cliente Masiva: ${clienteMasiva}\n`;
  if (fallaMasiva) fullObservation += `Falla Masiva: ${fallaMasiva}\n`;
  if (visitaTecnica) fullObservation += `Visita Técnica: ${visitaTecnica}\n`;
  if (controlRemoto) fullObservation += `Control Remoto: ${controlRemoto}\n`;
  if (cambioPilas) fullObservation += `Cambio Pilas: ${cambioPilas}\n`;
  if (pruebaCruzada) fullObservation += `Prueba Cruzada: ${pruebaCruzada}\n`;
  if (formDataForSurvey["PERDIDA DE MONITOREO"])
    fullObservation += `Tiene perdida de monitoreo: ${formDataForSurvey["PERDIDA DE MONITOREO"]}\n`;
  if (soporteGenerado)
    fullObservation += `Soporte Generado: ${soporteGenerado}\n`;
  if (instalacionReparacion && instalacionReparacion !== "No")
    fullObservation += `¿El cliente se está comunicando por inconvenientes que hubo al momento de la instalación o reparación?: ${instalacionReparacion}\n`;
  if (fallaRespuestaGenobs)
    fullObservation += `Falla Respuesta Genobs: ${fallaRespuestaGenobs}\n`;
  if (clienteReincidente && clienteReincidente !== "No")
    fullObservation += `El cliente es reincidente: ${clienteReincidente}\n`;
  if (tipoServicio) fullObservation += `Tipo de servicio: ${tipoServicio}\n`;
  if (estadoLuces)
    fullObservation += `Tiene Luces en que estado ?: ${estadoLuces}\n`;
  if (Decodificador) fullObservation += `Decodificador: ${Decodificador}\n`;
  if (reinicioElectrico)
    fullObservation += `Reinicio Eléctrico: ${reinicioElectrico}\n`;
  if (cableHDMIAV) fullObservation += `Cable HDMI/AV: ${cableHDMIAV}\n`;
  if (observacionTV) fullObservation += `Observacion TV: ${observacionTV}\n`;

  // Special handling for "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO"
  if (observacionCompletaSondeo) {
    // Apply cleaning similar to survey.js for this specific observation
    let cleanedSondeoObservation = observacionCompletaSondeo
      .replace("obs: ", "")
      .replace("OBS:", "");
    cleanedSondeoObservation = cleanedSondeoObservation
      .replace(/, ,/g, ",")
      .replace(/  +/g, " ")
      .trim();
    cleanedSondeoObservation = cleanedSondeoObservation.replace(
      /(SI|NO|Si|No|si|no)\s*([A-Z¿])/g,
      "$1\n$2"
    );

    fullObservation += `${cleanedSondeoObservation}\n`;
  }

  // Apply formatting for better style (similar to survey.js)
  // Update the main form's observation textarea
  const observacionForm = document.getElementById("observacionForm");
  observacionForm.value = sondeo; // Use .value for textareas

  // Hide the "Observación Final Generada" section as it's no longer needed
  document.getElementById("finalObservationContainer").style.display = "none";
  document.getElementById("observacionFinal").style.display = "none";

  // The "Enviar Sondeo" button is handled by generarObservacionPrincipal and limpiarFormulario

  // Update the main observation container with the final, full observation
  document.getElementById("observacionCompleta").textContent = fullObservation;

  const rutForHistory = document.getElementById("clienteRUT")?.value || "N/A"; // Extract RUT directly from the form
  const observacionCompletaText = document.getElementById(
    "observacionCompleta"
  ).textContent; // Get the text from observacionCompleta
  copyToClipboard(fullObservation); // Copy the full observation
  guardarEnHistorial(
    observacionCompletaText, // Use observacionCompleta text for history
    rutForHistory,
    { ...formDataForSurvey },
    formDataForSurvey.surveyUrl // Save the generated survey URL
  );
  mostrarHistorial(); // Call mostrarHistorial to update the display

  window.cerrarModal("genobs");
};

window.actualizarPreguntas = () => {
  const tipoServicioElement = document.getElementById("tipoServicio");
  if (!tipoServicioElement) return;

  const tipoServicio = tipoServicioElement.value;
  const tvQuestions = document.getElementById("tvQuestions");
  const tresMundosSwitch = document.getElementById("tresMundosSwitchContainer");

  // Only proceed if elements exist
  if (!tvQuestions || !tresMundosSwitch) return;

  // Hide all conditional sections by default
  tvQuestions.style.display = "none";
  tresMundosSwitch.style.display = "none";

  if (tipoServicio === "TV HD" || tipoServicio === "Peliculas") {
    tvQuestions.style.display = "block";
  } else if (
    tipoServicio === "3 MUNDOS (Todos los servicios)" ||
    tipoServicio === "MUNDO GO"
  ) {
    tresMundosSwitch.style.display = "block";
    // Also check the switch state in case it was already checked
    window.toggleTvQuestions();
  }
};

window.toggleTvQuestions = () => {
  const tvQuestions = document.getElementById("tvQuestions");
  const fallaTvSwitch = document.getElementById("fallaTvSwitch");

  // Only proceed if elements exist
  if (!tvQuestions || !fallaTvSwitch) return;

  if (fallaTvSwitch.checked) {
    tvQuestions.style.display = "block";
  } else {
    tvQuestions.style.display = "none";
  }
};

// Helper function to copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

// Helper function to show a temporary notification
window.showNotification = (message, type = "success") => {
  const notificationContainer = document.createElement("div");
  notificationContainer.className = `notification ${type}`;
  notificationContainer.textContent = message;
  document.body.appendChild(notificationContainer);

  // Trigger reflow to enable CSS transition
  void notificationContainer.offsetWidth;

  notificationContainer.classList.add("show");

  setTimeout(() => {
    notificationContainer.classList.remove("show");
    notificationContainer.addEventListener("transitionend", () => {
      notificationContainer.remove();
    });
  }, 3000); // Notification visible for 3 seconds
};

// Expose imported functions to the global scope for onclick attributes
window.construirYEnviarSondeo = construirYEnviarSondeo;
window.importarHistorial = importarHistorial;
window.exportarHistorial = exportarHistorial;
window.mostrarHistorial = mostrarHistorial;
window.limpiarHistorial = limpiarHistorial; // Expose limpiarHistorial

// Ensure DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  // Get logo paths from global variables defined in index.html
  const mundoImgSrc = window.mundoImgSrc;
  const konectaImgSrc = window.konectaImgSrc;

  if (mundoImgSrc) {
    console.log("Mundo Image Source:", mundoImgSrc);
  }
  if (konectaImgSrc) {
    console.log("Konecta Image Source:", konectaImgSrc);
  }

  // Add double-click event listener for tiempoFalla
  const tiempoFallaInput = document.getElementById("tiempoFalla");
  if (tiempoFallaInput) {
    tiempoFallaInput.addEventListener("dblclick", () => {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      tiempoFallaInput.value = formattedDateTime;
      console.log(
        "TiempoFalla dblclick triggered. Value set to:",
        formattedDateTime
      );
    });
  }

  const deacuerdoBtn = document.getElementById("deacuerdoBtn");
  if (deacuerdoBtn && tiempoFallaInput) {
    deacuerdoBtn.addEventListener("click", () => {
      if (tiempoFallaInput.value) {
        window.cerrarModal("genobs");
      } else {
        window.showNotification(
          "Por favor, selecciona una fecha y hora.",
          "error"
        );
      }
    });
  }

  // Add event listener for the copy button on observacionCompleta
  const copyObservacionCompletaBtn = document.getElementById(
    "copyObservacionCompletaBtn"
  );
  if (copyObservacionCompletaBtn) {
    copyObservacionCompletaBtn.addEventListener("click", () => {
      const observacionCompletaTextarea = document.getElementById(
        "observacionCompleta"
      );
      if (observacionCompletaTextarea) {
        copyToClipboard(observacionCompletaTextarea.textContent);
        window.showNotification(
          "Observación copiada al portapapeles",
          "success"
        );
      }
    });
  }

  // Create all modals first to ensure they are in the DOM
  createSurveyModal();
  createSurveyPersisteModal(); // Create the new persiste modal
  initializeTagsModal(); // This also creates the modal

  // Initialize login to control access
  initializeLogin();
  initializeAboutModal(); // Initialize about modal after login to ensure theme is applied

  const openAboutBtn = document.getElementById("openAboutBtn");
  if (openAboutBtn) {
    openAboutBtn.onclick = () => abrirModal("aboutModal");
  }

  // Event listeners for sidebar buttons
  const openCronometroBtn = document.getElementById("openCronometroBtn");
  const pipStopwatchContainer = document.getElementById(
    "pip-stopwatch-container"
  );
  const closePipBtn = document.getElementById("closePipBtn");

  if (openCronometroBtn && pipStopwatchContainer && closePipBtn) {
    console.log(
      "openCronometroBtn, pipStopwatchContainer, and closePipBtn found."
    );
    openCronometroBtn.addEventListener("click", () => {
      console.log(
        "openCronometroBtn clicked. Adding 'open' class to pip-stopwatch-container."
      );
      pipStopwatchContainer.classList.add("open");
    });

    closePipBtn.addEventListener("click", () => {
      pipStopwatchContainer.classList.remove("open");
    });
  }

  // Tab switching logic for the stopwatch
  const tabButtons = document.querySelectorAll(".pip-tabs .tab-button");
  const tabContents = document.querySelectorAll(".pip-window .tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(`${targetTab}-tab`).classList.add("active");
    });
  });

  const openTmoBtn = document.getElementById("openTmoBtn");
  if (openTmoBtn) {
    openTmoBtn.onclick = () => window.abrirModal("tmoModal");
  }
  const openSpeedTestModalBtn = document.getElementById(
    "openSpeedTestModalBtn"
  );
  if (openSpeedTestModalBtn) {
    openSpeedTestModalBtn.onclick = () => window.abrirModal("speedTestModal");
  }
  const openHistoryBtn = document.getElementById("openHistoryBtn");
  if (openHistoryBtn) {
    openHistoryBtn.onclick = () => {
      window.abrirModal("historyModal");
      window.mostrarHistorial(); // Ensure history is displayed when modal opens
    };
  }
  const openTagsBtn = document.getElementById("openTagsBtn");
  if (openTagsBtn) {
    openTagsBtn.onclick = () => window.abrirModal("tagsModal");
  }

  // Event listeners for new history modal buttons
  const clearHistoryBtnModal = document.getElementById("clearHistoryBtnModal");
  if (clearHistoryBtnModal) {
    clearHistoryBtnModal.onclick = () => limpiarHistorial();
  }

  // Event listeners for config modal history import/export
  const exportHistoryBtn = document.getElementById("exportHistoryBtn");
  if (exportHistoryBtn) {
    exportHistoryBtn.onclick = () => exportarHistorial();
  }
  const importHistoryBtn = document.getElementById("importHistoryBtn");
  if (importHistoryBtn) {
    importHistoryBtn.onclick = () => {
      document.getElementById("importHistoryInput").click();
    };
  }
  const importHistoryInput = document.getElementById("importHistoryInput");
  if (importHistoryInput) {
    importHistoryInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        importarHistorial(file);
      }
    });
  }

  // Add null check for exportAllDataBtn in main.js
  const exportAllDataBtn = document.getElementById("exportAllDataBtn");
  if (exportAllDataBtn) {
    exportAllDataBtn.addEventListener("click", () => {
      // The actual export logic is in config.js, this just ensures the button exists
      // and can be clicked without error if it were to have an inline onclick
      console.log("Export All Data button clicked from main.js");
    });
  }

  // Close modals when clicking outside of them
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  // Check login status and load theme on page load
  const confirmationMessageElementCheck = document.getElementById(
    "confirmationMessage"
  );
  console.log(
    "Check for confirmationMessageElement in main.js DOMContentLoaded:",
    confirmationMessageElementCheck
  );
  initializeTmo();
  initializeConfig();
  loadTheme(); // Apply saved theme on load
  initializeSpeedtest();

  // Initialize genobs modal only if the element exists
  const genobsModalElement = document.getElementById("genobs");
  if (genobsModalElement) {
    initializeGenobsModal();
  } else {
    console.error("Genobs modal element not found, skipping initialization.");
  }

  initializeHistory(); // Initialize history modal

  // Load saved typification on page load
  const savedTypification = localStorage.getItem("selectedTypification");
  console.log("Loaded saved typification:", savedTypification);

  if (savedTypification && savedTypification !== "No definida") {
    const tipificacionElement = document.getElementById(
      "tipificacionSeleccionada"
    );
    if (tipificacionElement) {
      tipificacionElement.textContent = `Tipificación: ${savedTypification}`;
    }

    renderFormFields(savedTypification);
    applyShortcutListenersToTextareas(); // Apply listeners on initial load if typification is already set

    const mainContainer = document.querySelector(".main-container");
    const welcomeSection = document.getElementById("welcomeSection");

    if (mainContainer) mainContainer.style.display = "flex"; // Show main content
    if (welcomeSection) welcomeSection.style.display = "none"; // Hide welcome message
  } else {
    // Only open typification modal if user is logged in and no typification is saved
    if (
      localStorage.getItem("userDocType") &&
      localStorage.getItem("documentNumber")
    ) {
      abrirModal("modalTipificacion");
    }
  }

  // Login is now initialized directly above

  // Collapsible sections in config modal
  document.querySelectorAll(".config-section-header").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector(".expand-icon");

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.style.transform = "rotate(0deg)";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      }
    });
  });

  // Theme selection cards
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.addEventListener("click", () => {
      const themeName = card.dataset.theme;
      applyTheme(themeName);
    });
  });

  // Display current date and time in the header
  const updateDateTime = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    document.getElementById("fechaHora").textContent = now.toLocaleDateString(
      "es-ES",
      options
    );
  };

  // Update date and time every second
  setInterval(updateDateTime, 1000);
  updateDateTime(); // Initial call to display immediately

  // Display user cedula and handle logout
  const userCedula = localStorage.getItem("documentNumber");
  if (userCedula) {
    document.getElementById("user-cedula").textContent = userCedula;
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      abrirModal("logoutConfirmModal"); // Open the confirmation modal
    });
  }

  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userDocType");
      localStorage.removeItem("documentNumber");
      window.location.reload(); // Reload the page to log out
    });
  }

  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", () => {
      cerrarModal("logoutConfirmModal"); // Close the confirmation modal
    });
  }
});
