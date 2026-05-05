// ==================== LOAD SUCCESS PAGE ====================
function loadSuccessPage() {
    const lastReservation = JSON.parse(sessionStorage.getItem('lastReservation'));
    const ticketInfo = JSON.parse(sessionStorage.getItem('ticketInfo'));
    
    if (!lastReservation) {
        window.location.href = 'index.html';
        return;
    }
    
    displaySuccessPage(lastReservation, ticketInfo);
}

// ==================== DISPLAY SUCCESS PAGE ====================
function displaySuccessPage(reservation, ticketInfo) {
    const container = document.getElementById('success-container');
    
    const eventDate = new Date(reservation.date_reservation);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    const ticketId = ticketInfo?.ticketId || 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    container.innerHTML = `
        <div class="success-card">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            
            <h1 class="success-title">Paiement Confirmé!</h1>
            <p class="success-subtitle">Votre réservation a été validée avec succès</p>
            
            <!-- Ticket Info Card -->
            <div class="ticket-info-card">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <i class="fas fa-ticket-alt" style="color: #4caf50; font-size: 20px;"></i>
                    <h2 style="margin: 0; color: var(--white);">${reservation.event_title}</h2>
                </div>
                
                <div class="ticket-info-grid">
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-hashtag"></i> Numéro de Billet</span>
                        <span class="ticket-info-value highlight">${ticketId}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-user"></i> Nom</span>
                        <span class="ticket-info-value">${reservation.fullname}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-envelope"></i> Email</span>
                        <span class="ticket-info-value">${reservation.email}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-phone"></i> Téléphone</span>
                        <span class="ticket-info-value">${reservation.phone}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-ticket-alt"></i> Billets</span>
                        <span class="ticket-info-value">x${reservation.quantity}</span>
                    </div>
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-calendar"></i> Date</span>
                        <span class="ticket-info-value">${formattedDate}</span>
                    </div>
                    ${reservation.discount > 0 ? `
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-tag"></i> Réduction</span>
                        <span class="ticket-info-value" style="color: #4caf50;">-${reservation.discount}DH (${reservation.discountPercent}%)</span>
                    </div>
                    ` : ''}
                    <div class="ticket-info-item">
                        <span class="ticket-info-label"><i class="fas fa-coins"></i> Montant Payé</span>
                        <span class="ticket-info-value highlight">${reservation.total}DH</span>
                    </div>
                </div>
            </div>
            
            <!-- Ticket Preview -->
            <div class="ticket-preview">
                <div class="ticket-preview-header">
                    <span class="ticket-preview-title">Aperçu du Billet</span>
                    <span class="ticket-preview-id">${ticketId}</span>
                </div>
                <div class="ticket-preview-content">
                    <div class="ticket-preview-item">
                        <span class="ticket-preview-label">Événement</span>
                        <span class="ticket-preview-value">${reservation.event_title}</span>
                    </div>
                    <div class="ticket-preview-item">
                        <span class="ticket-preview-label">Client</span>
                        <span class="ticket-preview-value">${reservation.fullname}</span>
                    </div>
                    <div class="ticket-preview-item">
                        <span class="ticket-preview-label">Quantité</span>
                        <span class="ticket-preview-value">x${reservation.quantity}</span>
                    </div>
                    <div class="ticket-preview-item">
                        <span class="ticket-preview-label">Prix Total</span>
                        <span class="ticket-preview-value">${reservation.total}DH</span>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="success-actions">
                <a href="my-tickets.html" class="success-button secondary">
                    <i class="fas fa-folder-open"></i> Mes Billets
                </a>
                <button class="success-button primary" onclick="downloadPDFTicket('${ticketId}', '${reservation.event_title}')">
                    <i class="fas fa-download"></i> Télécharger PDF
                </button>
            </div>
            
            <!-- Info Message -->
            <div class="success-info">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Important:</strong> Un email de confirmation contenant votre billet a été envoyé à <strong>${reservation.email}</strong>. 
                    Présentez ce billet ou votre QR code à l'entrée de l'événement. Consultez la section "Mes Billets" pour accéder à vos réservations à tout moment.
                </div>
            </div>
        </div>
    `;
    
    // Store for PDF download
    window.ticketData = reservation;
    window.ticketId = ticketId;
}

