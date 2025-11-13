/*
 ******************************************
 * Include Plugins
 ******************************************
 */

// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

    var defaults = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: 'is-sticky',
            wrapperClassName: 'sticky-wrapper',
            center: false,
            getWidthFrom: '',
            widthFromWrapper: true, // works only when .getWidthFrom is empty
            responsiveWidth: false,
            zIndex: 'inherit'
        },
        $window = $(window),
        $document = $(document),
        sticked = [],
        windowHeight = $window.height(),
        scroller = function () {
            var scrollTop = $window.scrollTop(),
                documentHeight = $document.height(),
                dwh = documentHeight - windowHeight,
                extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i],
                    elementTop = s.stickyWrapper.offset().top,
                    etse = elementTop - s.topSpacing - extra;

                //update height in case of dynamic content
                s.stickyWrapper.css('height', s.stickyElement.outerHeight());

                if (scrollTop <= etse) {
                    if (s.currentTop !== null) {
                        s.stickyElement
                            .css({
                                'width': '',
                                'position': '',
                                'top': '',
                                'z-index': ''
                            });
                        s.stickyElement.parent().removeClass(s.className);
                        s.stickyElement.trigger('sticky-end', [s]);
                        s.currentTop = null;
                    }
                } else {
                    var newTop = documentHeight - s.stickyElement.outerHeight()
                        - s.topSpacing - s.bottomSpacing - scrollTop - extra;
                    if (newTop < 0) {
                        newTop = newTop + s.topSpacing;
                    } else {
                        newTop = s.topSpacing;
                    }
                    if (s.currentTop !== newTop) {
                        var newWidth;
                        if (s.getWidthFrom) {
                            padding = s.stickyElement.innerWidth() - s.stickyElement.width();
                            newWidth = $(s.getWidthFrom).width() - padding || null;
                        } else if (s.widthFromWrapper) {
                            newWidth = s.stickyWrapper.width();
                        }
                        if (newWidth == null) {
                            newWidth = s.stickyElement.width();
                        }
                        s.stickyElement
                            .css('width', newWidth)
                            .css('position', 'fixed')
                            .css('top', newTop)
                            .css('z-index', s.zIndex);

                        s.stickyElement.parent().addClass(s.className);

                        if (s.currentTop === null) {
                            s.stickyElement.trigger('sticky-start', [s]);
                        } else {
                            // sticky is started but it have to be repositioned
                            s.stickyElement.trigger('sticky-update', [s]);
                        }

                        if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
                            // just reached bottom || just started to stick but bottom is already reached
                            s.stickyElement.trigger('sticky-bottom-reached', [s]);
                        } else if (s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
                            // sticky is started && sticked at topSpacing && overflowing from top just finished
                            s.stickyElement.trigger('sticky-bottom-unreached', [s]);
                        }

                        s.currentTop = newTop;
                    }

                    // Check if sticky has reached end of container and stop sticking
                    var stickyWrapperContainer = s.stickyWrapper.parent();
                    var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

                    if (unstick) {
                        s.stickyElement
                            .css('position', 'absolute')
                            .css('top', '')
                            .css('bottom', 0)
                            .css('z-index', '');
                    } else {
                        s.stickyElement
                            .css('position', 'fixed')
                            .css('top', newTop)
                            .css('bottom', '')
                            .css('z-index', s.zIndex);
                    }
                }
            }
        },
        resizer = function () {
            windowHeight = $window.height();

            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i];
                var newWidth = null;
                if (s.getWidthFrom) {
                    if (s.responsiveWidth) {
                        newWidth = $(s.getWidthFrom).width();
                    }
                } else if (s.widthFromWrapper) {
                    newWidth = s.stickyWrapper.width();
                }
                if (newWidth != null) {
                    s.stickyElement.css('width', newWidth);
                }
            }
        },
        methods = {
            init: function (options) {
                return this.each(function () {
                    var o = $.extend({}, defaults, options);
                    var stickyElement = $(this);

                    var stickyId = stickyElement.attr('id');
                    var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
                    var wrapper = $('<div></div>')
                        .attr('id', wrapperId)
                        .addClass(o.wrapperClassName);

                    stickyElement.wrapAll(function () {
                        if ($(this).parent("#" + wrapperId).length == 0) {
                            return wrapper;
                        }
                    });

                    var stickyWrapper = stickyElement.parent();

                    if (o.center) {
                        stickyWrapper.css({width: stickyElement.outerWidth(), marginLeft: "auto", marginRight: "auto"});
                    }

                    if (stickyElement.css("float") === "right") {
                        stickyElement.css({"float": "none"}).parent().css({"float": "right"});
                    }

                    o.stickyElement = stickyElement;
                    o.stickyWrapper = stickyWrapper;
                    o.currentTop = null;

                    sticked.push(o);

                    methods.setWrapperHeight(this);
                    methods.setupChangeListeners(this);
                });
            },

            setWrapperHeight: function (stickyElement) {
                var element = $(stickyElement);
                var stickyWrapper = element.parent();
                if (stickyWrapper) {
                    stickyWrapper.css('height', element.outerHeight());
                }
            },

            setupChangeListeners: function (stickyElement) {
                if (window.MutationObserver) {
                    var mutationObserver = new window.MutationObserver(function (mutations) {
                        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                            methods.setWrapperHeight(stickyElement);
                        }
                    });
                    mutationObserver.observe(stickyElement, {subtree: true, childList: true});
                } else {
                    if (window.addEventListener) {
                        stickyElement.addEventListener('DOMNodeInserted', function () {
                            methods.setWrapperHeight(stickyElement);
                        }, false);
                        stickyElement.addEventListener('DOMNodeRemoved', function () {
                            methods.setWrapperHeight(stickyElement);
                        }, false);
                    } else if (window.attachEvent) {
                        stickyElement.attachEvent('onDOMNodeInserted', function () {
                            methods.setWrapperHeight(stickyElement);
                        });
                        stickyElement.attachEvent('onDOMNodeRemoved', function () {
                            methods.setWrapperHeight(stickyElement);
                        });
                    }
                }
            },
            update: scroller,
            unstick: function (options) {
                return this.each(function () {
                    var that = this;
                    var unstickyElement = $(that);

                    var removeIdx = -1;
                    var i = sticked.length;
                    while (i-- > 0) {
                        if (sticked[i].stickyElement.get(0) === that) {
                            splice.call(sticked, i, 1);
                            removeIdx = i;
                        }
                    }
                    if (removeIdx !== -1) {
                        unstickyElement.unwrap();
                        unstickyElement
                            .css({
                                'width': '',
                                'position': '',
                                'top': '',
                                'float': '',
                                'z-index': ''
                            })
                        ;
                    }
                });
            }
        };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
        window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
        window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', resizer);
    }

    $.fn.sticky = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };

    $.fn.unstick = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.unstick.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };
    $(function () {
        setTimeout(scroller, 0);
    });
}));
/*
 * ======================================
 * Lazy
 * ======================================
 */
