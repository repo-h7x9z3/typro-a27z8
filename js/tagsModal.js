// Function to initialize tags modal
export function initializeTagsModal() {
  const tagsModal = document.getElementById("tagsModal");
  const shortcutFormModal = document.getElementById("shortcutFormModal");
  const openCreateShortcutModalBtn = document.getElementById(
    "openCreateShortcutModalBtn"
  );
  const saveShortcutBtn = document.getElementById("saveShortcutBtn");
  const shortcutIdInput = document.getElementById("shortcutId");
  const shortcutNameInput = document.getElementById("shortcutName");
  const shortcutKeyInput = document.getElementById("shortcutKey");
  const shortcutTemplateTextarea = document.getElementById("shortcutTemplate");
  const savedShortcutsTable = document.getElementById("savedShortcutsTable");
  const shortcutTypeToggle = document.getElementById("shortcutTypeToggle");
  const openTagsBtn = document.getElementById("openTagsBtn");
  const shortcutFormTitle = document.getElementById("shortcutFormTitle");
  const shortcutSearchInput = document.getElementById("shortcutSearchInput");
  const confirmDeleteShortcutModal = document.getElementById(
    "confirmDeleteShortcutModal"
  );
  const confirmDeleteShortcutBtn = document.getElementById(
    "confirmDeleteShortcutBtn"
  );
  const cancelDeleteShortcutBtn = document.getElementById(
    "cancelDeleteShortcutBtn"
  );

  let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
  let shortcutToDeleteIndex = null;

  function handleCombinationKeydown(e) {
    if (e.key === "Backspace" || e.key === "Delete") {
      shortcutKeyInput.value = "";
      return;
    }
    e.preventDefault();
    if (e.ctrlKey || e.altKey || e.shiftKey) {
      const keyParts = [];
      if (e.ctrlKey) keyParts.push("Ctrl");
      if (e.altKey) keyParts.push("Alt");
      if (e.shiftKey) keyParts.push("Shift");
      if (!["Control", "Alt", "Shift"].includes(e.key)) {
        keyParts.push(e.key.toUpperCase());
      }
      if (keyParts.length > 1) {
        shortcutKeyInput.value = keyParts.join("+");
      }
    }
  }

  function handleTextKeydown(e) {
    if (e.key === "Backspace" || e.key === "Delete") return;
    if (!shortcutKeyInput.value.startsWith("/")) {
      if (e.key !== "/") e.preventDefault();
    }
  }

  function updateShortcutInputListener() {
    shortcutKeyInput.removeEventListener("keydown", handleCombinationKeydown);
    shortcutKeyInput.removeEventListener("keydown", handleTextKeydown);
    if (shortcutTypeToggle.checked) {
      shortcutKeyInput.placeholder = "Ej: Ctrl+S, Alt+Shift+F";
      shortcutKeyInput.classList.add("key-combination-active");
      shortcutKeyInput.removeEventListener("keydown", handleTextKeydown); // Ensure only one listener is active
      shortcutKeyInput.addEventListener("keydown", handleCombinationKeydown);
    } else {
      shortcutKeyInput.placeholder = "Ej: /saludo"; // Changed placeholder
      shortcutKeyInput.classList.remove("key-combination-active");
      shortcutKeyInput.removeEventListener("keydown", handleCombinationKeydown); // Ensure only one listener is active
      shortcutKeyInput.addEventListener("keydown", handleTextKeydown);
    }
  }

  function renderShortcuts(filter = "") {
    const tableBody = savedShortcutsTable.querySelector("tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    const lowerCaseFilter = filter.toLowerCase();
    const filteredShortcuts = shortcuts.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerCaseFilter) ||
        s.key.toLowerCase().includes(lowerCaseFilter) ||
        s.template.toLowerCase().includes(lowerCaseFilter)
    );

    if (filteredShortcuts.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4" style="text-align: center;">No se encontraron atajos.</td>`;
      tableBody.appendChild(tr);
      return;
    }

    filteredShortcuts.forEach((shortcut) => {
      const originalIndex = shortcuts.indexOf(shortcut);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${shortcut.name}</td>
        <td>${shortcut.key}</td>
        <td>${shortcut.template}</td>
        <td class="shortcut-actions">
          <button class="edit-shortcut-btn" data-index="${originalIndex}"><i class="material-icons">edit</i></button>
          <button class="delete-shortcut-btn" data-index="${originalIndex}"><i class="material-icons">delete_forever</i></button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function saveShortcuts() {
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    renderShortcuts();
    document.dispatchEvent(new Event("shortcutsUpdated")); // Dispatch custom event
  }

  function resetShortcutForm() {
    shortcutIdInput.value = "";
    shortcutNameInput.value = "";
    shortcutKeyInput.value = "";
    shortcutTemplateTextarea.value = "";
    shortcutTypeToggle.checked = false;
    shortcutFormTitle.textContent = "Crear Atajo";
    saveShortcutBtn.textContent = "Guardar Atajo";
    // Ensure the placeholder is reset correctly when opening a new form
    shortcutKeyInput.placeholder = "Ej: /saludo o presione una combinación"; // Changed placeholder
    shortcutKeyInput.classList.remove("key-combination-active");
    updateShortcutInputListener();
  }

  function openShortcutFormModal(shortcut = null, index = null) {
    resetShortcutForm();
    if (shortcut) {
      shortcutFormTitle.textContent = "Editar Atajo";
      saveShortcutBtn.textContent = "Actualizar Atajo";
      shortcutIdInput.value = index;
      shortcutNameInput.value = shortcut.name;
      shortcutKeyInput.value = shortcut.key;
      shortcutTemplateTextarea.value = shortcut.template;
      shortcutTypeToggle.checked = shortcut.type === "combination";
      // Manually trigger the update listener to apply correct placeholder and class
      updateShortcutInputListener();
    }
    shortcutFormModal.style.display = "flex";
  }

  shortcutSearchInput.addEventListener("input", (e) => {
    renderShortcuts(e.target.value);
  });

  openTagsBtn.addEventListener("click", () => {
    tagsModal.style.display = "flex";
    shortcutSearchInput.value = "";
    renderShortcuts();
  });

  openCreateShortcutModalBtn.addEventListener("click", () => {
    openShortcutFormModal();
  });

  saveShortcutBtn.addEventListener("click", () => {
    const name = shortcutNameInput.value.trim();
    const key = shortcutKeyInput.value.trim();
    const template = shortcutTemplateTextarea.value.trim();
    const id = shortcutIdInput.value;

    if (!template) {
      alert("La plantilla no puede estar vacía.");
      return;
    }
    if (!name && !key) {
      alert("Debe proporcionar al menos un nombre o un atajo de teclado.");
      return;
    }
    if (key) {
      const isCombination = shortcutTypeToggle.checked;
      if (isCombination && !key.includes("+")) {
        alert("El atajo de teclado no es una combinación válida (ej. Ctrl+S).");
        return;
      }
      if (!isCombination && !key.startsWith("/")) {
        alert('El atajo de texto debe comenzar con "/" (ej. /saludo).'); // Changed alert message and check
        return;
      }
    }

    const newShortcut = {
      name,
      key,
      template,
      type: shortcutTypeToggle.checked ? "combination" : "text",
    };

    if (id !== "") {
      shortcuts[parseInt(id)] = newShortcut;
    } else {
      shortcuts.push(newShortcut);
    }

    saveShortcuts();
    shortcutFormModal.style.display = "none";
  });

  savedShortcutsTable.addEventListener("click", (e) => {
    const editButton = e.target.closest(".edit-shortcut-btn");
    const deleteButton = e.target.closest(".delete-shortcut-btn");

    if (editButton) {
      const index = parseInt(editButton.dataset.index);
      const shortcut = shortcuts[index];
      openShortcutFormModal(shortcut, index);
    }

    if (deleteButton) {
      shortcutToDeleteIndex = parseInt(deleteButton.dataset.index);
      confirmDeleteShortcutModal.style.display = "flex";
    }
  });

  confirmDeleteShortcutBtn.addEventListener("click", () => {
    if (shortcutToDeleteIndex !== null) {
      shortcuts.splice(shortcutToDeleteIndex, 1);
      saveShortcuts();
      shortcutToDeleteIndex = null;
    }
    confirmDeleteShortcutModal.style.display = "none";
  });

  cancelDeleteShortcutBtn.addEventListener("click", () => {
    shortcutToDeleteIndex = null;
    confirmDeleteShortcutModal.style.display = "none";
  });

  shortcutTypeToggle.addEventListener("change", updateShortcutInputListener);

  // Initial setup
  updateShortcutInputListener();
}
