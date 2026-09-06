/* Swiss Premium Valais — interactions natives, sans dépendance */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cards = $$('.product-card');
  const searchInput = $('#searchInput');
  const locationFilter = $('#locationFilter');
  const resultCount = $('#resultCount');
  const emptyState = $('#emptyState');
  const toast = $('#toast');
  let activeCategory = 'all';
  let cartCount = 0;

  // Menu mobile accessible
  const menuToggle = $('.menu-toggle');
  const navLinks = $('.nav-links');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const location = locationFilter.value;
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesLocation = location === 'all' || card.dataset.location === location;
      const matchesSearch = !query || card.dataset.search.includes(query);
      const show = matchesCategory && matchesLocation && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    resultCount.textContent = `${visible} découverte${visible !== 1 ? 's' : ''}`;
    emptyState.style.display = visible ? 'none' : 'block';
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    filterProducts();
  }));
  searchInput.addEventListener('input', filterProducts);
  locationFilter.addEventListener('change', filterProducts);
  $('#clearSearch').addEventListener('click', () => { searchInput.value = ''; filterProducts(); searchInput.focus(); });
  $('#resetFilters').addEventListener('click', () => {
    activeCategory = 'all'; searchInput.value = ''; locationFilter.value = 'all';
    $$('.filter').forEach(item => item.classList.toggle('active', item.dataset.category === 'all'));
    filterProducts();
  });

  // Panier simulé avec feedback toast
  const showToast = (message) => {
    $('.toast span').textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };
  $$('.add-cart').forEach(button => button.addEventListener('click', () => {
    cartCount++;
    $('.cart-count').textContent = cartCount;
    $('.cart-button').setAttribute('aria-label', `Panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`);
    showToast('Ajouté à votre panier');
  }));
  $$('.heart').forEach(button => button.addEventListener('click', () => {
    const liked = button.classList.toggle('liked');
    button.innerHTML = liked ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
    showToast(liked ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
  }));

  $('#loadMore').addEventListener('click', event => {
    event.currentTarget.innerHTML = 'Vous avez tout vu <i class="fa-solid fa-check"></i>';
    event.currentTarget.disabled = true;
  });
  $('#newsletterForm').addEventListener('submit', event => {
    event.preventDefault();
    const message = $('#newsletterMessage');
    message.textContent = 'Merci — bienvenue dans le cercle des sommets.';
    message.style.color = '#bb2330';
    event.currentTarget.reset();
  });

  // Petite révélation au scroll pour les sections longues
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.style.animation = 'fadeUp .65s both'; observer.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.product-card, .partner').forEach(item => { item.style.opacity = '0'; observer.observe(item); });
})();
