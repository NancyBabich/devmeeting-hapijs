'use strict';

//12/ Use pre-populated content if present.
let products = [];
if (window.products) {
  products = window.products;
  render(products);
} else {
  refresh();
}

document.querySelector('.products__search').addEventListener('input', ev => {
  const { value } = ev.target;
  if (!value) {
    render(products);
  } else {
    render(products
      .filter(p => (p.name + p.description).toLowerCase().indexOf(value) > -1)
    )
  }
})

//2/ Handle form submission
document.querySelector('.products__form').addEventListener('submit', ev => {
  ev.preventDefault();

  //9/ Extract the values of all fields.
  const find = (id, map=x=>x) => {
    return map(ev.target.querySelector(`input[name=${id}]`).value);
  };

  const id = find('id', parseInt);
  const name = find('name');
  const description = find('description');
  const price = find('price', parseFloat) * 100;

  //7/ Send out the request.
  fetch('/api/products', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({id, name, description, price})
  }).then(res => {
    //6/ In case it's successful clear the form and refresh.
    if (res.status === 201) {
      [].forEach.call(ev.target.querySelectorAll('input'), i => {
        i.value = '';
      });
      refresh();
    } else {
      window.alert('Unable to add the product.');
      console.log(res);
    }
  })

})

function refresh () {
  fetch('/api/products')
    .then(res => res.json())
    .then(p => {
      products = p;
      render(p);
    });
}

function render (products) {
  const $products = document.querySelector('.products');
  $products.innerHTML = '';

  for (const product of products) {
    $products.appendChild(renderProduct(product));
  }
}

function renderProduct ({name, id, price, description}) {
  const $img = el('img.product__img');
  $img.width = 250;
  $img.height = 250;
  $img.alt = name;
  $img.src = `https://xpla.org/ext/lorempixel/250/250/technics/${id}/`;

  const $name = el('h3.product__name');
  $name.textContent = name;

  const $price = el('p.product__price');
  $price.innerHTML = `Price: <strong>$${(price / 100).toFixed(2)}</strong>`;

  const $description = el('p.product__description');
  const $descriptionText = el('span');
  const $descriptionExpand = el('a');
  [$descriptionText, $descriptionExpand].forEach(el => $description.appendChild(el));

  const renderDescription = full => {
    $descriptionText.textContent = full ? `${description} ` : `${description.substr(0, 10)}... `;
    $descriptionExpand.textContent = full ? 'Less' : 'Read more';
  };
  let expanded = false;
  $descriptionExpand.addEventListener('click', () => {
    expanded = !expanded;
    renderDescription(expanded);
  });
  renderDescription(expanded);

  const $button = el('button.product__button');
  $button.innerHTML = `
    <svg width="25" height="25">
      <g><path d="M11 9h2v-3h3v-2h-3v-3h-2v3h-3v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01-1.74-.96h-.01l-1.1 2-2.76 5h-7.02l-.13-.27-2.24-4.73-.95-2-.94-2h-3.27v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2h-11.58c-.13 0-.25-.11-.25-.25z"></path></g>
    </svg>
    Buy
  `;

  const $product = el('.product');
  [$img, $name, $price, $description, $button].forEach($el => $product.appendChild($el))

  return $product;
}

function el (creator) {
  const classes = creator.split('.');
  const tag = classes.shift() || 'div';

  const $el = document.createElement(tag);
  classes.forEach(clazz => $el.classList.add(clazz));
  return $el;
}
