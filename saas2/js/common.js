/**
 * Function: Animated number counter
 * Ex.: index-editor-template29
 * Date: 2025/04/29
 * Author: designer11
 */
function initCountUpOnScroll(options = {}) {
    const config = {
        aims: 'body',
        selector: '.count-item',
        number: '.number span:first-child',
        duration: 1000,
        threshold: 0.1,
        repeat: true,
        startAttr: 'data-start',
        endAttr: 'data-end',
        ...options
    };

    const containers = document.querySelectorAll(config.aims);

    containers.forEach(container => {
        const items = container.querySelectorAll(config.selector);

        if (!items.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const el = entry.target;
                const numberEl = el.querySelector(config.number);

                if (!numberEl) {
                    return;
                }

                if (entry.isIntersecting) {
                    if (!el.dataset.animating || config.repeat) {
                        el.dataset.animating = "true";

                        const start = parseInt(numberEl.getAttribute(config.startAttr) || "0", 10);
                        const endText = numberEl.getAttribute(config.endAttr) || numberEl.textContent.replace(/[^\d.-]/g, '');
                        const end = parseInt(endText, 10);

                        if (isNaN(end)) {
                            return;
                        }

                        animateNumber(numberEl, start, end, config.duration, () => {
                            if (config.repeat) delete el.dataset.animating;
                            if (config.onComplete) config.onComplete(el, numberEl, end);
                        });

                        if (config.onStart) config.onStart(el, numberEl, start, end);
                    }
                } else if (config.repeat) {
                    delete el.dataset.animating;
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: '0px'
        });

        items.forEach(el => {
            const numberEl = el.querySelector(config.number);
            if (!numberEl) {
                return;
            }

            if (!numberEl.hasAttribute(config.endAttr)) {
                const cleanValue = numberEl.textContent.replace(/[^\d.-]/g, '');
                numberEl.setAttribute(config.endAttr, cleanValue);
            }

            if (!numberEl.hasAttribute(config.startAttr)) {
                numberEl.setAttribute(config.startAttr, "0");
            }

            observer.observe(el);
        });
    });

    function animateNumber(el, start, end, duration, callback) {
        if (start === end) {
            el.textContent = end.toLocaleString();
            if (callback) callback();
            return;
        }

        const startTime = performance.now();

        function frame(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 2);
            const current = Math.round(start + eased * (end - start));

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = end.toLocaleString();
                if (callback) callback();
            }
        }

        requestAnimationFrame(frame);
    }
}

/**
 * Function: scroll change animate logo size
 * Ex.: header-template21
 * Date: 2025/05/22
 * Author: designer12
 */
function initHeaderTemplate21(options) {
    const {
        selector = '.header-template21',
        logoImages,
        paddingSettings = {
            desktop: ['6%', '9%'],
            tablet: ['5.5%', '5%'],
            mobile: ['0%', '0%'],
        },
        widthSettings = {
            desktop: ['84%', '80%'],
            tablet: ['80%', '82%'],
            mobile: ['100%', '100%'],
        },
        breakpoints = [992, 1441],
        scrollTrigger = 50,
    } = options;

    const el = document.querySelector(selector);
    if (!el) return;
    const top = el.querySelector('.topblock');
    const logo = el.querySelector('.logo__img img');
    const nav = el.querySelector('.nav__box');
    const bp = [breakpoints[0] || 992, breakpoints[1] || 1441];

    const run = () => {
        const y = window.scrollY, w = window.innerWidth;
        const d = w < bp[0] ? 'mobile' : w < bp[1] ? 'tablet' : 'desktop';
        logo.src = y > scrollTrigger ? logoImages[1] : logoImages[0];
        nav.style.paddingLeft = y > scrollTrigger ? paddingSettings[d][1] : paddingSettings[d][0];
        top.style.width = y > scrollTrigger ? widthSettings[d][1] : widthSettings[d][0];
    };

    window.addEventListener('scroll', run);
    run();
}

/**
 * Function: vertical header to change windows size
 * Ex.: header-template14
 * Date: 2025/05/20
 * Author: designer12
 */
function initHeaderTemplateVertical(options) {
    const {selector = 'header-template14'} = options;
    const header = document.querySelector(`header.${selector}`);
    if (!header) return;

    let win_width = window.innerWidth;

    const resize = (retries = 10) => {
        requestAnimationFrame(() => {
            const w = header.offsetWidth;
            if (w > window.innerWidth * 2) {
                if (retries > 0) setTimeout(() => resize(retries - 1), 100);
                return;
            }

            document.querySelectorAll('main, footer')
                .forEach(el => el.style.marginLeft = (win_width < 992) ? '0' : `${w}px`);

            if (['header-template14'].includes(selector))
                document.querySelectorAll(`.${selector} .header__inner .nav > .nav__item > .nav__layer`)
                    .forEach(el => el.style.setProperty('left', (win_width < 992) ? '100%' : `${w}px`));
        });
    };

    window.addEventListener('resize', () => {
        win_width = window.innerWidth;
        resize();
    });

    resize();
}

