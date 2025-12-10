// Aplicación de organización de fotos
let photos = [];
let selectedCount = 0;
let completedCount = 0;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
    loadPhotos();
    loadSavedProgress();
    renderPhotos();
    updateStats();
});

// Cargar fotos desde photo-data.js
function loadPhotos() {
    photos = photoData.map(photo => ({
        ...photo,
        selected: false,
        people: '',
        location: 'Casa familiar, 5553 Walnut Blossom Dr, San Jose, CA',
        event: photo.suggested || '',
        description: '',
        completed: false
    }));
}

// Renderizar fotos en la interfaz
function renderPhotos(filter = 'all') {
    const grid = document.getElementById('photoGrid');
    grid.innerHTML = '';

    let currentYear = null;

    photos.forEach(photo => {
        // Aplicar filtros
        if (filter === 'selected' && !photo.selected) return;
        if (filter === 'completed' && !photo.completed) return;
        if (filter === '2019' && photo.year !== 2019) return;
        if (filter === '2020' && photo.year !== 2020) return;
        if (filter === '2021' && photo.year !== 2021) return;

        // Añadir encabezado de año
        if (photo.year !== currentYear) {
            const yearSection = document.createElement('div');
            yearSection.className = 'year-section';
            yearSection.style.gridColumn = '1 / -1';
            yearSection.innerHTML = `<div class="year-header">AÑO ${photo.year}</div>`;
            grid.appendChild(yearSection);
            currentYear = photo.year;
        }

        const card = createPhotoCard(photo);
        grid.appendChild(card);
    });
}

// Crear tarjeta de foto
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    if (photo.selected) card.classList.add('selected');
    if (photo.completed) card.classList.add('completed');

    card.innerHTML = `
        <div class="photo-header">
            <span class="photo-number">Foto #${photo.id}</span>
            <input type="checkbox" class="select-checkbox" 
                   ${photo.selected ? 'checked' : ''} 
                   onchange="toggleSelect(${photo.id})">
        </div>
        <div class="photo-body">
            <div class="field-group">
                <label class="field-label">📅 Fecha</label>
                <div class="field-value">${photo.date} (${photo.day})</div>
            </div>
            
            <div class="field-group">
                <label class="field-label">📂 Archivo</label>
                <div class="field-value">${photo.file}</div>
            </div>
            
            <div class="field-group">
                <label class="field-label">💡 Sugerencia de Evento</label>
                <div class="field-value">${photo.suggested}</div>
            </div>
            
            <div class="field-group">
                <label class="field-label">👥 Personas en la Foto (TÚ COMPLETAS)</label>
                <input type="text" 
                       class="field-input" 
                       placeholder="Ej: Alex, Olivia (madre), Carlos (padrastro), Stefanny (hermana)"
                       value="${photo.people}"
                       onchange="updatePhoto(${photo.id}, 'people', this.value)">
            </div>
            
            <div class="field-group">
                <label class="field-label">📍 Lugar</label>
                <input type="text" 
                       class="field-input" 
                       value="${photo.location}"
                       onchange="updatePhoto(${photo.id}, 'location', this.value)">
            </div>
            
            <div class="field-group">
                <label class="field-label">🎯 Evento/Actividad</label>
                <input type="text" 
                       class="field-input" 
                       placeholder="Describe el evento o actividad"
                       value="${photo.event}"
                       onchange="updatePhoto(${photo.id}, 'event', this.value)">
            </div>
            
            <div class="field-group">
                <label class="field-label">📝 Descripción Detallada</label>
                <textarea class="field-input field-textarea" 
                          placeholder="Describe por qué esta foto es importante para el caso I-601A..."
                          onchange="updatePhoto(${photo.id}, 'description', this.value)">${photo.description}</textarea>
            </div>
        </div>
    `;

    return card;
}

// Alternar selección de foto
function toggleSelect(id) {
    const photo = photos.find(p => p.id === id);
    photo.selected = !photo.selected;
    checkIfCompleted(photo);
    updateStats();
    renderPhotos();
    saveProgress();
}

// Actualizar datos de foto
function updatePhoto(id, field, value) {
    const photo = photos.find(p => p.id === id);
    photo[field] = value;
    checkIfCompleted(photo);
    updateStats();
    saveProgress();
}

// Verificar si foto está completa
function checkIfCompleted(photo) {
    photo.completed = photo.selected &&
        photo.people.trim() !== '' &&
        photo.location.trim() !== '' &&
        photo.event.trim() !== '' &&
        photo.description.trim() !== '';
}

