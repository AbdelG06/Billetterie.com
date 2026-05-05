// ==================== GET URL PARAMETERS ====================
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ==================== LOAD EVENT DETAILS ====================
async function loadEventDetails() {
    try {
        const eventId = getEventIdFromUrl();
        
        if (!eventId) {
            showError('Événement non trouvé');
            return;
        }

        // Load events from JSON
        const response = await fetch('events.json');
        const events = await response.json();
        
        // Find the event
        const event = events.find(e => e.id_evenement == eventId);
        
        if (!event) {
            showError('Événement non trouvé');
            return;
        }

        displayEventDetails(event);
    } catch (error) {
        console.error('Erreur chargement événement:', error);
        showError('Erreur lors du chargement de l\'événement');
    }
}

// ==================== DISPLAY EVENT DETAILS ====================
function displayEventDetails(event) {
    const container = document.getElementById('event-detail-main');
    
    // Format date exactement comme dans les cartes
    const eventDate = new Date(event.date_evenement);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Image HTML avec fallback
    let imageHTML = '';
    if (event.image_url && event.image_url !== 'NULL') {
        imageHTML = `<img src="/images/${event.image_url}" alt="${event.titre}" onerror="this.parentElement.classList.add('placeholder'); this.style.display='none'; this.parentElement.innerHTML='<i class=\"fas fa-theater-masks\"></i>'">`;
    } else {
        imageHTML = `<i class="fas fa-theater-masks"></i>`;
    }

    // Valeurs sûres avec fallback
    const prix_min = event.prix_min || 0;
    const prix_max = event.prix_max || prix_min;
    const heure = event.heure || 'Heure non définie';
    const capacite = event.capacite || 'Non défini';
    const lieu_precis = event.lieu_precis || event.nom_ville;
    const organisateur = event.organisateur || 'Billetterie.com';
    const contact = event.contact || 'Non disponible';
    const parking = event.parking || 'Information non disponible';
    const regles = event.regles || 'Aucune restriction spécifique';
    const description = event.description || 'Pas de description disponible';

    container.innerHTML = `
        <div class="event-detail-grid">
            <div class="event-detail-image">
                ${imageHTML}
            </div>
            
            <div class="event-detail-content">
                <span class="event-category-badge">${event.categorie}</span>
                <h1 class="event-detail-title">${event.titre}</h1>
                
                <div class="event-price-info">
                    <div class="price-item">
                        <span class="price-label">À partir de</span>
                        <span class="price-value">${prix_min}DH</span>
                    </div>
                    <div class="price-item">
                        <span class="price-label">Jusqu'à</span>
                        <span class="price-value">${prix_max}DH</span>
                    </div>
                </div>

                <div class="event-meta-grid">
                    <div class="event-meta-item-detail">
                        <div class="event-meta-item-detail-label">
                            <i class="fas fa-calendar-alt"></i> Date
                        </div>
                        <div class="event-meta-item-detail-value">${formattedDate}</div>
                    </div>

                    <div class="event-meta-item-detail">
                        <div class="event-meta-item-detail-label">
                            <i class="fas fa-clock"></i> Heure
                        </div>
                        <div class="event-meta-item-detail-value">${heure}</div>
                    </div>

                    <div class="event-meta-item-detail">
                        <div class="event-meta-item-detail-label">
                            <i class="fas fa-map-marker-alt"></i> Ville
                        </div>
                        <div class="event-meta-item-detail-value">${event.nom_ville}</div>
                    </div>

                    <div class="event-meta-item-detail">
                        <div class="event-meta-item-detail-label">
                            <i class="fas fa-users"></i> Capacité
                        </div>
                        <div class="event-meta-item-detail-value">${capacite}</div>
                    </div>
                </div>

                <div class="reservation-section">
                    <button class="btn-reserve" onclick="openReservationForm(${event.id_evenement}, '${event.titre.replace(/'/g, "\\'")}')">
                        <i class="fas fa-ticket-alt"></i> Réserver Maintenant
                    </button>
                </div>
            </div>
        </div>

        <!-- Description Section -->
        <div class="event-description-section" style="margin-top: 60px;">
            <h2 class="section-title">
                <i class="fas fa-align-left"></i> À propos de cet événement
            </h2>
            <div class="event-description-text">
                ${description}
            </div>
        </div>

        <!-- Details Section -->
        <div class="event-description-section">
            <h2 class="section-title">
                <i class="fas fa-info-circle"></i> Informations Pratiques
            </h2>
            <div class="event-details-grid">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-map-pin"></i> Lieu Précis</span>
                    <span class="detail-value">${lieu_precis}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-building"></i> Organisateur</span>
                    <span class="detail-value">${organisateur}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-phone"></i> Contact</span>
                    <span class="detail-value highlight">${contact}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-car"></i> Parking</span>
                    <span class="detail-value">${parking}</span>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label"><i class="fas fa-bookmark"></i> Règles & Conditions</span>
                    <span class="detail-value">${regles}</span>
                </div>
            </div>
        </div>
    `;
}

