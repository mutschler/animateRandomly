/*
* animateRandomly
* https://github.com/mutschler/animateRandomly
*
* Copyright (c) 2016 Raphael Mutschler
* Licensed under the MIT license.
*/

(function($) {

  $.fn.animateRandomly = function(options) {

    var defaults = {
      cycles: 4,
      time: 1000,
      interval: 3000,
      debug: false,
      wrapper: window,
      inner: true,
      inside: true,
      pauseOnHover: true,
      easing: 'linear',
      revert: true,
      position: "absolute",
      namespace: "randomly-"
    };

    var inter;
    options = $.extend(defaults, options);

    return this.each(function() {
      var obj = $(this);
      var objID = "#" + obj.attr('id');
      var finalPosition = $(this).position();

      if(options.debug === true) {
        console.log("Final Position: t/l/r/b " + finalPosition.top, finalPosition.left, finalPosition.right, finalPosition.bottom);
      }
      var $width;
      var $height;
      if(options.wrapper === document || options.wrapper === window || options.inner === false) {
        $width = $(options.wrapper).width();
        $height = $(options.wrapper).height();
      } else {
        $width = $(options.wrapper).innerWidth();
        $height = $(options.wrapper).innerHeight();
      }

      if(options.debug === true) {
        console.log("Wrapper Element for " + objID + " is: " + options.wrapper);
        console.log("Wrapper Element Dimensions " + $width + "x" + $height);
      }

      if(options.wrapper !== window && options.wrapper !== document) {
        var wrapper_position = $(options.wrapper).position();
        if(options.debug === true) {
          console.log("Wrapper positions: top/left/right/bottom: " + wrapper_position.top, wrapper_position.left, wrapper_position.right, wrapper_position.bottom);
        }
      }

      var counter = 0;
      var paused = false;

      if(options.pauseOnHover === true) {
        obj.hover(function() {
          obj.addClass(options.namespace + "pause");
          if(options.debug === true) {
            console.log("stopping animation because of hover");
          }
          paused = true;
        }, function() {
          obj.removeClass(options.namespace + "pause");
          if(options.debug === true) {
            console.log("continuing animations");
          }
          paused = false;
        });
      }

      if(options.debug === true) {
        console.log(objID + " Dimensions: " + obj.innerHeight() + "x" + obj.innerWidth());
      }

      if(options.inside === true && obj.parents(options.wrapper).length === 0 && options.debug === true) {
        console.log("seems like " + objID + " is outside the wrapper, but you selected to animate it inside... so ill fix that");
      }

      inter = setInterval(function() {
        if(!obj.hasClass(options.namespace + "pause")) {

          if(counter === options.cycles - 1) {
            if(options.debug === true) {
              console.log("animating cycle " + counter + " of " + options.cycles);
              console.log("Animating to final position...");
            }
            obj.css('position', 'absolute').animate({
              top: finalPosition.top,
              left: finalPosition.left,
              right: finalPosition.right,
              bottom: finalPosition.bottom
            }, options.time, options.easing, function() {
              obj.addClass(options.namespace + "animate-done");
              if (options.revert === true) {
                obj.attr("style", "");
              }
            }).removeClass(options.namespace + 'animating');

            inter = clearInterval(inter);
          }

          if(counter === 0){
            obj.addClass(options.namespace + 'animating');
          }
          var $random_height;
          var $random_width;
          if(counter < options.cycles - 1) {
            counter++;
            $random_height = Math.floor(Math.random() * ($height - obj.innerHeight()));
            $random_width = Math.floor(Math.random() * ($width - obj.innerWidth()));
            if(options.inside === true && obj.parents(options.wrapper).length === 0) {
              $random_height = $random_height + wrapper_position.top;
              $random_width = $random_width + wrapper_position.left;
            }
            obj.css('position', options.position).animate({
              top: $random_height,
              left: $random_width
            }, options.time, options.easing);
            if(options.debug === true) {
              console.log("animating cycle " + counter + " of " + options.cycles);
              console.log("to positions => top: " + $random_height + " left: " + $random_width);
            }
          }
        }
      }, options.interval);
    });
  };
}(jQuery));
