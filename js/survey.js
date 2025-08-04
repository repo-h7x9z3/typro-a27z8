export let formDataForSurvey = {}; // Variable global para los datos

// La función collectSurveyData() se mantiene igual...
export function collectSurveyData() {
  // Preserve the existing survey URL from localStorage before rebuilding the data object
  const existingSondeoData = JSON.parse(localStorage.getItem("sondeo")) || {};
  const existingSurveyUrl = existingSondeoData.surveyUrl;

  // Data from the main form
  formDataForSurvey = {
    ID: localStorage.getItem("documentNumber") || "", // Get user ID from localStorage
    RUT: document.getElementById("clienteRUT")?.value || "",
    "SERVICIO CON LA FALLA":
      document.getElementById("tipoServicio")?.value || "", // Ahora se obtiene de tipoServicio en el modal genobs
    TELÉFONO: (() => {
      const domValue = document.getElementById("clienteTelefono")?.value || "";
      localStorage.setItem("genobs_clienteTelefono", domValue);
      return domValue;
    })(),
    "DIRECCIÓN CLIENTE":
      document.getElementById("clienteDireccion")?.value || "",
    ONT: (() => {
      const domValue = document.getElementById("clienteONT")?.value || "";
      localStorage.setItem("genobs_clienteONT", domValue);
      return domValue;
    })(),
    OLT: (() => {
      const domValue = document.getElementById("clienteOLT")?.value || "";
      localStorage.setItem("genobs_clienteOLT", domValue);
      return domValue;
    })(),
    TARJETA: (() => {
      const domValue = document.getElementById("clienteTarjeta")?.value || "";
      localStorage.setItem("genobs_clienteTarjeta", domValue);
      return domValue;
    })(),
    PUERTO: (() => {
      const domValue = document.getElementById("clientePuerto")?.value || "";
      localStorage.setItem("genobs_clientePuerto", domValue);
      return domValue;
    })(),
    NODO: (() => {
      const domValue = document.getElementById("clienteNodo")?.value || "";
      localStorage.setItem("genobs_clienteNodo", domValue);
      return domValue;
    })(),
    "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO":
      document.getElementById("observacionForm")?.value || "",
  };

  // Data from the genobs modal
  const genobsModalFields = {
    "Suministro Eléctrico":
      document.getElementById("suministroElectrico")?.value || "",
    "Generador Eléctrico":
      document.getElementById("generadorElectrico")?.value || "",
    "Desde Cuando Presenta la Falla":
      document.getElementById("tiempoFalla")?.value || "",
    "Tipo de servicio": document.getElementById("tipoServicio")?.value || "",
    "Inconvenientes Instalación/Reparación": (() => {
      const domValue =
        document.getElementById("instalacionReparacion")?.value || "";
      localStorage.setItem("genobs_instalacionReparacion", domValue); // Save the DOM value to localStorage
      return domValue; // Return the DOM value for formDataForSurvey
    })(),
    "El cliente es reincidente":
      document.getElementById("clienteReincidente")?.value || "",
    "Estado Luces": document.getElementById("estadoLuces")?.value || "",
    "Estado ONT": document.getElementById("estadoOnt")?.value || "",
    "Cliente Masiva": document.getElementById("clienteMasiva")?.value || "",
    "Falla Masiva": document.getElementById("fallaMasiva")?.value || "",
    "Visita Técnica": document.getElementById("visitaTecnica")?.value || "",
    "Soporte Generado": document.getElementById("soporteGenerado")?.value || "",
    "Falla Respuesta Genobs":
      document.getElementById("fallaRespuestaGenobs")?.value || "",
    "Control Remoto": document.getElementById("controlRemoto")?.value || "",
    "Cambio Pilas": document.getElementById("cambioPilas")?.value || "",
    "Prueba Cruzada": document.getElementById("pruebaCruzada")?.value || "",
    Decodificador: document.getElementById("decodificador")?.value || "",
    "Reinicio Eléctrico":
      document.getElementById("reinicioElectrico")?.value || "",
    "Cable HDMI/AV": document.getElementById("cableHDMIAV")?.value || "",
    "Observacion TV": document.getElementById("observacionTV")?.value || "",
  };

  Object.assign(formDataForSurvey, genobsModalFields);

  // If a survey URL was previously generated and stored, re-assign it to the new data object
  if (existingSurveyUrl) {
    formDataForSurvey.surveyUrl = existingSurveyUrl;
  }
}

/**
 * Esta función construye la URL COMPLETA con todos los parámetros
 * y la devuelve. No abre ninguna ventana ni modal.
 */