// ==================== GENERATE TICKET TYPES ====================
function generateTicketTypes(priceMin, priceMax) {
    const ticketTypes = [
        { id: 1, name: 'Tarif Réduit', price: priceMin, available: true },
        { id: 2, name: 'Tarif Normal', price: Math.floor((priceMin + priceMax) / 2), available: true },
        { id: 3, name: 'Tarif VIP', price: priceMax, available: true }
    ];
    return ticketTypes;
}

// ==================== OPEN RESERVATION FORM ====================
function openReservationForm(eventId, eventTitle) {
    const modal = document.getElementById('reservation-modal');
    const reservationBody = document.getElementById('reservation-body');

    // Get ticket types for this event
    const response = fetch('events.json')
        .then(res => res.json())
        .then(events => {
            const event = events.find(e => e.id_evenement == eventId);
            const ticketTypes = generateTicketTypes(event.prix_min, event.prix_max);
            
            let ticketOptionsHTML = ticketTypes.map((ticket, idx) => `
                <label class="ticket-option-radio">
                    <input type="radio" name="ticket_type" value="${ticket.id}" data-price="${ticket.price}" ${idx === 0 ? 'checked' : ''} onchange="updateTotalPrice()">
                    <div class="ticket-option-details">
                        <span class="ticket-option-name">${ticket.name}</span>
                        <span class="ticket-option-price">${ticket.price}DH</span>
                    </div>
                </label>
            `).join('');

            reservationBody.innerHTML = `
                <div class="reservation-form">
                    <h3 class="form-title">
                        <i class="fas fa-calendar-check"></i> Réserver - ${eventTitle}
                    </h3>

                    <form id="reservation-form-element" onsubmit="proceedToPayment(event, ${eventId}, '${eventTitle.replace(/'/g, "\\'")}')">
                        <!-- Ticket Type Selection -->
                        <div class="form-group">
                            <label class="form-label">Choisir le type de billet</label>
                            <div class="ticket-options">
                                ${ticketOptionsHTML}
                            </div>
                        </div>

                        <!-- Quantity -->
                        <div class="form-group">
                            <label class="form-label">Nombre de billets</label>
                            <input type="number" class="form-input" name="quantity" id="quantity" min="1" max="10" value="1" onchange="updateTotalPrice()" required>
                        </div>

                        <!-- Promo Code -->
                        <div class="form-group">
                            <label class="form-label">Code Promo (optionnel)</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" class="form-input" name="promo_code" id="promo_code" placeholder="Ex: bill25" style="flex: 1;">
                                <button type="button" class="form-button" onclick="applyPromoCode()" style="flex: 0 0 auto; padding: 12px 20px;">
                                    <i class="fas fa-check"></i>
                                </button>
                            </div>
                            <small id="promo-message" style="margin-top: 8px; display: none;"></small>
                        </div>

                        <!-- Price Summary -->
                        <div class="price-summary">
                            <div class="summary-row">
                                <span>Prix unitaire:</span>
                                <span id="unit-price">0DH</span>
                            </div>
                            <div class="summary-row">
                                <span>Quantité:</span>
                                <span id="summary-quantity">1</span>
                            </div>
                            <div class="summary-row" id="discount-row" style="display: none;">
                                <span>Réduction:</span>
                                <span id="discount-amount" style="color: var(--accent-primary);">-0DH</span>
                            </div>
                            <div class="summary-row" style="border-top: 2px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
                                <span style="font-weight: 700;">Total:</span>
                                <span id="total-price" style="font-weight: 700; font-size: 18px; color: var(--accent-primary);">0DH</span>
                            </div>
                        </div>

                        <!-- Personal Information -->
                        <div class="form-group">
                            <label class="form-label">Nom Complet *</label>
                            <input type="text" class="form-input" name="fullname" placeholder="Votre nom complet" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-input" name="email" placeholder="votre@email.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" class="form-input" name="phone" placeholder="+212..." required>
                            </div>
                        </div>

                        <!-- Terms -->
                        <div class="form-group" style="margin-top: 24px; margin-bottom: 24px;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 500;">
                                <input type="checkbox" required style="width: 18px; height: 18px; cursor: pointer;">
                                <span>J'accepte les conditions d'utilisation et la politique de confidentialité</span>
                            </label>
                        </div>

                        <button type="submit" class="form-button">
                            <i class="fas fa-credit-card"></i> Procéder au Paiement
                        </button>
                    </form>
                </div>
            `;

            modal.classList.add('active');
            updateTotalPrice();
        })
        .catch(err => console.error('Erreur:', err));
}

