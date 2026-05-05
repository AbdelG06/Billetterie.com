// ==================== API BASE URL ====================
const API_BASE = 'src/api';

// ==================== STATE ====================
let allEvents = [];
let allCities = [];
let allCategories = [];

// ==================== SPLASH SCREEN SETUP ====================
function setupSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    
    if (splashScreen) {
        // Add blur effect to body
        document.body.classList.add('splash-active');
        
        // Auto-hide splash screen after 3 seconds
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            splashScreen.style.pointerEvents = 'none';
            // Remove blur effect from body
            document.body.classList.remove('splash-active');
        }, 3000);
    }
}

// ==================== HERO CTA BUTTON SETUP ====================
function setupHeroCtaButton() {
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => {
            // Scroll to events section smoothly
            const eventsSection = document.querySelector('.events-section');
            if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    setupSplashScreen();
    loadCities();
    loadCategories();
    loadEvents();
    setupEventListeners();
    setupHamburgerMenu();
    setupHeroCtaButton();
});

// ==================== LOAD CITIES ====================
async function loadCities() {
    try {
        // Charger depuis events.json et extraire les villes uniques
        const response = await fetch('events.json');
        const events = await response.json();
        
        // Extraire les villes uniques
        const cities = [...new Set(events.map(e => ({ id_ville: e.nom_ville, nom_ville: e.nom_ville })))];
        
        // Créer les données avec IDs
        allCities = Array.from(new Set(events.map(e => e.nom_ville))).map((ville, idx) => ({
            id_ville: idx + 1,
            nom_ville: ville
        }));
        
        populateCityFilter();
    } catch (error) {
        console.error('Erreur chargement villes:', error);
        // Fallback: créer une liste vide mais ne pas bloquer
        allCities = [];
    }
}

// ==================== LOAD CATEGORIES ====================
async function loadCategories() {
    try {
        // Charger depuis events.json et extraire les catégories uniques
        const response = await fetch('events.json');
        const events = await response.json();
        
        // Extraire les catégories uniques
        allCategories = Array.from(new Set(events.map(e => e.categorie))).map((cat, idx) => ({
            id_categorie: idx + 1,
            nom: cat
        }));
        
        populateCategoryFilter();
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
        allCategories = [];
    }
}

// ==================== LOAD EVENTS ====================
async function loadEvents(filters = {}) {
    try {
        // Charger depuis le fichier JSON local
        const response = await fetch('events.json');
        const events = await response.json();
        
        // Appliquer les filtres si présents
        let filtered = events;
        
        if (filters.id_ville) {
            filtered = filtered.filter(e => 
                allCities.find(c => c.id_ville == filters.id_ville)?.nom_ville === e.nom_ville
            );
        }
        
        if (filters.id_categorie) {
            filtered = filtered.filter(e => 
                allCategories.find(c => c.id_categorie == filters.id_categorie)?.nom === e.categorie
            );
        }
        
        allEvents = filtered;
        
        if (filtered.length > 0) {
            displayEvents(filtered);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Erreur chargement événements:', error);
        showNoResults();
    }
}

// ==================== POPULATE FILTERS ====================
function populateCityFilter() {
    const container = document.getElementById('cities-chips');
    
    // Ajouter chip "Toutes"
    const allChip = document.createElement('button');
    allChip.className = 'chip active';
    allChip.textContent = 'Toutes les villes';
    allChip.type = 'button';
    allChip.dataset.city = '';
    allChip.addEventListener('click', () => selectCityFilter(''));
    container.appendChild(allChip);
    
    allCities.forEach(city => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = city.nom_ville;
        chip.type = 'button';
        chip.dataset.city = city.id_ville;
        chip.addEventListener('click', () => selectCityFilter(city.id_ville));
        container.appendChild(chip);
    });
}

function populateCategoryFilter() {
    const container = document.getElementById('categories-chips');
    
    // Ajouter chip "Tous"
    const allChip = document.createElement('button');
    allChip.className = 'chip active';
    allChip.textContent = 'Toutes les catégories';
    allChip.type = 'button';
    allChip.dataset.category = '';
    allChip.addEventListener('click', () => selectCategoryFilter(''));
    container.appendChild(allChip);
    
    allCategories.forEach(category => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = category.nom;
        chip.type = 'button';
        chip.dataset.category = category.id_categorie;
        chip.addEventListener('click', () => selectCategoryFilter(category.id_categorie));
        container.appendChild(chip);
    });
}

// Track current filter state
let currentCityFilter = '';
let currentCategoryFilter = '';

