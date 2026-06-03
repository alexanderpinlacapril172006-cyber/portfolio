function initHomePage() {
    // Load profile
    const profile = StorageManager.getProfile();
    const profileNameEl = document.querySelector('h1');
    const profilePathEl = document.querySelector('.text-uppercase');
    const bioLeadEl = document.querySelector('.lead.mb-4.fw-bold');
    const fullIntelEl = document.querySelector('.full-intel-text');

    if (profileNameEl) {
        profileNameEl.textContent = profile.name;
        profileNameEl.style.color = 'var(--sr-gold)';
        profileNameEl.style.letterSpacing = '5px';
    }
    if (profilePathEl) {
        profilePathEl.textContent = profile.path_name;
        profilePathEl.style.letterSpacing = '10px';
    }
    if (bioLeadEl) bioLeadEl.textContent = profile.bio_lead;
    if (fullIntelEl) fullIntelEl.textContent = profile.full_intelligence;

    // Load skills
    const skillsContainer = document.querySelector('#skills .row');
    if (skillsContainer) {
        const skills = StorageManager.getSkills();
        skillsContainer.innerHTML = '';
        if (skills.length > 0) {
            skills.forEach(skill => {
                skillsContainer.innerHTML += `
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="skill-box">
                            <img src="assets/images/${skill.skill_icon}" class="skill-icon" alt="${skill.skill_name}">
                            <h5 class="fw-bold text-uppercase" style="color: var(--sr-gold); letter-spacing: 2px;">${escapeHtml(skill.skill_name)}</h5>
                        </div>
                    </div>
                `;
            });
        } else {
            skillsContainer.innerHTML = '<p class="text-center text-secondary">No skills added yet.</p>';
        }
    }

    // Load projects
    const projectsContainer = document.querySelector('#projects');
    if (projectsContainer) {
        const projects = StorageManager.getProjects();
        projectsContainer.innerHTML = '';
        if (projects.length > 0) {
            projects.forEach(project => {
                projectsContainer.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${escapeHtml(project.image)}" class="card-img-top" alt="${escapeHtml(project.title)}" style="height: 220px; object-fit: cover;">
                            <div class="card-body">
                                <h5 style="color: var(--sr-gold);">${escapeHtml(project.title)}</h5>
                                <p class="small text-secondary">${escapeHtml(project.description)}</p>
                                <a href="${escapeHtml(project.link)}" class="btn btn-outline-warning w-100 btn-sm mt-auto">ACCESS DATA</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            projectsContainer.innerHTML = '<p class="text-center text-secondary col-12">No projects added yet.</p>';
        }
    }

    // Music player
    initMusicPlayer();
}

// Initialize music player for home page
function initMusicPlayer() {
    const indexTracks = [
        "assets/audio/Hearthfire.mp3",
        "assets/audio/Embers.mp3",
        "assets/audio/Under the Seat of Dawn.mp3",
        "assets/audio/Promenade of Tides.mp3"
    ];

    let trackPointer = 0;
    const player = document.getElementById('index-loop-player');

    if (!player) return;

    function startPlaylist(idx) {
        if (idx >= indexTracks.length) idx = 0;
        trackPointer = idx;
        player.src = indexTracks[trackPointer];
        player.volume = 0.3;
        player.autoplay = true;
        player.loop = true;
        player.muted = false;
        player.play().catch(() => {
            document.addEventListener('click', () => { player.play(); }, { once: true });
        });
    }

    player.addEventListener('ended', () => {
        trackPointer++;
        startPlaylist(trackPointer);
    });

    // Start on window load
    window.addEventListener('load', () => startPlaylist(0));
}

// Admin page functionality
function initAdminPage() {
    // Check if logged in
    if (!StorageManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    // Admin logic is handled in admin.js
}

// Login page functionality
function initLoginPage() {
    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (StorageManager.login(username, password)) {
                window.location.href = 'admin.html';
            } else {
                const errorEl = document.getElementById('login_error');
                if (errorEl) {
                    errorEl.textContent = 'INVALID ACCESS KEY OR IDENTITY.';
                    errorEl.style.display = 'block';
                }
            }
        });
    }
}

// Logout functionality
function logout() {
    StorageManager.logout();
    window.location.href = 'login.html';
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage.includes('indexhome')) {
        initHomePage();
    } else if (currentPage.includes('admin')) {
        initAdminPage();
    } else if (currentPage.includes('login')) {
        initLoginPage();
    }
});