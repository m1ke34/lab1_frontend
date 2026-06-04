import { getReports, createReport, updateReport, deleteReport } from "./apiClient";
import type { CreateReportDto, ReportDto, ApiError } from "./dtos";

let editingId: number | null = null;
let currentReports: ReportDto[] = [];

const form = document.getElementById("createForm") as HTMLFormElement;
const tbody = document.getElementById("itemsTableBody") as HTMLTableSectionElement;
const noticeEl = document.getElementById("notice") as HTMLDivElement;
const listStatusEl = document.getElementById("listStatus") as HTMLDivElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const cancelEditBtn = document.getElementById("cancelEditBtn") as HTMLButtonElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;
const formTitle = document.getElementById("formTitle") as HTMLHeadingElement;

function showNotice(message: string, isError = false) {
  noticeEl.style.color = isError ? "red" : "green";
  noticeEl.innerHTML = message;
  setTimeout(() => { noticeEl.innerHTML = ""; }, 5000);
}

async function loadReports() {
  listStatusEl.innerHTML = "Завантаження...";
  listStatusEl.style.color = "blue";
  tbody.innerHTML = "";

  try {
    currentReports = await getReports();
    
    if (!currentReports || currentReports.length === 0) {
      listStatusEl.innerHTML = "Поки що немає записів (Empty).";
      listStatusEl.style.color = "gray";
      return;
    }

    listStatusEl.innerHTML = "";
    renderTable(currentReports);

  } catch (e) {
    const err = e as ApiError;
    listStatusEl.innerHTML = `Помилка завантаження (${err.status}): ${err.message}`;
    listStatusEl.style.color = "red";
  }
}

function renderTable(items: ReportDto[]) {
  tbody.innerHTML = "";

  items.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = String(index + 1);

    const tdTitle = document.createElement("td");
    tdTitle.textContent = item.title; 

    const tdSeverity = document.createElement("td");
    tdSeverity.textContent = item.severity;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = item.status;

    const tdUserId = document.createElement("td");
    tdUserId.textContent = String(item.userId);

    const tdActions = document.createElement("td");
    
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.setAttribute("data-id", String(item.id));
    editBtn.style.cssText = "background-color: #ffc107; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; margin-right: 4px;";
    editBtn.textContent = "Редагувати";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("data-id", String(item.id));
    deleteBtn.style.cssText = "background-color: #dc3545; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;";
    deleteBtn.textContent = "Видалити";

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdIndex);
    tr.appendChild(tdTitle);
    tr.appendChild(tdSeverity);
    tr.appendChild(tdStatus);
    tr.appendChild(tdUserId);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function readForm(): CreateReportDto {
  return {
    title: (document.getElementById("titleInput") as HTMLInputElement).value.trim(),
    severity: (document.getElementById("severitySelect") as HTMLSelectElement).value,
    status: (document.getElementById("statusSelect") as HTMLSelectElement).value,
    userId: Number((document.getElementById("reporterInput") as HTMLInputElement).value.trim()) || 1,
    description: (document.getElementById("descInput") as HTMLTextAreaElement).value.trim()
  };
}

function resetFormState() {
  form.reset();
  editingId = null;
  formTitle.innerText = "Додати репорт";
  submitBtn.innerText = "Додати репорт";
  cancelEditBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
  submitBtn.disabled = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dto = readForm();

  if (!dto.title || !dto.severity || !dto.userId || !dto.description) {
    showNotice("Будь ласка, заповніть всі поля! У поле 'Репортер' введіть число (ID).", true);
    return;
  }
  submitBtn.disabled = true; 

  try {
    if (editingId) {
      await updateReport(editingId, dto);
      showNotice("Репорт успішно оновлено!");
    } else {
      await createReport(dto);
      showNotice("Репорт успішно додано!");
    }
    resetFormState();
    await loadReports();
  } catch (e) {
    const err = e as ApiError;
    showNotice(`Помилка (${err.status}): ${err.message}<br>${err.details ?? ""}`, true);
  } finally {
    submitBtn.disabled = false;
  }
});

tbody.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const id = Number(target.getAttribute("data-id"));

  if (!id) return;

  if (target.classList.contains("delete-btn")) {
    if (!confirm("Ви впевнені, що хочете видалити цей репорт?")) return;
    try {
      await deleteReport(id);
      showNotice("Репорт видалено");
      await loadReports();
    } catch (err) {
      showNotice("Помилка видалення", true);
    }
  }

  if (target.classList.contains("edit-btn")) {
    const report = currentReports.find(r => r.id === id);
    if (!report) return;

    editingId = id;
    (document.getElementById("titleInput") as HTMLInputElement).value = report.title;
    (document.getElementById("severitySelect") as HTMLSelectElement).value = report.severity;
    (document.getElementById("statusSelect") as HTMLSelectElement).value = report.status;
    (document.getElementById("reporterInput") as HTMLInputElement).value = String(report.userId);
    (document.getElementById("descInput") as HTMLTextAreaElement).value = report.description;

    formTitle.innerText = `Редагування #${id}`;
    submitBtn.innerText = "Зберегти зміни";
    cancelEditBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
  }
});

cancelEditBtn.addEventListener("click", resetFormState);
resetBtn.addEventListener("click", resetFormState);

document.addEventListener("DOMContentLoaded", loadReports);
