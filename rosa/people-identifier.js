// Sistema de identificación de personas
let people = [];
let loadedPhotos = [];
let photoAssignments = {};
let currentPhotoId = null;

// Cargar datos guardados al iniciar
document.addEventListener('DOMContentLoaded', function () {
    loadSavedData();
    updateAllStats();
    renderPeople();

    // Configurar carga de fotos
    document.getElementById('photoUpload').addEventListener('change', handlePhotoUpload);
});

// Manejar carga de fotos
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const photo = {
                id: Date.now() + index,
                file: file.name,
                dataUrl: e.target.result,
                people: []
            };
            loadedPhotos.push(photo);
            updateAllStats();
            renderPhotos();
            saveData();
        };
        reader.readAsDataURL(file);
    });

    setTimeout(() => {
        alert(`✅ Se cargaron ${files.length} fotos correctamente!\n\n` +
            `Ahora puedes:\n` +
            `1. Añadir personas (nombres y relaciones)\n` +
            `2. Ir al Paso 2 para asignar personas a cada foto`);
    }, 1000);
}

// Cambiar entre tabs
function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // Mostrar tab seleccionado
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');

    // Renderizar contenido según tab
    if (tabName === 'photos') {
        renderPhotos();
    }
}

// Mostrar modal para añadir persona
function showAddPersonModal() {
    document.getElementById('addPersonModal').classList.add('active');
    document.getElementById('personName').value = '';
    document.getElementById('personRelation').value = '';
    document.getElementById('personName').focus();
}

// Cerrar modal de añadir persona
function closeAddPersonModal() {
    document.getElementById('addPersonModal').classList.remove('active');
}

// Guardar nueva persona
function savePerson() {
    const name = document.getElementById('personName').value.trim();
    const relation = document.getElementById('personRelation').value.trim();

    if (!name || !relation) {
        alert('⚠️ Por favor completa nombre y relación');
        return;
    }

    const person = {
        id: Date.now(),
        name: name,
        relation: relation,
        photoCount: 0
    };

    people.push(person);
    renderPeople();
    updateAllStats();
    closeAddPersonModal();
    saveData();

    alert(`✅ Persona añadida: ${name} (${relation})\n\n` +
        `Total de personas: ${people.length}`);
}

// Renderizar lista de personas
function renderPeople() {
    const list = document.getElementById('peopleList');
    list.innerHTML = '';

    people.forEach(person => {
        const card = document.createElement('div');
        card.className = 'person-card';
        card.innerHTML = `
            <div class="person-name">${person.name}</div>
            <div class="person-relation">${person.relation}</div>
            <div class="person-count">${person.photoCount} fotos</div>
            <button onclick="deletePerson(${person.id})" style="margin-top: 10px; padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                🗑️ Eliminar
            </button>
        `;
        list.appendChild(card);
    });
}

// Eliminar persona
function deletePerson(id) {
    if (!confirm('¿Seguro que quieres eliminar esta persona?')) return;

    people = people.filter(p => p.id !== id);

    // Eliminar de todas las fotos
    Object.keys(photoAssignments).forEach(photoId => {
        photoAssignments[photoId] = photoAssignments[photoId].filter(pId => pId !== id);
    });

    renderPeople();
    renderPhotos();
    updateAllStats();
    saveData();
}

// Renderizar grid de fotos
function renderPhotos() {
    const grid = document.getElementById('photoGrid');
    grid.innerHTML = '';

    loadedPhotos.forEach(photo => {
        const assigned = photoAssignments[photo.id] || [];
        const peopleNames = assigned.map(pId => {
            const person = people.find(p => p.id === pId);
            return person ? person.name : '';
        }).filter(n => n).join(', ');

        const item = document.createElement('div');
        item.className = 'photo-item' + (assigned.length > 0 ? ' identified' : '');
        item.onclick = () => showAssignPhotoModal(photo.id);

        item.innerHTML = `
            <img src="${photo.dataUrl}" class="photo-img" alt="${photo.file}">
            <div class="photo-info">
                <div class="photo-date">${photo.file}</div>
                <div class="photo-people">
                    ${peopleNames || 'Click para asignar personas'}
                </div>
            </div>
        `;

        grid.appendChild(item);
    });
}

