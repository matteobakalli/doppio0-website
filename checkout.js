document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Il carrello è vuoto.</p>";
        cartTotalElement.innerText = "";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        let itemTotal = parseFloat(item.prezzo.replace('€', '')) * item.quantita;
        total += itemTotal;

        let itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p><strong>${item.nome}</strong> x${item.quantita} - ${item.prezzo}</p>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalElement.innerText = `Totale: ${total.toFixed(2)}€`;

    document.getElementById('checkout-button').addEventListener('click', () => {
        alert('Funzione di pagamento non implementata.');
    });
});
