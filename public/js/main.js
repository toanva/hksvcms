/* global: FB */
String.prototype.howArabic=function(){var t,r=this;return r=r.replace(/[\u0021-\u0040\s]/gm,""),t=r.match(/[\u0621-\u0652]/gm)||[],t.length/r.length},String.prototype.howNotArabic=function(){var t,r=this;return r=r.replace(/[\u0021-\u0040\s]/gm,""),t=r.match(/[^\u0621-\u0652]/gm)||[],t.length/r.length},String.prototype.isArabic=function(t){return t=t||.79,this.howArabic()>=t},String.prototype.hasArabic=function(){return/[\u0621-\u064A]/.test(this)},String.prototype.removeTashkel=function(){return this.replace(/[\u064B-\u0652]/gm,"")},String.prototype.removeNonArabic=function(){return this.replace(/[^\u0621-\u0652]/gm,"")},String.prototype.removeArabic=function(){return this.replace(/[\u0621-\u0652]/gm,"")};

var app = new function() {
  var _this = this, slickSettings = {}, textBlocks = [];

  _this.init = function() {
    _this._assets();
    _this._bind();
    _this.arabicFontDetect(textBlocks);
    _this.slickSliderInit();
    _this.tooltipInit();
    _this.md = new MobileDetect(window.navigator.userAgent);

    if (_this.md.phone()) {
      slickSettings.centerPadding = ($(document).width() - (65.625 * $(document).width() / 100) - 10) / 2 + 'px';
    }

    _this.changeOpenInMessengerBtnText();
  };

  _this._bind = function() {
    FB.Event.subscribe('send_to_messenger', function(e) {
      if (e.event === 'clicked') {
        _this.$dom.fb_send_to_messenger_btn.css('display', 'none');
        _this.$dom.open_in_messenger.addClass('open-in-messenger--bigger');
        _this.$dom.$phoneFooters.addClass('phone-footers_no-hide phone-footers_full')
      }
      if (e.event === 'rendered') {
        _this.$dom.fb_send_to_messenger_btn.addClass('fb-button-place_rendered');
      }
    });

    // _this.$dom.open_in_messenger.on('click', function(e){
    //   e.stopPropagation();
    //   if  (_this.md.match('iPhone')) {
    //     window.location.href = 'fb-messenger://thread/' + $('.fb-send-to-messenger').attr('page_id');
    //   }
    //   else if (_this.md.match('Android')) {
    //     window.location.href = 'fb-messenger://threads/';
    //   }
    // });

    $(window).on('scroll', function() {
      this.documentHeight = $('.container').outerHeight() - $(window).outerHeight();
      this.documentHeight = this.documentHeight - 40;
      var windowScrollValue = $(window).scrollTop();
      if (windowScrollValue >= this.documentHeight) {
        $('.phone-footers').addClass('phone-footers_tall');
      }
      else {
        $('.phone-footers').removeClass('phone-footers_tall');
      }
    });

    $(window).trigger('scroll');

    $('.iphone:not(.iphone_not-available)').on('click', function(e){
      e.stopPropagation();
      if ($('html').hasClass('mobile')) {
        $('html').addClass('no-scroll');
        $('.phone-footers').addClass('phone-footers_full-mobile')
      }
      $('.phone-footers').addClass('phone-footers_full');
    });

    $('.phone-footers__close-button').on('click', function(e){
      e.stopPropagation();
      $('.phone-footers').removeClass('phone-footers_full');
      $('html').removeClass('no-scroll');
    });

    $(document).on('click', function(e){
      $('.phone-footers').removeClass('phone-footers_full');
    });

    $('.bot-header').has('.bot-header__picture').css('margin-top', '0px');
  };

  _this._assets = function() {
    _this.$dom = {};
    _this.$dom.body = $('body');
    _this.$dom.fb_button_box = $('.fb-button-box');
    _this.$dom.fb_send_to_messenger_btn = $('.fb-button-place');
    _this.$dom.open_in_messenger = $('.open-in-messenger');
    _this.$dom.$phoneFooters = $('.phone-footers');
    _this.mobileDetect = new MobileDetect(window.navigator.userAgent);
    slickSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      arrows: false,
      mobileFirst: true,
      infinite: false,
      focusOnSelect: false,
    };
    textBlocks = [
      '.iphone__title',
      '.bot-title',
      '.display-bot-header__title',
      '.plugin__text',
      '.plugin__button',
      '.bot-description',
      '.quickreply__button',
      '.plugin__description-box'
    ];
  };

  _this.changeOpenInMessengerBtnText = function() {
    if ($('html').hasClass('mobile')) {
      _this.$dom.open_in_messenger.find('a').text('view on messenger');
    }
  };

  _this.arabicFontDetect = function(textBlocks) {
    textBlocks.forEach(function(block){
      $(block).each(function(index, $item){
        var innerText = $($item).text();
        var isArabic = innerText.howArabic() > 0;
        isArabic && $($item).addClass('arabic');
      })
    });
  };

  _this.slickSliderInit = function() {
    $('.slick-slider').slick(slickSettings);
  };

  _this.tooltipInit = function() {
    $('[data-toggle="tooltip"]').tooltip();
  }
};