// Simple detail page
let currentEvent = null;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

const imageMap = [
  { match: "concert gims", file: "image/concert-gims.png" },
  { match: "casablanca du rire", file: "image/casablanca-du-rire.png" },
  { match: "match de gala", file: "image/match-de-gala.png" },
  { match: "gnaoua", file: "image/festival-gnaoua.jpg" },
  { match: "dune", file: "image/poster-dune-part-3.jpg" },
  { match: "issawa", file: "image/issawa-a-l-ancienne.jpg" }
];

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function resolveImage(titre) {
  if (!titre) return 'image/logo.png';
  const lower = String(titre).toLowerCase();
  const map = imageMap.find(m => lower.includes(m.match));
  return map ? map.file : 'image/logo.png';
}

function updateTotal() {
  const ticketSelect = document.getElementById('ticketType');
  const qty = parseInt(document.getElementById('quantity').value) || 1;
  if (!ticketSelect.options.length) {
    document.getElementById('totalPrice').textContent = '0.00 €';
    return;
  }
  const option = ticketSelect.options[ticketSelect.selectedIndex];
  const price = parseFloat(option.dataset.price) || 0;
  document.getElementById('totalPrice').textContent = `${(price * qty).toFixed(2)} €`;
}

async function loadEventDetail() {
  const eventId = getQueryParam('id_evenement');
  if (!eventId) return;
  
  try {
    const res = await fetch(`/api/events.php?id_evenement=${eventId}`);
    const data = await res.json();
    
    // Handle different response formats
    if (Array.isArray(data.data)) {
      currentEvent = data.data[0];
    } else if (data.data) {
      currentEvent = data.data;
    } else if (data.id_evenement) {
      currentEvent = data;
    } else {
      currentEvent = data[0] || data;
    }
    
    if (!currentEvent || !currentEvent.titre) {
      console.error('Event not found', data);
      return;
    }
    
    // Fill HTML with event data
    document.getElementById('eventPoster').src = resolveImage(currentEvent.titre);
    document.getElementById('eventTitle').textContent = currentEvent.titre;
    document.getElementById('eventDate').textContent = currentEvent.date_evenement || '-';
    document.getElementById('eventCity').textContent = currentEvent.ville || currentEvent.nom_ville || '-';
    document.getElementById('eventCategory').textContent = currentEvent.categorie || '-';
    document.getElementById('eventDescription').innerHTML = `<strong>Description:</strong> ${currentEvent.description || 'N/A'}`;
    
    loadTicketTypes(eventId);
    updateCheckoutMode();
  } catch (err) {
    console.error('Erreur:', err);
  }
}

function updateCheckoutMode() {
  const guestFields = document.getElementById('guestFields');
  const buyerMode = document.getElementById('buyerMode');
  
  if (currentUser) {
    guestFields.style.display = 'none';
    buyerMode.textContent = `Connecté: ${currentUser.prenom} ${currentUser.nom}`;
  } else {
    guestFields.style.display = 'block';
    buyerMode.textContent = 'Merci de renseigner vos infos:';
  }
}

async function loadTicketTypes(eventId) {
  try {
    const res = await fetch(`/api/tickets.php?id_evenement=${eventId}`);
    const data = await res.json();
    const tickets = data.data || data || [];
    
    const container = document.getElementById('ticketList');
    const selectBox = document.getElementById('ticketType');
    
    container.innerHTML = '';
    selectBox.innerHTML = '';
    
    tickets.forEach(ticket => {
      // Add to list
      const item = document.createElement('div');
      item.className = 'ticket-item';
      item.textContent = `${ticket.libelle_tarif} - ${ticket.prix}€ (Stock: ${ticket.stock_actuel})`;
      container.appendChild(item);
      
      // Add to select
      const option = document.createElement('option');
      option.value = ticket.id_ticket_type;
      option.dataset.price = ticket.prix;
      option.textContent = `${ticket.libelle_tarif} - ${ticket.prix}€`;
      selectBox.appendChild(option);
    });
    
    updateTotal();
  } catch (err) {
    console.error('Erreur tickets:', err);
  }
}

async function handleCheckout(e) {
  e.preventDefault();
  
  const ticketTypeId = document.getElementById('ticketType').value;
  const qty = parseInt(document.getElementById('quantity').value);
  
  const payload = {
    id_evenement: currentEvent.id_evenement,
    id_type_ticket: ticketTypeId,
    quantite: qty
  };
  
  if (currentUser) {
    payload.email = currentUser.email;
  } else {
    payload.buyer_nom = document.getElementById('buyerNom').value;
    payload.buyer_prenom = document.getElementById('buyerPrenom').value;
    payload.buyer_email = document.getElementById('buyerEmail').value;
  }
  
  try {
    const res = await fetch('/api/buy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (data.success || data.status === 'ok') {
      // Show bill
      renderBill(data, payload);
      alert('Achat réussi !');
    } else {
      alert('Erreur: ' + (data.message || 'Achat échoué'));
    }
  } catch (err) {
    console.error('Erreur achat:', err);
    alert('Erreur lors de l\'achat');
  }
}

function renderBill(response, payload) {
  const billDiv = document.getElementById('ticketOutput');
  billDiv.style.display = 'block';
  
  const buyerName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : `${payload.buyer_prenom} ${payload.buyer_nom}`;
  const buyerEmail = currentUser ? currentUser.email : payload.buyer_email;
  const billets = response.data?.billets || response.billets || [];
  const qrCode = billets[0]?.code_unique_qr || 'N/A';
  
  document.getElementById('billEvent').textContent = currentEvent.titre;
  document.getElementById('billBuyer').textContent = buyerName;
  document.getElementById('billEmail').textContent = buyerEmail;
  document.getElementById('billDate').textContent = currentEvent.date_evenement || '-';
  document.getElementById('billType').textContent = payload.libelle || 'Ticket';
  document.getElementById('billQty').textContent = payload.quantite;
  document.getElementById('billAmount').textContent = (document.getElementById('totalPrice').textContent);
  document.getElementById('billPoster').src = resolveImage(currentEvent.titre);
  
  if (qrCode !== 'N/A') {
    const qrContainer = document.getElementById('qrCanvas');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: qrCode,
      width: 150,
      height: 150
    });
  }
  
  window.scrollTo(0, billDiv.offsetTop - 100);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadEventDetail();
  
  document.getElementById('ticketType')?.addEventListener('change', updateTotal);
  document.getElementById('quantity')?.addEventListener('change', updateTotal);
  document.getElementById('buyForm')?.addEventListener('submit', handleCheckout);
});

