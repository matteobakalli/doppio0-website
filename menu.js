// Funzione per caricare il menu dal file JSON
async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        const menu = await response.json();

        // Popola le sezioni del menu
        populateMenuSection('pizze-classiche-list', menu.pizze_classiche);
        populateMenuSection('pizze-speciali-list', menu.pizze_speciali);
        populateMenuSection('calzoni-list', menu.calzoni);
        populateMenuSection('panozzi-list', menu.panozzi);
        populateMenuSection('fornarin-list', menu.fornarin);
        populateMenuSection('variazioni-list', menu.variazioni);
        populateMenuSection('dolci-list', menu.dolci);
    } catch (error) {
        console.error('Errore nel caricamento del menu:', error);
    }
}

// Funzione per popolare una sezione del menu
function populateMenuSection(sectionId, items) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.innerHTML = items.map(item => `
            <div class="menu-item" data-type="${item.tipo}">
                <span>${item.nome} - ${item.ingredienti}</span> <span>${item.prezzo}</span>
            </div>
        `).join('');
    }
}

// Funzione per filtrare le sezioni del menu
function filterMenu(type) {
    const sections = ['pizze-classiche', 'pizze-speciali', 'calzoni', 'panozzi', 'fornarin', 'variazioni', 'dolci'];
    sections.forEach(section => {
        const sectionElement = document.getElementById(section);
        if (type === 'all' || section.includes(type)) {
            sectionElement.style.display = 'block';
        } else {
            sectionElement.style.display = 'none';
        }
    });

    // Aggiorna lo stato attivo dei pulsanti
    const buttons = document.querySelectorAll('.dropdown-content a');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().includes(type)) {
            button.classList.add('active');
        }
    });

    // Scorrimento alla sezione corretta in base al tipo di filtro
    let targetSection;
    if (type === 'all') {
        targetSection = document.getElementById('pizze-classiche');
    } else {
        targetSection = document.getElementById(type);
    }

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funzione per cercare piatti nel menu
function searchMenu() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        if (itemText.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Carica il menu al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadMenu);