'use strict';

//5/ All products are stored in the array.
const products = [
  { id: 3, name: 'Laptop', price: 13545 },
  { id: 1, name: 'iPad', price: 23000 },
  { id: 9, name: 'TV', price: 70000 },
];

const $products = document.querySelector('.products');

// We just iterated and create DOM elements from those objects.
for (const {name, id, price} of products) {
  const $img = el('img.product__img');
  $img.width = 250;
  $img.height = 250;
  $img.alt = name;
  $img.src = `https://xpla.org/ext/lorempixel/250/250/technics/${id}/`;

  const $name = el('h3.product__name');
  $name.textContent = name;

  const $price = el('p.product__price');
  $price.innerHTML = `Price: <strong>$${(price / 100).toFixed(2)}</strong>`;

  const $button = el('button.product__button');
  $button.innerHTML = `
    <svg width="25" height="25">
      <g><path d="M11 9h2v-3h3v-2h-3v-3h-2v3h-3v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01-1.74-.96h-.01l-1.1 2-2.76 5h-7.02l-.13-.27-2.24-4.73-.95-2-.94-2h-3.27v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2h-11.58c-.13 0-.25-.11-.25-.25z"></path></g>
    </svg>
    Buy
  `;

  const $product = el('.product');
  [$img, $name, $price, $button].forEach($el => $product.appendChild($el))

  $products.appendChild($product);
}

function el(creator) {
  const classes = creator.split('.');
  const tag = classes.shift() || 'div';

  const $el = document.createElement(tag);
  classes.forEach(clazz => $el.classList.add(clazz));
  return $el;
}
