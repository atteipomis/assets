/*--------------------------新選單--------------------------*/
(function () {
    let headerData  = {
        headerFixed     : true, //是否浮動選單
        headerMoveHeight: 0, //滑動多少高度時浮動
        deskMode        : 1, //電腦板模式1:下拉選單  2:滿版選單
        rwdWidth        : 991, //多少寬度時換手機選單
        phoneMode       : 3, //手機版選單模式 1:開闔 2:點擊開闔其他關閉模式 3:換頁模式
        nav             : 'nav__box', //nav區塊class
        navItem         : 'nav__item', //nav列class名稱
        navLayer        : 'nav__layer', //下一層class名稱
        navBtn          : 'nav__btn', //nav小版按鈕名稱
        navPrev         : 'nav__prev', //使用phoneMode 3返回按鈕Class名稱
        hamburger       : 'hamburger', //hamburger名稱
        searchArea      : 'header__search', //搜尋
        searchIcon      : 'header__search-icon', //搜尋按鈕
        searchBox       : 'header__search-form', //搜尋框
        socialBtn       : 'header__social-btn', //群組按鈕
        socialBox       : 'header__social', //群組框
        langIcon        : 'language__icon', //語系按鈕
        langBox         : 'option', //語系框
    };
    let win_width   = parseInt(window.innerWidth, 10);
    let $body       = document.querySelector('body'),
        $nav        = document.querySelector('.' + headerData.nav),
        $navItem    = document.querySelectorAll('.' + headerData.navItem),
        $hamburger  = document.querySelector('.' + headerData.hamburger),
        $sNavBtn    = document.querySelectorAll('.' + headerData.navBtn),
        $navLayer   = document.querySelectorAll('.' + headerData.navLayer),
        $sNavPrev   = document.querySelectorAll('.' + headerData.navPrev),
        $searchArea = document.querySelector('.' + headerData.searchArea),
        $searchBox  = document.querySelector('.' + headerData.searchBox),
        $searchBtn  = document.querySelector('.' + headerData.searchIcon),
        $socialBtn  = document.querySelector('.' + headerData.socialBtn),
        $langBtn    = document.querySelector('.' + headerData.langIcon);

    //浮動選單
    headerFixed();
    window.addEventListener('scroll', headerFixed);

    function headerFixed(e) {
        let self      = this,
            ScrollTop = self.pageYOffset,
            $header   = document.querySelector('.header');
        if (win_width < headerData.rwdWidth) {
            headerData.headerMoveHeight = 0;
        }
        if (ScrollTop > headerData.headerMoveHeight && headerData.headerFixed) {
            $header.classList.remove('header--unfixed');
            $header.classList.add('header--fixed');
            return false;
        }
        $header.classList.remove('header--fixed');
        $header.classList.add('header--unfixed');
    }

    //電腦版選單`
    function nav(mode) {
        if (mode === 1) {
            return [...$navItem].forEach((item) => {
                item.addEventListener('mouseenter', navEnter);
                item.addEventListener('mouseleave', navLeave);
            });
        }
        let $navBox = $nav.querySelector('.nav');
        [...$navBox.children].forEach((item) => {
            item.addEventListener('mouseenter', navEnter);
            item.addEventListener('mouseleave', navLeave);
        });
    }

    //滑入js
    function navEnter(e) {
        e.preventDefault;
        let self   = this;
        let $layer = self.querySelector('.' + headerData.navLayer);
        if (!$layer) return;
        self.classList.add(headerData.navItem + '--on');
        if (headerData.deskMode !== 1) {
            return $layer.classList.add(headerData.navLayer + '--full');
        }
        //計算下一層是否超出頁面範圍
        let selfRect   = self.getBoundingClientRect(), //item按鈕與視窗距離
            selfWidth  = parseInt(self.offsetWidth, 10), //item按鈕寬度
            selfHeight = parseInt(self.offsetHeight, 10),
            selfLeft   = parseInt(selfRect.left + selfWidth, 10), //item按鈕與視窗左側距離+按鈕寬度
            layerRect  = $layer.getBoundingClientRect(), //layer元件與視窗距離
            layerWidth = parseInt($layer.offsetWidth, 10), //layer元件寬度
            layerLeft  = parseInt(layerRect.left + layerWidth, 10); //layer元件與視窗左側距離+元件寬度
        // console.log('window:', win_width);
        // console.log('item:', selfWidth);
        // console.log('layerLeft:', layerWidth);
        if (win_width > layerLeft) return;
        $layer.style.cssText = `left: -${layerWidth}px`;
        if (layerWidth <= selfWidth + 2) return;
        $layer.style.cssText = `left: auto; top: ${selfHeight}px; right: -1px`;
    }

    // 滑出JS
    function navLeave(e) {
        e.preventDefault;
        let self      = this;
        let $layer    = self.querySelector('.' + headerData.navLayer),
            thisClass = self.classList.contains(headerData.navItem + '--on'),
            leftValue = $layer?.style.left || '0';
        if (thisClass) {
            self.classList.remove(headerData.navItem + '--on');
            $layer.removeAttribute('style');
            if (window.screen.width >= 992) {
                if (parseInt(leftValue) > 0) {
                    $layer.style.left = leftValue;
                }
            }
        }
    }

    // 手機版點選
    if ($hamburger) {
        $hamburger.addEventListener('click', function (e) {
            e.preventDefault;
            if (!this.classList.contains(headerData.hamburger + '--on')) {
                $body.classList.add('body-hidden');
                $hamburger.classList.add(headerData.hamburger + '--on');
                $nav.classList.add(headerData.nav + '--on');
                return;
            }
            $body.classList.remove('body-hidden');
            $hamburger.classList.remove(headerData.hamburger + '--on');
            $nav.classList.remove(headerData.nav + '--on');
            if (headerData.phoneMode !== 3) return;
            [...$navLayer].forEach((item) => {
                item.classList.remove(headerData.navLayer + '--on');
            });
        });
    }

    // 手機版選單展開
    function navPhone() {
        [...$sNavBtn].forEach((item) => {
            item.addEventListener('click', navClick);
        });
        if (headerData.phoneMode === 3) {
            $nav.classList.add(headerData.nav + '--turnover');
            [...$sNavPrev].forEach((item) => {
                item.addEventListener('click', navPrev);
            });
        }
    }

    // 選單點選
    function navClick(e) {
        e.preventDefault;
        let self       = this,
            thisClass  = self.classList.contains(headerData.navBtn + '--on');
        let thisParent = self.closest('.' + headerData.navItem).querySelector('.' + headerData.navLayer);
        if (!thisClass && headerData.phoneMode !== 3) {
            if (headerData.phoneMode == 2) navToggle(self.parentNode.parentNode.parentNode);
            self.classList.add(headerData.navBtn + '--on');
            thisParent.classList.add(headerData.navLayer + '--on');
        } else {
            navToggle(self.parentNode.parentNode);
            self.classList.remove(headerData.navBtn + '--on');
            thisParent.classList.remove(headerData.navLayer + '--on');
        }
        if (!thisClass && headerData.phoneMode === 3) {
            thisParent.classList.add(headerData.navLayer + '--on');
        }
    }

    //關閉塞選
    function navToggle(el) {
        [...el.children].forEach((item) => {
            let item_btn = item.querySelector('.' + headerData.navBtn);
            if (item !== el.parentNode && item_btn) {
                [...item.querySelectorAll('.' + headerData.navBtn)].forEach((item) => {
                    item.classList.remove(headerData.navBtn + '--on');
                });
                [...item.querySelectorAll('.' + headerData.navLayer)].forEach((item) => {
                    item.classList.remove(headerData.navLayer + '--on');
                });
            }
        });
    }

    //選單翻轉特效js
    function navPrev(e) {
        e.preventDefault;
        let self = this;
        self.parentNode.classList.remove(headerData.navLayer + '--on');
    }

    //搜尋
    function headerSearch() {
        if (!$searchBtn) return;
        $searchBtn.addEventListener('click', searchClick);
    }

    headerSearch();

    //搜尋點擊
    function searchClick(e) {
        e.preventDefault;
        let self   = this,
            $icon  = self.querySelector('i'),
            $iconX = $icon.classList.contains('icon-x');
        if (!$iconX) {
            $searchArea.classList.add(headerData.searchArea + '--on');
            $icon.classList.add('icon-x');
            $icon.classList.remove('icon-search');
            $searchBox.classList.add(headerData.searchBox + '--on');
            return;
        }
        $searchArea.classList.remove(headerData.searchArea + '--on');
        $icon.classList.add('icon-search');
        $icon.classList.remove('icon-x');
        $searchBox.classList.remove(headerData.searchBox + '--on');
    }

    //群組按鈕
    function social() {
        if (!$socialBtn) return;
        $socialBtn.addEventListener('click', socialClick);
    }

    social();

    function socialClick(e) {
        e.preventDefault;
        let self       = this,
            $icon      = self.querySelector('i'),
            $iconX     = $icon.classList.contains('icon-x'),
            $searchBox = self.nextElementSibling;
        if (!$iconX) {
            $icon.classList.add('icon-x');
            $icon.classList.remove('icon-link');
            $searchBox.classList.add(headerData.socialBox + '--on');
            return;
        }
        $icon.classList.add('icon-link');
        $icon.classList.remove('icon-x');
        $searchBox.classList.remove(headerData.socialBox + '--on');
    }

    // 語系按鈕
    function lang() {
        if (!$langBtn) return;

        // 僅在自定義解析度以下生效，例如 1024px 以下
        if (window.matchMedia('(max-width: 991px)').matches) {
            $langBtn.addEventListener('click', langClick);
        }
    }

    lang();

    function langClick(e) {
        e.preventDefault();
        let self       = this,
            $icon      = self.querySelector('i'),
            $iconX     = $icon.classList.contains('icon-x'),
            $searchBox = self.nextElementSibling;
        if (!$iconX) {
            $icon.classList.add('icon-x');
            $icon.classList.remove('icon-globe');
            $searchBox.classList.add(headerData.langBox + '--on');
            return;
        }
        $icon.classList.add('icon-globe');
        $icon.classList.remove('icon-x');
        $searchBox.classList.remove(headerData.langBox + '--on');
    }

    // 視窗大小改變時也重新檢查解析度
    window.addEventListener('resize', function () {

        if ($langBtn) {
            if (window.matchMedia('(max-width: 991px)').matches) {
                // 若符合解析度且尚未綁定事件，則綁定語系按鈕的點擊事件
                if (!$langBtn._clickEventAdded) {
                    $langBtn.addEventListener('click', langClick);
                    $langBtn._clickEventAdded = true; // 避免重複綁定事件
                }
            } else {
                // 若超出解析度且已經綁定事件，則移除語系按鈕的點擊事件
                if ($langBtn._clickEventAdded) {
                    $langBtn.removeEventListener('click', langClick);
                    $langBtn._clickEventAdded = false;
                }
            }
        }

        templateResizeWidth();
    });

    templateResizeWidth();

    function templateResizeWidth(retries = 3) {
        let header14 = document.querySelector('header.header-template14');

        if (header14) {
            document.querySelectorAll('main, footer')
                .forEach(el => el.style.marginLeft = `${(win_width < 992) ? '0' : header14.offsetWidth}px`);
            document.querySelectorAll('.header-template14 .header__inner .nav > .nav__item > .nav__layer')
                .forEach(el => el.style.setProperty('left', (win_width < 992) ? '100%' : `${header14.offsetWidth}px`));

            retries = 0;
        }

        if ((!header14) && retries > 0) {
            setTimeout(() => {
                templateResizeWidth(retries - 1);
            }, 100);
        }
    }

    //螢幕寬度 
    function screenWidth(width) {
        if (headerData.rwdWidth < width) {
            [...$sNavBtn].forEach((item) => {
                item.removeEventListener('click', navClick);
            });
            [...$navLayer].forEach((item) => {
                item.classList.remove(headerData.navLayer + '-box');
            });
            [...$sNavPrev].forEach((item) => {
                item.removeEventListener('click', navPrev);
            });
            nav(headerData.deskMode);
            return;
        }
        [...$navItem].forEach((item) => {
            item.removeEventListener('mouseenter', navEnter);
            item.removeEventListener('mouseleave', navLeave);
            item.classList.remove(headerData.navItem + '--on');
        });
        navPhone();
    }

    screenWidth(win_width);
    //頁面resize
    window.addEventListener('resize', resize);

    function resize(e) {
        let now_width = parseInt(window.innerWidth, 10);
        if (win_width === now_width) return;
        screenWidth(now_width);
        win_width = now_width;
    }
})();