/**
 * Function: change nav_laver hover effect to click on pc
 * Ex.: all header
 * Date: 2025/05/21
 * Author: designer12
 */
function initializeDesktopNavMenu() {
    const DESKTOP_BREAKPOINT = 992;
    const NAV_BTN_SELECTOR = '.nav__btn';
    const NAV_ITEM_SELECTOR = '.nav__item';
    const NAV_LAYER_SELECTOR = '.nav__layer';
    const NAV_NAME_SELECTOR = '.nav__name';

    const CLASS_ACTIVE = 'nav__layer--on';
    const CLASS_ITEM_EXPANDED = 'nav-item--on';
    const CLASS_NAME_ACTIVE = 'nav-name--active';

    function closeSiblingNavLayers(navItemToKeepOpen) {
        const parentElement = navItemToKeepOpen.parentNode;
        if (!parentElement) return;

        const siblingNavItems = parentElement.querySelectorAll(`:scope > ${NAV_ITEM_SELECTOR}`);
        siblingNavItems.forEach(sibling => {
            if (sibling !== navItemToKeepOpen) {
                const layer = sibling.querySelector(`:scope > ${NAV_LAYER_SELECTOR}`);
                if (layer && layer.classList.contains(CLASS_ACTIVE)) {
                    layer.classList.remove(CLASS_ACTIVE);
                    sibling.classList.remove(CLASS_ITEM_EXPANDED);
                    const nameElement = sibling.querySelector(NAV_NAME_SELECTOR);
                    if (nameElement) {
                        nameElement.classList.remove(CLASS_NAME_ACTIVE);
                    }
                }
            }
        });
    }

    function toggleNavLayerState(navItemToToggle) {
        const layerToToggle = navItemToToggle.querySelector(`:scope > ${NAV_LAYER_SELECTOR}`);
        if (!layerToToggle) return;

        const navNameToStyle = navItemToToggle.querySelector(NAV_NAME_SELECTOR);

        const isCurrentlyActive = layerToToggle.classList.contains(CLASS_ACTIVE);

        if (!isCurrentlyActive) {
            closeSiblingNavLayers(navItemToToggle);
        }

        layerToToggle.classList.toggle(CLASS_ACTIVE);
        navItemToToggle.classList.toggle(CLASS_ITEM_EXPANDED, !isCurrentlyActive);
        if (navNameToStyle) {
            navNameToStyle.classList.toggle(CLASS_NAME_ACTIVE, !isCurrentlyActive);
        }
    }

    function handleDesktopNavClick(event) {
        if (window.innerWidth < DESKTOP_BREAKPOINT) {
            return;
        }

        const clickedNavBtn = event.target.closest(NAV_BTN_SELECTOR);

        if (!clickedNavBtn) {
            return;
        }

        event.preventDefault();

        const currentNavItem = clickedNavBtn.closest(NAV_ITEM_SELECTOR);
        if (!currentNavItem) {
            return;
        }

        toggleNavLayerState(currentNavItem);
    }

    document.addEventListener('click', handleDesktopNavClick);
}

/**
 * Function: scroll change navbar to hamborger
 * Ex.: all header
 * Date: 2025/05/22
 * Author: designer11
 */
function temporarilyRemoveTransition(element, callback) {
    if (!element) return;

    const originalTransition = element.style.transition;
    element.style.transition = 'none';
    void element.offsetHeight;
    callback();

    setTimeout(() => {
        element.style.transition = originalTransition || '';
    }, 0);
}

function clickSearchButtonIfOpen() {
    const searchForm = document.querySelector('.header__search-form');
    const searchBtn = document.querySelector('.header__search-icon');

    if (searchForm?.classList.contains('header__search-form--on') && searchBtn) {
        temporarilyRemoveTransition(searchForm, () => {
            searchBtn.click();
        });
    }
}

function clickCartCloseIfOpen() {
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartCloseBtn = document.querySelector('.cart-drawer .close-btn');

    if (cartDrawer?.classList.contains('cart-drawer-open') && cartCloseBtn) {
        temporarilyRemoveTransition(cartDrawer, () => {
            cartCloseBtn.click();
        });
    }
}

function updateHeaderState() {
    const header = document.querySelector('header');
    const searchForm = document.querySelector('.header__search-form');
    const cartDrawer = document.querySelector('.cart-drawer');

    const isSearchOpen = searchForm?.classList.contains('header__search-form--on');
    const isCartOpen = cartDrawer?.classList.contains('cart-drawer-open');

    if (header) {
        if (isSearchOpen || isCartOpen) {
            header.classList.add('header--fixed', 'header__inner_after_control');
            header.classList.remove('header--unfixed');
        } else {
            header.classList.remove('header--fixed', 'header__inner_after_control');
            header.classList.add('header--unfixed');
        }
    }
}

