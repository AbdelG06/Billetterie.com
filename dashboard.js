// ==================== DASHBOARD INITIALIZATION ====================

// Protect dashboard - only admin can access
document.addEventListener('DOMContentLoaded', () => {
    if (!protectRoute('admin')) {
        return;
    }

    const session = getCurrentSession();
    
    // Update user info in topbar
    document.getElementById('user-avatar').textContent = session.avatar;
    document.getElementById('user-name').textContent = session.name;

    // Load data
    loadUsersData();
    loadEventsData();
    loadReservationsData();
    updateStats();

    // Setup menu
    setupMenuNavigation();
    setupSidebar();
});

// ==================== MENU NAVIGATION ====================
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all items
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Get section
            const section = item.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(s => {
                s.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(`${section}-section`).classList.add('active');
            
            // Update page title
            document.getElementById('page-title').textContent = item.textContent.trim();
        });
    });
}

// ==================== SIDEBAR TOGGLE ====================
function setupSidebar() {
    const sidebar = document.getElementById('dashboard-sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const menuToggle = document.getElementById('menu-toggle');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar on mobile when clicking menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
}

// ==================== LOAD USERS DATA ====================
function loadUsersData() {
    const users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    const tbody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">Aucun utilisateur</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-cell">
                    <span class="user-avatar">${user.avatar}</span>
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge role-${user.role}">
                    ${user.role === 'admin' ? 'Admin' : user.role === 'creator' ? 'Créateur' : 'Utilisateur'}
                </span>
            </td>
            <td>${new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
            <td>
                <button class="action-btn" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn danger" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.getElementById('users-count').textContent = users.length;
}

// ==================== LOAD EVENTS DATA ====================
function loadEventsData() {
    const events = JSON.parse(localStorage.getItem('billetterie_events')) || 
                   JSON.parse(localStorage.getItem('reservations')) || [];
    
    const grid = document.getElementById('events-grid');
    
    if (events.length === 0) {
        grid.innerHTML = '<p class="empty-message">Aucun événement</p>';
        return;
    }

    grid.innerHTML = events.map(event => `
        <div class="event-card-admin">
            <div class="event-header">
                <h3>${event.eventTitle || event.titre || 'Événement'}</h3>
                <span class="status-badge active">Actif</span>
            </div>
            <p class="event-date">
                <i class="fas fa-calendar"></i> ${new Date(event.date || event.date_evenement).toLocaleDateString('fr-FR')}
            </p>
            <p class="event-price">
                <i class="fas fa-dollar-sign"></i> ${event.totalPrice || event.price || '0'} DH
            </p>
            <div class="event-actions">
                <button class="btn-sm">Éditer</button>
                <button class="btn-sm danger">Supprimer</button>
            </div>
        </div>
    `).join('');

    document.getElementById('events-count').textContent = events.length;
}

// ==================== LOAD RESERVATIONS DATA ====================
function loadReservationsData() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const tbody = document.getElementById('reservations-table-body');
    
    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-message">Aucune réservation</td></tr>';
        return;
    }

    tbody.innerHTML = reservations.slice(0, 10).map(res => `
        <tr>
            <td><span class="ticket-id">${res.ticketId || 'TKT-' + res.id}</span></td>
            <td>${res.customerInfo?.name || res.name || 'Anonyme'}</td>
            <td>${res.eventTitle || 'Événement'}</td>
            <td>${res.quantity || 1}</td>
            <td>${res.totalPrice || res.price || 0} DH</td>
            <td>${new Date(res.date || res.createdAt).toLocaleDateString('fr-FR')}</td>
            <td>
                <button class="action-btn" onclick="viewReservation('${res.ticketId || res.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.getElementById('reservations-count').textContent = reservations.length;
}

// ==================== UPDATE STATISTICS ====================
function updateStats() {
    const users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    const events = JSON.parse(localStorage.getItem('billetterie_events')) || [];
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Filter out non-guest users
    const activeUsers = users.filter(u => u.role !== 'guest');
    
    // Calculate revenue
    const totalRevenue = reservations.reduce((sum, r) => {
        return sum + (r.totalPrice || 0);
    }, 0);

    document.getElementById('stat-users').textContent = activeUsers.length;
    document.getElementById('stat-events').textContent = events.length;
    document.getElementById('stat-reservations').textContent = reservations.length;
    document.getElementById('stat-revenue').textContent = `${totalRevenue} DH`;

    // Update activity list
    updateActivityList(users, reservations);
}

// ==================== UPDATE ACTIVITY LIST ====================
function updateActivityList(users, reservations) {
    const activityList = document.getElementById('activity-list');
    const activities = [];

    // Add user registrations
    users.slice(-3).forEach(user => {
        activities.push({
            type: 'user',
            message: `Nouvel utilisateur: ${user.name}`,
            time: new Date(user.createdAt).toLocaleDateString('fr-FR'),
            icon: '👤'
        });
    });

    // Add reservations
    reservations.slice(-2).forEach(res => {
        activities.push({
            type: 'reservation',
            message: `Réservation: ${res.customerInfo?.name || 'Client'} pour ${res.eventTitle}`,
            time: new Date(res.date).toLocaleDateString('fr-FR'),
            icon: '🎫'
        });
    });

    if (activities.length === 0) {
        activityList.innerHTML = '<p class="empty-message">Aucune activité récente</p>';
        return;
    }

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <span class="activity-icon">${activity.icon}</span>
            <div class="activity-content">
                <p>${activity.message}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// ==================== USER MANAGEMENT ====================
function editUser(userId) {
    alert('Édition utilisateur: ' + userId);
}

function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
        let users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('billetterie_users', JSON.stringify(users));
        
        showSuccess('Utilisateur supprimé');
        loadUsersData();
        updateStats();
    }
}

// ==================== RESERVATION MANAGEMENT ====================
function viewReservation(ticketId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations.find(r => r.ticketId === ticketId || r.id === ticketId);
    
    if (!reservation) {
        showError('Réservation non trouvée');
        return;
    }

    alert(`Détails de la réservation:\n\nTicket: ${reservation.ticketId}\nUtilisateur: ${reservation.customerInfo?.name}\nÉvénement: ${reservation.eventTitle}\nQuantité: ${reservation.quantity}\nPrix: ${reservation.totalPrice} DH`);
}

// ==================== SETTINGS ====================
function saveSettings() {
    const name = document.getElementById('setting-name').value;
    const email = document.getElementById('setting-email').value;
    
    if (!name || !email) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    const session = getCurrentSession();
    session.name = name;
    sessionStorage.setItem('billetterie_session', JSON.stringify(session));

    // Update user in users list
    let users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    const userIndex = users.findIndex(u => u.id === session.userId);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        localStorage.setItem('billetterie_users', JSON.stringify(users));
    }

    showSuccess('Paramètres enregistrés avec succès');
    document.getElementById('user-name').textContent = name;
}

// ==================== MODAL MANAGEMENT ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Setup modal buttons
document.addEventListener('DOMContentLoaded', () => {
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => openModal('add-user-modal'));
    }

    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Utilisateur ajouté');
            closeModal('add-user-modal');
            loadUsersData();
        });
    }

    // Load settings
    const session = getCurrentSession();
    if (session) {
        document.getElementById('setting-name').value = session.name || '';
        document.getElementById('setting-email').value = session.email || '';
    }
});
