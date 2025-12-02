import { fetchWithTimeout, getState, setState, showMessage } from './util.js';

let cart = [];

function getCartStorageKey() {
    const state = getState();
    if (state.userdata !== undefined && state.userdata.id !== undefined) {
        return `cart_user_${state.userdata.id}`;
    }
    showMessage('You are not logged in. Your cart will not be saved after you leave the site.', 'warn');
    return null;
}

async function loadCart() {
    const key = getCartStorageKey();
    if (key) {
        try {
            const raw = localStorage.getItem(key);
            cart = raw ? JSON.parse(raw) : [];

            cart = await fetchWithTimeout(`/carts/${key}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (cart.detail !== undefined) {
                cart = [];
            }
        } catch (e) {
            cart = [];
        }
    } else {
        // guest cart lives only in memory and will be reset on reload
        cart = [];
    }
    renderCartCount();
}

function saveCart() {
    const key = getCartStorageKey();
    if (key) {

        try {
            const response = fetchWithTimeout(`/carts/${key}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cart)
            });

            if (response.detail !== undefined) {        
                const state = getState();
                state.cart = cart;
                setState(state);
                showMessage('Saved cart.');
            } else {
                showMessage(`Failed to save cart: ${response.detail.error}.`, 'error');
            }
        } catch (e) {
            showMessage('Failed to save cart to server.', 'error');
        }
    }
}

function renderCartCount() {
    const el = EQuery('#cart-count');
    const totalItems = cart.reduce((s, p) => s + (p.qty || 1), 0);
    el.text(totalItems > 0 ? String(totalItems) : '');
}

/*
 * Very unsafe.
function findProductInfoFromButton(btn) {
    // walk up to .product-card
    let card = btn.parentElement;
    if (!card) {
        // Fallback: try to parse from nearby elements
        return null;
    }
    const id = btn.dataset.product || card.dataset.product || (card.querySelector('[data-product]') && card.querySelector('[data-product]').dataset.product) || null;
    const nameEl = card.querySelector('h3') || card.querySelector('h2') || card.querySelector('.product-header h3');
    const priceEl = card.querySelector('.product-price');
    let name = nameEl ? nameEl.textContent.trim() : (id || 'Item');
    let price = 0;
    if (priceEl) {
        const txt = priceEl.textContent || priceEl.innerText;
        const match = txt.replace(/[^0-9.\-]/g, '');
        price = parseFloat(match) || 0;
    }
    return { id: id || name.toLowerCase().replace(/\s+/g, '-'), name, price };
} */

function addToCart(product, qty = 1) {
    if (!product) return;
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
        existing.qty = (existing.qty || 1) + qty;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: qty });
    }
    saveCart();
    renderCartCount();
    showMessage(`${product.name} added to cart.`, 'success');
}

function escapeHtml(str) {
    return String(str).replace(/[&<>\"]+/g, function(s){
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s];
    });
}