function initHeaderState() {
    clickSearchButtonIfOpen();
    clickCartCloseIfOpen();
}

function setupHeaderScrollToggle({
     headerSelector = 'header',
     showAgainOffset = 50,
     appendHtml = '<div class="custom-nav-toggler">🔽 更多選項</div>',
     elementVisibilityOnVisible = {}
 } = {}) {
    let initialized = false;
    let scrollHandler = null;
    let customNavToggler = null;
    let resizeTimer = null;

    function init() {
        if (window.innerWidth <= 991 || initialized) return;

        const header = document.querySelector(headerSelector);
        const headerInner = header?.querySelector('.header__inner');
        if (!header || !headerInner) return;

        initialized = true;

        if (!headerInner.querySelector('.custom-nav-toggler')) {
            headerInner.insertAdjacentHTML('beforeend', appendHtml);
        }
        customNavToggler = headerInner.querySelector('.custom-nav-toggler');

        if (customNavToggler && !customNavToggler.dataset.bound) {
            customNavToggler.addEventListener('click', () => {
                for (const selector in elementVisibilityOnVisible) {
                    const el = selector === '.header__inner::after'
                        ? headerInner
                        : headerInner.querySelector(selector);
                    if (el) el.classList.toggle(selector === '.header__inner::after' ? 'no-after' : 'hide-element');
                }
            });
            customNavToggler.dataset.bound = 'true';
        }

        const applyVisibilitySettings = () => {
            for (const selector in elementVisibilityOnVisible) {
                const el = selector === '.header__inner::after'
                    ? headerInner
                    : headerInner.querySelector(selector);
                if (el) el.classList.toggle(selector === '.header__inner::after' ? 'no-after' : 'hide-element', !elementVisibilityOnVisible[selector]);
            }
        };

        scrollHandler = () => {
            const scrollY = window.scrollY;

            if (scrollY === 0) {
                initHeaderState();
                header.classList.remove('header-hidden');
                customNavToggler.style.display = 'none';

                header.onmouseenter = () => {
                    header.classList.add('header--fixed', 'header__inner_after_control');
                    header.classList.remove('header--unfixed');
                };
                header.onmouseleave = () => {
                    header.classList.remove('header--fixed', 'header__inner_after_control');
                    header.classList.add('header--unfixed');
                    updateHeaderState();
                };

            } else if (scrollY < showAgainOffset) {
                initHeaderState();
                header.classList.add('header-hidden');
                header.classList.remove('header-visible', 'header__inner_after_control');

                header.onmouseenter = () => header.classList.remove('header__inner_after_control');
                header.onmouseleave = () => header.classList.remove('header--unfixed');

            } else {
                initHeaderState();
                applyVisibilitySettings();
                header.classList.remove('header-hidden', 'header__inner_after_control');
                header.classList.add('header-visible');
                customNavToggler.style.display = 'block';

                header.onmouseenter = () => header.classList.remove('header__inner_after_control');
                header.onmouseleave = () => header.classList.remove('header--unfixed');
            }
        };

        window.addEventListener('scroll', scrollHandler);
        scrollHandler();
    }

    function cleanup() {
        if (!initialized) return;
        initialized = false;

        const header = document.querySelector(headerSelector);
        if (header) {
            header.classList.remove(
                'header--fixed', 'header--unfixed',
                'header-hidden', 'header-visible', 'header__inner_after_control'
            );
            header.onmouseenter = null;
            header.onmouseleave = null;
        }

        window.removeEventListener('scroll', scrollHandler);
    }

    init();

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 991) {
                cleanup();
            } else {
                init();
            }
        }, 150);
    });
}

/**
 * Function: Add multiple logos
 * Ex.: all header
 * Date: 2025/05/22
 * Author: designer11
 */
function initializeAppLogic(imageSources) {
    const logoWrapper = document.querySelector('.logo.flex');
    if (!logoWrapper) {
        return;
    }

    const originalLink = logoWrapper.querySelector('a.logo__img');
    if (!originalLink) {
        return;
    }

    originalLink.classList.add('logo__img_original');
    const originalImg = originalLink.querySelector('img');
    if (originalImg) {
        originalImg.classList.add('nav_logo', 'nav_logo_original');
    }

    imageSources.forEach((src, index) => {
        const newLink = document.createElement('a');

        newLink.className = `logo__img logo__img_${index}`;
        newLink.href = originalLink.href || 'javascript:void(0)';
        newLink.title = originalLink.title || '';

        const newImg = document.createElement('img');

        newImg.className = `nav_logo nav_logo_${index}`;
        newImg.width = originalImg?.width || 150;
        newImg.height = originalImg?.height || 49;
        newImg.alt = originalImg?.alt || '';
        newImg.src = src;

        newLink.appendChild(newImg);
        logoWrapper.appendChild(newLink);
    });
}




