// ==================== LOAD PAYMENT FORM ====================
function loadPaymentForm() {
    const reservationData = JSON.parse(sessionStorage.getItem('reservationData'));
    
    if (!reservationData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Show guest warning if user is not logged in
    const session = JSON.parse(sessionStorage.getItem('billetterie_session') || 'null');
    if (!session || !session.userId) {
        showGuestWarning();
    }
    
    displayPaymentForm(reservationData);
}

// ==================== SHOW GUEST WARNING ====================
function showGuestWarning() {
    const paymentContent = document.getElementById('payment-content');
    const warningHTML = `
        <div class="guest-payment-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>⏰ Attention - Mode Invité</strong>
                <p>Vous êtes connecté en tant qu'invité. Votre billet sera <strong>supprimé à la fin de votre session</strong>. Pour conserver vos billets de façon permanente, connectez-vous à votre compte!</p>
                <div style="margin-top: 12px;">
                    <a href="auth.html" class="warning-btn">Se connecter ou créer un compte</a>
                </div>
            </div>
        </div>
    `;
    
    if (paymentContent) {
        // Insert warning at the beginning
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = warningHTML;
        paymentContent.insertBefore(tempDiv.firstElementChild, paymentContent.firstChild);
    }
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

                <!-- Redemption Code Section -->
                <div class="form-section">
                    <div class="form-section-title">
                        <i class="fas fa-tag"></i> Code Promo / Rédemption
                    </div>
                    <div class="form-group">
                        <label class="form-label">Avez-vous un code promo?</label>
                        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                            <input type="text" class="form-input" id="redemption-code" name="redemption_code" placeholder="Ex: FREE2024, INVITE50..." style="flex: 1; text-transform: uppercase;">
                            <button type="button" class="pay-button" style="padding: 12px 24px; width: auto; white-space: nowrap;" onclick="applyRedemptionCode()">
                                <i class="fas fa-check"></i> Appliquer
                            </button>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 12px; margin: 0;">Codes disponibles: FREE2024, INVITE50, SAVE25, PROMO30</p>
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
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="cash" onchange="togglePaymentMethod('cash')">
                            <span class="payment-method-label">
                                <i class="fas fa-money-bill"></i>
                                Espèce
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="cashplus" onchange="togglePaymentMethod('cashplus')">
                            <span class="payment-method-label">
                                <i class="fas fa-mobile-alt"></i>
                                CashPlus
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="moneygram" onchange="togglePaymentMethod('moneygram')">
                            <span class="payment-method-label">
                                <i class="fas fa-globe"></i>
                                MoneyGram
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="westernunion" onchange="togglePaymentMethod('westernunion')">
                            <span class="payment-method-label">
                                <i class="fas fa-exchange-alt"></i>
                                Western Union
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="ria" onchange="togglePaymentMethod('ria')">
                            <span class="payment-method-label">
                                <i class="fas fa-share-alt"></i>
                                Ria Money Transfer
                            </span>
                            <div class="payment-method-border"></div>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment_method" value="skrill" onchange="togglePaymentMethod('skrill')">
                            <span class="payment-method-label">
                                <i class="fas fa-wallet"></i>
                                Skrill
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

                    <form id="payment-form" onsubmit="processPayment(event, '${data.event_title}', null)" autocomplete="off">
                        <div class="form-group">
                            <label class="form-label">Titulaire de la Carte</label>
                            <input type="text" class="form-input" name="cardholder" placeholder="NOM PRENOM" required autocomplete="off" oninput="validateCardholderName(this)">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Numéro de Carte</label>
                            <input type="text" class="form-input" name="cardnumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCardNumber(this)" required autocomplete="off">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Expiration (MM/YY)</label>
                                <input type="text" class="form-input" name="expiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)" required autocomplete="off">
                            </div>
                            <div class="form-group">
                                <label class="form-label">CVC</label>
                                <input type="text" class="form-input" name="cvc" placeholder="000" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required autocomplete="off">
                            </div>
                        </div>

                        <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                            <input type="checkbox" id="terms-checkbox" name="terms_accepted" required style="cursor: pointer; min-width: 20px;">
                            <label for="terms-checkbox" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                                J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                            </label>
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

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-paypal" name="terms_accepted_paypal" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-paypal" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validatePayPalTerms() && payWithPayPal(null)">
                        <i class="fab fa-paypal"></i> Payer avec PayPal
                    </button>
                </div>

                <!-- Cash/Espèce Details -->
                <div class="form-section card-details" id="cash-details">
                    <div class="form-section-title">
                        <i class="fas fa-money-bill"></i> Paiement par Espèce
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Paiement en espèce à la réception de votre billet.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-cash" name="terms_accepted_cash" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-cash" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateCashTerms() && processCashPayment(null, '${data.event_title}')">
                        <i class="fas fa-money-bill"></i> Confirmer Paiement Espèce
                    </button>
                </div>

                <!-- CashPlus Details -->
                <div class="form-section card-details" id="cashplus-details">
                    <div class="form-section-title">
                        <i class="fas fa-mobile-alt"></i> CashPlus
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Paiez via CashPlus en toute sécurité.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-cashplus" name="terms_accepted_cashplus" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-cashplus" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateCashplusTerms() && processPayment3rd(null, 'cashplus', '${data.event_title}')">
                        <i class="fas fa-mobile-alt"></i> Payer avec CashPlus
                    </button>
                </div>

                <!-- MoneyGram Details -->
                <div class="form-section card-details" id="moneygram-details">
                    <div class="form-section-title">
                        <i class="fas fa-globe"></i> MoneyGram
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Envoyez votre paiement via MoneyGram.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-mg" name="terms_accepted_mg" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-mg" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateMgTerms() && processPayment3rd(null, 'moneygram', '${data.event_title}')">
                        <i class="fas fa-globe"></i> Payer avec MoneyGram
                    </button>
                </div>

                <!-- Western Union Details -->
                <div class="form-section card-details" id="westernunion-details">
                    <div class="form-section-title">
                        <i class="fas fa-exchange-alt"></i> Western Union
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Effectuez un transfert Western Union.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-wu" name="terms_accepted_wu" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-wu" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateWuTerms() && processPayment3rd(null, 'westernunion', '${data.event_title}')">
                        <i class="fas fa-exchange-alt"></i> Payer avec Western Union
                    </button>
                </div>

                <!-- Ria Money Transfer Details -->
                <div class="form-section card-details" id="ria-details">
                    <div class="form-section-title">
                        <i class="fas fa-share-alt"></i> Ria Money Transfer
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Utilisez Ria Money Transfer pour votre paiement.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-ria" name="terms_accepted_ria" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-ria" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateRiaTerms() && processPayment3rd(null, 'ria', '${data.event_title}')">
                        <i class="fas fa-share-alt"></i> Payer avec Ria Money Transfer
                    </button>
                </div>

                <!-- Skrill Details -->
                <div class="form-section card-details" id="skrill-details">
                    <div class="form-section-title">
                        <i class="fas fa-wallet"></i> Skrill
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 20px; text-align: center;">
                        Paiez en toute sécurité avec votre portefeuille Skrill.
                    </p>

                    <div class="form-group" style="display: flex; align-items: center; gap: 12px; background: rgba(255, 59, 59, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 59, 59, 0.1); margin-bottom: 16px;">
                        <input type="checkbox" id="terms-checkbox-skrill" name="terms_accepted_skrill" required style="cursor: pointer; min-width: 20px;">
                        <label for="terms-checkbox-skrill" style="margin: 0; color: var(--text-secondary); font-size: 13px; cursor: pointer; flex: 1;">
                            J'accepte les <a href="terms-conditions.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">conditions d'utilisation</a> et la <a href="privacy-policy.html" target="_blank" onclick="event.stopPropagation();" style="color: var(--accent-primary); text-decoration: underline; font-weight: 600; cursor: pointer; pointer-events: auto; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.8';" onmouseout="this.style.opacity='1';">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="button" class="pay-button" onclick="validateSkrillTerms() && processPayment3rd(null, 'skrill', '${data.event_title}')">
                        <i class="fas fa-wallet"></i> Payer avec Skrill
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
    // Hide all payment details
    const methods = ['card-details', 'paypal-details', 'cash-details', 'cashplus-details', 'moneygram-details', 'westernunion-details', 'ria-details', 'skrill-details'];
    methods.forEach(m => {
        const el = document.getElementById(m);
        if (el) el.classList.remove('active');
    });
    
    // Show selected payment method
    const selectedEl = document.getElementById(method + '-details');
    if (selectedEl) selectedEl.classList.add('active');
}

// ==================== PROCESS PAYMENT ====================
function processPayment(e, eventTitle, total) {
    e.preventDefault();
    
    // Get form data
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);
    
    // Validate all fields
    const cardholder = formData.get('cardholder').trim();
    const cardnumber = formData.get('cardnumber').replace(/\s/g, '');
    const expiry = formData.get('expiry');
    const cvc = formData.get('cvc');
    const termsAccepted = formData.get('terms_accepted');
    
    // Validation: Cardholder name
    if (!cardholder || cardholder.length < 3) {
        alert('Veuillez entrer un nom valide (minimum 3 caractères)');
        return false;
    }
    
    // Validation: Card number (basic Luhn algorithm check)
    if (!validateCardNumber(cardnumber)) {
        alert('Numéro de carte invalide');
        return false;
    }
    
    // Validation: Expiry date
    if (!validateExpiry(expiry)) {
        alert('Date d\'expiration invalide (format: MM/YY)');
        return false;
    }
    
    // Validation: CVC
    if (!cvc || cvc.length < 3) {
        alert('CVC invalide');
        return false;
    }
    
    // Validation: Terms accepted
    if (!termsAccepted) {
        alert('Veuillez accepter les conditions d\'utilisation');
        return false;
    }
    
    // Use window.paymentData.total if total is null (after applying discount code)
    total = total || window.paymentData.total;
    
    const payButton = document.getElementById('pay-button');
    payButton.disabled = true;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    
    // Clear form data after validation to prevent accidental resubmission
    form.reset();
    
    // Simulate payment processing - reduced to 800ms for faster feedback
    setTimeout(() => {
        // Set state to paid for successful Card or Stripe payment
        window.paymentData.status = 'paid';
        window.paymentData.paymentMethod = 'card';
        completePayment(eventTitle, total);
    }, 800);
}

