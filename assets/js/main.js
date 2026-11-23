/* ==========================================================================
   Débora Denúbila — Advocacia Familiar & Patrimonial
   main.js
   --------------------------------------------------------------------------
   Comportamentos da página, sem dependências externas:
   01. Sombra do cabeçalho ao rolar
   02. Animação de entrada dos blocos
   03. Destaque do link ativo no menu
   04. Máscara do telefone
   05. Validação e envio do formulário para o WhatsApp
   06. Ano atual no rodapé
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5531999876858';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function digitsOf(value) {
    return (value || '').replace(/\D+/g, '');
  }

  /* ========================================================================
     01. Sombra do cabeçalho ao rolar
     ===================================================================== */
  var header = document.querySelector('[data-header]');

  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* Menu móvel: disclosure com foco, Esc, clique fora e fechamento ao navegar. */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.getElementById('mobile-menu');
  var desktopQuery = window.matchMedia('(min-width: 901px)');

  if (header && menuToggle && mobileMenu) {
    var isMenuOpen = function () {
      return header.classList.contains('is-menu-open');
    };

    var setMenu = function (open, restoreFocus) {
      header.classList.toggle('is-menu-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

      if (!open && restoreFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', function () {
      setMenu(!isMenuOpen(), false);
    });

    mobileMenu.addEventListener('click', function (event) {
      var link = event.target.closest('a');

      if (!link) return;

      setMenu(false, false);

      var href = link.getAttribute('href');

      if (!href || href.charAt(0) !== '#') return;

      var target = document.getElementById(href.slice(1));

      if (!target) return;

      /* Depois do salto, leva o foco ao destino para leitores de tela. */
      window.setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 0);
    });

    document.addEventListener('click', function (event) {
      if (isMenuOpen() && !header.contains(event.target)) {
        setMenu(false, false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenu(false, true);
      }
    });

    var closeOnDesktop = function (event) {
      if (event.matches) setMenu(false, false);
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', closeOnDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(closeOnDesktop);
    }
  }

  /* ========================================================================
     01a. Carrossel do hero (palestras / advocacia)
     ===================================================================== */
  var slider = document.querySelector('[data-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
    var tabs = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-to]'));
    var track = slider.querySelector('[data-slider-track]');
    var viewport = slider.querySelector('.hero__viewport');
    var slideStatus = slider.querySelector('[data-slide-status]');
    var prevButton = slider.querySelector('[data-slide-prev]');
    var nextButton = slider.querySelector('[data-slide-next]');
    var slideIndex = 0;

    var slideLabels = tabs.map(function (tab) {
      return tab.textContent.replace(/^\s*\d+\s*/, '').trim();
    });

    var goToSlide = function (nextIndex) {
      slideIndex = (nextIndex + slides.length) % slides.length;

      if (track) {
        track.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
      }

      slides.forEach(function (slide, index) {
        var isActive = index === slideIndex;

        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if ('inert' in slide) {
          slide.inert = !isActive;
        }
      });

      tabs.forEach(function (tab, index) {
        var isActive = index === slideIndex;

        tab.classList.toggle('is-active', isActive);

        if (isActive) {
          tab.setAttribute('aria-current', 'true');
        } else {
          tab.removeAttribute('aria-current');
        }
      });

      if (slideStatus) {
        slideStatus.textContent =
          'Slide ' + (slideIndex + 1) + ' de ' + slides.length + ': ' + slideLabels[slideIndex];
      }
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        goToSlide(Number(tab.getAttribute('data-slide-to')));
      });
    });

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        goToSlide(slideIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        goToSlide(slideIndex + 1);
      });
    }

    slider.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      event.preventDefault();
      goToSlide(slideIndex + (event.key === 'ArrowRight' ? 1 : -1));
      tabs[slideIndex].focus();
    });

    if (viewport) {
      var touchStartX = 0;
      var touchStartY = 0;

      viewport.addEventListener('touchstart', function (event) {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      viewport.addEventListener('touchend', function (event) {
        if (event.changedTouches.length !== 1) return;

        var deltaX = event.changedTouches[0].clientX - touchStartX;
        var deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

        goToSlide(slideIndex + (deltaX < 0 ? 1 : -1));
      }, { passive: true });
    }

    goToSlide(0);
  }

  /* ========================================================================
     01b. Esconde o WhatsApp flutuante quando o rodapé aparece
     ===================================================================== */
  var footer = document.querySelector('.site-footer');
  var whatsapps = document.querySelectorAll('.whatsapp');

  if (footer && whatsapps.length && 'IntersectionObserver' in window) {
    var footerObserver = new IntersectionObserver(function (entries) {
      var isFooterVisible = entries[0].isIntersecting;

      Array.prototype.forEach.call(whatsapps, function (button) {
        button.classList.toggle('is-hidden', isFooterVisible);
      });
    }, { threshold: 0.08 });

    footerObserver.observe(footer);
  }

  var heroControls = document.querySelector('.hero__controls');

  if (heroControls && whatsapps.length && 'IntersectionObserver' in window) {
    var heroControlsObserver = new IntersectionObserver(function (entries) {
      var isNearControls = entries[0].isIntersecting;

      Array.prototype.forEach.call(whatsapps, function (button) {
        button.classList.toggle('is-hero-near', isNearControls);
      });
    }, { threshold: 0.1 });

    heroControlsObserver.observe(heroControls);
  }

  /* ========================================================================
     02. Animação de entrada dos blocos
     ===================================================================== */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (revealItems.length) {
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
      });

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }
  }

  /* ========================================================================
     03. Destaque do link ativo no menu
     ===================================================================== */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"], .mobile-menu__links a[href^="#"]')
  );

  if (navLinks.length) {
    var navSections = navLinks.map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return { link: link, section: id ? document.getElementById(id) : null };
    }).filter(function (item) {
      return item.section;
    });

    var spyTicking = false;

    var syncActiveLink = function () {
      var probe = window.innerHeight * 0.38;
      var activeSection = null;

      navSections.forEach(function (item) {
        var rect = item.section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) activeSection = item.section;
      });

      navSections.forEach(function (item) {
        var isActive = item.section === activeSection;
        item.link.classList.toggle('is-active', isActive);

        if (isActive) {
          item.link.setAttribute('aria-current', 'location');
        } else {
          item.link.removeAttribute('aria-current');
        }
      });
    };

    var requestSpyUpdate = function () {
      if (spyTicking) return;
      spyTicking = true;

      window.requestAnimationFrame(function () {
        spyTicking = false;
        syncActiveLink();
      });
    };

    syncActiveLink();
    window.addEventListener('scroll', requestSpyUpdate, { passive: true });
    window.addEventListener('resize', requestSpyUpdate);
  }

  /* ========================================================================
     04. Máscara do telefone
     ===================================================================== */
  function formatPhone(value) {
    var digits = digitsOf(value).slice(0, 11);

    if (!digits) return '';
    if (digits.length < 3) return '(' + digits;

    var ddd = digits.slice(0, 2);
    var rest = digits.slice(2);

    if (!rest) return '(' + ddd + ')';
    if (digits.length < 7) return '(' + ddd + ') ' + rest;
    if (digits.length <= 10) {
      return '(' + ddd + ') ' + rest.slice(0, 4) + '-' + rest.slice(4);
    }

    return '(' + ddd + ') ' + rest.slice(0, 5) + '-' + rest.slice(5);
  }

  function caretFromDigits(value, count) {
    if (count <= 0) return 0;

    var seen = 0;

    for (var i = 0; i < value.length; i += 1) {
      if (/\d/.test(value.charAt(i))) {
        seen += 1;
        if (seen === count) return i + 1;
      }
    }

    return value.length;
  }

  /* ========================================================================
     05. Formulário: validação e envio para o WhatsApp
     ===================================================================== */
  var form = document.getElementById('consultation-form');

  if (form) {
    var status = form.querySelector('.form__status');
    var summary = document.getElementById('form-summary');
    var summaryList = summary ? summary.querySelector('.form__summary-list') : null;
    var phoneInput = form.elements.telefone;

    /* Máscara progressiva: (31) 9998-6858 ou (31) 99987-6858 */
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var caret = phoneInput.selectionStart || 0;
        var digitsBefore = digitsOf(phoneInput.value.slice(0, caret)).length;
        var formatted = formatPhone(phoneInput.value);

        phoneInput.value = formatted;

        if (document.activeElement === phoneInput) {
          var nextCaret = caretFromDigits(formatted, digitsBefore);
          phoneInput.setSelectionRange(nextCaret, nextCaret);
        }
      });
    }

    var requiredSelect = function (message) {
      return function (value) {
        return value ? true : message;
      };
    };

    var validators = {
      nome: function (value) {
        return value.trim().length >= 2 ? true : 'Informe seu nome completo.';
      },
      telefone: function (value) {
        var length = digitsOf(value).length;
        return length === 10 || length === 11 ? true : 'Informe um telefone com DDD.';
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
          ? true
          : 'Informe um e-mail válido.';
      },
      necessidade: requiredSelect('Selecione a sua necessidade.'),
      situacao: requiredSelect('Selecione a situação atual.'),
      patrimonio: requiredSelect('Selecione o valor estimado do patrimônio.')
    };

    var fields = ['nome', 'telefone', 'email', 'necessidade', 'situacao', 'patrimonio']
      .map(function (name) {
        return form.elements[name];
      })
      .filter(function (field) {
        return Boolean(field);
      });

    var refreshSummary = function () {
      if (!summary || !summaryList) return;

      summaryList.textContent = '';

      var invalidFields = fields.filter(function (field) {
        return field.getAttribute('aria-invalid') === 'true';
      });

      if (!invalidFields.length) {
        summary.hidden = true;
        return;
      }

      invalidFields.forEach(function (field) {
        var error = document.getElementById(field.id + '-error');
        var label = field.labels && field.labels.length
          ? field.labels[0].textContent.trim().replace(/[?:]\s*$/, '')
          : field.name;

        var item = document.createElement('li');
        var link = document.createElement('a');

        link.href = '#' + field.id;
        link.textContent = label + ': ' + (error ? error.textContent : 'Verifique este campo.');
        item.appendChild(link);
        summaryList.appendChild(item);
      });

      summary.hidden = false;
    };

    if (summary) {
      summary.addEventListener('click', function (event) {
        var link = event.target.closest('a');

        if (!link) return;

        var field = document.getElementById(link.getAttribute('href').slice(1));

        if (!field) return;

        event.preventDefault();
        field.focus({ preventScroll: true });
        field.scrollIntoView({
          block: 'center',
          behavior: reducedMotion.matches ? 'auto' : 'smooth'
        });
      });
    }

    var clearFieldError = function (input) {
      var error = document.getElementById(input.id + '-error');

      if (error && error.parentNode) error.parentNode.removeChild(error);

      input.removeAttribute('aria-invalid');

      if (input.getAttribute('aria-describedby') === input.id + '-error') {
        input.removeAttribute('aria-describedby');
      }
    };

    var showFieldError = function (input, message) {
      var error = document.getElementById(input.id + '-error');

      if (!error) {
        error = document.createElement('p');
        error.className = 'field__error';
        error.id = input.id + '-error';

        var field = input.closest('.field');
        (field || input.parentNode).appendChild(error);
      }

      error.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', error.id);
    };

    var validateField = function (input) {
      if (!input.name || !validators[input.name]) return true;

      var result = validators[input.name](input.value);

      if (result === true) {
        clearFieldError(input);
        return true;
      }

      showFieldError(input, result);
      return false;
    };

    var setStatus = function (type, message, link) {
      if (!status) return;

      status.textContent = '';
      status.className = 'form__status is-visible is-' + type;
      status.appendChild(document.createTextNode(message));

      if (link) {
        status.appendChild(document.createTextNode(' '));

        var anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = link.label;
        status.appendChild(anchor);
      }
    };

    var buildMessage = function () {
      return [
        'Olá, Dra. Débora! Vim pelo site e gostaria de agendar uma consulta.',
        '',
        'Nome: ' + form.elements.nome.value.trim(),
        'Telefone: ' + form.elements.telefone.value.trim(),
        'E-mail: ' + form.elements.email.value.trim(),
        'Necessidade: ' + form.elements.necessidade.value,
        'Situação atual: ' + form.elements.situacao.value,
        'Patrimônio estimado: ' + form.elements.patrimonio.value,
        '',
        'Mensagem enviada pelo site deboradenubila.adv.br'
      ].join('\n');
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        refreshSummary();

        /* Limpa um eventual aviso de sucesso anterior. */
        if (status) {
          status.textContent = '';
          status.className = 'form__status';
        }

        if (summary && !summary.hidden) {
          summary.focus();
        } else {
          firstInvalid.focus();
        }

        return;
      }

      refreshSummary();

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage());

      /* Abre o WhatsApp ainda dentro do clique (evita bloqueio de pop-up). */
      window.open(url, '_blank', 'noopener,noreferrer');

      setStatus(
        'success',
        'Abrimos o WhatsApp em uma nova aba com sua mensagem pronta. Se a janela não abriu, use o link:',
        { href: url, label: 'Abrir o WhatsApp novamente' }
      );

      if (window.dataLayer && window.DeboraConsent && window.DeboraConsent.analytics) {
        window.dataLayer.push({
          event: 'form_whatsapp',
          form: 'consulta',
          necessidade: form.elements.necessidade.value
        });
      }
    });

    /* Depois do primeiro erro, valida o campo assim que ele for corrigido. */
    form.addEventListener('input', function (event) {
      if (event.target.getAttribute('aria-invalid') === 'true') {
        validateField(event.target);
        if (summary && !summary.hidden) refreshSummary();
      }
    });

    form.addEventListener('change', function (event) {
      if (event.target.getAttribute('aria-invalid') === 'true') {
        validateField(event.target);
        if (summary && !summary.hidden) refreshSummary();
      }
    });
  }

  /* ========================================================================
     05b. Pré-seleciona "Quero participar de uma palestra" nos CTAs de palestra
     ===================================================================== */
  var interestLinks = document.querySelectorAll('[data-necessidade]');
  var interestSelect = document.getElementById('necessidade');

  if (interestLinks.length && interestSelect) {
    Array.prototype.forEach.call(interestLinks, function (link) {
      link.addEventListener('click', function () {
        interestSelect.value = link.getAttribute('data-necessidade');
      });
    });
  }

  /* ========================================================================
     06. Ano atual no rodapé
     ===================================================================== */
  var currentYear = String(new Date().getFullYear());

  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (item) {
    item.textContent = currentYear;
  });
})();
