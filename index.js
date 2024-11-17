// function test() {
//     fetch('https://fakestoreapi.com/products')
//         .then(response => response.json())
//         .then(data => {
//             console.log('Данные:', data);

//         })
//         .catch(error => console.error('Ошибка', error));
// }

// test()

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

    item.className = 'market_item';
    item.innerHTML = `
        <img class="item_img" src="${product.image}" alt="Картинка товара">
        <div class="item_title">${product.title}</div>
        <div class="item_price">$${product.price}</div>
        <div class="item_description">${product.description}</div>
        <button data-id="${product.id}" class="item_add">Add to cart</button>
    `

    const itemsDOM = document.querySelector('.market');

    itemsDOM.appendChild(item);
}



async function main() {
    await fetchData();
    
    const itemButtons = document.querySelectorAll(".item_add");
    itemButtons.forEach((itemButton) => {
        itemButton.addEventListener('click', addToCart);
    })
}

main()

async function addToCart() {
    const response = await fetch('https://fakestoreapi.com/carts', {
        method: "POST",
        body: JSON.stringify({
            userId: 1,
            date: Date.now(),
            products: [{productId:"data-id", quantity:1}]
        })
    })

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
        console.log(data.errors);
        return;
    }
}



