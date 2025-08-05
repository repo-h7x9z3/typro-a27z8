export let formDataForSurveyPersiste = {}; // Variable global para los datos

export function collectSurveyPersisteData() {
  // Preserve the existing survey URL from localStorage before rebuilding the data object
  const existingSondeoData =
    JSON.parse(localStorage.getItem("sondeoPersiste")) || {};
  const existingSurveyUrl = existingSondeoData.surveyUrl;

  // Data from the main form
  formDataForSurveyPersiste = {
    "CEDULA DEL EJECUTIVO": localStorage.getItem("documentNumber") || "", // Get user ID from localStorage
    RUT: document.getElementById("clienteRUT")?.value || "",
    Contrato: document.getElementById("clienteContrato")?.value || "",
    "SERVICIO CON LA FALLA":
      document.getElementById("tipoServicio")?.value || "", // Ahora se obtiene de tipoServicio en el modal genobs
    "TIENE PERDIDA DE MONITOREO?":
      document.getElementById("perdidaMonitoreo")?.value || "",
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
    SSSAF: (() => {
      const domValue = document.getElementById("clienteSSSAF")?.value || "";
      localStorage.setItem("genobs_clienteSSSAF", domValue);
      return domValue;
    })(),
    "UNO EN CADA AREGLON": (() => {
      const domValue =
        document.getElementById("clienteUnoEnCadaArreglon")?.value || "";
      localStorage.setItem("genobs_clienteUnoEnCadaArreglon", domValue);
      return domValue;
    })(),
    "OBSERVACION :": document.getElementById("observacionForm")?.value || "", // Updated key
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
      return domValue; // Return the DOM value for formDataForSurveyPersiste
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

  Object.assign(formDataForSurveyPersiste, genobsModalFields);

  // If a survey URL was previously generated and stored, re-assign it to the new data object
  if (existingSurveyUrl) {
    formDataForSurveyPersiste.surveyUrl = existingSurveyUrl;
  }
}

/**
 * Esta función construye la URL COMPLETA con todos los parámetros
 * y la devuelve. No abre ninguna ventana ni modal.
 */
export function buildSurveyPersisteUrl() {
  collectSurveyPersisteData(); // Recopila los datos más recientes

  // Eliminar partes no deseadas de la observación para el sondeo
  let observacion = formDataForSurveyPersiste["OBSERVACION :"];

  // Remove "NODO:" and its value if it's already present in the observation field to avoid duplication
  observacion = observacion.replace(/NODO:\s*[^ \n]*/g, "").trim();
  // Remove "Desde Cuando Presenta la Falla:" and its value if it's already present in the observation field
  observacion = observacion
    .replace(/Desde Cuando Presenta la Falla:\s*[^ \n]*/g, "")
    .trim();

  const contrato = formDataForSurveyPersiste["Contrato"] || "";
  const nodo = formDataForSurveyPersiste["NODO"] || ""; // Keep this variable for the URL parameter mapping
  const tarjeta = formDataForSurveyPersiste["TARJETA"] || "";
  const direccion = formDataForSurveyPersiste["DIRECCIÓN CLIENTE"] || "";
  const perdidaMonitoreo =
    formDataForSurveyPersiste["TIENE PERDIDA DE MONITOREO?"] || "";
  const sssaf = formDataForSurveyPersiste["SSSAF"] || "";
  const unoEnCadaArreglon =
    formDataForSurveyPersiste["UNO EN CADA AREGLON"] || "";
  const suministroElectrico =
    formDataForSurveyPersiste["Suministro Eléctrico"] || "";

  // Construct the observation string with newlines for separation, ensuring NODO is not duplicated in the text
  observacion = `Contrato: ${contrato}\nNODO: ${nodo}\nTARJETA: ${tarjeta}\nDIRECCIÓN: ${direccion}\n¿Tiene perdida de monitoreo?:${perdidaMonitoreo}\n${unoEnCadaArreglon}\n${observacion}`;

  if (observacion) {
    // Remove multiple newlines and trim
    observacion = observacion.replace(/\n\s*\n/g, "\n").trim();

    // Removals
    observacion = observacion.replace("obs: ", "").replace("OBS:", "");
    observacion = observacion.replace(
      "Tiene Luces en que estado ?: Luces Verdes (sin intermitencia)",
      ""
    );
    observacion = observacion.replace("Estado ONT: Conectado", "");
    observacion = observacion.replace(/SSSAF:\s*[^ \n]*/g, "").trim(); // Remove SSSAF and its value

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

    // Clean up spaces and commas, and ensure "NODO" is correctly spelled
    observacion = observacion.replace(/NO DO:/g, "NODO:");
    observacion = observacion.replace(/, ,/g, ",").replace(/  +/g, " ").trim();
    // Remove space after "¿Tiene perdida de monitoreo?:" and "Desde Cuando Presenta la Falla?:"
    observacion = observacion.replace(
      /¿Tiene perdida de monitoreo?:\s/g,
      "¿Tiene perdida de monitoreo?:"
    );
    observacion = observacion.replace(
      /Desde Cuando Presenta la Falla:\s/g,
      "Desde Cuando Presenta la Falla:"
    );
    observacion = observacion.replace(
      /Suministro Eléctrico:\s/g,
      "Suministro Eléctrico:"
    );

    formDataForSurveyPersiste["OBSERVACION :"] = observacion; // Updated key
  }

  const selectedTypification = localStorage.getItem("selectedTypification");

  let requiredFields = [];

  if (
    selectedTypification === "Transferencia (Soporte)" ||
    selectedTypification === "SAC" ||
    selectedTypification === "Movil"
  ) {
    requiredFields = ["RUT", "TELÉFONO", "Contrato"];
  } else {
    requiredFields = ["RUT", "SERVICIO CON LA FALLA", "ONT", "OLT", "Contrato"];
  }

  const missingFields = requiredFields.filter(
    (field) => !formDataForSurveyPersiste[field]
  );

  if (missingFields.length > 0) {
    const message = `Por favor, complete los siguientes campos antes de enviar el cliente persiste: ${missingFields.join(
      ", "
    )}`;
    console.warn("Missing survey persiste fields:", message);
    window.showNotification(message, "error");
    return null; // Return null if required fields are missing
  }

  if (Object.keys(formDataForSurveyPersiste).length === 0) {
    const message =
      "No hay datos de formulario para enviar el cliente persiste. Por favor, genere la observación primero.";
    console.warn("No form data for survey persiste:", message);
    window.showNotification(message, "error");
    return null; // Return null if no form data
  }

  // Define la URL base para el formulario de sondeo persistente.
  const baseUrl = window.SURVEY_PERSISTE_BASE_URL; // Placeholder URL

  const urlParams = new URLSearchParams();

  // 1. Se mapean los datos recopilados (formDataForSurveyPersiste) a los parámetros de entrada ('entry')
  //    esperados por el formulario de Google. Cada 'entry.XXXXXXX' corresponde a un campo específico en el formulario.
  // Define un mapeo de los campos del formulario a los IDs de entrada de Google Forms.
  // Cada objeto contiene el 'entryId' de Google Forms y la clave correspondiente en 'formDataForSurveyPersiste'.
  const surveyFieldMappings = [
    { entryId: "entry.1756173374", formDataKey: "CEDULA DEL EJECUTIVO" }, // CEDULA DEL EJECUTIVO
    { entryId: "entry.596409908", formDataKey: "RUT" }, // RUT DEL CLIENTE
    { entryId: "entry.748509019", formDataKey: "SERVICIO CON LA FALLA" }, // Este campo ahora toma su valor de 'tipoServicio'
    { entryId: "entry.1029252672", formDataKey: "Contrato" }, // ID de Llamada ahora usa Contrato
    { entryId: "entry.907612803", formDataKey: "Contrato" }, // CÓDIGO DE CONTRATO ahora usa Contrato
    { entryId: "entry.359541124", formDataKey: "ONT" }, // ONT
    { entryId: "entry.259929954", formDataKey: "OLT" }, // OLT
    { entryId: "entry.504780451", formDataKey: "TIENE PERDIDA DE MONITOREO?" },
    { entryId: "entry.1859159833", formDataKey: "OBSERVACION :" }, // OBSERVACION :
    { entryId: "entry.302927497", formDataKey: "TELÉFONO" }, // TELEFONO
    { entryId: "entry.1510722740", formDataKey: "DIRECCIÓN CLIENTE" }, // DIRECCION
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
      formDataForSurveyPersiste[mapping.formDataKey] || ""
    );
  });

  // Manejo especial para el campo de fecha y hora 'Desde Cuando Presenta la Falla'.
  const tiempoFalla =
    formDataForSurveyPersiste["Desde Cuando Presenta la Falla"];
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
  console.log("Generated Survey Persiste URL:", finalUrl);
  return finalUrl;
}