// ==================== VALIDATE CARD NUMBER (LUHN ALGORITHM) ====================
function validateCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }
    
    // Check if only digits
    if (!/^\d+$/.test(cardNumber)) {
        return false;
    }
    
    // Basic Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

// ==================== VALIDATE EXPIRY DATE ====================
function validateExpiry(expiryString) {
    if (!expiryString || !expiryString.includes('/')) {
        return false;
    }
    
    const [month, year] = expiryString.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (monthNum < 1 || monthNum > 12 || isNaN(monthNum)) {
        return false;
    }
    
    if (yearNum < 1 || yearNum > 99 || isNaN(yearNum)) {
        return false;
    }
    
    // Check if card is not expired
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return false;
    }
    
    return true;
}

// ==================== VALIDATE CARDHOLDER NAME ====================
function validateCardholderName(input) {
    // Allow only letters and spaces
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
}

// ==================== VALIDATE CASH TERMS ====================
function validateCashTerms() {
    const checkbox = document.getElementById('terms-checkbox-cash');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== VALIDATE CASHPLUS TERMS ====================
function validateCashplusTerms() {
    const checkbox = document.getElementById('terms-checkbox-cashplus');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== VALIDATE MONEYGRAM TERMS ====================
function validateMgTerms() {
    const checkbox = document.getElementById('terms-checkbox-mg');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== VALIDATE WESTERN UNION TERMS ====================
function validateWuTerms() {
    const checkbox = document.getElementById('terms-checkbox-wu');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== VALIDATE RIA TERMS ====================
function validateRiaTerms() {
    const checkbox = document.getElementById('terms-checkbox-ria');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== VALIDATE SKRILL TERMS ====================
function validateSkrillTerms() {
    const checkbox = document.getElementById('terms-checkbox-skrill');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== APPLY REDEMPTION CODE ====================
function applyRedemptionCode() {
    const code = document.getElementById('redemption-code').value.trim().toUpperCase();
    
    // Valid redemption codes (in production: check in database)
    const validCodes = {
        'FREE2024': 0,
        'INVITE50': 0.5,
        'SAVE25': 0.75,
        'PROMO30': 0.7
    };
    
    if (!code) {
        alert('Veuillez entrer un code de rédemption');
        return;
    }
    
    if (validCodes.hasOwnProperty(code)) {
        const discount = validCodes[code];
        const originalTotal = window.paymentData.original_total || window.paymentData.total;
        const newTotal = Math.floor(originalTotal * discount * 100) / 100;
        const discountAmount = originalTotal - newTotal;
        
        window.paymentData.original_total = originalTotal;
        window.paymentData.total = newTotal;
        window.paymentData.discount = discountAmount;
        window.paymentData.discount_percent = Math.round((1 - discount) * 100);
        window.paymentData.redemption_code = code;
        window.paymentData.is_invitation = (discount === 0);
        
        // Update the summary display with the new total
        const summarySection = document.querySelector('.order-summary-box');
        if (summarySection) {
            // Remove old discount if exists
            const oldDiscount = summarySection.querySelector('.summary-item.discount');
            if (oldDiscount) oldDiscount.remove();
            
            // Add new total
            const totalElement = summarySection.querySelector('.summary-total');
            if (totalElement) {
                // Remove old total
                totalElement.remove();
                
                // Add discount info if there is one
                if (discountAmount > 0) {
                    const discountHTML = document.createElement('div');
                    discountHTML.className = 'summary-item discount';
                    discountHTML.innerHTML = `
                        <span class="summary-item-label">Réduction (${window.paymentData.discount_percent}%):</span>
                        <span class="summary-item-value">-${discountAmount}DH</span>
                    `;
                    summarySection.appendChild(discountHTML);
                }
                
                // Add new total
                const newTotalHTML = document.createElement('div');
                newTotalHTML.className = 'summary-total';
                newTotalHTML.innerHTML = `
                    <span>Total:</span>
                    <span>${newTotal}DH</span>
                `;
                summarySection.appendChild(newTotalHTML);
            }
        }
        
        alert(`✓ Code appliqué!\nNouveau total: ${newTotal}DH${discountAmount > 0 ? '\nRéduction: -' + discountAmount + 'DH' : ''}`);
    } else {
        alert('❌ Code de rédemption invalide');
    }
}


// ==================== CUSTOM MODAL ALERT ====================
function showCustomAlert(message, title = "Information", type = "info", callback = null) {
    // Colors based on type
    const colors = {
        info: '#00a8ff',
        success: '#4caf50',
        warning: '#ffa500',
        error: '#ff3b3b'
    };
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    const color = colors[type] || colors.info;
    const icon = icons[type] || icons.info;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    overlay.style.backdropFilter = 'blur(6px)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';

    // Create modal box
    const modal = document.createElement('div');
    modal.style.backgroundColor = '#1a1a1a';
    modal.style.border = `1px solid rgba(255, 255, 255, 0.1)`;
    modal.style.borderRadius = '16px';
    modal.style.padding = '40px 30px';
    modal.style.width = '90%';
    modal.style.maxWidth = '450px';
    modal.style.textAlign = 'center';
    modal.style.boxShadow = `0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${color}33`;
    modal.style.transform = 'translateY(20px)';
    modal.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Content HTML
    modal.innerHTML = `
        <div style="font-size: 50px; color: ${color}; margin-bottom: 20px;">
            <i class="fas ${icon}"></i>
        </div>
        <h3 style="color: white; font-size: 22px; font-weight: 700; margin: 0 0 15px 0;">${title}</h3>
        <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
            ${message.replace(/\n/g, '<br/>')}
        </p>
        <button id="custom-alert-btn" style="
            background: linear-gradient(135deg, var(--accent-primary), #ff6b6b);
            color: white;
            border: none;
            padding: 14px 30px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(255, 59, 59, 0.3);
        ">OK, C'est noté</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animation trigger
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    }, 10);

    // Button hover effects
    const btn = modal.querySelector('#custom-alert-btn');
    btn.onmouseover = () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 6px 20px rgba(255, 59, 59, 0.4)';
    };
    btn.onmouseout = () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 15px rgba(255, 59, 59, 0.3)';
    };

    // Close logic
    btn.addEventListener('click', () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            if (callback) callback();
        }, 300);
    });
}

// ==================== PROCESS CASH PAYMENT ====================
function processCashPayment(total, eventTitle) {
    // Use window.paymentData.total if total is null (after applying discount code)
    total = total || window.paymentData.total;
    const finalTotal = window.paymentData.total || total;
    
    // Set status to pending for Cash
    window.paymentData.status = 'pending';
    window.paymentData.paymentMethod = 'cash';
    
    if (finalTotal === 0) {
        window.paymentData.status = 'paid'; // Free tickets are paid automatically
        showCustomAlert('Votre ticket d\'invitation gratuite a été généré avec succès !', 'Invitation Confirmée', 'success', () => {
            completePayment(eventTitle, finalTotal);
        });
    } else {
        showCustomAlert(`Commande enregistrée pour ${finalTotal}DH ! Vous pourrez payer en espèce lors de l'accès à l'événement.\n\nVotre billet sera placé dans la section "Mes Billets" avec le statut 'Paiement en attente'.`, 'Paiement Espèce', 'info', () => {
            completePayment(eventTitle, finalTotal);
        });
    }
}

// ==================== PROCESS 3RD PARTY PAYMENT ====================
function processPayment3rd(total, method, eventTitle) {
    const methodNames = {
        'cashplus': 'CashPlus',
        'moneygram': 'MoneyGram',
        'westernunion': 'Western Union',
        'ria': 'Ria',
        'skrill': 'Skrill'
    };
    
    // Use window.paymentData.total if total is null
    total = total || window.paymentData.total;
    const finalTotal = window.paymentData.total || total;
    
    // Generate a random code for paying at agency
    const paymentCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    window.paymentData.status = 'pending';
    window.paymentData.paymentMethod = method;
    window.paymentData.paymentCode = paymentCode;
    
    if (method === 'skrill') {
        window.open('https://www.skrill.com', '_blank');
        showCustomAlert('Nous avons ouvert une page vers Skrill. Veuillez y compléter votre paiement.\n\nEn attendant, votre billet est marqué comme "En attente" dans vos réservations.', 'Redirection Skrill', 'info', () => {
             completePayment(eventTitle, finalTotal);
        });
    } else {
        showCustomAlert(`Veuillez vous rendre à l'agence <strong style="color: white">${methodNames[method]}</strong> la plus proche et présenter ce code :<br><br><span style="font-size: 28px; font-weight: 900; color: white; letter-spacing: 2px; padding: 10px 20px; background: rgba(255,255,255,0.1); border-radius: 8px;">${paymentCode}</span><br><br>Montant à régler : <strong style="color: white">${finalTotal}DH</strong>`, 'Paiement en Agence', 'warning', () => {
             completePayment(eventTitle, finalTotal);
        });
    }
}

// ==================== PAY WITH PAYPAL ====================
function payWithPayPal(total) {
    // Use window.paymentData.total if total is null
    total = total || window.paymentData.total;
    
    // Redirect to PayPal
    window.open('https://www.paypal.com/checkoutnow', '_blank');
    
    window.paymentData.status = 'paid';
    window.paymentData.paymentMethod = 'paypal';
    
    showCustomAlert('La transaction PayPal a été complétée.\n\nVotre réservation est validée !', 'Paiement Réussi', 'success', () => {
        completePayment(window.paymentData.event_title, total);
    });
}

// ==================== VALIDATE PAYPAL TERMS ====================
function validatePayPalTerms() {
    const checkbox = document.getElementById('terms-checkbox-paypal');
    if (!checkbox || !checkbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
        return false;
    }
    return true;
}

// ==================== COMPLETE PAYMENT ====================
function completePayment(eventTitle, total) {
    const reservationData = window.paymentData;
    
    // Add payment timestamp
    reservationData.date_reservation = new Date().toISOString();
    
    // Check if user is logged in
    const session = JSON.parse(sessionStorage.getItem('billetterie_session') || 'null');
    const isLoggedIn = session && session.userId;
    
    // Mark whether this is a guest or registered user
    reservationData.is_guest = !isLoggedIn;
    reservationData.user_id = isLoggedIn ? session.userId : null;
    
    // Save based on user status
    if (isLoggedIn) {
        // Registered user: save to localStorage (persistent)
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(reservationData);
        localStorage.setItem('reservations', JSON.stringify(reservations));
    } else {
        // Guest: save to sessionStorage (temporary, will be cleared on session end)
        let guestReservations = JSON.parse(sessionStorage.getItem('guest_reservations') || '[]');
        guestReservations.push(reservationData);
        sessionStorage.setItem('guest_reservations', JSON.stringify(guestReservations));
    }
    
    // Save reservation first for quick redirect
    sessionStorage.setItem('lastReservation', JSON.stringify(reservationData));
    
    // Redirect to success page immediately
    window.location.href = 'payment-success.html';
    
    // Generate PDF in the background (non-blocking)
    setTimeout(() => {
        try {
            generateAndDownloadPDF(reservationData);
        } catch (e) {
            console.error('Erreur génération PDF:', e);
        }
    }, 500);
}

// ==================== GENERATE AND DOWNLOAD PDF ====================
function generateAndDownloadPDF(data) {
    try {
        const JsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        if (!JsPDF) {
            alert('Erreur: Librairie PDF non disponible');
            return;
        }
        
        const pdf = new JsPDF('p', 'mm', 'a4');
        const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const isInvitation = data.total === 0 || data.is_invitation;
        
        // Ensure values are strings to prevent jsPDF crashes
        const safeStr = (val, fallback = '') => String(val || fallback);
        
        // Couleurs du thème
        const redAccent = [255, 59, 59];
        const greenInvite = [76, 175, 80];
        const headerColor = isInvitation ? greenInvite : redAccent;
        
        // ========== HEADER ROUGE/VERT ==========
        pdf.setFillColor(...headerColor);
        pdf.rect(0, 0, 210, 35, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        // Emojis removed to prevent the weird "Ø<ß«" symbols
        pdf.text(isInvitation ? 'INVITATION GRATUITE' : 'BILLET D\'ENTREE', 15, 15);
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'normal');
        pdf.text('Billetterie.com - Premium Events', 15, 25);
        
        // ========== LAYOUT 2 COLONNES ==========
        const leftColX = 15;
        const rightColX = 120;
        const contentStartY = 45;
        
        // ========== COLONNE GAUCHE - INFOS ==========
        pdf.setTextColor(0, 0, 0);
        let yPos = contentStartY;
        
        // Titre événement
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(...headerColor);
        const eventTitle = safeStr(data.event_title, 'Événement');
        const titleLines = pdf.splitTextToSize(eventTitle, 95);
        titleLines.forEach(line => {
            pdf.text(String(line), leftColX, yPos);
            yPos += 7;
        });
        
        yPos += 6;
        
        // Helper function for rows
        const drawRow = (label, value) => {
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(String(label), leftColX, yPos);
            yPos += 5;
            pdf.setFont(undefined, 'normal');
            pdf.setTextColor(80, 80, 80);
            pdf.text(String(value), leftColX, yPos);
            yPos += 8;
        };
        
        drawRow('NUMERO DE BILLET', ticketId);
        drawRow('TITULAIRE', safeStr(data.fullname, 'Non renseigné'));
        drawRow('EMAIL', safeStr(data.email, 'Non renseigné'));
        drawRow('TELEPHONE', safeStr(data.phone, 'Non renseigné'));
        drawRow('QUANTITE', 'x' + safeStr(data.quantity, '1'));
        
        // Séparateur
        pdf.setDrawColor(...headerColor);
        pdf.setLineWidth(0.3);
        pdf.line(leftColX, yPos - 3, leftColX + 95, yPos - 3);
        yPos += 3;
        
        // Date événement
        let eventDateStr = 'Date non spécifiée';
        const rawDate = data.date_evenement || data.date;
        if (rawDate) {
            try {
                eventDateStr = new Date(rawDate).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                });
            } catch(e) {}
        }
        
        drawRow('DATE DE L\'EVENEMENT', eventDateStr);
        drawRow('HEURE', safeStr(data.heure, '20:00'));
        drawRow('CATEGORIE', safeStr(data.categorie || data.category, 'Evénement Premium'));
        
        // Lieu
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('LIEU', leftColX, yPos);
        yPos += 5;
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text(safeStr(data.lieu_precis, 'Lieu non spécifié'), leftColX, yPos);
        yPos += 5;
        pdf.text(safeStr(data.nom_ville, ''), leftColX, yPos);
        yPos += 8;
        
        // Montant
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('MONTANT', leftColX, yPos);
        yPos += 5;
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(...headerColor);
        pdf.setFontSize(12);
        pdf.text(String(isInvitation ? 'GRATUIT ✓' : safeStr(data.total, '0') + ' DH'), leftColX, yPos);
        yPos += 10;
        
        // ========== QR CODE ==========
        // S'assurer que le QR Code ne chevauche rien
        let qrYPos = Math.max(yPos + 5, 200); 
        
        pdf.setFontSize(9);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('CODE QR - Scanner à l\'entrée', leftColX, qrYPos);
        qrYPos += 6;
        
        const qrContainer = document.createElement('div');
        qrContainer.style.display = 'none';
        document.body.appendChild(qrContainer);
        
        const qrEmail = encodeURIComponent(safeStr(data.email, 'guest@example.com'));
        const qrText = window.location.origin + '/verify-ticket.html?ticket=' + ticketId + '&email=' + qrEmail;
        
        try {
            new QRCode(qrContainer, {
                text: qrText,
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch(e) {
            console.error('Erreur init QR:', e);
        }

        // ============================================
        // FONCTION DE FINALISATION DU PDF
        // ============================================
        const finalizePDF = () => {
            // Ajout du QR généré
            try {
                const canvas = qrContainer.querySelector('canvas');
                if (canvas) {
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', leftColX, qrYPos, 35, 35);
                }
            } catch (e) {
                console.error('Erreur ajout QR:', e);
            }

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text('Billetterie Premium - Document officiel à présenter à l\'entrée', 105, 285, { align: 'center' });
            
            pdf.save('billet_' + ticketId + '.pdf');
            
            data.ticketId = ticketId;
            sessionStorage.setItem('ticketInfo', JSON.stringify(data));
            
            if (qrContainer.parentNode) document.body.removeChild(qrContainer);
        };

        // ========== COLONNE DROITE - CHARGEMENT AFFICHE ==========
        const drawPlaceholder = () => {
            pdf.setFillColor(240, 240, 240);
            pdf.rect(rightColX, contentStartY, 75, 105, 'F');
            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(10);
            pdf.text('AFFICHE EVENEMENT', rightColX + 37.5, contentStartY + 50, { align: 'center' });
        };

        const imgSrc = data.image_data || (data.image_url ? 'src/image/' + data.image_url : null);
        
        if (imgSrc) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                try {
                    // Convert into a base64 string to ensure passing reliably to jsPDF
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    
                    pdf.addImage(dataUrl, 'JPEG', rightColX, contentStartY, 75, 105);
                } catch(e) {
                    console.error('Erreur lors du rendu de l\'affiche:', e);
                    drawPlaceholder();
                }
                setTimeout(finalizePDF, 200);
            };
            img.onerror = () => {
                console.error('Image non localisée:', imgSrc);
                drawPlaceholder();
                setTimeout(finalizePDF, 200);
            };
            img.src = imgSrc;
        } else {
            drawPlaceholder();
            setTimeout(finalizePDF, 300); // give QR time to render
        }
        
    } catch (e) {
        console.error('Erreur PDF globale:', e);
        alert('Erreur lors de la création du fichier: ' + e.message);
    }
}

// ==================== GENERATE TICKET HTML ====================
function generateTicketHTML(data, ticketId) {
    const eventDate = new Date(data.date_evenement);
    const eventFormattedDate = eventDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const reservationDate = new Date(data.date_reservation);
    const reservationFormattedDate = reservationDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const reservationTime = reservationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const isInvitation = data.total === 0 || data.is_invitation;
    const headerBg = isInvitation ? '#4CAF50' : '#ff3b3b';
    const headerTitle = isInvitation ? '💝 INVITATION GRATUITE' : '🎫 BILLET D\'ENTRÉE';
    const ticketType = isInvitation ? 'Invitation' : 'Billet Premium';
    
    // Format event time
    const eventTime = data.heure || '20:00';
    
    // Get event image or placeholder
    const eventImage = data.image_url ? `src/image/${data.image_url}` : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%23333%22 width=%22300%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EAffiche%3C/text%3E%3C/svg%3E';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #0d0d0d;
                    padding: 0;
                }
                
                .ticket-container {
                    width: 210mm;
                    height: 297mm;
                    margin: 0 auto;
                    background: #0d0d0d;
                    color: #fff;
                    position: relative;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    page-break-after: always;
                }
                
                .ticket-header {
                    background: linear-gradient(135deg, ${headerBg}, ${isInvitation ? '#45a049' : '#ff6b6b'});
                    padding: 30px;
                    text-align: center;
                    border-bottom: 3px solid ${headerBg};
                }
                
                .ticket-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    letter-spacing: 1px;
                }
                
                .ticket-header p {
                    font-size: 12px;
                    opacity: 0.9;
                    font-weight: 500;
                }
                
                .ticket-content {
                    display: grid;
                    grid-template-columns: 1fr 280px;
                    gap: 30px;
                    padding: 40px;
                    align-items: start;
                }
                
                .ticket-info {
                    background: rgba(26, 26, 26, 0.8);
                    padding: 30px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 59, 59, 0.2);
                }
                
                .ticket-info h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: ${headerBg};
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .event-title {
                    font-size: 22px;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 20px;
                    line-height: 1.3;
                    border-bottom: 2px solid ${headerBg};
                    padding-bottom: 15px;
                }
                
                .info-group {
                    margin-bottom: 18px;
                }
                
                .info-label {
                    font-size: 11px;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                
                .info-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #fff;
                }
                
                .info-value.highlight {
                    color: ${headerBg};
                    font-size: 16px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .event-image {
                    width: 280px;
                    height: 380px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid ${headerBg};
                    background: rgba(0,0,0,0.3);
                }
                
                .event-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .qr-section {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 59, 59, 0.2);
                }
                
                .qr-label {
                    font-size: 10px;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                
                #qrcode {
                    display: inline-block;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 59, 59, 0.2);
                }
                
                .ticket-footer {
                    background: linear-gradient(135deg, rgba(${isInvitation ? '76, 175, 80' : '255, 59, 59'}, 0.1), rgba(${isInvitation ? '76, 175, 80' : '255, 107, 107'}, 0.05));
                    border: 1px solid rgba(${isInvitation ? '76, 175, 80' : '255, 59, 59'}, 0.3);
                    padding: 20px 30px;
                    border-radius: 8px;
                    font-size: 12px;
                    line-height: 1.6;
                    margin-top: 30px;
                }
                
                .ticket-footer strong {
                    color: ${headerBg};
                    font-weight: 700;
                    display: block;
                    margin-bottom: 8px;
                }
                
                .watermark {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    font-size: 10px;
                    color: rgba(255, 59, 59, 0.1);
                    text-align: right;
                }
                
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .ticket-container {
                        box-shadow: none;
                        width: 100%;
                        height: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="ticket-container">
                <div class="ticket-header">
                    <h1>${headerTitle}</h1>
                    <p>Billetterie Premium Events</p>
                </div>
                
                <div class="ticket-content">
                    <div class="ticket-info">
                        <h2>Détails du Billet</h2>
                        
                        <div class="event-title">${data.event_title}</div>
                        
                        <!-- User Info -->
                        <div class="info-group">
                            <div class="info-label">Type de Billet</div>
                            <div class="info-value highlight">${ticketType}</div>
                        </div>
                        
                        <div class="info-grid">
                            <div class="info-group">
                                <div class="info-label">Numéro</div>
                                <div class="info-value">${ticketId}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Quantité</div>
                                <div class="info-value">x${data.quantity}</div>
                            </div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-label">Titulaire</div>
                            <div class="info-value">${data.fullname}</div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-label">Email</div>
                            <div class="info-value" style="font-size: 12px;">${data.email}</div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-label">Téléphone</div>
                            <div class="info-value">${data.phone}</div>
                        </div>
                        
                        <!-- Event Info -->
                        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255, 59, 59, 0.2);">
                            <h2 style="font-size: 14px; margin-bottom: 15px;">Infos Événement</h2>
                            
                            <div class="info-group">
                                <div class="info-label">Date</div>
                                <div class="info-value">${eventFormattedDate}</div>
                            </div>
                            
                            <div class="info-group">
                                <div class="info-label">Heure</div>
                                <div class="info-value">${eventTime}</div>
                            </div>
                            
                            <div class="info-group">
                                <div class="info-label">Lieu</div>
                                <div class="info-value">${data.lieu_precis}</div>
                            </div>
                            
                            <div class="info-group">
                                <div class="info-label">Ville</div>
                                <div class="info-value">${data.nom_ville}</div>
                            </div>
                            
                            <div class="info-group">
                                <div class="info-label">Montant</div>
                                <div class="info-value highlight" style="font-size: 16px;">${isInvitation ? 'GRATUIT ✓' : data.total + ' DH'}</div>
                            </div>
                        </div>
                        
                        <!-- QR Code -->
                        <div class="qr-section">
                            <div class="qr-label">Code de Vérification</div>
                            <div id="qrcode"></div>
                        </div>
                    </div>
                    
                    <!-- Event Poster -->
                    <div class="event-image">
                        <img src="${eventImage}" alt="${data.event_title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%23222%22 width=%22300%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22Arial%22%3E${data.event_title}%3C/text%3E%3C/svg%3E'">
                    </div>
                </div>
                
                <div class="ticket-footer" style="margin: 30px 40px 0 40px;">
                    <strong>⚠️ Conditions d'Accès</strong>
                    ${isInvitation 
                        ? 'Vous êtes invité(e) à cet événement. Présentez ce document à l\'entrée avec le code QR visible.'
                        : 'Veuillez présenter ce billet et scanner le QR code à l\'entrée. Valide pour la date et l\'heure indiquées.'}
                </div>
                
                <div class="ticket-footer" style="margin: 10px 40px 0 40px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);">
                    <strong style="color: #999;">Réservation</strong>
                    ${reservationFormattedDate} à ${reservationTime}
                </div>
                
                <div class="watermark">
                    Billetterie.com<br>© 2026
                </div>
            </div>
        </body>
        </html>
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