export function buildSurveyUrl() {
  collectSurveyData(); // Recopila los datos más recientes

  // Eliminar partes no deseadas de la observación para el sondeo
  let observacion =
    formDataForSurvey[
      "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO"
    ];
  if (observacion) {
    // Removals
    observacion = observacion.replace("obs: ", "").replace("OBS:", "");
    observacion = observacion.replace(
      "Tiene Luces en que estado ?: Luces Verdes (sin intermitencia)",
      ""
    );
    observacion = observacion.replace("Estado ONT: Conectado", "");

    // Replacements
    observacion = observacion.replace(
      "Cliente Masiva:",
      "Cliente dentro de una masiva"
    );
    observacion = observacion.replace("Falla Masiva", "Posible falla masiva:");
    observacion = observacion.replace(
      "Visita Técnica:",
      "¿Corresponde visita técnica?:"
    );

    // Clean up spaces and commas, and add newlines between questions
    observacion = observacion.replace(/, ,/g, ",").replace(/  +/g, " ").trim();
    // Add a newline after a response (like SI/No) followed by a new question (starting with a capital letter)
    observacion = observacion.replace(
      /(SI|NO|Si|No|si|no)\s*([A-Z¿])/g,
      "$1\n$2"
    );

    formDataForSurvey[
      "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO"
    ] = observacion;
  }

  const selectedTypification = localStorage.getItem("selectedTypification");

  let requiredFields = [];

  if (
    selectedTypification === "Transferencia (Soporte)" ||
    selectedTypification === "SAC" ||
    selectedTypification === "Movil"
  ) {
    requiredFields = ["RUT", "TELÉFONO"];
  } else {
    requiredFields = [
      "RUT",
      "SERVICIO CON LA FALLA",
      "TELÉFONO",
      "DIRECCIÓN CLIENTE",
      "ONT",
      "OLT",
      "TARJETA",
      "PUERTO",
      "NODO",
    ];
  }

  const missingFields = requiredFields.filter(
    (field) => !formDataForSurvey[field]
  );

  if (missingFields.length > 0) {
    const message = `Por favor, complete los siguientes campos antes de enviar el sondeo: ${missingFields.join(
      ", "
    )}`;
    console.warn("Missing survey fields:", message);
    window.showNotification(message, "error");
    return null; // Return null if required fields are missing
  }

  if (Object.keys(formDataForSurvey).length === 0) {
    const message =
      "No hay datos de formulario para enviar el sondeo. Por favor, genere la observación primero.";
    console.warn("No form data for survey:", message);
    window.showNotification(message, "error");
    return null; // Return null if no form data
  }

  // Define la URL base para el formulario de sondeo.
  const baseUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSeOA7OULm89gvnyG0q8Fvkr_bCdzXNsnRotRu6_tSmh-lPdLw/viewform?usp=pp_url";

  const urlParams = new URLSearchParams();

  // 1. Se mapean los datos recopilados (formDataForSurvey) a los parámetros de entrada ('entry')
  //    esperados por el formulario de Google. Cada 'entry.XXXXXXX' corresponde a un campo específico en el formulario.
  // Define un mapeo de los campos del formulario a los IDs de entrada de Google Forms.
  // Cada objeto contiene el 'entryId' de Google Forms y la clave correspondiente en 'formDataForSurvey'.
  const surveyFieldMappings = [
    { entryId: "entry.423430974", formDataKey: "ID" }, // CEDULA
    { entryId: "entry.189057090", formDataKey: "RUT" }, // RUT DEL CLIENTE
    { entryId: "entry.399236047", formDataKey: "SERVICIO CON LA FALLA" }, // Este campo ahora toma su valor de 'tipoServicio'
    { entryId: "entry.302927497", formDataKey: "TELÉFONO" }, // TELEFONO
    { entryId: "entry.1510722740", formDataKey: "DIRECCIÓN CLIENTE" }, // DIRECCION
    { entryId: "entry.825850316", formDataKey: "ONT" }, // ONT
    { entryId: "entry.163062648", formDataKey: "OLT" }, // OLT
    { entryId: "entry.1433390129", formDataKey: "TARJETA" }, // TARJETA
    { entryId: "entry.825069013", formDataKey: "PUERTO" }, // PUERTO
    { entryId: "entry.1038443960", formDataKey: "NODO" }, // NODO
    {
      entryId: "entry.1833454695",
      formDataKey: "Inconvenientes Instalación/Reparación",
    },
    { entryId: "entry.542616353", formDataKey: "El cliente es reincidente" },
    { entryId: "entry.1760026309", formDataKey: "Suministro Eléctrico" },
    { entryId: "entry.1092691919", formDataKey: "Generador Eléctrico" },
    { entryId: "entry.64765887", formDataKey: "Estado Luces" },
    {
      entryId: "entry.505366834",
      formDataKey: "OBSERVACIÓN CON INFORMACIÓN COMPLETA EN LA VARIBALE SONDEO",
    },
    { entryId: "entry.1944826262", formDataKey: "Falla Respuesta Genobs" },
    { entryId: "entry.1322891023", formDataKey: "Control Remoto" },
    { entryId: "entry.1944826262", formDataKey: "Cambio Pilas" },
    { entryId: "entry.1322891023", formDataKey: "Prueba Cruzada" },
    { entryId: "entry.1944826262", formDataKey: "Decodificador" },
    { entryId: "entry.1322891023", formDataKey: "Reinicio Eléctrico" },
    { entryId: "entry.1944826262", formDataKey: "Cable HDMI/AV" },
    { entryId: "entry.1322891023", formDataKey: "Observacion TV" },
  ];

  // Itera sobre el mapeo y añade los parámetros a la URL.
  surveyFieldMappings.forEach((mapping) => {
    urlParams.append(
      mapping.entryId,
      formDataForSurvey[mapping.formDataKey] || ""
    );
  });

  // Manejo especial para el campo de fecha y hora 'Desde Cuando Presenta la Falla'.
  const tiempoFalla = formDataForSurvey["Desde Cuando Presenta la Falla"];
  if (tiempoFalla) {
    const date = new Date(tiempoFalla);
    urlParams.append("entry.978502501_year", date.getFullYear());
    urlParams.append("entry.978502501_month", date.getMonth() + 1);
    urlParams.append("entry.978502501_day", date.getDate());
    urlParams.append("entry.978502501_hour", date.getHours());
    urlParams.append("entry.978502501_minute", date.getMinutes());
  }

  // 2. Se construye la URL final COMPLETA concatenando la URL base con los parámetros de sondeo.
  const finalUrl = `${baseUrl}&${urlParams.toString()}`;
  console.log("Generated Survey URL:", finalUrl);
  return finalUrl;
}

