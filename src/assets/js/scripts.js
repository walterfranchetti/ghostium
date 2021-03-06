/* global Drawer: false, ImageLoader: false, NProgress: false, Prism: false */
(function ($, window, document, undefined) {

  'use strict';

  $(function () {

    // Cache a couple of useful elements
    // =================
    var $window   = $(window),
        $document = $(document),
        $html     = $(document.documentElement),
        $body     = $(document.body),
        $surface  = $('.surface-container', $body);

    // Drawer bindings
    // =================
    Drawer.init();

    // PrismJS handler
    // =================
    Prism.languages.html = Prism.languages.markup;

    var _prismHandler = function() {
      $('code').not('[class*="language-"]').addClass(function() {
        var _lang = $(this).attr('class');
        return 'language-' + (_lang ? _lang : 'markup');
      });

      Prism.highlightAll();
    };

    _prismHandler();

    // PJax bindings
    // =================
    if ($.support.pjax) {
      $document.on('pjax:start', function() { NProgress.start(); });
      $document.on('pjax:end', function() {
        if(ga !== undefined) {
          ga('set', 'location', window.location.href);
          ga('send', 'pageview');
        }

        _prismHandler();
        NProgress.done();
      });

      var pjaxHandler = function(e) {
        $.pjax.click(e, {
          container: '[data-pjax-container]',
          fragment: '[data-pjax-container]',
          replace: true
        });
      };

      $document.on('click', 'a[data-pjax]', pjaxHandler);
      $document.on('submit', 'form[data-pjax]', pjaxHandler);
    }

    // Data API bindings
    // =================
    $document.on('click', '[data-action]', function(e) {
      var _self = $(this),
         action = _self.data('action');

      var _openWindow = function(url, h, w) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left,
            dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top,
            left = ((screen.width / 2) - (w / 2)) + dualScreenLeft,
            top = ((screen.height / 2) - (h / 2)) + dualScreenTop;

        var newWindow = window.open(url, '',
          'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no' +
          ', width=' + w +
          ', height=' + h +
          ', top=' + top +
          ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }
        return newWindow;
      };

      e.preventDefault();

      switch(action) {
        case 'open-drawer':
          Drawer.open();
          break;
        case 'close-drawer':
          Drawer.close();
          break;
        case 'share-gplus':
          _openWindow(
            'https://plus.google.com/share?url=' + encodeURIComponent(location.href),
            600, 600);
          break;
        case 'share-facebook':
          _openWindow(
            'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href),
            436, 626);
          break;
        case 'share-twitter':
          _openWindow(
            'https://twitter.com/share?url=' + encodeURIComponent(location.href),
            440, 550);
          break;
      }

      return false;
    });

    // Async load images
    $('[data-load-image]', $body).each(function() {
      ImageLoader.load($(this));
    });

    // Hide drawer button on scroll for best readability
    // =================
    $surface.on('scroll', function() {
      var offset = $surface.scrollTop(),
          btn = $('#drawer-button');
      if(offset === 0) {
        btn.removeClass('drawer-button-hidden');
      } else if(!btn.hasClass('drawer-button-hidden')) {
        btn.addClass('drawer-button-hidden');
      }
    });

    // Smooth scrolling for same page anchors
    // =================
    $document.on('click', 'a[href*=#]:not([href=#])', function(e) {
      e.preventDefault();

      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $surface.animate({
            scrollTop: target.offset().top
          }, 500);
          location.hash = this.hash;
          return false;
        }
      }
    });

  });

})(jQuery, window, document);