function selectCityFilter(cityId) {
    currentCityFilter = cityId;
    
    // Update chip states
    document.querySelectorAll('#cities-chips .chip').forEach(chip => {
        if (chip.dataset.city === cityId) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    applyFilters();
}

function selectCategoryFilter(categoryId) {
    currentCategoryFilter = categoryId;
    
    // Update chip states
    document.querySelectorAll('#categories-chips .chip').forEach(chip => {
        if (chip.dataset.category === categoryId) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    applyFilters();
}

// ==================== DISPLAY EVENTS ====================
function displayEvents(events) {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = '';

    if (events.length === 0) {
        showNoResults();
        return;
    }

    events.forEach(event => {
        const card = createEventCard(event);
        grid.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Image ou placeholder
    let imageHTML = '';
    if (event.image_url && event.image_url !== 'NULL') {
        imageHTML = `<img src="/images/${event.image_url}" alt="${event.titre}" class="event-image" onerror="this.parentElement.innerHTML='<div class=\\'event-placeholder\\'><i class=\\'fas fa-theater-masks\\'></i></div>'">`;
    } else {
        imageHTML = `<div class="event-placeholder"><i class="fas fa-theater-masks"></i></div>`;
    }

    // Format date
    const eventDate = new Date(event.date_evenement);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    card.innerHTML = `
        ${imageHTML}
        <div class="event-content">
            <span class="event-category">${event.categorie}</span>
            <h3 class="event-title">${event.titre}</h3>
            <div class="event-meta">
                <div class="event-meta-item"><i class="fas fa-calendar-alt"></i><span>${formattedDate}</span></div>
                <div class="event-meta-item"><i class="fas fa-map-marker-alt"></i><span>${event.nom_ville}</span></div>
            </div>
            <span class="event-price">À partir de ${event.prix_min}DH</span>
            <a href="event-detail.html?id=${event.id_evenement}" class="event-btn"><i class="fas fa-arrow-right"></i> Détails</a>
        </div>
    `;

    return card;
}

// ==================== NO RESULTS ====================
function showNoResults() {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = `
        <div class="loading-state">
            <p style="color: var(--text-secondary);">Aucun événement trouvé</p>
        </div>
    `;
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    const btnReset = document.getElementById('reset-filters');
    const modalCloseBtn = document.getElementById('modal-close');
    const modal = document.getElementById('event-modal');

    if (btnReset) {
        btnReset.addEventListener('click', resetFilters);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeEventModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEventModal();
            }
        });
    }
}

// ==================== APPLY FILTERS ====================
function applyFilters() {
    const filters = {};
    
    if (currentCityFilter) {
        filters.id_ville = currentCityFilter;
    }
    
    if (currentCategoryFilter) {
        filters.id_categorie = currentCategoryFilter;
    }

    loadEvents(filters);
}

// ==================== RESET FILTERS ====================
function resetFilters() {
    currentCityFilter = '';
    currentCategoryFilter = '';
    
    // Reset all chips to inactive, first one active
    document.querySelectorAll('#cities-chips .chip').forEach((chip, idx) => {
        if (idx === 0) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    document.querySelectorAll('#categories-chips .chip').forEach((chip, idx) => {
        if (idx === 0) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    loadEvents();
}

// ==================== OPEN EVENT DETAILS ====================
async function openEventDetails(eventId) {
    try {
        const response = await fetch(`${API_BASE}/get_event_details.php?id=${eventId}`);
        const data = await response.json();

        if (data.success) {
            const event = data.event;
            const tickets = data.tickets;
            displayEventModal(event, tickets);
        }
    } catch (error) {
        console.error('Erreur chargement détails:', error);
    }
}

// ==================== DISPLAY EVENT MODAL ====================
function displayEventModal(event, tickets) {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');

    const eventDate = new Date(event.date_evenement);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let imageHTML = '';
    if (event.image_url && event.image_url !== 'NULL') {
        imageHTML = `<img src="/images/${event.image_url}" alt="${event.titre}" class="modal-event-image" style="width: 100%; height: 300px; object-fit: cover; border-radius: 16px; margin: 20px 0;" onerror="this.style.display='none'">`;
    }

    let ticketsHTML = '';
    if (tickets && tickets.length > 0) {
        ticketsHTML = `
            <div class="tickets-section">
                <h3><i class="fas fa-tag"></i> Tarifs disponibles</h3>
                ${tickets.map(ticket => `
                    <div class="ticket-option">
                        <div class="ticket-info">
                            <h4><i class="fas fa-ticket-alt"></i> ${ticket.libelle_tarif}</h4>
                            <p><i class="fas fa-boxes"></i> Stock: ${ticket.stock_actuel}/${ticket.stock_initial}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span class="ticket-price">${ticket.prix}DH</span>
                            <button class="btn-buy" onclick="buyTicket(${ticket.id_ticket_type}, '${ticket.libelle_tarif}')"><i class="fas fa-shopping-cart"></i> Acheter</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    modalBody.innerHTML = `
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; color: var(--white);">${event.titre}</h2>
        <div style="color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;">
            <div style="margin-bottom: 8px;"><i class="fas fa-calendar" style="color: var(--accent-primary); margin-right: 8px; width: 16px;"></i> ${formattedDate}</div>
            <div><i class="fas fa-map-pin" style="color: var(--accent-primary); margin-right: 8px; width: 16px;"></i> ${event.lieu_precis || 'Lieu à confirmer'}</div>
        </div>
        ${imageHTML}
        <p style="color: var(--text-primary); line-height: 1.6; margin-bottom: 20px;">${event.description || 'Pas de description disponible'}</p>
        ${ticketsHTML}
    `;

    modal.classList.add('active');
}

// ==================== CLOSE EVENT MODAL ====================
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.remove('active');
}

// ==================== BUY TICKET ====================
function buyTicket(ticketId, ticketLabel) {
    console.log(`Achat du ticket: ${ticketLabel} (ID: ${ticketId})`);
    // TODO: Implémentation du panier et du processus d'achat
    alert('Fonctionnalité d\'achat en développement - Ticket: ' + ticketLabel);
}

// ==================== HAMBURGER MENU ====================
function setupHamburgerMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobile-nav');

    if (!mobileMenuBtn || !mobileNav) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navItems = mobileNav.querySelectorAll('.mobile-nav-item');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}
