// --- STATE ---
let reports = [];
let nextId = 1;

// --- DOM ELEMENTS ---
const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");

// --- INITIALIZATION ---
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Зупиняємо перезавантаження сторінки
  
  const dto = readForm();
  const isValid = validate(dto);
  
  if (!isValid) return;
  
  addReport(dto);
  renderTable();
  form.reset(); 
  clearAllErrors();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  clearAllErrors();
});

// Делегування подій для таблиці (видалення)
tbody.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);
    deleteReport(id);
    renderTable();
  }
});

// --- LOGIC FUNCTIONS ---

// Зчитування даних з форми в об'єкт DTO
function readForm() {
  return {
    title: document.getElementById("titleInput").value.trim(),
    severity: document.getElementById("severitySelect").value,
    status: document.getElementById("statusSelect").value,
    reporter: document.getElementById("reporterInput").value.trim(),
    description: document.getElementById("descInput").value.trim()
  };
}

// Валідація даних
function validate(dto) {
  clearAllErrors();
  let isValid = true;

  if (dto.title === "") {
    showError("titleInput", "titleError", "Назва є обов'язковою.");
    isValid = false;
  } else if (dto.title.length < 3) {
    showError("titleInput", "titleError", "Мінімум 3 символи.");
    isValid = false;
  }

  if (dto.severity === "") {
    showError("severitySelect", "severityError", "Оберіть рівень критичності.");
    isValid = false;
  }

  if (dto.reporter === "") {
    showError("reporterInput", "reporterError", "Вкажіть репортера.");
    isValid = false;
  }

  if (dto.description === "") {
    showError("descInput", "descError", "Опис не може бути порожнім.");
    isValid = false;
  }

  return isValid;
}

// Додавання нового запису
function addReport(dto) {
  const newReport = {
    id: nextId++,
    title: dto.title,
    severity: dto.severity,
    status: dto.status,
    reporter: dto.reporter,
    description: dto.description
  };
  reports.push(newReport);
}

// Видалення запису за ID
function deleteReport(id) {
  reports = reports.filter(report => report.id !== id);
}

// Відображення таблиці
function renderTable() {
  const rowsHtml = reports.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.title}</td>
      <td>${item.severity}</td>
      <td>${item.status}</td>
      <td>${item.reporter}</td>
      <td>
        <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
      </td>
    </tr>
  `).join("");
  
  tbody.innerHTML = rowsHtml;
}

// --- UI HELPERS ---

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerText = message;
}

function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove("invalid");
  document.getElementById(errorId).innerText = "";
}

function clearAllErrors() {
  clearError("titleInput", "titleError");
  clearError("severitySelect", "severityError");
  clearError("statusSelect", "statusError");
  clearError("reporterInput", "reporterError");
  clearError("descInput", "descError");
}