/**
 * Guarda la URL del cliente persiste en el historial de localStorage.
 * @param {string} url La URL del cliente persiste a guardar.
 */
export function saveSurveyPersisteUrlToHistory(url) {
  let history = JSON.parse(localStorage.getItem("surveyPersisteHistory")) || [];
  const timestamp = new Date().toLocaleString();
  history.unshift({ url: url, timestamp: timestamp }); // Add to the beginning
  // Keep only the last 10 entries to prevent excessive storage
  history = history.slice(0, 10);
  localStorage.setItem("surveyPersisteHistory", JSON.stringify(history));
}

/**
 * Configura los botones de la modal de cliente persiste con la URL generada.
 * @param {string} urlToDisplay La URL del cliente persiste a utilizar.
 */
export function construirYEnviarSondeoPersiste(urlToDisplay = null) {
  if (!urlToDisplay) {
    window.showNotification(
      "No se proporcionó una URL para el cliente persiste.",
      "error"
    );
    return;
  }

  console.log("Configuring survey persiste modal with URL:", urlToDisplay);
  saveSurveyPersisteUrlToHistory(urlToDisplay); // Save the URL to history

  // Wait a bit for the modal to be in the DOM if it was just created
  setTimeout(() => {
    const copySurveyPersisteLinkBtn = document.getElementById(
      "copySurveyPersisteLinkBtn"
    );
    const copyAutoSendSurveyPersisteLinkBtn = document.getElementById(
      "copyAutoSendSurveyPersisteLinkBtn"
    );

    console.log("Configuring modal elements:", {
      copySurveyPersisteLinkBtn,
      copyAutoSendSurveyPersisteLinkBtn,
    });

    if (copySurveyPersisteLinkBtn) {
      copySurveyPersisteLinkBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(urlToDisplay);
          window.showNotification(
            "¡Enlace de cliente persiste copiado!",
            "success"
          );
          console.log("Survey persiste link copied:", urlToDisplay);
        } catch (err) {
          console.error("Error al copiar el enlace de cliente persiste: ", err);
          window.showNotification(
            "Error al copiar el enlace de cliente persiste.",
            "error"
          );
        }
      };
    } else {
      console.error(
        "Error: copySurveyPersisteLinkBtn not found in DOM when trying to attach event listener."
      );
    }

    if (copyAutoSendSurveyPersisteLinkBtn) {
      copyAutoSendSurveyPersisteLinkBtn.onclick = async () => {
        const autoSendUrl = urlToDisplay.replace(
          "/viewform?usp=pp_url",
          "/formResponse?usp=pp_url"
        );
        try {
          await navigator.clipboard.writeText(autoSendUrl);
          window.showNotification(
            "¡Enlace de envío automático de cliente persiste copiado!",
            "success"
          );
          console.log("Auto-send survey persiste link copied:", autoSendUrl);
        } catch (err) {
          console.error(
            "Error al copiar el enlace de envío automático de cliente persiste: ",
            err
          );
          window.showNotification(
            "Error al copiar el enlace de envío automático de cliente persiste.",
            "error"
          );
        }
      };
    } else {
      console.error(
        "Error: copyAutoSendSurveyPersisteLinkBtn not found in DOM when trying to attach event listener."
      );
    }
  }, 100); // Wait 100ms for the modal to be ready
}
