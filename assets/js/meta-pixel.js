/* ==========================================================================
   Débora Denúbila — Meta Pixel (Meta Ads)
   --------------------------------------------------------------------------
   O Pixel só é carregado depois do consentimento de marketing.
   O ID é público; o token da Conversions API NÃO deve ficar no frontend.
   ========================================================================== */
(function () {
  'use strict';

  var PIXEL_ID = '1841091313884205';
  var loaded = false;

  function isConfigured() {
    return /^\d{8,}$/.test(PIXEL_ID);
  }

  function hasMarketingConsent() {
    return Boolean(window.DeboraConsent && window.DeboraConsent.marketing);
  }

  function load() {
    if (loaded || !isConfigured() || !hasMarketingConsent()) return;

    loaded = true;

    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function track(eventName, params) {
    if (!loaded || !hasMarketingConsent() || typeof window.fbq !== 'function') return false;

    window.fbq('track', eventName, params || {});
    return true;
  }

  function trackCustom(eventName, params) {
    if (!loaded || !hasMarketingConsent() || typeof window.fbq !== 'function') return false;

    window.fbq('trackCustom', eventName, params || {});
    return true;
  }

  function clearMetaCookies() {
    if (!document.cookie) return;

    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();

      if (!/^_fbp|^_fbc/.test(name)) return;

      document.cookie = name + '=; Max-Age=0; path=/';
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname;
    });
  }

  function unload() {
    if (!loaded) return;

    Array.prototype.forEach.call(
      document.querySelectorAll('script[src*="connect.facebook.net"]'),
      function (script) {
        script.parentNode.removeChild(script);
      }
    );

    window.fbq = null;
    window._fbq = null;
    loaded = false;
    clearMetaCookies();
  }

  window.DeboraMetaPixel = {
    id: PIXEL_ID,
    load: load,
    track: track,
    trackCustom: trackCustom,
    unload: unload,
    isConfigured: isConfigured
  };
})();