/*!
 * jQuery & Zepto Lazy - v1.7.10
 * http://jquery.eisbehr.de/lazy/
 *
 * Copyright 2012 - 2018, Daniel 'Eisbehr' Kern
 *
 * Dual licensed under the MIT and GPL-2.0 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * $("img.lazy").lazy();
 */

;(function (window, undefined) {
    "use strict";

    // noinspection JSUnresolvedVariable
    /**
     * library instance - here and not in construct to be shorter in minimization
     * @return void
     */
    var $ = window.jQuery || window.Zepto,

        /**
         * unique plugin instance id counter
         * @type {number}
         */
        lazyInstanceId = 0,

        /**
         * helper to register window load for jQuery 3
         * @type {boolean}
         */
        windowLoaded = false;

    /**
     * make lazy available to jquery - and make it a bit more case-insensitive :)
     * @access public
     * @type {function}
     * @param {object} settings
     * @return {LazyPlugin}
     */
    $.fn.Lazy = $.fn.lazy = function (settings) {
        return new LazyPlugin(this, settings);
    };

    /**
     * helper to add plugins to lazy prototype configuration
     * @access public
     * @type {function}
     * @param {string|Array} names
     * @param {string|Array|function} [elements]
     * @param {function} loader
     * @return void
     */
    $.Lazy = $.lazy = function (names, elements, loader) {
        // make second parameter optional
        if ($.isFunction(elements)) {
            loader = elements;
            elements = [];
        }

        // exit here if parameter is not a callable function
        if (!$.isFunction(loader)) {
            return;
        }

        // make parameters an array of names to be sure
        names = $.isArray(names) ? names : [names];
        elements = $.isArray(elements) ? elements : [elements];

        var config = LazyPlugin.prototype.config,
            forced = config._f || (config._f = {});

        // add the loader plugin for every name
        for (var i = 0, l = names.length; i < l; i++) {
            if (config[names[i]] === undefined || $.isFunction(config[names[i]])) {
                config[names[i]] = loader;
            }
        }

        // add forced elements loader
        for (var c = 0, a = elements.length; c < a; c++) {
            forced[elements[c]] = names[0];
        }
    };

    /**
     * contains all logic and the whole element handling
     * is packed in a private function outside class to reduce memory usage, because it will not be created on every plugin instance
     * @access private
     * @type {function}
     * @param {LazyPlugin} instance
     * @param {object} config
     * @param {object|Array} items
     * @param {object} events
     * @param {string} namespace
     * @return void
     */
    function _executeLazy(instance, config, items, events, namespace) {
        /**
         * a helper to trigger the 'onFinishedAll' callback after all other events
         * @access private
         * @type {number}
         */
        var _awaitingAfterLoad = 0,

            /**
             * visible content width
             * @access private
             * @type {number}
             */
            _actualWidth = -1,

            /**
             * visible content height
             * @access private
             * @type {number}
             */
            _actualHeight = -1,

            /**
             * determine possibly detected high pixel density
             * @access private
             * @type {boolean}
             */
            _isRetinaDisplay = false,

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _afterLoad = 'afterLoad',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _load = 'load',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _error = 'error',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _img = 'img',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _src = 'src',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _srcset = 'srcset',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _sizes = 'sizes',

            /**
             * dictionary entry for better minimization
             * @access private
             * @type {string}
             */
            _backgroundImage = 'background-image';

        /**
         * initialize plugin
         * bind loading to events or set delay time to load all items at once
         * @access private
         * @return void
         */
        function _initialize() {
            // detect actual device pixel ratio
            // noinspection JSUnresolvedVariable
            _isRetinaDisplay = window.devicePixelRatio > 1;

            // prepare all initial items
            items = _prepareItems(items);

            // if delay time is set load all items at once after delay time
            if (config.delay >= 0) {
                setTimeout(function () {
                    _lazyLoadItems(true);
                }, config.delay);
            }

            // if no delay is set or combine usage is active bind events
            if (config.delay < 0 || config.combined) {
                // create unique event function
                events.e = _throttle(config.throttle, function (event) {
                    // reset detected window size on resize event
                    if (event.type === 'resize') {
                        _actualWidth = _actualHeight = -1;
                    }

                    // execute 'lazy magic'
                    _lazyLoadItems(event.all);
                });

                // create function to add new items to instance
                events.a = function (additionalItems) {
                    additionalItems = _prepareItems(additionalItems);
                    items.push.apply(items, additionalItems);
                };

                // create function to get all instance items left
                events.g = function () {
                    // filter loaded items before return in case internal filter was not running until now
                    return (items = $(items).filter(function () {
                        return !$(this).data(config.loadedName);
                    }));
                };

                // create function to force loading elements
                events.f = function (forcedItems) {
                    for (var i = 0; i < forcedItems.length; i++) {
                        // only handle item if available in current instance
                        // use a compare function, because Zepto can't handle object parameter for filter
                        // var item = items.filter(forcedItems[i]);
                        /* jshint loopfunc: true */
                        var item = items.filter(function () {
                            return this === forcedItems[i];
                        });

                        if (item.length) {
                            _lazyLoadItems(false, item);
                        }
                    }
                };

                // load initial items
                _lazyLoadItems();

                // bind lazy load functions to scroll and resize event
                // noinspection JSUnresolvedVariable
                $(config.appendScroll).on('scroll.' + namespace + ' resize.' + namespace, events.e);
            }
        }

        /**
         * prepare items before handle them
         * @access private
         * @param {Array|object|jQuery} items
         * @return {Array|object|jQuery}
         */
        function _prepareItems(items) {
            // fetch used configurations before loops
            var defaultImage = config.defaultImage,
                placeholder = config.placeholder,
                imageBase = config.imageBase,
                srcsetAttribute = config.srcsetAttribute,
                loaderAttribute = config.loaderAttribute,
                forcedTags = config._f || {};

            // filter items and only add those who not handled yet and got needed attributes available
            items = $(items).filter(function () {
                var element = $(this),
                    tag = _getElementTagName(this);

                return !element.data(config.handledName) &&
                    (element.attr(config.attribute) || element.attr(srcsetAttribute) || element.attr(loaderAttribute) || forcedTags[tag] !== undefined);
            })

                // append plugin instance to all elements
                .data('plugin_' + config.name, instance);

            for (var i = 0, l = items.length; i < l; i++) {
                var element = $(items[i]),
                    tag = _getElementTagName(items[i]),
                    elementImageBase = element.attr(config.imageBaseAttribute) || imageBase;

                // generate and update source set if an image base is set
                if (tag === _img && elementImageBase && element.attr(srcsetAttribute)) {
                    element.attr(srcsetAttribute, _getCorrectedSrcSet(element.attr(srcsetAttribute), elementImageBase));
                }

                // add loader to forced element types
                if (forcedTags[tag] !== undefined && !element.attr(loaderAttribute)) {
                    element.attr(loaderAttribute, forcedTags[tag]);
                }

                // set default image on every element without source
                if (tag === _img && defaultImage && !element.attr(_src)) {
                    element.attr(_src, defaultImage);
                }

                // set placeholder on every element without background image
                else if (tag !== _img && placeholder && (!element.css(_backgroundImage) || element.css(_backgroundImage) === 'none')) {
                    element.css(_backgroundImage, "url('" + placeholder + "')");
                }
            }

            return items;
        }

        /**
         * the 'lazy magic' - check all items
         * @access private
         * @param {boolean} [allItems]
         * @param {object} [forced]
         * @return void
         */
        function _lazyLoadItems(allItems, forced) {
            // skip if no items where left
            if (!items.length) {
                // destroy instance if option is enabled
                if (config.autoDestroy) {
                    // noinspection JSUnresolvedFunction
                    instance.destroy();
                }

                return;
            }

            var elements = forced || items,
                loadTriggered = false,
                imageBase = config.imageBase || '',
                srcsetAttribute = config.srcsetAttribute,
                handledName = config.handledName;

            // loop all available items
            for (var i = 0; i < elements.length; i++) {
                // item is at least in loadable area
                if (allItems || forced || _isInLoadableArea(elements[i])) {
                    var element = $(elements[i]),
                        tag = _getElementTagName(elements[i]),
                        attribute = element.attr(config.attribute),
                        elementImageBase = element.attr(config.imageBaseAttribute) || imageBase,
                        customLoader = element.attr(config.loaderAttribute);

                    // is not already handled
                    if (!element.data(handledName) &&
                        // and is visible or visibility doesn't matter
                        (!config.visibleOnly || element.is(':visible')) && (
                            // and image source or source set attribute is available
                            (attribute || element.attr(srcsetAttribute)) && (
                                // and is image tag where attribute is not equal source or source set
                                (tag === _img && (elementImageBase + attribute !== element.attr(_src) || element.attr(srcsetAttribute) !== element.attr(_srcset))) ||
                                // or is non image tag where attribute is not equal background
                                (tag !== _img && elementImageBase + attribute !== element.css(_backgroundImage))
                            ) ||
                            // or custom loader is available
                            customLoader)) {
                        // mark element always as handled as this point to prevent double handling
                        loadTriggered = true;
                        element.data(handledName, true);

                        // load item
                        _handleItem(element, tag, elementImageBase, customLoader);
                    }
                }
            }

            // when something was loaded remove them from remaining items
            if (loadTriggered) {
                items = $(items).filter(function () {
                    return !$(this).data(handledName);
                });
            }
        }

        /**
         * load the given element the lazy way
         * @access private
         * @param {object} element
         * @param {string} tag
         * @param {string} imageBase
         * @param {function} [customLoader]
         * @return void
         */
        function _handleItem(element, tag, imageBase, customLoader) {
            // increment count of items waiting for after load
            ++_awaitingAfterLoad;

            // extended error callback for correct 'onFinishedAll' handling
            var errorCallback = function () {
                _triggerCallback('onError', element);
                _reduceAwaiting();

                // prevent further callback calls
                errorCallback = $.noop;
            };

            // trigger function before loading image
            _triggerCallback('beforeLoad', element);

            // fetch all double used data here for better code minimization
            var srcAttribute = config.attribute,
                srcsetAttribute = config.srcsetAttribute,
                sizesAttribute = config.sizesAttribute,
                retinaAttribute = config.retinaAttribute,
                removeAttribute = config.removeAttribute,
                loadedName = config.loadedName,
                elementRetina = element.attr(retinaAttribute);

            // handle custom loader
            if (customLoader) {
                // on load callback
                var loadCallback = function () {
                    // remove attribute from element
                    if (removeAttribute) {
                        element.removeAttr(config.loaderAttribute);
                    }

                    // mark element as loaded
                    element.data(loadedName, true);

                    // call after load event
                    _triggerCallback(_afterLoad, element);

                    // remove item from waiting queue and possibly trigger finished event
                    // it's needed to be asynchronous to run after filter was in _lazyLoadItems
                    setTimeout(_reduceAwaiting, 1);

                    // prevent further callback calls
                    loadCallback = $.noop;
                };

                // bind error event to trigger callback and reduce waiting amount
                element.off(_error).one(_error, errorCallback)

                    // bind after load callback to element
                    .one(_load, loadCallback);

                // trigger custom loader and handle response
                if (!_triggerCallback(customLoader, element, function (response) {
                    if (response) {
                        element.off(_load);
                        loadCallback();
                    } else {
                        element.off(_error);
                        errorCallback();
                    }
                })) {
                    element.trigger(_error);
                }
            }

            // handle images
            else {
                // create image object
                var imageObj = $(new Image());

                // bind error event to trigger callback and reduce waiting amount
                imageObj.one(_error, errorCallback)

                    // bind after load callback to image
                    .one(_load, function () {
                        // remove element from view
                        element.hide();

                        // set image back to element
                        // do it as single 'attr' calls, to be sure 'src' is set after 'srcset'
                        if (tag === _img) {
                            element.attr(_sizes, imageObj.attr(_sizes))
                                .attr(_srcset, imageObj.attr(_srcset))
                                .attr(_src, imageObj.attr(_src));
                        } else {
                            element.css(_backgroundImage, "url('" + imageObj.attr(_src) + "')");
                        }

                        // bring it back with some effect!
                        element[config.effect](config.effectTime);

                        // remove attribute from element
                        if (removeAttribute) {
                            element.removeAttr(srcAttribute + ' ' + srcsetAttribute + ' ' + retinaAttribute + ' ' + config.imageBaseAttribute);

                            // only remove 'sizes' attribute, if it was a custom one
                            if (sizesAttribute !== _sizes) {
                                element.removeAttr(sizesAttribute);
                            }
                        }

                        // mark element as loaded
                        element.data(loadedName, true);

                        // call after load event
                        _triggerCallback(_afterLoad, element);

                        // cleanup image object
                        imageObj.remove();

                        // remove item from waiting queue and possibly trigger finished event
                        _reduceAwaiting();
                    });

                // set sources
                // do it as single 'attr' calls, to be sure 'src' is set after 'srcset'
                var imageSrc = (_isRetinaDisplay && elementRetina ? elementRetina : element.attr(srcAttribute)) || '';
                imageObj.attr(_sizes, element.attr(sizesAttribute))
                    .attr(_srcset, element.attr(srcsetAttribute))
                    .attr(_src, imageSrc ? imageBase + imageSrc : null);

                // call after load even on cached image
                imageObj.complete && imageObj.trigger(_load); // jshint ignore : line
            }
        }

        /**
         * check if the given element is inside the current viewport or threshold
         * @access private
         * @param {object} element
         * @return {boolean}
         */
        function _isInLoadableArea(element) {
            var elementBound = element.getBoundingClientRect(),
                direction = config.scrollDirection,
                threshold = config.threshold,
                vertical = // check if element is in loadable area from top
                    ((_getActualHeight() + threshold) > elementBound.top) &&
                    // check if element is even in loadable are from bottom
                    (-threshold < elementBound.bottom),
                horizontal = // check if element is in loadable area from left
                    ((_getActualWidth() + threshold) > elementBound.left) &&
                    // check if element is even in loadable area from right
                    (-threshold < elementBound.right);

            if (direction === 'vertical') {
                return vertical;
            } else if (direction === 'horizontal') {
                return horizontal;
            }

            return vertical && horizontal;
        }

        /**
         * receive the current viewed width of the browser
         * @access private
         * @return {number}
         */
        function _getActualWidth() {
            return _actualWidth >= 0 ? _actualWidth : (_actualWidth = $(window).width());
        }

        /**
         * receive the current viewed height of the browser
         * @access private
         * @return {number}
         */
        function _getActualHeight() {
            return _actualHeight >= 0 ? _actualHeight : (_actualHeight = $(window).height());
        }

        /**
         * get lowercase tag name of an element
         * @access private
         * @param {object} element
         * @returns {string}
         */
        function _getElementTagName(element) {
            return element.tagName.toLowerCase();
        }

        /**
         * prepend image base to all srcset entries
         * @access private
         * @param {string} srcset
         * @param {string} imageBase
         * @returns {string}
         */
        function _getCorrectedSrcSet(srcset, imageBase) {
            if (imageBase) {
                // trim, remove unnecessary spaces and split entries
                var entries = srcset.split(',');
                srcset = '';

                for (var i = 0, l = entries.length; i < l; i++) {
                    srcset += imageBase + entries[i].trim() + (i !== l - 1 ? ',' : '');
                }
            }

            return srcset;
        }

        /**
         * helper function to throttle down event triggering
         * @access private
         * @param {number} delay
         * @param {function} callback
         * @return {function}
         */
        function _throttle(delay, callback) {
            var timeout,
                lastExecute = 0;

            return function (event, ignoreThrottle) {
                var elapsed = +new Date() - lastExecute;

                function run() {
                    lastExecute = +new Date();
                    // noinspection JSUnresolvedFunction
                    callback.call(instance, event);
                }

                timeout && clearTimeout(timeout); // jshint ignore : line

                if (elapsed > delay || !config.enableThrottle || ignoreThrottle) {
                    run();
                } else {
                    timeout = setTimeout(run, delay - elapsed);
                }
            };
        }

        /**
         * reduce count of awaiting elements to 'afterLoad' event and fire 'onFinishedAll' if reached zero
         * @access private
         * @return void
         */
        function _reduceAwaiting() {
            --_awaitingAfterLoad;

            // if no items were left trigger finished event
            if (!items.length && !_awaitingAfterLoad) {
                _triggerCallback('onFinishedAll');
            }
        }

        /**
         * single implementation to handle callbacks, pass element and set 'this' to current instance
         * @access private
         * @param {string|function} callback
         * @param {object} [element]
         * @param {*} [args]
         * @return {boolean}
         */
        function _triggerCallback(callback, element, args) {
            if ((callback = config[callback])) {
                // jQuery's internal '$(arguments).slice(1)' are causing problems at least on old iPads
                // below is shorthand of 'Array.prototype.slice.call(arguments, 1)'
                callback.apply(instance, [].slice.call(arguments, 1));
                return true;
            }

            return false;
        }

        // if event driven or window is already loaded don't wait for page loading
        if (config.bind === 'event' || windowLoaded) {
            _initialize();
        }

        // otherwise load initial items and start lazy after page load
        else {
            // noinspection JSUnresolvedVariable
            $(window).on(_load + '.' + namespace, _initialize);
        }
    }

    /**
     * lazy plugin class constructor
     * @constructor
     * @access private
     * @param {object} elements
     * @param {object} settings
     * @return {object|LazyPlugin}
     */
    function LazyPlugin(elements, settings) {
        /**
         * this lazy plugin instance
         * @access private
         * @type {object|LazyPlugin|LazyPlugin.prototype}
         */
        var _instance = this,

            /**
             * this lazy plugin instance configuration
             * @access private
             * @type {object}
             */
            _config = $.extend({}, _instance.config, settings),

            /**
             * instance generated event executed on container scroll or resize
             * packed in an object to be referenceable and short named because properties will not be minified
             * @access private
             * @type {object}
             */
            _events = {},

            /**
             * unique namespace for instance related events
             * @access private
             * @type {string}
             */
            _namespace = _config.name + '-' + (++lazyInstanceId);

        // noinspection JSUndefinedPropertyAssignment
        /**
         * wrapper to get or set an entry from plugin instance configuration
         * much smaller on minify as direct access
         * @access public
         * @type {function}
         * @param {string} entryName
         * @param {*} [value]
         * @return {LazyPlugin|*}
         */
        _instance.config = function (entryName, value) {
            if (value === undefined) {
                return _config[entryName];
            }

            _config[entryName] = value;
            return _instance;
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * add additional items to current instance
         * @access public
         * @param {Array|object|string} items
         * @return {LazyPlugin}
         */
        _instance.addItems = function (items) {
            _events.a && _events.a($.type(items) === 'string' ? $(items) : items); // jshint ignore : line
            return _instance;
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * get all left items of this instance
         * @access public
         * @returns {object}
         */
        _instance.getItems = function () {
            return _events.g ? _events.g() : {};
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * force lazy to load all items in loadable area right now
         * by default without throttle
         * @access public
         * @type {function}
         * @param {boolean} [useThrottle]
         * @return {LazyPlugin}
         */
        _instance.update = function (useThrottle) {
            _events.e && _events.e({}, !useThrottle); // jshint ignore : line
            return _instance;
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * force element(s) to load directly, ignoring the viewport
         * @access public
         * @param {Array|object|string} items
         * @return {LazyPlugin}
         */
        _instance.force = function (items) {
            _events.f && _events.f($.type(items) === 'string' ? $(items) : items); // jshint ignore : line
            return _instance;
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * force lazy to load all available items right now
         * this call ignores throttling
         * @access public
         * @type {function}
         * @return {LazyPlugin}
         */
        _instance.loadAll = function () {
            _events.e && _events.e({all: true}, true); // jshint ignore : line
            return _instance;
        };

        // noinspection JSUndefinedPropertyAssignment
        /**
         * destroy this plugin instance
         * @access public
         * @type {function}
         * @return undefined
         */
        _instance.destroy = function () {
            // unbind instance generated events
            // noinspection JSUnresolvedFunction, JSUnresolvedVariable
            $(_config.appendScroll).off('.' + _namespace, _events.e);
            // noinspection JSUnresolvedVariable
            $(window).off('.' + _namespace);

            // clear events
            _events = {};

            return undefined;
        };

        // start using lazy and return all elements to be chainable or instance for further use
        // noinspection JSUnresolvedVariable
        _executeLazy(_instance, _config, elements, _events, _namespace);
        return _config.chainable ? elements : _instance;
    }

    /**
     * settings and configuration data
     * @access public
     * @type {object|*}
     */
    LazyPlugin.prototype.config = {
        // general
        name: 'lazy',
        chainable: true,
        autoDestroy: true,
        bind: 'load',
        threshold: 500,
        visibleOnly: false,
        appendScroll: window,
        scrollDirection: 'both',
        imageBase: null,
        defaultImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
        placeholder: null,
        delay: -1,
        combined: false,

        // attributes
        attribute: 'data-src',
        srcsetAttribute: 'data-srcset',
        sizesAttribute: 'data-sizes',
        retinaAttribute: 'data-retina',
        loaderAttribute: 'data-loader',
        imageBaseAttribute: 'data-imagebase',
        removeAttribute: true,
        handledName: 'handled',
        loadedName: 'loaded',

        // effect
        effect: 'show',
        effectTime: 0,

        // throttle
        enableThrottle: true,
        throttle: 250,

        // callbacks
        beforeLoad: undefined,
        afterLoad: undefined,
        onError: undefined,
        onFinishedAll: undefined
    };

    // register window load event globally to prevent not loading elements
    // since jQuery 3.X ready state is fully async and may be executed after 'load'
    $(window).on('load', function () {
        windowLoaded = true;
    });
})(window);


/*
 * ======================================
 * header search menu
 * ======================================
 */
$(function () {
    $('#searchBtn').on('click', function (e) {
        e.preventDefault();
        $('#searchMenu').addClass('open');
    })
    $('#searchMenuClose').on('click', function (e) {
        e.preventDefault();
        $('#searchMenu').removeClass('open');
    })
    $('#searchMenu').on('click', function (e) {
        if (e.target.nodeName === "INPUT" || e.target.nodeName === "BUTTON") {
            return;
        }
        if (e.target.nodeName !== "INPUT" || e.target.nodeName !== "BUTTON") {
            $('#searchMenu').removeClass('open');
        }
    })
})
/*
 * ======================================
 * Navbar
 * ======================================
 */

$(function () {
    (function ($) {
        var defaults = {
            sm: 540,
            md: 720,
            lg: 992,
            xl: 1140,
            navbar_expand: "lg",
            animation: true,
            animateIn: "fadeIn"
        };
        $.fn.bootnavbar = function (options) {
            var screen_width = $(document).width();
            settings = $.extend(defaults, options);

            if (screen_width >= settings.lg) {
                console.log($(this));
                $(this)
                    .find(".dropdown")
                    .click(function (e) {
                        console.log('click')
                        // 會影響 top 詢問車列表裡的刪除 event, 所以先關閉 by chonly at 2021/10/08--已失效
                        // 如果不是 header 詢問車的刪除才執行停止冒泡，這樣詢問車的刪除就可正常使用 by johnChen 2021/11/04
                        if(!e.target.closest('.product-remove')) e.stopPropagation()
                    })
                    .off('click', null, function () {
                    })
                    .hover(
                        function () {
                            console.log(555);
                            $(this).addClass("show");
                            $(this).find(".dropdown-menu").first().addClass("show");
                            if (settings.animation) {
                                $(this)
                                    .find(".dropdown-menu")
                                    .first()
                                    .addClass("animated " + settings.animateIn);
                            }
                        },
                        function () {
                            // mouse move out
                            $(this).removeClass("show");
                            $(this).find(".dropdown-menu").first().removeClass("show");
                        }
                    );
            } else {
                $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
                    if (!$(this).next().hasClass("show")) {
                        $(this)
                            .parents(".dropdown-menu")
                            .first()
                            .find(".show")
                            .removeClass("show");
                    }
                    var $subMenu = $(this).next(".dropdown-menu");
                    $subMenu.toggleClass("show");

                    $(this)
                        .parents("li.nav-item.dropdown.show")
                        .on("hidden.bs.dropdown", function (e) {
                            $(".dropdown-submenu .show").removeClass("show");
                        });

                    return false;
                });
            }


        };
    })(jQuery);

    $("#header__menu").bootnavbar();
});
/*
 * ======================================
 * goto top
 * ======================================
 */
$(function () {
    $(document).on('scroll', function () {
        let scrollTop_now = $('html, body').scrollTop();
        if (scrollTop_now >= 200) {
            $('#goTop').fadeIn();
        } else {
            $('#goTop').fadeOut();
        }
    })
    $('#goTop').on('click', function () {
        $('html, body').animate({
            scrollTop: 0,
        })
    })
})

/*
 * ======================================
 * index slider config
 * ======================================
 */
$(function () {
    // banner slider
    if ($(".carousel").length) {
        $(".carousel").carousel({
            interval: 8000, // or false
            keyboard: true,
            pause: "hover",
            ride: "carousel" // false "carousel"
        });
    }
    // Index Product category slider
    if ($('#index__pdtCat_slider').length) {
        $('#index__pdtCat_slider').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            focusOnSelect: true,
            infinite: false, // clone
            arrows: true,
            lazyLoad: 'ondemand',
            swipeToSlide: true,
            responsive: [
                // 由大到小 尺寸不太準 似乎是 max-width以下
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },

            ]
        });
    }
    // Index News Slider
    if ($('#index__news_slider').length) {
        $('#index__news_slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            // focusOnSelect: true,
            // infinite: false, // clone
            arrows: true,
            // autoplay: true,
            autoplaySpeed: 2000,
            dots: true,
            lazyLoad: 'ondemand',
            swipeToSlide: true,
            responsive: [
                // 由大到小 尺寸不太準 似乎是 max-width以下
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
            ]
        });
    }
    // 原地放大
    if ($('#pdtDetail__slider').length) {
        $('#pdtDetail__slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true,
            lazyLoad: 'ondemand',
            swipeToSlide: true,
        });
    }

    // 點選放大（lightbox）
    if ($('#pdtDetail__sliderZoom').length) {
        $('#pdtDetail__sliderZoom').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true,
            lazyLoad: 'ondemand',
            swipeToSlide: true,
        });

        $('#pdtDetail__sliderZoom').slickLightbox({
            itemSelector: 'a',
            navigateByKeyboard: true
        });
    }

    // 點小圖看大圖
    if ($('#pdtDetail__sliderSmall2Big__nav').length) {
        $('#pdtDetail__sliderSmall2Big__nav').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true,
            lazyLoad: 'ondemand',
            swipeToSlide: true,
            asNavFor: '#pdtDetail__sliderSmall2Big__for'
        });

        $('#pdtDetail__sliderSmall2Big__for').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: '#pdtDetail__sliderSmall2Big__nav',
            // dots: true,
            // centerMode: true,
            autoplay: true,
            focusOnSelect: true
        });

        $('#pdtDetail__sliderSmall2Big__nav').slickLightbox({
            itemSelector: 'a',
            navigateByKeyboard: true
        });
    }
})
/*
 * ======================================
 * sticky.jquery
 * ======================================
 */