// ==================== DOWNLOAD PDF TICKET ====================
function downloadPDFTicket(ticketId, eventTitle) {
    const element = document.createElement('div');
    element.innerHTML = generateTicketPDF(window.ticketData, ticketId);
    
    const opt = {
        margin: 10,
        filename: `Billet_${ticketId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// ==================== GENERATE TICKET PDF ====================
function generateTicketPDF(data, ticketId) {
    const eventDate = new Date(data.date_reservation);
    const formattedDate = eventDate.toLocaleDateString('fr-FR');
    const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div style="font-family: 'Courier New', monospace; background: white; padding: 30px; width: 210mm;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ff3b3b; padding-bottom: 20px;">
                <div style="color: #ff3b3b; font-size: 28px; font-weight: 900; margin-bottom: 5px;">BILLETTERIE PREMIUM</div>
                <div style="color: #666; font-size: 14px;">www.billetterie.com</div>
            </div>
            
            <!-- Ticket Content -->
            <div style="background: linear-gradient(135deg, #ff3b3b, #ff6b6b); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
                <h1 style="margin: 0 0 20px 0; font-size: 32px; text-align: center;">BILLET D'ENTRÉE</h1>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center;">
                    <div>
                        <div style="font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Numéro de Billet</div>
                        <div style="font-size: 20px; font-weight: 700; font-family: monospace; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; word-break: break-all;">${ticketId}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Prix Total</div>
                        <div style="font-size: 28px; font-weight: 900;">${data.total}DH</div>
                    </div>
                </div>
            </div>
            
            <!-- Event Details -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold; width: 30%;">ÉVÉNEMENT:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333; font-weight: 700;">${data.event_title}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">NOM DU CLIENT:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333;">${data.fullname}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">EMAIL:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333;">${data.email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">TÉLÉPHONE:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333;">${data.phone}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">QUANTITÉ:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333; font-weight: 700;">x${data.quantity} billet(s)</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">DATE DE RÉSERVATION:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #333;">${formattedDate} à ${formattedTime}</td>
                </tr>
                ${data.discount > 0 ? `
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: bold;">RÉDUCTION:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #eee; color: #ff3b3b; font-weight: 700;">-${data.discount}DH (${data.discountPercent}%)</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 12px; border-bottom: 2px solid #ff3b3b; color: #666; font-weight: bold;">MONTANT PAYÉ:</td>
                    <td style="padding: 12px; border-bottom: 2px solid #ff3b3b; color: #ff3b3b; font-weight: 900; font-size: 16px;">${data.total}DH</td>
                </tr>
            </table>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #ff3b3b; border-radius: 6px; font-size: 12px; color: #333; line-height: 1.8;">
                <strong style="color: #ff3b3b;">⚠ CONDITIONS D'ACCÈS</strong>
                <p style="margin: 10px 0;">✓ Présentez ce billet à l'entrée de l'événement<br>
                ✓ Un QR code vous sera remis à l'accueil<br>
                ✓ Conservez ce billet en lieu sûr<br>
                ✓ Valable uniquement pour la date indiquée<br>
                <strong style="color: #ff3b3b;">✓ NON REMBOURSABLE</strong></p>
            </div>
            
            <!-- Barcode Area -->
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9f9f9; border: 2px dashed #ddd; border-radius: 6px;">
                <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">QR Code (à scanner à l'entrée)</div>
                <div style="font-size: 60px; color: #ff3b3b;">█ █ █ █</div>
                <div style="color: #666; font-size: 10px; margin-top: 10px; font-family: monospace;">${ticketId}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #999; font-size: 10px;">
                <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
                <p>© 2026 Billetterie Premium - Tous droits réservés</p>
            </div>
        </div>
    `;
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

    const navItems = mobileNav.querySelectorAll('.mobile-nav-item');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && !e.target.closest('.mobile-menu')) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadSuccessPage();
    setupHamburgerMenu();
});
