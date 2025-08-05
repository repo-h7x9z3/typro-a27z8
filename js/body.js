document.body.innerHTML = `
  <div class="main-container">
      <!-- Área de Contenido Principal -->
      <div class="content-area">
        <header>
          <div class="header-info">
            <div class="header-left">
              <div id="mainLogoContainer" class="logo-container">
                <img src="assets/logo.svg" alt="Logo Principal" style="max-width: 100%; height: auto;">
              </div>
              <div class="tipificacion-container">
                <span id="tipificacionSeleccionada"
                  >Tipificación: No definida</span
                >
                <button
                  class="tipificacion-button"
                  onclick="window.abrirModalTipificacion()"
                >
                  <span class="material-icons">cached</span>
                </button>
              </div>
            </div>
            <div class="header-center-content">
              <div id="statsContainer" class="stats-container">
                <div class="tmo-info">
                  <i class="material-icons">timer</i>
                  <p><strong>TMO:</strong> <span id="avgTime">0</span>s</p>
                </div>
                <div id="failureCounts"></div>
              </div>
              <div class="date-time" id="fechaHora"></div>
            </div>
            <div class="user-info">
              <span class="material-icons">person</span>
              <span id="user-cedula"></span>
              <button id="logout-button" class="logout-button">
                <span class="material-icons">logout</span>
              </button>
            </div>
          </div>
        </header>

        <div id="welcomeSection" class="welcome-section" style="display: none;">
          <i class="material-icons welcome-icon">waving_hand</i>
          <h2>¡Bienvenido!</h2>
          <p>Por favor, selecciona un tipo de tipificación para empezar.</p>
          <button class="tipificacion-button" onclick="window.abrirModalTipificacion()">
            <span class="material-icons">cached</span> Seleccionar Tipificación
          </button>
        </div>

        <div class="form-container">
          <div class="section-header">
            <i class="material-icons">person_outline</i>
            <h3>Datos del Cliente</h3>
          </div>
          <form id="datosForm">
            <div id="formContenido" class="form-grid">
              <div class="form-group">
                <label for="rutCliente">RUT</label>
                <input type="text" id="rutCliente" placeholder="Ingrese RUT" />
              </div>
              <div class="form-group">
                <label for="servicioFalla">SERVICIO CON LA FALLA</label>
                <input
                  type="text"
                  id="servicioFalla"
                  placeholder="Ingrese tipo de servicio con la falla"
                />
              </div>
              <div class="form-group">
                <label for="telefonoCliente">TELÉFONO</label>
                <input
                  type="text"
                  id="telefonoCliente"
                  placeholder="Ingrese teléfono"
                />
              </div>
              <div class="form-group">
                <label for="direccionCliente">DIRECCIÓN CLIENTE</label>
                <input
                  type="text"
                  id="direccionCliente"
                  placeholder="Ingrese dirección del cliente"
                />
              </div>
              <div class="form-group">
                <label for="ontCliente">ONT</label>
                <input type="text" id="ontCliente" placeholder="Ingrese ONT" />
              </div>
              <div class="form-group">
                <label for="oltCliente">OLT</label>
                <input type="text" id="oltCliente" placeholder="Ingrese OLT" />
              </div>
              <div class="form-group">
                <label for="tarjetaCliente">TARJETA</label>
                <input
                  type="text"
                  id="tarjetaCliente"
                  placeholder="Ingrese tarjeta"
                />
              </div>
              <div class="form-group">
                <label for="puertoCliente">PUERTO</label>
                <input
                  type="text"
                  id="puertoCliente"
                  placeholder="Ingrese puerto"
                />
              </div>
              <div class="form-group">
                <label for="nodoCliente">NODO</label>
                <input type="text" id="nodoCliente" placeholder="Ingrese nodo" />
              </div>
              <!-- El contenido del formulario se carga aquí dinámicamente -->
              <div class="form-group" style="grid-column: 1 / -1">
                <textarea
                  id="observacionForm"
                  rows="3"
                  placeholder="OBS:"
                ></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" onclick="window.generarObservacionPrincipal()">
                <i class="material-icons">send</i> Generar
              </button>
              <button
                type="button"
                id="enviarSondeoBtn"
                class="secondary"
                style="display: none"
                disabled
              >
                <i class="material-icons">send</i> Enviar Sondeo
              </button>
              <button
                type="button"
                id="enviarPersisteBtn"
                class="secondary"
                style="display: none; margin-left: 10px;"
                disabled
              >
                <i class="material-icons">send</i> Enviar Cliente persiste
              </button>
              <button
                type="button"
                onclick="window.limpiarFormulario()"
                class="secondary"
              >
                <i class="material-icons">clear</i> Limpiar
              </button>
            </div>
          </form>
          <div
            id="observacionCompletaContainer"
            class="section-header"
            style="margin-top: 20px; display: none"
          >
            <i class="material-icons">description</i>
            <h3>Observación Completa</h3>
          </div>
          <div
            id="observacionCompletaWrapper"
            class="observacion-wrapper"
            style="display: none"
          >
            <textarea
              id="observacionCompleta"
              class="observacion-container"
              readonly
            ></textarea>
          </div>
          <div
            id="finalObservationContainer"
            class="section-header"
            style="margin-top: 20px; display: none"
          >
            <i class="material-icons">description</i>
            <h3>Observación Final Generada</h3>
          </div>
          <div class="observacion-wrapper">
            <textarea
              id="observacionFinal"
              class="observacion-container"
              style="display: none"
              readonly
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Barra lateral -->
      <div class="sidebar">
        <h3 class="sidebar-title">Herramientas</h3>
        <button id="openAlarmBtn" class="sidebar-button" title="Alarma" onclick="window.openAlarmPip()">
          <i class="material-icons">alarm</i>
        </button>
        <button id="openTmoBtn" class="sidebar-button" title="Calculadora TMO">
          <i class="material-icons">access_time</i>
        </button>
        <button
          id="openSpeedTestModalBtn"
          class="sidebar-button"
          title="Test de Velocidad"
        >
          <i class="material-icons">speed</i>
        </button>

        <button id="openHistoryBtn" class="sidebar-button" title="Historial">
          <i class="material-icons">history</i>
        </button>
        <button id="openTagsBtn" class="sidebar-button" title="Tags">
          <i class="material-icons">label</i>
        </button>

        <button id="openConfigBtn" class="sidebar-button" title="Configuración">
          <i class="material-icons">settings</i>
        </button>
        <button id="openAboutBtn" class="sidebar-button" title="Acerca de">
          <i class="material-icons">info</i>
        </button>
      </div>

    <!-- Modales -->
    <div id="loginModalContainer"></div>



    
      

    <div id="aboutModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" onclick="window.cerrarModal('aboutModal')">
          &times;
        </button>
        <div class="about-header">
          <h2>Acerca de</h2>
          <div id="aboutModalLogo" class="logo-container"></div>
        </div>
        <div class="about-info">
          <p>
            <i class="material-icons">person</i> <strong>Desarrollador:</strong>
            <span id="developerName">Maicol Salcedo</span>
          </p>
          <p>
            <i class="material-icons">build</i>
            <strong>Versión:</strong> <span id="appVersion">1.0.0</span>
          </p>
        </div>
        <p>Una herramienta para optimizar la generación de tipificaciones.</p>
        <div class="corrections-section">
          <h3>Correcciones y Mejoras de la Versión</h3>
          <div class="form-group">
            <div id="correctionList" class="correction-list">
              <!-- Corrections will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="modalTipificacion" class="modal">
      <div class="modal-content">
        <button class="close-btn" onclick="window.cerrarModal('modalTipificacion')">
          &times;
        </button>
        <h2>Selecciona el Tipo de Tipificación</h2>
        <button onclick="window.guardarTipificacion('Movil')">Movil</button>
        <button onclick="window.guardarTipificacion('SAC')">SAC</button>
        <button onclick="window.guardarTipificacion('Transferencia (Soporte)')">
          Transferencia (Soporte)
        </button>
        <button onclick="window.guardarTipificacion('Soporte')">Soporte</button>
      </div>
    </div>

    <div id="modalCopia" class="modal">
      <div class="modal-content">
        <button class="close-btn" onclick="window.cerrarModal('modalCopia')">
          &times;
        </button>
        <h2>¡Observación Copiada!</h2>
        <p>La observación se ha copiado al portapapeles correctamente.</p>
        <p style="color: var(--danger-color); font-weight: bold">
          <strong>Importante:</strong> RECUERDA ADJUNTAR LA DOCUMENTACIÓN
        </p>
      </div>
    </div>

    <div id="alarmModal" class="modal">
      <div class="modal-content">
        <h2 id="alarmTitle">¡TIEMPO!</h2>
        <p id="alarmText">
          IMPORTANTE, No olvides Retomar tu gestion para Evitara Cliente
          desateindo
        </p>
        <button id="stopAlarmBtn">Detener Alarma</button>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div id="confirmDeleteModal" class="modal">
      <div class="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que quieres eliminar este temporizador?</p>
        <div style="text-align: center">
          <button
            id="confirmDeleteBtn"
            style="background-color: var(--danger-color)"
          >
            Eliminar
          </button>
          <button id="cancelDeleteBtn" class="secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación de Atajo -->
    <div id="confirmDeleteShortcutModal" class="modal">
      <div class="modal-content small-modal">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que quieres eliminar este atajo?</p>
        <div style="text-align: center">
          <button
            id="confirmDeleteShortcutBtn"
            style="background-color: var(--danger-color)"
          >
            Eliminar
          </button>
          <button id="cancelDeleteShortcutBtn" class="secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>


    <!-- Modal Tags -->
    <div id="tagsModal" class="modal">
      <div class="modal-content">
        <div class="tags-header">
          <button class="close-btn" onclick="window.cerrarModal('tagsModal')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h2>Gestión de Atajos (Tags)</h2>
          <div class="tags-actions">
            <button id="openCreateShortcutModalBtn">
              <i class="material-icons">add</i> Crear Nuevo Atajo
            </button>
          </div>
        </div>
        <div class="search-container">
          <input
            type="text"
            id="shortcutSearchInput"
            placeholder="Buscar atajos..."
          />
        </div>
        <div class="tags-list-container">
          <h3>Atajos Guardados</h3>
          <table id="savedShortcutsTable" class="shortcuts-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Atajo</th>
                <th>Plantilla</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Shortcuts will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Crear/Editar Atajo -->
    <div id="shortcutFormModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" onclick="window.cerrarModal('shortcutFormModal')">
          <i class="material-icons">close</i>
        </button>
        <h2 id="shortcutFormTitle">Crear Atajo</h2>
        <div class="tags-form-content">
          <input type="hidden" id="shortcutId" />
          <div class="form-row">
            <div class="form-group form-group-name">
              <label for="shortcutName">Nombre del Atajo</label>
              <input
                type="text"
                id="shortcutName"
                placeholder="Ej: Saludo inicial"
              />
            </div>
            <div class="form-group form-group-key">
              <label for="shortcutKey">Atajo</label>
              <input type="text" id="shortcutKey" placeholder="Ej: #saludo" />
            </div>
          </div>
          <div class="form-group">
            <label for="shortcutTypeToggle" class="shortcut-type-label">
              <label
                class="switch"
                title="Cambiar tipo de atajo (Texto/Combinación)"
              >
                <input type="checkbox" id="shortcutTypeToggle" />
                <span class="slider round"></span>
              </label>
              <span class="switch-label"
                >Habilitar atajos de combinación de teclas</span
              >
            </label>
          </div>
          <div class="form-group">
            <label for="shortcutTemplate">Plantilla</label>
            <textarea
              id="shortcutTemplate"
              rows="8"
              placeholder="Contenido de la plantilla"
            ></textarea>
          </div>
          <button id="saveShortcutBtn">Guardar Atajo</button>
        </div>
      </div>
    </div>

    <!-- Modal Configuración -->
    <div id="configModal" class="modal">
      <div class="modal-content">
        <div class="tags-header">
          <button class="close-btn" onclick="window.cerrarModal('configModal')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h2>Configuración</h2>
          <div class="header-actions-placeholder"></div>
        </div>
        <div class="config-content-wrapper">
          <div class="config-nav">
            <div class="config-nav-item active" data-section="theme">
              <i class="material-icons">palette</i>
              <span>Tema</span>
            </div>
            <div class="config-nav-item" data-section="export-import">
              <i class="material-icons">import_export</i>
              <span>Datos y Configuración</span>
            </div>
          </div>
          <div class="config-panels">
            <div id="theme-section" class="config-section active">
              <h3>Apariencia y Tema</h3>
              <div class="config-actions theme-options">
                <div
                  id="themeTemaMundoBtn"
                  data-theme="tema_mundo"
                  class="theme-card"
                >
                  <div class="theme-preview tema-mundo-preview"></div>
                  <span>Tema Mundo</span>
                </div>
                <div
                  id="themeDarkBlueBtn"
                  data-theme="dark_blue"
                  class="theme-card"
                >
                  <div class="theme-preview dark-blue-preview"></div>
                  <span>Tema Azul Oscuro</span>
                </div>
              </div>
            </div>
            <div id="export-import-section" class="config-section">
              <h3>Exportar / Importar Datos</h3>
              <div class="data-section">
                <h4>Historial de Tipificaciones</h4>
                <div class="config-actions">
                  <button id="exportHistoryBtn">
                    <i class="material-icons">file_download</i> Exportar
                  </button>
                  <button id="importHistoryBtn">
                    <i class="material-icons">file_upload</i> Importar
                  </button>
                  <input
                    type="file"
                    id="importHistoryInput"
                    accept=".txt"
                    style="display: none"
                  />
                </div>
              </div>
              <div class="data-section">
                <h4>Toda la Configuración</h4>
                <div class="config-actions">
                  <button id="exportAllDataBtn">
                    <i class="material-icons">cloud_download</i> Exportar Todo
                  </button>
                  <!-- The importAllDataBtn and importAllDataInput are dynamically created in js/config.js -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal TMO -->
    <div id="tmoModal" class="modal">
      <div class="modal-content">
        <div class="tmo-header-top"> <!-- New div for header -->
          <button class="close-btn" onclick="window.cerrarModal('tmoModal')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h2>Calculadora TMO</h2>
          <div class="tmo-header-actions"> <!-- New div for actions -->
            <button id="clearAllBtn" class="secondary"> <!-- Moved clearAllBtn here -->
              <i class="material-icons">delete_sweep</i> Limpiar Todo
            </button>
          </div>
        </div>
        <form id="dataFormTMO">
          <div class="form-group">
            <label for="callTime">Tiempo en llamada (segundos):</label>
            <input type="number" id="callTime" name="callTime" required />
          </div>
          <div class="form-group">
            <label for="failureType">Tipo de falla:</label>
            <select id="failureType" name="failureType" required>
              <option value="">Seleccione tipo de falla</option>
              <option value="Internet">Internet</option>
              <option value="TVHD">TVHD</option>
              <option value="VOIP">VOIP</option>
              <option value="MUNDOGO">MUNDOGO</option>
            </select>
          </div>
          <button type="submit">Agregar</button>
        </form>
        <table id="dataTable" style="width: 100%; margin-top: 20px">
          <thead>
            <tr>
              <th>Tiempo (s)</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Modal SpeedTest -->
    <div id="speedTestModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" onclick="window.cerrarModal('speedTestModal')">
          &times;
        </button>
        <h3>Test de Velocidad</h3>
        <div class="form-group">
          <input
            type="text"
            id="testIdInput"
            placeholder="Ingrese el ID del test de Speedtest"
          />
        </div>
        <button id="generateBtn" class="primary">Generar Enlace</button>
        <div id="speedTestResult" style="display: none">
          <p>Enlace Generado:</p>
          <div id="generatedUrl">
            <a href="#" target="_blank"></a>
          </div>
          <div class="speedtest-actions">
            <button id="copySpeedTestBtn" class="secondary">
              <i class="material-icons">content_copy</i> Copiar
            </button>
            <button id="openSpeedTestLinkBtn" class="secondary">
              <i class="material-icons">open_in_new</i> Abrir
            </button>
          </div>
        </div>
        <div
          id="speedTestError"
          class="error-message"
          style="display: none"
        ></div>
      </div>
    </div>

    <!-- Modal Generar Observación -->
    <div id="genobs" class="modal genobs-modal genobs-feature">
      <div class="modal-content genobs-modal-content">
        <div class="genobs-header">
          <button class="close-btn" onclick="window.cerrarModal('genobs')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h2>Generar Observación Completa</h2>
          <button
            id="generarObservacionFinalBtn"
            onclick="window.generarObservacionFinal()"
            class="primary-button"
          >
            <i class="material-icons">send</i> Generar Observación
          </button>
        </div>

        <div class="genobs-body-content">
          <div class="genobs-tabs">
            <button class="genobs-tab-button active" data-tab="preguntas">Preguntas</button>
            <button class="genobs-tab-button" data-tab="soporte">Soporte Generado</button>
          </div>

          <div class="modal-form-content">
            <div id="preguntas-tab" class="genobs-tab-content active">
            <div class="questions-column">
              <div class="form-group">
                <label for="suministroElectrico"
                  >¿Tiene suministro eléctrico?</label
                >
                <select id="suministroElectrico">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div class="form-group">
                <label for="generadorElectrico"
                  >¿Tiene generador eléctrico?</label
                >
                <select id="generadorElectrico">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div class="form-group">
                <label for="tiempoFalla">¿Desde cuándo presenta la falla?</label>
                <input type="datetime-local" id="tiempoFalla" />
              </div>

              <div class="form-group">
                <label for="tipoServicio">Seleccione tipo de servicio:</label>
                <select id="tipoServicio" onchange="window.actualizarPreguntas()">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="INTERNET">INTERNET</option>
                  <option value="TV HD">TV HD</option>
                  <option value="VOZ IP">VOZ IP</option>
                  <option value="MUNDO GO">MUNDO GO</option>
                  <option value="3 MUNDOS (Todos los servicios)">
                    3 MUNDOS (Todos los servicios)
                  </option>
                  <option value="MOVIL">MOVIL</option>
                </select>
              </div>

              <div id="extraPreguntas">
                <!-- Preguntas para TVHD -->
                <div id="tvQuestions" style="display: none;">
                  <div class="form-group">
                    <label for="controlRemoto">¿El control remoto funciona en su totalidad?</label>
                    <select id="controlRemoto">
                      <option value="" disabled selected>Seleccione</option>
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="cambioPilas">¿Se realizaron cambios de pilas del control remoto?</label>
                    <select id="cambioPilas">
                      <option value="" disabled selected>Seleccione</option>
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="pruebaCruzada">¿Se hizo prueba cruzada?</label>
                    <select id="pruebaCruzada">
                      <option value="" disabled selected>Seleccione</option>
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                </div>
                <!-- Switch para 3 MUNDOS -->
                <div id="tresMundosSwitchContainer" class="form-group" style="display: none;">
                  <label for="fallaTvSwitch">¿Tiene fallas en TV?</label>
                  <label class="switch">
                    <input type="checkbox" id="fallaTvSwitch" onchange="window.toggleTvQuestions()">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label for="instalacionReparacion"
                  >¿El cliente se está comunicando por inconvenientes que hubo al
                  momento de la instalación o reparación?</label
                >
                <select id="instalacionReparacion">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="No">No</option>
                  <option value="No realizo el soporte">
                    No realizo el soporte
                  </option>
                  <option value="No dio solucion al inconveniente">
                    No dio solucion al inconveniente
                  </option>
                  <option value="Incumplimiento visita">
                    Incumplimiento visita
                  </option>
                  <option value="Tuvo alguna discusion con el tecnico">
                    Tuvo alguna discusion con el tecnico
                  </option>
                  <option value="Instalacion deficiente">
                    Instalacion deficiente
                  </option>
                  <option value="Ont en estado desconocido">
                    Ont en estado desconocido
                  </option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div class="form-group">
                <label for="clienteReincidente">¿El cliente es reincidente?</label>
                <select id="clienteReincidente">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Por servicio de internet">
                    Por servicio de internet
                  </option>
                  <option value="Por servicio de tv">Por servicio de tv</option>
                  <option value="Por servicio de fono">
                    Por servicio de fono
                  </option>
                  <option value="Incumplimiento visita">
                    Incumplimiento visita
                  </option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div class="form-group">
                <label for="estadoLuces">¿Tiene luces? ¿En qué estado?</label>
                <select id="estadoLuces">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Luces Verdes (sin intermitencia)">
                    Luces Verdes (sin intermitencia)
                  </option>
                  <option value="Luz Roja (LOS)">Luz Roja (LOS)</option>
                  <option value="Luz (Power encendida) Sola">
                    Luz (Power encendida) Sola
                  </option>
                  <option value="Luz Pon (Intermitente)">
                    Luz Pon (Intermitente)
                  </option>
                  <option value="Sin Luces encendidas en la (ONT)">
                    Sin Luces encendidas en la (ONT)
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="estadoOnt">Estado de la ONT:</label>
                <select id="estadoOnt">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Conectado">Conectado</option>
                  <option value="Conectado con pérdida de monitoreo">
                    Conectado con pérdida de monitoreo
                  </option>
                  <option value="Desconocido">Desconocido</option>
                  <option value="Autofind">Autofind</option>
                  <option value="Offline">Offline</option>
                  <option value="Power Off">Power Off</option>
                </select>
              </div>

              <div class="form-group">
                <label for="clienteMasiva">Cliente dentro de una masiva:</label>
                <select id="clienteMasiva">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div class="form-group">
                <label for="fallaMasiva">Posible falla masiva:</label>
                <select id="fallaMasiva">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div class="form-group">
                <label for="visitaTecnica">¿Corresponde visita técnica?:</label>
                <select id="visitaTecnica">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div class="form-group">
                <label for="perdidaMonitoreo">¿Tiene perdida de monitoreo?</label>
                <select id="perdidaMonitoreo">
                  <option value="" disabled selected>Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>
          </div>

            <div id="soporte-tab" class="genobs-tab-content">
              <div class="support-column">
                <div class="form-group">
                  <label for="soporteGenerado">Soporte generado:</label>
                  <textarea id="soporteGenerado"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Historial -->
    <div id="historyModal" class="modal">
      <div class="modal-content">
        <div class="history-header-top">
          <button class="close-btn" onclick="window.cerrarModal('historyModal')">
            <i class="material-icons">arrow_back</i>
          </button>
          <h2>Historial de Tipificaciones</h2>
          <div class="history-header-actions">
            <button id="clearHistoryBtnModal" class="secondary">
              <i class="material-icons">delete_sweep</i> Limpiar
            </button>
          </div>
        </div>
        <div class="history-filters">
          <div class="form-group">
            <input
              type="text"
              id="historyFilter"
              placeholder="Filtrar por nombre, ID, RUT, etc..."
              oninput="mostrarHistorial()"
            />
          </div>
          <div class="filter-date-group">
            <label for="filterDateFrom">Desde:</label>
            <input
              type="date"
              id="filterDateFrom"
              onchange="mostrarHistorial()"
            />
          </div>
          <div class="filter-date-group">
            <label for="filterDateTo">Hasta:</label>
            <input
              type="date"
              id="filterDateTo"
              onchange="mostrarHistorial()"
            />
          </div>
        </div>
        <div class="history-container">
          <div id="historyTableBody">
            <!-- El historial se cargará aquí -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación de Historial -->
    <div id="historyConfirmDeleteModal" class="modal">
      <div class="modal-content small-modal">
        <h2>Confirmar Eliminación</h2>
        <p id="historyConfirmDeleteText"></p>
        <div class="modal-actions">
          <button id="historyConfirmDeleteBtn" class="danger">Eliminar</button>
          <button id="historyCancelDeleteBtn" class="secondary" onclick="window.cerrarModal('historyConfirmDeleteModal')">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación de TMO -->
    <div id="tmoConfirmationModal" class="modal">
      <div class="modal-content small-modal">
        <h2>Confirmar Eliminación</h2>
        <p id="tmoConfirmationMessage"></p>
        <div class="modal-actions">
          <button id="tmoConfirmDeleteBtn" class="danger">Eliminar</button>
          <button class="secondary" onclick="window.cerrarModal('tmoConfirmationModal')">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div id="logoutConfirmModal" class="modal">
      <div class="modal-content small-modal">
        <h2>Confirmar Cierre de Sesión</h2>
        <p>¿Estás seguro de que quieres cerrar la sesión?</p>
        <div class="modal-actions">
          <button id="confirmLogoutBtn" class="danger">Confirmar</button>
          <button id="cancelLogoutBtn" class="secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Sondeo -->
    <div id="surveyModal" class="modal">
      <div class="modal-content small-modal">
        <h2>Sondeo Generado</h2>
        <p>Para enviar el sondeo automáticamente, pulsa en 'Copiar Enlace'.</p>
        <p style="color: var(--danger-color); font-weight: bold">
          <strong>IMPORTANTE:</strong> Recuerda pegarlo en Firefox para completar el sondeo completamente.
        </p>
        <div class="modal-actions">
          <a id="surveyLink" href="#" target="_blank" class="secondary">Abrir Sondeo en Nueva Pestaña</a>
          <button id="copySurveyLinkBtn" class="primary">Copiar Enlace</button>
          <button class="secondary" onclick="window.cerrarModal('surveyModal')">Cerrar</button>
        </div>
      </div>
    </div>
`;
