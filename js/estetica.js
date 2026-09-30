const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visivel');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.secao, .sobre, .passos, .newsletter, .card').forEach(el => {
  el.classList.add('reveal');
  obs.observe(el);
});