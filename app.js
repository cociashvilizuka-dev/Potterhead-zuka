const productGrid = document.getElementById('productGrid');
const productDetail = document.getElementById('productDetail');

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products/');

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    productGrid.innerHTML = '<p class="error-message">Could not load products. Please try again later.</p>';
    console.error(error);
  }
}

function renderProducts(products) {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card" aria-label="${product.title}">
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.title}" />
          </div>

          <span class="product-category">${product.category}</span>
          <h2 class="product-title">${product.title}</h2>

          <div class="product-rating">
            <span><strong>Rating:</strong> ${product.rating.rate}</span>
            <span>(${product.rating.count})</span>
          </div>

          <div class="product-footer">
            <span class="product-price">$${product.price}</span>
            <button class="product-button" type="button" data-id="${product.id}">View</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.product-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      await fetchProductById(id);
    });
  });
}

async function fetchProductById(id) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    const product = await response.json();
    showProductDetail(product);
  } catch (error) {
    productDetail.innerHTML = '<p class="error-message">Could not load product details.</p>';
    console.error(error);
  }
}

function showProductDetail(product) {
  productGrid.classList.add('hidden');
  productDetail.classList.remove('hidden');

  productDetail.innerHTML = `
    <button class="back-button" type="button">← Back</button>

    <div class="detail-card">
      <div class="detail-image-wrap">
        <img src="${product.image}" alt="${product.title}" class="detail-image" />
      </div>

      <div class="detail-info">
        <span class="product-category">${product.category}</span>
        <h2>${product.title}</h2>
        <p class="detail-description">${product.description}</p>

        <div class="detail-meta">
          <span><strong>Rating:</strong> ${product.rating.rate}</span>
          <span><strong>Reviews:</strong> ${product.rating.count}</span>
        </div>

        <div class="detail-footer">
          <span class="product-price">$${product.price}</span>
          <div class="detail-actions">
            <button class="secondary-button" type="button">Add to cart</button>
            <button class="product-button" type="button">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const backButton = document.querySelector('.back-button');
  backButton.addEventListener('click', () => {
    productDetail.classList.add('hidden');
    productGrid.classList.remove('hidden');
  });
}

fetchProducts();