// ==================== DOWNLOAD QR CODE ====================
function downloadQRCode(ticketId, email) {
    // Create QR code data
    const qrData = `${window.location.origin}/verify-ticket.html?ticket=${ticketId}&email=${encodeURIComponent(email)}`;
    
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-qr-' + Date.now();
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    
    // Generate QR code
    const qrcode = new QRCode(tempDiv, {
        text: qrData,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Wait for QR code to be generated
    setTimeout(() => {
        const qrImage = tempDiv.querySelector('img');
        if (qrImage) {
            const link = document.createElement('a');
            link.href = qrImage.src;
            link.download = `qr_code_${ticketId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        document.body.removeChild(tempDiv);
    }, 500);
}

// ==================== SETUP PAYMENT SUCCESS ====================
function setupPaymentSuccess() {
    const reservation = sessionStorage.getItem('lastReservation');
    if (reservation) {
        const data = JSON.parse(reservation);
        displaySuccessMessage(data);
    }
}

function displaySuccessMessage(data) {
    const container = document.getElementById('success-container');
    const ticketId = data.ticketId || 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const isInvitation = data.total === 0 || data.is_invitation;
    const headerColor = isInvitation ? '#4CAF50' : '#ff3b3b';
    const headerTitle = isInvitation ? '💝 Invitation Confirmée' : '✓ Paiement Confirmé';
    
    const successHTML = `
        <div class="success-box">
            <div class="success-header">
                <i class="fas fa-check-circle" style="color: ${headerColor}; font-size: 64px; margin-bottom: 20px;"></i>
                <h1>${headerTitle}</h1>
                <p>Votre réservation a été traitée avec succès!</p>
            </div>

            <div class="success-details">
                <div class="detail-item">
                    <span class="detail-label">Numéro de Billet:</span>
                    <span class="detail-value">${ticketId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Événement:</span>
                    <span class="detail-value">${data.event_title}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email de Confirmation:</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Montant:</span>
                    <span class="detail-value" style="color: ${headerColor};">${isInvitation ? 'GRATUIT' : data.total + 'DH'}</span>
                </div>
            </div>

            <div class="qr-section">
                <p class="qr-title">Code QR - Gardez-le précieusement!</p>
                <div id="success-qrcode" style="display: inline-block; padding: 15px; background: white; border-radius: 8px; margin: 20px 0;"></div>
                <p class="qr-description">Ce code QR vous permettra de vérifier votre accès à l'événement</p>
                <button class="success-button" onclick="downloadQRCode('${ticketId}', '${data.email}')">
                    <i class="fas fa-download"></i> Télécharger le QR Code
                </button>
            </div>

            <div class="success-actions">
                <button class="success-button primary" onclick="window.location.href='my-tickets.html'">
                    <i class="fas fa-ticket-alt"></i> Voir mes Billets
                </button>
                <button class="success-button" onclick="window.location.href='index.html'">
                    <i class="fas fa-home"></i> Retour à l'Accueil
                </button>
            </div>

            <div class="success-info">
                <i class="fas fa-info-circle"></i>
                <p>Un email de confirmation a été envoyé à <strong>${data.email}</strong>. Consultez votre email pour plus de détails.</p>
            </div>
        </div>
    `;
    
    container.innerHTML = successHTML;
    
    // Generate QR code after HTML is rendered for better performance
    setTimeout(() => {
        try {
            new QRCode(document.getElementById("success-qrcode"), {
                text: window.location.origin + "/verify-ticket.html?ticket=" + ticketId + "&email=" + encodeURIComponent(data.email),
                width: 250,
                height: 250,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            console.error('Erreur génération QR code:', e);
        }
    }, 100);
}


// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadPaymentForm();
    setupHamburgerMenu();
});
