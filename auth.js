// ==================== AUTHENTICATION SYSTEM ====================

// Initialize demo admin account
function initializeDemoAccounts() {
    let users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    
    // Check if admin already exists
    const adminExists = users.some(u => u.email === 'admin@billetterie.com');
    
    if (!adminExists) {
        const demoUsers = [
            {
                id: 'admin_001',
                name: 'Admin Billetterie',
                email: 'admin@billetterie.com',
                password: 'Admin@2026',
                role: 'admin',
                createdAt: new Date().toISOString(),
                avatar: '👨‍💼'
            },
            {
                id: 'creator_001',
                name: 'Jean Createur',
                email: 'creator@example.com',
                password: 'Creator@2026',
                role: 'creator',
                createdAt: new Date().toISOString(),
                avatar: '👨‍🎨'
            },
            {
                id: 'user_001',
                name: 'Marie Client',
                email: 'user@example.com',
                password: 'User@2026',
                role: 'user',
                createdAt: new Date().toISOString(),
                avatar: '👩‍💼'
            }
        ];
        
        users = [...users, ...demoUsers];
        localStorage.setItem('billetterie_users', JSON.stringify(users));
    }
}

// Switch to Register Form
function switchToRegister() {
    document.getElementById('login-form-wrapper').style.display = 'none';
    document.getElementById('register-form-wrapper').style.display = 'block';
}

// Switch to Login Form
function switchToLogin() {
    document.getElementById('register-form-wrapper').style.display = 'none';
    document.getElementById('login-form-wrapper').style.display = 'block';
}

// Handle Login
document.addEventListener('DOMContentLoaded', () => {
    initializeDemoAccounts();
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            login(email, password);
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            const role = document.getElementById('register-role').value;
            
            if (password !== confirm) {
                showError('Les mots de passe ne correspondent pas');
                return;
            }
            
            register(name, email, password, role);
        });
    }
    
    // Guest Mode Button
    const guestBtn = document.querySelector('.auth-button.guest');
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            loginAsGuest();
        });
    }
});

// Login Function
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showError('Email ou mot de passe incorrect');
        return;
    }
    
    // Create session
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        loginTime: new Date().toISOString(),
        isGuest: false
    };
    
    sessionStorage.setItem('billetterie_session', JSON.stringify(session));
    localStorage.setItem('billetterie_lastLogin', JSON.stringify(session));
    
    // Redirect based on role
    redirectByRole(user.role);
}

// Register Function
function register(name, email, password, role) {
    const users = JSON.parse(localStorage.getItem('billetterie_users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showError('Cet email est déjà utilisé');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        createdAt: new Date().toISOString(),
        avatar: role === 'creator' ? '👨‍🎨' : '👤'
    };
    
    users.push(newUser);
    localStorage.setItem('billetterie_users', JSON.stringify(users));
    
    showSuccess('Compte créé avec succès! Vous allez être redirigé...');
    
    // Auto-login
    setTimeout(() => {
        login(email, password);
    }, 1000);
}

// Guest Mode
function loginAsGuest() {
    const session = {
        userId: 'guest_' + Date.now(),
        email: null,
        name: 'Visiteur',
        role: 'guest',
        avatar: '👁️',
        loginTime: new Date().toISOString(),
        isGuest: true
    };
    
    sessionStorage.setItem('billetterie_session', JSON.stringify(session));
    window.location.href = 'index.html';
}

// Redirect by Role
function redirectByRole(role) {
    if (role === 'admin') {
        window.location.href = 'dashboard.html';
    } else if (role === 'creator') {
        window.location.href = 'creator-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Get Current Session
function getCurrentSession() {
    return JSON.parse(sessionStorage.getItem('billetterie_session')) || null;
}

// Logout
function logout() {
    sessionStorage.removeItem('billetterie_session');
    window.location.href = 'auth.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentSession() !== null;
}

// Get user role
function getUserRole() {
    const session = getCurrentSession();
    return session ? session.role : 'guest';
}

// Show Error Message
function showError(message) {
    const div = document.createElement('div');
    div.className = 'notification error';
    div.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// Show Success Message
function showSuccess(message) {
    const div = document.createElement('div');
    div.className = 'notification success';
    div.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// Protect routes - redirect to login if not authenticated
function protectRoute(requiredRole = null) {
    const session = getCurrentSession();
    
    if (!session) {
        window.location.href = 'auth.html';
        return false;
    }
    
    if (requiredRole && session.role !== requiredRole && session.role !== 'admin') {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Demo credentials for testing
window.DEMO_ACCOUNTS = {
    admin: { email: 'admin@billetterie.com', password: 'Admin@2026' },
    creator: { email: 'creator@example.com', password: 'Creator@2026' },
    user: { email: 'user@example.com', password: 'User@2026' }
};