// cart
$(document).ready(function () {
    $drawerRight = $('.cart-drawer-right');
    $cart_list   = $('.cart-btn, .close-btn');

    $cart_list.click(function () {
        $(this).toggleClass('active');
        $('.cart-drawer-push').toggleClass('cart-drawer-pushtoleft');
        $drawerRight.toggleClass('cart-drawer-open');
    });
});

/*--------------------------隱私權--------------------------*/
$(document).ready(function () {
    $(".advbox-btn").click(function () {
        $(".advbox").hide();
    });
});

/*--------------------------TOP--------------------------*/
function initGoTopAndAdjustPadding() {
    // 初始化 "Go Top" 按鈕
    function initGoTopButton() {
        jQuery(function ($) {
            $('.gotop').toTop({
                autohide: true,
                offset  : 420,
                speed   : 500,
                right   : 20,
                bottom  : 90
            });
        });

        // toTop 插件定義
        (function ($) {
            "use strict";
            $.fn.toTop = function (options) {
                var $this     = this,
                    $window   = $(window),
                    $htmlBody = $('html, body'),
                    settings  = $.extend({
                        autohide: true,
                        offset  : 420,
                        speed   : 500,
                        right   : 15,
                        bottom  : 50
                    }, options);

                // 設定樣式
                $this.css({
                    position: 'fixed',
                    right   : settings.right,
                    bottom  : settings.bottom,
                    cursor  : 'pointer'
                });

                // 自動隱藏
                if (settings.autohide) {
                    $this.css('display', 'none');
                }

                // 點擊回到頂部
                $this.click(function () {
                    $htmlBody.animate({
                        scrollTop: 0
                    }, settings.speed);
                });

                // 滾動事件處理
                $window.scroll(function () {
                    var scrollTop = $window.scrollTop();
                    if (settings.autohide) {
                        scrollTop > settings.offset ? $this.fadeIn(settings.speed) : $this.fadeOut(settings.speed);
                    }
                });
            };
        }(jQuery));
    }

    // 網頁載入後初始化 "Go Top" 按鈕
    window.addEventListener('load', initGoTopButton);
}

