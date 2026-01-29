
import { API } from './api.js';

const els = {};

function qs(sel) { return document.querySelector(sel); }

function showMessage(msg, type = 'info') {
    els.message.textContent = msg;
    els.message.className = type;

    if (type === 'error') console.error(msg);
}

function clearMessage() { els.message.textContent = ''; els.message.className = ''; }

function renderStudents(list) {
    const tbody = els.studentsTbody;
    tbody.innerHTML = '';

    list.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.age}</td>
      <td>${s.group}</td>
      <td>
        <button data-action="edit" data-id="${s.id}">Edit</button>
        <button data-action="delete" data-id="${s.id}">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function loadAndRender() {
    try {
        clearMessage();

        const data = await API.getStudents();

        renderStudents(data);

        const avg = await API.avgAge();
        els.avg.textContent = isFinite(avg.averageAge) ? avg.averageAge.toFixed(2) : '0';
    } catch (err) {
        showMessage('Failed to load students', 'error');
    }
}

function init() {
    els.form = qs('#addForm');
    els.name = qs('#name');
    els.age = qs('#age');
    els.group = qs('#group');
    els.studentsTbody = qs('#students tbody');
    els.message = qs('#message');
    els.avg = qs('#avg');
    els.groupFilter = qs('#groupFilter');
    els.groupBtn = qs('#groupBtn');
    els.saveBtn = qs('#saveBtn');
    els.loadBtn = qs('#loadBtn');
    els.backStart = qs('#backupStart');
    els.backStop = qs('#backupStop');
    els.backStatus = qs('#backupStatus');

    els.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const s = {
            name: els.name.value.trim(),
            age: Number(els.age.value),
            group: els.group.value
        };

        if (!s.name || !s.age || !s.group) {
            showMessage('Fill all fields', 'error');

            return;
        }

        try {
            await API.addStudent(s);

            showMessage('Student added');
            els.form.reset();
            loadAndRender();
        } catch (err) {
            showMessage('Failed to add student', 'error');
        }
    });

    els.studentsTbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (action === 'delete') {
            if (!confirm('Delete student?')) return;

            try {
                await API.deleteStudent(id);

                showMessage('Deleted');
                loadAndRender();
            } catch {
                showMessage('Delete failed', 'error');
            }
        }
        if (action === 'edit') {
            try {
                const s = await API.getStudent(id);
                const name = prompt('Name', s.name);
                const age = prompt('Age', s.age);
                const group = prompt('Group', s.group);

                if (name === null) return;

                await API.updateStudent(id, { name, age: Number(age), group });

                showMessage('Updated');
                loadAndRender();
            } catch (r) {
                showMessage('Update failed', 'error');
            }
        }
    });

    els.groupBtn.addEventListener('click', async () => {
        const g = els.groupFilter.value.trim();

        if (!g) {
            loadAndRender(); return;
        }
        try {
            const list = await API.getByGroup(g);

            renderStudents(list);
            showMessage(`Filtered by group ${g}`);
        } catch (err) {
            showMessage('Group query failed', 'error');
        }
    });

    els.saveBtn.addEventListener('click', async () => {
        try {
            await API.save();

            showMessage('Saved to file');
        } catch {
            showMessage('Save failed', 'error');
        }
    });
    els.loadBtn.addEventListener('click', async () => {
        try {
            await API.load();

            showMessage('Loaded from file');
            loadAndRender();
        } catch {
            showMessage('Load failed', 'error');
        }
    });

    els.backStart.addEventListener('click', async () => {
        try {
            await API.backupStart();

            showMessage('Backup started');
        } catch {
            showMessage('Start failed', 'error');
        }
    });
    els.backStop.addEventListener('click', async () => {
        try {
            await API.backupStop();

            showMessage('Backup stopped');
        } catch {
            showMessage('Stop failed', 'error');
        }
    });
    els.backStatus.addEventListener('click', async () => {
        try {
            const s = await API.backupStatus();

            showMessage(`Backup running: ${s.running}`);
        } catch {
            showMessage('Status failed', 'error');
        }
    });

    loadAndRender();
}

window.addEventListener('DOMContentLoaded', init);
