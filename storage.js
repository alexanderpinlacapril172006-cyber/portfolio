const StorageManager = {

    init() {
        if (!localStorage.getItem('astral_initialized')) {

            const defaultProfile = {
                id: 1,
                name: 'ALEXANDER PINLAC',
                path_name: 'Remembrance',
                bio_lead: 'A student in NU Mall of Asia studying BSIT-MWA.',
                full_intelligence: `A College Student and aspiring game developer, currently honing my skills and studying HTML, Javascript and CSS. I have learned how to use Visual Studio and other various compilers. Currently designated as a Second-Year Specialist in BSIT-MWA at National University - Mall of Asia. My primary directive is the mastery of full-stack architecture and interactive environment design.`
            };

            const defaultSkills = [
                { id: 1, skill_name: 'Compassionate', skill_icon: 'Acheron-Compassion-thumb.png' },
                { id: 2, skill_name: 'Resiliency', skill_icon: 'trash.png' },
                { id: 3, skill_name: 'Teamwork Friendly', skill_icon: 'trailblazer-fire-body.png' },
                { id: 4, skill_name: 'Cooking', skill_icon: 'castorice-castorice-hsr.gif' },
                { id: 5, skill_name: 'IT', skill_icon: 'silver-wolf.gif' },
                { id: 6, skill_name: 'Web Developing', skill_icon: 'silver-wolf2.gif' },
            ];

            const defaultProjects = [];

            localStorage.setItem('profile', JSON.stringify(defaultProfile));
            localStorage.setItem('skills', JSON.stringify(defaultSkills));
            localStorage.setItem('projects', JSON.stringify(defaultProjects));
            localStorage.setItem('astral_initialized', 'true');
        }

        this.cleanupPlaceholderProject();
    },

    cleanupPlaceholderProject() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const filtered = projects.filter(project => {
            const placeholderTitles = ['Astral Archive', 'National University'];
            const placeholderLinks = ['#', 'https://www.national-u.edu.ph/'];
            const placeholderImages = ['assets/images/projects/project1.jpg', 'assets/images/projects/national-university.jpg'];

            if (placeholderTitles.includes(project.title)) return false;
            if (placeholderLinks.includes(project.link)) return false;
            if (placeholderImages.includes(project.image)) return false;
            return true;
        });

        if (filtered.length !== projects.length) {
            localStorage.setItem('projects', JSON.stringify(filtered));
        }
    },

    cleanupPlaceholderProject() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        if (projects.length === 1 && projects[0].title === 'National University' && projects[0].link === 'https://www.national-u.edu.ph/') {
            localStorage.setItem('projects', JSON.stringify([]));
        }
    },

    // Profile Management
    getProfile() {
        return JSON.parse(localStorage.getItem('profile')) || {};
    },

    updateProfile(data) {
        localStorage.setItem('profile', JSON.stringify(data));
    },

    // Skills Management
    getSkills() {
        return JSON.parse(localStorage.getItem('skills')) || [];
    },

    addSkill(skillName, skillIcon) {
        const skills = this.getSkills();
        const newSkill = {
            id: Math.max(...skills.map(s => s.id), 0) + 1,
            skill_name: skillName,
            skill_icon: skillIcon
        };
        skills.push(newSkill);
        localStorage.setItem('skills', JSON.stringify(skills));
        return newSkill;
    },

    deleteSkill(id) {
        let skills = this.getSkills();
        skills = skills.filter(s => s.id !== id);
        localStorage.setItem('skills', JSON.stringify(skills));
    },

    // Projects Management
    getProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        return projects.filter(project => {
            const placeholderTitles = ['Astral Archive', 'National University'];
            const placeholderLinks = ['#', 'https://www.national-u.edu.ph/'];
            const placeholderImages = ['assets/images/projects/project1.jpg', 'assets/images/projects/national-university.jpg'];

            if (placeholderTitles.includes(project.title)) return false;
            if (placeholderLinks.includes(project.link)) return false;
            if (placeholderImages.includes(project.image)) return false;
            return true;
        });
    },

    addProject(title, description, link, image) {
        const projects = this.getProjects();
        const newProject = {
            id: Math.max(...projects.map(p => p.id), 0) + 1,
            title: title,
            description: description,
            link: link,
            image: image
        };
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        return newProject;
    },

    updateProject(id, data) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...data };
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    },

    deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
    },

    // Clear all projects
    clearProjects() {
        localStorage.setItem('projects', JSON.stringify([]));
    },

    // Authentication
    isLoggedIn() {
        return sessionStorage.getItem('logged_in') === 'true';
    },

    login(username, password) {
        // Default credentials
        const correct_username = 'alex';
        const correct_password = 'alex123';

        if (username === correct_username && password === correct_password) {
            sessionStorage.setItem('logged_in', 'true');
            return true;
        }
        return false;
    },

    logout() {
        sessionStorage.removeItem('logged_in');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
});