// ==================== UPDATE TOTAL PRICE ====================
function updateTotalPrice() {
    const ticketRadio = document.querySelector('input[name="ticket_type"]:checked');
    const quantity = parseInt(document.getElementById('quantity')?.value || 1);
    
    if (!ticketRadio) return;
    
    const unitPrice = parseInt(ticketRadio.dataset.price || 0);
    const subtotal = unitPrice * quantity;
    
    // Get promo discount if applied
    const promoMessage = document.getElementById('promo-message');
    let discount = 0;
    let discountPercent = 0;
    
    if (promoMessage && promoMessage.style.display !== 'none' && promoMessage.dataset.discount) {
        discountPercent = parseInt(promoMessage.dataset.discount);
        discount = Math.floor(subtotal * discountPercent / 100);
    }
    
    const total = subtotal - discount;
    
    // Update display
    document.getElementById('unit-price').textContent = unitPrice + 'DH';
    document.getElementById('summary-quantity').textContent = quantity;
    document.getElementById('total-price').textContent = total + 'DH';
    
    if (discount > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('discount-amount').textContent = '-' + discount + 'DH';
    } else {
        document.getElementById('discount-row').style.display = 'none';
    }
    
    // Store in global for later use
    window.reservationData = {
        unitPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        discount: discount,
        discountPercent: discountPercent,
        total: total
    };
}

// ==================== APPLY PROMO CODE ====================
function applyPromoCode() {
    const promoCode = document.getElementById('promo_code')?.value.trim().toUpperCase();
    const promoMessage = document.getElementById('promo-message');
    
    if (!promoCode) {
        promoMessage.textContent = '';
        promoMessage.style.display = 'none';
        promoMessage.dataset.discount = 0;
        updateTotalPrice();
        return;
    }
    
    // Define valid promo codes with discounts
    const promoCodes = {
        'BILL25': 25,  // 25% discount
        'BILL15': 15,  // 15% discount
        'BILL10': 10,  // 10% discount
        'WELCOME20': 20, // 20% discount
        'SUMMER30': 30   // 30% discount
    };
    
    if (promoCodes[promoCode]) {
        const discount = promoCodes[promoCode];
        promoMessage.innerHTML = `<span style="color: var(--accent-primary);"><i class="fas fa-check-circle"></i> Code accepté! Réduction: ${discount}%</span>`;
        promoMessage.style.display = 'block';
        promoMessage.dataset.discount = discount;
        updateTotalPrice();
    } else {
        promoMessage.innerHTML = `<span style="color: #f44336;"><i class="fas fa-times-circle"></i> Code invalide</span>`;
        promoMessage.style.display = 'block';
        promoMessage.dataset.discount = 0;
        updateTotalPrice();
    }
}

// ==================== PROCEED TO PAYMENT ====================
function proceedToPayment(e, eventId, eventTitle) {
    e.preventDefault();
    
    const form = document.getElementById('reservation-form-element');
    const formData = new FormData(form);
    
    const reservationData = {
        event_id: eventId,
        event_title: eventTitle,
        ticket_type: formData.get('ticket_type'),
        quantity: formData.get('quantity'),
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        promo_code: formData.get('promo_code'),
        ...window.reservationData
    };
    
    // Save to sessionStorage to pass to payment page
    sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
    
    // Redirect to payment page
    window.location.href = `payment.html?eventId=${eventId}`;
}

// ==================== CLOSE RESERVATION MODAL ====================
function closeReservationModal() {
    const modal = document.getElementById('reservation-modal');
    modal.classList.remove('active');
}

// ==================== SHOW ERROR ====================
function showError(message) {
    const container = document.getElementById('event-detail-main');
    container.innerHTML = `
        <div class="loading-state" style="min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <i class="fas fa-exclamation-circle" style="font-size: 60px; color: var(--accent-primary); margin-bottom: 20px;"></i>
            <p style="color: var(--text-secondary); font-size: 16px;">${message}</p>
            <a href="index.html" class="back-button" style="margin-top: 20px;">
                <i class="fas fa-chevron-left"></i> Retour aux événements
            </a>
        </div>
    `;
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    const closeBtn = document.getElementById('reservation-close');
    const modal = document.getElementById('reservation-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeReservationModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeReservationModal();
            }
        });
    }

    // Setup hamburger menu
    setupHamburgerMenu();
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
        if (!e.target.closest('.navbar') && !e.target.closest('.mobile-menu')) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();
    setupEventListeners();
});
