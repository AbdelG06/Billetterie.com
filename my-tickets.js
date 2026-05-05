// ==================== LOAD RESERVATIONS ====================
function loadReservations() {
    const ticketsContent = document.getElementById('tickets-content');
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    if (reservations.length === 0) {
        showEmptyState();
        return;
    }

    let ticketsHTML = '<div class="tickets-grid">';
    
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

        ticketsHTML += `
            <div class="ticket-card">
                <div class="ticket-card-header">
                    <div>
                        <div class="ticket-card-title">${reservation.event_title}</div>
                        <div class="ticket-card-subtitle">Réservation #${1000 + idx}</div>
                    </div>
                    <span class="ticket-status-badge">Confirmé</span>
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
                </div>

                <div class="ticket-card-footer">
                    <button class="ticket-action-btn" onclick="showQRCode('Billet #${1000 + idx}')">
                        <i class="fas fa-qrcode"></i> Voir QR Code
                    </button>
                    <button class="ticket-action-btn primary" onclick="downloadTicket('${1000 + idx}', '${reservation.event_title}')">
                        <i class="fas fa-download"></i> Télécharger
                    </button>
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
function showQRCode(ticketId) {
    const qrModal = document.getElementById('qr-modal') || createQRModal();
    
    // Update modal content
    const qrCodeContent = qrModal.querySelector('.qr-code-placeholder');
    const modalTitle = qrModal.querySelector('.qr-modal-title');
    
    if (modalTitle) {
        modalTitle.textContent = `Code QR - ${ticketId}`;
    }
    
    // Generate a simple QR code visual (in production, use a library like QRCode.js)
    qrCodeContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 120px; color: var(--accent-primary); margin-bottom: 16px;">
                <i class="fas fa-qrcode"></i>
            </div>
            <div style="color: var(--text-secondary); font-size: 12px;">
                ${ticketId}
            </div>
        </div>
    `;
    
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
    console.log(`Téléchargement du billet #${ticketId}`);
    alert(`Téléchargement du billet pour ${eventTitle} en cours...\n(Billet PDF à générer)`);
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
