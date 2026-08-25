/* =========================================================
   GLOBAL
========================================================= */

let allProducts = [];


/* =========================================================
   PRODUCTS LOAD
========================================================= */

fetch("products.json?t=" + Date.now())

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "products.json yüklenemedi."
            );

        }

        return response.json();

    })

    .then(products => {

        allProducts =
            products.filter(
                product =>
                    product.active === true
            );


        displayProducts(
            allProducts
        );

    })

    .catch(error => {

        console.error(
            "Menü yüklenemedi:",
            error
        );


        const container =
            document.getElementById(
                "products"
            );


        if (container) {

            container.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px;
                        color:#a88418;
                        font-size:18px;
                    "
                >

                    Menü yüklenemedi.

                </div>

            `;

        }

    });


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(
    products
) {

    const container =
        document.getElementById(
            "products"
        );


    if (!container) {

        console.error(
            "products alanı bulunamadı."
        );

        return;

    }


    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px;
                    color:#817b70;
                    font-size:18px;
                "
            >

                Bu kategoride ürün bulunamadı.

            </div>

        `;

        return;

    }


    products.forEach(
        product => {

            container.innerHTML +=
                createProductHTML(
                    product
                );

        }
    );

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductHTML(
    product
) {

    return `

        <article
            class="product"
            onclick="
                openProductModal(${product.id})
            "
            role="button"
            tabindex="0"
            onkeydown="
                handleProductKeydown(
                    event,
                    ${product.id}
                )
            "
        >


            <img
                src="${escapeHtml(
                    product.image || ""
                )}"
                alt="${escapeHtml(
                    product.name
                )}"
                loading="lazy"
                onerror="
                    this.style.opacity='0.35'
                "
            >


            <div class="product-info">


                <div
                    class="product-name"
                >

                    ${escapeHtml(
                        product.name
                    )}

                </div>


                <div
                    class="product-description"
                >

                    ${escapeHtml(
                        product.description || ""
                    )}

                </div>


                <div
                    class="product-price"
                >

                    ${Number(
                        product.price
                    ).toLocaleString(
                        "tr-TR"
                    )}

                    ₺

                </div>


            </div>


        </article>

    `;

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterProducts(
    category
) {

    if (
        category === "all"
    ) {

        displayProducts(
            allProducts
        );


        setActiveCategory(
            "all"
        );


        return;

    }


    const filtered =
        allProducts.filter(
            product =>
                product.category ===
                category
        );


    displayProducts(
        filtered
    );


    setActiveCategory(
        category
    );

}


/* =========================================================
   CATEGORY ACTIVE STATE
========================================================= */

function setActiveCategory(
    category
) {

    const buttons =
        document.querySelectorAll(
            ".categories button"
        );


    buttons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    buttons.forEach(
        button => {

            const text =
                button.textContent
                    .trim();


            if (
                category === "all" &&
                text === "TÜMÜ"
            ) {

                button.classList.add(
                    "active"
                );

            }


            if (
                text.toLowerCase() ===
                category.toLowerCase()
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   PRODUCT MODAL OPEN
========================================================= */

function openProductModal(
    productId
) {

    const product =
        allProducts.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {

        return;

    }


    const modal =
        document.getElementById(
            "productModal"
        );


    const image =
        document.getElementById(
            "modalProductImage"
        );


    const name =
        document.getElementById(
            "modalProductName"
        );


    const category =
        document.getElementById(
            "modalProductCategory"
        );


    const description =
        document.getElementById(
            "modalProductDescription"
        );


    const price =
        document.getElementById(
            "modalProductPrice"
        );


    if (
        !modal ||
        !image ||
        !name ||
        !category ||
        !description ||
        !price
    ) {

        return;

    }


    image.src =
        product.image || "";


    image.alt =
        product.name;


    name.textContent =
        product.name;


    category.textContent =
        product.category;


    description.textContent =
        product.description || "";


    price.textContent =
        Number(
            product.price
        ).toLocaleString(
            "tr-TR"
        ) + " ₺";


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   PRODUCT MODAL CLOSE
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   PRODUCT CARD KEYBOARD
========================================================= */

function handleProductKeydown(
    event,
    productId
) {

    if (
        event.key === "Enter" ||
        event.key === " "
    ) {

        event.preventDefault();

        openProductModal(
            productId
        );

    }

}


/* =========================================================
   DOM EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ---------------------------------------------
           CLOSE BUTTON
        --------------------------------------------- */

        const closeButton =
            document.getElementById(
                "closeProductModal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    closeProductModal();

                }
            );

        }


        /* ---------------------------------------------
           CLICK OUTSIDE
        --------------------------------------------- */

        const modal =
            document.getElementById(
                "productModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeProductModal();

                    }

                }
            );

        }


        /* ---------------------------------------------
           ESC
        --------------------------------------------- */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeProductModal();

                }

            }
        );


        /* ---------------------------------------------
           DEFAULT CATEGORY
        --------------------------------------------- */

        setActiveCategory(
            "all"
        );

    }
);


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHtml(
    value
) {

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

