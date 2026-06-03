function loadAdminProfile() {
    const profile = StorageManager.getProfile();
    document.getElementById('profile_name').value = profile.name || '';
    document.getElementById('profile_path').value = profile.path_name || '';
    document.getElementById('bio_lead').value = profile.bio_lead || '';
    document.getElementById('full_intelligence').value = profile.full_intelligence || '';
}

// Update profile
function updateProfile() {
    const name = document.getElementById('profile_name').value;
    const path_name = document.getElementById('profile_path').value;
    const bio_lead = document.getElementById('bio_lead').value;
    const full_intelligence = document.getElementById('full_intelligence').value;

    if (!name || !path_name || !bio_lead || !full_intelligence) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    const updatedProfile = {
        id: 1,
        name: name,
        path_name: path_name,
        bio_lead: bio_lead,
        full_intelligence: full_intelligence
    };

    StorageManager.updateProfile(updatedProfile);
    showMessage('Archive Profile Updated!', 'success');
}


function loadAdminSkills() {
    const skills = StorageManager.getSkills();
    const skillsList = document.getElementById('skills_list');
    skillsList.innerHTML = '';

    if (skills.length > 0) {
        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-list-item';
            skillItem.innerHTML = `
                <span>
                    <img src="assets/images/${escapeHtml(skill.skill_icon)}" alt="${escapeHtml(skill.skill_name)}"> 
                    ${escapeHtml(skill.skill_name)}
                </span>
                <button class="btn-delete-skill" onclick="deleteSkill(${skill.id})" title="Expunge this skill">×</button>
            `;
            skillsList.appendChild(skillItem);
        });
    } else {
        const emptyItem = document.createElement('div');
        emptyItem.className = 'skill-list-item';
        emptyItem.innerHTML = '<span>No skills added yet</span>';
        skillsList.appendChild(emptyItem);
    }
}


function addSkill() {
    const skillName = document.getElementById('skill_name').value.trim();
    const skillIconInput = document.getElementById('skill_icon');

    if (!skillName || !skillIconInput.files || !skillIconInput.files[0]) {
        showMessage('Please fill in all skill fields.', 'error');
        return;
    }

    const file = skillIconInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const iconData = e.target.result;
        StorageManager.addSkill(skillName, iconData);
        document.getElementById('skill_name').value = '';
        document.getElementById('skill_icon').value = '';
        loadAdminSkills();
        showMessage('Skill Added to Archive!', 'success');
    };
    
    reader.readAsDataURL(file);
}


function deleteSkill(id) {
    if (confirm('Expunge this skill?')) {
        StorageManager.deleteSkill(id);
        loadAdminSkills();
        showMessage('Skill Expunged from Archive!', 'success');
    }
}


function addProject() {
    const title = document.getElementById('project_title').value.trim();
    const description = document.getElementById('project_description').value.trim();
    const link = document.getElementById('project_link').value.trim();
    const imageInput = document.getElementById('project_image');

    if (!title || !description || !link) {
        showMessage('Please fill in all project fields.', 'error');
        return;
    }

    // Handle file upload
    let imagePath = 'assets/images/projects/default.jpg';
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {

            imagePath = e.target.result;
            
            StorageManager.addProject(title, description, link, imagePath);
            
            document.getElementById('project_form').reset();
            showMessage('Project Archived Successfully!', 'success');
        };
        
        reader.readAsDataURL(file);
    } else {
        StorageManager.addProject(title, description, link, imagePath);
        document.getElementById('project_form').reset();
        showMessage('Project Archived Successfully!', 'error');
    }
}


function deleteProject(id) {
    if (confirm('Delete this project?')) {
        StorageManager.deleteProject(id);
        loadAdminProjects();
        showMessage('Project deleted!', 'success');
    }
}


function resetProjects() {
    if (!confirm('This will permanently remove ALL projects. Continue?')) return;
    StorageManager.clearProjects();
    loadAdminProjects();
    showMessage('All projects have been reset to empty.', 'success');
}


function loadAdminProjects() {
    const projects = StorageManager.getProjects();

}


function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        
        if (type === 'success') {
            messageEl.style.background = 'rgba(0, 255, 150, 0.1)';
            messageEl.style.border = '1px solid rgba(0, 255, 150, 0.3)';
            messageEl.style.color = '#00ff96';
        } else {
            messageEl.style.background = 'rgba(255, 0, 0, 0.1)';
            messageEl.style.border = '1px solid rgba(255, 0, 0, 0.3)';
            messageEl.style.color = '#ff6666';
        }
        
        messageEl.style.display = 'block';
    }
}

function startAdminMusic() {
    const adminMusic = document.getElementById('admin-music');
    if (!adminMusic) return;
    
    adminMusic.volume = 0.6;
    adminMusic.muted = false;
    adminMusic.play().catch(() => {
        console.log('Admin audio autoplay blocked');
        document.addEventListener('click', () => {
            adminMusic.play().catch(() => {});
        }, { once: true });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in
    if (!StorageManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    loadAdminProfile();
    loadAdminSkills();
    loadAdminProjects();
    startAdminMusic();
});