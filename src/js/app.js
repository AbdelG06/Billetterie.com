// Simple app with minimal functions
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let isLoginMode = true;
let allEvents = [];

const imageMap = [
  { match: "concert gims", file: "image/concert-gims.png" },
  { match: "casablanca du rire", file: "image/casablanca-du-rire.png" },
  { match: "match de gala", file: "image/match-de-gala.png" },
  { match: "gnaoua", file: "image/festival-gnaoua.jpg" },
  { match: "dune", file: "image/poster-dune-part-3.jpg" },
  { match: "issawa", file: "image/issawa-a-l-ancienne.jpg" }
];

// Hide intro
function hideIntro() {
  const overlay = document.getElementById('introOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// Setup auth section
function setupAuth() {
  if (currentUser) {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('userStatus').textContent = `${currentUser.prenom} ${currentUser.nom}`;
  } else {
    document.getElementById('btnLogin').onclick = () => openAuthModal(true);
    document.getElementById('btnRegister').onclick = () => openAuthModal(false);
  }
}

// Open auth modal
function openAuthModal(isLogin) {
  isLoginMode = isLogin;
  document.getElementById('authTitle').textContent = isLogin ? 'Connexion' : 'Inscription';
  document.getElementById('nomField').style.display = isLogin ? 'none' : 'block';
  document.getElementById('authBtn').textContent = isLogin ? 'Se connecter' : 'S\'inscrire';
  document.getElementById('toggleMode').textContent = isLogin ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter';
  document.getElementById('authModal').classList.add('active');
}

function closeModal() {
  document.getElementById('authModal').classList.remove('active');
}

// Handle auth form
async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  
  if (isLoginMode) {
    const res = await fetch('/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mot_de_passe: password })
    });
    const data = await res.json();
    if (data.success || data.status === 'ok') {
      currentUser = data.user || data.data;
      localStorage.setItem('user', JSON.stringify(currentUser));
      closeModal();
      setupAuth();
      alert('Connecté !');
    } else {
      alert('Erreur: Identifiants incorrects');
    }
  } else {
    const nom = document.getElementById('nomInput').value;
    const res = await fetch('/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom: nom, email, mot_de_passe: password })
    });
    const data = await res.json();
    if (data.success || data.status === 'ok') {
      alert('Compte créé ! Connectez-vous maintenant.');
      isLoginMode = true;
      document.getElementById('emailInput').value = '';
      document.getElementById('passwordInput').value = '';
      document.getElementById('nomInput').value = '';
      openAuthModal(true);
    } else {
      alert('Erreur: Inscription échouée');
    }
  }
}

// Resolve event image
function resolveImage(titre) {
  const lower = titre.toLowerCase();
  const map = imageMap.find(m => lower.includes(m.match));
  return map ? map.file : 'image/logo.png';
}

// Load events
async function loadEvents() {
  try {
    const res = await fetch('/api/events.php');
    const data = await res.json();
    allEvents = data.data || data || [];
    
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    
    allEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="${resolveImage(evt.titre)}" class="event-poster" onerror="this.src='image/logo.png'">
        <div class="event-info">
          <div class="event-title">${evt.titre}</div>
          <div class="event-meta">${evt.ville || evt.nom_ville} • ${evt.categorie}</div>
          <div class="event-price">À partir de ${evt.prix_min || 0}€</div>
        </div>
      `;
      card.onclick = () => goToDetail(evt.id_evenement);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur:', err);
    document.getElementById('eventsGrid').innerHTML = '<p>Impossible de charger les événements</p>';
  }
}

function goToDetail(id) {
  window.location.href = `detail.html?id_evenement=${id}`;
}

// Load categories
async function loadCategories() {
  try {
    const res = await fetch('/api/categories.php');
    const data = await res.json();
    const cats = data.data || data || [];
    
    const container = document.getElementById('filters');
    container.innerHTML = '<button class="filter-btn active" onclick="loadEvents()">Tous</button>';
    
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = cat.libelle || cat.nom;
      btn.onclick = () => filterByCategory(cat.id_categorie || cat.id);
      container.appendChild(btn);
    });
  } catch (err) {
    console.error('Erreur catégories:', err);
  }
}

async function filterByCategory(catId) {
  try {
    const res = await fetch(`/api/events.php?categorie=${catId}`);
    const data = await res.json();
    allEvents = data.data || data || [];
    
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    
    allEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="${resolveImage(evt.titre)}" class="event-poster" onerror="this.src='image/logo.png'">
        <div class="event-info">
          <div class="event-title">${evt.titre}</div>
          <div class="event-meta">${evt.ville || evt.nom_ville}</div>
          <div class="event-price">À partir de ${evt.prix_min || 0}€</div>
        </div>
      `;
      card.onclick = () => goToDetail(evt.id_evenement);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur filtre:', err);
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => hideIntro(), 3000);
  document.getElementById('introOverlay')?.addEventListener('click', hideIntro);
  
  setupAuth();
  loadCategories();
  loadEvents();
  
  document.getElementById('toggleMode')?.addEventListener('click', () => {
    openAuthModal(!isLoginMode);
  });
  
  document.getElementById('authForm')?.addEventListener('submit', handleAuth);
});