// Actualizar estadísticas
function updateStats() {
    selectedCount = photos.filter(p => p.selected).length;
    completedCount = photos.filter(p => p.completed).length;

    document.getElementById('selectedPhotos').textContent = selectedCount;
    document.getElementById('completedPhotos').textContent = completedCount;

    const progress = (completedCount / 25) * 100; // Target: 25 fotos
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = Math.min(progress, 100) + '%';
    progressBar.textContent = Math.round(progress) + '%';
}

// Seleccionar fotos recomendadas
function selectRecommended() {
    photos.forEach(photo => {
        if (photo.recommended) {
            photo.selected = true;
        }
    });
    updateStats();
    renderPhotos();
    saveProgress();
    alert('✅ Se han seleccionado 25 fotos recomendadas para el caso I-601A.\n\n' +
        'Ahora completa la información de cada foto:\n' +
        '• Quiénes aparecen\n' +
        '• Verifica el lugar\n' +
        '• Ajusta la descripción si es necesario');
}

// Guardar progreso en localStorage
function saveProgress() {
    localStorage.setItem('photoProgress', JSON.stringify(photos));
    console.log('✅ Progreso guardado');
}

// Cargar progreso guardado
function loadSavedProgress() {
    const saved = localStorage.getItem('photoProgress');
    if (saved) {
        const savedPhotos = JSON.parse(saved);
        savedPhotos.forEach(savedPhoto => {
            const photo = photos.find(p => p.id === savedPhoto.id);
            if (photo) {
                Object.assign(photo, savedPhoto);
            }
        });
        console.log('✅ Progreso cargado');
    }
}

// Filtrar fotos
function filterPhotos(filter) {
    renderPhotos(filter);
}

// Exportar datos para USCIS
function exportData() {
    const selectedPhotos = photos.filter(p => p.selected);

    if (selectedPhotos.length < 20 || selectedPhotos.length > 30) {
        alert('⚠️ Debes seleccionar entre 20 y 30 fotos.\n\n' +
            'Actualmente tienes: ' + selectedPhotos.length + ' fotos seleccionadas');
        return;
    }

    const incomplete = selectedPhotos.filter(p => !p.completed);
    if (incomplete.length > 0) {
        if (!confirm('⚠️ Tienes ' + incomplete.length + ' fotos seleccionadas sin completar.\n\n' +
            '¿Deseas exportar de todos modos?')) {
            return;
        }
    }

    // Generar documento markdown
    let markdown = '# DOCUMENTACIÓN FOTOGRÁFICA PARA CASO I-601A\n';
    markdown += '## ALEX GIOVANNI ESPINOSA MORALES\n\n';
    markdown += `**Fecha de Generación:** ${new Date().toLocaleDateString('es-ES')}\n`;
    markdown += `**Total de Fotos Seleccionadas:** ${selectedPhotos.length}\n`;
    markdown += `**Período:** 2019-2021\n\n`;
    markdown += '---\n\n';

    let currentYear = null;
    selectedPhotos.forEach((photo, index) => {
        if (photo.year !== currentYear) {
            markdown += `\n## AÑO ${photo.year}\n\n`;
            currentYear = photo.year;
        }

        markdown += `### Foto ${index + 1} de ${selectedPhotos.length}\n\n`;
        markdown += `**Archivo:** ${photo.file}\n\n`;
        markdown += `**Fecha:** ${photo.date} (${photo.day})\n\n`;
        markdown += `**Personas en la Foto:** ${photo.people}\n\n`;
        markdown += `**Lugar:** ${photo.location}\n\n`;
        markdown += `**Evento/Actividad:** ${photo.event}\n\n`;
        markdown += `**Descripción:**\n${photo.description}\n\n`;
        markdown += `**Importancia para el Caso:** Esta fotografía demuestra la unidad familiar y el rol de Alex como miembro integral de la familia establecida en Estados Unidos.\n\n`;
        markdown += '---\n\n';
    });

    // Descargar archivo
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FOTOS_I601A_ALEX_ESPINOSA.md';
    a.click();
    URL.revokeObjectURL(url);

    alert('✅ Documento exportado exitosamente!\n\n' +
        'El archivo "FOTOS_I601A_ALEX_ESPINOSA.md" contiene:\n' +
        '• ' + selectedPhotos.length + ' fotos documentadas\n' +
        '• Información completa de cada foto\n' +
        '• Formato listo para incluir en solicitud I-601A\n\n' +
        'Revisa el archivo descargado y compártelo con tu abogada.');
}
