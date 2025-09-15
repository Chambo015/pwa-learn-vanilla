async function fetchQuotes() {
  const res = await fetch('https://api.escuelajs.co/api/v1/products', { method: 'GET' });
  const data = await res.json();
  return data.slice(0, 8); // Возьмём первые 8 цитат
}

function renderQuotes(products) {
  const grid = document.getElementById('quotesGrid');
  grid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.style.backgroundImage = `url(${product.category.image})`;
    card.className = 'quote-card';
    card.innerHTML = `
      <div>${product.title}</div>
      <div class="quote-author">— $${product.price}</div>
    `;
    grid.appendChild(card);
  });
}


window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg =  await navigator.serviceWorker.register("/pwa-learn-vanilla/sw.js");
      console.log("✅ Service Worker registered success:", reg);
    } catch (error) {
      console.log("❌ Service Worker registration failed: ", error);
    }
  }

  fetchQuotes().then(renderQuotes);
});