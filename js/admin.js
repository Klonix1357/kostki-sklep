// SIDEBAR, otwieranie/zamykanie na małych ekranach
const sidebar = document.getElementById('adminSidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');

if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        if (overlay) {
            overlay.classList.toggle('show');
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    });
}

// aktywny link w sidebarze
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});