// 呼叫初始化函數
initGoTopAndAdjustPadding();


/*! jQuery & Zepto Lazy v1.7.10 - http://jquery.eisbehr.de/lazy - MIT&GPL-2.0 license - Copyright 2012-2018 Daniel 'Eisbehr' Kern */
!function (t, e) {
    "use strict";

    function r(r, a, i, u, l) {
        function f() {
            L = t.devicePixelRatio > 1, i = c(i), a.delay >= 0 && setTimeout(function () {
                s(!0)
            }, a.delay), (a.delay < 0 || a.combined) && (u.e = v(a.throttle, function (t) {
                "resize" === t.type && (w = B = -1), s(t.all)
            }), u.a = function (t) {
                t = c(t), i.push.apply(i, t)
            }, u.g = function () {
                return i = n(i).filter(function () {
                    return !n(this).data(a.loadedName)
                })
            }, u.f = function (t) {
                for (var e = 0; e < t.length; e++) {
                    var r = i.filter(function () {
                        return this === t[e]
                    });
                    r.length && s(!1, r)
                }
            }, s(), n(a.appendScroll).on("scroll." + l + " resize." + l, u.e))
        }

        function c(t) {
            var i = a.defaultImage, o = a.placeholder, u = a.imageBase, l = a.srcsetAttribute, f = a.loaderAttribute,
                c                                                                                = a._f || {};
            t                                                                                    = n(t).filter(function () {
                var t = n(this), r = m(this);
                return !t.data(a.handledName) && (t.attr(a.attribute) || t.attr(l) || t.attr(f) || c[r] !== e)
            }).data("plugin_" + a.name, r);
            for (var s = 0, d = t.length; s < d; s++) {
                var A = n(t[s]), g = m(t[s]), h = A.attr(a.imageBaseAttribute) || u;
                g === N && h && A.attr(l) && A.attr(l, b(A.attr(l), h)), c[g] === e || A.attr(f) || A.attr(f, c[g]), g === N && i && !A.attr(E) ? A.attr(E, i) : g === N || !o || A.css(O) && "none" !== A.css(O) || A.css(O, "url('" + o + "')")
            }
            return t
        }

        function s(t, e) {
            if (!i.length) return void (a.autoDestroy && r.destroy());
            for (var o = e || i, u = !1, l = a.imageBase || "", f = a.srcsetAttribute, c = a.handledName, s = 0; s < o.length; s++) if (t || e || A(o[s])) {
                var g = n(o[s]), h = m(o[s]), b = g.attr(a.attribute), v = g.attr(a.imageBaseAttribute) || l,
                    p                                                    = g.attr(a.loaderAttribute);
                g.data(c) || a.visibleOnly && !g.is(":visible") || !((b || g.attr(f)) && (h === N && (v + b !== g.attr(E) || g.attr(f) !== g.attr(F)) || h !== N && v + b !== g.css(O)) || p) || (u = !0, g.data(c, !0), d(g, h, v, p))
            }
            u && (i = n(i).filter(function () {
                return !n(this).data(c)
            }))
        }

        function d(t, e, r, i) {
            ++z;
            var o = function () {
                y("onError", t), p(), o = n.noop
            };
            y("beforeLoad", t);
            var u = a.attribute, l = a.srcsetAttribute, f = a.sizesAttribute, c = a.retinaAttribute,
                s                                                               = a.removeAttribute, d = a.loadedName, A                      = t.attr(c);
            if (i) {
                var g = function () {
                    s && t.removeAttr(a.loaderAttribute), t.data(d, !0), y(T, t), setTimeout(p, 1), g = n.noop
                };
                t.off(I).one(I, o).one(D, g), y(i, t, function (e) {
                    e ? (t.off(D), g()) : (t.off(I), o())
                }) || t.trigger(I)
            } else {
                var h = n(new Image);
                h.one(I, o).one(D, function () {
                    t.hide(), e === N ? t.attr(C, h.attr(C)).attr(F, h.attr(F)).attr(E, h.attr(E)) : t.css(O, "url('" + h.attr(E) + "')"), t[a.effect](a.effectTime), s && (t.removeAttr(u + " " + l + " " + c + " " + a.imageBaseAttribute), f !== C && t.removeAttr(f)), t.data(d, !0), y(T, t), h.remove(), p()
                });
                var m = (L && A ? A : t.attr(u)) || "";
                h.attr(C, t.attr(f)).attr(F, t.attr(l)).attr(E, m ? r + m : null), h.complete && h.trigger(D)
            }
        }

        function A(t) {
            var e = t.getBoundingClientRect(), r = a.scrollDirection, n = a.threshold,
                i                                                       = h() + n > e.top && -n < e.bottom, o                 = g() + n > e.left && -n < e.right;
            return "vertical" === r ? i : "horizontal" === r ? o : i && o
        }

        function g() {
            return w >= 0 ? w : w = n(t).width()
        }

        function h() {
            return B >= 0 ? B : B = n(t).height()
        }

        function m(t) {
            return t.tagName.toLowerCase()
        }

        function b(t, e) {
            if (e) {
                var r = t.split(",");
                t     = "";
                for (var a = 0, n = r.length; a < n; a++) t += e + r[a].trim() + (a !== n - 1 ? "," : "")
            }
            return t
        }

        function v(t, e) {
            var n, i = 0;
            return function (o, u) {
                function l() {
                    i = +new Date, e.call(r, o)
                }

                var f = +new Date - i;
                n && clearTimeout(n), f > t || !a.enableThrottle || u ? l() : n = setTimeout(l, t - f)
            }
        }

        function p() {
            --z, i.length || z || y("onFinishedAll")
        }

        function y(t, e, n) {
            return !!(t = a[t]) && (t.apply(r, [].slice.call(arguments, 1)), !0)
        }

        var z = 0, w = -1, B = -1, L = !1, T = "afterLoad", D = "load", I = "error", N = "img", E = "src", F = "srcset",
            C                                                                                                = "sizes", O = "background-image";
        "event" === a.bind || o ? f() : n(t).on(D + "." + l, f)
    }

    function a(a, o) {
        var u = this, l = n.extend({}, u.config, o), f = {}, c = l.name + "-" + ++i;
        return u.config = function (t, r) {
            return r === e ? l[t] : (l[t] = r, u)
        }, u.addItems = function (t) {
            return f.a && f.a("string" === n.type(t) ? n(t) : t), u
        }, u.getItems = function () {
            return f.g ? f.g() : {}
        }, u.update = function (t) {
            return f.e && f.e({}, !t), u
        }, u.force = function (t) {
            return f.f && f.f("string" === n.type(t) ? n(t) : t), u
        }, u.loadAll = function () {
            return f.e && f.e({all: !0}, !0), u
        }, u.destroy = function () {
            return n(l.appendScroll).off("." + c, f.e), n(t).off("." + c), f = {}, e
        }, r(u, l, a, f, c), l.chainable ? a : u
    }

    var n = t.jQuery || t.Zepto, i = 0, o = !1;
    n.fn.Lazy = n.fn.lazy = function (t) {
        return new a(this, t)
    }, n.Lazy = n.lazy = function (t, r, i) {
        if (n.isFunction(r) && (i = r, r = []), n.isFunction(i)) {
            t = n.isArray(t) ? t : [t], r = n.isArray(r) ? r : [r];
            for (var o = a.prototype.config, u = o._f || (o._f = {}), l = 0, f = t.length; l < f; l++) (o[t[l]] === e || n.isFunction(o[t[l]])) && (o[t[l]] = i);
            for (var c = 0, s = r.length; c < s; c++) u[r[c]] = t[0]
        }
    }, a.prototype.config = {
        name              : "lazy",
        chainable         : !0,
        autoDestroy       : !0,
        bind              : "load",
        threshold         : 500,
        visibleOnly       : !1,
        appendScroll      : t,
        scrollDirection   : "both",
        imageBase         : null,
        defaultImage      : "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        placeholder       : null,
        delay             : -1,
        combined          : !1,
        attribute         : "data-src",
        srcsetAttribute   : "data-srcset",
        sizesAttribute    : "data-sizes",
        retinaAttribute   : "data-retina",
        loaderAttribute   : "data-loader",
        imageBaseAttribute: "data-imagebase",
        removeAttribute   : !0,
        handledName       : "handled",
        loadedName        : "loaded",
        effect            : "show",
        effectTime        : 0,
        enableThrottle    : !0,
        throttle          : 250,
        beforeLoad        : e,
        afterLoad         : e,
        onError           : e,
        onFinishedAll     : e
    }, n(t).on("load", function () {
        o = !0
    })
}(window);
$('.lazy').Lazy({
    scrollDirection: 'vertical',
    effect         : 'fadeIn',
    visibleOnly    : true,
    onError        : function (element) {
        console.log('error loading ' + element.data('src'));
    }
});