// Mostrar modal para asignar personas a foto
function showAssignPhotoModal(photoId) {
    currentPhotoId = photoId;
    const photo = loadedPhotos.find(p => p.id === photoId);

    if (!people.length) {
        alert('⚠️ Primero añade personas en el Paso 1');
        switchTab('people');
        return;
    }

    document.getElementById('currentPhotoInfo').textContent = `Foto: ${photo.file}`;

    const selector = document.getElementById('personSelector');
    selector.innerHTML = '';

    const assigned = photoAssignments[photoId] || [];

    people.forEach(person => {
        const tag = document.createElement('div');
        tag.className = 'person-tag' + (assigned.includes(person.id) ? ' selected' : '');
        tag.textContent = person.name;
        tag.onclick = () => togglePersonSelection(person.id);
        selector.appendChild(tag);
    });

    document.getElementById('assignPhotoModal').classList.add('active');
}

// Cerrar modal de asignación
function closeAssignPhotoModal() {
    document.getElementById('assignPhotoModal').classList.remove('active');
    currentPhotoId = null;
}

// Toggle selección de persona
function togglePersonSelection(personId) {
    const tags = document.querySelectorAll('.person-tag');
    const clickedTag = Array.from(tags).find(t => t.textContent === people.find(p => p.id === personId).name);

    if (clickedTag.classList.contains('selected')) {
        clickedTag.classList.remove('selected');
    } else {
        clickedTag.classList.add('selected');
    }
}

// Guardar asignación de foto
function savePhotoAssignment() {
    const selectedPeople = [];
    const tags = document.querySelectorAll('.person-tag.selected');

    tags.forEach(tag => {
        const person = people.find(p => p.name === tag.textContent);
        if (person) selectedPeople.push(person.id);
    });

    photoAssignments[currentPhotoId] = selectedPeople;

    // Actualizar contadores de personas
    people.forEach(person => {
        person.photoCount = Object.values(photoAssignments).filter(arr => arr.includes(person.id)).length;
    });

    renderPeople();
    renderPhotos();
    updateAllStats();
    closeAssignPhotoModal();
    saveData();
}

// Actualizar estadísticas
function updateAllStats() {
    document.getElementById('loadedPhotosCount').textContent = loadedPhotos.length;
    document.getElementById('peopleCount').textContent = people.length;

    const identifiedCount = Object.keys(photoAssignments).filter(
        photoId => photoAssignments[photoId].length > 0
    ).length;

    document.getElementById('identifiedPhotosCount').textContent = identifiedCount;
    document.getElementById('totalPhotosTab2').textContent = loadedPhotos.length;
    document.getElementById('assignedPhotos').textContent = identifiedCount;
}

// Guardar datos en localStorage
function saveData() {
    const data = {
        people: people,
        loadedPhotos: loadedPhotos,
        photoAssignments: photoAssignments
    };
    localStorage.setItem('peopleIdentifierData', JSON.stringify(data));
    console.log('✅ Datos guardados');
}

// Cargar datos guardados
function loadSavedData() {
    const saved = localStorage.getItem('peopleIdentifierData');
    if (saved) {
        const data = JSON.parse(saved);
        people = data.people || [];
        loadedPhotos = data.loadedPhotos || [];
        photoAssignments = data.photoAssignments || {};
        console.log('✅ Datos cargados');
    }
}

// Abrir app principal
function openMainApp() {
    // Exportar personas al formato del organizador principal
    const peopleData = {};

    people.forEach(person => {
        peopleData[person.id] = {
            name: person.name,
            relation: person.relation
        };
    });

    // Exportar asignaciones
    const photoData = {};

    loadedPhotos.forEach(photo => {
        const assigned = photoAssignments[photo.id] || [];
        const peopleNames = assigned.map(pId => {
            const person = people.find(p => p.id === pId);
            return person ? `${person.name} (${person.relation})` : '';
        }).filter(n => n).join(', ');

        photoData[photo.file] = {
            people: peopleNames,
            dataUrl: photo.dataUrl
        };
    });

    // Guardar para app principal
    localStorage.setItem('identifiedPeople', JSON.stringify(peopleData));
    localStorage.setItem('photoAssignmentsData', JSON.stringify(photoData));

    alert('✅ Datos exportados!\n\n' +
        `Se identificaron:\n` +
        `• ${people.length} personas\n` +
        `• ${Object.keys(photoAssignments).filter(k => photoAssignments[k].length > 0).length} fotos con personas asignadas\n\n` +
        `Ahora abre "photo-organizer.html" para completar el resto.`);

    // Abrir app principal
    window.open('photo-organizer.html', '_blank');
}
