!(function (t) {
  (t.flexslider = function (e, i) {
    var n = t(e);
    n.vars = t.extend({}, t.flexslider.defaults, i);
    var s,
      r = n.vars.namespace,
      o =
        window.navigator &&
        window.navigator.msPointerEnabled &&
        window.MSGesture,
      a =
        ("ontouchstart" in window ||
          o ||
          (window.DocumentTouch && document instanceof DocumentTouch)) &&
        n.vars.touch,
      l = "click touchend MSPointerUp",
      h = "",
      u = "vertical" === n.vars.direction,
      c = n.vars.reverse,
      p = n.vars.itemWidth > 0,
      d = "fade" === n.vars.animation,
      f = "" !== n.vars.asNavFor,
      m = {},
      g = !0;
    t.data(e, "flexslider", n),
      (m = {
        init: function () {
          (n.animating = !1),
            (n.currentSlide = parseInt(
              n.vars.startAt ? n.vars.startAt : 0,
              10
            )),
            isNaN(n.currentSlide) && (n.currentSlide = 0),
            (n.animatingTo = n.currentSlide),
            (n.atEnd = 0 === n.currentSlide || n.currentSlide === n.last),
            (n.containerSelector = n.vars.selector.substr(
              0,
              n.vars.selector.search(" ")
            )),
            (n.slides = t(n.vars.selector, n)),
            (n.container = t(n.containerSelector, n)),
            (n.count = n.slides.length),
            (n.syncExists = t(n.vars.sync).length > 0),
            "slide" === n.vars.animation && (n.vars.animation = "swing"),
            (n.prop = u ? "top" : "marginLeft"),
            (n.args = {}),
            (n.manualPause = !1),
            (n.stopped = !1),
            (n.started = !1),
            (n.startTimeout = null),
            (n.transitions =
              !n.vars.video &&
              !d &&
              n.vars.useCSS &&
              (function () {
                var t = document.createElement("div"),
                  e = [
                    "perspectiveProperty",
                    "WebkitPerspective",
                    "MozPerspective",
                    "OPerspective",
                    "msPerspective",
                  ];
                for (var i in e)
                  if (void 0 !== t.style[e[i]])
                    return (
                      (n.pfx = e[i].replace("Perspective", "").toLowerCase()),
                      (n.prop = "-" + n.pfx + "-transform"),
                      !0
                    );
                return !1;
              })()),
            (n.ensureAnimationEnd = ""),
            "" !== n.vars.controlsContainer &&
              (n.controlsContainer =
                t(n.vars.controlsContainer).length > 0 &&
                t(n.vars.controlsContainer)),
            "" !== n.vars.manualControls &&
              (n.manualControls =
                t(n.vars.manualControls).length > 0 &&
                t(n.vars.manualControls)),
            n.vars.randomize &&
              (n.slides.sort(function () {
                return Math.round(Math.random()) - 0.5;
              }),
              n.container.empty().append(n.slides)),
            n.doMath(),
            n.setup("init"),
            n.vars.controlNav && m.controlNav.setup(),
            n.vars.directionNav && m.directionNav.setup(),
            n.vars.keyboard &&
              (1 === t(n.containerSelector).length ||
                n.vars.multipleKeyboard) &&
              t(document).bind("keyup", function (t) {
                var e = t.keyCode;
                if (!n.animating && (39 === e || 37 === e)) {
                  var i =
                    39 === e
                      ? n.getTarget("next")
                      : 37 === e
                      ? n.getTarget("prev")
                      : !1;
                  n.flexAnimate(i, n.vars.pauseOnAction);
                }
              }),
            n.vars.mousewheel &&
              n.bind("mousewheel", function (t, e) {
                t.preventDefault();
                var i = n.getTarget(0 > e ? "next" : "prev");
                n.flexAnimate(i, n.vars.pauseOnAction);
              }),
            n.vars.pausePlay && m.pausePlay.setup(),
            n.vars.slideshow &&
              n.vars.pauseInvisible &&
              m.pauseInvisible.init(),
            n.vars.slideshow &&
              (n.vars.pauseOnHover &&
                n.hover(
                  function () {
                    n.manualPlay || n.manualPause || n.pause();
                  },
                  function () {
                    n.manualPause || n.manualPlay || n.stopped || n.play();
                  }
                ),
              (n.vars.pauseInvisible && m.pauseInvisible.isHidden()) ||
                (n.vars.initDelay > 0
                  ? (n.startTimeout = setTimeout(n.play, n.vars.initDelay))
                  : n.play())),
            f && m.asNav.setup(),
            a && n.vars.touch && m.touch(),
            (!d || (d && n.vars.smoothHeight)) &&
              t(window).bind("resize orientationchange focus", m.resize),
            n.find("img").attr("draggable", "false"),
            setTimeout(function () {
              n.vars.start(n);
            }, 200);
        },
        asNav: {
          setup: function () {
            (n.asNav = !0),
              (n.animatingTo = Math.floor(n.currentSlide / n.move)),
              (n.currentItem = n.currentSlide),
              n.slides
                .removeClass(r + "active-slide")
                .eq(n.currentItem)
                .addClass(r + "active-slide"),
              o
                ? ((e._slider = n),
                  n.slides.each(function () {
                    var e = this;
                    (e._gesture = new MSGesture()),
                      (e._gesture.target = e),
                      e.addEventListener(
                        "MSPointerDown",
                        function (t) {
                          t.preventDefault(),
                            t.currentTarget._gesture &&
                              t.currentTarget._gesture.addPointer(t.pointerId);
                        },
                        !1
                      ),
                      e.addEventListener("MSGestureTap", function (e) {
                        e.preventDefault();
                        var i = t(this),
                          s = i.index();
                        t(n.vars.asNavFor).data("flexslider").animating ||
                          i.hasClass("active") ||
                          ((n.direction = n.currentItem < s ? "next" : "prev"),
                          n.flexAnimate(s, n.vars.pauseOnAction, !1, !0, !0));
                      });
                  }))
                : n.slides.on(l, function (e) {
                    e.preventDefault();
                    var i = t(this),
                      s = i.index(),
                      o = i.offset().left - t(n).scrollLeft();
                    0 >= o && i.hasClass(r + "active-slide")
                      ? n.flexAnimate(n.getTarget("prev"), !0)
                      : t(n.vars.asNavFor).data("flexslider").animating ||
                        i.hasClass(r + "active-slide") ||
                        ((n.direction = n.currentItem < s ? "next" : "prev"),
                        n.flexAnimate(s, n.vars.pauseOnAction, !1, !0, !0));
                  });
          },
        },
        controlNav: {
          setup: function () {
            n.manualControls
              ? m.controlNav.setupManual()
              : m.controlNav.setupPaging();
          },
          setupPaging: function () {
            var e,
              i,
              s =
                "thumbnails" === n.vars.controlNav
                  ? "control-thumbs"
                  : "control-paging",
              o = 1;
            if (
              ((n.controlNavScaffold = t(
                '<ol class="' + r + "control-nav " + r + s + '"></ol>'
              )),
              n.pagingCount > 1)
            )
              for (var a = 0; a < n.pagingCount; a++) {
                if (
                  ((i = n.slides.eq(a)),
                  (e =
                    "thumbnails" === n.vars.controlNav
                      ? '<img src="' + i.attr("data-thumb") + '"/>'
                      : "<a>" + o + "</a>"),
                  "thumbnails" === n.vars.controlNav &&
                    !0 === n.vars.thumbCaptions)
                ) {
                  var u = i.attr("data-thumbcaption");
                  "" != u &&
                    void 0 != u &&
                    (e += '<span class="' + r + 'caption">' + u + "</span>");
                }
                n.controlNavScaffold.append("<li>" + e + "</li>"), o++;
              }
            n.controlsContainer
              ? t(n.controlsContainer).append(n.controlNavScaffold)
              : n.append(n.controlNavScaffold),
              m.controlNav.set(),
              m.controlNav.active(),
              n.controlNavScaffold.delegate("a, img", l, function (e) {
                if ((e.preventDefault(), "" === h || h === e.type)) {
                  var i = t(this),
                    s = n.controlNav.index(i);
                  i.hasClass(r + "active") ||
                    ((n.direction = s > n.currentSlide ? "next" : "prev"),
                    n.flexAnimate(s, n.vars.pauseOnAction));
                }
                "" === h && (h = e.type), m.setToClearWatchedEvent();
              });
          },
          setupManual: function () {
            (n.controlNav = n.manualControls),
              m.controlNav.active(),
              n.controlNav.bind(l, function (e) {
                if ((e.preventDefault(), "" === h || h === e.type)) {
                  var i = t(this),
                    s = n.controlNav.index(i);
                  i.hasClass(r + "active") ||
                    ((n.direction = s > n.currentSlide ? "next" : "prev"),
                    n.flexAnimate(s, n.vars.pauseOnAction));
                }
                "" === h && (h = e.type), m.setToClearWatchedEvent();
              });
          },
          set: function () {
            var e = "thumbnails" === n.vars.controlNav ? "img" : "a";
            n.controlNav = t(
              "." + r + "control-nav li " + e,
              n.controlsContainer ? n.controlsContainer : n
            );
          },
          active: function () {
            n.controlNav
              .removeClass(r + "active")
              .eq(n.animatingTo)
              .addClass(r + "active");
          },
          update: function (e, i) {
            n.pagingCount > 1 && "add" === e
              ? n.controlNavScaffold.append(
                  t("<li><a>" + n.count + "</a></li>")
                )
              : 1 === n.pagingCount
              ? n.controlNavScaffold.find("li").remove()
              : n.controlNav.eq(i).closest("li").remove(),
              m.controlNav.set(),
              n.pagingCount > 1 && n.pagingCount !== n.controlNav.length
                ? n.update(i, e)
                : m.controlNav.active();
          },
        },
        directionNav: {
          setup: function () {
            var e = t(
              '<ul class="' +
                r +
                'direction-nav"><li><a class="' +
                r +
                'prev" href="#">' +
                n.vars.prevText +
                '</a></li><li><a class="' +
                r +
                'next" href="#">' +
                n.vars.nextText +
                "</a></li></ul>"
            );
            n.controlsContainer
              ? (t(n.controlsContainer).append(e),
                (n.directionNav = t(
                  "." + r + "direction-nav li a",
                  n.controlsContainer
                )))
              : (n.append(e),
                (n.directionNav = t("." + r + "direction-nav li a", n))),
              m.directionNav.update(),
              n.directionNav.bind(l, function (e) {
                e.preventDefault();
                var i;
                ("" === h || h === e.type) &&
                  ((i = n.getTarget(
                    t(this).hasClass(r + "next") ? "next" : "prev"
                  )),
                  n.flexAnimate(i, n.vars.pauseOnAction)),
                  "" === h && (h = e.type),
                  m.setToClearWatchedEvent();
              });
          },
          update: function () {
            var t = r + "disabled";
            1 === n.pagingCount
              ? n.directionNav.addClass(t).attr("tabindex", "-1")
              : n.vars.animationLoop
              ? n.directionNav.removeClass(t).removeAttr("tabindex")
              : 0 === n.animatingTo
              ? n.directionNav
                  .removeClass(t)
                  .filter("." + r + "prev")
                  .addClass(t)
                  .attr("tabindex", "-1")
              : n.animatingTo === n.last
              ? n.directionNav
                  .removeClass(t)
                  .filter("." + r + "next")
                  .addClass(t)
                  .attr("tabindex", "-1")
              : n.directionNav.removeClass(t).removeAttr("tabindex");
          },
        },
        pausePlay: {
          setup: function () {
            var e = t('<div class="' + r + 'pauseplay"><a></a></div>');
            n.controlsContainer
              ? (n.controlsContainer.append(e),
                (n.pausePlay = t("." + r + "pauseplay a", n.controlsContainer)))
              : (n.append(e), (n.pausePlay = t("." + r + "pauseplay a", n))),
              m.pausePlay.update(n.vars.slideshow ? r + "pause" : r + "play"),
              n.pausePlay.bind(l, function (e) {
                e.preventDefault(),
                  ("" === h || h === e.type) &&
                    (t(this).hasClass(r + "pause")
                      ? ((n.manualPause = !0), (n.manualPlay = !1), n.pause())
                      : ((n.manualPause = !1), (n.manualPlay = !0), n.play())),
                  "" === h && (h = e.type),
                  m.setToClearWatchedEvent();
              });
          },
          update: function (t) {
            "play" === t
              ? n.pausePlay
                  .removeClass(r + "pause")
                  .addClass(r + "play")
                  .html(n.vars.playText)
              : n.pausePlay
                  .removeClass(r + "play")
                  .addClass(r + "pause")
                  .html(n.vars.pauseText);
          },
        },
        touch: function () {
          function t(t) {
            n.animating
              ? t.preventDefault()
              : (window.navigator.msPointerEnabled || 1 === t.touches.length) &&
                (n.pause(),
                (g = u ? n.h : n.w),
                (_ = Number(new Date())),
                (w = t.touches[0].pageX),
                (x = t.touches[0].pageY),
                (m =
                  p && c && n.animatingTo === n.last
                    ? 0
                    : p && c
                    ? n.limit -
                      (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo
                    : p && n.currentSlide === n.last
                    ? n.limit
                    : p
                    ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide
                    : c
                    ? (n.last - n.currentSlide + n.cloneOffset) * g
                    : (n.currentSlide + n.cloneOffset) * g),
                (h = u ? x : w),
                (f = u ? w : x),
                e.addEventListener("touchmove", i, !1),
                e.addEventListener("touchend", s, !1));
          }
          function i(t) {
            (w = t.touches[0].pageX),
              (x = t.touches[0].pageY),
              (v = u ? h - x : h - w),
              (y = u
                ? Math.abs(v) < Math.abs(w - f)
                : Math.abs(v) < Math.abs(x - f));
            var e = 500;
            (!y || Number(new Date()) - _ > e) &&
              (t.preventDefault(),
              !d &&
                n.transitions &&
                (n.vars.animationLoop ||
                  (v /=
                    (0 === n.currentSlide && 0 > v) ||
                    (n.currentSlide === n.last && v > 0)
                      ? Math.abs(v) / g + 2
                      : 1),
                n.setProps(m + v, "setTouch")));
          }
          function s() {
            if (
              (e.removeEventListener("touchmove", i, !1),
              n.animatingTo === n.currentSlide && !y && null !== v)
            ) {
              var t = c ? -v : v,
                r = n.getTarget(t > 0 ? "next" : "prev");
              n.canAdvance(r) &&
              ((Number(new Date()) - _ < 550 && Math.abs(t) > 50) ||
                Math.abs(t) > g / 2)
                ? n.flexAnimate(r, n.vars.pauseOnAction)
                : d || n.flexAnimate(n.currentSlide, n.vars.pauseOnAction, !0);
            }
            e.removeEventListener("touchend", s, !1),
              (h = null),
              (f = null),
              (v = null),
              (m = null);
          }
          function r(t) {
            t.stopPropagation(),
              n.animating
                ? t.preventDefault()
                : (n.pause(),
                  e._gesture.addPointer(t.pointerId),
                  (b = 0),
                  (g = u ? n.h : n.w),
                  (_ = Number(new Date())),
                  (m =
                    p && c && n.animatingTo === n.last
                      ? 0
                      : p && c
                      ? n.limit -
                        (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo
                      : p && n.currentSlide === n.last
                      ? n.limit
                      : p
                      ? (n.itemW + n.vars.itemMargin) * n.move * n.currentSlide
                      : c
                      ? (n.last - n.currentSlide + n.cloneOffset) * g
                      : (n.currentSlide + n.cloneOffset) * g));
          }
          function a(t) {
            t.stopPropagation();
            var i = t.target._slider;
            if (i) {
              var n = -t.translationX,
                s = -t.translationY;
              return (
                (b += u ? s : n),
                (v = b),
                (y = u
                  ? Math.abs(b) < Math.abs(-n)
                  : Math.abs(b) < Math.abs(-s)),
                t.detail === t.MSGESTURE_FLAG_INERTIA
                  ? void setImmediate(function () {
                      e._gesture.stop();
                    })
                  : void (
                      (!y || Number(new Date()) - _ > 500) &&
                      (t.preventDefault(),
                      !d &&
                        i.transitions &&
                        (i.vars.animationLoop ||
                          (v =
                            b /
                            ((0 === i.currentSlide && 0 > b) ||
                            (i.currentSlide === i.last && b > 0)
                              ? Math.abs(b) / g + 2
                              : 1)),
                        i.setProps(m + v, "setTouch")))
                    )
              );
            }
          }
          function l(t) {
            t.stopPropagation();
            var e = t.target._slider;
            if (e) {
              if (e.animatingTo === e.currentSlide && !y && null !== v) {
                var i = c ? -v : v,
                  n = e.getTarget(i > 0 ? "next" : "prev");
                e.canAdvance(n) &&
                ((Number(new Date()) - _ < 550 && Math.abs(i) > 50) ||
                  Math.abs(i) > g / 2)
                  ? e.flexAnimate(n, e.vars.pauseOnAction)
                  : d ||
                    e.flexAnimate(e.currentSlide, e.vars.pauseOnAction, !0);
              }
              (h = null), (f = null), (v = null), (m = null), (b = 0);
            }
          }
          var h,
            f,
            m,
            g,
            v,
            _,
            y = !1,
            w = 0,
            x = 0,
            b = 0;
          o
            ? ((e.style.msTouchAction = "none"),
              (e._gesture = new MSGesture()),
              (e._gesture.target = e),
              e.addEventListener("MSPointerDown", r, !1),
              (e._slider = n),
              e.addEventListener("MSGestureChange", a, !1),
              e.addEventListener("MSGestureEnd", l, !1))
            : e.addEventListener("touchstart", t, !1);
        },
        resize: function () {
          !n.animating &&
            n.is(":visible") &&
            (p || n.doMath(),
            d
              ? m.smoothHeight()
              : p
              ? (n.slides.width(n.computedW),
                n.update(n.pagingCount),
                n.setProps())
              : u
              ? (n.viewport.height(n.h), n.setProps(n.h, "setTotal"))
              : (n.vars.smoothHeight && m.smoothHeight(),
                n.newSlides.width(n.computedW),
                n.setProps(n.computedW, "setTotal")));
        },
        smoothHeight: function (t) {
          if (!u || d) {
            var e = d ? n : n.viewport;
            t
              ? e.animate({ height: n.slides.eq(n.animatingTo).height() }, t)
              : e.height(n.slides.eq(n.animatingTo).height());
          }
        },
        sync: function (e) {
          var i = t(n.vars.sync).data("flexslider"),
            s = n.animatingTo;
          switch (e) {
            case "animate":
              i.flexAnimate(s, n.vars.pauseOnAction, !1, !0);
              break;
            case "play":
              i.playing || i.asNav || i.play();
              break;
            case "pause":
              i.pause();
          }
        },
        uniqueID: function (e) {
          return (
            e.find("[id]").each(function () {
              var e = t(this);
              e.attr("id", e.attr("id") + "_clone");
            }),
            e
          );
        },
        pauseInvisible: {
          visProp: null,
          init: function () {
            var t = ["webkit", "moz", "ms", "o"];
            if ("hidden" in document) return "hidden";
            for (var e = 0; e < t.length; e++)
              t[e] + "Hidden" in document &&
                (m.pauseInvisible.visProp = t[e] + "Hidden");
            if (m.pauseInvisible.visProp) {
              var i =
                m.pauseInvisible.visProp.replace(/[H|h]idden/, "") +
                "visibilitychange";
              document.addEventListener(i, function () {
                m.pauseInvisible.isHidden()
                  ? n.startTimeout
                    ? clearTimeout(n.startTimeout)
                    : n.pause()
                  : n.started
                  ? n.play()
                  : n.vars.initDelay > 0
                  ? setTimeout(n.play, n.vars.initDelay)
                  : n.play();
              });
            }
          },
          isHidden: function () {
            return document[m.pauseInvisible.visProp] || !1;
          },
        },
        setToClearWatchedEvent: function () {
          clearTimeout(s),
            (s = setTimeout(function () {
              h = "";
            }, 3e3));
        },
      }),
      (n.flexAnimate = function (e, i, s, o, l) {
        if (
          (n.vars.animationLoop ||
            e === n.currentSlide ||
            (n.direction = e > n.currentSlide ? "next" : "prev"),
          f &&
            1 === n.pagingCount &&
            (n.direction = n.currentItem < e ? "next" : "prev"),
          !n.animating && (n.canAdvance(e, l) || s) && n.is(":visible"))
        ) {
          if (f && o) {
            var h = t(n.vars.asNavFor).data("flexslider");
            if (
              ((n.atEnd = 0 === e || e === n.count - 1),
              h.flexAnimate(e, !0, !1, !0, l),
              (n.direction = n.currentItem < e ? "next" : "prev"),
              (h.direction = n.direction),
              Math.ceil((e + 1) / n.visible) - 1 === n.currentSlide || 0 === e)
            )
              return (
                (n.currentItem = e),
                n.slides
                  .removeClass(r + "active-slide")
                  .eq(e)
                  .addClass(r + "active-slide"),
                !1
              );
            (n.currentItem = e),
              n.slides
                .removeClass(r + "active-slide")
                .eq(e)
                .addClass(r + "active-slide"),
              (e = Math.floor(e / n.visible));
          }
          if (
            ((n.animating = !0),
            (n.animatingTo = e),
            i && n.pause(),
            n.vars.before(n),
            n.syncExists && !l && m.sync("animate"),
            n.vars.controlNav && m.controlNav.active(),
            p ||
              n.slides
                .removeClass(r + "active-slide")
                .eq(e)
                .addClass(r + "active-slide"),
            (n.atEnd = 0 === e || e === n.last),
            n.vars.directionNav && m.directionNav.update(),
            e === n.last && (n.vars.end(n), n.vars.animationLoop || n.pause()),
            d)
          )
            a
              ? (n.slides.eq(n.currentSlide).css({ opacity: 0, zIndex: 1 }),
                n.slides.eq(e).css({ opacity: 1, zIndex: 2 }),
                n.wrapup(y))
              : (n.slides
                  .eq(n.currentSlide)
                  .css({ zIndex: 1 })
                  .animate(
                    { opacity: 0 },
                    n.vars.animationSpeed,
                    n.vars.easing
                  ),
                n.slides
                  .eq(e)
                  .css({ zIndex: 2 })
                  .animate(
                    { opacity: 1 },
                    n.vars.animationSpeed,
                    n.vars.easing,
                    n.wrapup
                  ));
          else {
            var g,
              v,
              _,
              y = u ? n.slides.filter(":first").height() : n.computedW;
            p
              ? ((g = n.vars.itemMargin),
                (_ = (n.itemW + g) * n.move * n.animatingTo),
                (v = _ > n.limit && 1 !== n.visible ? n.limit : _))
              : (v =
                  0 === n.currentSlide &&
                  e === n.count - 1 &&
                  n.vars.animationLoop &&
                  "next" !== n.direction
                    ? c
                      ? (n.count + n.cloneOffset) * y
                      : 0
                    : n.currentSlide === n.last &&
                      0 === e &&
                      n.vars.animationLoop &&
                      "prev" !== n.direction
                    ? c
                      ? 0
                      : (n.count + 1) * y
                    : c
                    ? (n.count - 1 - e + n.cloneOffset) * y
                    : (e + n.cloneOffset) * y),
              n.setProps(v, "", n.vars.animationSpeed),
              n.transitions
                ? ((n.vars.animationLoop && n.atEnd) ||
                    ((n.animating = !1), (n.currentSlide = n.animatingTo)),
                  n.container.unbind("webkitTransitionEnd transitionend"),
                  n.container.bind(
                    "webkitTransitionEnd transitionend",
                    function () {
                      clearTimeout(n.ensureAnimationEnd), n.wrapup(y);
                    }
                  ),
                  clearTimeout(n.ensureAnimationEnd),
                  (n.ensureAnimationEnd = setTimeout(function () {
                    n.wrapup(y);
                  }, n.vars.animationSpeed + 100)))
                : n.container.animate(
                    n.args,
                    n.vars.animationSpeed,
                    n.vars.easing,
                    function () {
                      n.wrapup(y);
                    }
                  );
          }
          n.vars.smoothHeight && m.smoothHeight(n.vars.animationSpeed);
        }
      }),
      (n.wrapup = function (t) {
        d ||
          p ||
          (0 === n.currentSlide &&
          n.animatingTo === n.last &&
          n.vars.animationLoop
            ? n.setProps(t, "jumpEnd")
            : n.currentSlide === n.last &&
              0 === n.animatingTo &&
              n.vars.animationLoop &&
              n.setProps(t, "jumpStart")),
          (n.animating = !1),
          (n.currentSlide = n.animatingTo),
          n.vars.after(n);
      }),
      (n.animateSlides = function () {
        !n.animating && g && n.flexAnimate(n.getTarget("next"));
      }),
      (n.pause = function () {
        clearInterval(n.animatedSlides),
          (n.animatedSlides = null),
          (n.playing = !1),
          n.vars.pausePlay && m.pausePlay.update("play"),
          n.syncExists && m.sync("pause");
      }),
      (n.play = function () {
        n.playing && clearInterval(n.animatedSlides),
          (n.animatedSlides =
            n.animatedSlides ||
            setInterval(n.animateSlides, n.vars.slideshowSpeed)),
          (n.started = n.playing = !0),
          n.vars.pausePlay && m.pausePlay.update("pause"),
          n.syncExists && m.sync("play");
      }),
      (n.stop = function () {
        n.pause(), (n.stopped = !0);
      }),
      (n.canAdvance = function (t, e) {
        var i = f ? n.pagingCount - 1 : n.last;
        return e
          ? !0
          : f &&
            n.currentItem === n.count - 1 &&
            0 === t &&
            "prev" === n.direction
          ? !0
          : f &&
            0 === n.currentItem &&
            t === n.pagingCount - 1 &&
            "next" !== n.direction
          ? !1
          : t !== n.currentSlide || f
          ? n.vars.animationLoop
            ? !0
            : n.atEnd &&
              0 === n.currentSlide &&
              t === i &&
              "next" !== n.direction
            ? !1
            : n.atEnd &&
              n.currentSlide === i &&
              0 === t &&
              "next" === n.direction
            ? !1
            : !0
          : !1;
      }),
      (n.getTarget = function (t) {
        return (
          (n.direction = t),
          "next" === t
            ? n.currentSlide === n.last
              ? 0
              : n.currentSlide + 1
            : 0 === n.currentSlide
            ? n.last
            : n.currentSlide - 1
        );
      }),
      (n.setProps = function (t, e, i) {
        var s = (function () {
          var i = t
              ? t
              : (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo,
            s = (function () {
              if (p)
                return "setTouch" === e
                  ? t
                  : c && n.animatingTo === n.last
                  ? 0
                  : c
                  ? n.limit -
                    (n.itemW + n.vars.itemMargin) * n.move * n.animatingTo
                  : n.animatingTo === n.last
                  ? n.limit
                  : i;
              switch (e) {
                case "setTotal":
                  return c
                    ? (n.count - 1 - n.currentSlide + n.cloneOffset) * t
                    : (n.currentSlide + n.cloneOffset) * t;
                case "setTouch":
                  return c ? t : t;
                case "jumpEnd":
                  return c ? t : n.count * t;
                case "jumpStart":
                  return c ? n.count * t : t;
                default:
                  return t;
              }
            })();
          return -1 * s + "px";
        })();
        n.transitions &&
          ((s = u
            ? "translate3d(0," + s + ",0)"
            : "translate3d(" + s + ",0,0)"),
          (i = void 0 !== i ? i / 1e3 + "s" : "0s"),
          n.container.css("-" + n.pfx + "-transition-duration", i),
          n.container.css("transition-duration", i)),
          (n.args[n.prop] = s),
          (n.transitions || void 0 === i) && n.container.css(n.args),
          n.container.css("transform", s);
      }),
      (n.setup = function (e) {
        if (d)
          n.slides.css({
            width: "100%",
            float: "left",
            marginRight: "-100%",
            position: "relative",
          }),
            "init" === e &&
              (a
                ? n.slides
                    .css({
                      opacity: 0,
                      display: "block",
                      webkitTransition:
                        "opacity " + n.vars.animationSpeed / 1e3 + "s ease",
                      zIndex: 1,
                    })
                    .eq(n.currentSlide)
                    .css({ opacity: 1, zIndex: 2 })
                : n.slides
                    .css({ opacity: 0, display: "block", zIndex: 1 })
                    .eq(n.currentSlide)
                    .css({ zIndex: 2 })
                    .animate(
                      { opacity: 1 },
                      n.vars.animationSpeed,
                      n.vars.easing
                    )),
            n.vars.smoothHeight && m.smoothHeight();
        else {
          var i, s;
          "init" === e &&
            ((n.viewport = t('<div class="' + r + 'viewport"></div>')
              .css({ overflow: "hidden", position: "relative" })
              .appendTo(n)
              .append(n.container)),
            (n.cloneCount = 0),
            (n.cloneOffset = 0),
            c &&
              ((s = t.makeArray(n.slides).reverse()),
              (n.slides = t(s)),
              n.container.empty().append(n.slides))),
            n.vars.animationLoop &&
              !p &&
              ((n.cloneCount = 2),
              (n.cloneOffset = 1),
              "init" !== e && n.container.find(".clone").remove(),
              m
                .uniqueID(
                  n.slides
                    .first()
                    .clone()
                    .addClass("clone")
                    .attr("aria-hidden", "true")
                )
                .appendTo(n.container),
              m
                .uniqueID(
                  n.slides
                    .last()
                    .clone()
                    .addClass("clone")
                    .attr("aria-hidden", "true")
                )
                .prependTo(n.container)),
            (n.newSlides = t(n.vars.selector, n)),
            (i = c
              ? n.count - 1 - n.currentSlide + n.cloneOffset
              : n.currentSlide + n.cloneOffset),
            u && !p
              ? (n.container
                  .height(200 * (n.count + n.cloneCount) + "%")
                  .css("position", "absolute")
                  .width("100%"),
                setTimeout(
                  function () {
                    n.newSlides.css({ display: "block" }),
                      n.doMath(),
                      n.viewport.height(n.h),
                      n.setProps(i * n.h, "init");
                  },
                  "init" === e ? 100 : 0
                ))
              : (n.container.width(200 * (n.count + n.cloneCount) + "%"),
                n.setProps(i * n.computedW, "init"),
                setTimeout(
                  function () {
                    n.doMath(),
                      n.newSlides.css({
                        width: n.computedW,
                        float: "left",
                        display: "block",
                      }),
                      n.vars.smoothHeight && m.smoothHeight();
                  },
                  "init" === e ? 100 : 0
                ));
        }
        p ||
          n.slides
            .removeClass(r + "active-slide")
            .eq(n.currentSlide)
            .addClass(r + "active-slide"),
          n.vars.init(n);
      }),
      (n.doMath = function () {
        var t = n.slides.first(),
          e = n.vars.itemMargin,
          i = n.vars.minItems,
          s = n.vars.maxItems;
        (n.w = void 0 === n.viewport ? n.width() : n.viewport.width()),
          (n.h = t.height()),
          (n.boxPadding = t.outerWidth() - t.width()),
          p
            ? ((n.itemT = n.vars.itemWidth + e),
              (n.minW = i ? i * n.itemT : n.w),
              (n.maxW = s ? s * n.itemT - e : n.w),
              (n.itemW =
                n.minW > n.w
                  ? (n.w - e * (i - 1)) / i
                  : n.maxW < n.w
                  ? (n.w - e * (s - 1)) / s
                  : n.vars.itemWidth > n.w
                  ? n.w
                  : n.vars.itemWidth),
              (n.visible = Math.floor(n.w / n.itemW)),
              (n.move =
                n.vars.move > 0 && n.vars.move < n.visible
                  ? n.vars.move
                  : n.visible),
              (n.pagingCount = Math.ceil((n.count - n.visible) / n.move + 1)),
              (n.last = n.pagingCount - 1),
              (n.limit =
                1 === n.pagingCount
                  ? 0
                  : n.vars.itemWidth > n.w
                  ? n.itemW * (n.count - 1) + e * (n.count - 1)
                  : (n.itemW + e) * n.count - n.w - e))
            : ((n.itemW = n.w),
              (n.pagingCount = n.count),
              (n.last = n.count - 1)),
          (n.computedW = n.itemW - n.boxPadding);
      }),
      (n.update = function (t, e) {
        n.doMath(),
          p ||
            (t < n.currentSlide
              ? (n.currentSlide += 1)
              : t <= n.currentSlide && 0 !== t && (n.currentSlide -= 1),
            (n.animatingTo = n.currentSlide)),
          n.vars.controlNav &&
            !n.manualControls &&
            (("add" === e && !p) || n.pagingCount > n.controlNav.length
              ? m.controlNav.update("add")
              : (("remove" === e && !p) ||
                  n.pagingCount < n.controlNav.length) &&
                (p &&
                  n.currentSlide > n.last &&
                  ((n.currentSlide -= 1), (n.animatingTo -= 1)),
                m.controlNav.update("remove", n.last))),
          n.vars.directionNav && m.directionNav.update();
      }),
      (n.addSlide = function (e, i) {
        var s = t(e);
        (n.count += 1),
          (n.last = n.count - 1),
          u && c
            ? void 0 !== i
              ? n.slides.eq(n.count - i).after(s)
              : n.container.prepend(s)
            : void 0 !== i
            ? n.slides.eq(i).before(s)
            : n.container.append(s),
          n.update(i, "add"),
          (n.slides = t(n.vars.selector + ":not(.clone)", n)),
          n.setup(),
          n.vars.added(n);
      }),
      (n.removeSlide = function (e) {
        var i = isNaN(e) ? n.slides.index(t(e)) : e;
        (n.count -= 1),
          (n.last = n.count - 1),
          isNaN(e)
            ? t(e, n.slides).remove()
            : u && c
            ? n.slides.eq(n.last).remove()
            : n.slides.eq(e).remove(),
          n.doMath(),
          n.update(i, "remove"),
          (n.slides = t(n.vars.selector + ":not(.clone)", n)),
          n.setup(),
          n.vars.removed(n);
      }),
      m.init();
  }),
    t(window)
      .blur(function () {
        focused = !1;
      })
      .focus(function () {
        focused = !0;
      }),
    (t.flexslider.defaults = {
      namespace: "flex-",
      selector: ".slides > li",
      animation: "fade",
      easing: "swing",
      direction: "horizontal",
      reverse: !1,
      animationLoop: !0,
      smoothHeight: !1,
      startAt: 0,
      slideshow: !0,
      slideshowSpeed: 7e3,
      animationSpeed: 600,
      initDelay: 0,
      randomize: !1,
      thumbCaptions: !1,
      pauseOnAction: !0,
      pauseOnHover: !1,
      pauseInvisible: !0,
      useCSS: !0,
      touch: !0,
      video: !1,
      controlNav: !0,
      directionNav: !0,
      prevText: "Previous",
      nextText: "Next",
      keyboard: !0,
      multipleKeyboard: !1,
      mousewheel: !1,
      pausePlay: !1,
      pauseText: "Pause",
      playText: "Play",
      controlsContainer: "",
      manualControls: "",
      sync: "",
      asNavFor: "",
      itemWidth: 0,
      itemMargin: 0,
      minItems: 1,
      maxItems: 0,
      move: 0,
      allowOneSlide: !0,
      start: function () {},
      before: function () {},
      after: function () {},
      end: function () {},
      added: function () {},
      removed: function () {},
      init: function () {},
    }),
    (t.fn.flexslider = function (e) {
      if ((void 0 === e && (e = {}), "object" == typeof e))
        return this.each(function () {
          var i = t(this),
            n = e.selector ? e.selector : ".slides > li",
            s = i.find(n);
          (1 === s.length && e.allowOneSlide === !0) || 0 === s.length
            ? (s.fadeIn(400), e.start && e.start(i))
            : void 0 === i.data("flexslider") && new t.flexslider(this, e);
        });
      var i = t(this).data("flexslider");
      switch (e) {
        case "play":
          i.play();
          break;
        case "pause":
          i.pause();
          break;
        case "stop":
          i.stop();
          break;
        case "next":
          i.flexAnimate(i.getTarget("next"), !0);
          break;
        case "prev":
        case "previous":
          i.flexAnimate(i.getTarget("prev"), !0);
          break;
        default:
          "number" == typeof e && i.flexAnimate(e, !0);
      }
    });
})(jQuery),
  !(function () {
    function t() {}
    function e(t) {
      return r.retinaImageSuffix + t;
    }
    function i(t, i) {
      if (((this.path = t || ""), "undefined" != typeof i && null !== i))
        (this.at_2x_path = i), (this.perform_check = !1);
      else {
        if (void 0 !== document.createElement) {
          var n = document.createElement("a");
          (n.href = this.path),
            (n.pathname = n.pathname.replace(o, e)),
            (this.at_2x_path = n.href);
        } else {
          var s = this.path.split("?");
          (s[0] = s[0].replace(o, e)), (this.at_2x_path = s.join("?"));
        }
        this.perform_check = !0;
      }
    }
    function n(t) {
      (this.el = t),
        (this.path = new i(
          this.el.getAttribute("src"),
          this.el.getAttribute("data-at2x")
        ));
      var e = this;
      this.path.check_2x_variant(function (t) {
        t && e.swap();
      });
    }
    var s = "undefined" == typeof exports ? window : exports,
      r = {
        retinaImageSuffix: "@2x",
        check_mime_type: !0,
        force_original_dimensions: !0,
      };
    (s.Retina = t),
      (t.configure = function (t) {
        null === t && (t = {});
        for (var e in t) t.hasOwnProperty(e) && (r[e] = t[e]);
      }),
      (t.init = function (t) {
        null === t && (t = s);
        var e = t.onload || function () {};
        t.onload = function () {
          var t,
            i,
            s = document.getElementsByTagName("img"),
            r = [];
          for (t = 0; t < s.length; t += 1)
            (i = s[t]),
              i.getAttributeNode("data-no-retina") || r.push(new n(i));
          e();
        };
      }),
      (t.isRetina = function () {
        var t =
          "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
        return s.devicePixelRatio > 1
          ? !0
          : s.matchMedia && s.matchMedia(t).matches
          ? !0
          : !1;
      });
    var o = /\.\w+$/;
    (s.RetinaImagePath = i),
      (i.confirmed_paths = []),
      (i.prototype.is_external = function () {
        return !(
          !this.path.match(/^https?\:/i) ||
          this.path.match("//" + document.domain)
        );
      }),
      (i.prototype.check_2x_variant = function (t) {
        var e,
          n = this;
        return this.is_external()
          ? t(!1)
          : this.perform_check ||
            "undefined" == typeof this.at_2x_path ||
            null === this.at_2x_path
          ? this.at_2x_path in i.confirmed_paths
            ? t(!0)
            : ((e = new XMLHttpRequest()),
              e.open("HEAD", this.at_2x_path),
              (e.onreadystatechange = function () {
                if (4 !== e.readyState) return t(!1);
                if (e.status >= 200 && e.status <= 399) {
                  if (r.check_mime_type) {
                    var s = e.getResponseHeader("Content-Type");
                    if (null === s || !s.match(/^image/i)) return t(!1);
                  }
                  return i.confirmed_paths.push(n.at_2x_path), t(!0);
                }
                return t(!1);
              }),
              void e.send())
          : t(!0);
      }),
      (s.RetinaImage = n),
      (n.prototype.swap = function (t) {
        function e() {
          i.el.complete
            ? (r.force_original_dimensions &&
                (i.el.setAttribute("width", i.el.offsetWidth),
                i.el.setAttribute("height", i.el.offsetHeight)),
              i.el.setAttribute("src", t))
            : setTimeout(e, 5);
        }
        "undefined" == typeof t && (t = this.path.at_2x_path);
        var i = this;
        e();
      }),
      t.isRetina() && t.init(s);
  })(),
  (window.Modernizr = (function (t, e, i) {
    function n(t) {
      g.cssText = t;
    }
    function s(t, e) {
      return n(y.join(t + ";") + (e || ""));
    }
    function r(t, e) {
      return typeof t === e;
    }
    function o(t, e) {
      return !!~("" + t).indexOf(e);
    }
    function a(t, e) {
      for (var n in t) {
        var s = t[n];
        if (!o(s, "-") && g[s] !== i) return "pfx" == e ? s : !0;
      }
      return !1;
    }
    function l(t, e, n) {
      for (var s in t) {
        var o = e[t[s]];
        if (o !== i)
          return n === !1 ? t[s] : r(o, "function") ? o.bind(n || e) : o;
      }
      return !1;
    }
    function h(t, e, i) {
      var n = t.charAt(0).toUpperCase() + t.slice(1),
        s = (t + " " + x.join(n + " ") + n).split(" ");
      return r(e, "string") || r(e, "undefined")
        ? a(s, e)
        : ((s = (t + " " + b.join(n + " ") + n).split(" ")), l(s, e, i));
    }
    var u = "2.8.3",
      c = {},
      p = !0,
      d = e.documentElement,
      f = "modernizr",
      m = e.createElement(f),
      g = m.style,
      v,
      _ = {}.toString,
      y = " -webkit- -moz- -o- -ms- ".split(" "),
      w = "Webkit Moz O ms",
      x = w.split(" "),
      b = w.toLowerCase().split(" "),
      T = { svg: "http://www.w3.org/2000/svg" },
      S = {},
      C = {},
      P = {},
      E = [],
      L = E.slice,
      M,
      I = {}.hasOwnProperty,
      O;
    (O =
      r(I, "undefined") || r(I.call, "undefined")
        ? function (t, e) {
            return e in t && r(t.constructor.prototype[e], "undefined");
          }
        : function (t, e) {
            return I.call(t, e);
          }),
      Function.prototype.bind ||
        (Function.prototype.bind = function (t) {
          var e = this;
          if ("function" != typeof e) throw new TypeError();
          var i = L.call(arguments, 1),
            n = function () {
              if (this instanceof n) {
                var s = function () {};
                s.prototype = e.prototype;
                var r = new s(),
                  o = e.apply(r, i.concat(L.call(arguments)));
                return Object(o) === o ? o : r;
              }
              return e.apply(t, i.concat(L.call(arguments)));
            };
          return n;
        }),
      (S.cssgradients = function () {
        var t = "background-image:",
          e = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
          i = "linear-gradient(left top,#9f9, white);";
        return (
          n(
            (t + "-webkit- ".split(" ").join(e + t) + y.join(i + t)).slice(
              0,
              -t.length
            )
          ),
          o(g.backgroundImage, "gradient")
        );
      }),
      (S.csstransforms = function () {
        return !!h("transform");
      }),
      (S.csstransitions = function () {
        return h("transition");
      }),
      (S.svg = function () {
        return (
          !!e.createElementNS && !!e.createElementNS(T.svg, "svg").createSVGRect
        );
      }),
      (S.inlinesvg = function () {
        var t = e.createElement("div");
        return (
          (t.innerHTML = "<svg/>"),
          (t.firstChild && t.firstChild.namespaceURI) == T.svg
        );
      }),
      (S.svgclippaths = function () {
        return (
          !!e.createElementNS &&
          /SVGClipPath/.test(_.call(e.createElementNS(T.svg, "clipPath")))
        );
      });
    for (var k in S)
      O(S, k) &&
        ((M = k.toLowerCase()),
        (c[M] = S[k]()),
        E.push((c[M] ? "" : "no-") + M));
    return (
      (c.addTest = function (t, e) {
        if ("object" == typeof t)
          for (var n in t) O(t, n) && c.addTest(n, t[n]);
        else {
          if (((t = t.toLowerCase()), c[t] !== i)) return c;
          (e = "function" == typeof e ? e() : e),
            "undefined" != typeof p &&
              p &&
              (d.className += " " + (e ? "" : "no-") + t),
            (c[t] = e);
        }
        return c;
      }),
      n(""),
      (m = v = null),
      (function (t, e) {
        function i(t, e) {
          var i = t.createElement("p"),
            n = t.getElementsByTagName("head")[0] || t.documentElement;
          return (
            (i.innerHTML = "x<style>" + e + "</style>"),
            n.insertBefore(i.lastChild, n.firstChild)
          );
        }
        function n() {
          var t = _.elements;
          return "string" == typeof t ? t.split(" ") : t;
        }
        function s(t) {
          var e = g[t[f]];
          return e || ((e = {}), m++, (t[f] = m), (g[m] = e)), e;
        }
        function r(t, i, n) {
          if ((i || (i = e), v)) return i.createElement(t);
          n || (n = s(i));
          var r;
          return (
            (r = n.cache[t]
              ? n.cache[t].cloneNode()
              : p.test(t)
              ? (n.cache[t] = n.createElem(t)).cloneNode()
              : n.createElem(t)),
            !r.canHaveChildren || c.test(t) || r.tagUrn
              ? r
              : n.frag.appendChild(r)
          );
        }
        function o(t, i) {
          if ((t || (t = e), v)) return t.createDocumentFragment();
          i = i || s(t);
          for (
            var r = i.frag.cloneNode(), o = 0, a = n(), l = a.length;
            l > o;
            o++
          )
            r.createElement(a[o]);
          return r;
        }
        function a(t, e) {
          e.cache ||
            ((e.cache = {}),
            (e.createElem = t.createElement),
            (e.createFrag = t.createDocumentFragment),
            (e.frag = e.createFrag())),
            (t.createElement = function (i) {
              return _.shivMethods ? r(i, t, e) : e.createElem(i);
            }),
            (t.createDocumentFragment = Function(
              "h,f",
              "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" +
                n()
                  .join()
                  .replace(/[\w\-]+/g, function (t) {
                    return (
                      e.createElem(t), e.frag.createElement(t), 'c("' + t + '")'
                    );
                  }) +
                ");return n}"
            )(_, e.frag));
        }
        function l(t) {
          t || (t = e);
          var n = s(t);
          return (
            _.shivCSS &&
              !d &&
              !n.hasCSS &&
              (n.hasCSS = !!i(
                t,
                "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}"
              )),
            v || a(t, n),
            t
          );
        }
        var h = "3.7.0",
          u = t.html5 || {},
          c =
            /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
          p =
            /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
          d,
          f = "_html5shiv",
          m = 0,
          g = {},
          v;
        !(function () {
          try {
            var t = e.createElement("a");
            (t.innerHTML = "<xyz></xyz>"),
              (d = "hidden" in t),
              (v =
                1 == t.childNodes.length ||
                (function () {
                  e.createElement("a");
                  var t = e.createDocumentFragment();
                  return (
                    "undefined" == typeof t.cloneNode ||
                    "undefined" == typeof t.createDocumentFragment ||
                    "undefined" == typeof t.createElement
                  );
                })());
          } catch (i) {
            (d = !0), (v = !0);
          }
        })();
        var _ = {
          elements:
            u.elements ||
            "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
          version: h,
          shivCSS: u.shivCSS !== !1,
          supportsUnknownElements: v,
          shivMethods: u.shivMethods !== !1,
          type: "default",
          shivDocument: l,
          createElement: r,
          createDocumentFragment: o,
        };
        (t.html5 = _), l(e);
      })(this, e),
      (c._version = u),
      (c._prefixes = y),
      (c._domPrefixes = b),
      (c._cssomPrefixes = x),
      (c.testProp = function (t) {
        return a([t]);
      }),
      (c.testAllProps = h),
      (d.className =
        d.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") +
        (p ? " js " + E.join(" ") : "")),
      c
    );
  })(this, this.document)),
  (function (t, e, i) {
    function n(t) {
      return "[object Function]" == f.call(t);
    }
    function s(t) {
      return "string" == typeof t;
    }
    function r() {}
    function o(t) {
      return !t || "loaded" == t || "complete" == t || "uninitialized" == t;
    }
    function a() {
      var t = m.shift();
      (g = 1),
        t
          ? t.t
            ? p(function () {
                ("c" == t.t
                  ? E.injectCss
                  : E.injectJs)(t.s, 0, t.a, t.x, t.e, 1);
              }, 0)
            : (t(), a())
          : (g = 0);
    }
    function l(t, i, n, s, r, l, h) {
      function u(e) {
        if (
          !f &&
          o(c.readyState) &&
          ((w.r = f = 1),
          !g && a(),
          (c.onload = c.onreadystatechange = null),
          e)
        ) {
          "img" != t &&
            p(function () {
              y.removeChild(c);
            }, 50);
          for (var n in S[i]) S[i].hasOwnProperty(n) && S[i][n].onload();
        }
      }
      var h = h || E.errorTimeout,
        c = e.createElement(t),
        f = 0,
        v = 0,
        w = { t: n, s: i, e: r, a: l, x: h };
      1 === S[i] && ((v = 1), (S[i] = [])),
        "object" == t ? (c.data = i) : ((c.src = i), (c.type = t)),
        (c.width = c.height = "0"),
        (c.onerror =
          c.onload =
          c.onreadystatechange =
            function () {
              u.call(this, v);
            }),
        m.splice(s, 0, w),
        "img" != t &&
          (v || 2 === S[i]
            ? (y.insertBefore(c, _ ? null : d), p(u, h))
            : S[i].push(c));
    }
    function h(t, e, i, n, r) {
      return (
        (g = 0),
        (e = e || "j"),
        s(t)
          ? l("c" == e ? x : w, t, e, this.i++, i, n, r)
          : (m.splice(this.i++, 0, t), 1 == m.length && a()),
        this
      );
    }
    function u() {
      var t = E;
      return (t.loader = { load: h, i: 0 }), t;
    }
    var c = e.documentElement,
      p = t.setTimeout,
      d = e.getElementsByTagName("script")[0],
      f = {}.toString,
      m = [],
      g = 0,
      v = "MozAppearance" in c.style,
      _ = v && !!e.createRange().compareNode,
      y = _ ? c : d.parentNode,
      c = t.opera && "[object Opera]" == f.call(t.opera),
      c = !!e.attachEvent && !c,
      w = v ? "object" : c ? "script" : "img",
      x = c ? "script" : w,
      b =
        Array.isArray ||
        function (t) {
          return "[object Array]" == f.call(t);
        },
      T = [],
      S = {},
      C = {
        timeout: function (t, e) {
          return e.length && (t.timeout = e[0]), t;
        },
      },
      P,
      E;
    (E = function (t) {
      function e(t) {
        var t = t.split("!"),
          e = T.length,
          i = t.pop(),
          n = t.length,
          i = { url: i, origUrl: i, prefixes: t },
          s,
          r,
          o;
        for (r = 0; n > r; r++)
          (o = t[r].split("=")), (s = C[o.shift()]) && (i = s(i, o));
        for (r = 0; e > r; r++) i = T[r](i);
        return i;
      }
      function o(t, s, r, o, a) {
        var l = e(t),
          h = l.autoCallback;
        l.url.split(".").pop().split("?").shift(),
          l.bypass ||
            (s &&
              (s = n(s)
                ? s
                : s[t] || s[o] || s[t.split("/").pop().split("?")[0]]),
            l.instead
              ? l.instead(t, s, r, o, a)
              : (S[l.url] ? (l.noexec = !0) : (S[l.url] = 1),
                r.load(
                  l.url,
                  l.forceCSS ||
                    (!l.forceJS &&
                      "css" == l.url.split(".").pop().split("?").shift())
                    ? "c"
                    : i,
                  l.noexec,
                  l.attrs,
                  l.timeout
                ),
                (n(s) || n(h)) &&
                  r.load(function () {
                    u(),
                      s && s(l.origUrl, a, o),
                      h && h(l.origUrl, a, o),
                      (S[l.url] = 2);
                  })));
      }
      function a(t, e) {
        function i(t, i) {
          if (t) {
            if (s(t))
              i ||
                (h = function () {
                  var t = [].slice.call(arguments);
                  u.apply(this, t), c();
                }),
                o(t, h, e, 0, a);
            else if (Object(t) === t)
              for (d in ((p = (function () {
                var e = 0,
                  i;
                for (i in t) t.hasOwnProperty(i) && e++;
                return e;
              })()),
              t))
                t.hasOwnProperty(d) &&
                  (!i &&
                    !--p &&
                    (n(h)
                      ? (h = function () {
                          var t = [].slice.call(arguments);
                          u.apply(this, t), c();
                        })
                      : (h[d] = (function (t) {
                          return function () {
                            var e = [].slice.call(arguments);
                            t && t.apply(this, e), c();
                          };
                        })(u[d]))),
                  o(t[d], h, e, d, a));
          } else !i && c();
        }
        var a = !!t.test,
          l = t.load || t.both,
          h = t.callback || r,
          u = h,
          c = t.complete || r,
          p,
          d;
        i(a ? t.yep : t.nope, !!l), l && i(l);
      }
      var l,
        h,
        c = this.yepnope.loader;
      if (s(t)) o(t, 0, c, 0);
      else if (b(t))
        for (l = 0; l < t.length; l++)
          (h = t[l]),
            s(h) ? o(h, 0, c, 0) : b(h) ? E(h) : Object(h) === h && a(h, c);
      else Object(t) === t && a(t, c);
    }),
      (E.addPrefix = function (t, e) {
        C[t] = e;
      }),
      (E.addFilter = function (t) {
        T.push(t);
      }),
      (E.errorTimeout = 1e4),
      null == e.readyState &&
        e.addEventListener &&
        ((e.readyState = "loading"),
        e.addEventListener(
          "DOMContentLoaded",
          (P = function () {
            e.removeEventListener("DOMContentLoaded", P, 0),
              (e.readyState = "complete");
          }),
          0
        )),
      (t.yepnope = u()),
      (t.yepnope.executeStack = a),
      (t.yepnope.injectJs = function (t, i, n, s, l, h) {
        var u = e.createElement("script"),
          c,
          f,
          s = s || E.errorTimeout;
        u.src = t;
        for (f in n) u.setAttribute(f, n[f]);
        (i = h ? a : i || r),
          (u.onreadystatechange = u.onload =
            function () {
              !c &&
                o(u.readyState) &&
                ((c = 1), i(), (u.onload = u.onreadystatechange = null));
            }),
          p(function () {
            c || ((c = 1), i(1));
          }, s),
          l ? u.onload() : d.parentNode.insertBefore(u, d);
      }),
      (t.yepnope.injectCss = function (t, i, n, s, o, l) {
        var s = e.createElement("link"),
          h,
          i = l ? a : i || r;
        (s.href = t), (s.rel = "stylesheet"), (s.type = "text/css");
        for (h in n) s.setAttribute(h, n[h]);
        o || (d.parentNode.insertBefore(s, d), p(i, 0));
      });
  })(this, document),
  (Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0));
  }),
  function () {
    var t,
      e,
      i,
      n = function (t, e) {
        return function () {
          return t.apply(e, arguments);
        };
      },
      s =
        [].indexOf ||
        function (t) {
          for (var e = 0, i = this.length; i > e; e++)
            if (e in this && this[e] === t) return e;
          return -1;
        };
    (e = (function () {
      function t() {}
      return (
        (t.prototype.extend = function (t, e) {
          var i, n;
          for (i in e) (n = e[i]), null == t[i] && (t[i] = n);
          return t;
        }),
        (t.prototype.isMobile = function (t) {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            t
          );
        }),
        t
      );
    })()),
      (i =
        this.WeakMap ||
        this.MozWeakMap ||
        (i = (function () {
          function t() {
            (this.keys = []), (this.values = []);
          }
          return (
            (t.prototype.get = function (t) {
              var e, i, n, s, r;
              for (r = this.keys, e = n = 0, s = r.length; s > n; e = ++n)
                if (((i = r[e]), i === t)) return this.values[e];
            }),
            (t.prototype.set = function (t, e) {
              var i, n, s, r, o;
              for (o = this.keys, i = s = 0, r = o.length; r > s; i = ++s)
                if (((n = o[i]), n === t)) return void (this.values[i] = e);
              return this.keys.push(t), this.values.push(e);
            }),
            t
          );
        })())),
      (t =
        this.MutationObserver ||
        this.WebkitMutationObserver ||
        this.MozMutationObserver ||
        (t = (function () {
          function t() {
            console.warn("MutationObserver is not supported by your browser."),
              console.warn(
                "WOW.js cannot detect dom mutations, please call .sync() after loading new content."
              );
          }
          return (
            (t.notSupported = !0), (t.prototype.observe = function () {}), t
          );
        })())),
      (this.WOW = (function () {
        function r(t) {
          null == t && (t = {}),
            (this.scrollCallback = n(this.scrollCallback, this)),
            (this.scrollHandler = n(this.scrollHandler, this)),
            (this.start = n(this.start, this)),
            (this.scrolled = !0),
            (this.config = this.util().extend(t, this.defaults)),
            (this.animationNameCache = new i());
        }
        return (
          (r.prototype.defaults = {
            boxClass: "wow",
            animateClass: "animated",
            offset: 0,
            mobile: !0,
            live: !0,
          }),
          (r.prototype.init = function () {
            var t;
            return (
              (this.element = window.document.documentElement),
              "interactive" === (t = document.readyState) || "complete" === t
                ? this.start()
                : document.addEventListener("DOMContentLoaded", this.start),
              (this.finished = [])
            );
          }),
          (r.prototype.start = function () {
            var e, i, n, s;
            if (
              ((this.stopped = !1),
              (this.boxes = function () {
                var t, i, n, s;
                for (
                  n = this.element.getElementsByClassName(this.config.boxClass),
                    s = [],
                    t = 0,
                    i = n.length;
                  i > t;
                  t++
                )
                  (e = n[t]), s.push(e);
                return s;
              }.call(this)),
              (this.all = function () {
                var t, i, n, s;
                for (n = this.boxes, s = [], t = 0, i = n.length; i > t; t++)
                  (e = n[t]), s.push(e);
                return s;
              }.call(this)),
              this.boxes.length)
            )
              if (this.disabled()) this.resetStyle();
              else {
                for (s = this.boxes, i = 0, n = s.length; n > i; i++)
                  (e = s[i]), this.applyStyle(e, !0);
                window.addEventListener("scroll", this.scrollHandler, !1),
                  window.addEventListener("resize", this.scrollHandler, !1),
                  (this.interval = setInterval(this.scrollCallback, 50));
              }
            return this.config.live
              ? new t(
                  (function (t) {
                    return function (e) {
                      var i, n, s, r, o;
                      for (o = [], s = 0, r = e.length; r > s; s++)
                        (n = e[s]),
                          o.push(
                            function () {
                              var t, e, s, r;
                              for (
                                s = n.addedNodes || [],
                                  r = [],
                                  t = 0,
                                  e = s.length;
                                e > t;
                                t++
                              )
                                (i = s[t]), r.push(this.doSync(i));
                              return r;
                            }.call(t)
                          );
                      return o;
                    };
                  })(this)
                ).observe(document.body, { childList: !0, subtree: !0 })
              : void 0;
          }),
          (r.prototype.stop = function () {
            return (
              (this.stopped = !0),
              window.removeEventListener("scroll", this.scrollHandler, !1),
              window.removeEventListener("resize", this.scrollHandler, !1),
              null != this.interval ? clearInterval(this.interval) : void 0
            );
          }),
          (r.prototype.sync = function () {
            return t.notSupported ? this.doSync(this.element) : void 0;
          }),
          (r.prototype.doSync = function (t) {
            var e, i, n, r, o;
            if (!this.stopped) {
              if ((null == t && (t = this.element), 1 !== t.nodeType)) return;
              for (
                t = t.parentNode || t,
                  r = t.getElementsByClassName(this.config.boxClass),
                  o = [],
                  i = 0,
                  n = r.length;
                n > i;
                i++
              )
                (e = r[i]),
                  s.call(this.all, e) < 0
                    ? (this.applyStyle(e, !0),
                      this.boxes.push(e),
                      this.all.push(e),
                      o.push((this.scrolled = !0)))
                    : o.push(void 0);
              return o;
            }
          }),
          (r.prototype.show = function (t) {
            return (
              this.applyStyle(t),
              (t.className = "" + t.className + " " + this.config.animateClass)
            );
          }),
          (r.prototype.applyStyle = function (t, e) {
            var i, n, s;
            return (
              (n = t.getAttribute("data-wow-duration")),
              (i = t.getAttribute("data-wow-delay")),
              (s = t.getAttribute("data-wow-iteration")),
              this.animate(
                (function (r) {
                  return function () {
                    return r.customStyle(t, e, n, i, s);
                  };
                })(this)
              )
            );
          }),
          (r.prototype.animate = (function () {
            return "requestAnimationFrame" in window
              ? function (t) {
                  return window.requestAnimationFrame(t);
                }
              : function (t) {
                  return t();
                };
          })()),
          (r.prototype.resetStyle = function () {
            var t, e, i, n, s;
            for (n = this.boxes, s = [], e = 0, i = n.length; i > e; e++)
              (t = n[e]),
                s.push(t.setAttribute("style", "visibility: visible;"));
            return s;
          }),
          (r.prototype.customStyle = function (t, e, i, n, s) {
            return (
              e && this.cacheAnimationName(t),
              (t.style.visibility = e ? "hidden" : "visible"),
              i && this.vendorSet(t.style, { animationDuration: i }),
              n && this.vendorSet(t.style, { animationDelay: n }),
              s && this.vendorSet(t.style, { animationIterationCount: s }),
              this.vendorSet(t.style, {
                animationName: e ? "none" : this.cachedAnimationName(t),
              }),
              t
            );
          }),
          (r.prototype.vendors = ["moz", "webkit"]),
          (r.prototype.vendorSet = function (t, e) {
            var i, n, s, r;
            r = [];
            for (i in e)
              (n = e[i]),
                (t["" + i] = n),
                r.push(
                  function () {
                    var e, r, o, a;
                    for (
                      o = this.vendors, a = [], e = 0, r = o.length;
                      r > e;
                      e++
                    )
                      (s = o[e]),
                        a.push(
                          (t["" + s + i.charAt(0).toUpperCase() + i.substr(1)] =
                            n)
                        );
                    return a;
                  }.call(this)
                );
            return r;
          }),
          (r.prototype.vendorCSS = function (t, e) {
            var i, n, s, r, o, a;
            for (
              n = window.getComputedStyle(t),
                i = n.getPropertyCSSValue(e),
                a = this.vendors,
                r = 0,
                o = a.length;
              o > r;
              r++
            )
              (s = a[r]), (i = i || n.getPropertyCSSValue("-" + s + "-" + e));
            return i;
          }),
          (r.prototype.animationName = function (t) {
            var e;
            try {
              e = this.vendorCSS(t, "animation-name").cssText;
            } catch (i) {
              e = window.getComputedStyle(t).getPropertyValue("animation-name");
            }
            return "none" === e ? "" : e;
          }),
          (r.prototype.cacheAnimationName = function (t) {
            return this.animationNameCache.set(t, this.animationName(t));
          }),
          (r.prototype.cachedAnimationName = function (t) {
            return this.animationNameCache.get(t);
          }),
          (r.prototype.scrollHandler = function () {
            return (this.scrolled = !0);
          }),
          (r.prototype.scrollCallback = function () {
            var t;
            return !this.scrolled ||
              ((this.scrolled = !1),
              (this.boxes = function () {
                var e, i, n, s;
                for (n = this.boxes, s = [], e = 0, i = n.length; i > e; e++)
                  (t = n[e]),
                    t && (this.isVisible(t) ? this.show(t) : s.push(t));
                return s;
              }.call(this)),
              this.boxes.length || this.config.live)
              ? void 0
              : this.stop();
          }),
          (r.prototype.offsetTop = function (t) {
            for (var e; void 0 === t.offsetTop; ) t = t.parentNode;
            for (e = t.offsetTop; (t = t.offsetParent); ) e += t.offsetTop;
            return e;
          }),
          (r.prototype.isVisible = function (t) {
            var e, i, n, s, r;
            return (
              (i = t.getAttribute("data-wow-offset") || this.config.offset),
              (r = window.pageYOffset),
              (s = r + Math.min(this.element.clientHeight, innerHeight) - i),
              (n = this.offsetTop(t)),
              (e = n + t.clientHeight),
              s >= n && e >= r
            );
          }),
          (r.prototype.util = function () {
            return null != this._util ? this._util : (this._util = new e());
          }),
          (r.prototype.disabled = function () {
            return (
              !this.config.mobile && this.util().isMobile(navigator.userAgent)
            );
          }),
          r
        );
      })());
  }.call(this),
  !(function (t, e, i, n) {
    function s(e, i) {
      (this.settings = null),
        (this.options = t.extend({}, s.Defaults, i)),
        (this.$element = t(e)),
        (this.drag = t.extend({}, p)),
        (this.state = t.extend({}, d)),
        (this.e = t.extend({}, f)),
        (this._plugins = {}),
        (this._supress = {}),
        (this._current = null),
        (this._speed = null),
        (this._coordinates = []),
        (this._breakpoint = null),
        (this._width = null),
        (this._items = []),
        (this._clones = []),
        (this._mergers = []),
        (this._invalidated = {}),
        (this._pipe = []),
        t.each(
          s.Plugins,
          t.proxy(function (t, e) {
            this._plugins[t[0].toLowerCase() + t.slice(1)] = new e(this);
          }, this)
        ),
        t.each(
          s.Pipe,
          t.proxy(function (e, i) {
            this._pipe.push({ filter: i.filter, run: t.proxy(i.run, this) });
          }, this)
        ),
        this.setup(),
        this.initialize();
    }
    function r(t) {
      if (t.touches !== n)
        return { x: t.touches[0].pageX, y: t.touches[0].pageY };
      if (t.touches === n) {
        if (t.pageX !== n) return { x: t.pageX, y: t.pageY };
        if (t.pageX === n) return { x: t.clientX, y: t.clientY };
      }
    }
    function o(t) {
      var e,
        n,
        s = i.createElement("div"),
        r = t;
      for (e in r)
        if (((n = r[e]), "undefined" != typeof s.style[n]))
          return (s = null), [n, e];
      return [!1];
    }
    function a() {
      return o([
        "transition",
        "WebkitTransition",
        "MozTransition",
        "OTransition",
      ])[1];
    }
    function l() {
      return o([
        "transform",
        "WebkitTransform",
        "MozTransform",
        "OTransform",
        "msTransform",
      ])[0];
    }
    function h() {
      return o([
        "perspective",
        "webkitPerspective",
        "MozPerspective",
        "OPerspective",
        "MsPerspective",
      ])[0];
    }
    function u() {
      return "ontouchstart" in e || !!navigator.msMaxTouchPoints;
    }
    function c() {
      return e.navigator.msPointerEnabled;
    }
    var p, d, f;
    (p = {
      start: 0,
      startX: 0,
      startY: 0,
      current: 0,
      currentX: 0,
      currentY: 0,
      offsetX: 0,
      offsetY: 0,
      distance: null,
      startTime: 0,
      endTime: 0,
      updatedX: 0,
      targetEl: null,
    }),
      (d = {
        isTouch: !1,
        isScrolling: !1,
        isSwiping: !1,
        direction: !1,
        inMotion: !1,
      }),
      (f = {
        _onDragStart: null,
        _onDragMove: null,
        _onDragEnd: null,
        _transitionEnd: null,
        _resizer: null,
        _responsiveCall: null,
        _goToLoop: null,
        _checkVisibile: null,
      }),
      (s.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: e,
        responsiveClass: !1,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        themeClass: "owl-theme",
        baseClass: "owl-carousel",
        itemClass: "owl-item",
        centerClass: "center",
        activeClass: "active",
      }),
      (s.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
      (s.Plugins = {}),
      (s.Pipe = [
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            t.current =
              this._items && this._items[this.relative(this._current)];
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            var t = this._clones,
              e = this.$stage.children(".cloned");
            (e.length !== t.length || (!this.settings.loop && t.length > 0)) &&
              (this.$stage.children(".cloned").remove(), (this._clones = []));
          },
        },
        {
          filter: ["items", "settings"],
          run: function () {
            var t,
              e,
              i = this._clones,
              n = this._items,
              s = this.settings.loop
                ? i.length - Math.max(2 * this.settings.items, 4)
                : 0;
            for (t = 0, e = Math.abs(s / 2); e > t; t++)
              s > 0
                ? (this.$stage
                    .children()
                    .eq(n.length + i.length - 1)
                    .remove(),
                  i.pop(),
                  this.$stage.children().eq(0).remove(),
                  i.pop())
                : (i.push(i.length / 2),
                  this.$stage.append(
                    n[i[i.length - 1]].clone().addClass("cloned")
                  ),
                  i.push(n.length - 1 - (i.length - 1) / 2),
                  this.$stage.prepend(
                    n[i[i.length - 1]].clone().addClass("cloned")
                  ));
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            var t,
              e,
              i,
              n = this.settings.rtl ? 1 : -1,
              s = (this.width() / this.settings.items).toFixed(3),
              r = 0;
            for (
              this._coordinates = [],
                e = 0,
                i = this._clones.length + this._items.length;
              i > e;
              e++
            )
              (t = this._mergers[this.relative(e)]),
                (t =
                  (this.settings.mergeFit &&
                    Math.min(t, this.settings.items)) ||
                  t),
                (r +=
                  (this.settings.autoWidth
                    ? this._items[this.relative(e)].width() +
                      this.settings.margin
                    : s * t) * n),
                this._coordinates.push(r);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function () {
            var e,
              i,
              n = (this.width() / this.settings.items).toFixed(3),
              s = {
                width:
                  Math.abs(this._coordinates[this._coordinates.length - 1]) +
                  2 * this.settings.stagePadding,
                "padding-left": this.settings.stagePadding || "",
                "padding-right": this.settings.stagePadding || "",
              };
            if (
              (this.$stage.css(s),
              (s = {
                width: this.settings.autoWidth
                  ? "auto"
                  : n - this.settings.margin,
              }),
              (s[this.settings.rtl ? "margin-left" : "margin-right"] =
                this.settings.margin),
              !this.settings.autoWidth &&
                t.grep(this._mergers, function (t) {
                  return t > 1;
                }).length > 0)
            )
              for (e = 0, i = this._coordinates.length; i > e; e++)
                (s.width =
                  Math.abs(this._coordinates[e]) -
                  Math.abs(this._coordinates[e - 1] || 0) -
                  this.settings.margin),
                  this.$stage.children().eq(e).css(s);
            else this.$stage.children().css(s);
          },
        },
        {
          filter: ["width", "items", "settings"],
          run: function (t) {
            t.current && this.reset(this.$stage.children().index(t.current));
          },
        },
        {
          filter: ["position"],
          run: function () {
            this.animate(this.coordinates(this._current));
          },
        },
        {
          filter: ["width", "position", "items", "settings"],
          run: function () {
            var t,
              e,
              i,
              n,
              s = this.settings.rtl ? 1 : -1,
              r = 2 * this.settings.stagePadding,
              o = this.coordinates(this.current()) + r,
              a = o + this.width() * s,
              l = [];
            for (i = 0, n = this._coordinates.length; n > i; i++)
              (t = this._coordinates[i - 1] || 0),
                (e = Math.abs(this._coordinates[i]) + r * s),
                ((this.op(t, "<=", o) && this.op(t, ">", a)) ||
                  (this.op(e, "<", o) && this.op(e, ">", a))) &&
                  l.push(i);
            this.$stage
              .children("." + this.settings.activeClass)
              .removeClass(this.settings.activeClass),
              this.$stage
                .children(":eq(" + l.join("), :eq(") + ")")
                .addClass(this.settings.activeClass),
              this.settings.center &&
                (this.$stage
                  .children("." + this.settings.centerClass)
                  .removeClass(this.settings.centerClass),
                this.$stage
                  .children()
                  .eq(this.current())
                  .addClass(this.settings.centerClass));
          },
        },
      ]),
      (s.prototype.initialize = function () {
        if (
          (this.trigger("initialize"),
          this.$element
            .addClass(this.settings.baseClass)
            .addClass(this.settings.themeClass)
            .toggleClass("owl-rtl", this.settings.rtl),
          this.browserSupport(),
          this.settings.autoWidth && this.state.imagesLoaded !== !0)
        ) {
          var e, i, s;
          if (
            ((e = this.$element.find("img")),
            (i = this.settings.nestedItemSelector
              ? "." + this.settings.nestedItemSelector
              : n),
            (s = this.$element.children(i).width()),
            e.length && 0 >= s)
          )
            return this.preloadAutoWidthImages(e), !1;
        }
        this.$element.addClass("owl-loading"),
          (this.$stage = t(
            "<" + this.settings.stageElement + ' class="owl-stage"/>'
          ).wrap('<div class="owl-stage-outer">')),
          this.$element.append(this.$stage.parent()),
          this.replace(this.$element.children().not(this.$stage.parent())),
          (this._width = this.$element.width()),
          this.refresh(),
          this.$element.removeClass("owl-loading").addClass("owl-loaded"),
          this.eventsCall(),
          this.internalEvents(),
          this.addTriggerableEvents(),
          this.trigger("initialized");
      }),
      (s.prototype.setup = function () {
        var e = this.viewport(),
          i = this.options.responsive,
          n = -1,
          s = null;
        i
          ? (t.each(i, function (t) {
              e >= t && t > n && (n = Number(t));
            }),
            (s = t.extend({}, this.options, i[n])),
            delete s.responsive,
            s.responsiveClass &&
              this.$element
                .attr("class", function (t, e) {
                  return e.replace(/\b owl-responsive-\S+/g, "");
                })
                .addClass("owl-responsive-" + n))
          : (s = t.extend({}, this.options)),
          (null === this.settings || this._breakpoint !== n) &&
            (this.trigger("change", {
              property: { name: "settings", value: s },
            }),
            (this._breakpoint = n),
            (this.settings = s),
            this.invalidate("settings"),
            this.trigger("changed", {
              property: { name: "settings", value: this.settings },
            }));
      }),
      (s.prototype.optionsLogic = function () {
        this.$element.toggleClass("owl-center", this.settings.center),
          this.settings.loop &&
            this._items.length < this.settings.items &&
            (this.settings.loop = !1),
          this.settings.autoWidth &&
            ((this.settings.stagePadding = !1), (this.settings.merge = !1));
      }),
      (s.prototype.prepare = function (e) {
        var i = this.trigger("prepare", { content: e });
        return (
          i.data ||
            (i.data = t("<" + this.settings.itemElement + "/>")
              .addClass(this.settings.itemClass)
              .append(e)),
          this.trigger("prepared", { content: i.data }),
          i.data
        );
      }),
      (s.prototype.update = function () {
        for (
          var e = 0,
            i = this._pipe.length,
            n = t.proxy(function (t) {
              return this[t];
            }, this._invalidated),
            s = {};
          i > e;

        )
          (this._invalidated.all ||
            t.grep(this._pipe[e].filter, n).length > 0) &&
            this._pipe[e].run(s),
            e++;
        this._invalidated = {};
      }),
      (s.prototype.width = function (t) {
        switch ((t = t || s.Width.Default)) {
          case s.Width.Inner:
          case s.Width.Outer:
            return this._width;
          default:
            return (
              this._width -
              2 * this.settings.stagePadding +
              this.settings.margin
            );
        }
      }),
      (s.prototype.refresh = function () {
        return 0 === this._items.length
          ? !1
          : (new Date().getTime(),
            this.trigger("refresh"),
            this.setup(),
            this.optionsLogic(),
            this.$stage.addClass("owl-refresh"),
            this.update(),
            this.$stage.removeClass("owl-refresh"),
            (this.state.orientation = e.orientation),
            this.watchVisibility(),
            this.trigger("refreshed"),
            void 0);
      }),
      (s.prototype.eventsCall = function () {
        (this.e._onDragStart = t.proxy(function (t) {
          this.onDragStart(t);
        }, this)),
          (this.e._onDragMove = t.proxy(function (t) {
            this.onDragMove(t);
          }, this)),
          (this.e._onDragEnd = t.proxy(function (t) {
            this.onDragEnd(t);
          }, this)),
          (this.e._onResize = t.proxy(function (t) {
            this.onResize(t);
          }, this)),
          (this.e._transitionEnd = t.proxy(function (t) {
            this.transitionEnd(t);
          }, this)),
          (this.e._preventClick = t.proxy(function (t) {
            this.preventClick(t);
          }, this));
      }),
      (s.prototype.onThrottledResize = function () {
        e.clearTimeout(this.resizeTimer),
          (this.resizeTimer = e.setTimeout(
            this.e._onResize,
            this.settings.responsiveRefreshRate
          ));
      }),
      (s.prototype.onResize = function () {
        return this._items.length
          ? this._width === this.$element.width()
            ? !1
            : this.trigger("resize").isDefaultPrevented()
            ? !1
            : ((this._width = this.$element.width()),
              this.invalidate("width"),
              this.refresh(),
              void this.trigger("resized"))
          : !1;
      }),
      (s.prototype.eventsRouter = function (t) {
        var e = t.type;
        "mousedown" === e || "touchstart" === e
          ? this.onDragStart(t)
          : "mousemove" === e || "touchmove" === e
          ? this.onDragMove(t)
          : "mouseup" === e || "touchend" === e
          ? this.onDragEnd(t)
          : "touchcancel" === e && this.onDragEnd(t);
      }),
      (s.prototype.internalEvents = function () {
        var i = (u(), c());
        this.settings.mouseDrag
          ? (this.$stage.on(
              "mousedown",
              t.proxy(function (t) {
                this.eventsRouter(t);
              }, this)
            ),
            this.$stage.on("dragstart", function () {
              return !1;
            }),
            (this.$stage.get(0).onselectstart = function () {
              return !1;
            }))
          : this.$element.addClass("owl-text-select-on"),
          this.settings.touchDrag &&
            !i &&
            this.$stage.on(
              "touchstart touchcancel",
              t.proxy(function (t) {
                this.eventsRouter(t);
              }, this)
            ),
          this.transitionEndVendor &&
            this.on(
              this.$stage.get(0),
              this.transitionEndVendor,
              this.e._transitionEnd,
              !1
            ),
          this.settings.responsive !== !1 &&
            this.on(e, "resize", t.proxy(this.onThrottledResize, this));
      }),
      (s.prototype.onDragStart = function (n) {
        var s, o, a, l;
        if (
          ((s = n.originalEvent || n || e.event),
          3 === s.which || this.state.isTouch)
        )
          return !1;
        if (
          ("mousedown" === s.type && this.$stage.addClass("owl-grab"),
          this.trigger("drag"),
          (this.drag.startTime = new Date().getTime()),
          this.speed(0),
          (this.state.isTouch = !0),
          (this.state.isScrolling = !1),
          (this.state.isSwiping = !1),
          (this.drag.distance = 0),
          (o = r(s).x),
          (a = r(s).y),
          (this.drag.offsetX = this.$stage.position().left),
          (this.drag.offsetY = this.$stage.position().top),
          this.settings.rtl &&
            (this.drag.offsetX =
              this.$stage.position().left +
              this.$stage.width() -
              this.width() +
              this.settings.margin),
          this.state.inMotion && this.support3d)
        )
          (l = this.getTransformProperty()),
            (this.drag.offsetX = l),
            this.animate(l),
            (this.state.inMotion = !0);
        else if (this.state.inMotion && !this.support3d)
          return (this.state.inMotion = !1), !1;
        (this.drag.startX = o - this.drag.offsetX),
          (this.drag.startY = a - this.drag.offsetY),
          (this.drag.start = o - this.drag.startX),
          (this.drag.targetEl = s.target || s.srcElement),
          (this.drag.updatedX = this.drag.start),
          ("IMG" === this.drag.targetEl.tagName ||
            "A" === this.drag.targetEl.tagName) &&
            (this.drag.targetEl.draggable = !1),
          t(i).on(
            "mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents",
            t.proxy(function (t) {
              this.eventsRouter(t);
            }, this)
          );
      }),
      (s.prototype.onDragMove = function (t) {
        var i, s, o, a, l, h;
        this.state.isTouch &&
          (this.state.isScrolling ||
            ((i = t.originalEvent || t || e.event),
            (s = r(i).x),
            (o = r(i).y),
            (this.drag.currentX = s - this.drag.startX),
            (this.drag.currentY = o - this.drag.startY),
            (this.drag.distance = this.drag.currentX - this.drag.offsetX),
            this.drag.distance < 0
              ? (this.state.direction = this.settings.rtl ? "right" : "left")
              : this.drag.distance > 0 &&
                (this.state.direction = this.settings.rtl ? "left" : "right"),
            this.settings.loop
              ? this.op(
                  this.drag.currentX,
                  ">",
                  this.coordinates(this.minimum())
                ) && "right" === this.state.direction
                ? (this.drag.currentX -=
                    (this.settings.center && this.coordinates(0)) -
                    this.coordinates(this._items.length))
                : this.op(
                    this.drag.currentX,
                    "<",
                    this.coordinates(this.maximum())
                  ) &&
                  "left" === this.state.direction &&
                  (this.drag.currentX +=
                    (this.settings.center && this.coordinates(0)) -
                    this.coordinates(this._items.length))
              : ((a = this.coordinates(
                  this.settings.rtl ? this.maximum() : this.minimum()
                )),
                (l = this.coordinates(
                  this.settings.rtl ? this.minimum() : this.maximum()
                )),
                (h = this.settings.pullDrag ? this.drag.distance / 5 : 0),
                (this.drag.currentX = Math.max(
                  Math.min(this.drag.currentX, a + h),
                  l + h
                ))),
            (this.drag.distance > 8 || this.drag.distance < -8) &&
              (i.preventDefault !== n
                ? i.preventDefault()
                : (i.returnValue = !1),
              (this.state.isSwiping = !0)),
            (this.drag.updatedX = this.drag.currentX),
            (this.drag.currentY > 16 || this.drag.currentY < -16) &&
              this.state.isSwiping === !1 &&
              ((this.state.isScrolling = !0),
              (this.drag.updatedX = this.drag.start)),
            this.animate(this.drag.updatedX)));
      }),
      (s.prototype.onDragEnd = function (e) {
        var n, s, r;
        if (this.state.isTouch) {
          if (
            ("mouseup" === e.type && this.$stage.removeClass("owl-grab"),
            this.trigger("dragged"),
            this.drag.targetEl.removeAttribute("draggable"),
            (this.state.isTouch = !1),
            (this.state.isScrolling = !1),
            (this.state.isSwiping = !1),
            0 === this.drag.distance && this.state.inMotion !== !0)
          )
            return (this.state.inMotion = !1), !1;
          (this.drag.endTime = new Date().getTime()),
            (n = this.drag.endTime - this.drag.startTime),
            (s = Math.abs(this.drag.distance)),
            (s > 3 || n > 300) && this.removeClick(this.drag.targetEl),
            (r = this.closest(this.drag.updatedX)),
            this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
            this.current(r),
            this.invalidate("position"),
            this.update(),
            this.settings.pullDrag ||
              this.drag.updatedX !== this.coordinates(r) ||
              this.transitionEnd(),
            (this.drag.distance = 0),
            t(i).off(".owl.dragEvents");
        }
      }),
      (s.prototype.removeClick = function (i) {
        (this.drag.targetEl = i),
          t(i).on("click.preventClick", this.e._preventClick),
          e.setTimeout(function () {
            t(i).off("click.preventClick");
          }, 300);
      }),
      (s.prototype.preventClick = function (e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
          e.stopPropagation && e.stopPropagation(),
          t(e.target).off("click.preventClick");
      }),
      (s.prototype.getTransformProperty = function () {
        var t, i;
        return (
          (t = e
            .getComputedStyle(this.$stage.get(0), null)
            .getPropertyValue(this.vendorName + "transform")),
          (t = t.replace(/matrix(3d)?\(|\)/g, "").split(",")),
          (i = 16 === t.length),
          i !== !0 ? t[4] : t[12]
        );
      }),
      (s.prototype.closest = function (e) {
        var i = -1,
          n = 30,
          s = this.width(),
          r = this.coordinates();
        return (
          this.settings.freeDrag ||
            t.each(
              r,
              t.proxy(function (t, o) {
                return (
                  e > o - n && o + n > e
                    ? (i = t)
                    : this.op(e, "<", o) &&
                      this.op(e, ">", r[t + 1] || o - s) &&
                      (i = "left" === this.state.direction ? t + 1 : t),
                  -1 === i
                );
              }, this)
            ),
          this.settings.loop ||
            (this.op(e, ">", r[this.minimum()])
              ? (i = e = this.minimum())
              : this.op(e, "<", r[this.maximum()]) && (i = e = this.maximum())),
          i
        );
      }),
      (s.prototype.animate = function (e) {
        this.trigger("translate"),
          (this.state.inMotion = this.speed() > 0),
          this.support3d
            ? this.$stage.css({
                transform: "translate3d(" + e + "px,0px, 0px)",
                transition: this.speed() / 1e3 + "s",
              })
            : this.state.isTouch
            ? this.$stage.css({ left: e + "px" })
            : this.$stage.animate(
                { left: e },
                this.speed() / 1e3,
                this.settings.fallbackEasing,
                t.proxy(function () {
                  this.state.inMotion && this.transitionEnd();
                }, this)
              );
      }),
      (s.prototype.current = function (t) {
        if (t === n) return this._current;
        if (0 === this._items.length) return n;
        if (((t = this.normalize(t)), this._current !== t)) {
          var e = this.trigger("change", {
            property: { name: "position", value: t },
          });
          e.data !== n && (t = this.normalize(e.data)),
            (this._current = t),
            this.invalidate("position"),
            this.trigger("changed", {
              property: { name: "position", value: this._current },
            });
        }
        return this._current;
      }),
      (s.prototype.invalidate = function (t) {
        this._invalidated[t] = !0;
      }),
      (s.prototype.reset = function (t) {
        (t = this.normalize(t)),
          t !== n &&
            ((this._speed = 0),
            (this._current = t),
            this.suppress(["translate", "translated"]),
            this.animate(this.coordinates(t)),
            this.release(["translate", "translated"]));
      }),
      (s.prototype.normalize = function (e, i) {
        var s = i
          ? this._items.length
          : this._items.length + this._clones.length;
        return !t.isNumeric(e) || 1 > s
          ? n
          : (e = this._clones.length
              ? ((e % s) + s) % s
              : Math.max(this.minimum(i), Math.min(this.maximum(i), e)));
      }),
      (s.prototype.relative = function (t) {
        return (
          (t = this.normalize(t)),
          (t -= this._clones.length / 2),
          this.normalize(t, !0)
        );
      }),
      (s.prototype.maximum = function (t) {
        var e,
          i,
          n,
          s = 0,
          r = this.settings;
        if (t) return this._items.length - 1;
        if (!r.loop && r.center) e = this._items.length - 1;
        else if (r.loop || r.center)
          if (r.loop || r.center) e = this._items.length + r.items;
          else {
            if (!r.autoWidth && !r.merge)
              throw "Can not detect maximum absolute position.";
            for (
              revert = r.rtl ? 1 : -1,
                i = this.$stage.width() - this.$element.width();
              (n = this.coordinates(s)) && !(n * revert >= i);

            )
              e = ++s;
          }
        else e = this._items.length - r.items;
        return e;
      }),
      (s.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2;
      }),
      (s.prototype.items = function (t) {
        return t === n
          ? this._items.slice()
          : ((t = this.normalize(t, !0)), this._items[t]);
      }),
      (s.prototype.mergers = function (t) {
        return t === n
          ? this._mergers.slice()
          : ((t = this.normalize(t, !0)), this._mergers[t]);
      }),
      (s.prototype.clones = function (e) {
        var i = this._clones.length / 2,
          s = i + this._items.length,
          r = function (t) {
            return t % 2 === 0 ? s + t / 2 : i - (t + 1) / 2;
          };
        return e === n
          ? t.map(this._clones, function (t, e) {
              return r(e);
            })
          : t.map(this._clones, function (t, i) {
              return t === e ? r(i) : null;
            });
      }),
      (s.prototype.speed = function (t) {
        return t !== n && (this._speed = t), this._speed;
      }),
      (s.prototype.coordinates = function (e) {
        var i = null;
        return e === n
          ? t.map(
              this._coordinates,
              t.proxy(function (t, e) {
                return this.coordinates(e);
              }, this)
            )
          : (this.settings.center
              ? ((i = this._coordinates[e]),
                (i +=
                  ((this.width() - i + (this._coordinates[e - 1] || 0)) / 2) *
                  (this.settings.rtl ? -1 : 1)))
              : (i = this._coordinates[e - 1] || 0),
            i);
      }),
      (s.prototype.duration = function (t, e, i) {
        return (
          Math.min(Math.max(Math.abs(e - t), 1), 6) *
          Math.abs(i || this.settings.smartSpeed)
        );
      }),
      (s.prototype.to = function (i, n) {
        if (this.settings.loop) {
          var s = i - this.relative(this.current()),
            r = this.current(),
            o = this.current(),
            a = this.current() + s,
            l = 0 > o - a ? !0 : !1,
            h = this._clones.length + this._items.length;
          a < this.settings.items && l === !1
            ? ((r = o + this._items.length), this.reset(r))
            : a >= h - this.settings.items &&
              l === !0 &&
              ((r = o - this._items.length), this.reset(r)),
            e.clearTimeout(this.e._goToLoop),
            (this.e._goToLoop = e.setTimeout(
              t.proxy(function () {
                this.speed(this.duration(this.current(), r + s, n)),
                  this.current(r + s),
                  this.update();
              }, this),
              30
            ));
        } else
          this.speed(this.duration(this.current(), i, n)),
            this.current(i),
            this.update();
      }),
      (s.prototype.next = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) + 1, t);
      }),
      (s.prototype.prev = function (t) {
        (t = t || !1), this.to(this.relative(this.current()) - 1, t);
      }),
      (s.prototype.transitionEnd = function (t) {
        return t !== n &&
          (t.stopPropagation(),
          (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))
          ? !1
          : ((this.state.inMotion = !1), void this.trigger("translated"));
      }),
      (s.prototype.viewport = function () {
        var n;
        if (this.options.responsiveBaseElement !== e)
          n = t(this.options.responsiveBaseElement).width();
        else if (e.innerWidth) n = e.innerWidth;
        else {
          if (!i.documentElement || !i.documentElement.clientWidth)
            throw "Can not detect viewport width.";
          n = i.documentElement.clientWidth;
        }
        return n;
      }),
      (s.prototype.replace = function (e) {
        this.$stage.empty(),
          (this._items = []),
          e && (e = e instanceof jQuery ? e : t(e)),
          this.settings.nestedItemSelector &&
            (e = e.find("." + this.settings.nestedItemSelector)),
          e
            .filter(function () {
              return 1 === this.nodeType;
            })
            .each(
              t.proxy(function (t, e) {
                (e = this.prepare(e)),
                  this.$stage.append(e),
                  this._items.push(e),
                  this._mergers.push(
                    1 *
                      e
                        .find("[data-merge]")
                        .andSelf("[data-merge]")
                        .attr("data-merge") || 1
                  );
              }, this)
            ),
          this.reset(
            t.isNumeric(this.settings.startPosition)
              ? this.settings.startPosition
              : 0
          ),
          this.invalidate("items");
      }),
      (s.prototype.add = function (t, e) {
        (e = e === n ? this._items.length : this.normalize(e, !0)),
          this.trigger("add", { content: t, position: e }),
          0 === this._items.length || e === this._items.length
            ? (this.$stage.append(t),
              this._items.push(t),
              this._mergers.push(
                1 *
                  t
                    .find("[data-merge]")
                    .andSelf("[data-merge]")
                    .attr("data-merge") || 1
              ))
            : (this._items[e].before(t),
              this._items.splice(e, 0, t),
              this._mergers.splice(
                e,
                0,
                1 *
                  t
                    .find("[data-merge]")
                    .andSelf("[data-merge]")
                    .attr("data-merge") || 1
              )),
          this.invalidate("items"),
          this.trigger("added", { content: t, position: e });
      }),
      (s.prototype.remove = function (t) {
        (t = this.normalize(t, !0)),
          t !== n &&
            (this.trigger("remove", { content: this._items[t], position: t }),
            this._items[t].remove(),
            this._items.splice(t, 1),
            this._mergers.splice(t, 1),
            this.invalidate("items"),
            this.trigger("removed", { content: null, position: t }));
      }),
      (s.prototype.addTriggerableEvents = function () {
        var e = t.proxy(function (e, i) {
          return t.proxy(function (t) {
            t.relatedTarget !== this &&
              (this.suppress([i]),
              e.apply(this, [].slice.call(arguments, 1)),
              this.release([i]));
          }, this);
        }, this);
        t.each(
          {
            next: this.next,
            prev: this.prev,
            to: this.to,
            destroy: this.destroy,
            refresh: this.refresh,
            replace: this.replace,
            add: this.add,
            remove: this.remove,
          },
          t.proxy(function (t, i) {
            this.$element.on(t + ".owl.carousel", e(i, t + ".owl.carousel"));
          }, this)
        );
      }),
      (s.prototype.watchVisibility = function () {
        function i(t) {
          return t.offsetWidth > 0 && t.offsetHeight > 0;
        }
        function n() {
          i(this.$element.get(0)) &&
            (this.$element.removeClass("owl-hidden"),
            this.refresh(),
            e.clearInterval(this.e._checkVisibile));
        }
        i(this.$element.get(0)) ||
          (this.$element.addClass("owl-hidden"),
          e.clearInterval(this.e._checkVisibile),
          (this.e._checkVisibile = e.setInterval(t.proxy(n, this), 500)));
      }),
      (s.prototype.preloadAutoWidthImages = function (e) {
        var i, n, s, r;
        (i = 0),
          (n = this),
          e.each(function (o, a) {
            (s = t(a)),
              (r = new Image()),
              (r.onload = function () {
                i++,
                  s.attr("src", r.src),
                  s.css("opacity", 1),
                  i >= e.length &&
                    ((n.state.imagesLoaded = !0), n.initialize());
              }),
              (r.src =
                s.attr("src") ||
                s.attr("data-src") ||
                s.attr("data-src-retina"));
          });
      }),
      (s.prototype.destroy = function () {
        this.$element.hasClass(this.settings.themeClass) &&
          this.$element.removeClass(this.settings.themeClass),
          this.settings.responsive !== !1 && t(e).off("resize.owl.carousel"),
          this.transitionEndVendor &&
            this.off(
              this.$stage.get(0),
              this.transitionEndVendor,
              this.e._transitionEnd
            );
        for (var n in this._plugins) this._plugins[n].destroy();
        (this.settings.mouseDrag || this.settings.touchDrag) &&
          (this.$stage.off("mousedown touchstart touchcancel"),
          t(i).off(".owl.dragEvents"),
          (this.$stage.get(0).onselectstart = function () {}),
          this.$stage.off("dragstart", function () {
            return !1;
          })),
          this.$element.off(".owl"),
          this.$stage.children(".cloned").remove(),
          (this.e = null),
          this.$element.removeData("owlCarousel"),
          this.$stage.children().contents().unwrap(),
          this.$stage.children().unwrap(),
          this.$stage.unwrap();
      }),
      (s.prototype.op = function (t, e, i) {
        var n = this.settings.rtl;
        switch (e) {
          case "<":
            return n ? t > i : i > t;
          case ">":
            return n ? i > t : t > i;
          case ">=":
            return n ? i >= t : t >= i;
          case "<=":
            return n ? t >= i : i >= t;
        }
      }),
      (s.prototype.on = function (t, e, i, n) {
        t.addEventListener
          ? t.addEventListener(e, i, n)
          : t.attachEvent && t.attachEvent("on" + e, i);
      }),
      (s.prototype.off = function (t, e, i, n) {
        t.removeEventListener
          ? t.removeEventListener(e, i, n)
          : t.detachEvent && t.detachEvent("on" + e, i);
      }),
      (s.prototype.trigger = function (e, i, n) {
        var s = { item: { count: this._items.length, index: this.current() } },
          r = t.camelCase(
            t
              .grep(["on", e, n], function (t) {
                return t;
              })
              .join("-")
              .toLowerCase()
          ),
          o = t.Event(
            [e, "owl", n || "carousel"].join(".").toLowerCase(),
            t.extend({ relatedTarget: this }, s, i)
          );
        return (
          this._supress[e] ||
            (t.each(this._plugins, function (t, e) {
              e.onTrigger && e.onTrigger(o);
            }),
            this.$element.trigger(o),
            this.settings &&
              "function" == typeof this.settings[r] &&
              this.settings[r].apply(this, o)),
          o
        );
      }),
      (s.prototype.suppress = function (e) {
        t.each(
          e,
          t.proxy(function (t, e) {
            this._supress[e] = !0;
          }, this)
        );
      }),
      (s.prototype.release = function (e) {
        t.each(
          e,
          t.proxy(function (t, e) {
            delete this._supress[e];
          }, this)
        );
      }),
      (s.prototype.browserSupport = function () {
        if (((this.support3d = h()), this.support3d)) {
          this.transformVendor = l();
          var t = [
            "transitionend",
            "webkitTransitionEnd",
            "transitionend",
            "oTransitionEnd",
          ];
          (this.transitionEndVendor = t[a()]),
            (this.vendorName = this.transformVendor.replace(/Transform/i, "")),
            (this.vendorName =
              "" !== this.vendorName
                ? "-" + this.vendorName.toLowerCase() + "-"
                : "");
        }
        this.state.orientation = e.orientation;
      }),
      (t.fn.owlCarousel = function (e) {
        return this.each(function () {
          t(this).data("owlCarousel") ||
            t(this).data("owlCarousel", new s(this, e));
        });
      }),
      (t.fn.owlCarousel.Constructor = s);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e) {
    var i = function (e) {
      (this._core = e),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel": t.proxy(function (e) {
            if (
              e.namespace &&
              this._core.settings &&
              this._core.settings.lazyLoad &&
              ((e.property && "position" == e.property.name) ||
                "initialized" == e.type)
            )
              for (
                var i = this._core.settings,
                  n = (i.center && Math.ceil(i.items / 2)) || i.items,
                  s = (i.center && -1 * n) || 0,
                  r =
                    ((e.property && e.property.value) || this._core.current()) +
                    s,
                  o = this._core.clones().length,
                  a = t.proxy(function (t, e) {
                    this.load(e);
                  }, this);
                s++ < n;

              )
                this.load(o / 2 + this._core.relative(r)),
                  o && t.each(this._core.clones(this._core.relative(r++)), a);
          }, this),
        }),
        (this._core.options = t.extend({}, i.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (i.Defaults = { lazyLoad: !1 }),
      (i.prototype.load = function (i) {
        var n = this._core.$stage.children().eq(i),
          s = n && n.find(".owl-lazy");
        !s ||
          t.inArray(n.get(0), this._loaded) > -1 ||
          (s.each(
            t.proxy(function (i, n) {
              var s,
                r = t(n),
                o =
                  (e.devicePixelRatio > 1 && r.attr("data-src-retina")) ||
                  r.attr("data-src");
              this._core.trigger("load", { element: r, url: o }, "lazy"),
                r.is("img")
                  ? r
                      .one(
                        "load.owl.lazy",
                        t.proxy(function () {
                          r.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: r, url: o },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", o)
                  : ((s = new Image()),
                    (s.onload = t.proxy(function () {
                      r.css({
                        "background-image": "url(" + o + ")",
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: r, url: o },
                          "lazy"
                        );
                    }, this)),
                    (s.src = o));
            }, this)
          ),
          this._loaded.push(n.get(0)));
      }),
      (i.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Lazy = i);
  })(window.Zepto || window.jQuery, window, document),
  (function (t) {
    var e = function (i) {
      (this._core = i),
        (this._handlers = {
          "initialized.owl.carousel": t.proxy(function () {
            this._core.settings.autoHeight && this.update();
          }, this),
          "changed.owl.carousel": t.proxy(function (t) {
            this._core.settings.autoHeight &&
              "position" == t.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": t.proxy(function (t) {
            this._core.settings.autoHeight &&
              t.element.closest("." + this._core.settings.itemClass) ===
                this._core.$stage.children().eq(this._core.current()) &&
              this.update();
          }, this),
        }),
        (this._core.options = t.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        this._core.$stage
          .parent()
          .height(
            this._core.$stage.children().eq(this._core.current()).height()
          )
          .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i) {
    var n = function (e) {
      (this._core = e),
        (this._videos = {}),
        (this._playing = null),
        (this._fullscreen = !1),
        (this._handlers = {
          "resize.owl.carousel": t.proxy(function (t) {
            this._core.settings.video &&
              !this.isInFullScreen() &&
              t.preventDefault();
          }, this),
          "refresh.owl.carousel changed.owl.carousel": t.proxy(function () {
            this._playing && this.stop();
          }, this),
          "prepared.owl.carousel": t.proxy(function (e) {
            var i = t(e.content).find(".owl-video");
            i.length && (i.css("display", "none"), this.fetch(i, t(e.content)));
          }, this),
        }),
        (this._core.options = t.extend({}, n.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          t.proxy(function (t) {
            this.play(t);
          }, this)
        );
    };
    (n.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (n.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id") ? "vimeo" : "youtube",
          n = t.attr("data-vimeo-id") || t.attr("data-youtube-id"),
          s = t.attr("data-width") || this._core.settings.videoWidth,
          r = t.attr("data-height") || this._core.settings.videoHeight,
          o = t.attr("href");
        if (!o) throw new Error("Missing video URL.");
        if (
          ((n = o.match(
            /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          n[3].indexOf("youtu") > -1)
        )
          i = "youtube";
        else {
          if (!(n[3].indexOf("vimeo") > -1))
            throw new Error("Video URL not supported.");
          i = "vimeo";
        }
        (n = n[6]),
          (this._videos[o] = { type: i, id: n, width: s, height: r }),
          e.attr("data-video", o),
          this.thumbnail(t, this._videos[o]);
      }),
      (n.prototype.thumbnail = function (e, i) {
        var n,
          s,
          r,
          o =
            i.width && i.height
              ? 'style="width:' + i.width + "px;height:" + i.height + 'px;"'
              : "",
          a = e.find("img"),
          l = "src",
          h = "",
          u = this._core.settings,
          c = function (t) {
            (s = '<div class="owl-video-play-icon"></div>'),
              (n = u.lazyLoad
                ? '<div class="owl-video-tn ' +
                  h +
                  '" ' +
                  l +
                  '="' +
                  t +
                  '"></div>'
                : '<div class="owl-video-tn" style="opacity:1;background-image:url(' +
                  t +
                  ')"></div>'),
              e.after(n),
              e.after(s);
          };
        return (
          e.wrap('<div class="owl-video-wrapper"' + o + "></div>"),
          this._core.settings.lazyLoad && ((l = "data-src"), (h = "owl-lazy")),
          a.length
            ? (c(a.attr(l)), a.remove(), !1)
            : void ("youtube" === i.type
                ? ((r = "http://img.youtube.com/vi/" + i.id + "/hqdefault.jpg"),
                  c(r))
                : "vimeo" === i.type &&
                  t.ajax({
                    type: "GET",
                    url: "http://vimeo.com/api/v2/video/" + i.id + ".json",
                    jsonp: "callback",
                    dataType: "jsonp",
                    success: function (t) {
                      (r = t[0].thumbnail_large), c(r);
                    },
                  }))
        );
      }),
      (n.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null);
      }),
      (n.prototype.play = function (e) {
        this._core.trigger("play", null, "video"), this._playing && this.stop();
        var i,
          n,
          s = t(e.target || e.srcElement),
          r = s.closest("." + this._core.settings.itemClass),
          o = this._videos[r.attr("data-video")],
          a = o.width || "100%",
          l = o.height || this._core.$stage.height();
        "youtube" === o.type
          ? (i =
              '<iframe width="' +
              a +
              '" height="' +
              l +
              '" src="http://www.youtube.com/embed/' +
              o.id +
              "?autoplay=1&v=" +
              o.id +
              '" frameborder="0" allowfullscreen></iframe>')
          : "vimeo" === o.type &&
            (i =
              '<iframe src="http://player.vimeo.com/video/' +
              o.id +
              '?autoplay=1" width="' +
              a +
              '" height="' +
              l +
              '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'),
          r.addClass("owl-video-playing"),
          (this._playing = r),
          (n = t(
            '<div style="height:' +
              l +
              "px; width:" +
              a +
              'px" class="owl-video-frame">' +
              i +
              "</div>"
          )),
          s.after(n);
      }),
      (n.prototype.isInFullScreen = function () {
        var n =
          i.fullscreenElement ||
          i.mozFullScreenElement ||
          i.webkitFullscreenElement;
        return (
          n &&
            t(n).parent().hasClass("owl-video-frame") &&
            (this._core.speed(0), (this._fullscreen = !0)),
          n && this._fullscreen && this._playing
            ? !1
            : this._fullscreen
            ? ((this._fullscreen = !1), !1)
            : this._playing && this._core.state.orientation !== e.orientation
            ? ((this._core.state.orientation = e.orientation), !1)
            : !0
        );
      }),
      (n.prototype.destroy = function () {
        var t, e;
        this._core.$element.off("click.owl.video");
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Video = n);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i, n) {
    var s = function (e) {
      (this.core = e),
        (this.core.options = t.extend({}, s.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = n),
        (this.next = n),
        (this.handlers = {
          "change.owl.carousel": t.proxy(function (t) {
            "position" == t.property.name &&
              ((this.previous = this.core.current()),
              (this.next = t.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            t.proxy(function (t) {
              this.swapping = "translated" == t.type;
            }, this),
          "translate.owl.carousel": t.proxy(function () {
            this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (s.Defaults = { animateOut: !1, animateIn: !1 }),
      (s.prototype.swap = function () {
        if (1 === this.core.settings.items && this.core.support3d) {
          this.core.speed(0);
          var e,
            i = t.proxy(this.clear, this),
            n = this.core.$stage.children().eq(this.previous),
            s = this.core.$stage.children().eq(this.next),
            r = this.core.settings.animateIn,
            o = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (o &&
              ((e =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              n
                .css({ left: e + "px" })
                .addClass("animated owl-animated-out")
                .addClass(o)
                .one(
                  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                  i
                )),
            r &&
              s
                .addClass("animated owl-animated-in")
                .addClass(r)
                .one(
                  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                  i
                ));
        }
      }),
      (s.prototype.clear = function (e) {
        t(e.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.transitionEnd();
      }),
      (s.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this))
          "function" != typeof this[e] && (this[e] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Animate = s);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e, i) {
    var n = function (e) {
      (this.core = e),
        (this.core.options = t.extend({}, n.Defaults, this.core.options)),
        (this.handlers = {
          "translated.owl.carousel refreshed.owl.carousel": t.proxy(
            function () {
              this.autoplay();
            },
            this
          ),
          "play.owl.autoplay": t.proxy(function (t, e, i) {
            this.play(e, i);
          }, this),
          "stop.owl.autoplay": t.proxy(function () {
            this.stop();
          }, this),
          "mouseover.owl.autoplay": t.proxy(function () {
            this.core.settings.autoplayHoverPause && this.pause();
          }, this),
          "mouseleave.owl.autoplay": t.proxy(function () {
            this.core.settings.autoplayHoverPause && this.autoplay();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (n.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (n.prototype.autoplay = function () {
        this.core.settings.autoplay && !this.core.state.videoPlay
          ? (e.clearInterval(this.interval),
            (this.interval = e.setInterval(
              t.proxy(function () {
                this.play();
              }, this),
              this.core.settings.autoplayTimeout
            )))
          : e.clearInterval(this.interval);
      }),
      (n.prototype.play = function () {
        return i.hidden === !0 ||
          this.core.state.isTouch ||
          this.core.state.isScrolling ||
          this.core.state.isSwiping ||
          this.core.state.inMotion
          ? void 0
          : this.core.settings.autoplay === !1
          ? void e.clearInterval(this.interval)
          : void this.core.next(this.core.settings.autoplaySpeed);
      }),
      (n.prototype.stop = function () {
        e.clearInterval(this.interval);
      }),
      (n.prototype.pause = function () {
        e.clearInterval(this.interval);
      }),
      (n.prototype.destroy = function () {
        var t, i;
        e.clearInterval(this.interval);
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (i in Object.getOwnPropertyNames(this))
          "function" != typeof this[i] && (this[i] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.autoplay = n);
  })(window.Zepto || window.jQuery, window, document),
  (function (t) {
    "use strict";
    var e = function (i) {
      (this._core = i),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": t.proxy(function (e) {
            this._core.settings.dotsData &&
              this._templates.push(
                t(e.content)
                  .find("[data-dot]")
                  .andSelf("[data-dot]")
                  .attr("data-dot")
              );
          }, this),
          "add.owl.carousel": t.proxy(function (e) {
            this._core.settings.dotsData &&
              this._templates.splice(
                e.position,
                0,
                t(e.content)
                  .find("[data-dot]")
                  .andSelf("[data-dot]")
                  .attr("data-dot")
              );
          }, this),
          "remove.owl.carousel prepared.owl.carousel": t.proxy(function (t) {
            this._core.settings.dotsData &&
              this._templates.splice(t.position, 1);
          }, this),
          "change.owl.carousel": t.proxy(function (t) {
            if (
              "position" == t.property.name &&
              !this._core.state.revert &&
              !this._core.settings.loop &&
              this._core.settings.navRewind
            ) {
              var e = this._core.current(),
                i = this._core.maximum(),
                n = this._core.minimum();
              t.data =
                t.property.value > i
                  ? e >= i
                    ? n
                    : i
                  : t.property.value < n
                  ? i
                  : t.property.value;
            }
          }, this),
          "changed.owl.carousel": t.proxy(function (t) {
            "position" == t.property.name && this.draw();
          }, this),
          "refreshed.owl.carousel": t.proxy(function () {
            this._initialized || (this.initialize(), (this._initialized = !0)),
              this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation");
          }, this),
        }),
        (this._core.options = t.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navRewind: !0,
      navText: ["prev", "next"],
      navSpeed: !1,
      navElement: "div",
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
      controlsClass: "owl-controls",
    }),
      (e.prototype.initialize = function () {
        var e,
          i,
          n = this._core.settings;
        n.dotsData ||
          (this._templates = [
            t("<div>")
              .addClass(n.dotClass)
              .append(t("<span>"))
              .prop("outerHTML"),
          ]),
          (n.navContainer && n.dotsContainer) ||
            (this._controls.$container = t("<div>")
              .addClass(n.controlsClass)
              .appendTo(this.$element)),
          (this._controls.$indicators = n.dotsContainer
            ? t(n.dotsContainer)
            : t("<div>")
                .hide()
                .addClass(n.dotsClass)
                .appendTo(this._controls.$container)),
          this._controls.$indicators.on(
            "click",
            "div",
            t.proxy(function (e) {
              var i = t(e.target).parent().is(this._controls.$indicators)
                ? t(e.target).index()
                : t(e.target).parent().index();
              e.preventDefault(), this.to(i, n.dotsSpeed);
            }, this)
          ),
          (e = n.navContainer
            ? t(n.navContainer)
            : t("<div>")
                .addClass(n.navContainerClass)
                .prependTo(this._controls.$container)),
          (this._controls.$next = t("<" + n.navElement + ">")),
          (this._controls.$previous = this._controls.$next.clone()),
          this._controls.$previous
            .addClass(n.navClass[0])
            .html(n.navText[0])
            .hide()
            .prependTo(e)
            .on(
              "click",
              t.proxy(function () {
                this.prev(n.navSpeed);
              }, this)
            ),
          this._controls.$next
            .addClass(n.navClass[1])
            .html(n.navText[1])
            .hide()
            .appendTo(e)
            .on(
              "click",
              t.proxy(function () {
                this.next(n.navSpeed);
              }, this)
            );
        for (i in this._overrides) this._core[i] = t.proxy(this[i], this);
      }),
      (e.prototype.destroy = function () {
        var t, e, i, n;
        for (t in this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls) this._controls[e].remove();
        for (n in this.overides) this._core[n] = this._overrides[n];
        for (i in Object.getOwnPropertyNames(this))
          "function" != typeof this[i] && (this[i] = null);
      }),
      (e.prototype.update = function () {
        var t,
          e,
          i,
          n = this._core.settings,
          s = this._core.clones().length / 2,
          r = s + this._core.items().length,
          o = n.center || n.autoWidth || n.dotData ? 1 : n.dotsEach || n.items;
        if (
          ("page" !== n.slideBy && (n.slideBy = Math.min(n.slideBy, n.items)),
          n.dots || "page" == n.slideBy)
        )
          for (this._pages = [], t = s, e = 0, i = 0; r > t; t++)
            (e >= o || 0 === e) &&
              (this._pages.push({ start: t - s, end: t - s + o - 1 }),
              (e = 0),
              ++i),
              (e += this._core.mergers(this._core.relative(t)));
      }),
      (e.prototype.draw = function () {
        var e,
          i,
          n = "",
          s = this._core.settings,
          r =
            (this._core.$stage.children(),
            this._core.relative(this._core.current()));
        if (
          (!s.nav ||
            s.loop ||
            s.navRewind ||
            (this._controls.$previous.toggleClass("disabled", 0 >= r),
            this._controls.$next.toggleClass(
              "disabled",
              r >= this._core.maximum()
            )),
          this._controls.$previous.toggle(s.nav),
          this._controls.$next.toggle(s.nav),
          s.dots)
        ) {
          if (
            ((e =
              this._pages.length -
              this._controls.$indicators.children().length),
            s.dotData && 0 !== e)
          ) {
            for (i = 0; i < this._controls.$indicators.children().length; i++)
              n += this._templates[this._core.relative(i)];
            this._controls.$indicators.html(n);
          } else
            e > 0
              ? ((n = new Array(e + 1).join(this._templates[0])),
                this._controls.$indicators.append(n))
              : 0 > e &&
                this._controls.$indicators.children().slice(e).remove();
          this._controls.$indicators.find(".active").removeClass("active"),
            this._controls.$indicators
              .children()
              .eq(t.inArray(this.current(), this._pages))
              .addClass("active");
        }
        this._controls.$indicators.toggle(s.dots);
      }),
      (e.prototype.onTrigger = function (e) {
        var i = this._core.settings;
        e.page = {
          index: t.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            i &&
            (i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items),
        };
      }),
      (e.prototype.current = function () {
        var e = this._core.relative(this._core.current());
        return t
          .grep(this._pages, function (t) {
            return t.start <= e && t.end >= e;
          })
          .pop();
      }),
      (e.prototype.getPosition = function (e) {
        var i,
          n,
          s = this._core.settings;
        return (
          "page" == s.slideBy
            ? ((i = t.inArray(this.current(), this._pages)),
              (n = this._pages.length),
              e ? ++i : --i,
              (i = this._pages[((i % n) + n) % n].start))
            : ((i = this._core.relative(this._core.current())),
              (n = this._core.items().length),
              e ? (i += s.slideBy) : (i -= s.slideBy)),
          i
        );
      }),
      (e.prototype.next = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e);
      }),
      (e.prototype.prev = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e);
      }),
      (e.prototype.to = function (e, i, n) {
        var s;
        n
          ? t.proxy(this._overrides.to, this._core)(e, i)
          : ((s = this._pages.length),
            t.proxy(this._overrides.to, this._core)(
              this._pages[((e % s) + s) % s].start,
              i
            ));
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (t, e) {
    "use strict";
    var i = function (n) {
      (this._core = n),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": t.proxy(function () {
            "URLHash" == this._core.settings.startPosition &&
              t(e).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": t.proxy(function (e) {
            var i = t(e.content)
              .find("[data-hash]")
              .andSelf("[data-hash]")
              .attr("data-hash");
            this._hashes[i] = e.content;
          }, this),
        }),
        (this._core.options = t.extend({}, i.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        t(e).on(
          "hashchange.owl.navigation",
          t.proxy(function () {
            var t = e.location.hash.substring(1),
              i = this._core.$stage.children(),
              n = (this._hashes[t] && i.index(this._hashes[t])) || 0;
            return t ? void this._core.to(n, !1, !0) : !1;
          }, this)
        );
    };
    (i.Defaults = { URLhashListener: !1 }),
      (i.prototype.destroy = function () {
        var i, n;
        t(e).off("hashchange.owl.navigation");
        for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
        for (n in Object.getOwnPropertyNames(this))
          "function" != typeof this[n] && (this[n] = null);
      }),
      (t.fn.owlCarousel.Constructor.Plugins.Hash = i);
  })(window.Zepto || window.jQuery, window, document),
  !(function (t, e) {
    function i(t) {
      return "object" == typeof t;
    }
    function n(t) {
      return "string" == typeof t;
    }
    function s(t) {
      return "number" == typeof t;
    }
    function r(t) {
      return t === e;
    }
    function o() {
      (j = google.maps),
        N ||
          (N = {
            verbose: !1,
            queryLimit: { attempt: 5, delay: 250, random: 250 },
            classes: (function () {
              var e = {};
              return (
                t.each(
                  "Map Marker InfoWindow Circle Rectangle OverlayView StreetViewPanorama KmlLayer TrafficLayer BicyclingLayer GroundOverlay StyledMapType ImageMapType".split(
                    " "
                  ),
                  function (t, i) {
                    e[i] = j[i];
                  }
                ),
                e
              );
            })(),
            map: {
              mapTypeId: j.MapTypeId.ROADMAP,
              center: [46.578498, 2.457275],
              zoom: 2,
            },
            overlay: { pane: "floatPane", content: "", offset: { x: 0, y: 0 } },
            geoloc: { getCurrentPosition: { maximumAge: 6e4, timeout: 5e3 } },
          });
    }
    function a(t, e) {
      return r(t) ? "gmap3_" + (e ? W + 1 : ++W) : t;
    }
    function l(t) {
      var e,
        i = j.version.split(".");
      for (t = t.split("."), e = 0; e < i.length; e++)
        i[e] = parseInt(i[e], 10);
      for (e = 0; e < t.length; e++) {
        if (((t[e] = parseInt(t[e], 10)), !i.hasOwnProperty(e))) return !1;
        if (i[e] < t[e]) return !1;
      }
      return !0;
    }
    function h(e, i, n, s, r) {
      function o(i, s) {
        i &&
          t.each(i, function (t, i) {
            var o = e,
              a = i;
            B(i) && ((o = i[0]), (a = i[1])),
              s(n, t, function (t) {
                a.apply(o, [r || n, t, l]);
              });
          });
      }
      var a = i.td || {},
        l = { id: s, data: a.data, tag: a.tag };
      o(a.events, j.event.addListener), o(a.onces, j.event.addListenerOnce);
    }
    function u(t) {
      var e,
        i = [];
      for (e in t) t.hasOwnProperty(e) && i.push(e);
      return i;
    }
    function c(t, e) {
      var i,
        n = arguments;
      for (i = 2; i < n.length; i++)
        if (e in n[i] && n[i].hasOwnProperty(e)) return void (t[e] = n[i][e]);
    }
    function p(e, i) {
      var n,
        s,
        r = ["data", "tag", "id", "events", "onces"],
        o = {};
      if (e.td)
        for (n in e.td)
          e.td.hasOwnProperty(n) &&
            "options" !== n &&
            "values" !== n &&
            (o[n] = e.td[n]);
      for (s = 0; s < r.length; s++) c(o, r[s], i, e.td);
      return (o.options = t.extend({}, e.opts || {}, i.options || {})), o;
    }
    function d() {
      if (N.verbose) {
        var t,
          e = [];
        if (window.console && F(console.error)) {
          for (t = 0; t < arguments.length; t++) e.push(arguments[t]);
          console.error.apply(console, e);
        } else {
          for (e = "", t = 0; t < arguments.length; t++)
            e += arguments[t].toString() + " ";
          alert(e);
        }
      }
    }
    function f(t) {
      return (s(t) || n(t)) && "" !== t && !isNaN(t);
    }
    function m(t) {
      var e,
        n = [];
      if (!r(t))
        if (i(t))
          if (s(t.length)) n = t;
          else for (e in t) n.push(t[e]);
        else n.push(t);
      return n;
    }
    function g(e) {
      return e
        ? F(e)
          ? e
          : ((e = m(e)),
            function (n) {
              var s;
              if (r(n)) return !1;
              if (i(n)) {
                for (s = 0; s < n.length; s++)
                  if (t.inArray(n[s], e) >= 0) return !0;
                return !1;
              }
              return t.inArray(n, e) >= 0;
            })
        : void 0;
    }
    function v(t, e, i) {
      var s = e ? t : null;
      return !t || n(t)
        ? s
        : t.latLng
        ? v(t.latLng)
        : t instanceof j.LatLng
        ? t
        : f(t.lat)
        ? new j.LatLng(t.lat, t.lng)
        : !i && B(t) && f(t[0]) && f(t[1])
        ? new j.LatLng(t[0], t[1])
        : s;
    }
    function _(t) {
      var e, i;
      return !t || t instanceof j.LatLngBounds
        ? t || null
        : (B(t)
            ? 2 === t.length
              ? ((e = v(t[0])), (i = v(t[1])))
              : 4 === t.length && ((e = v([t[0], t[1]])), (i = v([t[2], t[3]])))
            : "ne" in t && "sw" in t
            ? ((e = v(t.ne)), (i = v(t.sw)))
            : "n" in t &&
              "e" in t &&
              "s" in t &&
              "w" in t &&
              ((e = v([t.n, t.e])), (i = v([t.s, t.w]))),
          e && i ? new j.LatLngBounds(i, e) : null);
    }
    function y(t, e, i, s, r) {
      var o = i ? v(s.td, !1, !0) : !1,
        a = o
          ? { latLng: o }
          : s.td.address
          ? n(s.td.address)
            ? { address: s.td.address }
            : s.td.address
          : !1,
        l = a ? H.get(a) : !1,
        h = this;
      a
        ? ((r = r || 0),
          l
            ? ((s.latLng = l.results[0].geometry.location),
              (s.results = l.results),
              (s.status = l.status),
              e.apply(t, [s]))
            : (a.location && (a.location = v(a.location)),
              a.bounds && (a.bounds = _(a.bounds)),
              T().geocode(a, function (n, o) {
                o === j.GeocoderStatus.OK
                  ? (H.store(a, { results: n, status: o }),
                    (s.latLng = n[0].geometry.location),
                    (s.results = n),
                    (s.status = o),
                    e.apply(t, [s]))
                  : o === j.GeocoderStatus.OVER_QUERY_LIMIT &&
                    r < N.queryLimit.attempt
                  ? setTimeout(function () {
                      y.apply(h, [t, e, i, s, r + 1]);
                    }, N.queryLimit.delay +
                      Math.floor(Math.random() * N.queryLimit.random))
                  : (d("geocode failed", o, a),
                    (s.latLng = s.results = !1),
                    (s.status = o),
                    e.apply(t, [s]));
              })))
        : ((s.latLng = v(s.td, !1, !0)), e.apply(t, [s]));
    }
    function w(e, i, n, s) {
      function r() {
        do a++;
        while (a < e.length && !("address" in e[a]));
        return a >= e.length
          ? void n.apply(i, [s])
          : void y(
              o,
              function (i) {
                delete i.td, t.extend(e[a], i), r.apply(o, []);
              },
              !0,
              { td: e[a] }
            );
      }
      var o = this,
        a = -1;
      r();
    }
    function x(t, e, i) {
      var n = !1;
      navigator && navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(
            function (s) {
              n ||
                ((n = !0),
                (i.latLng = new j.LatLng(
                  s.coords.latitude,
                  s.coords.longitude
                )),
                e.apply(t, [i]));
            },
            function () {
              n || ((n = !0), (i.latLng = !1), e.apply(t, [i]));
            },
            i.opts.getCurrentPosition
          )
        : ((i.latLng = !1), e.apply(t, [i]));
    }
    function b(t) {
      var e,
        n = !1;
      if (i(t) && t.hasOwnProperty("get")) {
        for (e in t) if ("get" !== e) return !1;
        n = !t.get.hasOwnProperty("callback");
      }
      return n;
    }
    function T() {
      return X.geocoder || (X.geocoder = new j.Geocoder()), X.geocoder;
    }
    function S() {
      var t = [];
      (this.get = function (e) {
        if (t.length) {
          var n,
            s,
            r,
            o,
            a,
            l = u(e);
          for (n = 0; n < t.length; n++) {
            for (
              o = t[n], a = l.length === o.keys.length, s = 0;
              s < l.length && a;
              s++
            )
              (r = l[s]),
                (a = r in o.request),
                a &&
                  (a =
                    i(e[r]) && "equals" in e[r] && F(e[r])
                      ? e[r].equals(o.request[r])
                      : e[r] === o.request[r]);
            if (a) return o.results;
          }
        }
      }),
        (this.store = function (e, i) {
          t.push({ request: e, keys: u(e), results: i });
        });
    }
    function C() {
      var t = [],
        e = this;
      (e.empty = function () {
        return !t.length;
      }),
        (e.add = function (e) {
          t.push(e);
        }),
        (e.get = function () {
          return t.length ? t[0] : !1;
        }),
        (e.ack = function () {
          t.shift();
        });
    }
    function P() {
      function e(t) {
        return {
          id: t.id,
          name: t.name,
          object: t.obj,
          tag: t.tag,
          data: t.data,
        };
      }
      function i(t) {
        F(t.setMap) && t.setMap(null),
          F(t.remove) && t.remove(),
          F(t.free) && t.free(),
          (t = null);
      }
      var n = {},
        s = {},
        o = this;
      (o.add = function (t, e, i, r) {
        var l = t.td || {},
          h = a(l.id);
        return (
          n[e] || (n[e] = []),
          h in s && o.clearById(h),
          (s[h] = { obj: i, sub: r, name: e, id: h, tag: l.tag, data: l.data }),
          n[e].push(h),
          h
        );
      }),
        (o.getById = function (t, i, n) {
          var r = !1;
          return t in s && (r = i ? s[t].sub : n ? e(s[t]) : s[t].obj), r;
        }),
        (o.get = function (t, i, r, o) {
          var a,
            l,
            h = g(r);
          if (!n[t] || !n[t].length) return null;
          for (a = n[t].length; a; )
            if ((a--, (l = n[t][i ? a : n[t].length - a - 1]), l && s[l])) {
              if (h && !h(s[l].tag)) continue;
              return o ? e(s[l]) : s[l].obj;
            }
          return null;
        }),
        (o.all = function (t, i, o) {
          var a = [],
            l = g(i),
            h = function (t) {
              var i, r;
              for (i = 0; i < n[t].length; i++)
                if (((r = n[t][i]), r && s[r])) {
                  if (l && !l(s[r].tag)) continue;
                  a.push(o ? e(s[r]) : s[r].obj);
                }
            };
          if (t in n) h(t);
          else if (r(t)) for (t in n) h(t);
          return a;
        }),
        (o.rm = function (t, e, i) {
          var r, a;
          if (!n[t]) return !1;
          if (e)
            if (i)
              for (
                r = n[t].length - 1;
                r >= 0 && ((a = n[t][r]), !e(s[a].tag));
                r--
              );
            else
              for (
                r = 0;
                r < n[t].length && ((a = n[t][r]), !e(s[a].tag));
                r++
              );
          else r = i ? n[t].length - 1 : 0;
          return r in n[t] ? o.clearById(n[t][r], r) : !1;
        }),
        (o.clearById = function (t, e) {
          if (t in s) {
            var o,
              a = s[t].name;
            for (o = 0; r(e) && o < n[a].length; o++) t === n[a][o] && (e = o);
            return (
              i(s[t].obj),
              s[t].sub && i(s[t].sub),
              delete s[t],
              n[a].splice(e, 1),
              !0
            );
          }
          return !1;
        }),
        (o.objGetById = function (t) {
          var e, i;
          if (n.clusterer)
            for (i in n.clusterer)
              if ((e = s[n.clusterer[i]].obj.getById(t)) !== !1) return e;
          return !1;
        }),
        (o.objClearById = function (t) {
          var e;
          if (n.clusterer)
            for (e in n.clusterer)
              if (s[n.clusterer[e]].obj.clearById(t)) return !0;
          return null;
        }),
        (o.clear = function (t, e, i, s) {
          var r,
            a,
            l,
            h = g(s);
          if (t && t.length) t = m(t);
          else {
            t = [];
            for (r in n) t.push(r);
          }
          for (a = 0; a < t.length; a++)
            if (((l = t[a]), e)) o.rm(l, h, !0);
            else if (i) o.rm(l, h, !1);
            else for (; o.rm(l, h, !1); );
        }),
        (o.objClear = function (e, i, r, o) {
          var a;
          if (n.clusterer && (t.inArray("marker", e) >= 0 || !e.length))
            for (a in n.clusterer) s[n.clusterer[a]].obj.clear(i, r, o);
        });
    }
    function E(e, i, s) {
      function r(t) {
        var e = {};
        return (e[t] = {}), e;
      }
      function o() {
        var t;
        for (t in s) if (s.hasOwnProperty(t) && !l.hasOwnProperty(t)) return t;
      }
      var a,
        l = {},
        h = this,
        u = {
          latLng: {
            map: !1,
            marker: !1,
            infowindow: !1,
            circle: !1,
            overlay: !1,
            getlatlng: !1,
            getmaxzoom: !1,
            getelevation: !1,
            streetviewpanorama: !1,
            getaddress: !0,
          },
          geoloc: { getgeoloc: !0 },
        };
      n(s) && (s = r(s)),
        (h.run = function () {
          for (var n, r; (n = o()); ) {
            if (F(e[n]))
              return (
                (a = n),
                (r = t.extend(!0, {}, N[n] || {}, s[n].options || {})),
                void (n in u.latLng
                  ? s[n].values
                    ? w(s[n].values, e, e[n], { td: s[n], opts: r, session: l })
                    : y(e, e[n], u.latLng[n], { td: s[n], opts: r, session: l })
                  : n in u.geoloc
                  ? x(e, e[n], { td: s[n], opts: r, session: l })
                  : e[n].apply(e, [{ td: s[n], opts: r, session: l }]))
              );
            l[n] = null;
          }
          i.apply(e, [s, l]);
        }),
        (h.ack = function (t) {
          (l[a] = t), h.run.apply(h, []);
        });
    }
    function L() {
      return X.ds || (X.ds = new j.DirectionsService()), X.ds;
    }
    function M() {
      return X.dms || (X.dms = new j.DistanceMatrixService()), X.dms;
    }
    function I() {
      return X.mzs || (X.mzs = new j.MaxZoomService()), X.mzs;
    }
    function O() {
      return X.es || (X.es = new j.ElevationService()), X.es;
    }
    function k(t) {
      function e() {
        var t = this;
        return (
          (t.onAdd = function () {}),
          (t.onRemove = function () {}),
          (t.draw = function () {}),
          N.classes.OverlayView.apply(t, [])
        );
      }
      e.prototype = N.classes.OverlayView.prototype;
      var i = new e();
      return i.setMap(t), i;
    }
    function R(e, n, s) {
      function r(t) {
        R[t] ||
          (delete A[t].options.map,
          (R[t] = new N.classes.Marker(A[t].options)),
          h(e, { td: A[t] }, R[t], A[t].id));
      }
      function o() {
        return (_ = z.getProjection())
          ? ((C = !0),
            L.push(j.event.addListener(n, "zoom_changed", d)),
            L.push(j.event.addListener(n, "bounds_changed", d)),
            void m())
          : void setTimeout(function () {
              o.apply(E, []);
            }, 25);
      }
      function l(t) {
        i(M[t])
          ? (F(M[t].obj.setMap) && M[t].obj.setMap(null),
            F(M[t].obj.remove) && M[t].obj.remove(),
            F(M[t].shadow.remove) && M[t].obj.remove(),
            F(M[t].shadow.setMap) && M[t].shadow.setMap(null),
            delete M[t].obj,
            delete M[t].shadow)
          : R[t] && R[t].setMap(null),
          delete M[t];
      }
      function u() {
        var t,
          e,
          i,
          n,
          s,
          r,
          o,
          a,
          l = Math.cos,
          h = Math.sin,
          u = arguments;
        return (
          u[0] instanceof j.LatLng
            ? ((t = u[0].lat()),
              (i = u[0].lng()),
              u[1] instanceof j.LatLng
                ? ((e = u[1].lat()), (n = u[1].lng()))
                : ((e = u[1]), (n = u[2])))
            : ((t = u[0]),
              (i = u[1]),
              u[2] instanceof j.LatLng
                ? ((e = u[2].lat()), (n = u[2].lng()))
                : ((e = u[2]), (n = u[3]))),
          (s = (Math.PI * t) / 180),
          (r = (Math.PI * i) / 180),
          (o = (Math.PI * e) / 180),
          (a = (Math.PI * n) / 180),
          6371e3 *
            Math.acos(
              Math.min(
                l(s) * l(o) * l(r) * l(a) +
                  l(s) * h(r) * l(o) * h(a) +
                  h(s) * h(o),
                1
              )
            )
        );
      }
      function c() {
        var t = u(n.getCenter(), n.getBounds().getNorthEast()),
          e = new j.Circle({ center: n.getCenter(), radius: 1.25 * t });
        return e.getBounds();
      }
      function p() {
        var t,
          e = {};
        for (t in M) e[t] = !0;
        return e;
      }
      function d() {
        clearTimeout(v), (v = setTimeout(m, 25));
      }
      function f(t) {
        var e = _.fromLatLngToDivPixel(t),
          i = _.fromDivPixelToLatLng(
            new j.Point(e.x + s.radius, e.y - s.radius)
          ),
          n = _.fromDivPixelToLatLng(
            new j.Point(e.x - s.radius, e.y + s.radius)
          );
        return new j.LatLngBounds(n, i);
      }
      function m() {
        if (!b && !S && C) {
          var e,
            i,
            r,
            o,
            a,
            h,
            u,
            d,
            m,
            g,
            v,
            _ = !1,
            x = [],
            E = {},
            L = n.getZoom(),
            I = "maxZoom" in s && L > s.maxZoom,
            O = p();
          for (
            T = !1,
              L > 3 &&
                ((a = c()),
                (_ = a.getSouthWest().lng() < a.getNorthEast().lng())),
              e = 0;
            e < A.length;
            e++
          )
            !A[e] ||
              (_ && !a.contains(A[e].options.position)) ||
              (y && !y(D[e])) ||
              x.push(e);
          for (;;) {
            for (e = 0; E[e] && e < x.length; ) e++;
            if (e === x.length) break;
            if (((o = []), P && !I)) {
              v = 10;
              do
                for (
                  d = o,
                    o = [],
                    v--,
                    u = d.length ? a.getCenter() : A[x[e]].options.position,
                    a = f(u),
                    i = e;
                  i < x.length;
                  i++
                )
                  E[i] || (a.contains(A[x[i]].options.position) && o.push(i));
              while (d.length < o.length && o.length > 1 && v);
            } else
              for (i = e; i < x.length; i++)
                if (!E[i]) {
                  o.push(i);
                  break;
                }
            for (
              h = { indexes: [], ref: [] }, m = g = 0, r = 0;
              r < o.length;
              r++
            )
              (E[o[r]] = !0),
                h.indexes.push(x[o[r]]),
                h.ref.push(x[o[r]]),
                (m += A[x[o[r]]].options.position.lat()),
                (g += A[x[o[r]]].options.position.lng());
            (m /= o.length),
              (g /= o.length),
              (h.latLng = new j.LatLng(m, g)),
              (h.ref = h.ref.join("-")),
              h.ref in O
                ? delete O[h.ref]
                : (1 === o.length && (M[h.ref] = !0), w(h));
          }
          t.each(O, function (t) {
            l(t);
          }),
            (S = !1);
        }
      }
      var v,
        _,
        y,
        w,
        x,
        b = !1,
        T = !1,
        S = !1,
        C = !1,
        P = !0,
        E = this,
        L = [],
        M = {},
        I = {},
        O = {},
        R = [],
        A = [],
        D = [],
        z = k(n, s.radius);
      o(),
        (E.getById = function (t) {
          return t in I ? (r(I[t]), R[I[t]]) : !1;
        }),
        (E.rm = function (t) {
          var e = I[t];
          R[e] && R[e].setMap(null),
            delete R[e],
            (R[e] = !1),
            delete A[e],
            (A[e] = !1),
            delete D[e],
            (D[e] = !1),
            delete I[t],
            delete O[e],
            (T = !0);
        }),
        (E.clearById = function (t) {
          return t in I ? (E.rm(t), !0) : void 0;
        }),
        (E.clear = function (t, e, i) {
          var n,
            s,
            r,
            o,
            a,
            l = [],
            h = g(i);
          for (
            t
              ? ((n = A.length - 1), (s = -1), (r = -1))
              : ((n = 0), (s = A.length), (r = 1)),
              o = n;
            o !== s &&
            (!A[o] || (h && !h(A[o].tag)) || (l.push(O[o]), !e && !t));
            o += r
          );
          for (a = 0; a < l.length; a++) E.rm(l[a]);
        }),
        (E.add = function (t, e) {
          (t.id = a(t.id)),
            E.clearById(t.id),
            (I[t.id] = R.length),
            (O[R.length] = t.id),
            R.push(null),
            A.push(t),
            D.push(e),
            (T = !0);
        }),
        (E.addMarker = function (t, i) {
          (i = i || {}),
            (i.id = a(i.id)),
            E.clearById(i.id),
            i.options || (i.options = {}),
            (i.options.position = t.getPosition()),
            h(e, { td: i }, t, i.id),
            (I[i.id] = R.length),
            (O[R.length] = i.id),
            R.push(t),
            A.push(i),
            D.push(i.data || {}),
            (T = !0);
        }),
        (E.td = function (t) {
          return A[t];
        }),
        (E.value = function (t) {
          return D[t];
        }),
        (E.marker = function (t) {
          return t in R ? (r(t), R[t]) : !1;
        }),
        (E.markerIsSet = function (t) {
          return Boolean(R[t]);
        }),
        (E.setMarker = function (t, e) {
          R[t] = e;
        }),
        (E.store = function (t, e, i) {
          M[t.ref] = { obj: e, shadow: i };
        }),
        (E.free = function () {
          var e;
          for (e = 0; e < L.length; e++) j.event.removeListener(L[e]);
          (L = []),
            t.each(M, function (t) {
              l(t);
            }),
            (M = {}),
            t.each(A, function (t) {
              A[t] = null;
            }),
            (A = []),
            t.each(R, function (t) {
              R[t] && (R[t].setMap(null), delete R[t]);
            }),
            (R = []),
            t.each(D, function (t) {
              delete D[t];
            }),
            (D = []),
            (I = {}),
            (O = {});
        }),
        (E.filter = function (t) {
          (y = t), m();
        }),
        (E.enable = function (t) {
          P !== t && ((P = t), m());
        }),
        (E.display = function (t) {
          w = t;
        }),
        (E.error = function (t) {
          x = t;
        }),
        (E.beginUpdate = function () {
          b = !0;
        }),
        (E.endUpdate = function () {
          (b = !1), T && m();
        }),
        (E.autofit = function (t) {
          var e;
          for (e = 0; e < A.length; e++)
            A[e] && t.extend(A[e].options.position);
        });
    }
    function A(t, e) {
      var i = this;
      (i.id = function () {
        return t;
      }),
        (i.filter = function (t) {
          e.filter(t);
        }),
        (i.enable = function () {
          e.enable(!0);
        }),
        (i.disable = function () {
          e.enable(!1);
        }),
        (i.add = function (t, i, n) {
          n || e.beginUpdate(), e.addMarker(t, i), n || e.endUpdate();
        }),
        (i.getById = function (t) {
          return e.getById(t);
        }),
        (i.clearById = function (t, i) {
          var n;
          return (
            i || e.beginUpdate(), (n = e.clearById(t)), i || e.endUpdate(), n
          );
        }),
        (i.clear = function (t, i, n, s) {
          s || e.beginUpdate(), e.clear(t, i, n), s || e.endUpdate();
        });
    }
    function D(e, i, n, s) {
      var r = this,
        o = [];
      N.classes.OverlayView.call(r),
        r.setMap(e),
        (r.onAdd = function () {
          var e = r.getPanes();
          i.pane in e && t(e[i.pane]).append(s),
            t.each(
              "dblclick click mouseover mousemove mouseout mouseup mousedown".split(
                " "
              ),
              function (e, i) {
                o.push(
                  j.event.addDomListener(s[0], i, function (e) {
                    t.Event(e).stopPropagation(),
                      j.event.trigger(r, i, [e]),
                      r.draw();
                  })
                );
              }
            ),
            o.push(
              j.event.addDomListener(s[0], "contextmenu", function (e) {
                t.Event(e).stopPropagation(),
                  j.event.trigger(r, "rightclick", [e]),
                  r.draw();
              })
            );
        }),
        (r.getPosition = function () {
          return n;
        }),
        (r.setPosition = function (t) {
          (n = t), r.draw();
        }),
        (r.draw = function () {
          var t = r.getProjection().fromLatLngToDivPixel(n);
          s.css("left", t.x + i.offset.x + "px").css(
            "top",
            t.y + i.offset.y + "px"
          );
        }),
        (r.onRemove = function () {
          var t;
          for (t = 0; t < o.length; t++) j.event.removeListener(o[t]);
          s.remove();
        }),
        (r.hide = function () {
          s.hide();
        }),
        (r.show = function () {
          s.show();
        }),
        (r.toggle = function () {
          s && (s.is(":visible") ? r.show() : r.hide());
        }),
        (r.toggleDOM = function () {
          r.setMap(r.getMap() ? null : e);
        }),
        (r.getDOMElement = function () {
          return s[0];
        });
    }
    function z(s) {
      function o() {
        !x && (x = T.get()) && x.run();
      }
      function u() {
        (x = null), T.ack(), o.call(b);
      }
      function c(t) {
        var e,
          i = t.td.callback;
        i &&
          ((e = Array.prototype.slice.call(arguments, 1)),
          F(i) ? i.apply(s, e) : B(i) && F(i[1]) && i[1].apply(i[0], e));
      }
      function f(t, e, i) {
        i && h(s, t, e, i), c(t, e), x.ack(e);
      }
      function g(e, i) {
        i = i || {};
        var n = i.td && i.td.options ? i.td.options : 0;
        k
          ? n && (n.center && (n.center = v(n.center)), k.setOptions(n))
          : ((n = i.opts || t.extend(!0, {}, N.map, n || {})),
            (n.center = e || v(n.center)),
            (k = new N.classes.Map(s.get(0), n)));
      }
      function y(i) {
        var n,
          r,
          o = new R(s, k, i),
          a = {},
          l = {},
          u = [],
          c = /^[0-9]+$/;
        for (r in i)
          c.test(r)
            ? (u.push(1 * r),
              (l[r] = i[r]),
              (l[r].width = l[r].width || 0),
              (l[r].height = l[r].height || 0))
            : (a[r] = i[r]);
        return (
          u.sort(function (t, e) {
            return t > e;
          }),
          (n = a.calculator
            ? function (e) {
                var i = [];
                return (
                  t.each(e, function (t, e) {
                    i.push(o.value(e));
                  }),
                  a.calculator.apply(s, [i])
                );
              }
            : function (t) {
                return t.length;
              }),
          o.error(function () {
            d.apply(b, arguments);
          }),
          o.display(function (r) {
            var c,
              p,
              d,
              f,
              m,
              g,
              _ = n(r.indexes);
            if (i.force || _ > 1)
              for (c = 0; c < u.length; c++) u[c] <= _ && (p = l[u[c]]);
            p
              ? ((m = p.offset || [-p.width / 2, -p.height / 2]),
                (d = t.extend({}, a)),
                (d.options = t.extend(
                  {
                    pane: "overlayLayer",
                    content: p.content
                      ? p.content.replace("CLUSTER_COUNT", _)
                      : "",
                    offset: {
                      x: ("x" in m ? m.x : m[0]) || 0,
                      y: ("y" in m ? m.y : m[1]) || 0,
                    },
                  },
                  a.options || {}
                )),
                (f = b.overlay({ td: d, opts: d.options, latLng: v(r) }, !0)),
                (d.options.pane = "floatShadow"),
                (d.options.content = t(document.createElement("div"))
                  .width(p.width + "px")
                  .height(p.height + "px")
                  .css({ cursor: "pointer" })),
                (g = b.overlay({ td: d, opts: d.options, latLng: v(r) }, !0)),
                (a.data = { latLng: v(r), markers: [] }),
                t.each(r.indexes, function (t, e) {
                  a.data.markers.push(o.value(e)),
                    o.markerIsSet(e) && o.marker(e).setMap(null);
                }),
                h(s, { td: a }, g, e, { main: f, shadow: g }),
                o.store(r, f, g))
              : t.each(r.indexes, function (t, e) {
                  o.marker(e).setMap(k);
                });
          }),
          o
        );
      }
      function w(e, i, n) {
        var r = [],
          o = "values" in e.td;
        return (
          o || (e.td.values = [{ options: e.opts }]),
          e.td.values.length
            ? (g(),
              t.each(e.td.values, function (t, o) {
                var a,
                  l,
                  u,
                  c,
                  d = p(e, o);
                if (d.options[n])
                  if (d.options[n][0][0] && B(d.options[n][0][0]))
                    for (l = 0; l < d.options[n].length; l++)
                      for (u = 0; u < d.options[n][l].length; u++)
                        d.options[n][l][u] = v(d.options[n][l][u]);
                  else
                    for (l = 0; l < d.options[n].length; l++)
                      d.options[n][l] = v(d.options[n][l]);
                (d.options.map = k),
                  (c = new j[i](d.options)),
                  r.push(c),
                  (a = S.add({ td: d }, i.toLowerCase(), c)),
                  h(s, { td: d }, c, a);
              }),
              void f(e, o ? r : r[0]))
            : void f(e, !1)
        );
      }
      var x,
        b = this,
        T = new C(),
        S = new P(),
        k = null;
      (b._plan = function (t) {
        var e;
        for (e = 0; e < t.length; e++) T.add(new E(b, u, t[e]));
        o();
      }),
        (b.map = function (t) {
          g(t.latLng, t), h(s, t, k), f(t, k);
        }),
        (b.destroy = function (t) {
          S.clear(), s.empty(), k && (k = null), f(t, !0);
        }),
        (b.overlay = function (e, i) {
          var n = [],
            r = "values" in e.td;
          return (
            r || (e.td.values = [{ latLng: e.latLng, options: e.opts }]),
            e.td.values.length
              ? (D.__initialised ||
                  ((D.prototype = new N.classes.OverlayView()),
                  (D.__initialised = !0)),
                t.each(e.td.values, function (r, o) {
                  var a,
                    l,
                    u = p(e, o),
                    c = t(document.createElement("div")).css({
                      border: "none",
                      borderWidth: 0,
                      position: "absolute",
                    });
                  c.append(u.options.content),
                    (l = new D(k, u.options, v(u) || v(o), c)),
                    n.push(l),
                    (c = null),
                    i || ((a = S.add(e, "overlay", l)), h(s, { td: u }, l, a));
                }),
                i ? n[0] : void f(e, r ? n : n[0]))
              : void f(e, !1)
          );
        }),
        (b.marker = function (e) {
          var i,
            n,
            r,
            o = "values" in e.td,
            l = !k;
          return (
            o ||
              ((e.opts.position = e.latLng || v(e.opts.position)),
              (e.td.values = [{ options: e.opts }])),
            e.td.values.length
              ? (l && g(),
                e.td.cluster && !k.getBounds()
                  ? void j.event.addListenerOnce(
                      k,
                      "bounds_changed",
                      function () {
                        b.marker.apply(b, [e]);
                      }
                    )
                  : void (e.td.cluster
                      ? (e.td.cluster instanceof A
                          ? ((n = e.td.cluster), (r = S.getById(n.id(), !0)))
                          : ((r = y(e.td.cluster)),
                            (n = new A(a(e.td.id, !0), r)),
                            S.add(e, "clusterer", n, r)),
                        r.beginUpdate(),
                        t.each(e.td.values, function (t, i) {
                          var n = p(e, i);
                          (n.options.position = v(
                            n.options.position ? n.options.position : i
                          )),
                            n.options.position &&
                              ((n.options.map = k),
                              l && (k.setCenter(n.options.position), (l = !1)),
                              r.add(n, i));
                        }),
                        r.endUpdate(),
                        f(e, n))
                      : ((i = []),
                        t.each(e.td.values, function (t, n) {
                          var r,
                            o,
                            a = p(e, n);
                          (a.options.position = v(
                            a.options.position ? a.options.position : n
                          )),
                            a.options.position &&
                              ((a.options.map = k),
                              l && (k.setCenter(a.options.position), (l = !1)),
                              (o = new N.classes.Marker(a.options)),
                              i.push(o),
                              (r = S.add({ td: a }, "marker", o)),
                              h(s, { td: a }, o, r));
                        }),
                        f(e, o ? i : i[0]))))
              : void f(e, !1)
          );
        }),
        (b.getroute = function (t) {
          (t.opts.origin = v(t.opts.origin, !0)),
            (t.opts.destination = v(t.opts.destination, !0)),
            L().route(t.opts, function (e, i) {
              c(t, i === j.DirectionsStatus.OK ? e : !1, i), x.ack();
            });
        }),
        (b.getdistance = function (t) {
          var e;
          for (
            t.opts.origins = m(t.opts.origins), e = 0;
            e < t.opts.origins.length;
            e++
          )
            t.opts.origins[e] = v(t.opts.origins[e], !0);
          for (
            t.opts.destinations = m(t.opts.destinations), e = 0;
            e < t.opts.destinations.length;
            e++
          )
            t.opts.destinations[e] = v(t.opts.destinations[e], !0);
          M().getDistanceMatrix(t.opts, function (e, i) {
            c(t, i === j.DistanceMatrixStatus.OK ? e : !1, i), x.ack();
          });
        }),
        (b.infowindow = function (i) {
          var n = [],
            o = "values" in i.td;
          o ||
            (i.latLng && (i.opts.position = i.latLng),
            (i.td.values = [{ options: i.opts }])),
            t.each(i.td.values, function (t, a) {
              var l,
                u,
                c = p(i, a);
              (c.options.position = v(
                c.options.position ? c.options.position : a.latLng
              )),
                k || g(c.options.position),
                (u = new N.classes.InfoWindow(c.options)),
                u &&
                  (r(c.open) || c.open) &&
                  (o
                    ? u.open(k, c.anchor || e)
                    : u.open(
                        k,
                        c.anchor ||
                          (i.latLng
                            ? e
                            : i.session.marker
                            ? i.session.marker
                            : e)
                      )),
                n.push(u),
                (l = S.add({ td: c }, "infowindow", u)),
                h(s, { td: c }, u, l);
            }),
            f(i, o ? n : n[0]);
        }),
        (b.circle = function (e) {
          var i = [],
            n = "values" in e.td;
          return (
            n ||
              ((e.opts.center = e.latLng || v(e.opts.center)),
              (e.td.values = [{ options: e.opts }])),
            e.td.values.length
              ? (t.each(e.td.values, function (t, n) {
                  var r,
                    o,
                    a = p(e, n);
                  (a.options.center = v(
                    a.options.center ? a.options.center : n
                  )),
                    k || g(a.options.center),
                    (a.options.map = k),
                    (o = new N.classes.Circle(a.options)),
                    i.push(o),
                    (r = S.add({ td: a }, "circle", o)),
                    h(s, { td: a }, o, r);
                }),
                void f(e, n ? i : i[0]))
              : void f(e, !1)
          );
        }),
        (b.getaddress = function (t) {
          c(t, t.results, t.status), x.ack();
        }),
        (b.getlatlng = function (t) {
          c(t, t.results, t.status), x.ack();
        }),
        (b.getmaxzoom = function (t) {
          I().getMaxZoomAtLatLng(t.latLng, function (e) {
            c(t, e.status === j.MaxZoomStatus.OK ? e.zoom : !1, status),
              x.ack();
          });
        }),
        (b.getelevation = function (t) {
          var e,
            i = [],
            n = function (e, i) {
              c(t, i === j.ElevationStatus.OK ? e : !1, i), x.ack();
            };
          if (t.latLng) i.push(t.latLng);
          else
            for (i = m(t.td.locations || []), e = 0; e < i.length; e++)
              i[e] = v(i[e]);
          if (i.length) O().getElevationForLocations({ locations: i }, n);
          else {
            if (t.td.path && t.td.path.length)
              for (e = 0; e < t.td.path.length; e++) i.push(v(t.td.path[e]));
            i.length
              ? O().getElevationAlongPath({ path: i, samples: t.td.samples }, n)
              : x.ack();
          }
        }),
        (b.defaults = function (e) {
          t.each(e.td, function (e, n) {
            N[e] = i(N[e]) ? t.extend({}, N[e], n) : n;
          }),
            x.ack(!0);
        }),
        (b.rectangle = function (e) {
          var i = [],
            n = "values" in e.td;
          return (
            n || (e.td.values = [{ options: e.opts }]),
            e.td.values.length
              ? (t.each(e.td.values, function (t, n) {
                  var r,
                    o,
                    a = p(e, n);
                  (a.options.bounds = _(
                    a.options.bounds ? a.options.bounds : n
                  )),
                    k || g(a.options.bounds.getCenter()),
                    (a.options.map = k),
                    (o = new N.classes.Rectangle(a.options)),
                    i.push(o),
                    (r = S.add({ td: a }, "rectangle", o)),
                    h(s, { td: a }, o, r);
                }),
                void f(e, n ? i : i[0]))
              : void f(e, !1)
          );
        }),
        (b.polyline = function (t) {
          w(t, "Polyline", "path");
        }),
        (b.polygon = function (t) {
          w(t, "Polygon", "paths");
        }),
        (b.trafficlayer = function (t) {
          g();
          var e = S.get("trafficlayer");
          e ||
            ((e = new N.classes.TrafficLayer()),
            e.setMap(k),
            S.add(t, "trafficlayer", e)),
            f(t, e);
        }),
        (b.bicyclinglayer = function (t) {
          g();
          var e = S.get("bicyclinglayer");
          e ||
            ((e = new N.classes.BicyclingLayer()),
            e.setMap(k),
            S.add(t, "bicyclinglayer", e)),
            f(t, e);
        }),
        (b.groundoverlay = function (t) {
          (t.opts.bounds = _(t.opts.bounds)),
            t.opts.bounds && g(t.opts.bounds.getCenter());
          var e,
            i = new N.classes.GroundOverlay(
              t.opts.url,
              t.opts.bounds,
              t.opts.opts
            );
          i.setMap(k), (e = S.add(t, "groundoverlay", i)), f(t, i, e);
        }),
        (b.streetviewpanorama = function (e) {
          e.opts.opts || (e.opts.opts = {}),
            e.latLng
              ? (e.opts.opts.position = e.latLng)
              : e.opts.opts.position &&
                (e.opts.opts.position = v(e.opts.opts.position)),
            e.td.divId
              ? (e.opts.container = document.getElementById(e.td.divId))
              : e.opts.container &&
                (e.opts.container = t(e.opts.container).get(0));
          var i,
            n = new N.classes.StreetViewPanorama(e.opts.container, e.opts.opts);
          n && k.setStreetView(n),
            (i = S.add(e, "streetviewpanorama", n)),
            f(e, n, i);
        }),
        (b.kmllayer = function (e) {
          var i = [],
            n = "values" in e.td;
          return (
            n || (e.td.values = [{ options: e.opts }]),
            e.td.values.length
              ? (t.each(e.td.values, function (t, n) {
                  var r,
                    o,
                    a,
                    u = p(e, n);
                  k || g(),
                    (a = u.options),
                    u.options.opts &&
                      ((a = u.options.opts),
                      u.options.url && (a.url = u.options.url)),
                    (a.map = k),
                    (o = l("3.10")
                      ? new N.classes.KmlLayer(a)
                      : new N.classes.KmlLayer(a.url, a)),
                    i.push(o),
                    (r = S.add({ td: u }, "kmllayer", o)),
                    h(s, { td: u }, o, r);
                }),
                void f(e, n ? i : i[0]))
              : void f(e, !1)
          );
        }),
        (b.panel = function (e) {
          g();
          var i,
            n,
            o = 0,
            a = 0,
            l = t(document.createElement("div"));
          l.css({ position: "absolute", zIndex: 1e3, visibility: "hidden" }),
            e.opts.content &&
              ((n = t(e.opts.content)),
              l.append(n),
              s.first().prepend(l),
              r(e.opts.left)
                ? r(e.opts.right)
                  ? e.opts.center && (o = (s.width() - n.width()) / 2)
                  : (o = s.width() - n.width() - e.opts.right)
                : (o = e.opts.left),
              r(e.opts.top)
                ? r(e.opts.bottom)
                  ? e.opts.middle && (a = (s.height() - n.height()) / 2)
                  : (a = s.height() - n.height() - e.opts.bottom)
                : (a = e.opts.top),
              l.css({ top: a, left: o, visibility: "visible" })),
            (i = S.add(e, "panel", l)),
            f(e, l, i),
            (l = null);
        }),
        (b.directionsrenderer = function (e) {
          e.opts.map = k;
          var i,
            n = new j.DirectionsRenderer(e.opts);
          e.td.divId
            ? n.setPanel(document.getElementById(e.td.divId))
            : e.td.container && n.setPanel(t(e.td.container).get(0)),
            (i = S.add(e, "directionsrenderer", n)),
            f(e, n, i);
        }),
        (b.getgeoloc = function (t) {
          f(t, t.latLng);
        }),
        (b.styledmaptype = function (t) {
          g();
          var e = new N.classes.StyledMapType(t.td.styles, t.opts);
          k.mapTypes.set(t.td.id, e), f(t, e);
        }),
        (b.imagemaptype = function (t) {
          g();
          var e = new N.classes.ImageMapType(t.opts);
          k.mapTypes.set(t.td.id, e), f(t, e);
        }),
        (b.autofit = function (e) {
          var i = new j.LatLngBounds();
          t.each(S.all(), function (t, e) {
            e.getPosition
              ? i.extend(e.getPosition())
              : e.getBounds
              ? (i.extend(e.getBounds().getNorthEast()),
                i.extend(e.getBounds().getSouthWest()))
              : e.getPaths
              ? e.getPaths().forEach(function (t) {
                  t.forEach(function (t) {
                    i.extend(t);
                  });
                })
              : e.getPath
              ? e.getPath().forEach(function (t) {
                  i.extend(t);
                })
              : e.getCenter
              ? i.extend(e.getCenter())
              : "function" == typeof A &&
                e instanceof A &&
                ((e = S.getById(e.id(), !0)), e && e.autofit(i));
          }),
            i.isEmpty() ||
              (k.getBounds() && k.getBounds().equals(i)) ||
              ("maxZoom" in e.td &&
                j.event.addListenerOnce(k, "bounds_changed", function () {
                  this.getZoom() > e.td.maxZoom && this.setZoom(e.td.maxZoom);
                }),
              k.fitBounds(i)),
            f(e, !0);
        }),
        (b.clear = function (e) {
          if (n(e.td)) {
            if (S.clearById(e.td) || S.objClearById(e.td)) return void f(e, !0);
            e.td = { name: e.td };
          }
          e.td.id
            ? t.each(m(e.td.id), function (t, e) {
                S.clearById(e) || S.objClearById(e);
              })
            : (S.clear(m(e.td.name), e.td.last, e.td.first, e.td.tag),
              S.objClear(m(e.td.name), e.td.last, e.td.first, e.td.tag)),
            f(e, !0);
        }),
        (b.get = function (i, s, r) {
          var o,
            a,
            l = s ? i : i.td;
          return (
            s || (r = l.full),
            n(l)
              ? ((a = S.getById(l, !1, r) || S.objGetById(l)),
                a === !1 && ((o = l), (l = {})))
              : (o = l.name),
            "map" === o && (a = k),
            a ||
              ((a = []),
              l.id
                ? (t.each(m(l.id), function (t, e) {
                    a.push(S.getById(e, !1, r) || S.objGetById(e));
                  }),
                  B(l.id) || (a = a[0]))
                : (t.each(o ? m(o) : [e], function (e, i) {
                    var n;
                    l.first
                      ? ((n = S.get(i, !1, l.tag, r)), n && a.push(n))
                      : l.all
                      ? t.each(S.all(i, l.tag, r), function (t, e) {
                          a.push(e);
                        })
                      : ((n = S.get(i, !0, l.tag, r)), n && a.push(n));
                  }),
                  l.all || B(o) || (a = a[0]))),
            (a = B(a) || !l.all ? a : [a]),
            s ? a : void f(i, a)
          );
        }),
        (b.exec = function (e) {
          t.each(m(e.td.func), function (i, n) {
            t.each(
              b.get(e.td, !0, e.td.hasOwnProperty("full") ? e.td.full : !0),
              function (t, e) {
                n.call(s, e);
              }
            );
          }),
            f(e, !0);
        }),
        (b.trigger = function (e) {
          if (n(e.td)) j.event.trigger(k, e.td);
          else {
            var i = [k, e.td.eventName];
            e.td.var_args &&
              t.each(e.td.var_args, function (t, e) {
                i.push(e);
              }),
              j.event.trigger.apply(j.event, i);
          }
          c(e), x.ack();
        });
    }
    var N,
      j,
      W = 0,
      F = t.isFunction,
      B = t.isArray,
      X = {},
      H = new S();
    t.fn.gmap3 = function () {
      var e,
        i = [],
        n = !0,
        s = [];
      for (o(), e = 0; e < arguments.length; e++)
        arguments[e] && i.push(arguments[e]);
      return (
        i.length || i.push("map"),
        t.each(this, function () {
          var e = t(this),
            r = e.data("gmap3");
          (n = !1),
            r || ((r = new z(e)), e.data("gmap3", r)),
            1 !== i.length || ("get" !== i[0] && !b(i[0]))
              ? r._plan(i)
              : s.push(
                  "get" === i[0]
                    ? r.get("map", !0)
                    : r.get(i[0].get, !0, i[0].get.full)
                );
        }),
        s.length ? (1 === s.length ? s[0] : s) : this
      );
    };
  })(jQuery),
  (function (t) {
    function e() {}
    function i(t) {
      function i(e) {
        e.prototype.option ||
          (e.prototype.option = function (e) {
            t.isPlainObject(e) &&
              (this.options = t.extend(!0, this.options, e));
          });
      }
      function s(e, i) {
        t.fn[e] = function (s) {
          if ("string" == typeof s) {
            for (
              var o = n.call(arguments, 1), a = 0, l = this.length;
              l > a;
              a++
            ) {
              var h = this[a],
                u = t.data(h, e);
              if (u)
                if (t.isFunction(u[s]) && "_" !== s.charAt(0)) {
                  var c = u[s].apply(u, o);
                  if (void 0 !== c) return c;
                } else r("no such method '" + s + "' for " + e + " instance");
              else
                r(
                  "cannot call methods on " +
                    e +
                    " prior to initialization; attempted to call '" +
                    s +
                    "'"
                );
            }
            return this;
          }
          return this.each(function () {
            var n = t.data(this, e);
            n
              ? (n.option(s), n._init())
              : ((n = new i(this, s)), t.data(this, e, n));
          });
        };
      }
      if (t) {
        var r =
          "undefined" == typeof console
            ? e
            : function (t) {
                console.error(t);
              };
        return (
          (t.bridget = function (t, e) {
            i(e), s(t, e);
          }),
          t.bridget
        );
      }
    }
    var n = Array.prototype.slice;
    "function" == typeof define && define.amd
      ? define("jquery-bridget/jquery.bridget", ["jquery"], i)
      : i(t.jQuery);
  })(window),
  (function (t) {
    function e(e) {
      var i = t.event;
      return (i.target = i.target || i.srcElement || e), i;
    }
    var i = document.documentElement,
      n = function () {};
    i.addEventListener
      ? (n = function (t, e, i) {
          t.addEventListener(e, i, !1);
        })
      : i.attachEvent &&
        (n = function (t, i, n) {
          (t[i + n] = n.handleEvent
            ? function () {
                var i = e(t);
                n.handleEvent.call(n, i);
              }
            : function () {
                var i = e(t);
                n.call(t, i);
              }),
            t.attachEvent("on" + i, t[i + n]);
        });
    var s = function () {};
    i.removeEventListener
      ? (s = function (t, e, i) {
          t.removeEventListener(e, i, !1);
        })
      : i.detachEvent &&
        (s = function (t, e, i) {
          t.detachEvent("on" + e, t[e + i]);
          try {
            delete t[e + i];
          } catch (n) {
            t[e + i] = void 0;
          }
        });
    var r = { bind: n, unbind: s };
    "function" == typeof define && define.amd
      ? define("eventie/eventie", r)
      : "object" == typeof exports
      ? (module.exports = r)
      : (t.eventie = r);
  })(this),
  (function (t) {
    function e(t) {
      "function" == typeof t && (e.isReady ? t() : r.push(t));
    }
    function i(t) {
      var i = "readystatechange" === t.type && "complete" !== s.readyState;
      if (!e.isReady && !i) {
        e.isReady = !0;
        for (var n = 0, o = r.length; o > n; n++) {
          var a = r[n];
          a();
        }
      }
    }
    function n(n) {
      return (
        n.bind(s, "DOMContentLoaded", i),
        n.bind(s, "readystatechange", i),
        n.bind(t, "load", i),
        e
      );
    }
    var s = t.document,
      r = [];
    (e.isReady = !1),
      "function" == typeof define && define.amd
        ? ((e.isReady = "function" == typeof requirejs),
          define("doc-ready/doc-ready", ["eventie/eventie"], n))
        : (t.docReady = n(t.eventie));
  })(this),
  function () {
    function t() {}
    function e(t, e) {
      for (var i = t.length; i--; ) if (t[i].listener === e) return i;
      return -1;
    }
    function i(t) {
      return function () {
        return this[t].apply(this, arguments);
      };
    }
    var n = t.prototype,
      s = this,
      r = s.EventEmitter;
    (n.getListeners = function (t) {
      var e,
        i,
        n = this._getEvents();
      if (t instanceof RegExp) {
        e = {};
        for (i in n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i]);
      } else e = n[t] || (n[t] = []);
      return e;
    }),
      (n.flattenListeners = function (t) {
        var e,
          i = [];
        for (e = 0; t.length > e; e += 1) i.push(t[e].listener);
        return i;
      }),
      (n.getListenersAsObject = function (t) {
        var e,
          i = this.getListeners(t);
        return i instanceof Array && ((e = {}), (e[t] = i)), e || i;
      }),
      (n.addListener = function (t, i) {
        var n,
          s = this.getListenersAsObject(t),
          r = "object" == typeof i;
        for (n in s)
          s.hasOwnProperty(n) &&
            -1 === e(s[n], i) &&
            s[n].push(r ? i : { listener: i, once: !1 });
        return this;
      }),
      (n.on = i("addListener")),
      (n.addOnceListener = function (t, e) {
        return this.addListener(t, { listener: e, once: !0 });
      }),
      (n.once = i("addOnceListener")),
      (n.defineEvent = function (t) {
        return this.getListeners(t), this;
      }),
      (n.defineEvents = function (t) {
        for (var e = 0; t.length > e; e += 1) this.defineEvent(t[e]);
        return this;
      }),
      (n.removeListener = function (t, i) {
        var n,
          s,
          r = this.getListenersAsObject(t);
        for (s in r)
          r.hasOwnProperty(s) &&
            ((n = e(r[s], i)), -1 !== n && r[s].splice(n, 1));
        return this;
      }),
      (n.off = i("removeListener")),
      (n.addListeners = function (t, e) {
        return this.manipulateListeners(!1, t, e);
      }),
      (n.removeListeners = function (t, e) {
        return this.manipulateListeners(!0, t, e);
      }),
      (n.manipulateListeners = function (t, e, i) {
        var n,
          s,
          r = t ? this.removeListener : this.addListener,
          o = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
          for (n = i.length; n--; ) r.call(this, e, i[n]);
        else
          for (n in e)
            e.hasOwnProperty(n) &&
              (s = e[n]) &&
              ("function" == typeof s
                ? r.call(this, n, s)
                : o.call(this, n, s));
        return this;
      }),
      (n.removeEvent = function (t) {
        var e,
          i = typeof t,
          n = this._getEvents();
        if ("string" === i) delete n[t];
        else if (t instanceof RegExp)
          for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
        else delete this._events;
        return this;
      }),
      (n.removeAllListeners = i("removeEvent")),
      (n.emitEvent = function (t, e) {
        var i,
          n,
          s,
          r,
          o = this.getListenersAsObject(t);
        for (s in o)
          if (o.hasOwnProperty(s))
            for (n = o[s].length; n--; )
              (i = o[s][n]),
                i.once === !0 && this.removeListener(t, i.listener),
                (r = i.listener.apply(this, e || [])),
                r === this._getOnceReturnValue() &&
                  this.removeListener(t, i.listener);
        return this;
      }),
      (n.trigger = i("emitEvent")),
      (n.emit = function (t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e);
      }),
      (n.setOnceReturnValue = function (t) {
        return (this._onceReturnValue = t), this;
      }),
      (n._getOnceReturnValue = function () {
        return this.hasOwnProperty("_onceReturnValue")
          ? this._onceReturnValue
          : !0;
      }),
      (n._getEvents = function () {
        return this._events || (this._events = {});
      }),
      (t.noConflict = function () {
        return (s.EventEmitter = r), t;
      }),
      "function" == typeof define && define.amd
        ? define("eventEmitter/EventEmitter", [], function () {
            return t;
          })
        : "object" == typeof module && module.exports
        ? (module.exports = t)
        : (this.EventEmitter = t);
  }.call(this),
  (function (t) {
    function e(t) {
      if (t) {
        if ("string" == typeof n[t]) return t;
        t = t.charAt(0).toUpperCase() + t.slice(1);
        for (var e, s = 0, r = i.length; r > s; s++)
          if (((e = i[s] + t), "string" == typeof n[e])) return e;
      }
    }
    var i = "Webkit Moz ms Ms O".split(" "),
      n = document.documentElement.style;
    "function" == typeof define && define.amd
      ? define("get-style-property/get-style-property", [], function () {
          return e;
        })
      : "object" == typeof exports
      ? (module.exports = e)
      : (t.getStyleProperty = e);
  })(window),
  (function (t) {
    function e(t) {
      var e = parseFloat(t),
        i = -1 === t.indexOf("%") && !isNaN(e);
      return i && e;
    }
    function i() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          e = 0,
          i = o.length;
        i > e;
        e++
      ) {
        var n = o[e];
        t[n] = 0;
      }
      return t;
    }
    function n(t) {
      function n(t) {
        if (
          ("string" == typeof t && (t = document.querySelector(t)),
          t && "object" == typeof t && t.nodeType)
        ) {
          var n = r(t);
          if ("none" === n.display) return i();
          var s = {};
          (s.width = t.offsetWidth), (s.height = t.offsetHeight);
          for (
            var u = (s.isBorderBox = !(!h || !n[h] || "border-box" !== n[h])),
              c = 0,
              p = o.length;
            p > c;
            c++
          ) {
            var d = o[c],
              f = n[d];
            f = a(t, f);
            var m = parseFloat(f);
            s[d] = isNaN(m) ? 0 : m;
          }
          var g = s.paddingLeft + s.paddingRight,
            v = s.paddingTop + s.paddingBottom,
            _ = s.marginLeft + s.marginRight,
            y = s.marginTop + s.marginBottom,
            w = s.borderLeftWidth + s.borderRightWidth,
            x = s.borderTopWidth + s.borderBottomWidth,
            b = u && l,
            T = e(n.width);
          T !== !1 && (s.width = T + (b ? 0 : g + w));
          var S = e(n.height);
          return (
            S !== !1 && (s.height = S + (b ? 0 : v + x)),
            (s.innerWidth = s.width - (g + w)),
            (s.innerHeight = s.height - (v + x)),
            (s.outerWidth = s.width + _),
            (s.outerHeight = s.height + y),
            s
          );
        }
      }
      function a(t, e) {
        if (s || -1 === e.indexOf("%")) return e;
        var i = t.style,
          n = i.left,
          r = t.runtimeStyle,
          o = r && r.left;
        return (
          o && (r.left = t.currentStyle.left),
          (i.left = e),
          (e = i.pixelLeft),
          (i.left = n),
          o && (r.left = o),
          e
        );
      }
      var l,
        h = t("boxSizing");
      return (
        (function () {
          if (h) {
            var t = document.createElement("div");
            (t.style.width = "200px"),
              (t.style.padding = "1px 2px 3px 4px"),
              (t.style.borderStyle = "solid"),
              (t.style.borderWidth = "1px 2px 3px 4px"),
              (t.style[h] = "border-box");
            var i = document.body || document.documentElement;
            i.appendChild(t);
            var n = r(t);
            (l = 200 === e(n.width)), i.removeChild(t);
          }
        })(),
        n
      );
    }
    var s = t.getComputedStyle,
      r = s
        ? function (t) {
            return s(t, null);
          }
        : function (t) {
            return t.currentStyle;
          },
      o = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ];
    "function" == typeof define && define.amd
      ? define(
          "get-size/get-size",
          ["get-style-property/get-style-property"],
          n
        )
      : "object" == typeof exports
      ? (module.exports = n(require("get-style-property")))
      : (t.getSize = n(t.getStyleProperty));
  })(window),
  (function (t, e) {
    function i(t, e) {
      return t[a](e);
    }
    function n(t) {
      if (!t.parentNode) {
        var e = document.createDocumentFragment();
        e.appendChild(t);
      }
    }
    function s(t, e) {
      n(t);
      for (
        var i = t.parentNode.querySelectorAll(e), s = 0, r = i.length;
        r > s;
        s++
      )
        if (i[s] === t) return !0;
      return !1;
    }
    function r(t, e) {
      return n(t), i(t, e);
    }
    var o,
      a = (function () {
        if (e.matchesSelector) return "matchesSelector";
        for (
          var t = ["webkit", "moz", "ms", "o"], i = 0, n = t.length;
          n > i;
          i++
        ) {
          var s = t[i],
            r = s + "MatchesSelector";
          if (e[r]) return r;
        }
      })();
    if (a) {
      var l = document.createElement("div"),
        h = i(l, "div");
      o = h ? i : r;
    } else o = s;
    "function" == typeof define && define.amd
      ? define("matches-selector/matches-selector", [], function () {
          return o;
        })
      : (window.matchesSelector = o);
  })(this, Element.prototype),
  (function (t) {
    function e(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function i(t) {
      for (var e in t) return !1;
      return (e = null), !0;
    }
    function n(t) {
      return t.replace(/([A-Z])/g, function (t) {
        return "-" + t.toLowerCase();
      });
    }
    function s(t, s, r) {
      function a(t, e) {
        t &&
          ((this.element = t),
          (this.layout = e),
          (this.position = { x: 0, y: 0 }),
          this._create());
      }
      var l = r("transition"),
        h = r("transform"),
        u = l && h,
        c = !!r("perspective"),
        p = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "otransitionend",
          transition: "transitionend",
        }[l],
        d = [
          "transform",
          "transition",
          "transitionDuration",
          "transitionProperty",
        ],
        f = (function () {
          for (var t = {}, e = 0, i = d.length; i > e; e++) {
            var n = d[e],
              s = r(n);
            s && s !== n && (t[n] = s);
          }
          return t;
        })();
      e(a.prototype, t.prototype),
        (a.prototype._create = function () {
          (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
            this.css({ position: "absolute" });
        }),
        (a.prototype.handleEvent = function (t) {
          var e = "on" + t.type;
          this[e] && this[e](t);
        }),
        (a.prototype.getSize = function () {
          this.size = s(this.element);
        }),
        (a.prototype.css = function (t) {
          var e = this.element.style;
          for (var i in t) {
            var n = f[i] || i;
            e[n] = t[i];
          }
        }),
        (a.prototype.getPosition = function () {
          var t = o(this.element),
            e = this.layout.options,
            i = e.isOriginLeft,
            n = e.isOriginTop,
            s = parseInt(t[i ? "left" : "right"], 10),
            r = parseInt(t[n ? "top" : "bottom"], 10);
          (s = isNaN(s) ? 0 : s), (r = isNaN(r) ? 0 : r);
          var a = this.layout.size;
          (s -= i ? a.paddingLeft : a.paddingRight),
            (r -= n ? a.paddingTop : a.paddingBottom),
            (this.position.x = s),
            (this.position.y = r);
        }),
        (a.prototype.layoutPosition = function () {
          var t = this.layout.size,
            e = this.layout.options,
            i = {};
          e.isOriginLeft
            ? ((i.left = this.position.x + t.paddingLeft + "px"),
              (i.right = ""))
            : ((i.right = this.position.x + t.paddingRight + "px"),
              (i.left = "")),
            e.isOriginTop
              ? ((i.top = this.position.y + t.paddingTop + "px"),
                (i.bottom = ""))
              : ((i.bottom = this.position.y + t.paddingBottom + "px"),
                (i.top = "")),
            this.css(i),
            this.emitEvent("layout", [this]);
        });
      var m = c
        ? function (t, e) {
            return "translate3d(" + t + "px, " + e + "px, 0)";
          }
        : function (t, e) {
            return "translate(" + t + "px, " + e + "px)";
          };
      (a.prototype._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          n = this.position.y,
          s = parseInt(t, 10),
          r = parseInt(e, 10),
          o = s === this.position.x && r === this.position.y;
        if ((this.setPosition(t, e), o && !this.isTransitioning))
          return void this.layoutPosition();
        var a = t - i,
          l = e - n,
          h = {},
          u = this.layout.options;
        (a = u.isOriginLeft ? a : -a),
          (l = u.isOriginTop ? l : -l),
          (h.transform = m(a, l)),
          this.transition({
            to: h,
            onTransitionEnd: { transform: this.layoutPosition },
            isCleaning: !0,
          });
      }),
        (a.prototype.goTo = function (t, e) {
          this.setPosition(t, e), this.layoutPosition();
        }),
        (a.prototype.moveTo = u ? a.prototype._transitionTo : a.prototype.goTo),
        (a.prototype.setPosition = function (t, e) {
          (this.position.x = parseInt(t, 10)),
            (this.position.y = parseInt(e, 10));
        }),
        (a.prototype._nonTransition = function (t) {
          this.css(t.to), t.isCleaning && this._removeStyles(t.to);
          for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this);
        }),
        (a.prototype._transition = function (t) {
          if (!parseFloat(this.layout.options.transitionDuration))
            return void this._nonTransition(t);
          var e = this._transn;
          for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
          for (i in t.to)
            (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
          if (t.from) {
            this.css(t.from);
            var n = this.element.offsetHeight;
            n = null;
          }
          this.enableTransition(t.to),
            this.css(t.to),
            (this.isTransitioning = !0);
        });
      var g = h && n(h) + ",opacity";
      (a.prototype.enableTransition = function () {
        this.isTransitioning ||
          (this.css({
            transitionProperty: g,
            transitionDuration: this.layout.options.transitionDuration,
          }),
          this.element.addEventListener(p, this, !1));
      }),
        (a.prototype.transition =
          a.prototype[l ? "_transition" : "_nonTransition"]),
        (a.prototype.onwebkitTransitionEnd = function (t) {
          this.ontransitionend(t);
        }),
        (a.prototype.onotransitionend = function (t) {
          this.ontransitionend(t);
        });
      var v = {
        "-webkit-transform": "transform",
        "-moz-transform": "transform",
        "-o-transform": "transform",
      };
      (a.prototype.ontransitionend = function (t) {
        if (t.target === this.element) {
          var e = this._transn,
            n = v[t.propertyName] || t.propertyName;
          if (
            (delete e.ingProperties[n],
            i(e.ingProperties) && this.disableTransition(),
            n in e.clean &&
              ((this.element.style[t.propertyName] = ""), delete e.clean[n]),
            n in e.onEnd)
          ) {
            var s = e.onEnd[n];
            s.call(this), delete e.onEnd[n];
          }
          this.emitEvent("transitionEnd", [this]);
        }
      }),
        (a.prototype.disableTransition = function () {
          this.removeTransitionStyles(),
            this.element.removeEventListener(p, this, !1),
            (this.isTransitioning = !1);
        }),
        (a.prototype._removeStyles = function (t) {
          var e = {};
          for (var i in t) e[i] = "";
          this.css(e);
        });
      var _ = { transitionProperty: "", transitionDuration: "" };
      return (
        (a.prototype.removeTransitionStyles = function () {
          this.css(_);
        }),
        (a.prototype.removeElem = function () {
          this.element.parentNode.removeChild(this.element),
            this.emitEvent("remove", [this]);
        }),
        (a.prototype.remove = function () {
          if (!l || !parseFloat(this.layout.options.transitionDuration))
            return void this.removeElem();
          var t = this;
          this.on("transitionEnd", function () {
            return t.removeElem(), !0;
          }),
            this.hide();
        }),
        (a.prototype.reveal = function () {
          delete this.isHidden, this.css({ display: "" });
          var t = this.layout.options;
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
          });
        }),
        (a.prototype.hide = function () {
          (this.isHidden = !0), this.css({ display: "" });
          var t = this.layout.options;
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: {
              opacity: function () {
                this.isHidden && this.css({ display: "none" });
              },
            },
          });
        }),
        (a.prototype.destroy = function () {
          this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: "",
          });
        }),
        a
      );
    }
    var r = t.getComputedStyle,
      o = r
        ? function (t) {
            return r(t, null);
          }
        : function (t) {
            return t.currentStyle;
          };
    "function" == typeof define && define.amd
      ? define(
          "outlayer/item",
          [
            "eventEmitter/EventEmitter",
            "get-size/get-size",
            "get-style-property/get-style-property",
          ],
          s
        )
      : ((t.Outlayer = {}),
        (t.Outlayer.Item = s(t.EventEmitter, t.getSize, t.getStyleProperty)));
  })(window),
  (function (t) {
    function e(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function i(t) {
      return "[object Array]" === c.call(t);
    }
    function n(t) {
      var e = [];
      if (i(t)) e = t;
      else if (t && "number" == typeof t.length)
        for (var n = 0, s = t.length; s > n; n++) e.push(t[n]);
      else e.push(t);
      return e;
    }
    function s(t, e) {
      var i = d(e, t);
      -1 !== i && e.splice(i, 1);
    }
    function r(t) {
      return t
        .replace(/(.)([A-Z])/g, function (t, e, i) {
          return e + "-" + i;
        })
        .toLowerCase();
    }
    function o(i, o, c, d, f, m) {
      function g(t, i) {
        if (("string" == typeof t && (t = a.querySelector(t)), !t || !p(t)))
          return void (
            l && l.error("Bad " + this.constructor.namespace + " element: " + t)
          );
        (this.element = t),
          (this.options = e({}, this.constructor.defaults)),
          this.option(i);
        var n = ++v;
        (this.element.outlayerGUID = n),
          (_[n] = this),
          this._create(),
          this.options.isInitLayout && this.layout();
      }
      var v = 0,
        _ = {};
      return (
        (g.namespace = "outlayer"),
        (g.Item = m),
        (g.defaults = {
          containerStyle: { position: "relative" },
          isInitLayout: !0,
          isOriginLeft: !0,
          isOriginTop: !0,
          isResizeBound: !0,
          isResizingContainer: !0,
          transitionDuration: "0.4s",
          hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
          visibleStyle: { opacity: 1, transform: "scale(1)" },
        }),
        e(g.prototype, c.prototype),
        (g.prototype.option = function (t) {
          e(this.options, t);
        }),
        (g.prototype._create = function () {
          this.reloadItems(),
            (this.stamps = []),
            this.stamp(this.options.stamp),
            e(this.element.style, this.options.containerStyle),
            this.options.isResizeBound && this.bindResize();
        }),
        (g.prototype.reloadItems = function () {
          this.items = this._itemize(this.element.children);
        }),
        (g.prototype._itemize = function (t) {
          for (
            var e = this._filterFindItemElements(t),
              i = this.constructor.Item,
              n = [],
              s = 0,
              r = e.length;
            r > s;
            s++
          ) {
            var o = e[s],
              a = new i(o, this);
            n.push(a);
          }
          return n;
        }),
        (g.prototype._filterFindItemElements = function (t) {
          t = n(t);
          for (
            var e = this.options.itemSelector, i = [], s = 0, r = t.length;
            r > s;
            s++
          ) {
            var o = t[s];
            if (p(o))
              if (e) {
                f(o, e) && i.push(o);
                for (
                  var a = o.querySelectorAll(e), l = 0, h = a.length;
                  h > l;
                  l++
                )
                  i.push(a[l]);
              } else i.push(o);
          }
          return i;
        }),
        (g.prototype.getItemElements = function () {
          for (var t = [], e = 0, i = this.items.length; i > e; e++)
            t.push(this.items[e].element);
          return t;
        }),
        (g.prototype.layout = function () {
          this._resetLayout(), this._manageStamps();
          var t =
            void 0 !== this.options.isLayoutInstant
              ? this.options.isLayoutInstant
              : !this._isLayoutInited;
          this.layoutItems(this.items, t), (this._isLayoutInited = !0);
        }),
        (g.prototype._init = g.prototype.layout),
        (g.prototype._resetLayout = function () {
          this.getSize();
        }),
        (g.prototype.getSize = function () {
          this.size = d(this.element);
        }),
        (g.prototype._getMeasurement = function (t, e) {
          var i,
            n = this.options[t];
          n
            ? ("string" == typeof n
                ? (i = this.element.querySelector(n))
                : p(n) && (i = n),
              (this[t] = i ? d(i)[e] : n))
            : (this[t] = 0);
        }),
        (g.prototype.layoutItems = function (t, e) {
          (t = this._getItemsForLayout(t)),
            this._layoutItems(t, e),
            this._postLayout();
        }),
        (g.prototype._getItemsForLayout = function (t) {
          for (var e = [], i = 0, n = t.length; n > i; i++) {
            var s = t[i];
            s.isIgnored || e.push(s);
          }
          return e;
        }),
        (g.prototype._layoutItems = function (t, e) {
          function i() {
            n.emitEvent("layoutComplete", [n, t]);
          }
          var n = this;
          if (!t || !t.length) return void i();
          this._itemsOn(t, "layout", i);
          for (var s = [], r = 0, o = t.length; o > r; r++) {
            var a = t[r],
              l = this._getItemLayoutPosition(a);
            (l.item = a), (l.isInstant = e || a.isLayoutInstant), s.push(l);
          }
          this._processLayoutQueue(s);
        }),
        (g.prototype._getItemLayoutPosition = function () {
          return { x: 0, y: 0 };
        }),
        (g.prototype._processLayoutQueue = function (t) {
          for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            this._positionItem(n.item, n.x, n.y, n.isInstant);
          }
        }),
        (g.prototype._positionItem = function (t, e, i, n) {
          n ? t.goTo(e, i) : t.moveTo(e, i);
        }),
        (g.prototype._postLayout = function () {
          this.resizeContainer();
        }),
        (g.prototype.resizeContainer = function () {
          if (this.options.isResizingContainer) {
            var t = this._getContainerSize();
            t &&
              (this._setContainerMeasure(t.width, !0),
              this._setContainerMeasure(t.height, !1));
          }
        }),
        (g.prototype._getContainerSize = u),
        (g.prototype._setContainerMeasure = function (t, e) {
          if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox &&
              (t += e
                ? i.paddingLeft +
                  i.paddingRight +
                  i.borderLeftWidth +
                  i.borderRightWidth
                : i.paddingBottom +
                  i.paddingTop +
                  i.borderTopWidth +
                  i.borderBottomWidth),
              (t = Math.max(t, 0)),
              (this.element.style[e ? "width" : "height"] = t + "px");
          }
        }),
        (g.prototype._itemsOn = function (t, e, i) {
          function n() {
            return s++, s === r && i.call(o), !0;
          }
          for (
            var s = 0, r = t.length, o = this, a = 0, l = t.length;
            l > a;
            a++
          ) {
            var h = t[a];
            h.on(e, n);
          }
        }),
        (g.prototype.ignore = function (t) {
          var e = this.getItem(t);
          e && (e.isIgnored = !0);
        }),
        (g.prototype.unignore = function (t) {
          var e = this.getItem(t);
          e && delete e.isIgnored;
        }),
        (g.prototype.stamp = function (t) {
          if ((t = this._find(t))) {
            this.stamps = this.stamps.concat(t);
            for (var e = 0, i = t.length; i > e; e++) {
              var n = t[e];
              this.ignore(n);
            }
          }
        }),
        (g.prototype.unstamp = function (t) {
          if ((t = this._find(t)))
            for (var e = 0, i = t.length; i > e; e++) {
              var n = t[e];
              s(n, this.stamps), this.unignore(n);
            }
        }),
        (g.prototype._find = function (t) {
          return t
            ? ("string" == typeof t && (t = this.element.querySelectorAll(t)),
              (t = n(t)))
            : void 0;
        }),
        (g.prototype._manageStamps = function () {
          if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            for (var t = 0, e = this.stamps.length; e > t; t++) {
              var i = this.stamps[t];
              this._manageStamp(i);
            }
          }
        }),
        (g.prototype._getBoundingRect = function () {
          var t = this.element.getBoundingClientRect(),
            e = this.size;
          this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
          };
        }),
        (g.prototype._manageStamp = u),
        (g.prototype._getElementOffset = function (t) {
          var e = t.getBoundingClientRect(),
            i = this._boundingRect,
            n = d(t),
            s = {
              left: e.left - i.left - n.marginLeft,
              top: e.top - i.top - n.marginTop,
              right: i.right - e.right - n.marginRight,
              bottom: i.bottom - e.bottom - n.marginBottom,
            };
          return s;
        }),
        (g.prototype.handleEvent = function (t) {
          var e = "on" + t.type;
          this[e] && this[e](t);
        }),
        (g.prototype.bindResize = function () {
          this.isResizeBound ||
            (i.bind(t, "resize", this), (this.isResizeBound = !0));
        }),
        (g.prototype.unbindResize = function () {
          this.isResizeBound && i.unbind(t, "resize", this),
            (this.isResizeBound = !1);
        }),
        (g.prototype.onresize = function () {
          function t() {
            e.resize(), delete e.resizeTimeout;
          }
          this.resizeTimeout && clearTimeout(this.resizeTimeout);
          var e = this;
          this.resizeTimeout = setTimeout(t, 100);
        }),
        (g.prototype.resize = function () {
          this.isResizeBound && this.needsResizeLayout() && this.layout();
        }),
        (g.prototype.needsResizeLayout = function () {
          var t = d(this.element),
            e = this.size && t;
          return e && t.innerWidth !== this.size.innerWidth;
        }),
        (g.prototype.addItems = function (t) {
          var e = this._itemize(t);
          return e.length && (this.items = this.items.concat(e)), e;
        }),
        (g.prototype.appended = function (t) {
          var e = this.addItems(t);
          e.length && (this.layoutItems(e, !0), this.reveal(e));
        }),
        (g.prototype.prepended = function (t) {
          var e = this._itemize(t);
          if (e.length) {
            var i = this.items.slice(0);
            (this.items = e.concat(i)),
              this._resetLayout(),
              this._manageStamps(),
              this.layoutItems(e, !0),
              this.reveal(e),
              this.layoutItems(i);
          }
        }),
        (g.prototype.reveal = function (t) {
          var e = t && t.length;
          if (e)
            for (var i = 0; e > i; i++) {
              var n = t[i];
              n.reveal();
            }
        }),
        (g.prototype.hide = function (t) {
          var e = t && t.length;
          if (e)
            for (var i = 0; e > i; i++) {
              var n = t[i];
              n.hide();
            }
        }),
        (g.prototype.getItem = function (t) {
          for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            if (n.element === t) return n;
          }
        }),
        (g.prototype.getItems = function (t) {
          if (t && t.length) {
            for (var e = [], i = 0, n = t.length; n > i; i++) {
              var s = t[i],
                r = this.getItem(s);
              r && e.push(r);
            }
            return e;
          }
        }),
        (g.prototype.remove = function (t) {
          t = n(t);
          var e = this.getItems(t);
          if (e && e.length) {
            this._itemsOn(e, "remove", function () {
              this.emitEvent("removeComplete", [this, e]);
            });
            for (var i = 0, r = e.length; r > i; i++) {
              var o = e[i];
              o.remove(), s(o, this.items);
            }
          }
        }),
        (g.prototype.destroy = function () {
          var t = this.element.style;
          (t.height = ""), (t.position = ""), (t.width = "");
          for (var e = 0, i = this.items.length; i > e; e++) {
            var n = this.items[e];
            n.destroy();
          }
          this.unbindResize(),
            delete this.element.outlayerGUID,
            h && h.removeData(this.element, this.constructor.namespace);
        }),
        (g.data = function (t) {
          var e = t && t.outlayerGUID;
          return e && _[e];
        }),
        (g.create = function (t, i) {
          function n() {
            g.apply(this, arguments);
          }
          return (
            Object.create
              ? (n.prototype = Object.create(g.prototype))
              : e(n.prototype, g.prototype),
            (n.prototype.constructor = n),
            (n.defaults = e({}, g.defaults)),
            e(n.defaults, i),
            (n.prototype.settings = {}),
            (n.namespace = t),
            (n.data = g.data),
            (n.Item = function () {
              m.apply(this, arguments);
            }),
            (n.Item.prototype = new m()),
            o(function () {
              for (
                var e = r(t),
                  i = a.querySelectorAll(".js-" + e),
                  s = "data-" + e + "-options",
                  o = 0,
                  u = i.length;
                u > o;
                o++
              ) {
                var c,
                  p = i[o],
                  d = p.getAttribute(s);
                try {
                  c = d && JSON.parse(d);
                } catch (f) {
                  l &&
                    l.error(
                      "Error parsing " +
                        s +
                        " on " +
                        p.nodeName.toLowerCase() +
                        (p.id ? "#" + p.id : "") +
                        ": " +
                        f
                    );
                  continue;
                }
                var m = new n(p, c);
                h && h.data(p, t, m);
              }
            }),
            h && h.bridget && h.bridget(t, n),
            n
          );
        }),
        (g.Item = m),
        g
      );
    }
    var a = t.document,
      l = t.console,
      h = t.jQuery,
      u = function () {},
      c = Object.prototype.toString,
      p =
        "object" == typeof HTMLElement
          ? function (t) {
              return t instanceof HTMLElement;
            }
          : function (t) {
              return (
                t &&
                "object" == typeof t &&
                1 === t.nodeType &&
                "string" == typeof t.nodeName
              );
            },
      d = Array.prototype.indexOf
        ? function (t, e) {
            return t.indexOf(e);
          }
        : function (t, e) {
            for (var i = 0, n = t.length; n > i; i++) if (t[i] === e) return i;
            return -1;
          };
    "function" == typeof define && define.amd
      ? define(
          "outlayer/outlayer",
          [
            "eventie/eventie",
            "doc-ready/doc-ready",
            "eventEmitter/EventEmitter",
            "get-size/get-size",
            "matches-selector/matches-selector",
            "./item",
          ],
          o
        )
      : (t.Outlayer = o(
          t.eventie,
          t.docReady,
          t.EventEmitter,
          t.getSize,
          t.matchesSelector,
          t.Outlayer.Item
        ));
  })(window),
  (function (t) {
    function e(t) {
      function e() {
        t.Item.apply(this, arguments);
      }
      (e.prototype = new t.Item()),
        (e.prototype._create = function () {
          (this.id = this.layout.itemGUID++),
            t.Item.prototype._create.call(this),
            (this.sortData = {});
        }),
        (e.prototype.updateSortData = function () {
          if (!this.isIgnored) {
            (this.sortData.id = this.id),
              (this.sortData["original-order"] = this.id),
              (this.sortData.random = Math.random());
            var t = this.layout.options.getSortData,
              e = this.layout._sorters;
            for (var i in t) {
              var n = e[i];
              this.sortData[i] = n(this.element, this);
            }
          }
        });
      var i = e.prototype.destroy;
      return (
        (e.prototype.destroy = function () {
          i.apply(this, arguments), this.css({ display: "" });
        }),
        e
      );
    }
    "function" == typeof define && define.amd
      ? define("isotope/js/item", ["outlayer/outlayer"], e)
      : ((t.Isotope = t.Isotope || {}), (t.Isotope.Item = e(t.Outlayer)));
  })(window),
  (function (t) {
    function e(t, e) {
      function i(t) {
        (this.isotope = t),
          t &&
            ((this.options = t.options[this.namespace]),
            (this.element = t.element),
            (this.items = t.filteredItems),
            (this.size = t.size));
      }
      return (
        (function () {
          function t(t) {
            return function () {
              return e.prototype[t].apply(this.isotope, arguments);
            };
          }
          for (
            var n = [
                "_resetLayout",
                "_getItemLayoutPosition",
                "_manageStamp",
                "_getContainerSize",
                "_getElementOffset",
                "needsResizeLayout",
              ],
              s = 0,
              r = n.length;
            r > s;
            s++
          ) {
            var o = n[s];
            i.prototype[o] = t(o);
          }
        })(),
        (i.prototype.needsVerticalResizeLayout = function () {
          var e = t(this.isotope.element),
            i = this.isotope.size && e;
          return i && e.innerHeight !== this.isotope.size.innerHeight;
        }),
        (i.prototype._getMeasurement = function () {
          this.isotope._getMeasurement.apply(this, arguments);
        }),
        (i.prototype.getColumnWidth = function () {
          this.getSegmentSize("column", "Width");
        }),
        (i.prototype.getRowHeight = function () {
          this.getSegmentSize("row", "Height");
        }),
        (i.prototype.getSegmentSize = function (t, e) {
          var i = t + e,
            n = "outer" + e;
          if ((this._getMeasurement(i, n), !this[i])) {
            var s = this.getFirstItemSize();
            this[i] = (s && s[n]) || this.isotope.size["inner" + e];
          }
        }),
        (i.prototype.getFirstItemSize = function () {
          var e = this.isotope.filteredItems[0];
          return e && e.element && t(e.element);
        }),
        (i.prototype.layout = function () {
          this.isotope.layout.apply(this.isotope, arguments);
        }),
        (i.prototype.getSize = function () {
          this.isotope.getSize(), (this.size = this.isotope.size);
        }),
        (i.modes = {}),
        (i.create = function (t, e) {
          function n() {
            i.apply(this, arguments);
          }
          return (
            (n.prototype = new i()),
            e && (n.options = e),
            (n.prototype.namespace = t),
            (i.modes[t] = n),
            n
          );
        }),
        i
      );
    }
    "function" == typeof define && define.amd
      ? define(
          "isotope/js/layout-mode",
          ["get-size/get-size", "outlayer/outlayer"],
          e
        )
      : ((t.Isotope = t.Isotope || {}),
        (t.Isotope.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window),
  (function (t) {
    function e(t, e) {
      var n = t.create("masonry");
      return (
        (n.prototype._resetLayout = function () {
          this.getSize(),
            this._getMeasurement("columnWidth", "outerWidth"),
            this._getMeasurement("gutter", "outerWidth"),
            this.measureColumns();
          var t = this.cols;
          for (this.colYs = []; t--; ) this.colYs.push(0);
          this.maxY = 0;
        }),
        (n.prototype.measureColumns = function () {
          if ((this.getContainerWidth(), !this.columnWidth)) {
            var t = this.items[0],
              i = t && t.element;
            this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
          }
          (this.columnWidth += this.gutter),
            (this.cols = Math.floor(
              (this.containerWidth + this.gutter) / this.columnWidth
            )),
            (this.cols = Math.max(this.cols, 1));
        }),
        (n.prototype.getContainerWidth = function () {
          var t = this.options.isFitWidth
              ? this.element.parentNode
              : this.element,
            i = e(t);
          this.containerWidth = i && i.innerWidth;
        }),
        (n.prototype._getItemLayoutPosition = function (t) {
          t.getSize();
          var e = t.size.outerWidth % this.columnWidth,
            n = e && 1 > e ? "round" : "ceil",
            s = Math[n](t.size.outerWidth / this.columnWidth);
          s = Math.min(s, this.cols);
          for (
            var r = this._getColGroup(s),
              o = Math.min.apply(Math, r),
              a = i(r, o),
              l = { x: this.columnWidth * a, y: o },
              h = o + t.size.outerHeight,
              u = this.cols + 1 - r.length,
              c = 0;
            u > c;
            c++
          )
            this.colYs[a + c] = h;
          return l;
        }),
        (n.prototype._getColGroup = function (t) {
          if (2 > t) return this.colYs;
          for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
            var s = this.colYs.slice(n, n + t);
            e[n] = Math.max.apply(Math, s);
          }
          return e;
        }),
        (n.prototype._manageStamp = function (t) {
          var i = e(t),
            n = this._getElementOffset(t),
            s = this.options.isOriginLeft ? n.left : n.right,
            r = s + i.outerWidth,
            o = Math.floor(s / this.columnWidth);
          o = Math.max(0, o);
          var a = Math.floor(r / this.columnWidth);
          (a -= r % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
          for (
            var l =
                (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight,
              h = o;
            a >= h;
            h++
          )
            this.colYs[h] = Math.max(l, this.colYs[h]);
        }),
        (n.prototype._getContainerSize = function () {
          this.maxY = Math.max.apply(Math, this.colYs);
          var t = { height: this.maxY };
          return (
            this.options.isFitWidth && (t.width = this._getContainerFitWidth()),
            t
          );
        }),
        (n.prototype._getContainerFitWidth = function () {
          for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
          return (this.cols - t) * this.columnWidth - this.gutter;
        }),
        (n.prototype.needsResizeLayout = function () {
          var t = this.containerWidth;
          return this.getContainerWidth(), t !== this.containerWidth;
        }),
        n
      );
    }
    var i = Array.prototype.indexOf
      ? function (t, e) {
          return t.indexOf(e);
        }
      : function (t, e) {
          for (var i = 0, n = t.length; n > i; i++) {
            var s = t[i];
            if (s === e) return i;
          }
          return -1;
        };
    "function" == typeof define && define.amd
      ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], e)
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window),
  (function (t) {
    function e(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function i(t, i) {
      var n = t.create("masonry"),
        s = n.prototype._getElementOffset,
        r = n.prototype.layout,
        o = n.prototype._getMeasurement;
      e(n.prototype, i.prototype),
        (n.prototype._getElementOffset = s),
        (n.prototype.layout = r),
        (n.prototype._getMeasurement = o);
      var a = n.prototype.measureColumns;
      n.prototype.measureColumns = function () {
        (this.items = this.isotope.filteredItems), a.call(this);
      };
      var l = n.prototype._manageStamp;
      return (
        (n.prototype._manageStamp = function () {
          (this.options.isOriginLeft = this.isotope.options.isOriginLeft),
            (this.options.isOriginTop = this.isotope.options.isOriginTop),
            l.apply(this, arguments);
        }),
        n
      );
    }
    "function" == typeof define && define.amd
      ? define(
          "isotope/js/layout-modes/masonry",
          ["../layout-mode", "masonry/masonry"],
          i
        )
      : i(t.Isotope.LayoutMode, t.Masonry);
  })(window),
  (function (t) {
    function e(t) {
      var e = t.create("fitRows");
      return (
        (e.prototype._resetLayout = function () {
          (this.x = 0), (this.y = 0), (this.maxY = 0);
        }),
        (e.prototype._getItemLayoutPosition = function (t) {
          t.getSize(),
            0 !== this.x &&
              t.size.outerWidth + this.x > this.isotope.size.innerWidth &&
              ((this.x = 0), (this.y = this.maxY));
          var e = { x: this.x, y: this.y };
          return (
            (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
            (this.x += t.size.outerWidth),
            e
          );
        }),
        (e.prototype._getContainerSize = function () {
          return { height: this.maxY };
        }),
        e
      );
    }
    "function" == typeof define && define.amd
      ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], e)
      : e(t.Isotope.LayoutMode);
  })(window),
  (function (t) {
    function e(t) {
      var e = t.create("vertical", { horizontalAlignment: 0 });
      return (
        (e.prototype._resetLayout = function () {
          this.y = 0;
        }),
        (e.prototype._getItemLayoutPosition = function (t) {
          t.getSize();
          var e =
              (this.isotope.size.innerWidth - t.size.outerWidth) *
              this.options.horizontalAlignment,
            i = this.y;
          return (this.y += t.size.outerHeight), { x: e, y: i };
        }),
        (e.prototype._getContainerSize = function () {
          return { height: this.y };
        }),
        e
      );
    }
    "function" == typeof define && define.amd
      ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], e)
      : e(t.Isotope.LayoutMode);
  })(window),
  (function (t) {
    function e(t, e) {
      for (var i in e) t[i] = e[i];
      return t;
    }
    function i(t) {
      return "[object Array]" === u.call(t);
    }
    function n(t) {
      var e = [];
      if (i(t)) e = t;
      else if (t && "number" == typeof t.length)
        for (var n = 0, s = t.length; s > n; n++) e.push(t[n]);
      else e.push(t);
      return e;
    }
    function s(t, e) {
      var i = c(e, t);
      -1 !== i && e.splice(i, 1);
    }
    function r(t, i, r, l, u) {
      function c(t, e) {
        return function (i, n) {
          for (var s = 0, r = t.length; r > s; s++) {
            var o = t[s],
              a = i.sortData[o],
              l = n.sortData[o];
            if (a > l || l > a) {
              var h = void 0 !== e[o] ? e[o] : e,
                u = h ? 1 : -1;
              return (a > l ? 1 : -1) * u;
            }
          }
          return 0;
        };
      }
      var p = t.create("isotope", {
        layoutMode: "masonry",
        isJQueryFiltering: !0,
        sortAscending: !0,
      });
      (p.Item = l),
        (p.LayoutMode = u),
        (p.prototype._create = function () {
          (this.itemGUID = 0),
            (this._sorters = {}),
            this._getSorters(),
            t.prototype._create.call(this),
            (this.modes = {}),
            (this.filteredItems = this.items),
            (this.sortHistory = ["original-order"]);
          for (var e in u.modes) this._initLayoutMode(e);
        }),
        (p.prototype.reloadItems = function () {
          (this.itemGUID = 0), t.prototype.reloadItems.call(this);
        }),
        (p.prototype._itemize = function () {
          for (
            var e = t.prototype._itemize.apply(this, arguments),
              i = 0,
              n = e.length;
            n > i;
            i++
          ) {
            var s = e[i];
            s.id = this.itemGUID++;
          }
          return this._updateItemsSortData(e), e;
        }),
        (p.prototype._initLayoutMode = function (t) {
          var i = u.modes[t],
            n = this.options[t] || {};
          (this.options[t] = i.options ? e(i.options, n) : n),
            (this.modes[t] = new i(this));
        }),
        (p.prototype.layout = function () {
          return !this._isLayoutInited && this.options.isInitLayout
            ? void this.arrange()
            : void this._layout();
        }),
        (p.prototype._layout = function () {
          var t = this._getIsInstant();
          this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(this.filteredItems, t),
            (this._isLayoutInited = !0);
        }),
        (p.prototype.arrange = function (t) {
          this.option(t),
            this._getIsInstant(),
            (this.filteredItems = this._filter(this.items)),
            this._sort(),
            this._layout();
        }),
        (p.prototype._init = p.prototype.arrange),
        (p.prototype._getIsInstant = function () {
          var t =
            void 0 !== this.options.isLayoutInstant
              ? this.options.isLayoutInstant
              : !this._isLayoutInited;
          return (this._isInstant = t), t;
        }),
        (p.prototype._filter = function (t) {
          function e() {
            c.reveal(s), c.hide(r);
          }
          var i = this.options.filter;
          i = i || "*";
          for (
            var n = [],
              s = [],
              r = [],
              o = this._getFilterTest(i),
              a = 0,
              l = t.length;
            l > a;
            a++
          ) {
            var h = t[a];
            if (!h.isIgnored) {
              var u = o(h);
              u && n.push(h),
                u && h.isHidden ? s.push(h) : u || h.isHidden || r.push(h);
            }
          }
          var c = this;
          return this._isInstant ? this._noTransition(e) : e(), n;
        }),
        (p.prototype._getFilterTest = function (t) {
          return o && this.options.isJQueryFiltering
            ? function (e) {
                return o(e.element).is(t);
              }
            : "function" == typeof t
            ? function (e) {
                return t(e.element);
              }
            : function (e) {
                return r(e.element, t);
              };
        }),
        (p.prototype.updateSortData = function (t) {
          this._getSorters(), (t = n(t));
          var e = this.getItems(t);
          (e = e.length ? e : this.items), this._updateItemsSortData(e);
        }),
        (p.prototype._getSorters = function () {
          var t = this.options.getSortData;
          for (var e in t) {
            var i = t[e];
            this._sorters[e] = d(i);
          }
        }),
        (p.prototype._updateItemsSortData = function (t) {
          for (var e = 0, i = t.length; i > e; e++) {
            var n = t[e];
            n.updateSortData();
          }
        });
      var d = (function () {
        function t(t) {
          if ("string" != typeof t) return t;
          var i = a(t).split(" "),
            n = i[0],
            s = n.match(/^\[(.+)\]$/),
            r = s && s[1],
            o = e(r, n),
            l = p.sortDataParsers[i[1]];
          return (t = l
            ? function (t) {
                return t && l(o(t));
              }
            : function (t) {
                return t && o(t);
              });
        }
        function e(t, e) {
          var i;
          return (i = t
            ? function (e) {
                return e.getAttribute(t);
              }
            : function (t) {
                var i = t.querySelector(e);
                return i && h(i);
              });
        }
        return t;
      })();
      (p.sortDataParsers = {
        parseInt: function (t) {
          return parseInt(t, 10);
        },
        parseFloat: function (t) {
          return parseFloat(t);
        },
      }),
        (p.prototype._sort = function () {
          var t = this.options.sortBy;
          if (t) {
            var e = [].concat.apply(t, this.sortHistory),
              i = c(e, this.options.sortAscending);
            this.filteredItems.sort(i),
              t !== this.sortHistory[0] && this.sortHistory.unshift(t);
          }
        }),
        (p.prototype._mode = function () {
          var t = this.options.layoutMode,
            e = this.modes[t];
          if (!e) throw Error("No layout mode: " + t);
          return (e.options = this.options[t]), e;
        }),
        (p.prototype._resetLayout = function () {
          t.prototype._resetLayout.call(this), this._mode()._resetLayout();
        }),
        (p.prototype._getItemLayoutPosition = function (t) {
          return this._mode()._getItemLayoutPosition(t);
        }),
        (p.prototype._manageStamp = function (t) {
          this._mode()._manageStamp(t);
        }),
        (p.prototype._getContainerSize = function () {
          return this._mode()._getContainerSize();
        }),
        (p.prototype.needsResizeLayout = function () {
          return this._mode().needsResizeLayout();
        }),
        (p.prototype.appended = function (t) {
          var e = this.addItems(t);
          if (e.length) {
            var i = this._filterRevealAdded(e);
            this.filteredItems = this.filteredItems.concat(i);
          }
        }),
        (p.prototype.prepended = function (t) {
          var e = this._itemize(t);
          if (e.length) {
            var i = this.items.slice(0);
            (this.items = e.concat(i)),
              this._resetLayout(),
              this._manageStamps();
            var n = this._filterRevealAdded(e);
            this.layoutItems(i),
              (this.filteredItems = n.concat(this.filteredItems));
          }
        }),
        (p.prototype._filterRevealAdded = function (t) {
          var e = this._noTransition(function () {
            return this._filter(t);
          });
          return this.layoutItems(e, !0), this.reveal(e), t;
        }),
        (p.prototype.insert = function (t) {
          var e = this.addItems(t);
          if (e.length) {
            var i,
              n,
              s = e.length;
            for (i = 0; s > i; i++)
              (n = e[i]), this.element.appendChild(n.element);
            var r = this._filter(e);
            for (
              this._noTransition(function () {
                this.hide(r);
              }),
                i = 0;
              s > i;
              i++
            )
              e[i].isLayoutInstant = !0;
            for (this.arrange(), i = 0; s > i; i++) delete e[i].isLayoutInstant;
            this.reveal(r);
          }
        });
      var f = p.prototype.remove;
      return (
        (p.prototype.remove = function (t) {
          t = n(t);
          var e = this.getItems(t);
          if ((f.call(this, t), e && e.length))
            for (var i = 0, r = e.length; r > i; i++) {
              var o = e[i];
              s(o, this.filteredItems);
            }
        }),
        (p.prototype.shuffle = function () {
          for (var t = 0, e = this.items.length; e > t; t++) {
            var i = this.items[t];
            i.sortData.random = Math.random();
          }
          (this.options.sortBy = "random"), this._sort(), this._layout();
        }),
        (p.prototype._noTransition = function (t) {
          var e = this.options.transitionDuration;
          this.options.transitionDuration = 0;
          var i = t.call(this);
          return (this.options.transitionDuration = e), i;
        }),
        (p.prototype.getFilteredItemElements = function () {
          for (var t = [], e = 0, i = this.filteredItems.length; i > e; e++)
            t.push(this.filteredItems[e].element);
          return t;
        }),
        p
      );
    }
    var o = t.jQuery,
      a = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, "");
          },
      l = document.documentElement,
      h = l.textContent
        ? function (t) {
            return t.textContent;
          }
        : function (t) {
            return t.innerText;
          },
      u = Object.prototype.toString,
      c = Array.prototype.indexOf
        ? function (t, e) {
            return t.indexOf(e);
          }
        : function (t, e) {
            for (var i = 0, n = t.length; n > i; i++) if (t[i] === e) return i;
            return -1;
          };
    "function" == typeof define && define.amd
      ? define(
          [
            "outlayer/outlayer",
            "get-size/get-size",
            "matches-selector/matches-selector",
            "isotope/js/item",
            "isotope/js/layout-mode",
            "isotope/js/layout-modes/masonry",
            "isotope/js/layout-modes/fit-rows",
            "isotope/js/layout-modes/vertical",
          ],
          r
        )
      : (t.Isotope = r(
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.Isotope.Item,
          t.Isotope.LayoutMode
        ));
  })(window);
var coverVid = function (t, e, i) {
  function n(t, e) {
    var i = null;
    return function () {
      var n = this,
        s = arguments;
      window.clearTimeout(i),
        (i = window.setTimeout(function () {
          t.apply(n, s);
        }, e));
    };
  }
  function s() {
    var n = t.parentNode.offsetHeight,
      s = t.parentNode.offsetWidth,
      r = e,
      o = i,
      a = n / o,
      l = s / r;
    l > a
      ? ((t.style.height = "auto"), (t.style.width = s + "px"))
      : ((t.style.height = n + "px"), (t.style.width = "auto"));
  }
  document.addEventListener("DOMContentLoaded", s),
    (window.onresize = function () {
      n(s(), 50);
    }),
    (t.style.position = "absolute"),
    (t.style.top = "50%"),
    (t.style.left = "50%"),
    (t.style["-webkit-transform"] = "translate(-50%, -50%)"),
    (t.style["-ms-transform"] = "translate(-50%, -50%)"),
    (t.style.transform = "translate(-50%, -50%)"),
    (t.parentNode.style.overflow = "hidden");
};
window.jQuery &&
  jQuery.fn.extend({
    coverVid: function () {
      return coverVid(this[0], arguments[0], arguments[1]), this;
    },
  }),
  (window._gsQueue || (window._gsQueue = [])).push(function () {
    "use strict";
    window._gsDefine(
      "TweenMax",
      ["core.Animation", "core.SimpleTimeline", "TweenLite"],
      function (t, e, i) {
        var n = [].slice,
          s = function (t, e, n) {
            i.call(this, t, e, n),
              (this._cycle = 0),
              (this._yoyo = this.vars.yoyo === !0),
              (this._repeat = this.vars.repeat || 0),
              (this._repeatDelay = this.vars.repeatDelay || 0),
              (this._dirty = !0),
              (this.render = s.prototype.render);
          },
          r = 1e-10,
          o = i._internals.isSelector,
          a = i._internals.isArray,
          l = (s.prototype = i.to({}, 0.1, {})),
          h = [];
        (s.version = "1.11.1"),
          (l.constructor = s),
          (l.kill()._gc = !1),
          (s.killTweensOf = s.killDelayedCallsTo = i.killTweensOf),
          (s.getTweensOf = i.getTweensOf),
          (s.ticker = i.ticker),
          (l.invalidate = function () {
            return (
              (this._yoyo = this.vars.yoyo === !0),
              (this._repeat = this.vars.repeat || 0),
              (this._repeatDelay = this.vars.repeatDelay || 0),
              this._uncache(!0),
              i.prototype.invalidate.call(this)
            );
          }),
          (l.updateTo = function (t, e) {
            var n,
              s = this.ratio;
            e &&
              this.timeline &&
              this._startTime < this._timeline._time &&
              ((this._startTime = this._timeline._time),
              this._uncache(!1),
              this._gc
                ? this._enabled(!0, !1)
                : this._timeline.insert(this, this._startTime - this._delay));
            for (n in t) this.vars[n] = t[n];
            if (this._initted)
              if (e) this._initted = !1;
              else if (
                (this._notifyPluginsOfEnabled &&
                  this._firstPT &&
                  i._onPluginEvent("_onDisable", this),
                this._time / this._duration > 0.998)
              ) {
                var r = this._time;
                this.render(0, !0, !1),
                  (this._initted = !1),
                  this.render(r, !0, !1);
              } else if (this._time > 0) {
                (this._initted = !1), this._init();
                for (var o, a = 1 / (1 - s), l = this._firstPT; l; )
                  (o = l.s + l.c), (l.c *= a), (l.s = o - l.c), (l = l._next);
              }
            return this;
          }),
          (l.render = function (t, e, i) {
            this._initted ||
              (0 === this._duration && this.vars.repeat && this.invalidate());
            var n,
              s,
              o,
              a,
              l,
              u,
              c,
              p,
              d = this._dirty ? this.totalDuration() : this._totalDuration,
              f = this._time,
              m = this._totalTime,
              g = this._cycle,
              v = this._duration;
            if (
              (t >= d
                ? ((this._totalTime = d),
                  (this._cycle = this._repeat),
                  this._yoyo && 0 !== (1 & this._cycle)
                    ? ((this._time = 0),
                      (this.ratio = this._ease._calcEnd
                        ? this._ease.getRatio(0)
                        : 0))
                    : ((this._time = v),
                      (this.ratio = this._ease._calcEnd
                        ? this._ease.getRatio(1)
                        : 1)),
                  this._reversed || ((n = !0), (s = "onComplete")),
                  0 === v &&
                    ((p = this._rawPrevTime),
                    (0 === t || 0 > p || p === r) &&
                      p !== t &&
                      ((i = !0), p > r && (s = "onReverseComplete")),
                    (this._rawPrevTime = p = !e || t ? t : r)))
                : 1e-7 > t
                ? ((this._totalTime = this._time = this._cycle = 0),
                  (this.ratio = this._ease._calcEnd
                    ? this._ease.getRatio(0)
                    : 0),
                  (0 !== m || (0 === v && this._rawPrevTime > r)) &&
                    ((s = "onReverseComplete"), (n = this._reversed)),
                  0 > t
                    ? ((this._active = !1),
                      0 === v &&
                        (this._rawPrevTime >= 0 && (i = !0),
                        (this._rawPrevTime = p = !e || t ? t : r)))
                    : this._initted || (i = !0))
                : ((this._totalTime = this._time = t),
                  0 !== this._repeat &&
                    ((a = v + this._repeatDelay),
                    (this._cycle = (this._totalTime / a) >> 0),
                    0 !== this._cycle &&
                      this._cycle === this._totalTime / a &&
                      this._cycle--,
                    (this._time = this._totalTime - this._cycle * a),
                    this._yoyo &&
                      0 !== (1 & this._cycle) &&
                      (this._time = v - this._time),
                    this._time > v
                      ? (this._time = v)
                      : 0 > this._time && (this._time = 0)),
                  this._easeType
                    ? ((l = this._time / v),
                      (u = this._easeType),
                      (c = this._easePower),
                      (1 === u || (3 === u && l >= 0.5)) && (l = 1 - l),
                      3 === u && (l *= 2),
                      1 === c
                        ? (l *= l)
                        : 2 === c
                        ? (l *= l * l)
                        : 3 === c
                        ? (l *= l * l * l)
                        : 4 === c && (l *= l * l * l * l),
                      (this.ratio =
                        1 === u
                          ? 1 - l
                          : 2 === u
                          ? l
                          : 0.5 > this._time / v
                          ? l / 2
                          : 1 - l / 2))
                    : (this.ratio = this._ease.getRatio(this._time / v))),
              f === this._time && !i && g === this._cycle)
            )
              return void (
                m !== this._totalTime &&
                this._onUpdate &&
                (e ||
                  this._onUpdate.apply(
                    this.vars.onUpdateScope || this,
                    this.vars.onUpdateParams || h
                  ))
              );
            if (!this._initted) {
              if ((this._init(), !this._initted || this._gc)) return;
              this._time && !n
                ? (this.ratio = this._ease.getRatio(this._time / v))
                : n &&
                  this._ease._calcEnd &&
                  (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
            }
            for (
              this._active ||
                (!this._paused &&
                  this._time !== f &&
                  t >= 0 &&
                  (this._active = !0)),
                0 === m &&
                  (this._startAt &&
                    (t >= 0
                      ? this._startAt.render(t, e, i)
                      : s || (s = "_dummyGS")),
                  this.vars.onStart &&
                    (0 !== this._totalTime || 0 === v) &&
                    (e ||
                      this.vars.onStart.apply(
                        this.vars.onStartScope || this,
                        this.vars.onStartParams || h
                      ))),
                o = this._firstPT;
              o;

            )
              o.f
                ? o.t[o.p](o.c * this.ratio + o.s)
                : (o.t[o.p] = o.c * this.ratio + o.s),
                (o = o._next);
            this._onUpdate &&
              (0 > t &&
                this._startAt &&
                this._startTime &&
                this._startAt.render(t, e, i),
              e ||
                this._onUpdate.apply(
                  this.vars.onUpdateScope || this,
                  this.vars.onUpdateParams || h
                )),
              this._cycle !== g &&
                (e ||
                  this._gc ||
                  (this.vars.onRepeat &&
                    this.vars.onRepeat.apply(
                      this.vars.onRepeatScope || this,
                      this.vars.onRepeatParams || h
                    ))),
              s &&
                (this._gc ||
                  (0 > t &&
                    this._startAt &&
                    !this._onUpdate &&
                    this._startTime &&
                    this._startAt.render(t, e, i),
                  n &&
                    (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                    (this._active = !1)),
                  !e &&
                    this.vars[s] &&
                    this.vars[s].apply(
                      this.vars[s + "Scope"] || this,
                      this.vars[s + "Params"] || h
                    ),
                  0 === v &&
                    this._rawPrevTime === r &&
                    p !== r &&
                    (this._rawPrevTime = 0)));
          }),
          (s.to = function (t, e, i) {
            return new s(t, e, i);
          }),
          (s.from = function (t, e, i) {
            return (
              (i.runBackwards = !0),
              (i.immediateRender = 0 != i.immediateRender),
              new s(t, e, i)
            );
          }),
          (s.fromTo = function (t, e, i, n) {
            return (
              (n.startAt = i),
              (n.immediateRender =
                0 != n.immediateRender && 0 != i.immediateRender),
              new s(t, e, n)
            );
          }),
          (s.staggerTo = s.allTo =
            function (t, e, r, l, u, c, p) {
              l = l || 0;
              var d,
                f,
                m,
                g,
                v = r.delay || 0,
                _ = [],
                y = function () {
                  r.onComplete &&
                    r.onComplete.apply(r.onCompleteScope || this, arguments),
                    u.apply(p || this, c || h);
                };
              for (
                a(t) ||
                  ("string" == typeof t && (t = i.selector(t) || t),
                  o(t) && (t = n.call(t, 0))),
                  d = t.length,
                  m = 0;
                d > m;
                m++
              ) {
                f = {};
                for (g in r) f[g] = r[g];
                (f.delay = v),
                  m === d - 1 && u && (f.onComplete = y),
                  (_[m] = new s(t[m], e, f)),
                  (v += l);
              }
              return _;
            }),
          (s.staggerFrom = s.allFrom =
            function (t, e, i, n, r, o, a) {
              return (
                (i.runBackwards = !0),
                (i.immediateRender = 0 != i.immediateRender),
                s.staggerTo(t, e, i, n, r, o, a)
              );
            }),
          (s.staggerFromTo = s.allFromTo =
            function (t, e, i, n, r, o, a, l) {
              return (
                (n.startAt = i),
                (n.immediateRender =
                  0 != n.immediateRender && 0 != i.immediateRender),
                s.staggerTo(t, e, n, r, o, a, l)
              );
            }),
          (s.delayedCall = function (t, e, i, n, r) {
            return new s(e, 0, {
              delay: t,
              onComplete: e,
              onCompleteParams: i,
              onCompleteScope: n,
              onReverseComplete: e,
              onReverseCompleteParams: i,
              onReverseCompleteScope: n,
              immediateRender: !1,
              useFrames: r,
              overwrite: 0,
            });
          }),
          (s.set = function (t, e) {
            return new s(t, 0, e);
          }),
          (s.isTweening = function (t) {
            return i.getTweensOf(t, !0).length > 0;
          });
        var u = function (t, e) {
            for (var n = [], s = 0, r = t._first; r; )
              r instanceof i
                ? (n[s++] = r)
                : (e && (n[s++] = r), (n = n.concat(u(r, e))), (s = n.length)),
                (r = r._next);
            return n;
          },
          c = (s.getAllTweens = function (e) {
            return u(t._rootTimeline, e).concat(u(t._rootFramesTimeline, e));
          });
        (s.killAll = function (t, i, n, s) {
          null == i && (i = !0), null == n && (n = !0);
          var r,
            o,
            a,
            l = c(0 != s),
            h = l.length,
            u = i && n && s;
          for (a = 0; h > a; a++)
            (o = l[a]),
              (u ||
                o instanceof e ||
                ((r = o.target === o.vars.onComplete) && n) ||
                (i && !r)) &&
                (t ? o.totalTime(o.totalDuration()) : o._enabled(!1, !1));
        }),
          (s.killChildTweensOf = function (t, e) {
            if (null != t) {
              var r,
                l,
                h,
                u,
                c,
                p = i._tweenLookup;
              if (
                ("string" == typeof t && (t = i.selector(t) || t),
                o(t) && (t = n(t, 0)),
                a(t))
              )
                for (u = t.length; --u > -1; ) s.killChildTweensOf(t[u], e);
              else {
                r = [];
                for (h in p)
                  for (l = p[h].target.parentNode; l; )
                    l === t && (r = r.concat(p[h].tweens)), (l = l.parentNode);
                for (c = r.length, u = 0; c > u; u++)
                  e && r[u].totalTime(r[u].totalDuration()),
                    r[u]._enabled(!1, !1);
              }
            }
          });
        var p = function (t, i, n, s) {
          (i = i !== !1), (n = n !== !1), (s = s !== !1);
          for (var r, o, a = c(s), l = i && n && s, h = a.length; --h > -1; )
            (o = a[h]),
              (l ||
                o instanceof e ||
                ((r = o.target === o.vars.onComplete) && n) ||
                (i && !r)) &&
                o.paused(t);
        };
        return (
          (s.pauseAll = function (t, e, i) {
            p(!0, t, e, i);
          }),
          (s.resumeAll = function (t, e, i) {
            p(!1, t, e, i);
          }),
          (s.globalTimeScale = function (e) {
            var n = t._rootTimeline,
              s = i.ticker.time;
            return arguments.length
              ? ((e = e || r),
                (n._startTime = s - ((s - n._startTime) * n._timeScale) / e),
                (n = t._rootFramesTimeline),
                (s = i.ticker.frame),
                (n._startTime = s - ((s - n._startTime) * n._timeScale) / e),
                (n._timeScale = t._rootTimeline._timeScale = e),
                e)
              : n._timeScale;
          }),
          (l.progress = function (t) {
            return arguments.length
              ? this.totalTime(
                  this.duration() *
                    (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) +
                    this._cycle * (this._duration + this._repeatDelay),
                  !1
                )
              : this._time / this.duration();
          }),
          (l.totalProgress = function (t) {
            return arguments.length
              ? this.totalTime(this.totalDuration() * t, !1)
              : this._totalTime / this.totalDuration();
          }),
          (l.time = function (t, e) {
            return arguments.length
              ? (this._dirty && this.totalDuration(),
                t > this._duration && (t = this._duration),
                this._yoyo && 0 !== (1 & this._cycle)
                  ? (t =
                      this._duration -
                      t +
                      this._cycle * (this._duration + this._repeatDelay))
                  : 0 !== this._repeat &&
                    (t += this._cycle * (this._duration + this._repeatDelay)),
                this.totalTime(t, e))
              : this._time;
          }),
          (l.duration = function (e) {
            return arguments.length
              ? t.prototype.duration.call(this, e)
              : this._duration;
          }),
          (l.totalDuration = function (t) {
            return arguments.length
              ? -1 === this._repeat
                ? this
                : this.duration(
                    (t - this._repeat * this._repeatDelay) / (this._repeat + 1)
                  )
              : (this._dirty &&
                  ((this._totalDuration =
                    -1 === this._repeat
                      ? 999999999999
                      : this._duration * (this._repeat + 1) +
                        this._repeatDelay * this._repeat),
                  (this._dirty = !1)),
                this._totalDuration);
          }),
          (l.repeat = function (t) {
            return arguments.length
              ? ((this._repeat = t), this._uncache(!0))
              : this._repeat;
          }),
          (l.repeatDelay = function (t) {
            return arguments.length
              ? ((this._repeatDelay = t), this._uncache(!0))
              : this._repeatDelay;
          }),
          (l.yoyo = function (t) {
            return arguments.length ? ((this._yoyo = t), this) : this._yoyo;
          }),
          s
        );
      },
      !0
    ),
      window._gsDefine(
        "TimelineLite",
        ["core.Animation", "core.SimpleTimeline", "TweenLite"],
        function (t, e, i) {
          var n = function (t) {
              e.call(this, t),
                (this._labels = {}),
                (this.autoRemoveChildren = this.vars.autoRemoveChildren === !0),
                (this.smoothChildTiming = this.vars.smoothChildTiming === !0),
                (this._sortChildren = !0),
                (this._onUpdate = this.vars.onUpdate);
              var i,
                n,
                s = this.vars;
              for (n in s)
                (i = s[n]),
                  o(i) &&
                    -1 !== i.join("").indexOf("{self}") &&
                    (s[n] = this._swapSelfInParams(i));
              o(s.tweens) && this.add(s.tweens, 0, s.align, s.stagger);
            },
            s = 1e-10,
            r = i._internals.isSelector,
            o = i._internals.isArray,
            a = [],
            l = function (t) {
              var e,
                i = {};
              for (e in t) i[e] = t[e];
              return i;
            },
            h = function (t, e, i, n) {
              t._timeline.pause(t._startTime),
                e && e.apply(n || t._timeline, i || a);
            },
            u = a.slice,
            c = (n.prototype = new e());
          return (
            (n.version = "1.11.0"),
            (c.constructor = n),
            (c.kill()._gc = !1),
            (c.to = function (t, e, n, s) {
              return e ? this.add(new i(t, e, n), s) : this.set(t, n, s);
            }),
            (c.from = function (t, e, n, s) {
              return this.add(i.from(t, e, n), s);
            }),
            (c.fromTo = function (t, e, n, s, r) {
              return e ? this.add(i.fromTo(t, e, n, s), r) : this.set(t, s, r);
            }),
            (c.staggerTo = function (t, e, s, o, a, h, c, p) {
              var d,
                f = new n({
                  onComplete: h,
                  onCompleteParams: c,
                  onCompleteScope: p,
                });
              for (
                "string" == typeof t && (t = i.selector(t) || t),
                  r(t) && (t = u.call(t, 0)),
                  o = o || 0,
                  d = 0;
                t.length > d;
                d++
              )
                s.startAt && (s.startAt = l(s.startAt)),
                  f.to(t[d], e, l(s), d * o);
              return this.add(f, a);
            }),
            (c.staggerFrom = function (t, e, i, n, s, r, o, a) {
              return (
                (i.immediateRender = 0 != i.immediateRender),
                (i.runBackwards = !0),
                this.staggerTo(t, e, i, n, s, r, o, a)
              );
            }),
            (c.staggerFromTo = function (t, e, i, n, s, r, o, a, l) {
              return (
                (n.startAt = i),
                (n.immediateRender =
                  0 != n.immediateRender && 0 != i.immediateRender),
                this.staggerTo(t, e, n, s, r, o, a, l)
              );
            }),
            (c.call = function (t, e, n, s) {
              return this.add(i.delayedCall(0, t, e, n), s);
            }),
            (c.set = function (t, e, n) {
              return (
                (n = this._parseTimeOrLabel(n, 0, !0)),
                null == e.immediateRender &&
                  (e.immediateRender = n === this._time && !this._paused),
                this.add(new i(t, 0, e), n)
              );
            }),
            (n.exportRoot = function (t, e) {
              (t = t || {}),
                null == t.smoothChildTiming && (t.smoothChildTiming = !0);
              var s,
                r,
                o = new n(t),
                a = o._timeline;
              for (
                null == e && (e = !0),
                  a._remove(o, !0),
                  o._startTime = 0,
                  o._rawPrevTime = o._time = o._totalTime = a._time,
                  s = a._first;
                s;

              )
                (r = s._next),
                  (e && s instanceof i && s.target === s.vars.onComplete) ||
                    o.add(s, s._startTime - s._delay),
                  (s = r);
              return a.add(o, 0), o;
            }),
            (c.add = function (s, r, a, l) {
              var h, u, c, p, d, f;
              if (
                ("number" != typeof r &&
                  (r = this._parseTimeOrLabel(r, 0, !0, s)),
                !(s instanceof t))
              ) {
                if (s instanceof Array || (s && s.push && o(s))) {
                  for (
                    a = a || "normal", l = l || 0, h = r, u = s.length, c = 0;
                    u > c;
                    c++
                  )
                    o((p = s[c])) && (p = new n({ tweens: p })),
                      this.add(p, h),
                      "string" != typeof p &&
                        "function" != typeof p &&
                        ("sequence" === a
                          ? (h =
                              p._startTime + p.totalDuration() / p._timeScale)
                          : "start" === a && (p._startTime -= p.delay())),
                      (h += l);
                  return this._uncache(!0);
                }
                if ("string" == typeof s) return this.addLabel(s, r);
                if ("function" != typeof s)
                  throw (
                    "Cannot add " +
                    s +
                    " into the timeline; it is not a tween, timeline, function, or string."
                  );
                s = i.delayedCall(0, s);
              }
              if (
                (e.prototype.add.call(this, s, r),
                this._gc && !this._paused && this._duration < this.duration())
              )
                for (
                  d = this, f = d.rawTime() > s._startTime;
                  d._gc && d._timeline;

                )
                  d._timeline.smoothChildTiming && f
                    ? d.totalTime(d._totalTime, !0)
                    : d._enabled(!0, !1),
                    (d = d._timeline);
              return this;
            }),
            (c.remove = function (e) {
              if (e instanceof t) return this._remove(e, !1);
              if (e instanceof Array || (e && e.push && o(e))) {
                for (var i = e.length; --i > -1; ) this.remove(e[i]);
                return this;
              }
              return "string" == typeof e
                ? this.removeLabel(e)
                : this.kill(null, e);
            }),
            (c._remove = function (t, i) {
              e.prototype._remove.call(this, t, i);
              var n = this._last;
              return (
                n
                  ? this._time >
                      n._startTime + n._totalDuration / n._timeScale &&
                    ((this._time = this.duration()),
                    (this._totalTime = this._totalDuration))
                  : (this._time = this._totalTime = 0),
                this
              );
            }),
            (c.append = function (t, e) {
              return this.add(t, this._parseTimeOrLabel(null, e, !0, t));
            }),
            (c.insert = c.insertMultiple =
              function (t, e, i, n) {
                return this.add(t, e || 0, i, n);
              }),
            (c.appendMultiple = function (t, e, i, n) {
              return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, n);
            }),
            (c.addLabel = function (t, e) {
              return (this._labels[t] = this._parseTimeOrLabel(e)), this;
            }),
            (c.addPause = function (t, e, i, n) {
              return this.call(h, ["{self}", e, i, n], this, t);
            }),
            (c.removeLabel = function (t) {
              return delete this._labels[t], this;
            }),
            (c.getLabelTime = function (t) {
              return null != this._labels[t] ? this._labels[t] : -1;
            }),
            (c._parseTimeOrLabel = function (e, i, n, s) {
              var r;
              if (s instanceof t && s.timeline === this) this.remove(s);
              else if (s && (s instanceof Array || (s.push && o(s))))
                for (r = s.length; --r > -1; )
                  s[r] instanceof t &&
                    s[r].timeline === this &&
                    this.remove(s[r]);
              if ("string" == typeof i)
                return this._parseTimeOrLabel(
                  i,
                  n && "number" == typeof e && null == this._labels[i]
                    ? e - this.duration()
                    : 0,
                  n
                );
              if (
                ((i = i || 0),
                "string" != typeof e || (!isNaN(e) && null == this._labels[e]))
              )
                null == e && (e = this.duration());
              else {
                if (((r = e.indexOf("=")), -1 === r))
                  return null == this._labels[e]
                    ? n
                      ? (this._labels[e] = this.duration() + i)
                      : i
                    : this._labels[e] + i;
                (i =
                  parseInt(e.charAt(r - 1) + "1", 10) *
                  Number(e.substr(r + 1))),
                  (e =
                    r > 1
                      ? this._parseTimeOrLabel(e.substr(0, r - 1), 0, n)
                      : this.duration());
              }
              return Number(e) + i;
            }),
            (c.seek = function (t, e) {
              return this.totalTime(
                "number" == typeof t ? t : this._parseTimeOrLabel(t),
                e !== !1
              );
            }),
            (c.stop = function () {
              return this.paused(!0);
            }),
            (c.gotoAndPlay = function (t, e) {
              return this.play(t, e);
            }),
            (c.gotoAndStop = function (t, e) {
              return this.pause(t, e);
            }),
            (c.render = function (t, e, i) {
              this._gc && this._enabled(!0, !1);
              var n,
                r,
                o,
                l,
                h,
                u = this._dirty ? this.totalDuration() : this._totalDuration,
                c = this._time,
                p = this._startTime,
                d = this._timeScale,
                f = this._paused;
              if (
                (t >= u
                  ? ((this._totalTime = this._time = u),
                    this._reversed ||
                      this._hasPausedChild() ||
                      ((r = !0),
                      (l = "onComplete"),
                      0 === this._duration &&
                        (0 === t ||
                          0 > this._rawPrevTime ||
                          this._rawPrevTime === s) &&
                        this._rawPrevTime !== t &&
                        this._first &&
                        ((h = !0),
                        this._rawPrevTime > s && (l = "onReverseComplete"))),
                    (this._rawPrevTime = this._duration || !e || t ? t : s),
                    (t = u + 1e-6))
                  : 1e-7 > t
                  ? ((this._totalTime = this._time = 0),
                    (0 !== c ||
                      (0 === this._duration &&
                        (this._rawPrevTime > s ||
                          (0 > t && this._rawPrevTime >= 0)))) &&
                      ((l = "onReverseComplete"), (r = this._reversed)),
                    0 > t
                      ? ((this._active = !1),
                        0 === this._duration &&
                          this._rawPrevTime >= 0 &&
                          this._first &&
                          (h = !0),
                        (this._rawPrevTime = t))
                      : ((this._rawPrevTime =
                          this._duration || !e || t ? t : s),
                        (t = 0),
                        this._initted || (h = !0)))
                  : (this._totalTime = this._time = this._rawPrevTime = t),
                (this._time !== c && this._first) || i || h)
              ) {
                if (
                  (this._initted || (this._initted = !0),
                  this._active ||
                    (!this._paused &&
                      this._time !== c &&
                      t > 0 &&
                      (this._active = !0)),
                  0 === c &&
                    this.vars.onStart &&
                    0 !== this._time &&
                    (e ||
                      this.vars.onStart.apply(
                        this.vars.onStartScope || this,
                        this.vars.onStartParams || a
                      )),
                  this._time >= c)
                )
                  for (
                    n = this._first;
                    n && ((o = n._next), !this._paused || f);

                  )
                    (n._active ||
                      (n._startTime <= this._time && !n._paused && !n._gc)) &&
                      (n._reversed
                        ? n.render(
                            (n._dirty ? n.totalDuration() : n._totalDuration) -
                              (t - n._startTime) * n._timeScale,
                            e,
                            i
                          )
                        : n.render((t - n._startTime) * n._timeScale, e, i)),
                      (n = o);
                else
                  for (
                    n = this._last;
                    n && ((o = n._prev), !this._paused || f);

                  )
                    (n._active ||
                      (c >= n._startTime && !n._paused && !n._gc)) &&
                      (n._reversed
                        ? n.render(
                            (n._dirty ? n.totalDuration() : n._totalDuration) -
                              (t - n._startTime) * n._timeScale,
                            e,
                            i
                          )
                        : n.render((t - n._startTime) * n._timeScale, e, i)),
                      (n = o);
                this._onUpdate &&
                  (e ||
                    this._onUpdate.apply(
                      this.vars.onUpdateScope || this,
                      this.vars.onUpdateParams || a
                    )),
                  l &&
                    (this._gc ||
                      ((p === this._startTime || d !== this._timeScale) &&
                        (0 === this._time || u >= this.totalDuration()) &&
                        (r &&
                          (this._timeline.autoRemoveChildren &&
                            this._enabled(!1, !1),
                          (this._active = !1)),
                        !e &&
                          this.vars[l] &&
                          this.vars[l].apply(
                            this.vars[l + "Scope"] || this,
                            this.vars[l + "Params"] || a
                          ))));
              }
            }),
            (c._hasPausedChild = function () {
              for (var t = this._first; t; ) {
                if (t._paused || (t instanceof n && t._hasPausedChild()))
                  return !0;
                t = t._next;
              }
              return !1;
            }),
            (c.getChildren = function (t, e, n, s) {
              s = s || -9999999999;
              for (var r = [], o = this._first, a = 0; o; )
                s > o._startTime ||
                  (o instanceof i
                    ? e !== !1 && (r[a++] = o)
                    : (n !== !1 && (r[a++] = o),
                      t !== !1 &&
                        ((r = r.concat(o.getChildren(!0, e, n))),
                        (a = r.length)))),
                  (o = o._next);
              return r;
            }),
            (c.getTweensOf = function (t, e) {
              for (
                var n = i.getTweensOf(t), s = n.length, r = [], o = 0;
                --s > -1;

              )
                (n[s].timeline === this || (e && this._contains(n[s]))) &&
                  (r[o++] = n[s]);
              return r;
            }),
            (c._contains = function (t) {
              for (var e = t.timeline; e; ) {
                if (e === this) return !0;
                e = e.timeline;
              }
              return !1;
            }),
            (c.shiftChildren = function (t, e, i) {
              i = i || 0;
              for (var n, s = this._first, r = this._labels; s; )
                s._startTime >= i && (s._startTime += t), (s = s._next);
              if (e) for (n in r) r[n] >= i && (r[n] += t);
              return this._uncache(!0);
            }),
            (c._kill = function (t, e) {
              if (!t && !e) return this._enabled(!1, !1);
              for (
                var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1),
                  n = i.length,
                  s = !1;
                --n > -1;

              )
                i[n]._kill(t, e) && (s = !0);
              return s;
            }),
            (c.clear = function (t) {
              var e = this.getChildren(!1, !0, !0),
                i = e.length;
              for (this._time = this._totalTime = 0; --i > -1; )
                e[i]._enabled(!1, !1);
              return t !== !1 && (this._labels = {}), this._uncache(!0);
            }),
            (c.invalidate = function () {
              for (var t = this._first; t; ) t.invalidate(), (t = t._next);
              return this;
            }),
            (c._enabled = function (t, i) {
              if (t === this._gc)
                for (var n = this._first; n; ) n._enabled(t, !0), (n = n._next);
              return e.prototype._enabled.call(this, t, i);
            }),
            (c.duration = function (t) {
              return arguments.length
                ? (0 !== this.duration() &&
                    0 !== t &&
                    this.timeScale(this._duration / t),
                  this)
                : (this._dirty && this.totalDuration(), this._duration);
            }),
            (c.totalDuration = function (t) {
              if (!arguments.length) {
                if (this._dirty) {
                  for (var e, i, n = 0, s = this._last, r = 999999999999; s; )
                    (e = s._prev),
                      s._dirty && s.totalDuration(),
                      s._startTime > r && this._sortChildren && !s._paused
                        ? this.add(s, s._startTime - s._delay)
                        : (r = s._startTime),
                      0 > s._startTime &&
                        !s._paused &&
                        ((n -= s._startTime),
                        this._timeline.smoothChildTiming &&
                          (this._startTime += s._startTime / this._timeScale),
                        this.shiftChildren(-s._startTime, !1, -9999999999),
                        (r = 0)),
                      (i = s._startTime + s._totalDuration / s._timeScale),
                      i > n && (n = i),
                      (s = e);
                  (this._duration = this._totalDuration = n),
                    (this._dirty = !1);
                }
                return this._totalDuration;
              }
              return (
                0 !== this.totalDuration() &&
                  0 !== t &&
                  this.timeScale(this._totalDuration / t),
                this
              );
            }),
            (c.usesFrames = function () {
              for (var e = this._timeline; e._timeline; ) e = e._timeline;
              return e === t._rootFramesTimeline;
            }),
            (c.rawTime = function () {
              return this._paused
                ? this._totalTime
                : (this._timeline.rawTime() - this._startTime) *
                    this._timeScale;
            }),
            n
          );
        },
        !0
      ),
      window._gsDefine(
        "TimelineMax",
        ["TimelineLite", "TweenLite", "easing.Ease"],
        function (t, e, i) {
          var n = function (e) {
              t.call(this, e),
                (this._repeat = this.vars.repeat || 0),
                (this._repeatDelay = this.vars.repeatDelay || 0),
                (this._cycle = 0),
                (this._yoyo = this.vars.yoyo === !0),
                (this._dirty = !0);
            },
            s = 1e-10,
            r = [],
            o = new i(null, null, 1, 0),
            a = (n.prototype = new t());
          return (
            (a.constructor = n),
            (a.kill()._gc = !1),
            (n.version = "1.11.0"),
            (a.invalidate = function () {
              return (
                (this._yoyo = this.vars.yoyo === !0),
                (this._repeat = this.vars.repeat || 0),
                (this._repeatDelay = this.vars.repeatDelay || 0),
                this._uncache(!0),
                t.prototype.invalidate.call(this)
              );
            }),
            (a.addCallback = function (t, i, n, s) {
              return this.add(e.delayedCall(0, t, n, s), i);
            }),
            (a.removeCallback = function (t, e) {
              if (t)
                if (null == e) this._kill(null, t);
                else
                  for (
                    var i = this.getTweensOf(t, !1),
                      n = i.length,
                      s = this._parseTimeOrLabel(e);
                    --n > -1;

                  )
                    i[n]._startTime === s && i[n]._enabled(!1, !1);
              return this;
            }),
            (a.tweenTo = function (t, i) {
              i = i || {};
              var n,
                s,
                a = {
                  ease: o,
                  overwrite: 2,
                  useFrames: this.usesFrames(),
                  immediateRender: !1,
                };
              for (n in i) a[n] = i[n];
              return (
                (a.time = this._parseTimeOrLabel(t)),
                (s = new e(
                  this,
                  Math.abs(Number(a.time) - this._time) / this._timeScale ||
                    0.001,
                  a
                )),
                (a.onStart = function () {
                  s.target.paused(!0),
                    s.vars.time !== s.target.time() &&
                      s.duration(
                        Math.abs(s.vars.time - s.target.time()) /
                          s.target._timeScale
                      ),
                    i.onStart &&
                      i.onStart.apply(
                        i.onStartScope || s,
                        i.onStartParams || r
                      );
                }),
                s
              );
            }),
            (a.tweenFromTo = function (t, e, i) {
              (i = i || {}),
                (t = this._parseTimeOrLabel(t)),
                (i.startAt = {
                  onComplete: this.seek,
                  onCompleteParams: [t],
                  onCompleteScope: this,
                }),
                (i.immediateRender = i.immediateRender !== !1);
              var n = this.tweenTo(e, i);
              return n.duration(
                Math.abs(n.vars.time - t) / this._timeScale || 0.001
              );
            }),
            (a.render = function (t, e, i) {
              this._gc && this._enabled(!0, !1);
              var n,
                o,
                a,
                l,
                h,
                u,
                c = this._dirty ? this.totalDuration() : this._totalDuration,
                p = this._duration,
                d = this._time,
                f = this._totalTime,
                m = this._startTime,
                g = this._timeScale,
                v = this._rawPrevTime,
                _ = this._paused,
                y = this._cycle;
              if (
                (t >= c
                  ? (this._locked ||
                      ((this._totalTime = c), (this._cycle = this._repeat)),
                    this._reversed ||
                      this._hasPausedChild() ||
                      ((o = !0),
                      (l = "onComplete"),
                      0 === this._duration &&
                        (0 === t || 0 > v || v === s) &&
                        v !== t &&
                        this._first &&
                        ((h = !0), v > s && (l = "onReverseComplete"))),
                    (this._rawPrevTime = this._duration || !e || t ? t : s),
                    this._yoyo && 0 !== (1 & this._cycle)
                      ? (this._time = t = 0)
                      : ((this._time = p), (t = p + 1e-6)))
                  : 1e-7 > t
                  ? (this._locked || (this._totalTime = this._cycle = 0),
                    (this._time = 0),
                    (0 !== d ||
                      (0 === p &&
                        (v > s || (0 > t && v >= 0)) &&
                        !this._locked)) &&
                      ((l = "onReverseComplete"), (o = this._reversed)),
                    0 > t
                      ? ((this._active = !1),
                        0 === p && v >= 0 && this._first && (h = !0),
                        (this._rawPrevTime = t))
                      : ((this._rawPrevTime = p || !e || t ? t : s),
                        (t = 0),
                        this._initted || (h = !0)))
                  : (0 === p && 0 > v && (h = !0),
                    (this._time = this._rawPrevTime = t),
                    this._locked ||
                      ((this._totalTime = t),
                      0 !== this._repeat &&
                        ((u = p + this._repeatDelay),
                        (this._cycle = (this._totalTime / u) >> 0),
                        0 !== this._cycle &&
                          this._cycle === this._totalTime / u &&
                          this._cycle--,
                        (this._time = this._totalTime - this._cycle * u),
                        this._yoyo &&
                          0 !== (1 & this._cycle) &&
                          (this._time = p - this._time),
                        this._time > p
                          ? ((this._time = p), (t = p + 1e-6))
                          : 0 > this._time
                          ? (this._time = t = 0)
                          : (t = this._time)))),
                this._cycle !== y && !this._locked)
              ) {
                var w = this._yoyo && 0 !== (1 & y),
                  x = w === (this._yoyo && 0 !== (1 & this._cycle)),
                  b = this._totalTime,
                  T = this._cycle,
                  S = this._rawPrevTime,
                  C = this._time;
                if (
                  ((this._totalTime = y * p),
                  y > this._cycle ? (w = !w) : (this._totalTime += p),
                  (this._time = d),
                  (this._rawPrevTime = 0 === p ? v - 1e-5 : v),
                  (this._cycle = y),
                  (this._locked = !0),
                  (d = w ? 0 : p),
                  this.render(d, e, 0 === p),
                  e ||
                    this._gc ||
                    (this.vars.onRepeat &&
                      this.vars.onRepeat.apply(
                        this.vars.onRepeatScope || this,
                        this.vars.onRepeatParams || r
                      )),
                  x && ((d = w ? p + 1e-6 : -1e-6), this.render(d, !0, !1)),
                  (this._locked = !1),
                  this._paused && !_)
                )
                  return;
                (this._time = C),
                  (this._totalTime = b),
                  (this._cycle = T),
                  (this._rawPrevTime = S);
              }
              if (!((this._time !== d && this._first) || i || h))
                return void (
                  f !== this._totalTime &&
                  this._onUpdate &&
                  (e ||
                    this._onUpdate.apply(
                      this.vars.onUpdateScope || this,
                      this.vars.onUpdateParams || r
                    ))
                );
              if (
                (this._initted || (this._initted = !0),
                this._active ||
                  (!this._paused &&
                    this._totalTime !== f &&
                    t > 0 &&
                    (this._active = !0)),
                0 === f &&
                  this.vars.onStart &&
                  0 !== this._totalTime &&
                  (e ||
                    this.vars.onStart.apply(
                      this.vars.onStartScope || this,
                      this.vars.onStartParams || r
                    )),
                this._time >= d)
              )
                for (
                  n = this._first;
                  n && ((a = n._next), !this._paused || _);

                )
                  (n._active ||
                    (n._startTime <= this._time && !n._paused && !n._gc)) &&
                    (n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i)),
                    (n = a);
              else
                for (n = this._last; n && ((a = n._prev), !this._paused || _); )
                  (n._active || (d >= n._startTime && !n._paused && !n._gc)) &&
                    (n._reversed
                      ? n.render(
                          (n._dirty ? n.totalDuration() : n._totalDuration) -
                            (t - n._startTime) * n._timeScale,
                          e,
                          i
                        )
                      : n.render((t - n._startTime) * n._timeScale, e, i)),
                    (n = a);
              this._onUpdate &&
                (e ||
                  this._onUpdate.apply(
                    this.vars.onUpdateScope || this,
                    this.vars.onUpdateParams || r
                  )),
                l &&
                  (this._locked ||
                    this._gc ||
                    ((m === this._startTime || g !== this._timeScale) &&
                      (0 === this._time || c >= this.totalDuration()) &&
                      (o &&
                        (this._timeline.autoRemoveChildren &&
                          this._enabled(!1, !1),
                        (this._active = !1)),
                      !e &&
                        this.vars[l] &&
                        this.vars[l].apply(
                          this.vars[l + "Scope"] || this,
                          this.vars[l + "Params"] || r
                        ))));
            }),
            (a.getActive = function (t, e, i) {
              null == t && (t = !0),
                null == e && (e = !0),
                null == i && (i = !1);
              var n,
                s,
                r = [],
                o = this.getChildren(t, e, i),
                a = 0,
                l = o.length;
              for (n = 0; l > n; n++) (s = o[n]), s.isActive() && (r[a++] = s);
              return r;
            }),
            (a.getLabelAfter = function (t) {
              t || (0 !== t && (t = this._time));
              var e,
                i = this.getLabelsArray(),
                n = i.length;
              for (e = 0; n > e; e++) if (i[e].time > t) return i[e].name;
              return null;
            }),
            (a.getLabelBefore = function (t) {
              null == t && (t = this._time);
              for (var e = this.getLabelsArray(), i = e.length; --i > -1; )
                if (t > e[i].time) return e[i].name;
              return null;
            }),
            (a.getLabelsArray = function () {
              var t,
                e = [],
                i = 0;
              for (t in this._labels)
                e[i++] = { time: this._labels[t], name: t };
              return (
                e.sort(function (t, e) {
                  return t.time - e.time;
                }),
                e
              );
            }),
            (a.progress = function (t) {
              return arguments.length
                ? this.totalTime(
                    this.duration() *
                      (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) +
                      this._cycle * (this._duration + this._repeatDelay),
                    !1
                  )
                : this._time / this.duration();
            }),
            (a.totalProgress = function (t) {
              return arguments.length
                ? this.totalTime(this.totalDuration() * t, !1)
                : this._totalTime / this.totalDuration();
            }),
            (a.totalDuration = function (e) {
              return arguments.length
                ? -1 === this._repeat
                  ? this
                  : this.duration(
                      (e - this._repeat * this._repeatDelay) /
                        (this._repeat + 1)
                    )
                : (this._dirty &&
                    (t.prototype.totalDuration.call(this),
                    (this._totalDuration =
                      -1 === this._repeat
                        ? 999999999999
                        : this._duration * (this._repeat + 1) +
                          this._repeatDelay * this._repeat)),
                  this._totalDuration);
            }),
            (a.time = function (t, e) {
              return arguments.length
                ? (this._dirty && this.totalDuration(),
                  t > this._duration && (t = this._duration),
                  this._yoyo && 0 !== (1 & this._cycle)
                    ? (t =
                        this._duration -
                        t +
                        this._cycle * (this._duration + this._repeatDelay))
                    : 0 !== this._repeat &&
                      (t += this._cycle * (this._duration + this._repeatDelay)),
                  this.totalTime(t, e))
                : this._time;
            }),
            (a.repeat = function (t) {
              return arguments.length
                ? ((this._repeat = t), this._uncache(!0))
                : this._repeat;
            }),
            (a.repeatDelay = function (t) {
              return arguments.length
                ? ((this._repeatDelay = t), this._uncache(!0))
                : this._repeatDelay;
            }),
            (a.yoyo = function (t) {
              return arguments.length ? ((this._yoyo = t), this) : this._yoyo;
            }),
            (a.currentLabel = function (t) {
              return arguments.length
                ? this.seek(t, !0)
                : this.getLabelBefore(this._time + 1e-8);
            }),
            n
          );
        },
        !0
      ),
      (function () {
        var t = 180 / Math.PI,
          e = [],
          i = [],
          n = [],
          s = {},
          r = function (t, e, i, n) {
            (this.a = t),
              (this.b = e),
              (this.c = i),
              (this.d = n),
              (this.da = n - t),
              (this.ca = i - t),
              (this.ba = e - t);
          },
          o =
            ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
          a = function (t, e, i, n) {
            var s = { a: t },
              r = {},
              o = {},
              a = { c: n },
              l = (t + e) / 2,
              h = (e + i) / 2,
              u = (i + n) / 2,
              c = (l + h) / 2,
              p = (h + u) / 2,
              d = (p - c) / 8;
            return (
              (s.b = l + (t - l) / 4),
              (r.b = c + d),
              (s.c = r.a = (s.b + r.b) / 2),
              (r.c = o.a = (c + p) / 2),
              (o.b = p - d),
              (a.b = u + (n - u) / 4),
              (o.c = a.a = (o.b + a.b) / 2),
              [s, r, o, a]
            );
          },
          l = function (t, s, r, o, l) {
            var h,
              u,
              c,
              p,
              d,
              f,
              m,
              g,
              v,
              _,
              y,
              w,
              x,
              b = t.length - 1,
              T = 0,
              S = t[0].a;
            for (h = 0; b > h; h++)
              (d = t[T]),
                (u = d.a),
                (c = d.d),
                (p = t[T + 1].d),
                l
                  ? ((y = e[h]),
                    (w = i[h]),
                    (x = (0.25 * (w + y) * s) / (o ? 0.5 : n[h] || 0.5)),
                    (f = c - (c - u) * (o ? 0.5 * s : 0 !== y ? x / y : 0)),
                    (m = c + (p - c) * (o ? 0.5 * s : 0 !== w ? x / w : 0)),
                    (g =
                      c -
                      (f + (((m - f) * ((3 * y) / (y + w) + 0.5)) / 4 || 0))))
                  : ((f = c - 0.5 * (c - u) * s),
                    (m = c + 0.5 * (p - c) * s),
                    (g = c - (f + m) / 2)),
                (f += g),
                (m += g),
                (d.c = v = f),
                (d.b = 0 !== h ? S : (S = d.a + 0.6 * (d.c - d.a))),
                (d.da = c - u),
                (d.ca = v - u),
                (d.ba = S - u),
                r
                  ? ((_ = a(u, S, v, c)),
                    t.splice(T, 1, _[0], _[1], _[2], _[3]),
                    (T += 4))
                  : T++,
                (S = m);
            (d = t[T]),
              (d.b = S),
              (d.c = S + 0.4 * (d.d - S)),
              (d.da = d.d - d.a),
              (d.ca = d.c - d.a),
              (d.ba = S - d.a),
              r &&
                ((_ = a(d.a, S, d.c, d.d)),
                t.splice(T, 1, _[0], _[1], _[2], _[3]));
          },
          h = function (t, n, s, o) {
            var a,
              l,
              h,
              u,
              c,
              p,
              d = [];
            if (o)
              for (t = [o].concat(t), l = t.length; --l > -1; )
                "string" == typeof (p = t[l][n]) &&
                  "=" === p.charAt(1) &&
                  (t[l][n] = o[n] + Number(p.charAt(0) + p.substr(2)));
            if (((a = t.length - 2), 0 > a))
              return (d[0] = new r(t[0][n], 0, 0, t[-1 > a ? 0 : 1][n])), d;
            for (l = 0; a > l; l++)
              (h = t[l][n]),
                (u = t[l + 1][n]),
                (d[l] = new r(h, 0, 0, u)),
                s &&
                  ((c = t[l + 2][n]),
                  (e[l] = (e[l] || 0) + (u - h) * (u - h)),
                  (i[l] = (i[l] || 0) + (c - u) * (c - u)));
            return (d[l] = new r(t[l][n], 0, 0, t[l + 1][n])), d;
          },
          u = function (t, r, a, u, c, p) {
            var d,
              f,
              m,
              g,
              v,
              _,
              y,
              w,
              x = {},
              b = [],
              T = p || t[0];
            (c = "string" == typeof c ? "," + c + "," : o),
              null == r && (r = 1);
            for (f in t[0]) b.push(f);
            if (t.length > 1) {
              for (w = t[t.length - 1], y = !0, d = b.length; --d > -1; )
                if (((f = b[d]), Math.abs(T[f] - w[f]) > 0.05)) {
                  y = !1;
                  break;
                }
              y &&
                ((t = t.concat()),
                p && t.unshift(p),
                t.push(t[1]),
                (p = t[t.length - 3]));
            }
            for (e.length = i.length = n.length = 0, d = b.length; --d > -1; )
              (f = b[d]),
                (s[f] = -1 !== c.indexOf("," + f + ",")),
                (x[f] = h(t, f, s[f], p));
            for (d = e.length; --d > -1; )
              (e[d] = Math.sqrt(e[d])), (i[d] = Math.sqrt(i[d]));
            if (!u) {
              for (d = b.length; --d > -1; )
                if (s[f])
                  for (m = x[b[d]], _ = m.length - 1, g = 0; _ > g; g++)
                    (v = m[g + 1].da / i[g] + m[g].da / e[g]),
                      (n[g] = (n[g] || 0) + v * v);
              for (d = n.length; --d > -1; ) n[d] = Math.sqrt(n[d]);
            }
            for (d = b.length, g = a ? 4 : 1; --d > -1; )
              (f = b[d]),
                (m = x[f]),
                l(m, r, a, u, s[f]),
                y && (m.splice(0, g), m.splice(m.length - g, g));
            return x;
          },
          c = function (t, e, i) {
            e = e || "soft";
            var n,
              s,
              o,
              a,
              l,
              h,
              u,
              c,
              p,
              d,
              f,
              m = {},
              g = "cubic" === e ? 3 : 2,
              v = "soft" === e,
              _ = [];
            if ((v && i && (t = [i].concat(t)), null == t || g + 1 > t.length))
              throw "invalid Bezier data";
            for (p in t[0]) _.push(p);
            for (h = _.length; --h > -1; ) {
              for (
                p = _[h], m[p] = l = [], d = 0, c = t.length, u = 0;
                c > u;
                u++
              )
                (n =
                  null == i
                    ? t[u][p]
                    : "string" == typeof (f = t[u][p]) && "=" === f.charAt(1)
                    ? i[p] + Number(f.charAt(0) + f.substr(2))
                    : Number(f)),
                  v && u > 1 && c - 1 > u && (l[d++] = (n + l[d - 2]) / 2),
                  (l[d++] = n);
              for (c = d - g + 1, d = 0, u = 0; c > u; u += g)
                (n = l[u]),
                  (s = l[u + 1]),
                  (o = l[u + 2]),
                  (a = 2 === g ? 0 : l[u + 3]),
                  (l[d++] = f =
                    3 === g
                      ? new r(n, s, o, a)
                      : new r(n, (2 * s + n) / 3, (2 * s + o) / 3, o));
              l.length = d;
            }
            return m;
          },
          p = function (t, e, i) {
            for (
              var n, s, r, o, a, l, h, u, c, p, d, f = 1 / i, m = t.length;
              --m > -1;

            )
              for (
                p = t[m],
                  r = p.a,
                  o = p.d - r,
                  a = p.c - r,
                  l = p.b - r,
                  n = s = 0,
                  u = 1;
                i >= u;
                u++
              )
                (h = f * u),
                  (c = 1 - h),
                  (n = s - (s = (h * h * o + 3 * c * (h * a + c * l)) * h)),
                  (d = m * i + u - 1),
                  (e[d] = (e[d] || 0) + n * n);
          },
          d = function (t, e) {
            e = e >> 0 || 6;
            var i,
              n,
              s,
              r,
              o = [],
              a = [],
              l = 0,
              h = 0,
              u = e - 1,
              c = [],
              d = [];
            for (i in t) p(t[i], o, e);
            for (s = o.length, n = 0; s > n; n++)
              (l += Math.sqrt(o[n])),
                (r = n % e),
                (d[r] = l),
                r === u &&
                  ((h += l),
                  (r = (n / e) >> 0),
                  (c[r] = d),
                  (a[r] = h),
                  (l = 0),
                  (d = []));
            return { length: h, lengths: a, segments: c };
          },
          f = window._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            API: 2,
            global: !0,
            init: function (t, e, i) {
              (this._target = t),
                e instanceof Array && (e = { values: e }),
                (this._func = {}),
                (this._round = {}),
                (this._props = []),
                (this._timeRes =
                  null == e.timeResolution
                    ? 6
                    : parseInt(e.timeResolution, 10));
              var n,
                s,
                r,
                o,
                a,
                l = e.values || [],
                h = {},
                p = l[0],
                f = e.autoRotate || i.vars.orientToBezier;
              this._autoRotate = f
                ? f instanceof Array
                  ? f
                  : [["x", "y", "rotation", f === !0 ? 0 : Number(f) || 0]]
                : null;
              for (n in p) this._props.push(n);
              for (r = this._props.length; --r > -1; )
                (n = this._props[r]),
                  this._overwriteProps.push(n),
                  (s = this._func[n] = "function" == typeof t[n]),
                  (h[n] = s
                    ? t[
                        n.indexOf("set") ||
                        "function" != typeof t["get" + n.substr(3)]
                          ? n
                          : "get" + n.substr(3)
                      ]()
                    : parseFloat(t[n])),
                  a || (h[n] !== l[0][n] && (a = h));
              if (
                ((this._beziers =
                  "cubic" !== e.type &&
                  "quadratic" !== e.type &&
                  "soft" !== e.type
                    ? u(
                        l,
                        isNaN(e.curviness) ? 1 : e.curviness,
                        !1,
                        "thruBasic" === e.type,
                        e.correlate,
                        a
                      )
                    : c(l, e.type, h)),
                (this._segCount = this._beziers[n].length),
                this._timeRes)
              ) {
                var m = d(this._beziers, this._timeRes);
                (this._length = m.length),
                  (this._lengths = m.lengths),
                  (this._segments = m.segments),
                  (this._l1 = this._li = this._s1 = this._si = 0),
                  (this._l2 = this._lengths[0]),
                  (this._curSeg = this._segments[0]),
                  (this._s2 = this._curSeg[0]),
                  (this._prec = 1 / this._curSeg.length);
              }
              if ((f = this._autoRotate))
                for (
                  f[0] instanceof Array || (this._autoRotate = f = [f]),
                    r = f.length;
                  --r > -1;

                )
                  for (o = 0; 3 > o; o++)
                    (n = f[r][o]),
                      (this._func[n] =
                        "function" == typeof t[n]
                          ? t[
                              n.indexOf("set") ||
                              "function" != typeof t["get" + n.substr(3)]
                                ? n
                                : "get" + n.substr(3)
                            ]
                          : !1);
              return !0;
            },
            set: function (e) {
              var i,
                n,
                s,
                r,
                o,
                a,
                l,
                h,
                u,
                c,
                p = this._segCount,
                d = this._func,
                f = this._target;
              if (this._timeRes) {
                if (
                  ((u = this._lengths),
                  (c = this._curSeg),
                  (e *= this._length),
                  (s = this._li),
                  e > this._l2 && p - 1 > s)
                ) {
                  for (h = p - 1; h > s && e >= (this._l2 = u[++s]); );
                  (this._l1 = u[s - 1]),
                    (this._li = s),
                    (this._curSeg = c = this._segments[s]),
                    (this._s2 = c[(this._s1 = this._si = 0)]);
                } else if (this._l1 > e && s > 0) {
                  for (; s > 0 && (this._l1 = u[--s]) >= e; );
                  0 === s && this._l1 > e ? (this._l1 = 0) : s++,
                    (this._l2 = u[s]),
                    (this._li = s),
                    (this._curSeg = c = this._segments[s]),
                    (this._s1 = c[(this._si = c.length - 1) - 1] || 0),
                    (this._s2 = c[this._si]);
                }
                if (
                  ((i = s),
                  (e -= this._l1),
                  (s = this._si),
                  e > this._s2 && c.length - 1 > s)
                ) {
                  for (h = c.length - 1; h > s && e >= (this._s2 = c[++s]); );
                  (this._s1 = c[s - 1]), (this._si = s);
                } else if (this._s1 > e && s > 0) {
                  for (; s > 0 && (this._s1 = c[--s]) >= e; );
                  0 === s && this._s1 > e ? (this._s1 = 0) : s++,
                    (this._s2 = c[s]),
                    (this._si = s);
                }
                a = (s + (e - this._s1) / (this._s2 - this._s1)) * this._prec;
              } else
                (i = 0 > e ? 0 : e >= 1 ? p - 1 : (p * e) >> 0),
                  (a = (e - i * (1 / p)) * p);
              for (n = 1 - a, s = this._props.length; --s > -1; )
                (r = this._props[s]),
                  (o = this._beziers[r][i]),
                  (l =
                    (a * a * o.da + 3 * n * (a * o.ca + n * o.ba)) * a + o.a),
                  this._round[r] && (l = (l + (l > 0 ? 0.5 : -0.5)) >> 0),
                  d[r] ? f[r](l) : (f[r] = l);
              if (this._autoRotate) {
                var m,
                  g,
                  v,
                  _,
                  y,
                  w,
                  x,
                  b = this._autoRotate;
                for (s = b.length; --s > -1; )
                  (r = b[s][2]),
                    (w = b[s][3] || 0),
                    (x = b[s][4] === !0 ? 1 : t),
                    (o = this._beziers[b[s][0]]),
                    (m = this._beziers[b[s][1]]),
                    o &&
                      m &&
                      ((o = o[i]),
                      (m = m[i]),
                      (g = o.a + (o.b - o.a) * a),
                      (_ = o.b + (o.c - o.b) * a),
                      (g += (_ - g) * a),
                      (_ += (o.c + (o.d - o.c) * a - _) * a),
                      (v = m.a + (m.b - m.a) * a),
                      (y = m.b + (m.c - m.b) * a),
                      (v += (y - v) * a),
                      (y += (m.c + (m.d - m.c) * a - y) * a),
                      (l = Math.atan2(y - v, _ - g) * x + w),
                      d[r] ? f[r](l) : (f[r] = l));
              }
            },
          }),
          m = f.prototype;
        (f.bezierThrough = u),
          (f.cubicToQuadratic = a),
          (f._autoCSS = !0),
          (f.quadraticToCubic = function (t, e, i) {
            return new r(t, (2 * e + t) / 3, (2 * e + i) / 3, i);
          }),
          (f._cssRegister = function () {
            var t = window._gsDefine.globals.CSSPlugin;
            if (t) {
              var e = t._internals,
                i = e._parseToProxy,
                n = e._setPluginRatio,
                s = e.CSSPropTween;
              e._registerComplexSpecialProp("bezier", {
                parser: function (t, e, r, o, a, l) {
                  e instanceof Array && (e = { values: e }), (l = new f());
                  var h,
                    u,
                    c,
                    p = e.values,
                    d = p.length - 1,
                    m = [],
                    g = {};
                  if (0 > d) return a;
                  for (h = 0; d >= h; h++)
                    (c = i(t, p[h], o, a, l, d !== h)), (m[h] = c.end);
                  for (u in e) g[u] = e[u];
                  return (
                    (g.values = m),
                    (a = new s(t, "bezier", 0, 0, c.pt, 2)),
                    (a.data = c),
                    (a.plugin = l),
                    (a.setRatio = n),
                    0 === g.autoRotate && (g.autoRotate = !0),
                    !g.autoRotate ||
                      g.autoRotate instanceof Array ||
                      ((h = g.autoRotate === !0 ? 0 : Number(g.autoRotate)),
                      (g.autoRotate =
                        null != c.end.left
                          ? [["left", "top", "rotation", h, !1]]
                          : null != c.end.x
                          ? [["x", "y", "rotation", h, !1]]
                          : !1)),
                    g.autoRotate &&
                      (o._transform || o._enableTransforms(!1),
                      (c.autoRotate = o._target._gsTransform)),
                    l._onInitTween(c.proxy, g, o._tween),
                    a
                  );
                },
              });
            }
          }),
          (m._roundProps = function (t, e) {
            for (var i = this._overwriteProps, n = i.length; --n > -1; )
              (t[i[n]] || t.bezier || t.bezierThrough) &&
                (this._round[i[n]] = e);
          }),
          (m._kill = function (t) {
            var e,
              i,
              n = this._props;
            for (e in this._beziers)
              if (e in t)
                for (
                  delete this._beziers[e], delete this._func[e], i = n.length;
                  --i > -1;

                )
                  n[i] === e && n.splice(i, 1);
            return this._super._kill.call(this, t);
          });
      })(),
      window._gsDefine(
        "plugins.CSSPlugin",
        ["plugins.TweenPlugin", "TweenLite"],
        function (t, e) {
          var i,
            n,
            s,
            r,
            o = function () {
              t.call(this, "css"),
                (this._overwriteProps.length = 0),
                (this.setRatio = o.prototype.setRatio);
            },
            a = {},
            l = (o.prototype = new t("css"));
          (l.constructor = o),
            (o.version = "1.11.0"),
            (o.API = 2),
            (o.defaultTransformPerspective = 0),
            (l = "px"),
            (o.suffixMap = {
              top: l,
              right: l,
              bottom: l,
              left: l,
              width: l,
              height: l,
              fontSize: l,
              padding: l,
              margin: l,
              perspective: l,
            });
          var h,
            u,
            c,
            p,
            d,
            f,
            m = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
            g = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
            v = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
            _ = /[^\d\-\.]/g,
            y = /(?:\d|\-|\+|=|#|\.)*/g,
            w = /opacity *= *([^)]*)/,
            x = /opacity:([^;]*)/,
            b = /alpha\(opacity *=.+?\)/i,
            T = /^(rgb|hsl)/,
            S = /([A-Z])/g,
            C = /-([a-z])/gi,
            P = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
            E = function (t, e) {
              return e.toUpperCase();
            },
            L = /(?:Left|Right|Width)/i,
            M = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
            I = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
            O = /,(?=[^\)]*(?:\(|$))/gi,
            k = Math.PI / 180,
            R = 180 / Math.PI,
            A = {},
            D = document,
            z = D.createElement("div"),
            N = D.createElement("img"),
            j = (o._internals = { _specialProps: a }),
            W = navigator.userAgent,
            F = (function () {
              var t,
                e = W.indexOf("Android"),
                i = D.createElement("div");
              return (
                (c =
                  -1 !== W.indexOf("Safari") &&
                  -1 === W.indexOf("Chrome") &&
                  (-1 === e || Number(W.substr(e + 8, 1)) > 3)),
                (d = c && 6 > Number(W.substr(W.indexOf("Version/") + 8, 1))),
                (p = -1 !== W.indexOf("Firefox")),
                /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(W),
                (f = parseFloat(RegExp.$1)),
                (i.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>"),
                (t = i.getElementsByTagName("a")[0]),
                t ? /^0.55/.test(t.style.opacity) : !1
              );
            })(),
            B = function (t) {
              return w.test(
                "string" == typeof t
                  ? t
                  : (t.currentStyle ? t.currentStyle.filter : t.style.filter) ||
                      ""
              )
                ? parseFloat(RegExp.$1) / 100
                : 1;
            },
            X = function (t) {
              window.console && console.log(t);
            },
            H = "",
            Y = "",
            q = function (t, e) {
              e = e || z;
              var i,
                n,
                s = e.style;
              if (void 0 !== s[t]) return t;
              for (
                t = t.charAt(0).toUpperCase() + t.substr(1),
                  i = ["O", "Moz", "ms", "Ms", "Webkit"],
                  n = 5;
                --n > -1 && void 0 === s[i[n] + t];

              );
              return n >= 0
                ? ((Y = 3 === n ? "ms" : i[n]),
                  (H = "-" + Y.toLowerCase() + "-"),
                  Y + t)
                : null;
            },
            U = D.defaultView ? D.defaultView.getComputedStyle : function () {},
            V = (o.getStyle = function (t, e, i, n, s) {
              var r;
              return F || "opacity" !== e
                ? (!n && t.style[e]
                    ? (r = t.style[e])
                    : (i = i || U(t, null))
                    ? ((t = i.getPropertyValue(
                        e.replace(S, "-$1").toLowerCase()
                      )),
                      (r = t || i.length ? t : i[e]))
                    : t.currentStyle && (r = t.currentStyle[e]),
                  null == s ||
                  (r && "none" !== r && "auto" !== r && "auto auto" !== r)
                    ? r
                    : s)
                : B(t);
            }),
            $ = function (t, e, i, n, s) {
              if ("px" === n || !n) return i;
              if ("auto" === n || !i) return 0;
              var r,
                o = L.test(e),
                a = t,
                l = z.style,
                h = 0 > i;
              return (
                h && (i = -i),
                "%" === n && -1 !== e.indexOf("border")
                  ? (r = (i / 100) * (o ? t.clientWidth : t.clientHeight))
                  : ((l.cssText =
                      "border-style:solid;border-width:0;position:absolute;line-height:0;"),
                    "%" !== n && a.appendChild
                      ? (l[o ? "borderLeftWidth" : "borderTopWidth"] = i + n)
                      : ((a = t.parentNode || D.body),
                        (l[o ? "width" : "height"] = i + n)),
                    a.appendChild(z),
                    (r = parseFloat(z[o ? "offsetWidth" : "offsetHeight"])),
                    a.removeChild(z),
                    0 !== r || s || (r = $(t, e, i, n, !0))),
                h ? -r : r
              );
            },
            G = function (t, e, i) {
              if ("absolute" !== V(t, "position", i)) return 0;
              var n = "left" === e ? "Left" : "Top",
                s = V(t, "margin" + n, i);
              return (
                t["offset" + n] -
                ($(t, e, parseFloat(s), s.replace(y, "")) || 0)
              );
            },
            Z = function (t, e) {
              var i,
                n,
                s = {};
              if ((e = e || U(t, null)))
                if ((i = e.length))
                  for (; --i > -1; )
                    s[e[i].replace(C, E)] = e.getPropertyValue(e[i]);
                else for (i in e) s[i] = e[i];
              else if ((e = t.currentStyle || t.style))
                for (i in e)
                  "string" == typeof i &&
                    void 0 !== s[i] &&
                    (s[i.replace(C, E)] = e[i]);
              return (
                F || (s.opacity = B(t)),
                (n = Te(t, e, !1)),
                (s.rotation = n.rotation),
                (s.skewX = n.skewX),
                (s.scaleX = n.scaleX),
                (s.scaleY = n.scaleY),
                (s.x = n.x),
                (s.y = n.y),
                be &&
                  ((s.z = n.z),
                  (s.rotationX = n.rotationX),
                  (s.rotationY = n.rotationY),
                  (s.scaleZ = n.scaleZ)),
                s.filters && delete s.filters,
                s
              );
            },
            Q = function (t, e, i, n, s) {
              var r,
                o,
                a,
                l = {},
                h = t.style;
              for (o in i)
                "cssText" !== o &&
                  "length" !== o &&
                  isNaN(o) &&
                  (e[o] !== (r = i[o]) || (s && s[o])) &&
                  -1 === o.indexOf("Origin") &&
                  ("number" == typeof r || "string" == typeof r) &&
                  ((l[o] =
                    "auto" !== r || ("left" !== o && "top" !== o)
                      ? ("" !== r && "auto" !== r && "none" !== r) ||
                        "string" != typeof e[o] ||
                        "" === e[o].replace(_, "")
                        ? r
                        : 0
                      : G(t, o)),
                  void 0 !== h[o] && (a = new ce(h, o, h[o], a)));
              if (n) for (o in n) "className" !== o && (l[o] = n[o]);
              return { difs: l, firstMPT: a };
            },
            K = { width: ["Left", "Right"], height: ["Top", "Bottom"] },
            J = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
            te = function (t, e, i) {
              var n = parseFloat(
                  "width" === e ? t.offsetWidth : t.offsetHeight
                ),
                s = K[e],
                r = s.length;
              for (i = i || U(t, null); --r > -1; )
                (n -= parseFloat(V(t, "padding" + s[r], i, !0)) || 0),
                  (n -=
                    parseFloat(V(t, "border" + s[r] + "Width", i, !0)) || 0);
              return n;
            },
            ee = function (t, e) {
              (null == t || "" === t || "auto" === t || "auto auto" === t) &&
                (t = "0 0");
              var i = t.split(" "),
                n =
                  -1 !== t.indexOf("left")
                    ? "0%"
                    : -1 !== t.indexOf("right")
                    ? "100%"
                    : i[0],
                s =
                  -1 !== t.indexOf("top")
                    ? "0%"
                    : -1 !== t.indexOf("bottom")
                    ? "100%"
                    : i[1];
              return (
                null == s ? (s = "0") : "center" === s && (s = "50%"),
                ("center" === n ||
                  (isNaN(parseFloat(n)) && -1 === (n + "").indexOf("="))) &&
                  (n = "50%"),
                e &&
                  ((e.oxp = -1 !== n.indexOf("%")),
                  (e.oyp = -1 !== s.indexOf("%")),
                  (e.oxr = "=" === n.charAt(1)),
                  (e.oyr = "=" === s.charAt(1)),
                  (e.ox = parseFloat(n.replace(_, ""))),
                  (e.oy = parseFloat(s.replace(_, "")))),
                n + " " + s + (i.length > 2 ? " " + i[2] : "")
              );
            },
            ie = function (t, e) {
              return "string" == typeof t && "=" === t.charAt(1)
                ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2))
                : parseFloat(t) - parseFloat(e);
            },
            ne = function (t, e) {
              return null == t
                ? e
                : "string" == typeof t && "=" === t.charAt(1)
                ? parseInt(t.charAt(0) + "1", 10) * Number(t.substr(2)) + e
                : parseFloat(t);
            },
            se = function (t, e, i, n) {
              var s,
                r,
                o,
                a,
                l = 1e-6;
              return (
                null == t
                  ? (a = e)
                  : "number" == typeof t
                  ? (a = t)
                  : ((s = 360),
                    (r = t.split("_")),
                    (o =
                      Number(r[0].replace(_, "")) *
                        (-1 === t.indexOf("rad") ? 1 : R) -
                      ("=" === t.charAt(1) ? 0 : e)),
                    r.length &&
                      (n && (n[i] = e + o),
                      -1 !== t.indexOf("short") &&
                        ((o %= s),
                        o !== o % (s / 2) && (o = 0 > o ? o + s : o - s)),
                      -1 !== t.indexOf("_cw") && 0 > o
                        ? (o = ((o + 9999999999 * s) % s) - (0 | (o / s)) * s)
                        : -1 !== t.indexOf("ccw") &&
                          o > 0 &&
                          (o = ((o - 9999999999 * s) % s) - (0 | (o / s)) * s)),
                    (a = e + o)),
                l > a && a > -l && (a = 0),
                a
              );
            },
            re = {
              aqua: [0, 255, 255],
              lime: [0, 255, 0],
              silver: [192, 192, 192],
              black: [0, 0, 0],
              maroon: [128, 0, 0],
              teal: [0, 128, 128],
              blue: [0, 0, 255],
              navy: [0, 0, 128],
              white: [255, 255, 255],
              fuchsia: [255, 0, 255],
              olive: [128, 128, 0],
              yellow: [255, 255, 0],
              orange: [255, 165, 0],
              gray: [128, 128, 128],
              purple: [128, 0, 128],
              green: [0, 128, 0],
              red: [255, 0, 0],
              pink: [255, 192, 203],
              cyan: [0, 255, 255],
              transparent: [255, 255, 255, 0],
            },
            oe = function (t, e, i) {
              return (
                (t = 0 > t ? t + 1 : t > 1 ? t - 1 : t),
                0 |
                  (255 *
                    (1 > 6 * t
                      ? e + 6 * (i - e) * t
                      : 0.5 > t
                      ? i
                      : 2 > 3 * t
                      ? e + 6 * (i - e) * (2 / 3 - t)
                      : e) +
                    0.5)
              );
            },
            ae = function (t) {
              var e, i, n, s, r, o;
              return t && "" !== t
                ? "number" == typeof t
                  ? [t >> 16, 255 & (t >> 8), 255 & t]
                  : ("," === t.charAt(t.length - 1) &&
                      (t = t.substr(0, t.length - 1)),
                    re[t]
                      ? re[t]
                      : "#" === t.charAt(0)
                      ? (4 === t.length &&
                          ((e = t.charAt(1)),
                          (i = t.charAt(2)),
                          (n = t.charAt(3)),
                          (t = "#" + e + e + i + i + n + n)),
                        (t = parseInt(t.substr(1), 16)),
                        [t >> 16, 255 & (t >> 8), 255 & t])
                      : "hsl" === t.substr(0, 3)
                      ? ((t = t.match(m)),
                        (s = (Number(t[0]) % 360) / 360),
                        (r = Number(t[1]) / 100),
                        (o = Number(t[2]) / 100),
                        (i = 0.5 >= o ? o * (r + 1) : o + r - o * r),
                        (e = 2 * o - i),
                        t.length > 3 && (t[3] = Number(t[3])),
                        (t[0] = oe(s + 1 / 3, e, i)),
                        (t[1] = oe(s, e, i)),
                        (t[2] = oe(s - 1 / 3, e, i)),
                        t)
                      : ((t = t.match(m) || re.transparent),
                        (t[0] = Number(t[0])),
                        (t[1] = Number(t[1])),
                        (t[2] = Number(t[2])),
                        t.length > 3 && (t[3] = Number(t[3])),
                        t))
                : re.black;
            },
            le = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
          for (l in re) le += "|" + l + "\\b";
          le = RegExp(le + ")", "gi");
          var he = function (t, e, i, n) {
              if (null == t)
                return function (t) {
                  return t;
                };
              var s,
                r = e ? (t.match(le) || [""])[0] : "",
                o = t.split(r).join("").match(v) || [],
                a = t.substr(0, t.indexOf(o[0])),
                l = ")" === t.charAt(t.length - 1) ? ")" : "",
                h = -1 !== t.indexOf(" ") ? " " : ",",
                u = o.length,
                c = u > 0 ? o[0].replace(m, "") : "";
              return u
                ? (s = e
                    ? function (t) {
                        var e, p, d, f;
                        if ("number" == typeof t) t += c;
                        else if (n && O.test(t)) {
                          for (
                            f = t.replace(O, "|").split("|"), d = 0;
                            f.length > d;
                            d++
                          )
                            f[d] = s(f[d]);
                          return f.join(",");
                        }
                        if (
                          ((e = (t.match(le) || [r])[0]),
                          (p = t.split(e).join("").match(v) || []),
                          (d = p.length),
                          u > d--)
                        )
                          for (; u > ++d; )
                            p[d] = i ? p[0 | ((d - 1) / 2)] : o[d];
                        return (
                          a +
                          p.join(h) +
                          h +
                          e +
                          l +
                          (-1 !== t.indexOf("inset") ? " inset" : "")
                        );
                      }
                    : function (t) {
                        var e, r, p;
                        if ("number" == typeof t) t += c;
                        else if (n && O.test(t)) {
                          for (
                            r = t.replace(O, "|").split("|"), p = 0;
                            r.length > p;
                            p++
                          )
                            r[p] = s(r[p]);
                          return r.join(",");
                        }
                        if (((e = t.match(v) || []), (p = e.length), u > p--))
                          for (; u > ++p; )
                            e[p] = i ? e[0 | ((p - 1) / 2)] : o[p];
                        return a + e.join(h) + l;
                      })
                : function (t) {
                    return t;
                  };
            },
            ue = function (t) {
              return (
                (t = t.split(",")),
                function (e, i, n, s, r, o, a) {
                  var l,
                    h = (i + "").split(" ");
                  for (a = {}, l = 0; 4 > l; l++)
                    a[t[l]] = h[l] = h[l] || h[((l - 1) / 2) >> 0];
                  return s.parse(e, a, r, o);
                }
              );
            },
            ce =
              ((j._setPluginRatio = function (t) {
                this.plugin.setRatio(t);
                for (
                  var e,
                    i,
                    n,
                    s,
                    r = this.data,
                    o = r.proxy,
                    a = r.firstMPT,
                    l = 1e-6;
                  a;

                )
                  (e = o[a.v]),
                    a.r
                      ? (e = e > 0 ? 0 | (e + 0.5) : 0 | (e - 0.5))
                      : l > e && e > -l && (e = 0),
                    (a.t[a.p] = e),
                    (a = a._next);
                if (
                  (r.autoRotate && (r.autoRotate.rotation = o.rotation),
                  1 === t)
                )
                  for (a = r.firstMPT; a; ) {
                    if (((i = a.t), i.type)) {
                      if (1 === i.type) {
                        for (s = i.xs0 + i.s + i.xs1, n = 1; i.l > n; n++)
                          s += i["xn" + n] + i["xs" + (n + 1)];
                        i.e = s;
                      }
                    } else i.e = i.s + i.xs0;
                    a = a._next;
                  }
              }),
              function (t, e, i, n, s) {
                (this.t = t),
                  (this.p = e),
                  (this.v = i),
                  (this.r = s),
                  n && ((n._prev = this), (this._next = n));
              }),
            pe =
              ((j._parseToProxy = function (t, e, i, n, s, r) {
                var o,
                  a,
                  l,
                  h,
                  u,
                  c = n,
                  p = {},
                  d = {},
                  f = i._transform,
                  m = A;
                for (
                  i._transform = null,
                    A = e,
                    n = u = i.parse(t, e, n, s),
                    A = m,
                    r &&
                      ((i._transform = f),
                      c &&
                        ((c._prev = null), c._prev && (c._prev._next = null)));
                  n && n !== c;

                ) {
                  if (
                    1 >= n.type &&
                    ((a = n.p),
                    (d[a] = n.s + n.c),
                    (p[a] = n.s),
                    r || ((h = new ce(n, "s", a, h, n.r)), (n.c = 0)),
                    1 === n.type)
                  )
                    for (o = n.l; --o > 0; )
                      (l = "xn" + o),
                        (a = n.p + "_" + l),
                        (d[a] = n.data[l]),
                        (p[a] = n[l]),
                        r || (h = new ce(n, l, a, h, n.rxp[l]));
                  n = n._next;
                }
                return { proxy: p, end: d, firstMPT: h, pt: u };
              }),
              (j.CSSPropTween = function (t, e, n, s, o, a, l, h, u, c, p) {
                (this.t = t),
                  (this.p = e),
                  (this.s = n),
                  (this.c = s),
                  (this.n = l || e),
                  t instanceof pe || r.push(this.n),
                  (this.r = h),
                  (this.type = a || 0),
                  u && ((this.pr = u), (i = !0)),
                  (this.b = void 0 === c ? n : c),
                  (this.e = void 0 === p ? n + s : p),
                  o && ((this._next = o), (o._prev = this));
              })),
            de = (o.parseComplex = function (t, e, i, n, s, r, o, a, l, u) {
              (i = i || r || ""),
                (o = new pe(t, e, 0, 0, o, u ? 2 : 1, null, !1, a, i, n)),
                (n += "");
              var c,
                p,
                d,
                f,
                v,
                _,
                y,
                w,
                x,
                b,
                S,
                C,
                P = i.split(", ").join(",").split(" "),
                E = n.split(", ").join(",").split(" "),
                L = P.length,
                M = h !== !1;
              for (
                (-1 !== n.indexOf(",") || -1 !== i.indexOf(",")) &&
                  ((P = P.join(" ").replace(O, ", ").split(" ")),
                  (E = E.join(" ").replace(O, ", ").split(" ")),
                  (L = P.length)),
                  L !== E.length &&
                    ((P = (r || "").split(" ")), (L = P.length)),
                  o.plugin = l,
                  o.setRatio = u,
                  c = 0;
                L > c;
                c++
              )
                if (((f = P[c]), (v = E[c]), (w = parseFloat(f)), w || 0 === w))
                  o.appendXtra(
                    "",
                    w,
                    ie(v, w),
                    v.replace(g, ""),
                    M && -1 !== v.indexOf("px"),
                    !0
                  );
                else if (s && ("#" === f.charAt(0) || re[f] || T.test(f)))
                  (C = "," === v.charAt(v.length - 1) ? ")," : ")"),
                    (f = ae(f)),
                    (v = ae(v)),
                    (x = f.length + v.length > 6),
                    x && !F && 0 === v[3]
                      ? ((o["xs" + o.l] += o.l
                          ? " transparent"
                          : "transparent"),
                        (o.e = o.e.split(E[c]).join("transparent")))
                      : (F || (x = !1),
                        o
                          .appendXtra(
                            x ? "rgba(" : "rgb(",
                            f[0],
                            v[0] - f[0],
                            ",",
                            !0,
                            !0
                          )
                          .appendXtra("", f[1], v[1] - f[1], ",", !0)
                          .appendXtra("", f[2], v[2] - f[2], x ? "," : C, !0),
                        x &&
                          ((f = 4 > f.length ? 1 : f[3]),
                          o.appendXtra(
                            "",
                            f,
                            (4 > v.length ? 1 : v[3]) - f,
                            C,
                            !1
                          )));
                else if ((_ = f.match(m))) {
                  if (((y = v.match(g)), !y || y.length !== _.length)) return o;
                  for (d = 0, p = 0; _.length > p; p++)
                    (S = _[p]),
                      (b = f.indexOf(S, d)),
                      o.appendXtra(
                        f.substr(d, b - d),
                        Number(S),
                        ie(y[p], S),
                        "",
                        M && "px" === f.substr(b + S.length, 2),
                        0 === p
                      ),
                      (d = b + S.length);
                  o["xs" + o.l] += f.substr(d);
                } else o["xs" + o.l] += o.l ? " " + f : f;
              if (-1 !== n.indexOf("=") && o.data) {
                for (C = o.xs0 + o.data.s, c = 1; o.l > c; c++)
                  C += o["xs" + c] + o.data["xn" + c];
                o.e = C + o["xs" + c];
              }
              return o.l || ((o.type = -1), (o.xs0 = o.e)), o.xfirst || o;
            }),
            fe = 9;
          for (l = pe.prototype, l.l = l.pr = 0; --fe > 0; )
            (l["xn" + fe] = 0), (l["xs" + fe] = "");
          (l.xs0 = ""),
            (l._next =
              l._prev =
              l.xfirst =
              l.data =
              l.plugin =
              l.setRatio =
              l.rxp =
                null),
            (l.appendXtra = function (t, e, i, n, s, r) {
              var o = this,
                a = o.l;
              return (
                (o["xs" + a] += r && a ? " " + t : t || ""),
                i || 0 === a || o.plugin
                  ? (o.l++,
                    (o.type = o.setRatio ? 2 : 1),
                    (o["xs" + o.l] = n || ""),
                    a > 0
                      ? ((o.data["xn" + a] = e + i),
                        (o.rxp["xn" + a] = s),
                        (o["xn" + a] = e),
                        o.plugin ||
                          ((o.xfirst = new pe(
                            o,
                            "xn" + a,
                            e,
                            i,
                            o.xfirst || o,
                            0,
                            o.n,
                            s,
                            o.pr
                          )),
                          (o.xfirst.xs0 = 0)),
                        o)
                      : ((o.data = { s: e + i }),
                        (o.rxp = {}),
                        (o.s = e),
                        (o.c = i),
                        (o.r = s),
                        o))
                  : ((o["xs" + a] += e + (n || "")), o)
              );
            });
          var me = function (t, e) {
              (e = e || {}),
                (this.p = e.prefix ? q(t) || t : t),
                (a[t] = a[this.p] = this),
                (this.format =
                  e.formatter ||
                  he(e.defaultValue, e.color, e.collapsible, e.multi)),
                e.parser && (this.parse = e.parser),
                (this.clrs = e.color),
                (this.multi = e.multi),
                (this.keyword = e.keyword),
                (this.dflt = e.defaultValue),
                (this.pr = e.priority || 0);
            },
            ge = (j._registerComplexSpecialProp = function (t, e, i) {
              "object" != typeof e && (e = { parser: i });
              var n,
                s,
                r = t.split(","),
                o = e.defaultValue;
              for (i = i || [o], n = 0; r.length > n; n++)
                (e.prefix = 0 === n && e.prefix),
                  (e.defaultValue = i[n] || o),
                  (s = new me(r[n], e));
            }),
            ve = function (t) {
              if (!a[t]) {
                var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                ge(t, {
                  parser: function (t, i, n, s, r, o, l) {
                    var h = (window.GreenSockGlobals || window).com.greensock
                      .plugins[e];
                    return h
                      ? (h._cssRegister(), a[n].parse(t, i, n, s, r, o, l))
                      : (X("Error: " + e + " js file not loaded."), r);
                  },
                });
              }
            };
          (l = me.prototype),
            (l.parseComplex = function (t, e, i, n, s, r) {
              var o,
                a,
                l,
                h,
                u,
                c,
                p = this.keyword;
              if (
                (this.multi &&
                  (O.test(i) || O.test(e)
                    ? ((a = e.replace(O, "|").split("|")),
                      (l = i.replace(O, "|").split("|")))
                    : p && ((a = [e]), (l = [i]))),
                l)
              ) {
                for (
                  h = l.length > a.length ? l.length : a.length, o = 0;
                  h > o;
                  o++
                )
                  (e = a[o] = a[o] || this.dflt),
                    (i = l[o] = l[o] || this.dflt),
                    p &&
                      ((u = e.indexOf(p)),
                      (c = i.indexOf(p)),
                      u !== c && ((i = -1 === c ? l : a), (i[o] += " " + p)));
                (e = a.join(", ")), (i = l.join(", "));
              }
              return de(
                t,
                this.p,
                e,
                i,
                this.clrs,
                this.dflt,
                n,
                this.pr,
                s,
                r
              );
            }),
            (l.parse = function (t, e, i, n, r, o) {
              return this.parseComplex(
                t.style,
                this.format(V(t, this.p, s, !1, this.dflt)),
                this.format(e),
                r,
                o
              );
            }),
            (o.registerSpecialProp = function (t, e, i) {
              ge(t, {
                parser: function (t, n, s, r, o, a) {
                  var l = new pe(t, s, 0, 0, o, 2, s, !1, i);
                  return (l.plugin = a), (l.setRatio = e(t, n, r._tween, s)), l;
                },
                priority: i,
              });
            });
          var _e =
              "scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(
                ","
              ),
            ye = q("transform"),
            we = H + "transform",
            xe = q("transformOrigin"),
            be = null !== q("perspective"),
            Te = function (t, e, i, n) {
              if (t._gsTransform && i && !n) return t._gsTransform;
              var s,
                r,
                a,
                l,
                h,
                u,
                c,
                p,
                d,
                f,
                m,
                g,
                v,
                _ = i ? t._gsTransform || { skewY: 0 } : { skewY: 0 },
                y = 0 > _.scaleX,
                w = 2e-5,
                x = 1e5,
                b = 179.99,
                T = b * k,
                S = be
                  ? parseFloat(V(t, xe, e, !1, "0 0 0").split(" ")[2]) ||
                    _.zOrigin ||
                    0
                  : 0;
              for (
                ye
                  ? (s = V(t, we, e, !0))
                  : t.currentStyle &&
                    ((s = t.currentStyle.filter.match(M)),
                    (s =
                      s && 4 === s.length
                        ? [
                            s[0].substr(4),
                            Number(s[2].substr(4)),
                            Number(s[1].substr(4)),
                            s[3].substr(4),
                            _.x || 0,
                            _.y || 0,
                          ].join(",")
                        : "")),
                  r = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [],
                  a = r.length;
                --a > -1;

              )
                (l = Number(r[a])),
                  (r[a] = (h = l - (l |= 0))
                    ? (0 | (h * x + (0 > h ? -0.5 : 0.5))) / x + l
                    : l);
              if (16 === r.length) {
                var C = r[8],
                  P = r[9],
                  E = r[10],
                  L = r[12],
                  I = r[13],
                  O = r[14];
                if (
                  (_.zOrigin &&
                    ((O = -_.zOrigin),
                    (L = C * O - r[12]),
                    (I = P * O - r[13]),
                    (O = E * O + _.zOrigin - r[14])),
                  !i || n || null == _.rotationX)
                ) {
                  var A,
                    D,
                    z,
                    N,
                    j,
                    W,
                    F,
                    B = r[0],
                    X = r[1],
                    H = r[2],
                    Y = r[3],
                    q = r[4],
                    U = r[5],
                    $ = r[6],
                    G = r[7],
                    Z = r[11],
                    Q = Math.atan2($, E),
                    K = -T > Q || Q > T;
                  (_.rotationX = Q * R),
                    Q &&
                      ((N = Math.cos(-Q)),
                      (j = Math.sin(-Q)),
                      (A = q * N + C * j),
                      (D = U * N + P * j),
                      (z = $ * N + E * j),
                      (C = q * -j + C * N),
                      (P = U * -j + P * N),
                      (E = $ * -j + E * N),
                      (Z = G * -j + Z * N),
                      (q = A),
                      (U = D),
                      ($ = z)),
                    (Q = Math.atan2(C, B)),
                    (_.rotationY = Q * R),
                    Q &&
                      ((W = -T > Q || Q > T),
                      (N = Math.cos(-Q)),
                      (j = Math.sin(-Q)),
                      (A = B * N - C * j),
                      (D = X * N - P * j),
                      (z = H * N - E * j),
                      (P = X * j + P * N),
                      (E = H * j + E * N),
                      (Z = Y * j + Z * N),
                      (B = A),
                      (X = D),
                      (H = z)),
                    (Q = Math.atan2(X, U)),
                    (_.rotation = Q * R),
                    Q &&
                      ((F = -T > Q || Q > T),
                      (N = Math.cos(-Q)),
                      (j = Math.sin(-Q)),
                      (B = B * N + q * j),
                      (D = X * N + U * j),
                      (U = X * -j + U * N),
                      ($ = H * -j + $ * N),
                      (X = D)),
                    F && K
                      ? (_.rotation = _.rotationX = 0)
                      : F && W
                      ? (_.rotation = _.rotationY = 0)
                      : W && K && (_.rotationY = _.rotationX = 0),
                    (_.scaleX = (0 | (Math.sqrt(B * B + X * X) * x + 0.5)) / x),
                    (_.scaleY = (0 | (Math.sqrt(U * U + P * P) * x + 0.5)) / x),
                    (_.scaleZ = (0 | (Math.sqrt($ * $ + E * E) * x + 0.5)) / x),
                    (_.skewX = 0),
                    (_.perspective = Z ? 1 / (0 > Z ? -Z : Z) : 0),
                    (_.x = L),
                    (_.y = I),
                    (_.z = O);
                }
              } else if (
                !(
                  (be &&
                    !n &&
                    r.length &&
                    _.x === r[4] &&
                    _.y === r[5] &&
                    (_.rotationX || _.rotationY)) ||
                  (void 0 !== _.x && "none" === V(t, "display", e))
                )
              ) {
                var J = r.length >= 6,
                  te = J ? r[0] : 1,
                  ee = r[1] || 0,
                  ie = r[2] || 0,
                  ne = J ? r[3] : 1;
                (_.x = r[4] || 0),
                  (_.y = r[5] || 0),
                  (u = Math.sqrt(te * te + ee * ee)),
                  (c = Math.sqrt(ne * ne + ie * ie)),
                  (p = te || ee ? Math.atan2(ee, te) * R : _.rotation || 0),
                  (d = ie || ne ? Math.atan2(ie, ne) * R + p : _.skewX || 0),
                  (f = u - Math.abs(_.scaleX || 0)),
                  (m = c - Math.abs(_.scaleY || 0)),
                  Math.abs(d) > 90 &&
                    270 > Math.abs(d) &&
                    (y
                      ? ((u *= -1),
                        (d += 0 >= p ? 180 : -180),
                        (p += 0 >= p ? 180 : -180))
                      : ((c *= -1), (d += 0 >= d ? 180 : -180))),
                  (g = (p - _.rotation) % 180),
                  (v = (d - _.skewX) % 180),
                  (void 0 === _.skewX ||
                    f > w ||
                    -w > f ||
                    m > w ||
                    -w > m ||
                    (g > -b && b > g && !1 | (g * x)) ||
                    (v > -b && b > v && !1 | (v * x))) &&
                    ((_.scaleX = u),
                    (_.scaleY = c),
                    (_.rotation = p),
                    (_.skewX = d)),
                  be &&
                    ((_.rotationX = _.rotationY = _.z = 0),
                    (_.perspective =
                      parseFloat(o.defaultTransformPerspective) || 0),
                    (_.scaleZ = 1));
              }
              _.zOrigin = S;
              for (a in _) w > _[a] && _[a] > -w && (_[a] = 0);
              return i && (t._gsTransform = _), _;
            },
            Se = function (t) {
              var e,
                i,
                n = this.data,
                s = -n.rotation * k,
                r = s + n.skewX * k,
                o = 1e5,
                a = (0 | (Math.cos(s) * n.scaleX * o)) / o,
                l = (0 | (Math.sin(s) * n.scaleX * o)) / o,
                h = (0 | (Math.sin(r) * -n.scaleY * o)) / o,
                u = (0 | (Math.cos(r) * n.scaleY * o)) / o,
                c = this.t.style,
                p = this.t.currentStyle;
              if (p) {
                (i = l), (l = -h), (h = -i), (e = p.filter), (c.filter = "");
                var d,
                  m,
                  g = this.t.offsetWidth,
                  v = this.t.offsetHeight,
                  _ = "absolute" !== p.position,
                  x =
                    "progid:DXImageTransform.Microsoft.Matrix(M11=" +
                    a +
                    ", M12=" +
                    l +
                    ", M21=" +
                    h +
                    ", M22=" +
                    u,
                  b = n.x,
                  T = n.y;
                if (
                  (null != n.ox &&
                    ((d = (n.oxp ? 0.01 * g * n.ox : n.ox) - g / 2),
                    (m = (n.oyp ? 0.01 * v * n.oy : n.oy) - v / 2),
                    (b += d - (d * a + m * l)),
                    (T += m - (d * h + m * u))),
                  _
                    ? ((d = g / 2),
                      (m = v / 2),
                      (x +=
                        ", Dx=" +
                        (d - (d * a + m * l) + b) +
                        ", Dy=" +
                        (m - (d * h + m * u) + T) +
                        ")"))
                    : (x += ", sizingMethod='auto expand')"),
                  (c.filter =
                    -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(")
                      ? e.replace(I, x)
                      : x + " " + e),
                  (0 === t || 1 === t) &&
                    1 === a &&
                    0 === l &&
                    0 === h &&
                    1 === u &&
                    ((_ && -1 === x.indexOf("Dx=0, Dy=0")) ||
                      (w.test(e) && 100 !== parseFloat(RegExp.$1)) ||
                      (-1 === e.indexOf("gradient(" && e.indexOf("Alpha")) &&
                        c.removeAttribute("filter"))),
                  !_)
                ) {
                  var S,
                    C,
                    P,
                    E = 8 > f ? 1 : -1;
                  for (
                    d = n.ieOffsetX || 0,
                      m = n.ieOffsetY || 0,
                      n.ieOffsetX = Math.round(
                        (g - ((0 > a ? -a : a) * g + (0 > l ? -l : l) * v)) /
                          2 +
                          b
                      ),
                      n.ieOffsetY = Math.round(
                        (v - ((0 > u ? -u : u) * v + (0 > h ? -h : h) * g)) /
                          2 +
                          T
                      ),
                      fe = 0;
                    4 > fe;
                    fe++
                  )
                    (C = J[fe]),
                      (S = p[C]),
                      (i =
                        -1 !== S.indexOf("px")
                          ? parseFloat(S)
                          : $(this.t, C, parseFloat(S), S.replace(y, "")) || 0),
                      (P =
                        i !== n[C]
                          ? 2 > fe
                            ? -n.ieOffsetX
                            : -n.ieOffsetY
                          : 2 > fe
                          ? d - n.ieOffsetX
                          : m - n.ieOffsetY),
                      (c[C] =
                        (n[C] = Math.round(
                          i - P * (0 === fe || 2 === fe ? 1 : E)
                        )) + "px");
                }
              }
            },
            Ce = function () {
              var t,
                e,
                i,
                n,
                s,
                r,
                o,
                a,
                l,
                h,
                u,
                c,
                d,
                f,
                m,
                g,
                v,
                _,
                y,
                w,
                x,
                b,
                T,
                S,
                C,
                P,
                E = this.data,
                L = this.t.style,
                M = E.rotation * k,
                I = E.scaleX,
                O = E.scaleY,
                R = E.scaleZ,
                A = E.perspective;
              if (
                (p &&
                  ((S = L.top
                    ? "top"
                    : L.bottom
                    ? "bottom"
                    : parseFloat(V(this.t, "top", null, !1))
                    ? "bottom"
                    : "top"),
                  (w = V(this.t, S, null, !1)),
                  (C = parseFloat(w) || 0),
                  (P = w.substr((C + "").length) || "px"),
                  (E._ffFix = !E._ffFix),
                  (L[S] = (E._ffFix ? C + 0.05 : C - 0.05) + P)),
                M || E.skewX)
              )
                (_ = Math.cos(M)),
                  (y = Math.sin(M)),
                  (t = _),
                  (s = y),
                  E.skewX &&
                    ((M -= E.skewX * k), (_ = Math.cos(M)), (y = Math.sin(M))),
                  (e = -y),
                  (r = _);
              else {
                if (!(E.rotationY || E.rotationX || 1 !== R || A))
                  return void (L[ye] =
                    "translate3d(" +
                    E.x +
                    "px," +
                    E.y +
                    "px," +
                    E.z +
                    "px)" +
                    (1 !== I || 1 !== O ? " scale(" + I + "," + O + ")" : ""));
                (t = r = 1), (e = s = 0);
              }
              (u = 1),
                (i = n = o = a = l = h = c = d = f = 0),
                (m = A ? -1 / A : 0),
                (g = E.zOrigin),
                (v = 1e5),
                (M = E.rotationY * k),
                M &&
                  ((_ = Math.cos(M)),
                  (y = Math.sin(M)),
                  (l = u * -y),
                  (d = m * -y),
                  (i = t * y),
                  (o = s * y),
                  (u *= _),
                  (m *= _),
                  (t *= _),
                  (s *= _)),
                (M = E.rotationX * k),
                M &&
                  ((_ = Math.cos(M)),
                  (y = Math.sin(M)),
                  (w = e * _ + i * y),
                  (x = r * _ + o * y),
                  (b = h * _ + u * y),
                  (T = f * _ + m * y),
                  (i = e * -y + i * _),
                  (o = r * -y + o * _),
                  (u = h * -y + u * _),
                  (m = f * -y + m * _),
                  (e = w),
                  (r = x),
                  (h = b),
                  (f = T)),
                1 !== R && ((i *= R), (o *= R), (u *= R), (m *= R)),
                1 !== O && ((e *= O), (r *= O), (h *= O), (f *= O)),
                1 !== I && ((t *= I), (s *= I), (l *= I), (d *= I)),
                g && ((c -= g), (n = i * c), (a = o * c), (c = u * c + g)),
                (n = (w = (n += E.x) - (n |= 0))
                  ? (0 | (w * v + (0 > w ? -0.5 : 0.5))) / v + n
                  : n),
                (a = (w = (a += E.y) - (a |= 0))
                  ? (0 | (w * v + (0 > w ? -0.5 : 0.5))) / v + a
                  : a),
                (c = (w = (c += E.z) - (c |= 0))
                  ? (0 | (w * v + (0 > w ? -0.5 : 0.5))) / v + c
                  : c),
                (L[ye] =
                  "matrix3d(" +
                  [
                    (0 | (t * v)) / v,
                    (0 | (s * v)) / v,
                    (0 | (l * v)) / v,
                    (0 | (d * v)) / v,
                    (0 | (e * v)) / v,
                    (0 | (r * v)) / v,
                    (0 | (h * v)) / v,
                    (0 | (f * v)) / v,
                    (0 | (i * v)) / v,
                    (0 | (o * v)) / v,
                    (0 | (u * v)) / v,
                    (0 | (m * v)) / v,
                    n,
                    a,
                    c,
                    A ? 1 + -c / A : 1,
                  ].join(",") +
                  ")");
            },
            Pe = function () {
              var t,
                e,
                i,
                n,
                s,
                r,
                o,
                a,
                l,
                h = this.data,
                u = this.t,
                c = u.style;
              p &&
                ((t = c.top
                  ? "top"
                  : c.bottom
                  ? "bottom"
                  : parseFloat(V(u, "top", null, !1))
                  ? "bottom"
                  : "top"),
                (e = V(u, t, null, !1)),
                (i = parseFloat(e) || 0),
                (n = e.substr((i + "").length) || "px"),
                (h._ffFix = !h._ffFix),
                (c[t] = (h._ffFix ? i + 0.05 : i - 0.05) + n)),
                h.rotation || h.skewX
                  ? ((s = h.rotation * k),
                    (r = s - h.skewX * k),
                    (o = 1e5),
                    (a = h.scaleX * o),
                    (l = h.scaleY * o),
                    (c[ye] =
                      "matrix(" +
                      (0 | (Math.cos(s) * a)) / o +
                      "," +
                      (0 | (Math.sin(s) * a)) / o +
                      "," +
                      (0 | (Math.sin(r) * -l)) / o +
                      "," +
                      (0 | (Math.cos(r) * l)) / o +
                      "," +
                      h.x +
                      "," +
                      h.y +
                      ")"))
                  : (c[ye] =
                      "matrix(" +
                      h.scaleX +
                      ",0,0," +
                      h.scaleY +
                      "," +
                      h.x +
                      "," +
                      h.y +
                      ")");
            };
          ge(
            "transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D",
            {
              parser: function (t, e, i, n, r, o, a) {
                if (n._transform) return r;
                var l,
                  h,
                  u,
                  c,
                  p,
                  d,
                  f,
                  m = (n._transform = Te(t, s, !0, a.parseTransform)),
                  g = t.style,
                  v = 1e-6,
                  _ = _e.length,
                  y = a,
                  w = {};
                if ("string" == typeof y.transform && ye)
                  (u = g.cssText),
                    (g[ye] = y.transform),
                    (g.display = "block"),
                    (l = Te(t, null, !1)),
                    (g.cssText = u);
                else if ("object" == typeof y) {
                  if (
                    ((l = {
                      scaleX: ne(
                        null != y.scaleX ? y.scaleX : y.scale,
                        m.scaleX
                      ),
                      scaleY: ne(
                        null != y.scaleY ? y.scaleY : y.scale,
                        m.scaleY
                      ),
                      scaleZ: ne(
                        null != y.scaleZ ? y.scaleZ : y.scale,
                        m.scaleZ
                      ),
                      x: ne(y.x, m.x),
                      y: ne(y.y, m.y),
                      z: ne(y.z, m.z),
                      perspective: ne(y.transformPerspective, m.perspective),
                    }),
                    (f = y.directionalRotation),
                    null != f)
                  )
                    if ("object" == typeof f) for (u in f) y[u] = f[u];
                    else y.rotation = f;
                  (l.rotation = se(
                    "rotation" in y
                      ? y.rotation
                      : "shortRotation" in y
                      ? y.shortRotation + "_short"
                      : "rotationZ" in y
                      ? y.rotationZ
                      : m.rotation,
                    m.rotation,
                    "rotation",
                    w
                  )),
                    be &&
                      ((l.rotationX = se(
                        "rotationX" in y
                          ? y.rotationX
                          : "shortRotationX" in y
                          ? y.shortRotationX + "_short"
                          : m.rotationX || 0,
                        m.rotationX,
                        "rotationX",
                        w
                      )),
                      (l.rotationY = se(
                        "rotationY" in y
                          ? y.rotationY
                          : "shortRotationY" in y
                          ? y.shortRotationY + "_short"
                          : m.rotationY || 0,
                        m.rotationY,
                        "rotationY",
                        w
                      ))),
                    (l.skewX =
                      null == y.skewX ? m.skewX : se(y.skewX, m.skewX)),
                    (l.skewY =
                      null == y.skewY ? m.skewY : se(y.skewY, m.skewY)),
                    (h = l.skewY - m.skewY) &&
                      ((l.skewX += h), (l.rotation += h));
                }
                for (
                  null != y.force3D && ((m.force3D = y.force3D), (d = !0)),
                    p =
                      m.force3D ||
                      m.z ||
                      m.rotationX ||
                      m.rotationY ||
                      l.z ||
                      l.rotationX ||
                      l.rotationY ||
                      l.perspective,
                    p || null == y.scale || (l.scaleZ = 1);
                  --_ > -1;

                )
                  (i = _e[_]),
                    (c = l[i] - m[i]),
                    (c > v || -v > c || null != A[i]) &&
                      ((d = !0),
                      (r = new pe(m, i, m[i], c, r)),
                      i in w && (r.e = w[i]),
                      (r.xs0 = 0),
                      (r.plugin = o),
                      n._overwriteProps.push(r.n));
                return (
                  (c = y.transformOrigin),
                  (c || (be && p && m.zOrigin)) &&
                    (ye
                      ? ((d = !0),
                        (i = xe),
                        (c = (c || V(t, i, s, !1, "50% 50%")) + ""),
                        (r = new pe(g, i, 0, 0, r, -1, "transformOrigin")),
                        (r.b = g[i]),
                        (r.plugin = o),
                        be
                          ? ((u = m.zOrigin),
                            (c = c.split(" ")),
                            (m.zOrigin =
                              (c.length > 2 && (0 === u || "0px" !== c[2])
                                ? parseFloat(c[2])
                                : u) || 0),
                            (r.xs0 =
                              r.e =
                              g[i] =
                                c[0] + " " + (c[1] || "50%") + " 0px"),
                            (r = new pe(m, "zOrigin", 0, 0, r, -1, r.n)),
                            (r.b = u),
                            (r.xs0 = r.e = m.zOrigin))
                          : (r.xs0 = r.e = g[i] = c))
                      : ee(c + "", m)),
                  d &&
                    (n._transformType = p || 3 === this._transformType ? 3 : 2),
                  r
                );
              },
              prefix: !0,
            }
          ),
            ge("boxShadow", {
              defaultValue: "0px 0px 0px 0px #999",
              prefix: !0,
              color: !0,
              multi: !0,
              keyword: "inset",
            }),
            ge("borderRadius", {
              defaultValue: "0px",
              parser: function (t, e, i, r, o) {
                e = this.format(e);
                var a,
                  l,
                  h,
                  u,
                  c,
                  p,
                  d,
                  f,
                  m,
                  g,
                  v,
                  _,
                  y,
                  w,
                  x,
                  b,
                  T = [
                    "borderTopLeftRadius",
                    "borderTopRightRadius",
                    "borderBottomRightRadius",
                    "borderBottomLeftRadius",
                  ],
                  S = t.style;
                for (
                  m = parseFloat(t.offsetWidth),
                    g = parseFloat(t.offsetHeight),
                    a = e.split(" "),
                    l = 0;
                  T.length > l;
                  l++
                )
                  this.p.indexOf("border") && (T[l] = q(T[l])),
                    (c = u = V(t, T[l], s, !1, "0px")),
                    -1 !== c.indexOf(" ") &&
                      ((u = c.split(" ")), (c = u[0]), (u = u[1])),
                    (p = h = a[l]),
                    (d = parseFloat(c)),
                    (_ = c.substr((d + "").length)),
                    (y = "=" === p.charAt(1)),
                    y
                      ? ((f = parseInt(p.charAt(0) + "1", 10)),
                        (p = p.substr(2)),
                        (f *= parseFloat(p)),
                        (v = p.substr((f + "").length - (0 > f ? 1 : 0)) || ""))
                      : ((f = parseFloat(p)), (v = p.substr((f + "").length))),
                    "" === v && (v = n[i] || _),
                    v !== _ &&
                      ((w = $(t, "borderLeft", d, _)),
                      (x = $(t, "borderTop", d, _)),
                      "%" === v
                        ? ((c = 100 * (w / m) + "%"), (u = 100 * (x / g) + "%"))
                        : "em" === v
                        ? ((b = $(t, "borderLeft", 1, "em")),
                          (c = w / b + "em"),
                          (u = x / b + "em"))
                        : ((c = w + "px"), (u = x + "px")),
                      y &&
                        ((p = parseFloat(c) + f + v),
                        (h = parseFloat(u) + f + v))),
                    (o = de(S, T[l], c + " " + u, p + " " + h, !1, "0px", o));
                return o;
              },
              prefix: !0,
              formatter: he("0px 0px 0px 0px", !1, !0),
            }),
            ge("backgroundPosition", {
              defaultValue: "0 0",
              parser: function (t, e, i, n, r, o) {
                var a,
                  l,
                  h,
                  u,
                  c,
                  p,
                  d = "background-position",
                  m = s || U(t, null),
                  g = this.format(
                    (m
                      ? f
                        ? m.getPropertyValue(d + "-x") +
                          " " +
                          m.getPropertyValue(d + "-y")
                        : m.getPropertyValue(d)
                      : t.currentStyle.backgroundPositionX +
                        " " +
                        t.currentStyle.backgroundPositionY) || "0 0"
                  ),
                  v = this.format(e);
                if (
                  (-1 !== g.indexOf("%")) != (-1 !== v.indexOf("%")) &&
                  ((p = V(t, "backgroundImage").replace(P, "")),
                  p && "none" !== p)
                ) {
                  for (
                    a = g.split(" "),
                      l = v.split(" "),
                      N.setAttribute("src", p),
                      h = 2;
                    --h > -1;

                  )
                    (g = a[h]),
                      (u = -1 !== g.indexOf("%")),
                      u !== (-1 !== l[h].indexOf("%")) &&
                        ((c =
                          0 === h
                            ? t.offsetWidth - N.width
                            : t.offsetHeight - N.height),
                        (a[h] = u
                          ? (parseFloat(g) / 100) * c + "px"
                          : 100 * (parseFloat(g) / c) + "%"));
                  g = a.join(" ");
                }
                return this.parseComplex(t.style, g, v, r, o);
              },
              formatter: ee,
            }),
            ge("backgroundSize", { defaultValue: "0 0", formatter: ee }),
            ge("perspective", { defaultValue: "0px", prefix: !0 }),
            ge("perspectiveOrigin", { defaultValue: "50% 50%", prefix: !0 }),
            ge("transformStyle", { prefix: !0 }),
            ge("backfaceVisibility", { prefix: !0 }),
            ge("userSelect", { prefix: !0 }),
            ge("margin", {
              parser: ue("marginTop,marginRight,marginBottom,marginLeft"),
            }),
            ge("padding", {
              parser: ue("paddingTop,paddingRight,paddingBottom,paddingLeft"),
            }),
            ge("clip", {
              defaultValue: "rect(0px,0px,0px,0px)",
              parser: function (t, e, i, n, r, o) {
                var a, l, h;
                return (
                  9 > f
                    ? ((l = t.currentStyle),
                      (h = 8 > f ? " " : ","),
                      (a =
                        "rect(" +
                        l.clipTop +
                        h +
                        l.clipRight +
                        h +
                        l.clipBottom +
                        h +
                        l.clipLeft +
                        ")"),
                      (e = this.format(e).split(",").join(h)))
                    : ((a = this.format(V(t, this.p, s, !1, this.dflt))),
                      (e = this.format(e))),
                  this.parseComplex(t.style, a, e, r, o)
                );
              },
            }),
            ge("textShadow", {
              defaultValue: "0px 0px 0px #999",
              color: !0,
              multi: !0,
            }),
            ge("autoRound,strictUnits", {
              parser: function (t, e, i, n, s) {
                return s;
              },
            }),
            ge("border", {
              defaultValue: "0px solid #000",
              parser: function (t, e, i, n, r, o) {
                return this.parseComplex(
                  t.style,
                  this.format(
                    V(t, "borderTopWidth", s, !1, "0px") +
                      " " +
                      V(t, "borderTopStyle", s, !1, "solid") +
                      " " +
                      V(t, "borderTopColor", s, !1, "#000")
                  ),
                  this.format(e),
                  r,
                  o
                );
              },
              color: !0,
              formatter: function (t) {
                var e = t.split(" ");
                return (
                  e[0] +
                  " " +
                  (e[1] || "solid") +
                  " " +
                  (t.match(le) || ["#000"])[0]
                );
              },
            }),
            ge("float,cssFloat,styleFloat", {
              parser: function (t, e, i, n, s) {
                var r = t.style,
                  o = "cssFloat" in r ? "cssFloat" : "styleFloat";
                return new pe(r, o, 0, 0, s, -1, i, !1, 0, r[o], e);
              },
            });
          var Ee = function (t) {
            var e,
              i = this.t,
              n = i.filter || V(this.data, "filter"),
              s = 0 | (this.s + this.c * t);
            100 === s &&
              (-1 === n.indexOf("atrix(") &&
              -1 === n.indexOf("radient(") &&
              -1 === n.indexOf("oader(")
                ? (i.removeAttribute("filter"), (e = !V(this.data, "filter")))
                : ((i.filter = n.replace(b, "")), (e = !0))),
              e ||
                (this.xn1 && (i.filter = n = n || "alpha(opacity=" + s + ")"),
                -1 === n.indexOf("opacity")
                  ? (0 === s && this.xn1) ||
                    (i.filter = n + " alpha(opacity=" + s + ")")
                  : (i.filter = n.replace(w, "opacity=" + s)));
          };
          ge("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function (t, e, i, n, r, o) {
              var a = parseFloat(V(t, "opacity", s, !1, "1")),
                l = t.style,
                h = "autoAlpha" === i;
              return (
                "string" == typeof e &&
                  "=" === e.charAt(1) &&
                  (e =
                    ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) +
                    a),
                h &&
                  1 === a &&
                  "hidden" === V(t, "visibility", s) &&
                  0 !== e &&
                  (a = 0),
                F
                  ? (r = new pe(l, "opacity", a, e - a, r))
                  : ((r = new pe(l, "opacity", 100 * a, 100 * (e - a), r)),
                    (r.xn1 = h ? 1 : 0),
                    (l.zoom = 1),
                    (r.type = 2),
                    (r.b = "alpha(opacity=" + r.s + ")"),
                    (r.e = "alpha(opacity=" + (r.s + r.c) + ")"),
                    (r.data = t),
                    (r.plugin = o),
                    (r.setRatio = Ee)),
                h &&
                  ((r = new pe(
                    l,
                    "visibility",
                    0,
                    0,
                    r,
                    -1,
                    null,
                    !1,
                    0,
                    0 !== a ? "inherit" : "hidden",
                    0 === e ? "hidden" : "inherit"
                  )),
                  (r.xs0 = "inherit"),
                  n._overwriteProps.push(r.n),
                  n._overwriteProps.push(i)),
                r
              );
            },
          });
          var Le = function (t, e) {
              e &&
                (t.removeProperty
                  ? t.removeProperty(e.replace(S, "-$1").toLowerCase())
                  : t.removeAttribute(e));
            },
            Me = function (t) {
              if (((this.t._gsClassPT = this), 1 === t || 0 === t)) {
                this.t.className = 0 === t ? this.b : this.e;
                for (var e = this.data, i = this.t.style; e; )
                  e.v ? (i[e.p] = e.v) : Le(i, e.p), (e = e._next);
                1 === t &&
                  this.t._gsClassPT === this &&
                  (this.t._gsClassPT = null);
              } else this.t.className !== this.e && (this.t.className = this.e);
            };
          ge("className", {
            parser: function (t, e, n, r, o, a, l) {
              var h,
                u,
                c,
                p,
                d,
                f = t.className,
                m = t.style.cssText;
              if (
                ((o = r._classNamePT = new pe(t, n, 0, 0, o, 2)),
                (o.setRatio = Me),
                (o.pr = -11),
                (i = !0),
                (o.b = f),
                (u = Z(t, s)),
                (c = t._gsClassPT))
              ) {
                for (p = {}, d = c.data; d; ) (p[d.p] = 1), (d = d._next);
                c.setRatio(1);
              }
              return (
                (t._gsClassPT = o),
                (o.e =
                  "=" !== e.charAt(1)
                    ? e
                    : f.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") +
                      ("+" === e.charAt(0) ? " " + e.substr(2) : "")),
                r._tween._duration &&
                  ((t.className = o.e),
                  (h = Q(t, u, Z(t), l, p)),
                  (t.className = f),
                  (o.data = h.firstMPT),
                  (t.style.cssText = m),
                  (o = o.xfirst = r.parse(t, h.difs, o, a))),
                o
              );
            },
          });
          var Ie = function (t) {
            if (
              (1 === t || 0 === t) &&
              this.data._totalTime === this.data._totalDuration &&
              "isFromStart" !== this.data.data
            ) {
              var e,
                i,
                n,
                s,
                r = this.t.style,
                o = a.transform.parse;
              if ("all" === this.e) (r.cssText = ""), (s = !0);
              else
                for (e = this.e.split(","), n = e.length; --n > -1; )
                  (i = e[n]),
                    a[i] &&
                      (a[i].parse === o
                        ? (s = !0)
                        : (i = "transformOrigin" === i ? xe : a[i].p)),
                    Le(r, i);
              s &&
                (Le(r, ye), this.t._gsTransform && delete this.t._gsTransform);
            }
          };
          for (
            ge("clearProps", {
              parser: function (t, e, n, s, r) {
                return (
                  (r = new pe(t, n, 0, 0, r, 2)),
                  (r.setRatio = Ie),
                  (r.e = e),
                  (r.pr = -10),
                  (r.data = s._tween),
                  (i = !0),
                  r
                );
              },
            }),
              l = "bezier,throwProps,physicsProps,physics2D".split(","),
              fe = l.length;
            fe--;

          )
            ve(l[fe]);
          (l = o.prototype),
            (l._firstPT = null),
            (l._onInitTween = function (t, e, a) {
              if (!t.nodeType) return !1;
              (this._target = t),
                (this._tween = a),
                (this._vars = e),
                (h = e.autoRound),
                (i = !1),
                (n = e.suffixMap || o.suffixMap),
                (s = U(t, "")),
                (r = this._overwriteProps);
              var l,
                p,
                f,
                m,
                g,
                v,
                _,
                y,
                w,
                b = t.style;
              if (
                (u &&
                  "" === b.zIndex &&
                  ((l = V(t, "zIndex", s)),
                  ("auto" === l || "" === l) && (b.zIndex = 0)),
                "string" == typeof e &&
                  ((m = b.cssText),
                  (l = Z(t, s)),
                  (b.cssText = m + ";" + e),
                  (l = Q(t, l, Z(t)).difs),
                  !F && x.test(e) && (l.opacity = parseFloat(RegExp.$1)),
                  (e = l),
                  (b.cssText = m)),
                (this._firstPT = p = this.parse(t, e, null)),
                this._transformType)
              ) {
                for (
                  w = 3 === this._transformType,
                    ye
                      ? c &&
                        ((u = !0),
                        "" === b.zIndex &&
                          ((_ = V(t, "zIndex", s)),
                          ("auto" === _ || "" === _) && (b.zIndex = 0)),
                        d &&
                          (b.WebkitBackfaceVisibility =
                            this._vars.WebkitBackfaceVisibility ||
                            (w ? "visible" : "hidden")))
                      : (b.zoom = 1),
                    f = p;
                  f && f._next;

                )
                  f = f._next;
                (y = new pe(t, "transform", 0, 0, null, 2)),
                  this._linkCSSP(y, null, f),
                  (y.setRatio = w && be ? Ce : ye ? Pe : Se),
                  (y.data = this._transform || Te(t, s, !0)),
                  r.pop();
              }
              if (i) {
                for (; p; ) {
                  for (v = p._next, f = m; f && f.pr > p.pr; ) f = f._next;
                  (p._prev = f ? f._prev : g) ? (p._prev._next = p) : (m = p),
                    (p._next = f) ? (f._prev = p) : (g = p),
                    (p = v);
                }
                this._firstPT = m;
              }
              return !0;
            }),
            (l.parse = function (t, e, i, r) {
              var o,
                l,
                u,
                c,
                p,
                d,
                f,
                m,
                g,
                v,
                _ = t.style;
              for (o in e)
                (d = e[o]),
                  (l = a[o]),
                  l
                    ? (i = l.parse(t, d, o, this, i, r, e))
                    : ((p = V(t, o, s) + ""),
                      (g = "string" == typeof d),
                      "color" === o ||
                      "fill" === o ||
                      "stroke" === o ||
                      -1 !== o.indexOf("Color") ||
                      (g && T.test(d))
                        ? (g ||
                            ((d = ae(d)),
                            (d =
                              (d.length > 3 ? "rgba(" : "rgb(") +
                              d.join(",") +
                              ")")),
                          (i = de(_, o, p, d, !0, "transparent", i, 0, r)))
                        : !g || (-1 === d.indexOf(" ") && -1 === d.indexOf(","))
                        ? ((u = parseFloat(p)),
                          (f = u || 0 === u ? p.substr((u + "").length) : ""),
                          ("" === p || "auto" === p) &&
                            ("width" === o || "height" === o
                              ? ((u = te(t, o, s)), (f = "px"))
                              : "left" === o || "top" === o
                              ? ((u = G(t, o, s)), (f = "px"))
                              : ((u = "opacity" !== o ? 0 : 1), (f = ""))),
                          (v = g && "=" === d.charAt(1)),
                          v
                            ? ((c = parseInt(d.charAt(0) + "1", 10)),
                              (d = d.substr(2)),
                              (c *= parseFloat(d)),
                              (m = d.replace(y, "")))
                            : ((c = parseFloat(d)),
                              (m = g ? d.substr((c + "").length) || "" : "")),
                          "" === m && (m = n[o] || f),
                          (d = c || 0 === c ? (v ? c + u : c) + m : e[o]),
                          f !== m &&
                            "" !== m &&
                            (c || 0 === c) &&
                            (u || 0 === u) &&
                            ((u = $(t, o, u, f)),
                            "%" === m
                              ? ((u /= $(t, o, 100, "%") / 100),
                                u > 100 && (u = 100),
                                e.strictUnits !== !0 && (p = u + "%"))
                              : "em" === m
                              ? (u /= $(t, o, 1, "em"))
                              : ((c = $(t, o, c, m)), (m = "px")),
                            v && (c || 0 === c) && (d = c + u + m)),
                          v && (c += u),
                          (!u && 0 !== u) || (!c && 0 !== c)
                            ? void 0 !== _[o] &&
                              (d || ("NaN" != d + "" && null != d))
                              ? ((i = new pe(
                                  _,
                                  o,
                                  c || u || 0,
                                  0,
                                  i,
                                  -1,
                                  o,
                                  !1,
                                  0,
                                  p,
                                  d
                                )),
                                (i.xs0 =
                                  "none" !== d ||
                                  ("display" !== o && -1 === o.indexOf("Style"))
                                    ? d
                                    : p))
                              : X("invalid " + o + " tween value: " + e[o])
                            : ((i = new pe(
                                _,
                                o,
                                u,
                                c - u,
                                i,
                                0,
                                o,
                                h !== !1 && ("px" === m || "zIndex" === o),
                                0,
                                p,
                                d
                              )),
                              (i.xs0 = m)))
                        : (i = de(_, o, p, d, !0, null, i, 0, r))),
                  r && i && !i.plugin && (i.plugin = r);
              return i;
            }),
            (l.setRatio = function (t) {
              var e,
                i,
                n,
                s = this._firstPT,
                r = 1e-6;
              if (
                1 !== t ||
                (this._tween._time !== this._tween._duration &&
                  0 !== this._tween._time)
              )
                if (
                  t ||
                  (this._tween._time !== this._tween._duration &&
                    0 !== this._tween._time) ||
                  this._tween._rawPrevTime === -1e-6
                )
                  for (; s; ) {
                    if (
                      ((e = s.c * t + s.s),
                      s.r
                        ? (e = e > 0 ? 0 | (e + 0.5) : 0 | (e - 0.5))
                        : r > e && e > -r && (e = 0),
                      s.type)
                    )
                      if (1 === s.type)
                        if (((n = s.l), 2 === n))
                          s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2;
                        else if (3 === n)
                          s.t[s.p] =
                            s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3;
                        else if (4 === n)
                          s.t[s.p] =
                            s.xs0 +
                            e +
                            s.xs1 +
                            s.xn1 +
                            s.xs2 +
                            s.xn2 +
                            s.xs3 +
                            s.xn3 +
                            s.xs4;
                        else if (5 === n)
                          s.t[s.p] =
                            s.xs0 +
                            e +
                            s.xs1 +
                            s.xn1 +
                            s.xs2 +
                            s.xn2 +
                            s.xs3 +
                            s.xn3 +
                            s.xs4 +
                            s.xn4 +
                            s.xs5;
                        else {
                          for (i = s.xs0 + e + s.xs1, n = 1; s.l > n; n++)
                            i += s["xn" + n] + s["xs" + (n + 1)];
                          s.t[s.p] = i;
                        }
                      else
                        -1 === s.type
                          ? (s.t[s.p] = s.xs0)
                          : s.setRatio && s.setRatio(t);
                    else s.t[s.p] = e + s.xs0;
                    s = s._next;
                  }
                else
                  for (; s; )
                    2 !== s.type ? (s.t[s.p] = s.b) : s.setRatio(t),
                      (s = s._next);
              else
                for (; s; )
                  2 !== s.type ? (s.t[s.p] = s.e) : s.setRatio(t),
                    (s = s._next);
            }),
            (l._enableTransforms = function (t) {
              (this._transformType = t || 3 === this._transformType ? 3 : 2),
                (this._transform = this._transform || Te(this._target, s, !0));
            }),
            (l._linkCSSP = function (t, e, i, n) {
              return (
                t &&
                  (e && (e._prev = t),
                  t._next && (t._next._prev = t._prev),
                  t._prev
                    ? (t._prev._next = t._next)
                    : this._firstPT === t &&
                      ((this._firstPT = t._next), (n = !0)),
                  i
                    ? (i._next = t)
                    : n || null !== this._firstPT || (this._firstPT = t),
                  (t._next = e),
                  (t._prev = i)),
                t
              );
            }),
            (l._kill = function (e) {
              var i,
                n,
                s,
                r = e;
              if (e.autoAlpha || e.alpha) {
                r = {};
                for (n in e) r[n] = e[n];
                (r.opacity = 1), r.autoAlpha && (r.visibility = 1);
              }
              return (
                e.className &&
                  (i = this._classNamePT) &&
                  ((s = i.xfirst),
                  s && s._prev
                    ? this._linkCSSP(s._prev, i._next, s._prev._prev)
                    : s === this._firstPT && (this._firstPT = i._next),
                  i._next && this._linkCSSP(i._next, i._next._next, s._prev),
                  (this._classNamePT = null)),
                t.prototype._kill.call(this, r)
              );
            });
          var Oe = function (t, e, i) {
            var n, s, r, o;
            if (t.slice) for (s = t.length; --s > -1; ) Oe(t[s], e, i);
            else
              for (n = t.childNodes, s = n.length; --s > -1; )
                (r = n[s]),
                  (o = r.type),
                  r.style && (e.push(Z(r)), i && i.push(r)),
                  (1 !== o && 9 !== o && 11 !== o) ||
                    !r.childNodes.length ||
                    Oe(r, e, i);
          };
          return (
            (o.cascadeTo = function (t, i, n) {
              var s,
                r,
                o,
                a = e.to(t, i, n),
                l = [a],
                h = [],
                u = [],
                c = [],
                p = e._internals.reservedProps;
              for (
                t = a._targets || a.target,
                  Oe(t, h, c),
                  a.render(i, !0),
                  Oe(t, u),
                  a.render(0, !0),
                  a._enabled(!0),
                  s = c.length;
                --s > -1;

              )
                if (((r = Q(c[s], h[s], u[s])), r.firstMPT)) {
                  r = r.difs;
                  for (o in n) p[o] && (r[o] = n[o]);
                  l.push(e.to(c[s], i, r));
                }
              return l;
            }),
            t.activate([o]),
            o
          );
        },
        !0
      ),
      (function () {
        var t = window._gsDefine.plugin({
            propName: "roundProps",
            priority: -1,
            API: 2,
            init: function (t, e, i) {
              return (this._tween = i), !0;
            },
          }),
          e = t.prototype;
        (e._onInitAllProps = function () {
          for (
            var t,
              e,
              i,
              n = this._tween,
              s =
                n.vars.roundProps instanceof Array
                  ? n.vars.roundProps
                  : n.vars.roundProps.split(","),
              r = s.length,
              o = {},
              a = n._propLookup.roundProps;
            --r > -1;

          )
            o[s[r]] = 1;
          for (r = s.length; --r > -1; )
            for (t = s[r], e = n._firstPT; e; )
              (i = e._next),
                e.pg
                  ? e.t._roundProps(o, !0)
                  : e.n === t &&
                    (this._add(e.t, t, e.s, e.c),
                    i && (i._prev = e._prev),
                    e._prev
                      ? (e._prev._next = i)
                      : n._firstPT === e && (n._firstPT = i),
                    (e._next = e._prev = null),
                    (n._propLookup[t] = a)),
                (e = i);
          return !1;
        }),
          (e._add = function (t, e, i, n) {
            this._addTween(t, e, i, i + n, e, !0), this._overwriteProps.push(e);
          });
      })(),
      window._gsDefine.plugin({
        propName: "attr",
        API: 2,
        init: function (t, e) {
          var i;
          if ("function" != typeof t.setAttribute) return !1;
          (this._target = t), (this._proxy = {});
          for (i in e)
            this._addTween(
              this._proxy,
              i,
              parseFloat(t.getAttribute(i)),
              e[i],
              i
            ) && this._overwriteProps.push(i);
          return !0;
        },
        set: function (t) {
          this._super.setRatio.call(this, t);
          for (var e, i = this._overwriteProps, n = i.length; --n > -1; )
            (e = i[n]), this._target.setAttribute(e, this._proxy[e] + "");
        },
      }),
      (window._gsDefine.plugin({
        propName: "directionalRotation",
        API: 2,
        init: function (t, e) {
          "object" != typeof e && (e = { rotation: e }), (this.finals = {});
          var i,
            n,
            s,
            r,
            o,
            a,
            l = e.useRadians === !0 ? 2 * Math.PI : 360,
            h = 1e-6;
          for (i in e)
            "useRadians" !== i &&
              ((a = (e[i] + "").split("_")),
              (n = a[0]),
              (s = parseFloat(
                "function" != typeof t[i]
                  ? t[i]
                  : t[
                      i.indexOf("set") ||
                      "function" != typeof t["get" + i.substr(3)]
                        ? i
                        : "get" + i.substr(3)
                    ]()
              )),
              (r = this.finals[i] =
                "string" == typeof n && "=" === n.charAt(1)
                  ? s + parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2))
                  : Number(n) || 0),
              (o = r - s),
              a.length &&
                ((n = a.join("_")),
                -1 !== n.indexOf("short") &&
                  ((o %= l), o !== o % (l / 2) && (o = 0 > o ? o + l : o - l)),
                -1 !== n.indexOf("_cw") && 0 > o
                  ? (o = ((o + 9999999999 * l) % l) - (0 | (o / l)) * l)
                  : -1 !== n.indexOf("ccw") &&
                    o > 0 &&
                    (o = ((o - 9999999999 * l) % l) - (0 | (o / l)) * l)),
              (o > h || -h > o) &&
                (this._addTween(t, i, s, s + o, i),
                this._overwriteProps.push(i)));
          return !0;
        },
        set: function (t) {
          var e;
          if (1 !== t) this._super.setRatio.call(this, t);
          else
            for (e = this._firstPT; e; )
              e.f ? e.t[e.p](this.finals[e.p]) : (e.t[e.p] = this.finals[e.p]),
                (e = e._next);
        },
      })._autoCSS = !0),
      window._gsDefine(
        "easing.Back",
        ["easing.Ease"],
        function (t) {
          var e,
            i,
            n,
            s = window.GreenSockGlobals || window,
            r = s.com.greensock,
            o = 2 * Math.PI,
            a = Math.PI / 2,
            l = r._class,
            h = function (e, i) {
              var n = l("easing." + e, function () {}, !0),
                s = (n.prototype = new t());
              return (s.constructor = n), (s.getRatio = i), n;
            },
            u = t.register || function () {},
            c = function (t, e, i, n) {
              var s = l(
                "easing." + t,
                { easeOut: new e(), easeIn: new i(), easeInOut: new n() },
                !0
              );
              return u(s, t), s;
            },
            p = function (t, e, i) {
              (this.t = t),
                (this.v = e),
                i &&
                  ((this.next = i),
                  (i.prev = this),
                  (this.c = i.v - e),
                  (this.gap = i.t - t));
            },
            d = function (e, i) {
              var n = l(
                  "easing." + e,
                  function (t) {
                    (this._p1 = t || 0 === t ? t : 1.70158),
                      (this._p2 = 1.525 * this._p1);
                  },
                  !0
                ),
                s = (n.prototype = new t());
              return (
                (s.constructor = n),
                (s.getRatio = i),
                (s.config = function (t) {
                  return new n(t);
                }),
                n
              );
            },
            f = c(
              "Back",
              d("BackOut", function (t) {
                return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1;
              }),
              d("BackIn", function (t) {
                return t * t * ((this._p1 + 1) * t - this._p1);
              }),
              d("BackInOut", function (t) {
                return 1 > (t *= 2)
                  ? 0.5 * t * t * ((this._p2 + 1) * t - this._p2)
                  : 0.5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2);
              })
            ),
            m = l(
              "easing.SlowMo",
              function (t, e, i) {
                (e = e || 0 === e ? e : 0.7),
                  null == t ? (t = 0.7) : t > 1 && (t = 1),
                  (this._p = 1 !== t ? e : 0),
                  (this._p1 = (1 - t) / 2),
                  (this._p2 = t),
                  (this._p3 = this._p1 + this._p2),
                  (this._calcEnd = i === !0);
              },
              !0
            ),
            g = (m.prototype = new t());
          return (
            (g.constructor = m),
            (g.getRatio = function (t) {
              var e = t + (0.5 - t) * this._p;
              return this._p1 > t
                ? this._calcEnd
                  ? 1 - (t = 1 - t / this._p1) * t
                  : e - (t = 1 - t / this._p1) * t * t * t * e
                : t > this._p3
                ? this._calcEnd
                  ? 1 - (t = (t - this._p3) / this._p1) * t
                  : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t
                : this._calcEnd
                ? 1
                : e;
            }),
            (m.ease = new m(0.7, 0.7)),
            (g.config = m.config =
              function (t, e, i) {
                return new m(t, e, i);
              }),
            (e = l(
              "easing.SteppedEase",
              function (t) {
                (t = t || 1), (this._p1 = 1 / t), (this._p2 = t + 1);
              },
              !0
            )),
            (g = e.prototype = new t()),
            (g.constructor = e),
            (g.getRatio = function (t) {
              return (
                0 > t ? (t = 0) : t >= 1 && (t = 0.999999999),
                ((this._p2 * t) >> 0) * this._p1
              );
            }),
            (g.config = e.config =
              function (t) {
                return new e(t);
              }),
            (i = l(
              "easing.RoughEase",
              function (e) {
                e = e || {};
                for (
                  var i,
                    n,
                    s,
                    r,
                    o,
                    a,
                    l = e.taper || "none",
                    h = [],
                    u = 0,
                    c = 0 | (e.points || 20),
                    d = c,
                    f = e.randomize !== !1,
                    m = e.clamp === !0,
                    g = e.template instanceof t ? e.template : null,
                    v = "number" == typeof e.strength ? 0.4 * e.strength : 0.4;
                  --d > -1;

                )
                  (i = f ? Math.random() : (1 / c) * d),
                    (n = g ? g.getRatio(i) : i),
                    "none" === l
                      ? (s = v)
                      : "out" === l
                      ? ((r = 1 - i), (s = r * r * v))
                      : "in" === l
                      ? (s = i * i * v)
                      : 0.5 > i
                      ? ((r = 2 * i), (s = 0.5 * r * r * v))
                      : ((r = 2 * (1 - i)), (s = 0.5 * r * r * v)),
                    f
                      ? (n += Math.random() * s - 0.5 * s)
                      : d % 2
                      ? (n += 0.5 * s)
                      : (n -= 0.5 * s),
                    m && (n > 1 ? (n = 1) : 0 > n && (n = 0)),
                    (h[u++] = { x: i, y: n });
                for (
                  h.sort(function (t, e) {
                    return t.x - e.x;
                  }),
                    a = new p(1, 1, null),
                    d = c;
                  --d > -1;

                )
                  (o = h[d]), (a = new p(o.x, o.y, a));
                this._prev = new p(0, 0, 0 !== a.t ? a : a.next);
              },
              !0
            )),
            (g = i.prototype = new t()),
            (g.constructor = i),
            (g.getRatio = function (t) {
              var e = this._prev;
              if (t > e.t) {
                for (; e.next && t >= e.t; ) e = e.next;
                e = e.prev;
              } else for (; e.prev && e.t >= t; ) e = e.prev;
              return (this._prev = e), e.v + ((t - e.t) / e.gap) * e.c;
            }),
            (g.config = function (t) {
              return new i(t);
            }),
            (i.ease = new i()),
            c(
              "Bounce",
              h("BounceOut", function (t) {
                return 1 / 2.75 > t
                  ? 7.5625 * t * t
                  : 2 / 2.75 > t
                  ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                  : 2.5 / 2.75 > t
                  ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                  : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
              }),
              h("BounceIn", function (t) {
                return 1 / 2.75 > (t = 1 - t)
                  ? 1 - 7.5625 * t * t
                  : 2 / 2.75 > t
                  ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + 0.75)
                  : 2.5 / 2.75 > t
                  ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375)
                  : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
              }),
              h("BounceInOut", function (t) {
                var e = 0.5 > t;
                return (
                  (t = e ? 1 - 2 * t : 2 * t - 1),
                  (t =
                    1 / 2.75 > t
                      ? 7.5625 * t * t
                      : 2 / 2.75 > t
                      ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
                      : 2.5 / 2.75 > t
                      ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
                      : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375),
                  e ? 0.5 * (1 - t) : 0.5 * t + 0.5
                );
              })
            ),
            c(
              "Circ",
              h("CircOut", function (t) {
                return Math.sqrt(1 - (t -= 1) * t);
              }),
              h("CircIn", function (t) {
                return -(Math.sqrt(1 - t * t) - 1);
              }),
              h("CircInOut", function (t) {
                return 1 > (t *= 2)
                  ? -0.5 * (Math.sqrt(1 - t * t) - 1)
                  : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
              })
            ),
            (n = function (e, i, n) {
              var s = l(
                  "easing." + e,
                  function (t, e) {
                    (this._p1 = t || 1),
                      (this._p2 = e || n),
                      (this._p3 =
                        (this._p2 / o) * (Math.asin(1 / this._p1) || 0));
                  },
                  !0
                ),
                r = (s.prototype = new t());
              return (
                (r.constructor = s),
                (r.getRatio = i),
                (r.config = function (t, e) {
                  return new s(t, e);
                }),
                s
              );
            }),
            c(
              "Elastic",
              n(
                "ElasticOut",
                function (t) {
                  return (
                    this._p1 *
                      Math.pow(2, -10 * t) *
                      Math.sin(((t - this._p3) * o) / this._p2) +
                    1
                  );
                },
                0.3
              ),
              n(
                "ElasticIn",
                function (t) {
                  return -(
                    this._p1 *
                    Math.pow(2, 10 * (t -= 1)) *
                    Math.sin(((t - this._p3) * o) / this._p2)
                  );
                },
                0.3
              ),
              n(
                "ElasticInOut",
                function (t) {
                  return 1 > (t *= 2)
                    ? -0.5 *
                        this._p1 *
                        Math.pow(2, 10 * (t -= 1)) *
                        Math.sin(((t - this._p3) * o) / this._p2)
                    : 0.5 *
                        this._p1 *
                        Math.pow(2, -10 * (t -= 1)) *
                        Math.sin(((t - this._p3) * o) / this._p2) +
                        1;
                },
                0.45
              )
            ),
            c(
              "Expo",
              h("ExpoOut", function (t) {
                return 1 - Math.pow(2, -10 * t);
              }),
              h("ExpoIn", function (t) {
                return Math.pow(2, 10 * (t - 1)) - 0.001;
              }),
              h("ExpoInOut", function (t) {
                return 1 > (t *= 2)
                  ? 0.5 * Math.pow(2, 10 * (t - 1))
                  : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
              })
            ),
            c(
              "Sine",
              h("SineOut", function (t) {
                return Math.sin(t * a);
              }),
              h("SineIn", function (t) {
                return -Math.cos(t * a) + 1;
              }),
              h("SineInOut", function (t) {
                return -0.5 * (Math.cos(Math.PI * t) - 1);
              })
            ),
            l(
              "easing.EaseLookup",
              {
                find: function (e) {
                  return t.map[e];
                },
              },
              !0
            ),
            u(s.SlowMo, "SlowMo", "ease,"),
            u(i, "RoughEase", "ease,"),
            u(e, "SteppedEase", "ease,"),
            f
          );
        },
        !0
      );
  }),
  (function (t) {
    "use strict";
    var e = t.GreenSockGlobals || t;
    if (!e.TweenLite) {
      var i,
        n,
        s,
        r,
        o,
        a = function (t) {
          var i,
            n = t.split("."),
            s = e;
          for (i = 0; n.length > i; i++) s[n[i]] = s = s[n[i]] || {};
          return s;
        },
        l = a("com.greensock"),
        h = 1e-10,
        u = [].slice,
        c = function () {},
        p = (function () {
          var t = Object.prototype.toString,
            e = t.call([]);
          return function (i) {
            return (
              i instanceof Array ||
              ("object" == typeof i && !!i.push && t.call(i) === e)
            );
          };
        })(),
        d = {},
        f = function (i, n, s, r) {
          (this.sc = d[i] ? d[i].sc : []),
            (d[i] = this),
            (this.gsClass = null),
            (this.func = s);
          var o = [];
          (this.check = function (l) {
            for (var h, u, c, p, m = n.length, g = m; --m > -1; )
              (h = d[n[m]] || new f(n[m], [])).gsClass
                ? ((o[m] = h.gsClass), g--)
                : l && h.sc.push(this);
            if (0 === g && s)
              for (
                u = ("com.greensock." + i).split("."),
                  c = u.pop(),
                  p = a(u.join("."))[c] = this.gsClass = s.apply(s, o),
                  r &&
                    ((e[c] = p),
                    "function" == typeof define && define.amd
                      ? define(
                          (t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") +
                            i.split(".").join("/"),
                          [],
                          function () {
                            return p;
                          }
                        )
                      : "undefined" != typeof module &&
                        module.exports &&
                        (module.exports = p)),
                  m = 0;
                this.sc.length > m;
                m++
              )
                this.sc[m].check();
          }),
            this.check(!0);
        },
        m = (t._gsDefine = function (t, e, i, n) {
          return new f(t, e, i, n);
        }),
        g = (l._class = function (t, e, i) {
          return (
            (e = e || function () {}),
            m(
              t,
              [],
              function () {
                return e;
              },
              i
            ),
            e
          );
        });
      m.globals = e;
      var v = [0, 0, 1, 1],
        _ = [],
        y = g(
          "easing.Ease",
          function (t, e, i, n) {
            (this._func = t),
              (this._type = i || 0),
              (this._power = n || 0),
              (this._params = e ? v.concat(e) : v);
          },
          !0
        ),
        w = (y.map = {}),
        x = (y.register = function (t, e, i, n) {
          for (
            var s,
              r,
              o,
              a,
              h = e.split(","),
              u = h.length,
              c = (i || "easeIn,easeOut,easeInOut").split(",");
            --u > -1;

          )
            for (
              r = h[u],
                s = n ? g("easing." + r, null, !0) : l.easing[r] || {},
                o = c.length;
              --o > -1;

            )
              (a = c[o]),
                (w[r + "." + a] =
                  w[a + r] =
                  s[a] =
                    t.getRatio ? t : t[a] || new t());
        });
      for (
        s = y.prototype,
          s._calcEnd = !1,
          s.getRatio = function (t) {
            if (this._func)
              return (
                (this._params[0] = t), this._func.apply(null, this._params)
              );
            var e = this._type,
              i = this._power,
              n = 1 === e ? 1 - t : 2 === e ? t : 0.5 > t ? 2 * t : 2 * (1 - t);
            return (
              1 === i
                ? (n *= n)
                : 2 === i
                ? (n *= n * n)
                : 3 === i
                ? (n *= n * n * n)
                : 4 === i && (n *= n * n * n * n),
              1 === e ? 1 - n : 2 === e ? n : 0.5 > t ? n / 2 : 1 - n / 2
            );
          },
          i = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"],
          n = i.length;
        --n > -1;

      )
        (s = i[n] + ",Power" + n),
          x(new y(null, null, 1, n), s, "easeOut", !0),
          x(
            new y(null, null, 2, n),
            s,
            "easeIn" + (0 === n ? ",easeNone" : "")
          ),
          x(new y(null, null, 3, n), s, "easeInOut");
      (w.linear = l.easing.Linear.easeIn), (w.swing = l.easing.Quad.easeInOut);
      var b = g("events.EventDispatcher", function (t) {
        (this._listeners = {}), (this._eventTarget = t || this);
      });
      (s = b.prototype),
        (s.addEventListener = function (t, e, i, n, s) {
          s = s || 0;
          var a,
            l,
            h = this._listeners[t],
            u = 0;
          for (
            null == h && (this._listeners[t] = h = []), l = h.length;
            --l > -1;

          )
            (a = h[l]),
              a.c === e && a.s === i
                ? h.splice(l, 1)
                : 0 === u && s > a.pr && (u = l + 1);
          h.splice(u, 0, { c: e, s: i, up: n, pr: s }),
            this !== r || o || r.wake();
        }),
        (s.removeEventListener = function (t, e) {
          var i,
            n = this._listeners[t];
          if (n)
            for (i = n.length; --i > -1; )
              if (n[i].c === e) return void n.splice(i, 1);
        }),
        (s.dispatchEvent = function (t) {
          var e,
            i,
            n,
            s = this._listeners[t];
          if (s)
            for (e = s.length, i = this._eventTarget; --e > -1; )
              (n = s[e]),
                n.up
                  ? n.c.call(n.s || i, { type: t, target: i })
                  : n.c.call(n.s || i);
        });
      var T = t.requestAnimationFrame,
        S = t.cancelAnimationFrame,
        C =
          Date.now ||
          function () {
            return new Date().getTime();
          },
        P = C();
      for (i = ["ms", "moz", "webkit", "o"], n = i.length; --n > -1 && !T; )
        (T = t[i[n] + "RequestAnimationFrame"]),
          (S =
            t[i[n] + "CancelAnimationFrame"] ||
            t[i[n] + "CancelRequestAnimationFrame"]);
      g("Ticker", function (t, e) {
        var i,
          n,
          s,
          a,
          l,
          h = this,
          u = C(),
          p = e !== !1 && T,
          d = function (t) {
            (P = C()), (h.time = (P - u) / 1e3);
            var e,
              r = h.time - l;
            (!i || r > 0 || t === !0) &&
              (h.frame++, (l += r + (r >= a ? 0.004 : a - r)), (e = !0)),
              t !== !0 && (s = n(d)),
              e && h.dispatchEvent("tick");
          };
        b.call(h),
          (h.time = h.frame = 0),
          (h.tick = function () {
            d(!0);
          }),
          (h.sleep = function () {
            null != s &&
              (p && S ? S(s) : clearTimeout(s),
              (n = c),
              (s = null),
              h === r && (o = !1));
          }),
          (h.wake = function () {
            null !== s && h.sleep(),
              (n =
                0 === i
                  ? c
                  : p && T
                  ? T
                  : function (t) {
                      return setTimeout(t, 0 | (1e3 * (l - h.time) + 1));
                    }),
              h === r && (o = !0),
              d(2);
          }),
          (h.fps = function (t) {
            return arguments.length
              ? ((i = t),
                (a = 1 / (i || 60)),
                (l = this.time + a),
                void h.wake())
              : i;
          }),
          (h.useRAF = function (t) {
            return arguments.length ? (h.sleep(), (p = t), void h.fps(i)) : p;
          }),
          h.fps(t),
          setTimeout(function () {
            p && (!s || 5 > h.frame) && h.useRAF(!1);
          }, 1500);
      }),
        (s = l.Ticker.prototype = new l.events.EventDispatcher()),
        (s.constructor = l.Ticker);
      var E = g("core.Animation", function (t, e) {
        if (
          ((this.vars = e = e || {}),
          (this._duration = this._totalDuration = t || 0),
          (this._delay = Number(e.delay) || 0),
          (this._timeScale = 1),
          (this._active = e.immediateRender === !0),
          (this.data = e.data),
          (this._reversed = e.reversed === !0),
          F)
        ) {
          o || r.wake();
          var i = this.vars.useFrames ? W : F;
          i.add(this, i._time), this.vars.paused && this.paused(!0);
        }
      });
      (r = E.ticker = new l.Ticker()),
        (s = E.prototype),
        (s._dirty = s._gc = s._initted = s._paused = !1),
        (s._totalTime = s._time = 0),
        (s._rawPrevTime = -1),
        (s._next = s._last = s._onUpdate = s._timeline = s.timeline = null),
        (s._paused = !1);
      var L = function () {
        C() - P > 2e3 && r.wake(), setTimeout(L, 2e3);
      };
      L(),
        (s.play = function (t, e) {
          return (
            arguments.length && this.seek(t, e), this.reversed(!1).paused(!1)
          );
        }),
        (s.pause = function (t, e) {
          return arguments.length && this.seek(t, e), this.paused(!0);
        }),
        (s.resume = function (t, e) {
          return arguments.length && this.seek(t, e), this.paused(!1);
        }),
        (s.seek = function (t, e) {
          return this.totalTime(Number(t), e !== !1);
        }),
        (s.restart = function (t, e) {
          return this.reversed(!1)
            .paused(!1)
            .totalTime(t ? -this._delay : 0, e !== !1, !0);
        }),
        (s.reverse = function (t, e) {
          return (
            arguments.length && this.seek(t || this.totalDuration(), e),
            this.reversed(!0).paused(!1)
          );
        }),
        (s.render = function () {}),
        (s.invalidate = function () {
          return this;
        }),
        (s.isActive = function () {
          var t,
            e = this._timeline,
            i = this._startTime;
          return (
            !e ||
            (!this._gc &&
              !this._paused &&
              e.isActive() &&
              (t = e.rawTime()) >= i &&
              i + this.totalDuration() / this._timeScale > t)
          );
        }),
        (s._enabled = function (t, e) {
          return (
            o || r.wake(),
            (this._gc = !t),
            (this._active = this.isActive()),
            e !== !0 &&
              (t && !this.timeline
                ? this._timeline.add(this, this._startTime - this._delay)
                : !t && this.timeline && this._timeline._remove(this, !0)),
            !1
          );
        }),
        (s._kill = function () {
          return this._enabled(!1, !1);
        }),
        (s.kill = function (t, e) {
          return this._kill(t, e), this;
        }),
        (s._uncache = function (t) {
          for (var e = t ? this : this.timeline; e; )
            (e._dirty = !0), (e = e.timeline);
          return this;
        }),
        (s._swapSelfInParams = function (t) {
          for (var e = t.length, i = t.concat(); --e > -1; )
            "{self}" === t[e] && (i[e] = this);
          return i;
        }),
        (s.eventCallback = function (t, e, i, n) {
          if ("on" === (t || "").substr(0, 2)) {
            var s = this.vars;
            if (1 === arguments.length) return s[t];
            null == e
              ? delete s[t]
              : ((s[t] = e),
                (s[t + "Params"] =
                  p(i) && -1 !== i.join("").indexOf("{self}")
                    ? this._swapSelfInParams(i)
                    : i),
                (s[t + "Scope"] = n)),
              "onUpdate" === t && (this._onUpdate = e);
          }
          return this;
        }),
        (s.delay = function (t) {
          return arguments.length
            ? (this._timeline.smoothChildTiming &&
                this.startTime(this._startTime + t - this._delay),
              (this._delay = t),
              this)
            : this._delay;
        }),
        (s.duration = function (t) {
          return arguments.length
            ? ((this._duration = this._totalDuration = t),
              this._uncache(!0),
              this._timeline.smoothChildTiming &&
                this._time > 0 &&
                this._time < this._duration &&
                0 !== t &&
                this.totalTime(this._totalTime * (t / this._duration), !0),
              this)
            : ((this._dirty = !1), this._duration);
        }),
        (s.totalDuration = function (t) {
          return (
            (this._dirty = !1),
            arguments.length ? this.duration(t) : this._totalDuration
          );
        }),
        (s.time = function (t, e) {
          return arguments.length
            ? (this._dirty && this.totalDuration(),
              this.totalTime(t > this._duration ? this._duration : t, e))
            : this._time;
        }),
        (s.totalTime = function (t, e, i) {
          if ((o || r.wake(), !arguments.length)) return this._totalTime;
          if (this._timeline) {
            if (
              (0 > t && !i && (t += this.totalDuration()),
              this._timeline.smoothChildTiming)
            ) {
              this._dirty && this.totalDuration();
              var n = this._totalDuration,
                s = this._timeline;
              if (
                (t > n && !i && (t = n),
                (this._startTime =
                  (this._paused ? this._pauseTime : s._time) -
                  (this._reversed ? n - t : t) / this._timeScale),
                s._dirty || this._uncache(!1),
                s._timeline)
              )
                for (; s._timeline; )
                  s._timeline._time !==
                    (s._startTime + s._totalTime) / s._timeScale &&
                    s.totalTime(s._totalTime, !0),
                    (s = s._timeline);
            }
            this._gc && this._enabled(!0, !1),
              (this._totalTime !== t || 0 === this._duration) &&
                this.render(t, e, !1);
          }
          return this;
        }),
        (s.progress = s.totalProgress =
          function (t, e) {
            return arguments.length
              ? this.totalTime(this.duration() * t, e)
              : this._time / this.duration();
          }),
        (s.startTime = function (t) {
          return arguments.length
            ? (t !== this._startTime &&
                ((this._startTime = t),
                this.timeline &&
                  this.timeline._sortChildren &&
                  this.timeline.add(this, t - this._delay)),
              this)
            : this._startTime;
        }),
        (s.timeScale = function (t) {
          if (!arguments.length) return this._timeScale;
          if (
            ((t = t || h), this._timeline && this._timeline.smoothChildTiming)
          ) {
            var e = this._pauseTime,
              i = e || 0 === e ? e : this._timeline.totalTime();
            this._startTime = i - ((i - this._startTime) * this._timeScale) / t;
          }
          return (this._timeScale = t), this._uncache(!1);
        }),
        (s.reversed = function (t) {
          return arguments.length
            ? (t != this._reversed &&
                ((this._reversed = t), this.totalTime(this._totalTime, !0)),
              this)
            : this._reversed;
        }),
        (s.paused = function (t) {
          if (!arguments.length) return this._paused;
          if (t != this._paused && this._timeline) {
            o || t || r.wake();
            var e = this._timeline,
              i = e.rawTime(),
              n = i - this._pauseTime;
            !t &&
              e.smoothChildTiming &&
              ((this._startTime += n), this._uncache(!1)),
              (this._pauseTime = t ? i : null),
              (this._paused = t),
              (this._active = this.isActive()),
              !t &&
                0 !== n &&
                this._initted &&
                this.duration() &&
                this.render(
                  e.smoothChildTiming
                    ? this._totalTime
                    : (i - this._startTime) / this._timeScale,
                  !0,
                  !0
                );
          }
          return this._gc && !t && this._enabled(!0, !1), this;
        });
      var M = g("core.SimpleTimeline", function (t) {
        E.call(this, 0, t),
          (this.autoRemoveChildren = this.smoothChildTiming = !0);
      });
      (s = M.prototype = new E()),
        (s.constructor = M),
        (s.kill()._gc = !1),
        (s._first = s._last = null),
        (s._sortChildren = !1),
        (s.add = s.insert =
          function (t, e) {
            var i, n;
            if (
              ((t._startTime = Number(e || 0) + t._delay),
              t._paused &&
                this !== t._timeline &&
                (t._pauseTime =
                  t._startTime +
                  (this.rawTime() - t._startTime) / t._timeScale),
              t.timeline && t.timeline._remove(t, !0),
              (t.timeline = t._timeline = this),
              t._gc && t._enabled(!0, !0),
              (i = this._last),
              this._sortChildren)
            )
              for (n = t._startTime; i && i._startTime > n; ) i = i._prev;
            return (
              i
                ? ((t._next = i._next), (i._next = t))
                : ((t._next = this._first), (this._first = t)),
              t._next ? (t._next._prev = t) : (this._last = t),
              (t._prev = i),
              this._timeline && this._uncache(!0),
              this
            );
          }),
        (s._remove = function (t, e) {
          return (
            t.timeline === this &&
              (e || t._enabled(!1, !0),
              (t.timeline = null),
              t._prev
                ? (t._prev._next = t._next)
                : this._first === t && (this._first = t._next),
              t._next
                ? (t._next._prev = t._prev)
                : this._last === t && (this._last = t._prev),
              this._timeline && this._uncache(!0)),
            this
          );
        }),
        (s.render = function (t, e, i) {
          var n,
            s = this._first;
          for (this._totalTime = this._time = this._rawPrevTime = t; s; )
            (n = s._next),
              (s._active || (t >= s._startTime && !s._paused)) &&
                (s._reversed
                  ? s.render(
                      (s._dirty ? s.totalDuration() : s._totalDuration) -
                        (t - s._startTime) * s._timeScale,
                      e,
                      i
                    )
                  : s.render((t - s._startTime) * s._timeScale, e, i)),
              (s = n);
        }),
        (s.rawTime = function () {
          return o || r.wake(), this._totalTime;
        });
      var I = g(
          "TweenLite",
          function (e, i, n) {
            if (
              (E.call(this, i, n),
              (this.render = I.prototype.render),
              null == e)
            )
              throw "Cannot tween a null target.";
            this.target = e = "string" != typeof e ? e : I.selector(e) || e;
            var s,
              r,
              o,
              a =
                e.jquery ||
                (e.length &&
                  e !== t &&
                  e[0] &&
                  (e[0] === t || (e[0].nodeType && e[0].style && !e.nodeType))),
              l = this.vars.overwrite;
            if (
              ((this._overwrite = l =
                null == l
                  ? j[I.defaultOverwrite]
                  : "number" == typeof l
                  ? l >> 0
                  : j[l]),
              (a || e instanceof Array || (e.push && p(e))) &&
                "number" != typeof e[0])
            )
              for (
                this._targets = o = u.call(e, 0),
                  this._propLookup = [],
                  this._siblings = [],
                  s = 0;
                o.length > s;
                s++
              )
                (r = o[s]),
                  r
                    ? "string" != typeof r
                      ? r.length &&
                        r !== t &&
                        r[0] &&
                        (r[0] === t ||
                          (r[0].nodeType && r[0].style && !r.nodeType))
                        ? (o.splice(s--, 1),
                          (this._targets = o = o.concat(u.call(r, 0))))
                        : ((this._siblings[s] = B(r, this, !1)),
                          1 === l &&
                            this._siblings[s].length > 1 &&
                            X(r, this, null, 1, this._siblings[s]))
                      : ((r = o[s--] = I.selector(r)),
                        "string" == typeof r && o.splice(s + 1, 1))
                    : o.splice(s--, 1);
            else
              (this._propLookup = {}),
                (this._siblings = B(e, this, !1)),
                1 === l &&
                  this._siblings.length > 1 &&
                  X(e, this, null, 1, this._siblings);
            (this.vars.immediateRender ||
              (0 === i &&
                0 === this._delay &&
                this.vars.immediateRender !== !1)) &&
              this.render(-this._delay, !1, !0);
          },
          !0
        ),
        O = function (e) {
          return (
            e.length &&
            e !== t &&
            e[0] &&
            (e[0] === t || (e[0].nodeType && e[0].style && !e.nodeType))
          );
        },
        k = function (t, e) {
          var i,
            n = {};
          for (i in t)
            N[i] ||
              (i in e &&
                "x" !== i &&
                "y" !== i &&
                "width" !== i &&
                "height" !== i &&
                "className" !== i &&
                "border" !== i) ||
              !(!A[i] || (A[i] && A[i]._autoCSS)) ||
              ((n[i] = t[i]), delete t[i]);
          t.css = n;
        };
      (s = I.prototype = new E()),
        (s.constructor = I),
        (s.kill()._gc = !1),
        (s.ratio = 0),
        (s._firstPT = s._targets = s._overwrittenProps = s._startAt = null),
        (s._notifyPluginsOfEnabled = !1),
        (I.version = "1.11.1"),
        (I.defaultEase = s._ease = new y(null, null, 1, 1)),
        (I.defaultOverwrite = "auto"),
        (I.ticker = r),
        (I.autoSleep = !0),
        (I.selector =
          t.$ ||
          t.jQuery ||
          function (e) {
            return t.$
              ? ((I.selector = t.$), t.$(e))
              : t.document
              ? t.document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
              : e;
          });
      var R = (I._internals = { isArray: p, isSelector: O }),
        A = (I._plugins = {}),
        D = (I._tweenLookup = {}),
        z = 0,
        N = (R.reservedProps = {
          ease: 1,
          delay: 1,
          overwrite: 1,
          onComplete: 1,
          onCompleteParams: 1,
          onCompleteScope: 1,
          useFrames: 1,
          runBackwards: 1,
          startAt: 1,
          onUpdate: 1,
          onUpdateParams: 1,
          onUpdateScope: 1,
          onStart: 1,
          onStartParams: 1,
          onStartScope: 1,
          onReverseComplete: 1,
          onReverseCompleteParams: 1,
          onReverseCompleteScope: 1,
          onRepeat: 1,
          onRepeatParams: 1,
          onRepeatScope: 1,
          easeParams: 1,
          yoyo: 1,
          immediateRender: 1,
          repeat: 1,
          repeatDelay: 1,
          data: 1,
          paused: 1,
          reversed: 1,
          autoCSS: 1,
        }),
        j = {
          none: 0,
          all: 1,
          auto: 2,
          concurrent: 3,
          allOnStart: 4,
          preexisting: 5,
          true: 1,
          false: 0,
        },
        W = (E._rootFramesTimeline = new M()),
        F = (E._rootTimeline = new M());
      (F._startTime = r.time),
        (W._startTime = r.frame),
        (F._active = W._active = !0),
        (E._updateRoot = function () {
          if (
            (F.render((r.time - F._startTime) * F._timeScale, !1, !1),
            W.render((r.frame - W._startTime) * W._timeScale, !1, !1),
            !(r.frame % 120))
          ) {
            var t, e, i;
            for (i in D) {
              for (e = D[i].tweens, t = e.length; --t > -1; )
                e[t]._gc && e.splice(t, 1);
              0 === e.length && delete D[i];
            }
            if (
              ((i = F._first),
              (!i || i._paused) &&
                I.autoSleep &&
                !W._first &&
                1 === r._listeners.tick.length)
            ) {
              for (; i && i._paused; ) i = i._next;
              i || r.sleep();
            }
          }
        }),
        r.addEventListener("tick", E._updateRoot);
      var B = function (t, e, i) {
          var n,
            s,
            r = t._gsTweenID;
          if (
            (D[r || (t._gsTweenID = r = "t" + z++)] ||
              (D[r] = { target: t, tweens: [] }),
            e && ((n = D[r].tweens), (n[(s = n.length)] = e), i))
          )
            for (; --s > -1; ) n[s] === e && n.splice(s, 1);
          return D[r].tweens;
        },
        X = function (t, e, i, n, s) {
          var r, o, a, l;
          if (1 === n || n >= 4) {
            for (l = s.length, r = 0; l > r; r++)
              if ((a = s[r]) !== e) a._gc || (a._enabled(!1, !1) && (o = !0));
              else if (5 === n) break;
            return o;
          }
          var u,
            c = e._startTime + h,
            p = [],
            d = 0,
            f = 0 === e._duration;
          for (r = s.length; --r > -1; )
            (a = s[r]) === e ||
              a._gc ||
              a._paused ||
              (a._timeline !== e._timeline
                ? ((u = u || H(e, 0, f)), 0 === H(a, u, f) && (p[d++] = a))
                : c >= a._startTime &&
                  a._startTime + a.totalDuration() / a._timeScale + h > c &&
                  (((f || !a._initted) && 2e-10 >= c - a._startTime) ||
                    (p[d++] = a)));
          for (r = d; --r > -1; )
            (a = p[r]),
              2 === n && a._kill(i, t) && (o = !0),
              (2 !== n || (!a._firstPT && a._initted)) &&
                a._enabled(!1, !1) &&
                (o = !0);
          return o;
        },
        H = function (t, e, i) {
          for (
            var n = t._timeline, s = n._timeScale, r = t._startTime;
            n._timeline;

          ) {
            if (((r += n._startTime), (s *= n._timeScale), n._paused))
              return -100;
            n = n._timeline;
          }
          return (
            (r /= s),
            r > e
              ? r - e
              : (i && r === e) || (!t._initted && 2 * h > r - e)
              ? h
              : (r += t.totalDuration() / t._timeScale / s) > e + h
              ? 0
              : r - e - h
          );
        };
      (s._init = function () {
        var t,
          e,
          i,
          n,
          s = this.vars,
          r = this._overwrittenProps,
          o = this._duration,
          a = s.immediateRender,
          l = s.ease;
        if (s.startAt) {
          if (
            (this._startAt && this._startAt.render(-1, !0),
            (s.startAt.overwrite = 0),
            (s.startAt.immediateRender = !0),
            (this._startAt = I.to(this.target, 0, s.startAt)),
            a)
          )
            if (this._time > 0) this._startAt = null;
            else if (0 !== o) return;
        } else if (s.runBackwards && 0 !== o)
          if (this._startAt)
            this._startAt.render(-1, !0), (this._startAt = null);
          else {
            i = {};
            for (n in s) (N[n] && "autoCSS" !== n) || (i[n] = s[n]);
            if (
              ((i.overwrite = 0),
              (i.data = "isFromStart"),
              (this._startAt = I.to(this.target, 0, i)),
              s.immediateRender)
            ) {
              if (0 === this._time) return;
            } else this._startAt.render(-1, !0);
          }
        if (
          ((this._ease = l
            ? l instanceof y
              ? s.easeParams instanceof Array
                ? l.config.apply(l, s.easeParams)
                : l
              : "function" == typeof l
              ? new y(l, s.easeParams)
              : w[l] || I.defaultEase
            : I.defaultEase),
          (this._easeType = this._ease._type),
          (this._easePower = this._ease._power),
          (this._firstPT = null),
          this._targets)
        )
          for (t = this._targets.length; --t > -1; )
            this._initProps(
              this._targets[t],
              (this._propLookup[t] = {}),
              this._siblings[t],
              r ? r[t] : null
            ) && (e = !0);
        else
          e = this._initProps(this.target, this._propLookup, this._siblings, r);
        if (
          (e && I._onPluginEvent("_onInitAllProps", this),
          r &&
            (this._firstPT ||
              ("function" != typeof this.target && this._enabled(!1, !1))),
          s.runBackwards)
        )
          for (i = this._firstPT; i; )
            (i.s += i.c), (i.c = -i.c), (i = i._next);
        (this._onUpdate = s.onUpdate), (this._initted = !0);
      }),
        (s._initProps = function (e, i, n, s) {
          var r, o, a, l, h, u;
          if (null == e) return !1;
          this.vars.css ||
            (e.style &&
              e !== t &&
              e.nodeType &&
              A.css &&
              this.vars.autoCSS !== !1 &&
              k(this.vars, e));
          for (r in this.vars) {
            if (((u = this.vars[r]), N[r]))
              u &&
                (u instanceof Array || (u.push && p(u))) &&
                -1 !== u.join("").indexOf("{self}") &&
                (this.vars[r] = u = this._swapSelfInParams(u, this));
            else if (
              A[r] &&
              (l = new A[r]())._onInitTween(e, this.vars[r], this)
            ) {
              for (
                this._firstPT = h =
                  {
                    _next: this._firstPT,
                    t: l,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: !0,
                    n: r,
                    pg: !0,
                    pr: l._priority,
                  },
                  o = l._overwriteProps.length;
                --o > -1;

              )
                i[l._overwriteProps[o]] = this._firstPT;
              (l._priority || l._onInitAllProps) && (a = !0),
                (l._onDisable || l._onEnable) &&
                  (this._notifyPluginsOfEnabled = !0);
            } else
              (this._firstPT =
                i[r] =
                h =
                  {
                    _next: this._firstPT,
                    t: e,
                    p: r,
                    f: "function" == typeof e[r],
                    n: r,
                    pg: !1,
                    pr: 0,
                  }),
                (h.s = h.f
                  ? e[
                      r.indexOf("set") ||
                      "function" != typeof e["get" + r.substr(3)]
                        ? r
                        : "get" + r.substr(3)
                    ]()
                  : parseFloat(e[r])),
                (h.c =
                  "string" == typeof u && "=" === u.charAt(1)
                    ? parseInt(u.charAt(0) + "1", 10) * Number(u.substr(2))
                    : Number(u) - h.s || 0);
            h && h._next && (h._next._prev = h);
          }
          return s && this._kill(s, e)
            ? this._initProps(e, i, n, s)
            : this._overwrite > 1 &&
              this._firstPT &&
              n.length > 1 &&
              X(e, this, i, this._overwrite, n)
            ? (this._kill(i, e), this._initProps(e, i, n, s))
            : a;
        }),
        (s.render = function (t, e, i) {
          var n,
            s,
            r,
            o,
            a = this._time,
            l = this._duration;
          if (t >= l)
            (this._totalTime = this._time = l),
              (this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
              this._reversed || ((n = !0), (s = "onComplete")),
              0 === l &&
                ((o = this._rawPrevTime),
                (0 === t || 0 > o || o === h) &&
                  o !== t &&
                  ((i = !0), o > h && (s = "onReverseComplete")),
                (this._rawPrevTime = o = !e || t ? t : h));
          else if (1e-7 > t)
            (this._totalTime = this._time = 0),
              (this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0),
              (0 !== a || (0 === l && this._rawPrevTime > h)) &&
                ((s = "onReverseComplete"), (n = this._reversed)),
              0 > t
                ? ((this._active = !1),
                  0 === l &&
                    (this._rawPrevTime >= 0 && (i = !0),
                    (this._rawPrevTime = o = !e || t ? t : h)))
                : this._initted || (i = !0);
          else if (((this._totalTime = this._time = t), this._easeType)) {
            var u = t / l,
              c = this._easeType,
              p = this._easePower;
            (1 === c || (3 === c && u >= 0.5)) && (u = 1 - u),
              3 === c && (u *= 2),
              1 === p
                ? (u *= u)
                : 2 === p
                ? (u *= u * u)
                : 3 === p
                ? (u *= u * u * u)
                : 4 === p && (u *= u * u * u * u),
              (this.ratio =
                1 === c
                  ? 1 - u
                  : 2 === c
                  ? u
                  : 0.5 > t / l
                  ? u / 2
                  : 1 - u / 2);
          } else this.ratio = this._ease.getRatio(t / l);
          if (this._time !== a || i) {
            if (!this._initted) {
              if ((this._init(), !this._initted || this._gc)) return;
              this._time && !n
                ? (this.ratio = this._ease.getRatio(this._time / l))
                : n &&
                  this._ease._calcEnd &&
                  (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
            }
            for (
              this._active ||
                (!this._paused &&
                  this._time !== a &&
                  t >= 0 &&
                  (this._active = !0)),
                0 === a &&
                  (this._startAt &&
                    (t >= 0
                      ? this._startAt.render(t, e, i)
                      : s || (s = "_dummyGS")),
                  this.vars.onStart &&
                    (0 !== this._time || 0 === l) &&
                    (e ||
                      this.vars.onStart.apply(
                        this.vars.onStartScope || this,
                        this.vars.onStartParams || _
                      ))),
                r = this._firstPT;
              r;

            )
              r.f
                ? r.t[r.p](r.c * this.ratio + r.s)
                : (r.t[r.p] = r.c * this.ratio + r.s),
                (r = r._next);
            this._onUpdate &&
              (0 > t &&
                this._startAt &&
                this._startTime &&
                this._startAt.render(t, e, i),
              e ||
                (i && 0 === this._time && 0 === a) ||
                this._onUpdate.apply(
                  this.vars.onUpdateScope || this,
                  this.vars.onUpdateParams || _
                )),
              s &&
                (this._gc ||
                  (0 > t &&
                    this._startAt &&
                    !this._onUpdate &&
                    this._startTime &&
                    this._startAt.render(t, e, i),
                  n &&
                    (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                    (this._active = !1)),
                  !e &&
                    this.vars[s] &&
                    this.vars[s].apply(
                      this.vars[s + "Scope"] || this,
                      this.vars[s + "Params"] || _
                    ),
                  0 === l &&
                    this._rawPrevTime === h &&
                    o !== h &&
                    (this._rawPrevTime = 0)));
          }
        }),
        (s._kill = function (t, e) {
          if (
            ("all" === t && (t = null),
            null == t && (null == e || e === this.target))
          )
            return this._enabled(!1, !1);
          e =
            "string" != typeof e
              ? e || this._targets || this.target
              : I.selector(e) || e;
          var i, n, s, r, o, a, l, h;
          if ((p(e) || O(e)) && "number" != typeof e[0])
            for (i = e.length; --i > -1; ) this._kill(t, e[i]) && (a = !0);
          else {
            if (this._targets) {
              for (i = this._targets.length; --i > -1; )
                if (e === this._targets[i]) {
                  (o = this._propLookup[i] || {}),
                    (this._overwrittenProps = this._overwrittenProps || []),
                    (n = this._overwrittenProps[i] =
                      t ? this._overwrittenProps[i] || {} : "all");
                  break;
                }
            } else {
              if (e !== this.target) return !1;
              (o = this._propLookup),
                (n = this._overwrittenProps =
                  t ? this._overwrittenProps || {} : "all");
            }
            if (o) {
              (l = t || o),
                (h =
                  t !== n &&
                  "all" !== n &&
                  t !== o &&
                  ("object" != typeof t || !t._tempKill));
              for (s in l)
                (r = o[s]) &&
                  (r.pg && r.t._kill(l) && (a = !0),
                  (r.pg && 0 !== r.t._overwriteProps.length) ||
                    (r._prev
                      ? (r._prev._next = r._next)
                      : r === this._firstPT && (this._firstPT = r._next),
                    r._next && (r._next._prev = r._prev),
                    (r._next = r._prev = null)),
                  delete o[s]),
                  h && (n[s] = 1);
              !this._firstPT && this._initted && this._enabled(!1, !1);
            }
          }
          return a;
        }),
        (s.invalidate = function () {
          return (
            this._notifyPluginsOfEnabled &&
              I._onPluginEvent("_onDisable", this),
            (this._firstPT = null),
            (this._overwrittenProps = null),
            (this._onUpdate = null),
            (this._startAt = null),
            (this._initted = this._active = this._notifyPluginsOfEnabled = !1),
            (this._propLookup = this._targets ? {} : []),
            this
          );
        }),
        (s._enabled = function (t, e) {
          if ((o || r.wake(), t && this._gc)) {
            var i,
              n = this._targets;
            if (n)
              for (i = n.length; --i > -1; )
                this._siblings[i] = B(n[i], this, !0);
            else this._siblings = B(this.target, this, !0);
          }
          return (
            E.prototype._enabled.call(this, t, e),
            this._notifyPluginsOfEnabled && this._firstPT
              ? I._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
              : !1
          );
        }),
        (I.to = function (t, e, i) {
          return new I(t, e, i);
        }),
        (I.from = function (t, e, i) {
          return (
            (i.runBackwards = !0),
            (i.immediateRender = 0 != i.immediateRender),
            new I(t, e, i)
          );
        }),
        (I.fromTo = function (t, e, i, n) {
          return (
            (n.startAt = i),
            (n.immediateRender =
              0 != n.immediateRender && 0 != i.immediateRender),
            new I(t, e, n)
          );
        }),
        (I.delayedCall = function (t, e, i, n, s) {
          return new I(e, 0, {
            delay: t,
            onComplete: e,
            onCompleteParams: i,
            onCompleteScope: n,
            onReverseComplete: e,
            onReverseCompleteParams: i,
            onReverseCompleteScope: n,
            immediateRender: !1,
            useFrames: s,
            overwrite: 0,
          });
        }),
        (I.set = function (t, e) {
          return new I(t, 0, e);
        }),
        (I.getTweensOf = function (t, e) {
          if (null == t) return [];
          t = "string" != typeof t ? t : I.selector(t) || t;
          var i, n, s, r;
          if ((p(t) || O(t)) && "number" != typeof t[0]) {
            for (i = t.length, n = []; --i > -1; )
              n = n.concat(I.getTweensOf(t[i], e));
            for (i = n.length; --i > -1; )
              for (r = n[i], s = i; --s > -1; ) r === n[s] && n.splice(i, 1);
          } else
            for (n = B(t).concat(), i = n.length; --i > -1; )
              (n[i]._gc || (e && !n[i].isActive())) && n.splice(i, 1);
          return n;
        }),
        (I.killTweensOf = I.killDelayedCallsTo =
          function (t, e, i) {
            "object" == typeof e && ((i = e), (e = !1));
            for (var n = I.getTweensOf(t, e), s = n.length; --s > -1; )
              n[s]._kill(i, t);
          });
      var Y = g(
        "plugins.TweenPlugin",
        function (t, e) {
          (this._overwriteProps = (t || "").split(",")),
            (this._propName = this._overwriteProps[0]),
            (this._priority = e || 0),
            (this._super = Y.prototype);
        },
        !0
      );
      if (
        ((s = Y.prototype),
        (Y.version = "1.10.1"),
        (Y.API = 2),
        (s._firstPT = null),
        (s._addTween = function (t, e, i, n, s, r) {
          var o, a;
          return null != n &&
            (o =
              "number" == typeof n || "=" !== n.charAt(1)
                ? Number(n) - i
                : parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2)))
            ? ((this._firstPT = a =
                {
                  _next: this._firstPT,
                  t: t,
                  p: e,
                  s: i,
                  c: o,
                  f: "function" == typeof t[e],
                  n: s || e,
                  r: r,
                }),
              a._next && (a._next._prev = a),
              a)
            : void 0;
        }),
        (s.setRatio = function (t) {
          for (var e, i = this._firstPT, n = 1e-6; i; )
            (e = i.c * t + i.s),
              i.r
                ? (e = 0 | (e + (e > 0 ? 0.5 : -0.5)))
                : n > e && e > -n && (e = 0),
              i.f ? i.t[i.p](e) : (i.t[i.p] = e),
              (i = i._next);
        }),
        (s._kill = function (t) {
          var e,
            i = this._overwriteProps,
            n = this._firstPT;
          if (null != t[this._propName]) this._overwriteProps = [];
          else for (e = i.length; --e > -1; ) null != t[i[e]] && i.splice(e, 1);
          for (; n; )
            null != t[n.n] &&
              (n._next && (n._next._prev = n._prev),
              n._prev
                ? ((n._prev._next = n._next), (n._prev = null))
                : this._firstPT === n && (this._firstPT = n._next)),
              (n = n._next);
          return !1;
        }),
        (s._roundProps = function (t, e) {
          for (var i = this._firstPT; i; )
            (t[this._propName] ||
              (null != i.n && t[i.n.split(this._propName + "_").join("")])) &&
              (i.r = e),
              (i = i._next);
        }),
        (I._onPluginEvent = function (t, e) {
          var i,
            n,
            s,
            r,
            o,
            a = e._firstPT;
          if ("_onInitAllProps" === t) {
            for (; a; ) {
              for (o = a._next, n = s; n && n.pr > a.pr; ) n = n._next;
              (a._prev = n ? n._prev : r) ? (a._prev._next = a) : (s = a),
                (a._next = n) ? (n._prev = a) : (r = a),
                (a = o);
            }
            a = e._firstPT = s;
          }
          for (; a; )
            a.pg && "function" == typeof a.t[t] && a.t[t]() && (i = !0),
              (a = a._next);
          return i;
        }),
        (Y.activate = function (t) {
          for (var e = t.length; --e > -1; )
            t[e].API === Y.API && (A[new t[e]()._propName] = t[e]);
          return !0;
        }),
        (m.plugin = function (t) {
          if (!(t && t.propName && t.init && t.API))
            throw "illegal plugin definition.";
          var e,
            i = t.propName,
            n = t.priority || 0,
            s = t.overwriteProps,
            r = {
              init: "_onInitTween",
              set: "setRatio",
              kill: "_kill",
              round: "_roundProps",
              initAll: "_onInitAllProps",
            },
            o = g(
              "plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin",
              function () {
                Y.call(this, i, n), (this._overwriteProps = s || []);
              },
              t.global === !0
            ),
            a = (o.prototype = new Y(i));
          (a.constructor = o), (o.API = t.API);
          for (e in r) "function" == typeof t[e] && (a[r[e]] = t[e]);
          return (o.version = t.version), Y.activate([o]), o;
        }),
        (i = t._gsQueue))
      ) {
        for (n = 0; i.length > n; n++) i[n]();
        for (s in d)
          d[s].func ||
            t.console.log(
              "GSAP encountered missing dependency: com.greensock." + s
            );
      }
      o = !1;
    }
  })(window),
  (function (t, e, i, n) {
    function s(e, i) {
      (this.element = e),
        (this.settings = t.extend({}, o, i)),
        (this._defaults = o),
        (this._name = r),
        this.init();
    }
    var r = "panr",
      o = {
        sensitivity: 30,
        scale: !0,
        scaleOnHover: !1,
        scaleTo: 1.1,
        scaleDuration: 0.25,
        panY: !0,
        panX: !0,
        panDuration: 1.25,
        resetPanOnMouseLeave: !1,
        onEnter: function () {},
        onLeave: function () {},
      };
    (s.prototype = {
      init: function () {
        var e = this.settings,
          i = t(this.element),
          n = i.width(),
          s = i.height(),
          r = i.width() - e.sensitivity,
          o = (n - r) / r,
          a,
          l,
          h,
          u,
          c,
          p;
        (e.scale || (!e.scaleOnHover && e.scale)) &&
          TweenMax.set(i, { scale: e.scaleTo }),
          "string" === jQuery.type(e.moveTarget) &&
            (e.moveTarget = t(this.element).parent(e.moveTarget)),
          e.moveTarget || (e.moveTarget = t(this.element)),
          e.moveTarget.on("mousemove", function (n) {
            (a = n.pageX - i.offset().left),
              (l = n.pageY - i.offset().top),
              e.panX && (u = { x: -o * a }),
              e.panY && (c = { y: -o * l }),
              (h = t.extend({}, u, c)),
              TweenMax.to(i, e.panDuration, h);
          }),
          e.moveTarget.on("mouseenter", function (t) {
            e.scaleOnHover &&
              TweenMax.to(i, e.scaleDuration, { scale: e.scaleTo }),
              e.onEnter(i);
          }),
          e.scale && (e.scaleOnHover || e.scale)
            ? e.resetPanOnMouseLeave && (p = { x: 0, y: 0 })
            : (p = { scale: 1, x: 0, y: 0 }),
          e.moveTarget.on("mouseleave", function (t) {
            TweenMax.to(i, e.scaleDuration, p), e.onLeave(i);
          });
      },
    }),
      (t.fn[r] = function (e) {
        return this.each(function () {
          t.data(this, "plugin_" + r) ||
            t.data(this, "plugin_" + r, new s(this, e));
        });
      });
  })(jQuery, window, document) +
    (function () {
      var t = "[data-bg-image]";
      $(t).each(function () {
        var t = window.devicePixelRatio > 1,
          e = $(this).data("bg-image"),
          i = e.replace(".jpg", "@2x.jpg");
        t
          ? $(this).css("background-image", "url(" + i + ")")
          : $(this).css("background-image", "url(" + e + ")");
      });
      var e = "[data-bg-color]";
      $(e).each(function () {
        var t = $(this).data("bg-color");
        $(this).css("background-color", t);
      }),
        $(window).load(function () {
          var t = $(".filterable-items");
          t.isotope({
            filter: "*",
            layoutMode: "fitRows",
            animationOptions: { duration: 750, easing: "linear", queue: !1 },
          }),
            $(".filterable-nav a").click(function (e) {
              e.preventDefault(),
                $(".filterable-nav .current").removeClass("current"),
                $(this).addClass("current");
              var i = $(this).attr("data-filter");
              return (
                t.isotope({
                  filter: i,
                  animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: !1,
                  },
                }),
                !1
              );
            }),
            $(".mobile-filter").change(function () {
              var e = $(this).val();
              return (
                t.isotope({
                  filter: e,
                  animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: !1,
                  },
                }),
                !1
              );
            });
        });
    })(jQuery);
