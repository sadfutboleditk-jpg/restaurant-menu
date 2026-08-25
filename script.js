let allProducts = [];

fetch("products.json")
    .then(response => response.json())
    .then(products => {

        allProducts = products.filter(product => product.active);

        displayProducts(allProducts);

    })
    .catch(error => {

        console.error("Menü yüklenemedi:", error);

    });


function displayProducts(products) {

    const container = document.getElementById("products");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += createProductHTML(product);

    });

}


function createProductHTML(product) {

    return `

        <div class="product">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-description">
                    ${product.description}
                </div>

                <div class="product-price">
                    ${product.price} ₺
                </div>

            </div>

        </div>

    `;

}


function filterProducts(category) {

    if (category === "all") {

        displayProducts(allProducts);

        return;

    }

    const filtered = allProducts.filter(
        product => product.category === category
    );

    displayProducts(filtered);

}
