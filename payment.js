// ==================== LOAD PAYMENT FORM ====================
function loadPaymentForm() {
    const reservationData = JSON.parse(sessionStorage.getItem('reservationData'));
    
    if (!reservationData) {
        window.location.href = 'index.html';
        return;
    }
    
    displayPaymentForm(reservationData);
}

// ==================== DISPLAY PAYMENT FORM ====================
function displayPaymentForm(data) {
    const paymentContent = document.getElementById('payment-content');
    
    const paymentHTML = `
        <div class="payment-grid">
            <!-- Payment Form -->
            <div class="payment-form-section">
                <!-- Order Summary -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-list-check"></i> Résumé de la Commande
                    </div>
                    <div class="order-summary-box">
                        <div class="summary-item">
                            <span class="summary-item-label">Événement:</span>
                            <span class="summary-item-value">${data.event_title}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-item-label">Billets:</span>
                            <span class="summary-item-value">x${data.quantity}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-item-label">Prix unitaire:</span>
                            <span class="summary-item-value">${data.unitPrice}DH</span>
                        </div>
                        ${data.discount > 0 ? `
                        <div class="summary-item discount">
                            <span class="summary-item-label">Réduction (${data.discountPercent}%):</span>
                            <span class="summary-item-value">-${data.discount}DH</span>
                        </div>
                        ` : ''}
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>${data.total}DH</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Method Selection -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-credit-card"></i> Mode de Paiement
                    </div>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="card" checked onchange="togglePaymentMethod('card')">
                            <span class="payment-method-label">
                                <i class="fas fa-credit-card"></i>
                                Carte Bancaire
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="paypal" onchange="togglePaymentMethod('paypal')">
                            <span class="payment-method-label">
                                <i class="fab fa-paypal"></i>
                                PayPal
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                    </div>
                </div>

                <!-- Card Details -->
                <div class="form-section card-details active" id="card-details">
                    <div class="form-section-title">
                        <i class="fas fa-card-front"></i> Détails de la Carte
                    </div>

                    <div class="card-logos">
                        <button type="button" class="card-logo active" onclick="selectCard('visa')" data-card="visa">
                            <i class="fab fa-cc-visa"></i>
                        </button>
                        <button type="button" class="card-logo" onclick="selectCard('mastercard')" data-card="mastercard">
                            <i class="fab fa-cc-mastercard"></i>
                        </button>
                    </div>

                    <form id="payment-form" onsubmit="processPayment(event, '${data.event_title}', ${data.total})">
                        <div class="form-group">
                            <label class="form-label">Titulaire de la Carte</label>
                            <input type="text" class="form-input" name="cardholder" placeholder="NOM PRENOM" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Numéro de Carte</label>
                            <input type="text" class="form-input" name="cardnumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCardNumber(this)" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Expiration (MM/YY)</label>
                                <input type="text" class="form-input" name="expiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">CVC</label>
                                <input type="text" class="form-input" name="cvc" placeholder="000" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required>
                            </div>
                        </div>

                        <button type="submit" class="pay-button" id="pay-button">
                            <i class="fas fa-lock"></i> Payer Maintenant ${data.total}DH
                        </button>
                        <div class="security-info">
                            <i class="fas fa-shield-alt"></i>
                            Paiement sécurisé - Données chiffrées SSL
                        </div>
                    </form>
                </div>

                <!-- PayPal Details -->
                <div class="form-section card-details" id="paypal-details">
                    <div class="form-section-title">
                        <i class="fab fa-paypal"></i> Redirection PayPal
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Vous serez redirigé vers PayPal pour compléter votre paiement en toute sécurité.
                    </p>
                    <button type="button" class="pay-button" onclick="payWithPayPal(${data.total})">
                        <i class="fab fa-paypal"></i> Payer avec PayPal
                    </button>
                </div>
            </div>

            <!-- Payment Summary Sidebar -->
            <div class="payment-summary-section">
                <div class="payment-summary">
                    <div class="summary-title">
                        <i class="fas fa-receipt"></i> Détails de Paiement
                    </div>

                    <div class="summary-details">
                        <div class="summary-detail-item">
                            <span class="summary-detail-label">Événement:</span>
                            <span class="summary-detail-value">${data.event_title}</span>
                        </div>
                        <div class="summary-detail-item">
                            <span class="summary-detail-label">Billets:</span>
                            <span class="summary-detail-value">x${data.quantity}</span>
                        </div>
                        <div class="summary-detail-item">
                            <span class="summary-detail-label">Client:</span>
                            <span class="summary-detail-value">${data.fullname}</span>
                        </div>
                        <div class="summary-detail-item">
                            <span class="summary-detail-label">Email:</span>
                            <span class="summary-detail-value" style="font-size: 12px;">${data.email}</span>
                        </div>
                    </div>

                    <div class="summary-breakdown">
                        <div class="breakdown-item">
                            <span>Sous-total:</span>
                            <span>${data.subtotal}DH</span>
                        </div>
                        ${data.discount > 0 ? `
                        <div class="breakdown-item discount">
                            <span>Réduction (${data.discountPercent}%):</span>
                            <span>-${data.discount}DH</span>
                        </div>
                        ` : ''}
                        <div class="breakdown-item">
                            <span>Total à payer:</span>
                            <span>${data.total}DH</span>
                        </div>
                    </div>

                    <div class="total-amount">
                        <div class="total-label">Montant Total</div>
                        <div class="total-value">${data.total}DH</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    paymentContent.innerHTML = paymentHTML;
    
    // Store data for later use
    window.paymentData = data;
}

// ==================== FORMAT CARD NUMBER ====================
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    input.value = formattedValue.trim();
}

// ==================== FORMAT EXPIRY ====================
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// ==================== SELECT CARD TYPE ====================
function selectCard(type) {
    document.querySelectorAll('.card-logo').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-card="${type}"]`).classList.add('active');
}

