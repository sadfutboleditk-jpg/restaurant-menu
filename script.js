let allProducts = [];


/* =========================================================
   ÜRÜNLERİ YÜKLE
========================================================= */

fetch("products.json?t=" + Date.now())
    .then(response => {

        if (!response.ok) {
            throw new Error("products.json yüklenemedi.");
        }

        return response.json();

    })
    .then(products => {

        // Sadece aktif ürünler
        allProducts = products.filter(
            product => product.active === true
        );

        displayProducts(allProducts);

    })
    .catch(error => {

        console.error("Menü yüklenemedi:", error);

        const container =
            document.getElementById("products");

        if (container) {

            container.innerHTML = `
                <p style="
                    text-align:center;
                    padding:30px;
                    color:#a88418;
                    font-size:18px;
                ">
                    Menü yüklenemedi.
                </p>
            `;

        }

    });


/* =========================================================
   ÜRÜNLERİ GÖSTER
========================================================= */

function displayProducts(products) {

    const container =
        document.getElementById("products");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    products.forEach(product => {

        container.innerHTML +=
            createProductHTML(product);

    });

}


/* =========================================================
   ÜRÜN KARTI
========================================================= */

function createProductHTML(product) {

    return `

        <div
            class="product"
            onclick="openProductModal(${product.id})"
            role="button"
            tabindex="0"
            onkeydown="
                if(event.key === 'Enter' || event.key === ' ') {
                    openProductModal(${product.id});
                }
            "
        >

            <img
                src="${escapeHtml(product.image)}"
                alt="${escapeHtml(product.name)}"
                loading="lazy"
            >

            <div class="product-info">

                <div class="product-name">
                    ${escapeHtml(product.name)}
                </div>

                <div class="product-description">
                    ${escapeHtml(product.description)}
                </div>

                <div class="product-price">
                    ${Number(product.price).toLocaleString("tr-TR")} ₺
                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   KATEGORİ FİLTRELEME
========================================================= */

function filterProducts(category) {

    if (category === "all") {

        displayProducts(allProducts);

        return;

    }


    const filtered =
        allProducts.filter(
            product =>
                product.category === category
        );


    displayProducts(filtered);

}


/* =========================================================
   PRODUCT POPUP AÇ
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


    const modal =
        document.getElementById("productModal");

    const image =
        document.getElementById("modalProductImage");

    const name =
        document.getElementById("modalProductName");

    const category =
        document.getElementById("modalProductCategory");

    const description =
        document.getElementById("modalProductDescription");

    const price =
        document.getElementById("modalProductPrice");


    if (!modal) {
        return;
    }


    image.src =
        product.image;

    image.alt =
        product.name;


    name.textContent =
        product.name;


    category.textContent =
        product.category;


    description.textContent =
        product.description || "";


    price.textContent =
        Number(product.price).toLocaleString("tr-TR")
        + " ₺";


    modal.classList.add("show");


    // Arka sayfanın kaymasını engelle
    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   PRODUCT POPUP KAPAT
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById("productModal");


    if (!modal) {
        return;
    }


    modal.classList.remove("show");


    document.body.style.overflow =
        "";

}


/* =========================================================
   POPUP EVENTLERİ
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const modal =
            document.getElementById("productModal");


        const closeButton =
            document.getElementById(
                "closeProductModal"
            );


        // X butonu
        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeProductModal
            );

        }


        // Popup dışına tıklayınca kapat
        if (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeProductModal();

                    }

                }
            );

        }


        // ESC ile kapat
        document.addEventListener(
            "keydown",
            function (event) {

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
   HTML GÜVENLİĞİ
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")

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
