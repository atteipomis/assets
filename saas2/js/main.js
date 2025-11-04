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

        // templateResizeWidth();
    });

    // templateResizeWidth();

    // function templateResizeWidth(retries = 3) {
    //     let header = document.querySelector('header.header-template14, header.header-template15');
    //
    //     if (header) {
    //         document.querySelectorAll('main, footer')
    //             .forEach(el => el.style.marginLeft = `${(win_width < 992) ? '0' : header.offsetWidth}px`);
    //         document.querySelectorAll('.header-template14 .header__inner .nav > .nav__item > .nav__layer')
    //             .forEach(el => el.style.setProperty('left', (win_width < 992) ? '100%' : `${header.offsetWidth}px`));
    //
    //         retries = 0;
    //     }
    //
    //     if ((!header) && retries > 0) {
    //         setTimeout(() => {
    //             templateResizeWidth(retries - 1);
    //         }, 100);
    //     }
    // }

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

    // 初始化 Foundation
    $(document).foundation();

    // 展开当前活跃的菜单
    function expandActiveMenu() {
        const menuItems = document.querySelectorAll('.is-accordion-submenu-parent');

        menuItems.forEach(menuItem => {
            const activeLink = menuItem.querySelector('a.active');

            if (activeLink) {
                menuItem.setAttribute('aria-expanded', 'true');
                const subMenu = menuItem.querySelector('.sub-menu');
                if (subMenu) {
                    subMenu.style.display = 'block';
                    subMenu.setAttribute('aria-hidden', 'false');
                }
            } else {
                menuItem.setAttribute('aria-expanded', 'false');
                const subMenu = menuItem.querySelector('.sub-menu');
                if (subMenu) {
                    subMenu.style.display = 'none';
                    subMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }

    // 页面加载时展开菜单
    expandActiveMenu();
}

document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll(".left-info li");

    listItems.forEach(function (li) {
        const textContent = li.textContent.trim();

        if (!textContent) {
            li.style.display = "none";
        }
    });
});