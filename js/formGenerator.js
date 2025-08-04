import { handleShortcut } from "./tags.js";

let lastSelectedTypification = null; // Variable to store the last selected typification

export function renderFormFields(tipoTipificacion) {
  const formContenido = document.getElementById("formContenido");
  if (!formContenido) {
    console.error("Element with ID 'formContenido' not found.");
    return;
  }

  // Clear existing content only if the typification has changed
  if (tipoTipificacion !== lastSelectedTypification) {
    formContenido.innerHTML = "";
    lastSelectedTypification = tipoTipificacion; // Update the last selected typification
  }

  // Define common fields
  const commonFields = [
    {
      id: "clienteId",
      label: "ID Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: 123456789",
    },
    {
      id: "clienteNombre",
      label: "Nombre Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: Juan Pérez",
    },
    {
      id: "clienteRUT",
      label: "RUT Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: 12.345.678-9",
    },
    {
      id: "clienteTelefono",
      label: "Teléfono Cliente:",
      type: "tel",
      required: true,
      placeholder: "Ej: +56912345678",
    },
    {
      id: "clienteDireccion",
      label: "Dirección Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: Calle Falsa 123, Comuna, Ciudad",
    },
    {
      id: "clienteONT",
      label: "ONT:",
      type: "text",
      required: false,
      placeholder: "Ej: ABC123456789",
    },
    {
      id: "clienteOLT",
      label: "OLT:",
      type: "text",
      required: false,
      placeholder: "Ej: OLT-01",
    },
    {
      id: "clienteTarjeta",
      label: "Tarjeta:",
      type: "text",
      required: false,
      placeholder: "Ej: Tarjeta 1",
    },
    {
      id: "clientePuerto",
      label: "Puerto:",
      type: "text",
      required: false,
      placeholder: "Ej: Puerto 5",
    },
    {
      id: "clienteNodo",
      label: "Nodo:",
      type: "text",
      required: false,
      placeholder: "Ej: NODO-XYZ",
    },
  ];

  let fieldsToRender = [];

  // Define minimal fields for most typification types
  const minimalFields = [
    {
      id: "clienteId",
      label: "ID Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: 123456789",
    },
    {
      id: "clienteNombre",
      label: "Nombre Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: Juan Pérez",
    },
    {
      id: "clienteRUT",
      label: "RUT Cliente:",
      type: "text",
      required: true,
      placeholder: "Ej: 12.345.678-9",
    },
    {
      id: "clienteTelefono",
      label: "Teléfono Cliente:",
      type: "tel",
      required: true,
      placeholder: "Ej: +56912345678",
    },
  ];

  switch (tipoTipificacion) {
    case "Movil":
    case "SAC":
    case "Transferencia (Soporte)":
      fieldsToRender = minimalFields;
      break;
    case "Soporte":
      fieldsToRender = commonFields; // "Soporte" now requires all common fields
      break;
    default:
      fieldsToRender = minimalFields; // Fallback to minimal fields if type is not recognized
      break;
  }

  // Add the "Observación" field to all typification types
  const observacionField = {
    id: "observacionForm", // Changed ID to match main.js
    label: "Observación:",
    type: "textarea",
    required: false,
    placeholder: "Escribe aquí la observación completa...", // Add placeholder for observation field
  };
  fieldsToRender.push(observacionField);

  fieldsToRender.forEach((field) => {
    const formGroup = document.createElement("div");
    formGroup.className = "form-group";

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;
    formGroup.appendChild(label);

    if (field.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.id = field.id;
      textarea.name = field.id;
      if (field.required) {
        textarea.required = true;
      }
      if (field.id === "observacionForm" && tipoTipificacion === "Soporte") {
        textarea.readOnly = true;
        textarea.placeholder =
          "Selecciona el botón de lápiz para editar este campo";
      } else if (
        field.id === "observacionForm" &&
        (tipoTipificacion === "Movil" ||
          tipoTipificacion === "SAC" ||
          tipoTipificacion === "Transferencia (Soporte)")
      ) {
        textarea.placeholder = "Escribe aquí la observación completa...";
      } else if (field.placeholder) {
        textarea.placeholder = field.placeholder;
      }

      if (field.id === "observacionForm") {
        const observationWrapper = document.createElement("div");
        observationWrapper.className = "observation-field-wrapper";

        observationWrapper.appendChild(textarea);

        // Add shortcut listener to observacionForm for specific typifications
        if (
          tipoTipificacion === "Soporte" ||
          tipoTipificacion === "Transferencia (Soporte)"
        ) {
          textarea.addEventListener("keydown", handleShortcut);
        }

        if (tipoTipificacion === "Soporte") {
          // Changed from "Cliente Persistente" to "Soporte"
          const button = document.createElement("button");
          button.id = "observacion-modal-button";
          button.type = "button";
          button.className = "observacion-modal-button";
          button.innerHTML = '<span class="material-icons">edit</span>';
          button.title = "Generar Observación Completa";
          button.onclick = () => {
            const genobsModal = document.getElementById("genobs");
            if (genobsModal) {
              genobsModal.style.display = "flex";
            }
          };
          observationWrapper.appendChild(button);
        }
        formGroup.appendChild(observationWrapper);
      } else {
        formGroup.appendChild(textarea);
      }
    } else {
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      if (field.required) {
        input.required = true;
      }
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      }
      formGroup.appendChild(input);
    }

    formContenido.appendChild(formGroup);
  });
}
