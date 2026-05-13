// ==================== SWITCH TAB ====================
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));

    // Show selected tab
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.closest('.sidebar-item').classList.add('active');

    // Update stats if stats tab
    if (tabName === 'stats') {
        updateStats();
    }

    // Load events if events tab
    if (tabName === 'events') {
        loadCreatorEvents();
    }
}

// ==================== PREVIEW IMAGE ====================
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Le fichier est trop volumineux. Maximum 5MB.');
            event.target.value = '';
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            const placeholder = document.querySelector('.upload-placeholder');
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// ==================== SUBMIT EVENT ====================
function submitEvent(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('event-form'));
    
    // Validate prices
    const priceMin = parseInt(formData.get('event_price_min'));
    const priceMax = parseInt(formData.get('event_price_max'));
    
    if (priceMax < priceMin) {
        alert('Le prix maximum doit être supérieur ou égal au prix minimum');
        return;
    }

    // Create event object
    const newEvent = {
        id_evenement: Date.now(),
        titre: formData.get('event_title'),
        categorie: formData.get('event_category'),
        date_evenement: formData.get('event_date'),
        heure: formData.get('event_time'),
        nom_ville: formData.get('event_city'),
        lieu_precis: formData.get('event_location'),
        prix_min: priceMin,
        prix_max: priceMax,
        capacite: parseInt(formData.get('event_capacity')),
        description: formData.get('event_description'),
        organisateur: formData.get('event_organizer'),
        contact: formData.get('event_contact'),
        parking: formData.get('event_parking'),
        regles: formData.get('event_rules') || 'Conditions d\'accès standard',
        image_url: 'event-' + Date.now() + '.jpg',
        creator_id: JSON.parse(sessionStorage.getItem('currentUser') || '{}').id || 'creator_001',
        created_at: new Date().toISOString(),
        image_data: document.getElementById('image-preview').src || null
    };

    // Save to localStorage
    let creatorEvents = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    creatorEvents.push(newEvent);
    localStorage.setItem('creatorEvents', JSON.stringify(creatorEvents));

    // Add to main events (for display on index)
    let allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    allEvents.push(newEvent);
    localStorage.setItem('events', JSON.stringify(allEvents));

    // Show success message
    showSuccessMessage('Événement créé avec succès! 🎉');

    // Reset form
    resetForm();

    // Switch to events tab
    setTimeout(() => {
        switchTab('events');
    }, 1000);
}

// ==================== RESET FORM ====================
function resetForm() {
    document.getElementById('event-form').reset();
    document.getElementById('image-preview').style.display = 'none';
    document.querySelector('.upload-placeholder').style.display = 'flex';
}

// ==================== LOAD CREATOR EVENTS ====================
function loadCreatorEvents() {
    const container = document.getElementById('events-list-container');
    const events = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    // Filter events by creator
    const userEvents = events.filter(e => e.creator_id === (currentUser.id || 'creator_001'));

    if (userEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-calendar-plus"></i>
                </div>
                <h3 class="empty-state-title">Aucun événement créé</h3>
                <p class="empty-state-text">Vous n'avez pas encore créé d'événement. Commencez par créer votre premier événement!</p>
                <button class="btn-submit" onclick="switchTab('create')">
                    <i class="fas fa-plus"></i> Créer un Événement
                </button>
            </div>
        `;
        return;
    }

    let html = '<div class="events-list">';
    
    userEvents.forEach(event => {
        const eventDate = new Date(event.date_evenement);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });

        const isUpcoming = new Date(event.date_evenement) > new Date();
        const statusBadge = isUpcoming 
            ? '<span style="color: #4CAF50; font-weight: 600;">📅 À venir</span>'
            : '<span style="color: var(--accent-primary); font-weight: 600;">✓ Terminé</span>';

        html += `
            <div class="event-card">
                <img src="${event.image_data || 'src/image/placeholder.jpg'}" alt="${event.titre}" class="event-card-image">
                <div class="event-card-info">
                    <h3>${event.titre}</h3>
                    <div class="event-card-meta">
                        <div class="event-card-meta-item">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-clock"></i>
                            ${event.heure}
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.nom_ville}
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-tag"></i>
                            ${event.categorie}
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-money-bill"></i>
                            ${event.prix_min} - ${event.prix_max} DH
                        </div>
                    </div>
                    <div style="margin-top: 12px;">
                        ${statusBadge}
                    </div>
                </div>
                <div class="event-card-actions">
                    <button class="btn-action btn-view" onclick="viewEvent(${event.id_evenement})">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                    <button class="btn-action btn-edit" onclick="editEvent(${event.id_evenement})">
                        <i class="fas fa-edit"></i> Éditer
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteEvent(${event.id_evenement})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// ==================== DELETE EVENT ====================
function deleteEvent(eventId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
        return;
    }

    let events = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    events = events.filter(e => e.id_evenement !== eventId);
    localStorage.setItem('creatorEvents', JSON.stringify(events));

    // Also remove from main events
    let allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    allEvents = allEvents.filter(e => e.id_evenement !== eventId);
    localStorage.setItem('events', JSON.stringify(allEvents));

    showSuccessMessage('Événement supprimé avec succès');
    loadCreatorEvents();
}

