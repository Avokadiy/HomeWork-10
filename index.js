async function fetchData(x) {
    console.log(x);
    const response = await fetch(`https://fakestoreapi.com/products?limit=${x}`);
    const data = await response.json();

    if (!response.ok) {
        console.log(data.errors);

        return;
    }

    return data;
}
function loadExtraItems() {
    const loadButton = document.querySelector('.loadButton');
    loadButton.addEventListener('click', () => {
        let x = 6;
        if (x / 6) {
            for (x ; x / 6; x++) {
            return x;
        }}
    });
}


async function createProductDOM(product) {

    const item = document.createElement('div');
    item.className = "market_item";

    const descriptionDOM = document.createElement("div");
    descriptionDOM.className = "item_description"
    descriptionDOM.innerText = product.description;

    const priceDOM = document.createElement("div");
    priceDOM.className = "item_price"
    priceDOM.innerText = `${product.price} $`;

    const titleDOM = document.createElement("div");
    titleDOM.className = "item_title"
    titleDOM.innerText = product.title;

    const imgDOM = document.createElement("img");
    imgDOM.className = "item_img";
    imgDOM.src = product.image;

    const buttonDOM = document.createElement("button");
    buttonDOM.className = "item_add";
    buttonDOM.innerText = "Add to cart";
    buttonDOM.addEventListener('click', () => {
        addToCart(product);
    });

    const itemsDOM = document.querySelector('.market');

    item.appendChild(imgDOM);
    item.appendChild(titleDOM);
    item.appendChild(priceDOM);
    item.appendChild(descriptionDOM);
    item.appendChild(buttonDOM);
    itemsDOM.appendChild(item);
}

async function createProductCartDOM(product) {

    const item = document.createElement('div');
    item.className = "market_item";

    const descriptionDOM = document.createElement("div");
    descriptionDOM.className = "item_description"
    descriptionDOM.innerText = product.description;

    const priceDOM = document.createElement("div");
    priceDOM.className = "item_price"
    priceDOM.innerText = `${product.price} $`;

    const titleDOM = document.createElement("div");
    titleDOM.className = "item_title"
    titleDOM.innerText = product.title;

    const imgDOM = document.createElement("img");
    imgDOM.className = "item_img";
    imgDOM.src = product.image;

    const buttonDOM = document.createElement("button");
    buttonDOM.className = "item_remove";
    buttonDOM.innerText = "Remove from cart";
    buttonDOM.addEventListener('click', () => {
        removeFromCart(product);
    });

    const itemsDOM = document.querySelector('.market');

    item.appendChild(imgDOM);
    item.appendChild(titleDOM);
    item.appendChild(priceDOM);
    item.appendChild(descriptionDOM);
    item.appendChild(buttonDOM);
    itemsDOM.appendChild(item);
}

async function main() {

    const products = await fetchData(loadExtraItems);
    const cart = await getUserCart(products);
    const outOfCart = products.filter(e => cart.findIndex(i => i.id == e.id) === -1);

    outOfCart.forEach(createProductDOM);
    cart.forEach(createProductCartDOM);
}

main()

async function addToCart(product) {

    let date = new Date().toISOString();
    const response = await fetch('https://fakestoreapi.com/carts', {
        method: "POST",
        body: JSON.stringify({
            userId: 1,
            date: date,
            products: [{
                productId: product.id,
                quantity: 1
            }]
        })
    })

    const data = await response.json();

    if (!response.ok) {
        console.log(data.errors);
        return;
    }

    if (response.status === 200) {
        let text = `Товар ${product.title} добавлен в корзину.`;

        notification(text);
    }
}

function notification(text) {
    const addPopup = document.querySelector(".notification_add");
    const textPopup = document.querySelector(".notification_text");

    textPopup.innerText = text;

    addPopup.classList.add('active');
    textPopup.classList.add('active');

    setTimeout(() => addPopup.classList.remove('active'), 2000);
    setTimeout(() => textPopup.classList.remove('active'), 2000);
}

async function getUserCart(products) {
    const response = await fetch('https://fakestoreapi.com/carts/2');
    const data = await response.json();

    const cartArray = transformArrays(data.products, products);

    return cartArray;
}

async function transformArrays(data, products) {
    const result = [];

    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (products[i].id === data[j].productId) {
                result.push(products[i])
            }
        }
    }

    return result;
}

async function removeFromCart(product) {
    const allProducts = await fetchData();
    const productsArray = await getUserCart(allProducts);

    let productForDelete = productsArray.map(x =>{return x.id}).indexOf(product.id);
    console.log(productForDelete);

    productsArray.splice(productForDelete, 1);

    console.log(productsArray);
    const productsArrayJSON = JSON.stringify(productsArray)


    const response = await fetch('https://fakestoreapi.com/carts/2',{
        method: 'PUT',
        body: productsArrayJSON
    })

    const data = await response.json();

    if (!response.ok) {
        console.log(data.errors);
        return;
    }

    if (response.status === 200) {
        let text = `Товар ${product.title} удалён из корзины.`;

        notification(text);
    }
}