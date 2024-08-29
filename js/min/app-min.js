!(function ($, e, n) {
  $(e).ready(function () {
    $(".mobile-navigation").append($(".main-navigation .menu").clone()),
      $(".menu-toggle").click(function () {
        $(".mobile-navigation").slideToggle();
      }),
      $(".offer img, .news img").panr({
        sensitivity: 15,
        scale: !1,
        scaleOnHover: !0,
        scaleTo: 1.2,
        scaleDuration: 0.25,
        panY: !0,
        panX: !0,
        panDuration: 1.25,
        resetPanOnMouseLeave: !1,
      }),
      $(".testimonial-slider, .hero-slider").flexslider({
        directionNav: !1,
        controlNav: !0,
      }),
      $(".map").length &&
        $(".map").gmap3(
          {
            map: { options: { maxZoom: 14, scrollwheel: !1 } },
            marker: {
              address: "Chau. de Roodebeek 206, 1200 Bruxelles, België",
            },
          },
          "autofit"
        );
  }),
    $(n).load(function () {});
})(jQuery, document, window);