// ==================== EDIT EVENT ====================
function editEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    const event = events.find(e => e.id_evenement === eventId);

    if (!event) return;

    // Populate form with event data
    document.getElementById('event_title').value = event.titre;
    document.getElementById('event_category').value = event.categorie;
    document.getElementById('event_date').value = event.date_evenement;
    document.getElementById('event_time').value = event.heure;
    document.getElementById('event_city').value = event.nom_ville;
    document.getElementById('event_location').value = event.lieu_precis;
    document.getElementById('event_price_min').value = event.prix_min;
    document.getElementById('event_price_max').value = event.prix_max;
    document.getElementById('event_capacity').value = event.capacite;
    document.getElementById('event_description').value = event.description;
    document.getElementById('event_organizer').value = event.organisateur;
    document.getElementById('event_contact').value = event.contact;
    document.getElementById('event_parking').value = event.parking;
    document.getElementById('event_rules').value = event.regles;

    if (event.image_data) {
        const preview = document.getElementById('image-preview');
        preview.src = event.image_data;
        preview.style.display = 'block';
        document.querySelector('.upload-placeholder').style.display = 'none';
    }

    // Scroll to form
    document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' });

    // Change form submission to update mode
    const form = document.getElementById('event-form');
    form.onsubmit = (e) => updateEvent(e, eventId);

    // Show update button text
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Mettre à Jour l\'Événement';
}

// ==================== UPDATE EVENT ====================
function updateEvent(event, eventId) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('event-form'));
    
    let events = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    const eventIndex = events.findIndex(e => e.id_evenement === eventId);

    if (eventIndex > -1) {
        events[eventIndex] = {
            ...events[eventIndex],
            titre: formData.get('event_title'),
            categorie: formData.get('event_category'),
            date_evenement: formData.get('event_date'),
            heure: formData.get('event_time'),
            nom_ville: formData.get('event_city'),
            lieu_precis: formData.get('event_location'),
            prix_min: parseInt(formData.get('event_price_min')),
            prix_max: parseInt(formData.get('event_price_max')),
            capacite: parseInt(formData.get('event_capacity')),
            description: formData.get('event_description'),
            organisateur: formData.get('event_organizer'),
            contact: formData.get('event_contact'),
            parking: formData.get('event_parking'),
            regles: formData.get('event_rules'),
            image_data: document.getElementById('image-preview').src || events[eventIndex].image_data
        };

        localStorage.setItem('creatorEvents', JSON.stringify(events));

        // Update in main events
        let allEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const mainEventIndex = allEvents.findIndex(e => e.id_evenement === eventId);
        if (mainEventIndex > -1) {
            allEvents[mainEventIndex] = events[eventIndex];
            localStorage.setItem('events', JSON.stringify(allEvents));
        }

        showSuccessMessage('Événement mis à jour avec succès!');
        resetForm();
        
        // Reset form submission
        const form = document.getElementById('event-form');
        form.onsubmit = (e) => submitEvent(e);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Publier l\'Événement';

        setTimeout(() => {
            switchTab('events');
        }, 1000);
    }
}

// ==================== VIEW EVENT ====================
function viewEvent(eventId) {
    window.location.href = `event-detail.html?id=${eventId}`;
}

// ==================== UPDATE STATS ====================
function updateStats() {
    const events = JSON.parse(localStorage.getItem('creatorEvents') || '[]');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    // Filter events by creator
    const userEvents = events.filter(e => e.creator_id === (currentUser.id || 'creator_001'));

    // Count total events
    document.getElementById('stat-total-events').textContent = userEvents.length;

    // Count upcoming and past events
    const now = new Date();
    const upcomingEvents = userEvents.filter(e => new Date(e.date_evenement) > now);
    
    document.getElementById('stat-successful-events').textContent = userEvents.length - upcomingEvents.length;

    // Calculate total revenue (mock data: based on price range)
    let totalRevenue = 0;
    userEvents.forEach(event => {
        const avgPrice = (event.prix_min + event.prix_max) / 2;
        // Mock: assume 50% capacity sold
        const ticketsSold = Math.floor(event.capacite * 0.5);
        totalRevenue += avgPrice * ticketsSold;
    });

    document.getElementById('stat-revenue').textContent = totalRevenue.toLocaleString('fr-FR') + ' DH';

    // Calculate total tickets (mock)
    let totalTickets = 0;
    userEvents.forEach(event => {
        totalTickets += Math.floor(event.capacite * 0.5);
    });

    document.getElementById('stat-total-tickets').textContent = totalTickets;
}

// ==================== SHOW SUCCESS MESSAGE ====================
function showSuccessMessage(message) {
    const container = document.getElementById('tab-create');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// ==================== IMAGE UPLOAD DRAG & DROP ====================
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('image-upload-area');
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            document.getElementById('event-image').click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--accent-primary)';
            uploadArea.style.background = 'rgba(255, 59, 59, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(255, 59, 59, 0.3)';
            uploadArea.style.background = 'rgba(0, 0, 0, 0.2)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(255, 59, 59, 0.3)';
            uploadArea.style.background = 'rgba(0, 0, 0, 0.2)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('event-image').files = files;
                previewImage({ target: { files: files } });
            }
        });
    }
});
