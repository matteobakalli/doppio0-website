// Variabili globali
import { icons } from './icons.js';

let cart = [];
let menuItems = [];
let total = 0;
let selectedItem = null;
let selectedVariations = [];

// Inizializza interfaccia
function initUI() {
    loadMenu();
    setupCart();
}

// Esporta initUI per essere richiamato nel DOMContentLoaded
export { initUI };

// Carica il menu dal JSON
async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) throw new Error("Errore nel caricamento del file JSON");
        menuItems = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Errore nel caricamento del menu:', error);
    }
}

// Renderizza il menu dinamicamente
function renderMenu() {
    const sections = {
        "pizze-classiche": "pizze_classiche",
        "pizze-speciali": "pizze_speciali",
        "calzoni": "calzoni",
        "panozzi": "panozzi",
        "fornarin": "fornarin",
        "dolci": "dolci",
        "bibite": "bibite",
        "variazioni": "variazioni"
    };

    for (let section in sections) {
        const sectionElement = document.getElementById(`${section}-list`);
        if (!sectionElement) continue;
        sectionElement.innerHTML = "";

        if (!menuItems[sections[section]]) continue;

        menuItems[sections[section]].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.nome}</div>
                    <div class="menu-item-ingredienti">${item.ingredienti}</div>
                </div>
                <button class="menu-item-prezzo">${item.prezzo}</button>
            `;

            menuItem.querySelector('.menu-item-prezzo').addEventListener('click', () => openCustomizationModal(item));

            sectionElement.appendChild(menuItem);
        });
    }
}

// Mostra il popup di personalizzazione
export function openCustomizationModal(item) {
    if (!item) return; // Evita di aprire il pop-up se non c'è un elemento selezionato

    selectedItem = item;
    selectedVariations = [];

    document.getElementById('modal-item-name').innerText = item.nome;
    document.getElementById('modal-item-price').innerText = item.prezzo;
    document.getElementById('quantity-selector').value = 1;

    renderVariations();
    updateCustomizationPrice();

    const modal = document.getElementById('customization-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}


// Chiude il popup
export function closeCustomizationModal() {
    const modal = document.getElementById('customization-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Genera la lista delle variazioni
function renderVariations() {
    const variationContainer = document.getElementById('variation-options');
    variationContainer.innerHTML = '';
    if (menuItems.variazioni) {
        menuItems.variazioni.forEach(variation => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = variation.prezzo;
            checkbox.dataset.nome = variation.nome;
            checkbox.addEventListener('change', updateCustomizationPrice);

            const label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(`${variation.nome} (+${variation.prezzo})`));

            variationContainer.appendChild(label);
        });
    }
}

// Aggiorna il prezzo in base alle variazioni e quantità
export function updateCustomizationPrice() {
    if (!selectedItem) return;

    const quantity = parseInt(document.getElementById('quantity-selector').value);
    let basePrice = parseFloat(selectedItem.prezzo.replace('€', ''));
    let variationCost = Array.from(document.querySelectorAll('#variation-options input:checked'))
        .reduce((sum, v) => sum + parseFloat(v.value.replace('€', '')), 0);

    let totalPrice = (basePrice + variationCost) * quantity;
    document.getElementById('modal-item-price').innerText = `${totalPrice.toFixed(2)}€`;
}

// Aggiunge un elemento al carrello
export function confirmAddToCart() {
    const quantity = parseInt(document.getElementById('quantity-selector').value);
    if (!selectedItem) return;
    addToCart(selectedItem, quantity, selectedVariations);
    closeCustomizationModal();
}

// Gestisce il carrello
export function setupCart() {
    const cartButton = document.getElementById('cart-button');
    if (cartButton) { //verifica che l'elemento esista
        cartButton.addEventListener('click', () => {
            openCheckoutModal();
        });
    }
}

export function openCheckoutModal() {
    console.log("openCheckoutModal() chiamata"); // Aggiungi questo

    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    const cartTotalElement = document.getElementById('checkout-cart-total');

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Il carrello è vuoto.</p>";
        cartTotalElement.innerText = "";
    } else {
        cart.forEach(item => {
            let itemTotal = parseFloat(item.prezzo.replace('€', '')) * item.quantita;
            total += itemTotal;

            let itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<p><strong>${item.nome}</strong> x${item.quantita} - ${item.prezzo}</p>`;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartTotalElement.innerText = `Totale: ${total.toFixed(2)}€`;
    }

    modal.style.display = 'flex';
}

// Funzione per chiudere il carrello
export function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}



// Aggiunge al carrello e aggiorna la UI
export function addToCart(item, quantity, variations) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let cartItem = {
        nome: item.nome,
        prezzo: item.prezzo,
        quantita: quantity,
        variazioni: variations
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI(); // 🔥 AGGIUNTO QUI 🔥
}


// Modifica `updateCartUI()` per aggiornare subito il numero

export function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Carica il carrello
    const cartCount = document.getElementById('cart-count');
    if (cartCount) { // Verifica che l'elemento esista (aggiunta questa condizione)
        cartCount.innerText = cart.length; // Aggiorna il contatore
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI(); // Aggiorna l'interfaccia *prima* di chiamare initUI
    initUI();       // Inizializza il resto dell'UI *dopo* l'aggiornamento del contatore
});