$(function () {
    $(".sticky-header").sticky({
        topSpacing: 0,
        zIndex: 50,
    });
})

/*
 * ======================================
 * sidebar
 * ======================================
 */
$(function () {

    $("#sidebarNav > ul > li > .navLink").click(function () {
        // 所有先關閉
        $(".navLink").removeClass("open");
        $(".navLink +.subs").slideUp();
        $(this).removeClass("open");

        // 從this點選兄弟ul，判斷是否關閉
        if ($("+ul", this).css("display") === "none") {
            // 展開
            $("+ul", this).slideDown();
            $(this).addClass("open");
        }
    });

    // 註冊第二層點擊事件，除選擇器不同，其他與第一層完全一樣
    $(".subs .subs .navLink").click(function () {
        $(".subs-dropdown .navLink").removeClass("open");
        $(".subs .subs .navLink +.subs").slideUp();
        $(this).removeClass("open");

        if ($("+ul", this).css("display") === "none") {
            $("+ul", this).slideDown();
            $(this).addClass("open");
        }
    });
});
/*
 * ======================================
 * pdt-detail slider image zoom
 * ======================================
 */
$(function () {
    if ($(".image-zoom").length) $(".image-zoom").zoom();
})
/*
 * ======================================
 * index,pdt-list -> product item image height equals width
 * ======================================
 */
$(function () {
    $(window).on('resize', function () {
        height_equals_width();
    })

    height_equals_width();

    function height_equals_width() {
        if ($('.height-equals-width').length) {
            var w = $('.height-equals-width img').width();
            $('.height-equals-width').css('height', w + 'px');
        }

    }
})
/*
 * ======================================
 * Config settings
 * ======================================
 */
$(function () {
    $('.lazy').Lazy({
        // your configuration goes here
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        onError: function (element) {
            console.log('error loading ' + element.data('src'));
        }
    });
})
$(function () {
    if ($('.relative-product__carousel').length) {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
                nextEl: '.carousel-button-next',
                prevEl: '.carousel-button-prev',
            },
            loop: false,
            // init: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                '@0.00': {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                '@0.75': {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                '@1.00': {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
                '@1.50': {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            }
        });
    }
})