/**
 * Guarda la URL del sondeo en el historial de localStorage.
 * @param {string} url La URL del sondeo a guardar.
 */
export function saveSurveyUrlToHistory(url) {
  let history = JSON.parse(localStorage.getItem("surveyHistory")) || [];
  const timestamp = new Date().toLocaleString();
  history.unshift({ url: url, timestamp: timestamp }); // Add to the beginning
  // Keep only the last 10 entries to prevent excessive storage
  history = history.slice(0, 10);
  localStorage.setItem("surveyHistory", JSON.stringify(history));
}

/**
 * Configura los botones de la modal de sondeo con la URL generada.
 * @param {string} urlToDisplay La URL del sondeo a utilizar.
 */
export function construirYEnviarSondeo(urlToDisplay = null) {
  if (!urlToDisplay) {
    window.showNotification(
      "No se proporcionó una URL para el sondeo.",
      "error"
    );
    return;
  }

  console.log("Configuring survey modal with URL:", urlToDisplay);
  saveSurveyUrlToHistory(urlToDisplay); // Save the URL to history

  // Wait a bit for the modal to be in the DOM if it was just created
  setTimeout(() => {
    const copySurveyLinkBtn = document.getElementById("copySurveyLinkBtn");
    const copyAutoSendSurveyLinkBtn = document.getElementById(
      "copyAutoSendSurveyLinkBtn"
    );

    console.log("Configuring modal elements:", {
      copySurveyLinkBtn,
      copyAutoSendSurveyLinkBtn,
    });

    if (copySurveyLinkBtn) {
      copySurveyLinkBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(urlToDisplay);
          window.showNotification("¡Enlace de sondeo copiado!", "success");
          console.log("Survey link copied:", urlToDisplay);
        } catch (err) {
          console.error("Error al copiar el enlace de sondeo: ", err);
          window.showNotification(
            "Error al copiar el enlace de sondeo.",
            "error"
          );
        }
      };
    } else {
      console.error(
        "Error: copySurveyLinkBtn not found in DOM when trying to attach event listener."
      );
    }

    if (copyAutoSendSurveyLinkBtn) {
      copyAutoSendSurveyLinkBtn.onclick = async () => {
        const autoSendUrl = urlToDisplay.replace(
          "/viewform?usp=pp_url",
          "/formResponse?usp=pp_url"
        );
        try {
          await navigator.clipboard.writeText(autoSendUrl);
          window.showNotification(
            "¡Enlace de envío automático copiado!",
            "success"
          );
          console.log("Auto-send survey link copied:", autoSendUrl);
        } catch (err) {
          console.error("Error al copiar el enlace de envío automático: ", err);
          window.showNotification(
            "Error al copiar el enlace de envío automático.",
            "error"
          );
        }
      };
    } else {
      console.error(
        "Error: copyAutoSendSurveyLinkBtn not found in DOM when trying to attach event listener."
      );
    }
  }, 100); // Wait 100ms for the modal to be ready
}
