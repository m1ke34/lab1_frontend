let reports = [
  { id: 1, title: "SQL Injection", severity: "High", status: "Open", reporter: "Олексій", description: "Знайдено в формі логіну" },
  { id: 2, title: "XSS Vulnerability", severity: "Medium", status: "In Progress", reporter: "Михайло", description: "У полі коментарів" }
];
let nextId = 3;
let editingId = null;

const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");


form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const dto = readForm();
  const isValid = validate(dto);
  
  if (!isValid) return; 
  
  if (editingId) {
    updateReport(editingId, dto);
  } else {
    addReport(dto);
  }
  
  renderTable();
  resetFormState();
});

resetBtn.addEventListener("click", () => {
  resetFormState();
});

cancelEditBtn.addEventListener("click", () => {
  resetFormState();
});

tbody.addEventListener("click", (event) => {
  const target = event.target;
  
  if (target.classList.contains("delete-btn")) {
    const id = Number(target.dataset.id);
    deleteReport(id);
    renderTable();
  }
  
  if (target.classList.contains("edit-btn")) {
    const id = Number(target.dataset.id);
    startEdit(id);
  }
});


function readForm() {
  return {
    title: document.getElementById("titleInput").value.trim(),
    severity: document.getElementById("severitySelect").value,
    status: document.getElementById("statusSelect").value,
    reporter: document.getElementById("reporterInput").value.trim(),
    description: document.getElementById("descInput").value.trim()
  };
}

function addReport(dto) {
  const newReport = { id: nextId++, ...dto };
  reports.push(newReport);
}

function updateReport(id, dto) {
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { id, ...dto };
  }
}

function deleteReport(id) {
  reports = reports.filter(report => report.id !== id);
}

function startEdit(id) {
  const report = reports.find(r => r.id === id);
  if (!report) return;

  editingId = id;
  clearAllErrors();

  document.getElementById("titleInput").value = report.title;
  document.getElementById("severitySelect").value = report.severity;
  document.getElementById("statusSelect").value = report.status;
  document.getElementById("reporterInput").value = report.reporter;
  document.getElementById("descInput").value = report.description;

  formTitle.innerText = "Редагувати репорт";
  submitBtn.innerText = "Зберегти зміни";
  cancelEditBtn.style.display = "inline-block"; 
  resetBtn.style.display = "none"; 
}

function resetFormState() {
  form.reset();
  clearAllErrors();
  editingId = null;
  
  formTitle.innerText = "Додати репорт";
  submitBtn.innerText = "Додати репорт";
  cancelEditBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
}

function renderTable() {
  const rowsHtml = reports.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.title}</td>
      <td>${item.severity}</td>
      <td>${item.status}</td>
      <td>${item.reporter}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${item.id}" style="background-color: #ffc107; color: black; margin-right: 5px;">Редагувати</button>
        <button type="button" class="delete-btn" data-id="${item.id}">Видалити</button>
      </td>
    </tr>
  `).join("");
  
  tbody.innerHTML = rowsHtml;
}

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

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).innerText = message;
}

function clearError(inputId, errorId) {
  document.getElementById(inputId).classList.remove("invalid");
  document.getElementById(errorId).innerText = "";
}

function clearAllErrors() {
  const inputs = ["titleInput", "severitySelect", "statusSelect", "reporterInput", "descInput"];
  const errors = ["titleError", "severityError", "statusError", "reporterError", "descError"];
  
  for (let i = 0; i < inputs.length; i++) {
    clearError(inputs[i], errors[i]);
  }
}
document.addEventListener("DOMContentLoaded", renderTable);