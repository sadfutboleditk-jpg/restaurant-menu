let allProducts = [];
let currentProducts = [];


/* =========================================================
   PRODUCTS LOAD
========================================================= */

async function loadProducts() {

    try {

        const response = await fetch(
            "products.json?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("products.json yüklenemedi.");
        }

        allProducts = await response.json();

        displayProducts(allProducts);

        createCategories(allProducts);

    } catch (error) {

        console.error(error);

        const menu =
            document.getElementById("menu");

        if (menu) {

            menu.innerHTML = `
                <p style="text-align:center;">
                    Menü yüklenemedi.
                </p>
            `;

        }

    }

}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(products) {

    currentProducts = products;

    const menu =
        document.getElementById("menu");

    if (!menu) return;

    menu.innerHTML = "";

    const categories = [
        ...new Set(
            products.map(
                product => product.category
            )
        )
    ];


    categories.forEach(category => {

        const categoryProducts =
            products.filter(
                product =>
                    product.category === category &&
                    product.active === true
            );


        if (categoryProducts.length === 0) {
            return;
        }


        const categorySection =
            document.createElement("section");


        categorySection.innerHTML = `

            <h2>
                ${escapeHtml(category)}
            </h2>

            <div class="product-grid"></div>

        `;


        const grid =
            categorySection.querySelector(
                ".product-grid"
            );


        categoryProducts.forEach(product => {

            grid.innerHTML +=
                createProductHTML(product);

        });


        menu.appendChild(
            categorySection
        );

    });

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductHTML(product) {

    return `

        <article
            class="product"
            data-product-id="${product.id}"
            onclick="openProductModal(${product.id})">

            <img
                src="${escapeHtml(product.image || "")}"
                alt="${escapeHtml(product.name)}"
                loading="lazy"
            >

            <div class="product-info">

                <div class="product-name">
                    ${escapeHtml(product.name)}
                </div>

                <div class="product-description">
                    ${escapeHtml(product.description || "")}
                </div>

                <div class="product-price">
                    ${Number(product.price).toLocaleString("tr-TR")} ₺
                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   CATEGORIES
========================================================= */

function createCategories(products) {

    const categoryContainer =
        document.getElementById("categories");

    if (!categoryContainer) return;

    categoryContainer.innerHTML = "";

    const categories = [
        "Tümü",
        ...new Set(
            products
                .filter(product => product.active === true)
                .map(product => product.category)
        )
    ];


    categories.forEach(category => {

        const button =
            document.createElement("button");


        button.textContent =
            category;


        button.addEventListener(
            "click",
            () => {

                if (category === "Tümü") {

                    displayProducts(
                        allProducts
                    );

                } else {

                    displayProducts(
                        allProducts.filter(
                            product =>
                                product.category === category &&
                                product.active === true
                        )
                    );

                }

            }
        );


        categoryContainer.appendChild(
            button
        );

    });

}


/* =========================================================
   OPEN PRODUCT MODAL
========================================================= */

function openProductModal(productId) {

    const product =
        allProducts.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {
        return;
    }


    document.getElementById(
        "modalProductImage"
    ).src =
        product.image || "";


    document.getElementById(
        "modalProductImage"
    ).alt =
        product.name;


    document.getElementById(
        "modalProductName"
    ).textContent =
        product.name;


    document.getElementById(
        "modalProductCategory"
    ).textContent =
        product.category;


    document.getElementById(
        "modalProductDescription"
    ).textContent =
        product.description || "";


    document.getElementById(
        "modalProductPrice"
    ).textContent =
        Number(
            product.price
        ).toLocaleString(
            "tr-TR"
        ) + " ₺";


    const modal =
        document.getElementById(
            "productModal"
        );


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    modal.classList.remove("show");

    document.body.style.overflow =
        "";

}


/* =========================================================
   CLOSE BUTTON
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const closeButton =
            document.getElementById(
                "closeProductModal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeProductModal
            );

        }


        const modal =
            document.getElementById(
                "productModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeProductModal();

                    }

                }
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    closeProductModal();

                }

            }
        );

    }
);


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   START
========================================================= */

loadProducts();
