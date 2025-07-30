
// * smoothScrollNav.js
// * Copyright Pascal Heiniger
// * Created for Brauerei Andermatt by P. Heiniger

if (typeof Object.create !== "function") {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document, undefined) {
    "use strict";

    // Core nav object
    var SinglePageNav = {
        // Initialize plugin
        init: function(options, container) {
            this.options = $.extend({}, $.fn.singlePageNav.defaults, options);
            this.container = container;
            this.$container = $(container);
            this.$links = this.$container.find("a");

            if (this.options.filter !== "") {
                this.$links = this.$links.filter(this.options.filter);
            }

            this.$window = $(window);
            this.$htmlbody = $("html, body");
            this.$links.on("click.singlePageNav", $.proxy(this.handleClick, this));

            this.didScroll = false;
            this.checkPosition();
            this.setTimer();
        },

        // Handle anchor click
        handleClick: function(e) {
            var self = this;
            var target = e.currentTarget;
            var $target = $(target.hash);

            e.preventDefault();

            if ($target.length) {
                self.clearTimer();

                if (typeof self.options.beforeStart === "function") {
                    self.options.beforeStart();
                }

                self.setActiveLink(target.hash);

                self.scrollTo($target, function() {
                    if (self.options.updateHash && history.pushState) {
                        history.pushState(null, null, target.hash);
                    }

                    self.setTimer();

                    if (typeof self.options.onComplete === "function") {
                        self.options.onComplete();
                    }
                });
            }
        },

        // Scroll animation
        scrollTo: function($target, callback) {
            var self = this;
            var targetOffset = self.getCoords($target).top;
            var called = false;

            self.$htmlbody.stop().animate({ scrollTop: targetOffset }, {
                duration: self.options.speed,
                easing: self.options.easing,
                complete: function() {
                    if (typeof callback === "function" && !called) {
                        callback();
                        called = true;
                    }
                }
            });
        },

        // Set scroll event timer
        setTimer: function() {
            var self = this;
            self.$window.on("scroll.singlePageNav", function() {
                self.didScroll = true;
            });

            self.timer = setInterval(function() {
                if (self.didScroll) {
                    self.didScroll = false;
                    self.checkPosition();
                }
            }, 250);
        },

        // Clear scroll event timer
        clearTimer: function() {
            clearInterval(this.timer);
            this.$window.off("scroll.singlePageNav");
            this.didScroll = false;
        },

        // Check scroll position and highlight current section
        checkPosition: function() {
            var scrollTop = this.$window.scrollTop();
            var currentSection = this.getCurrentSection(scrollTop);
            this.setActiveLink(currentSection);
        },

        // Get vertical coordinates of target
        getCoords: function($el) {
            return {
                top: Math.round($el.offset().top) - this.options.offset
            };
        },

        // Add active class to current link
        setActiveLink: function(hash) {
            var $activeLink = this.$container.find("a[href$='" + hash + "']");

            if (!$activeLink.hasClass(this.options.currentClass)) {
                this.$links.removeClass(this.options.currentClass);
                $activeLink.addClass(this.options.currentClass);
            }
        },

        // Get section currently in view
        getCurrentSection: function(scrollTop) {
            var section, hash, coords, i;
            for (i = 0; i < this.$links.length; i++) {
                hash = this.$links[i].hash;
                if ($(hash).length) {
                    coords = this.getCoords($(hash));
                    if (scrollTop >= coords.top - this.options.threshold) {
                        section = hash;
                    }
                }
            }
            return section || this.$links[0].hash;
        }
    };

    // Attach plugin to jQuery
    $.fn.singlePageNav = function(options) {
        return this.each(function() {
            var nav = Object.create(SinglePageNav);
            nav.init(options, this);
        });
    };

    // Default plugin options
    $.fn.singlePageNav.defaults = {
        offset: 0,
        threshold: 120,
        speed: 400,
        currentClass: "current",
        easing: "swing",
        updateHash: false,
        filter: "",
        onComplete: false,
        beforeStart: false
    };

})(jQuery, window, document);
