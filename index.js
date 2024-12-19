async function fetchData(numberOfItems) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products?limit=${numberOfItems}`);
        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Ошибка', error)
    }
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

function loadItems(numberOfItems) {
    numberOfItems = numberOfItems + 6;

    return numberOfItems;
}

async function main() {
    const loadButton = document.querySelector('.loadButton');
    const market = document.querySelector('.market');
    let numberOfItems = 6;

    let products = await fetchData(numberOfItems);
    let cart = await getUserCart(products);
    let outOfCart = products.filter(e => cart.findIndex(i => i.id == e.id) === -1);

    outOfCart.forEach(createProductDOM);
    cart.forEach(createProductCartDOM);

    loadButton.addEventListener('click', async () => {
        market.innerHTML = '';

        numberOfItems = loadItems(numberOfItems);
        products = await fetchData(numberOfItems);
        outOfCart = products.filter(e => cart.findIndex(i => i.id == e.id) === -1);
        outOfCart.forEach(createProductDOM);
        cart.forEach(createProductCartDOM);
    })

    const filterButtonDOM = document.querySelector('.filter');
    filterButtonDOM.addEventListener('click', filterPopup);
}

main()

async function addToCart(product) {
    try {
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

        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }

        if (response.status === 200) {
            let text = `Товар ${product.title} добавлен в корзину.`;

            notification(text);
        }

    } catch (error) {
        console.error('Ошибка', error);
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
    try {
        const response = await fetch('https://fakestoreapi.com/carts/2');

        if (!response.ok) {
            throw new Error('Сетевая ошибка')
        }

        const data = await response.json();
        const cartArray = transformArrays(data.products, products);

        return cartArray;

    } catch (error) {
        console.error('Ошибка', error);
    }
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

    let productForDelete = productsArray.map(numberOfItems => {
        return numberOfItems.id
    }).indexOf(product.id);

    productsArray.splice(productForDelete, 1);

    const productsArrayJSON = JSON.stringify(productsArray)

    try {
        const response = await fetch('https://fakestoreapi.com/carts/2', {
            method: 'PUT',
            body: productsArrayJSON
        })

        if (!response.ok) {
            throw new Error('Сетевая ошибка')
        }

        if (response.status === 200) {
            let text = `Товар ${product.title} удалён из корзины.`;

            notification(text);
        }

    } catch (error) {
        console.error('Ошибка', error);
    }
}

async function filterPopup() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');

        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }

        const data = await response.json();
        const filterPopupDOM = document.querySelector('.filter_popup');
        const filterPopupTextDOM = document.querySelector('.filter_popup_text');

        filterPopupDOM.classList.add('active');
        filterPopupTextDOM.classList.add('active');

        data.forEach(filterList);

    } catch (error) {
        console.error('Ошибка', error);
    }
}

function filterList(data) {
    const filterPopupTextDOM = document.querySelector('.filter_popup_text');
    const filterItemDOM = document.createElement('button');
    filterItemDOM.className = `filter_item`;
    filterItemDOM.innerText = data;
    filterItemDOM.addEventListener('click', () => {
        filterItems(data);
    });

    filterPopupTextDOM.appendChild(filterItemDOM);
}

async function filterItems(category) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);

        if (!response.ok) {
            throw new Error('Сетевая ошибка');
        }

        const data = await response.json();
        const market = document.querySelector('.market');
        market.innerHTML = '';

        let products = data
        let cart = await getUserCart(products);
        let outOfCart = products.filter(e => cart.findIndex(i => i.id == e.id) === -1);

        outOfCart.forEach(createProductDOM);
        cart.forEach(createProductCartDOM);

    } catch (error) {
        console.error('Ошибка', error);
    }

    const filterPopupDOM = document.querySelector('.filter_popup');
    const filterPopupTextDOM = document.querySelector('.filter_popup_text');

    filterPopupDOM.classList.remove('active');
    filterPopupTextDOM.classList.remove('active');
    filterPopupTextDOM.innerHTML = '';
}