/*--------------------------側選單--------------------------*/

function initializeFoundationAndExpandMenu() {

    // 1. 靜默檢查：只有在 jQuery 和 Foundation 存在時才初始化
    if (typeof $ !== 'undefined' && typeof $.fn.foundation === 'function') {
        $(document).foundation();
    }

    // 2. 獲取選單元素
    const menuItems = document.querySelectorAll('.is-accordion-submenu-parent');

    // 3. 效能與防呆檢查：如果頁面沒有該選單，直接退出不執行
    if (menuItems.length === 0) {
        return;
    }

    // 4. 展開當前活躍的菜單
    function expandActiveMenu() {
        menuItems.forEach(menuItem => {
            const activeLink = menuItem.querySelector('a.active');
            const subMenu = menuItem.querySelector('.sub-menu'); // 移到外層，避免重複宣告

            if (activeLink) {
                menuItem.setAttribute('aria-expanded', 'true');
                if (subMenu) {
                    subMenu.style.display = 'block';
                    subMenu.setAttribute('aria-hidden', 'false');
                }
            } else {
                menuItem.setAttribute('aria-expanded', 'false');
                if (subMenu) {
                    subMenu.style.display = 'none';
                    subMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }

    // 執行展開菜單動作
    expandActiveMenu();
}




/*-------------------------- FAQ --------------------------*/
$(document).ready(function() {
    $('.accordion-header').on('click', function() {
        const $currentItem = $(this).closest('.item');
        const $container = $(this).closest('.accordion__wrapper');

        // 從 HTML 讀取 data-auto-close 的值
        const autoCloseOthers = $container.data('auto-close');

        if (autoCloseOthers) {
            $currentItem.siblings()
                .removeClass('active')
                .find('.accordion-content')
                .slideUp(300);
        }

        $currentItem.toggleClass('active');
        $currentItem.find('.accordion-content').slideToggle(300);
    });
});

/*-------------------------- 設置 Swiper 影片控制功能 --------------------------*/
/**
 * Swiper Video Autoplay — 精簡版
 * 支援 YouTube (IFrame API) 與 <video>，自動播放當前投影片、其餘暫停。
 * 不需修改 HTML；載入順序不限；頁面無 Swiper 時靜默結束。
 * Debug: ?swiperVideoDebug=1
 */
(function () {
    'use strict';

    var CFG = {
        selector: '.swiper',
        autoplay: true,           // 播放當前投影片
        advanceOnEnd: true,       // 播完切下一張
        stopSwiperAutoplay: true, // 停掉 Swiper 定時輪播
        unmuteButton: true,
        restartOnEnter: true,
        pauseWhenHidden: true,
        settleDelays: [80, 300, 800, 1400], // 切換後多段校正
        watchdog: 1500,           // 定期校正保底，0 為關閉
        topControls: '.player-middle-controls', // 播放 YouTube 時提到最上層，空字串為關閉
        poll: 200,
        maxWait: 20000
    };

    var DEBUG = window.SWIPER_VIDEO_DEBUG === true ||
        /[?&]swiperVideoDebug=1/.test(location.search);

    var soundOn = false, visible = true, uid = 0, swipers = [];

    function log() {
        if (DEBUG) console.log.apply(console, ['[SwiperVideo]'].concat([].slice.call(arguments)));
    }
    function q(root, sel) {
        return root ? [].slice.call(root.querySelectorAll(sel)) : [];
    }
    function isYT(el) {
        return el.tagName === 'IFRAME' &&
            /(?:youtube\.com|youtube-nocookie\.com)\/embed\//i.test(el.getAttribute('src') || '');
    }
    function media(root) {
        return q(root, 'iframe,video').filter(function (el) {
            return el.tagName === 'VIDEO' || isYT(el);
        });
    }

    // 標記「這次暫停是腳本發出的」。帶時間戳，1 秒內未被消耗即自動失效，
    // 避免旗標卡住導致之後的使用者操作被誤判。
    function markScript(el) { el._byScript = Date.now(); }
    function wasScript(el) {
        var t = el._byScript || 0;
        el._byScript = 0;
        return Date.now() - t < 1000;
    }

    // 影片識別鍵：loop 重建 DOM 時元素會換，但同一支影片的 key 不變
    function vkey(el) {
        var src = el.getAttribute('src') || el.currentSrc || '';
        if (isYT(el)) {
            var m = src.match(/embed\/([\w-]+)/);
            return 'yt:' + (m ? m[1] : src);
        }
        return 'v:' + src;
    }

    function markUserPaused(sw, el) {
        el._userPaused = true;
        (sw._paused = sw._paused || {})[vkey(el)] = true;
    }

    function clearUserPaused(sw, el) {
        el._userPaused = false;
        if (sw._paused) delete sw._paused[vkey(el)];
    }

    function isUserPaused(sw, el) {
        return !!(el._userPaused || (sw._paused && sw._paused[vkey(el)]));
    }

    /* ---------- YouTube IFrame API ---------- */

    var ytState = 'idle', ytQueue = [];

    function loadYT(cb) {
        if (window.YT && window.YT.Player) return cb();
        ytQueue.push(cb);
        if (ytState === 'loading') return;
        ytState = 'loading';

        var prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
            if (typeof prev === 'function') try { prev(); } catch (e) {}
            log('YouTube API ready');
            var queue = ytQueue.slice(); ytQueue = [];
            queue.forEach(function (fn) { try { fn(); } catch (e) {} });
        };

        var s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        s.onerror = function () { log('YouTube API failed to load (CSP or blocker?)'); };
        (document.head || document.body).appendChild(s);
    }

    function prepSrc(el) {
        var src = el.getAttribute('src');
        if (!src) return;
        try {
            var url = new URL(src, location.href), changed = false;
            var params = [['enablejsapi', '1'], ['playsinline', '1'], ['mute', '1'], ['rel', '0']];
            if (/^https?:$/.test(location.protocol)) params.push(['origin', location.origin]);

            params.forEach(function (p) {
                if (url.searchParams.get(p[0]) !== p[1]) { url.searchParams.set(p[0], p[1]); changed = true; }
            });
            if (changed) el.setAttribute('src', url.toString());
            el.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        } catch (e) { log('Bad YouTube URL:', e); }
    }

    function setupYT(el, sw) {
        // loop 複製的 slide 會沿用同一個 id，查回來不是自己就換新的
        if (!el.id || document.getElementById(el.id) !== el) {
            el.id = 'sv-yt-' + (++uid) + Math.random().toString(36).slice(2, 6);
        }
        prepSrc(el);

        loadYT(function () {
            try {
                el._p = new YT.Player(el.id, {
                    events: {
                        onReady: function (e) {
                            el._ready = true;
                            log('YouTube player ready:', el.id);
                            try { e.target.mute(); } catch (err) {}

                            if (el._want && visible) {
                                if (soundOn) try { e.target.unMute(); } catch (err) {}
                                e.target.playVideo();
                            } else {
                                // 只在真的播放中才暫停：對 UNSTARTED 呼叫 pauseVideo
                                // 不會產生 PAUSED 事件，旗標會卡住
                                try {
                                    var st = e.target.getPlayerState ? e.target.getPlayerState() : -1;
                                    if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) {
                                        markScript(el);
                                        e.target.pauseVideo();
                                    }
                                } catch (err) {}
                            }
                        },
                        onStateChange: function (e) {
                            if (e.data === YT.PlayerState.ENDED) {
                                if (CFG.advanceOnEnd) try { sw.slideNext(); } catch (err) {}
                            } else if (e.data === YT.PlayerState.PAUSED) {
                                if (wasScript(el)) return;
                                el._want = false;
                                markUserPaused(sw, el);
                                log('User paused YouTube, autoplay suspended');
                            } else if (e.data === YT.PlayerState.PLAYING) {
                                clearUserPaused(sw, el); // 使用者自己按播放，解除封鎖
                            }
                        },
                        onError: function (e) { log('YouTube error code:', e && e.data, el.id); }
                    }
                });
            } catch (err) { log('Failed to create YouTube player:', err); el._init = false; }
        });
    }

    /* ---------- 統一播放 / 暫停 ---------- */

    function play(sw, el, entry) {
        if (isUserPaused(sw, el)) return; // 使用者按過暫停，除非索引改變才會解除
        if (entry) clearUserPaused(sw, el);

        if (isYT(el)) {
            el._want = true;
            var p = el._p;
            if (!p || !el._ready) return; // onReady 會補播
            try {
                var st = p.getPlayerState ? p.getPlayerState() : -1;
                if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) return;
                if (st === YT.PlayerState.ENDED && !entry) return;
                soundOn ? p.unMute() : p.mute();
                if (entry && st === YT.PlayerState.ENDED && CFG.restartOnEnter) p.seekTo(0);
                p.playVideo();
            } catch (e) { log('playVideo failed:', e); }
            return;
        }

        try {
            if (!el.paused && !el.ended) return;
            if (el.ended && !entry) return;

            el.muted = !soundOn;
            el.playsInline = true;
            if (entry && CFG.restartOnEnter && (el.ended || el.currentTime > 0)) {
                try { el.currentTime = 0; } catch (e) {}
            }

            var pr = el.play();
            if (pr && pr.catch) pr.catch(function (err) {
                log('mp4 blocked, retrying muted:', err && err.name);
                el.muted = true;
                el.play().catch(function (e2) { log('mp4 still blocked:', e2 && e2.name); });
            });
        } catch (e) { log('video play failed:', e); }
    }

    function pause(el) {
        if (isYT(el)) {
            el._want = false;
            var p = el._p;
            if (!p || !el._ready) return;
            try {
                var st = p.getPlayerState ? p.getPlayerState() : -1;
                if (st !== YT.PlayerState.PLAYING && st !== YT.PlayerState.BUFFERING) return;
                markScript(el);
                p.pauseVideo();
            } catch (e) {}
            return;
        }
        try {
            if (el.paused) return;
            markScript(el);
            el.pause();
        } catch (e) {}
    }

    /* ---------- 播放中控制項置頂 ---------- */

    // iframe 是 replaced element，單靠 z-index 不一定生效，
    // 需讓控制項自成堆疊脈絡（position + z-index）才能穩定壓在上面。
    function injectStyle() {
        if (!CFG.topControls || document.getElementById('sv-style')) return;

        var sel = CFG.selector + ' ' + CFG.topControls;
        var s = document.createElement('style');
        s.id = 'sv-style';
        s.textContent =
            sel + '{position:relative;z-index:30;}' +
            CFG.selector + ' iframe,' + CFG.selector + ' video{position:relative;z-index:1;}' +
            '.sv-yt-playing ' + CFG.topControls + '{z-index:60;pointer-events:auto;}';
        (document.head || document.documentElement).appendChild(s);
        log('Stacking style injected for', CFG.topControls);
    }

    function isPlayingYT(el) {
        if (!isYT(el) || !el._p || !el._ready) return false;
        try {
            var st = el._p.getPlayerState ? el._p.getPlayerState() : -1;
            return st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING;
        } catch (e) { return false; }
    }

    function updateTopLayer(sw, slide) {
        if (!CFG.topControls) return;
        var playing = !!slide && media(slide).some(isPlayingYT);
        if (playing === sw._ytPlaying) return;
        sw._ytPlaying = playing;
        sw.el.classList[playing ? 'add' : 'remove']('sv-yt-playing');
        log(playing ? 'YouTube playing — controls raised' : 'YouTube stopped — controls restored');
    }

    /* ---------- 校正（冪等，每次都重掃以涵蓋 loop 複製品） ---------- */

    function ensureMedia(sw) {
        media(sw.el).forEach(function (el) {
            if (el._init) return;
            el._init = true;

            if (isYT(el)) return setupYT(el, sw);

            el.muted = true;
            el.setAttribute('muted', '');
            el.setAttribute('playsinline', '');
            el.setAttribute('webkit-playsinline', '');

            el.addEventListener('pause', function () {
                if (wasScript(el)) return;
                if (el.ended) return;
                markUserPaused(sw, el);
                log('User paused video, autoplay suspended');
            });
            el.addEventListener('play', function () { clearUserPaused(sw, el); });
            if (CFG.advanceOnEnd) {
                el.addEventListener('ended', function () { try { sw.slideNext(); } catch (e) {} });
            }
            log('Video element initialized');
        });
    }

    function activeSlide(sw) {
        return sw.el.querySelector('.swiper-slide-active') ||
            (sw.slides && sw.slides[sw.activeIndex]) || null;
    }

    function reconcile(sw) {
        if (!sw.el || !document.body.contains(sw.el)) return;
        ensureMedia(sw);

        var slide = activeSlide(sw);

        // 用 realIndex 判斷是否換頁：loop 重建 DOM 時元素會換，但索引不變，
        // 改用元素比對會讓 watchdog 誤判成換頁而清掉使用者的暫停狀態。
        var idx = typeof sw.realIndex === 'number' ? sw.realIndex : sw.activeIndex;
        var entry = idx !== sw._lastIdx;
        if (entry) {
            sw._lastIdx = idx;
            sw._paused = {}; // 換頁才重置暫停紀錄
            log('Entered slide index', idx);
        }
        sw._active = slide;

        media(sw.el).forEach(function (el) {
            if (!slide || !slide.contains(el)) pause(el);
        });

        if (!CFG.autoplay || !slide || !visible || sw._offscreen) {
            updateTopLayer(sw, null);
            return;
        }
        media(slide).forEach(function (el) { play(sw, el, entry); });
        updateTopLayer(sw, slide);
    }

    function sync(sw) {
        sw._seq = (sw._seq || 0) + 1;
        var seq = sw._seq;
        CFG.settleDelays.forEach(function (d) {
            setTimeout(function () { if (seq === sw._seq) reconcile(sw); }, d);
        });
    }

    function pauseAll(sw) {
        media(sw.el).forEach(pause);
    }

    /* ---------- 開啟聲音按鈕 ---------- */

    // 線性 icon（24x24，stroke 跟隨 currentColor）
    var ICON = {
        off: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9.5l5 5m0-5l-5 5"/>',
        on:  '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.8a4.5 4.5 0 0 1 0 6.4"/>' +
            '<path d="M19.5 6.2a8.5 8.5 0 0 1 0 11.6"/>'
    };

    function iconSvg(state) {
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" ' +
            'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
            'stroke-linejoin="round" aria-hidden="true">' + ICON[state] + '</svg>';
    }

    function addUnmuteBtn(sw) {
        if (!CFG.unmuteButton || sw.el.querySelector('.sv-unmute-btn')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sv-unmute-btn';
        btn.style.cssText = 'position:absolute;right:12px;bottom:12px;z-index:20;' +
            'width:40px;height:40px;display:flex;align-items:center;justify-content:center;' +
            'border:0;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;' +
            'padding:0;backdrop-filter:blur(4px);transition:background .2s;';

        function render() {
            btn.innerHTML = iconSvg(soundOn ? 'on' : 'off');
            var label = soundOn ? '關閉聲音' : '開啟聲音';
            btn.setAttribute('aria-label', label);
            btn.title = label;
        }
        render();

        btn.addEventListener('mouseenter', function () {
            btn.style.background = 'rgba(0,0,0,.8)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.background = 'rgba(0,0,0,.55)';
        });

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            soundOn = !soundOn;
            render();

            media(activeSlide(sw)).forEach(function (el) {
                if (isYT(el)) {
                    if (el._p && el._ready) try { soundOn ? el._p.unMute() : el._p.mute(); } catch (err) {}
                } else el.muted = !soundOn;
            });
        });

        if (getComputedStyle(sw.el).position === 'static') sw.el.style.position = 'relative';
        sw.el.appendChild(btn);
    }

    /* ---------- 綁定 ---------- */

    var bound = new WeakSet();

    function bind(sw) {
        if (!sw || !sw.el || bound.has(sw)) return;
        bound.add(sw);
        swipers.push(sw);
        ensureMedia(sw);

        if (CFG.stopSwiperAutoplay && sw.autoplay && sw.autoplay.running) {
            try { sw.autoplay.stop(); log('Swiper autoplay stopped'); } catch (e) {}
        }

        if (sw.on) {
            ['slideChange', 'slideChangeTransitionEnd', 'transitionEnd', 'loopFix', 'activeIndexChange']
                .forEach(function (ev) { sw.on(ev, function () { sync(sw); }); });

            sw.on('destroy', function () {
                pauseAll(sw);
                clearInterval(sw._dog);
                bound.delete(sw);
                var i = swipers.indexOf(sw);
                if (i > -1) swipers.splice(i, 1);
            });
        }

        if (CFG.watchdog > 0) {
            sw._dog = setInterval(function () {
                if (!document.body.contains(sw.el)) return clearInterval(sw._dog);
                if (visible && !sw._offscreen) reconcile(sw);
            }, CFG.watchdog);
        }

        if (CFG.pauseWhenHidden && window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    sw._offscreen = !en.isIntersecting;
                    en.isIntersecting ? sync(sw) : pauseAll(sw);
                });
            }, { threshold: 0.25 }).observe(sw.el);
        }

        addUnmuteBtn(sw);
        sync(sw);
        log('Swiper bound:', sw.el);
    }

    /* ---------- 啟動 ---------- */

    function bindAll() {
        var els = q(document, CFG.selector), n = 0;
        els.forEach(function (el) { if (el.swiper) { bind(el.swiper); n++; } });
        return { total: els.length, bound: n };
    }

    var timer = null, waited = 0;

    function poll() {
        if (timer) return;
        waited = 0;
        timer = setInterval(function () {
            waited += CFG.poll;
            var r = bindAll();
            if (r.total > 0 && r.bound >= r.total) {
                clearInterval(timer); timer = null;
                log('Bound after ' + waited + 'ms');
            } else if (waited >= CFG.maxWait) {
                clearInterval(timer); timer = null;
                log('No Swiper instance found, polling stopped');
            }
        }, CFG.poll);
    }

    function start() {
        injectStyle();

        if (CFG.pauseWhenHidden) {
            document.addEventListener('visibilitychange', function () {
                visible = !document.hidden;
                swipers.forEach(function (sw) {
                    if (document.body.contains(sw.el)) visible ? sync(sw) : pauseAll(sw);
                });
            });
        }

        if (window.MutationObserver) {
            new MutationObserver(function (muts) {
                for (var i = 0; i < muts.length; i++) {
                    var added = muts[i].addedNodes;
                    for (var j = 0; j < added.length; j++) {
                        var n = added[j];
                        if (n.nodeType !== 1) continue;
                        if ((n.matches && n.matches(CFG.selector)) ||
                            (n.querySelector && n.querySelector(CFG.selector))) {
                            log('New Swiper container detected');
                            return poll();
                        }
                    }
                }
            }).observe(document.body, { childList: true, subtree: true });
        }

        var r = bindAll();
        if (r.total > 0 && r.bound >= r.total) return log('Bound immediately');
        poll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else start();
})();



