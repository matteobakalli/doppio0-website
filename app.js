import { icons } from './icons.js';

// Configurazione iniziale
let cart = [];
let menuItems = []; // Carica da menu.json

// Inizializza interfaccia
function initUI() {
    // Bottone carrello
    const cartButton = document.getElementById('cart-button');
    cartButton.innerHTML = `${icons.cart}<span id="cart-count">0</span>`;

    // Carica menu
    loadMenu();
}

// Funzione per generare gli elementi del menu
function renderMenu() {
    const container = document.getElementById('menu-container');
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="item-content">
                <div class="item-name">${item.nome}</div>
                <div class="item-ingredients">${item.ingredienti}</div>
            </div>
            <div class="price-controls">
                <div class="quantity-selector">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="dynamic-price">${item.prezzo}</button>
            </div>
        `;
        
        // Gestione quantità
        let quantity = 1;
        const priceElement = menuItem.querySelector('.dynamic-price');
        const updatePrice = () => {
            const price = parseFloat(item.prezzo.replace('€', '')) * quantity;
            priceElement.textContent = `${price.toFixed(2)}€`;
        };

        menuItem.querySelector('.plus').addEventListener('click', () => {
            quantity++;
            menuItem.querySelector('.quantity').textContent = quantity;
            updatePrice();
        });

        menuItem.querySelector('.minus').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                menuItem.querySelector('.quantity').textContent = quantity;
                updatePrice();
            }
        });

        // Aggiungi al carrello
        priceElement.addEventListener('click', () => {
            for (let i = 0; i < quantity; i++) {
                cart.push(item);
            }
            updateCartCounter();
        });

        container.appendChild(menuItem);
    });
}

// Funzione per aggiornare il contatore del carrello
function updateCartCounter() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Inizializza l'app
document.addEventListener('DOMContentLoaded', initUI);