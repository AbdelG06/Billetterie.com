// ==================== LOAD RESERVATIONS ====================
function loadReservations() {
    const ticketsContent = document.getElementById('tickets-content');
    
    // Check if user is logged in
    const session = JSON.parse(sessionStorage.getItem('billetterie_session') || 'null');
    const isLoggedIn = session && session.userId;
    
    // Load registered user reservations from localStorage
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Load guest reservations from sessionStorage (if any)
    let guestReservations = JSON.parse(sessionStorage.getItem('guest_reservations') || '[]');
    
    // If user is logged in: only show their registered reservations
    if (isLoggedIn) {
        reservations = reservations.filter(r => r.user_id === session.userId);
    } else {
        // If not logged in: only show guest reservations
        reservations = guestReservations;
    }
    
    if (reservations.length === 0) {
        showEmptyState();
        return;
    }
    
    // Show warning message for guest reservations
    let ticketsHTML = '';
    if (!isLoggedIn && guestReservations.length > 0) {
        ticketsHTML += `
            <div class="guest-warning-banner">
                <div class="warning-content">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>⏰ Attention - Mode Invité</strong>
                        <p>Vos billets seront supprimés à la fin de votre session. Pour garder vos billets de façon permanente, connectez-vous à votre compte!</p>
                    </div>
                    <a href="auth.html" class="warning-link">Se connecter</a>
                </div>
            </div>
        `;
    }
    
    ticketsHTML += '<div class="tickets-grid">';
    
    reservations.forEach((reservation, idx) => {
        const reservationDate = new Date(reservation.date_reservation);
        const formattedDate = reservationDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const formattedTime = reservationDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const ticketId = `TKT-${1000 + idx}`;
        const isInvitation = reservation.is_invitation || reservation.total === 0;
        
        // Handle pending status
        const isPending = reservation.status === 'pending';
        let statusBadge = '';
        if (isPending) {
            statusBadge = '<span class="ticket-status-badge pending" style="background: rgba(255,165,0,0.1); color: #ffa500; border: 1px solid rgba(255,165,0,0.2);">En attente</span>';
        } else {
            statusBadge = `<span class="ticket-status-badge ${isInvitation ? 'invitation' : 'confirmed'}">${isInvitation ? 'Invitation' : 'Confirmé'}</span>`;
        }

        const guestBadge = reservation.is_guest ? '<span class="guest-badge" style="font-size: 11px; margin-left: 8px;"><i class="fas fa-user-shield"></i> Invité</span>' : '';

        // Handle buttons based on status
        let actionButtons = '';
        if (isPending) {
            actionButtons = `
                <div style="color: #ffa500; font-size: 13px; text-align: center; padding: 10px 0; width: 100%;">
                    <i class="fas fa-clock"></i> Paiement en attente de vérification (${reservation.paymentMethod})
                </div>
            `;
        } else {
            actionButtons = `
                <button class="ticket-action-btn" onclick="showQRCode('${ticketId}', '${reservation.email}')">
                    <i class="fas fa-qrcode"></i> Voir QR Code
                </button>
                <button class="ticket-action-btn primary" onclick="downloadTicket('${ticketId}', '${reservation.event_title}')">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            `;
        }

        ticketsHTML += `
            <div class="ticket-card" ${isPending ? 'style="opacity: 0.8; border-color: rgba(255,165,0,0.3);"' : ''}>
                <div class="ticket-card-header">
                    <div>
                        <div class="ticket-card-title">${reservation.event_title}</div>
                        <div class="ticket-card-subtitle">Réservation #${1000 + idx}${guestBadge}</div>
                    </div>
                    ${statusBadge}
                </div>

                <div class="ticket-card-body">
                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-user"></i> Nom</span>
                        <span class="ticket-info-value">${reservation.fullname}</span>
                    </div>

                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-envelope"></i> Email</span>
                        <span class="ticket-info-value">${reservation.email}</span>
                    </div>

                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-phone"></i> Téléphone</span>
                        <span class="ticket-info-value">${reservation.phone}</span>
                    </div>

                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-ticket-alt"></i> Billets</span>
                        <span class="ticket-info-value highlight">x${reservation.quantity}</span>
                    </div>

                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-calendar"></i> Date Réservation</span>
                        <span class="ticket-info-value">${formattedDate} à ${formattedTime}</span>
                    </div>

                    <div class="ticket-info-row">
                        <span class="ticket-info-label"><i class="fas fa-money-bill-wave"></i> Montant</span>
                        <span class="ticket-info-value" style="color: ${isInvitation ? '#4CAF50' : 'var(--accent-primary)'}">${isInvitation ? 'GRATUIT' : reservation.total + 'DH'}</span>
                    </div>
                    
                    ${isPending && reservation.paymentCode ? `
                    <div class="ticket-info-row" style="background: rgba(255,165,0,0.05); padding: 5px; border-radius: 4px; margin-top: 5px;">
                        <span class="ticket-info-label" style="color: #ffa500;"><i class="fas fa-hashtag"></i> Code de paiement</span>
                        <span class="ticket-info-value highlight" style="color: #ffa500; font-size: 16px; font-weight: 900;">${reservation.paymentCode}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="ticket-card-footer">
                    ${actionButtons}
                </div>
            </div>
        `;
    });

    ticketsHTML += '</div>';
    ticketsContent.innerHTML = ticketsHTML;
}

// ==================== SHOW EMPTY STATE ====================
function showEmptyState() {
    const ticketsContent = document.getElementById('tickets-content');
    ticketsContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-inbox"></i>
            </div>
            <h2 class="empty-state-title">Aucun billet réservé</h2>
            <p class="empty-state-text">Vous n'avez pas encore réservé de billets. Découvrez nos événements et réservez vos places dès maintenant!</p>
            <a href="index.html" class="empty-state-link">
                <i class="fas fa-search"></i> Voir les événements
            </a>
        </div>
    `;
}

// ==================== SHOW QR CODE ====================
function showQRCode(ticketId, email) {
    const qrModal = document.getElementById('qr-modal') || createQRModal();
    
    // Update modal content
    const qrCodeContent = qrModal.querySelector('.qr-code-placeholder');
    const modalTitle = qrModal.querySelector('.qr-modal-title');
    
    if (modalTitle) {
        modalTitle.textContent = `Code QR - ${ticketId}`;
    }
    
    // Clear previous QR code
    qrCodeContent.innerHTML = '';
    
    // Generate QR code with ticket verification link
    const qrData = `${window.location.origin}/verify-ticket.html?ticket=${ticketId}&email=${encodeURIComponent(email || 'user@example.com')}`;
    
    try {
        var qrcode = new QRCode(qrCodeContent, {
            text: qrData,
            width: 250,
            height: 250,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        // Fallback if QRCode.js fails
        qrCodeContent.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 120px; color: var(--accent-primary); margin-bottom: 16px;">
                    <i class="fas fa-qrcode"></i>
                </div>
                <div style="color: var(--text-secondary); font-size: 12px; margin-top: 10px;">
                    ${ticketId}
                </div>
            </div>
        `;
    }
    
    qrModal.classList.add('active');
}

// ==================== CREATE QR MODAL ====================
function createQRModal() {
    const modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.className = 'qr-modal';
    modal.innerHTML = `
        <div class="qr-modal-content">
            <button class="qr-modal-close" onclick="closeQRModal()">
                <i class="fas fa-times"></i>
            </button>
            <h3 class="qr-modal-title" style="color: var(--white); font-size: 20px; font-weight: 700; margin-bottom: 24px;"></h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">Présentez ce code QR au point d'entrée</p>
            <div class="qr-code-placeholder"></div>
            <button class="qr-download-btn" onclick="downloadQR()">
                <i class="fas fa-download"></i> Télécharger le QR Code
            </button>
        </div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQRModal();
        }
    });
    
    document.body.appendChild(modal);
    return modal;
}

// ==================== CLOSE QR MODAL ====================
function closeQRModal() {
    const qrModal = document.getElementById('qr-modal');
    if (qrModal) {
        qrModal.classList.remove('active');
    }
}

// ==================== DOWNLOAD QR CODE ====================
function downloadQR() {
    console.log('Téléchargement du QR Code...');
    alert('Téléchargement du QR Code en cours... (Fonctionnalité à implémenter)');
}

// ==================== DOWNLOAD TICKET ====================
function downloadTicket(ticketId, eventTitle) {
    try {
        // Get session info
        const session = JSON.parse(sessionStorage.getItem('billetterie_session') || 'null');
        const isLoggedIn = session && session.userId;
        
        // Get reservations based on user type
        let reservations = [];
        if (isLoggedIn) {
            reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
            reservations = reservations.filter(r => r.user_id === session.userId);
        } else {
            reservations = JSON.parse(sessionStorage.getItem('guest_reservations') || '[]');
        }
        
        // Find the matching reservation by event title
        const reservation = reservations.find(r => r.event_title === eventTitle);
        
        if (!reservation) {
            alert('Erreur: Billet non trouvé');
            return;
        }

        if (reservation.status === 'pending') {
            alert('Ce billet est en attente de paiement. Vous devez d\'abord régler le montant pour obtenir votre billet.');
            return;
        }
        
        // Enrich reservation with event details if missing (for older reservations)
        if (!reservation.date_evenement || !reservation.image_url) {
            let allEvents = [];
            try {
                allEvents = JSON.parse(localStorage.getItem('events')) || [];
            } catch(e) {}
            
            let eventMatch = allEvents.find(e => e.id_evenement == reservation.event_id || e.event_title === reservation.event_title || e.titre === reservation.event_title);
            
            if (!eventMatch) {
                // Try fetching synchronously - since we can't easily do it in a sync flow, we'll fetch and generate
                fetch('events.json')
                    .then(res => res.json())
                    .then(events => {
                        eventMatch = events.find(e => e.id_evenement == reservation.event_id || e.titre === reservation.event_title);
                        if (eventMatch) {
                            reservation.date_evenement = eventMatch.date_evenement || eventMatch.date || reservation.date_evenement;
                            reservation.heure = eventMatch.heure || eventMatch.time || reservation.heure;
                            reservation.lieu_precis = eventMatch.lieu_precis || eventMatch.location || reservation.lieu_precis;
                            reservation.nom_ville = eventMatch.nom_ville || eventMatch.city || reservation.nom_ville;
                            reservation.categorie = eventMatch.categorie || eventMatch.category || reservation.categorie;
                            reservation.image_url = eventMatch.image_url || eventMatch.image || reservation.image_url;
                            reservation.image_data = eventMatch.image_data || reservation.image_data;
                        }
                        executePDFGeneration(reservation);
                    })
                    .catch(err => {
                        console.error('Fetch error:', err);
                        executePDFGeneration(reservation);
                    });
                return; // exit here since we are now async
            } else {
                reservation.date_evenement = eventMatch.date_evenement || eventMatch.date || reservation.date_evenement;
                reservation.heure = eventMatch.heure || eventMatch.time || reservation.heure;
                reservation.lieu_precis = eventMatch.lieu_precis || eventMatch.location || reservation.lieu_precis;
                reservation.nom_ville = eventMatch.nom_ville || eventMatch.city || reservation.nom_ville;
                reservation.categorie = eventMatch.categorie || eventMatch.category || reservation.categorie;
                reservation.image_url = eventMatch.image_url || eventMatch.image || reservation.image_url;
                reservation.image_data = eventMatch.image_data || reservation.image_data;
            }
        }
        
        // Execute normally if we didn't go async
        executePDFGeneration(reservation);
        
        function executePDFGeneration(data) {
            // Call the PDF generation function from payment.js
            if (typeof generateAndDownloadPDF === 'function') {
                generateAndDownloadPDF(data);
            } else {
                alert('Erreur: Fonction de génération PDF non disponible');
            }
        }
        
    } catch (e) {
        console.error('Erreur téléchargement billet:', e);
        alert('Erreur lors du téléchargement: ' + e.message);
    }
}

// ==================== SETUP HAMBURGER MENU ====================
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
    loadReservations();
    setupHamburgerMenu();
});
