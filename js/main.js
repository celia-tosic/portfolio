/* ===================================================================
 * Codelia, interactions
 * - entrée animée de la page d'accueil (titre mot à mot)
 * - en-tête qui se densifie au défilement
 * - menu mobile accessible (Échap, focus, contenu inerte derrière)
 * - apparition discrète des sections au défilement
 * - formulaire de contact envoyé sans quitter la page (Formspree)
 * - bandeau cookies : Google Analytics chargé seulement après accord
 * Toutes les animations sont coupées si le visiteur préfère
 * réduire les mouvements.
 * =================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canObserve = "IntersectionObserver" in window;

  /* Entrée de la page d'accueil : titre découpé en mots
   * ---------------------------------------------------------------- */
  function splitWords(el) {
    var index = 0;

    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) {
          walk(child);
          return;
        }
        if (child.nodeType !== 3) return;

        var fragment = document.createDocumentFragment();
        // Découpe sur les espaces normales seulement : une espace insécable
        // garde deux mots ensemble (ex. « avant l’IA »).
        child.textContent.split(/([ \t\r\n]+)/).forEach(function (part) {
          if (!part) return;
          if (/^[ \t\r\n]+$/.test(part)) {
            fragment.appendChild(document.createTextNode(" "));
            return;
          }
          var word = document.createElement("span");
          var inner = document.createElement("span");
          word.className = "word";
          inner.textContent = part;
          inner.style.setProperty("--i", index++);
          word.appendChild(inner);
          fragment.appendChild(word);
        });
        node.replaceChild(fragment, child);
      });
    })(el);
  }

  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (!reduceMotion) splitWords(el);
    el.classList.add("is-split");
  });

  /* En-tête au défilement
   * ---------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* Menu mobile
   * ---------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var mobile = window.matchMedia("(max-width: 900px)");

  if (toggle && nav) {
    var label = toggle.querySelector(".sr-only");
    var behind = document.querySelectorAll("main, .site-footer");

    var setMenu = function (open) {
      root.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      behind.forEach(function (el) {
        el.inert = open;
      });
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    };

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && mobile.matches) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && root.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    var onBreakpoint = function (event) {
      if (!event.matches) setMenu(false);
    };
    if (mobile.addEventListener) mobile.addEventListener("change", onBreakpoint);
    else if (mobile.addListener) mobile.addListener(onBreakpoint);
  }

  /* Formulaire de contact (Formspree)
   * Envoi sans quitter la page, avec un message de confirmation.
   * Sans JavaScript, le formulaire fonctionne quand même : le visiteur
   * passe par la page de confirmation de Formspree.
   * ---------------------------------------------------------------- */
  var form = document.querySelector("[data-contact-form]");

  if (form && window.fetch && window.FormData) {
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector('[type="submit"]');
    var submitContent = submit.innerHTML;

    var setStatus = function (message, state) {
      status.textContent = message;
      status.className = "form-status" + (state ? " is-" + state : "");
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setStatus("");
      submit.disabled = true;
      submit.textContent = "Envoi en cours…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Formspree " + response.status);
          form.reset();
          setStatus("Merci, votre message est bien parti. Je vous réponds rapidement.", "success");
        })
        .catch(function () {
          setStatus("L’envoi n’a pas abouti. Réessayez dans un instant ou écrivez-moi sur LinkedIn.", "error");
        })
        .then(function () {
          submit.disabled = false;
          submit.innerHTML = submitContent;
        });
    });
  }

  /* Bandeau cookies (Google Analytics)
   * Google Analytics ne se charge qu’après « Accepter » (partials/analytics.html).
   * Sans choix enregistré, le bandeau apparaît après 10 secondes.
   * Le choix est gardé 6 mois, puis le bandeau revient. Le lien « Cookies »
   * du pied de page le rouvre pour changer d’avis.
   * ---------------------------------------------------------------- */
  var consentBox = document.querySelector("[data-consent]");
  var CONSENT_DELAY = 10000; // en millisecondes

  if (consentBox) {
    var consentChosen = false;

    // Efface les cookies Google Analytics (_ga, _ga_XXXX) après un refus.
    var clearAnalyticsCookies = function () {
      var host = location.hostname;
      var domains = ["", host, "." + host.replace(/^www\./, "")];
      document.cookie.split(";").forEach(function (part) {
        var name = part.split("=")[0].trim();
        if (name.indexOf("_ga") !== 0) return;
        domains.forEach(function (domain) {
          document.cookie = name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "");
        });
      });
    };

    consentBox.addEventListener("click", function (event) {
      var button = event.target.closest("[data-consent-choice]");
      if (!button) return;
      var accepted = button.getAttribute("data-consent-choice") === "accept";
      consentChosen = true;
      if (window.saveConsent) window.saveConsent(accepted);
      if (accepted) {
        if (window.loadAnalytics) window.loadAnalytics();
      } else {
        if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
        clearAnalyticsCookies();
      }
      consentBox.hidden = true;
    });

    document.querySelectorAll("[data-consent-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        consentBox.hidden = false;
        consentBox.querySelector("button").focus();
      });
    });

    if (!(window.readConsent && window.readConsent())) {
      setTimeout(function () {
        // Le visiteur a peut-être déjà choisi via le lien « Cookies » entre-temps
        if (!consentChosen) consentBox.hidden = false;
      }, CONSENT_DELAY);
    }
  }

  /* Apparition au défilement (blocs simples et cascades)
   * ---------------------------------------------------------------- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      child.style.setProperty("--i", i);
    });
  });

  var items = document.querySelectorAll("[data-reveal], [data-stagger]");

  if (!canObserve || reduceMotion) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();
