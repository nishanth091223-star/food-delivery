
const foodItems = [
    {
        id: 1,
        name: "Cheese Pizza",
        description: "Delicious pizza with mozzarella cheese.",
        price: 249,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 2,
        name: "Veg Burger",
        description: "Crispy vegetable patty with fresh vegetables.",
        price: 129,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 3,
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with spicy chicken.",
        price: 199,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500"
    },
    {
        id: 4,
        name: "French Fries",
        description: "Golden crispy and delicious french fries.",
        price: 99,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 5,
        name: "Chocolate Cake",
        description: "Soft and creamy chocolate dessert.",
        price: 149,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    },
    {
        id: 6,
        name: "Sandwich",
        description: "Fresh sandwich with cheese and vegetables.",
        price: 119,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"
    },
    {
        id: 7,
        name: "Pasta",
        description: "Creamy pasta with delicious Italian sauce.",
        price: 179,
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500"
    },
    {
        id: 8,
        name: "Ice Cream",
        description: "Cold and creamy vanilla ice cream.",
        price: 89,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"
    },
    {
        id: 9,
        name: "Dosa",
        description: "Traditional crispy South Indian dosa.",
        price: 80,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500"
    }
];

// DOM elements
const foodContainer = document.getElementById("foodContainer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("deliveryFee");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("totalPrice");

const checkoutBtn = document.getElementById("checkoutBtn");

// Load cart from Local Storage
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("foodieCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            foodItems.some(food => food.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99
        );
    }
} catch (error) {
    cart = [];
}

// Currency formatting
function formatPrice(amount) {
    return "₹" + amount.toFixed(2);
}

// Save cart
function saveCart() {
    localStorage.setItem(
        "foodieCart",
        JSON.stringify(cart)
    );
}

// Display food menu
function displayFood() {

    foodContainer.innerHTML = "";

    foodItems.forEach(food => {

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">

            <div class="food-info">

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-bottom">

                    <span class="food-price">
                        ${formatPrice(food.price)}
                    </span>

                    <button class="add-btn"
                        data-id="${food.id}">
                        <i class="fas fa-plus"></i>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        foodContainer.appendChild(card);

    });

}

// Add food to cart
foodContainer.addEventListener("click", event => {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const foodId = Number(button.dataset.id);

    addToCart(foodId);

});

// Add to cart function
function addToCart(foodId) {

    const food = foodItems.find(
        item => item.id === foodId
    );

    if (!food) return;

    const existingItem = cart.find(
        item => item.id === foodId
    );

    if (existingItem) {

        if (existingItem.quantity >= 99) {
            alert("Maximum quantity reached.");
            return;
        }

        existingItem.quantity++;

    } else {

        cart.push({
            id: foodId,
            quantity: 1
        });

    }

    saveCart();
    displayCart();

}

// Increase or decrease quantity
function changeQuantity(foodId, amount) {

    const item = cart.find(
        item => item.id === foodId
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(foodId);
        return;

    }

    saveCart();
    displayCart();

}

// Remove item
function removeFromCart(foodId) {

    cart = cart.filter(
        item => item.id !== foodId
    );

    saveCart();
    displayCart();

}

// Display cart
function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty!</h3>
                <p>Add some delicious food to get started.</p>
            </div>
        `;

    }

    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach(item => {

        const food = foodItems.find(
            food => food.id === item.id
        );

        if (!food) return;

        const itemTotal = food.price * item.quantity;

        subtotal += itemTotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${food.image}" alt="${food.name}">

            <div class="cart-item-info">

                <h4>${food.name}</h4>

                <p>${formatPrice(itemTotal)}</p>

                <div class="quantity-controls">

                    <button data-action="decrease"
                        data-id="${food.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button data-action="increase"
                        data-id="${food.id}">
                        +
                    </button>

                </div>

            </div>

            <button class="remove-btn"
                data-action="remove"
                data-id="${food.id}"
                aria-label="Remove ${food.name}">

                <i class="fas fa-trash"></i>

            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    // Calculate bill
    const deliveryFee = subtotal > 0 ? 40 : 0;

    const tax = subtotal * 0.05;

    const total = subtotal + deliveryFee + tax;

    // Update summary
    subtotalElement.textContent = formatPrice(subtotal);

    deliveryElement.textContent = formatPrice(deliveryFee);

    taxElement.textContent = formatPrice(tax);

    totalElement.textContent = formatPrice(total);

    // Update cart badge
    cartCount.textContent = totalQuantity;

    // Disable checkout when empty
    checkoutBtn.disabled = cart.length === 0;

}

// Cart button events
cartItems.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const foodId = Number(button.dataset.id);

    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(foodId, 1);
    }

    if (action === "decrease") {
        changeQuantity(foodId, -1);
    }

    if (action === "remove") {
        removeFromCart(foodId);
    }

});

// Checkout
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) return;

    const confirmed = confirm(
        "Your total bill is " +
        totalElement.textContent +
        ". Do you want to place this demo order?"
    );

    if (confirmed) {

        alert(
            "Thank you for ordering from FoodieExpress! " +
            "Your demo order has been placed successfully."
        );

        cart = [];

        saveCart();
        displayCart();

    }

});

// Initial application load
displayFood();
displayCart();
