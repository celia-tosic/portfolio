// Scripts de la maquette, externalisés pour une Content-Security-Policy sans 'unsafe-inline'.
(function () {
  // Dans l'aperçu encadré du comparatif, on masque le bandeau de proposition.
  if (window.self !== window.top) {
    var banner = document.querySelector('.banner');
    if (banner) banner.style.display = 'none';
  }
  // Le formulaire de devis est une démonstration : pas d'envoi.
  var form = document.querySelector('form.form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var note = form.querySelector('.form-note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-note';
        note.setAttribute('role', 'status');
        note.textContent = 'Maquette de démonstration : le formulaire sera relié à votre adresse email une fois le site en ligne.';
        form.appendChild(note);
      }
    });
  }
  // Aperçu du comparatif : adapte l'échelle de l'iframe à la largeur disponible.
  function fit() {
    document.querySelectorAll('.preview').forEach(function (p) { p.style.setProperty('--pw', p.clientWidth); });
  }
  fit();
  window.addEventListener('resize', fit);
})();