/*-------------------------- Filter 展開收合 --------------------------*/
function initAccordion() {
    const form = document.querySelector('.form');

    // 加入 class 判斷：如果父層沒有 enable-toggle 這個 class，就中斷執行
    if (!form || !form.classList.contains('enable-toggle')) return;

    const globalBtn = document.getElementById('btn-global');
    if (!globalBtn) return;

    // 從 HTML 的 data 屬性取得常數文字
    const textCollapse = globalBtn.dataset.textCollapse;
    const textExpand = globalBtn.dataset.textExpand;

    // 1. 個別點擊：使用「事件代理」監聽整個表單，完美支援後台動態新增的區塊
    form.addEventListener('click', (e) => {
        const label = e.target.closest('.form__label');
        if (!label) return; // 點擊的若不是標題則略過

        // 切換被點擊區塊的收闔狀態
        label.closest('.filter__item').classList.toggle('is-closed');

        // 實時計算數量並更新全域按鈕文字 (使用常數變數)
        const total = form.querySelectorAll('.filter__item').length;
        const closedCount = form.querySelectorAll('.filter__item.is-closed').length;
        globalBtn.textContent = (total === closedCount) ? textExpand : textCollapse;
    });

    // 2. 全域點擊：控制所有區塊
    globalBtn.addEventListener('click', () => {
        const items = form.querySelectorAll('.filter__item');
        const isOpening = globalBtn.textContent === textExpand; // 根據按鈕文字判斷行為

        // toggle 的第二個參數：true代表加上class(收合)，false代表移除class(展開)
        items.forEach(item => item.classList.toggle('is-closed', !isOpening));
        globalBtn.textContent = isOpening ? textCollapse : textExpand;
    });
}

// 當網頁載入完成後執行
document.addEventListener('DOMContentLoaded', initAccordion);







