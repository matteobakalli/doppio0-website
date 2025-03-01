// Funzione per caricare il menu dal file JSON
async function loadMenu() {
    const response = await fetch('menu.json');
    const menu = await response.json();

    // Popola le sezioni del menu
    populateMenuSection('pizze-classiche-list', menu.pizze_classiche);
    populateMenuSection('pizze-speciali-list', menu.pizze_speciali);
    populateMenuSection('panozzi-list', menu.panozzi);
    populateMenuSection('dolci-list', menu.dolci);
}

// Funzione per popolare una sezione del menu
function populateMenuSection(sectionId, items) {
    const section = document.getElementById(sectionId);
    section.innerHTML = items.map(item => `
        <div class="menu-item" data-type="${item.tipo}">
            <span>${item.nome} - ${item.ingredienti}</span> <span>${item.prezzo}</span>
        </div>
    `).join('');
}

// Funzione per filtrare le pizze
function filterPizzas(type) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (type === 'all' || item.getAttribute('data-type') === type) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Aggiorna lo stato attivo dei pulsanti
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().includes(type)) {
            button.classList.add('active');
        }
    });
}

// Carica il menu al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadMenu);