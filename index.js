async function fetchData() {

    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    if (!response.ok) {
        console.log(data.errors);

        return;
    }

    data.forEach(createProductDom);
}

function createProductDom(product) {
    const item = document.createElement('div');
    item.className = "market_item";

    const descriptionDOM = document.createElement("div");
    descriptionDOM.className = "item_description"
    descriptionDOM.innerText = product.description;

    const priceDOM = document.createElement("div");
    priceDOM.className = "item_price"
    priceDOM.innerText = product.price;

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

async function main() {
    await fetchData();
}

main()

async function addToCart(product) {

    let date = new Date().toISOString();
    const response = await fetch('https://fakestoreapi.com/carts', {
        method: "POST",
        body: JSON.stringify({
            userId: 1,
            date: date,
            products: [{productId: product.id, quantity: 1}]
        })
    })

    const data = await response.json();

    if (!response.ok) {
        console.log(data.errors);
        return;
    }

    if (response.status === 200) {
        console.log("Товар", product.title, "добавлен в корзину");
    }
}