async function initCartPage() {
    // load cart from storage (if logged) or keep in-memory
    const container = EQuery('#cart-container');
    const emptyEl = EQuery('#cart-empty');
    const summaryEl = EQuery('#cart-summary');
    const subtotalEl = EQuery('#cart-subtotal');

    // If this page was opened via navigation from same tab (guest cart in memory), cart variable may reflect it.
    // For logged users, reload from localStorage to ensure persistence.
    const key = getCartStorageKey();
    if (key) {
        await loadCart();
    }

    function render() {
        console.log(cart)
        if (!container) return;
        if (!cart || cart.length === 0) {
            emptyEl.show();
            summaryEl.hide();
            return;
        }
        emptyEl.hide();
        summaryEl.removeAttr('style');

        let subtotal = 0;
        cart.forEach(item => {
            container.removeChildren();

            const row = EQuery.elemt('div', [
                EQuery.elemt('div', [
                    EQuery.elemt('div', '🛒', null, null, 'width:56px;height:56px;background:#111;display:flex;align-items:center;justify-content:center;border-radius:8px;'),
                    EQuery.elemt('div', [
                        EQuery.elemt('div', escapeHtml(item.name), null, null, 'font-weight:700'),
                        EQuery.elemt('div', [
                            'Qty: ',
                            EQuery.elemt('input', null, null, { type: 'number', min: '1', value: item.qty, 'data-id': item.id, class: 'cart-qty', style: 'width:60px' })
                        ], null, null, 'opacity:.7;font-size:13px')
                    ])
                ], null, null, 'display:flex;gap:12px;align-items:center;'),
                EQuery.elemt('div', [
                    EQuery.elemt('div', `$${(item.price * item.qty).toFixed(2)}`, null, null, 'font-weight:700'),
                    EQuery.elemt('button', 'Remove', 'minecraft-btn remove-from-cart', { 'data-id': item.id }, 'margin-top:6px')
                ], null, null, 'text-align:right;min-width:130px')
            ], 'cart-item', null, `display: flex;justify-content: space-between;align-items: center;padding: 12px 8px;border-bottom: 1px solid rgba(255,255,255,0.06);`);

            container.append(row);
            subtotal += (item.price * item.qty);
        });

        subtotalEl.text(`$${subtotal.toFixed(2)}`);

        // attach remove handlers & qty handlers

        container.find('.remove-from-cart').forEach(btn => {
            btn.click(() => {
                const id = btn.attr('data-id');
                cart = cart.filter(p => p.id !== id);
                saveCart();
                render();
                renderCartCount();
            });
        });

        container.find('.cart-qty').forEach(input => {
            input.change((e) => {
                const id = input.attr('data-id');
                let v = parseInt(input.val()) || 1;
                if (v < 1) v = 1; input.val(v);
                const it = cart.find(p => p.id === id);
                if (it) it.qty = v;
                saveCart(); render(); renderCartCount();
            });
        });
    }

    render();

    const checkout = EQuery('#checkout-btn');
    checkout.click(function () {
        if (!cart || cart.length === 0) {
            showMessage('Your cart is empty', 'error');
            return;
        }
        showMessage('Checkout not implemented in this demo', 'info');
    });
}

async function appendShopProducts(size = 20, badge = 'default') {
    let shop = [];

    EQuery('#store-grid-loading').show().spinner();

    try {
        shop = await fetchWithTimeout(`/products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        showMessage(`Failed to load products from server: ${e}`, 'error');
    }

    EQuery('#store-grid-loading').hide().find('.e-spinner').remove();
    if (shop.length == 0) return;
    EQuery('#store-grid').removeChildren();
    for (let i = 0; i < shop.length; i++) {
        const product = shop[i];
        console.log(product)
        if (i >= size) return;
        if (!product.id || !product.name || !product.price) return;
        if (badge !== 'default' && product.badge.toLowerCase() !== badge) return;

        const button = EQuery.elemt('button', 'Purchase', 'minecraft-btn buy-btn', { 'data-product': product.id });
        const card = EQuery.elemt('div', [
            product.badge || product.badge !== '' ? EQuery.elemt('div', badge, `product-badge ${badge.toLowerCase()}`) : null,
            EQuery.elemt('div', [
                EQuery.elemt('div', product.icon || '🛍️', 'product-icon'),
                EQuery.elemt('h3', escapeHtml(product.name))
            ], 'product-header'),
            EQuery.elemt('div', `$${product.price.toFixed(2)}`, 'product-price'),
            EQuery.elemt('div', [
                product.features ? EQuery.elemt('ul', product.features.map(f => EQuery.elemt('li', escapeHtml(f))).filter(f => f !== null), 'product-features') :
                product.description ? EQuery.elemt('p', escapeHtml(product.description || ''), 'product-description') : null
            ], 'product-content'),
            button
        ], 'product-card', null, {'data-category': product.category || 'general'});

        button.click(() => {
            addToCart(product, 1);
        });
        console.log(card)

        EQuery('#store-grid').append(card);
    }
}

export { initCartPage, addToCart, saveCart, appendShopProducts };
