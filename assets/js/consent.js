/* ==========================================================================
   Débora Denúbila — Consentimento de cookies
   --------------------------------------------------------------------------
   - Carrega o Google Tag Manager somente com consentimento de análise.
   - Carrega o Meta Pixel somente com consentimento de marketing.
   - Mostra um aviso no primeiro acesso e preferências no rodapé.
   - Guarda a escolha em localStorage (sem cookies de terceiros).
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'debora_cookie_consent_v2';
  var GTM_ID = 'GTM-N2CGCSJD';
  var scriptEl = document.currentScript;
  var base = scriptEl && scriptEl.src
    ? scriptEl.src.replace(/assets\/js\/consent\.js.*$/, '')
    : './';

  var stored = null;

  try {
    stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (error) {
    stored = null;
  }

  var analytics = stored ? stored.analytics === true : false;
  var marketing = stored ? stored.marketing === true : false;
  var gtmLoaded = false;
  var banner = null;
  var modal = null;
  var analyticsInput = null;
  var marketingInput = null;
  var lastFocus = null;

  window.dataLayer = window.dataLayer || [];
  window.DeboraConsent = { analytics: analytics, marketing: marketing };

  function loadGtm() {
    if (gtmLoaded || !analytics) return;

    gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var firstScript = document.getElementsByTagName('script')[0];
    var gtmScript = document.createElement('script');

    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    gtmScript.setAttribute('data-gtm', '');
    firstScript.parentNode.insertBefore(gtmScript, firstScript);

    window.dataLayer.push({ event: 'cookie_consent', analytics: true });
  }

  function clearAnalyticsCookies() {
    if (!document.cookie) return;

    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();

      if (!/^_ga|^_gid|^_gat/.test(name)) return;

      document.cookie = name + '=; Max-Age=0; path=/';
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname;
    });
  }

  function unloadGtm() {
    Array.prototype.forEach.call(
      document.querySelectorAll('script[data-gtm], script[src*="googletagmanager.com/gtm.js"]'),
      function (script) {
        script.parentNode.removeChild(script);
      }
    );

    gtmLoaded = false;
    clearAnalyticsCookies();
  }

  function loadMetaPixel() {
    if (!marketing || !window.DeboraMetaPixel) return;
    window.DeboraMetaPixel.load();
  }

  function unloadMetaPixel() {
    if (window.DeboraMetaPixel) window.DeboraMetaPixel.unload();
  }

  function persist(analyticsValue, marketingValue) {
    analytics = analyticsValue === true;
    marketing = marketingValue === true;

    window.DeboraConsent.analytics = analytics;
    window.DeboraConsent.marketing = marketing;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          analytics: analytics,
          marketing: marketing,
          savedAt: new Date().toISOString()
        })
      );
    } catch (error) {
      /* localStorage bloqueado: a escolha vale para esta visita. */
    }

    if (analytics) {
      loadGtm();
    } else {
      unloadGtm();
    }

    if (marketing) {
      loadMetaPixel();
    } else {
      unloadMetaPixel();
    }
  }

  function syncBodyState() {
    var uiOpen = (banner && !banner.hidden) || (modal && !modal.hidden);
    document.body.classList.toggle('cookie-ui-open', Boolean(uiOpen));
  }

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.hidden = true;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p class="cookie-banner__title">Sua privacidade</p>' +
      '<p class="cookie-banner__text">Usamos armazenamento essencial para o site funcionar e, ' +
      'com seu consentimento, cookies de análise e marketing para entender o uso do site e ' +
      'medir o resultado dos anúncios. Saiba mais na <a href="' + base + 'cookies/">Política de Cookies</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button class="cookie-btn" type="button" data-cookie-essential>Apenas essenciais</button>' +
      '<button class="cookie-btn" type="button" data-cookie-preferences>Preferências</button>' +
      '<button class="cookie-btn cookie-btn--primary" type="button" data-cookie-accept>Aceitar todos</button>' +
      '</div>';

    document.body.appendChild(banner);
  }

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'cookie-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="cookie-modal__overlay" data-cookie-close></div>' +
      '<div class="cookie-modal__dialog" role="dialog" aria-modal="true" ' +
      'aria-labelledby="cookie-modal-title" tabindex="-1">' +
      '<button class="cookie-modal__close" type="button" data-cookie-close aria-label="Fechar preferências de cookies">' +
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>' +
      '</button>' +
      '<h2 id="cookie-modal-title">Preferências de cookies</h2>' +
      '<p class="cookie-modal__lead">Escolha quais categorias podem ser usadas neste site. ' +
      'As preferências essenciais ficam sempre ativas para guardar a sua escolha.</p>' +
      '<div class="cookie-group">' +
      '<input id="cookie-essential" type="checkbox" checked disabled aria-describedby="cookie-essential-desc">' +
      '<div class="cookie-group__body"><label for="cookie-essential"><strong>Essenciais</strong></label>' +
      '<small id="cookie-essential-desc">Necessários para o funcionamento e para lembrar as suas preferências.</small></div>' +
      '</div>' +
      '<div class="cookie-group">' +
      '<input id="cookie-analytics" type="checkbox" data-cookie-analytics aria-describedby="cookie-analytics-desc">' +
      '<div class="cookie-group__body"><label for="cookie-analytics"><strong>Análise</strong></label>' +
      '<small id="cookie-analytics-desc">Ajuda a entender como o site é usado, por meio do Google Tag Manager e do Google Analytics. ' +
      'Só é ativada com o seu consentimento.</small></div>' +
      '</div>' +
      '<div class="cookie-group">' +
      '<input id="cookie-marketing" type="checkbox" data-cookie-marketing aria-describedby="cookie-marketing-desc">' +
      '<div class="cookie-group__body"><label for="cookie-marketing"><strong>Marketing</strong></label>' +
      '<small id="cookie-marketing-desc">Permite medir o resultado dos anúncios e exibir conteúdo relevante no Facebook e Instagram, ' +
      'por meio do Pixel da Meta. Só é ativada com o seu consentimento.</small></div>' +
      '</div>' +
      '<div class="cookie-modal__actions">' +
      '<button class="cookie-btn cookie-btn--primary" type="button" data-cookie-save>Salvar preferências</button>' +
      '<button class="cookie-btn" type="button" data-cookie-accept>Aceitar todos</button>' +
      '</div>' +
      '<p class="cookie-modal__note">Você pode rever esta escolha a qualquer momento pelo link ' +
      '“Preferências de cookies” no rodapé ou pelas configurações do seu navegador. ' +
      'Consulte também a <a href="' + base + 'cookies/">Política de Cookies</a>.</p>' +
      '</div>';

    document.body.appendChild(modal);
    analyticsInput = modal.querySelector('[data-cookie-analytics]');
    marketingInput = modal.querySelector('[data-cookie-marketing]');
  }

  function openModal(trigger) {
    if (!modal) buildModal();

    lastFocus = trigger || document.activeElement;
    analyticsInput.checked = analytics;
    marketingInput.checked = marketing;
    modal.hidden = false;

    if (banner && !banner.hidden) {
      banner.inert = true;
      banner.setAttribute('aria-hidden', 'true');
    }

    syncBodyState();

    window.setTimeout(function () {
      var dialog = modal.querySelector('.cookie-modal__dialog');
      if (dialog) dialog.focus();
    }, 0);
  }

  function restoreFocus() {
    var target = lastFocus;

    if (!target || !target.isConnected || target.offsetParent === null) {
      target = document.querySelector('[data-cookie-preferences]');
    }

    if (target) {
      target.focus({ preventScroll: true });
    }
  }

  function closeModal() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;

    if (banner) {
      banner.inert = false;
      banner.removeAttribute('aria-hidden');
    }

    syncBodyState();
    restoreFocus();
  }

  function finishChoice(analyticsValue, marketingValue) {
    persist(analyticsValue, marketingValue);

    if (banner) {
      banner.hidden = true;
      banner.inert = false;
      banner.removeAttribute('aria-hidden');
    }

    if (modal) modal.hidden = true;

    syncBodyState();
    restoreFocus();
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || !modal || modal.hidden) return;

    var focusable = Array.prototype.slice.call(
      modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );

    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function init() {
    buildBanner();
    buildModal();

    if (!stored) {
      banner.hidden = false;
      syncBodyState();
    }

    document.addEventListener('click', function (event) {
      var preferences = event.target.closest('[data-cookie-preferences]');
      var accept = event.target.closest('[data-cookie-accept]');
      var essential = event.target.closest('[data-cookie-essential]');
      var save = event.target.closest('[data-cookie-save]');
      var close = event.target.closest('[data-cookie-close]');

      if (preferences) {
        event.preventDefault();
        openModal(preferences);
        return;
      }

      if (accept) {
        finishChoice(true, true);
        return;
      }

      if (essential) {
        finishChoice(false, false);
        return;
      }

      if (save) {
        finishChoice(
          analyticsInput ? analyticsInput.checked : false,
          marketingInput ? marketingInput.checked : false
        );
        return;
      }

      if (close) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      trapFocus(event);
    });
  }

  if (analytics) loadGtm();
  if (marketing) loadMetaPixel();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