// ==================== TOGGLE PAYMENT METHOD ====================
function togglePaymentMethod(method) {
    const cardDetails = document.getElementById('card-details');
    const paypalDetails = document.getElementById('paypal-details');
    
    if (method === 'card') {
        cardDetails.classList.add('active');
        paypalDetails.classList.remove('active');
    } else {
        cardDetails.classList.remove('active');
        paypalDetails.classList.add('active');
    }
}

// ==================== PROCESS PAYMENT ====================
function processPayment(e, eventTitle, total) {
    e.preventDefault();
    
    const payButton = document.getElementById('pay-button');
    payButton.disabled = true;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment(eventTitle, total);
    }, 2000);
}

// ==================== PAY WITH PAYPAL ====================
function payWithPayPal(total) {
    alert(`Redirection vers PayPal pour payer ${total}DH...\n(En production: redirection réelle)`);
    completePayment(window.paymentData.event_title, total);
}

// ==================== COMPLETE PAYMENT ====================
function completePayment(eventTitle, total) {
    const reservationData = window.paymentData;
    
    // Add payment timestamp
    reservationData.date_reservation = new Date().toISOString();
    
    // Save to localStorage
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservationData);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    // Generate ticket and redirect
    generateAndDownloadPDF(reservationData);
    
    // Redirect to success page
    setTimeout(() => {
        sessionStorage.setItem('lastReservation', JSON.stringify(reservationData));
        window.location.href = 'payment-success.html';
    }, 1000);
}

// ==================== GENERATE AND DOWNLOAD PDF ====================
function generateAndDownloadPDF(data) {
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const element = document.createElement('div');
    element.innerHTML = generateTicketHTML(data, ticketId);
    
    const opt = {
        margin: 10,
        filename: `billet_${ticketId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Generate PDF
    html2pdf().set(opt).from(element).save();
    
    // Store ticket info
    data.ticketId = ticketId;
    sessionStorage.setItem('ticketInfo', JSON.stringify(data));
}

// ==================== GENERATE TICKET HTML ====================
function generateTicketHTML(data, ticketId) {
    const eventDate = new Date(data.date_reservation);
    const formattedDate = eventDate.toLocaleDateString('fr-FR');
    const formattedTime = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #ff3b3b, #ff6b6b); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 800;">BILLET D'ENTRÉE</h1>
                <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Billetterie Premium</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">${data.event_title}</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Numéro de Billet:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: bold; text-align: right;">${ticketId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Nom:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">${data.fullname}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Email:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: right; font-size: 12px;">${data.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Téléphone:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">${data.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Quantité:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; text-align: right;">x${data.quantity}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: bold;">Montant Payé:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #ff3b3b; font-weight: bold; text-align: right;">${data.total}DH</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666; font-weight: bold;">Date de Réservation:</td>
                        <td style="padding: 10px 0; color: #333; text-align: right;">${formattedDate} ${formattedTime}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ff3b3b; padding: 12px; border-radius: 4px; font-size: 12px; color: #333;">
                <strong>Conditions d'accès:</strong>
                <p style="margin: 5px 0;">Présentez ce billet à l'entrée de l'événement.<br>Un QR code vous sera remis à l'accueil.</p>
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
    loadPaymentForm();
    setupHamburgerMenu();
});
