angular.module('ngApp', ['ngMaterial'])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.config(function($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('yellow')
    .accentPalette('green')
    .warnPalette('red')
    .backgroundPalette('grey');
})

.controller('appCtrl', function($scope, $window) {
  function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
      if (typeof document.body.style[properties[i]] !== 'undefined') {
        return properties[i];
      }
    }
    return null;
  }

  var tranProperty = getSupportedPropertyName(['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform']);

  var layer2Of = 100,
    windowEl = angular.element($window),
    bodyEl = angular.element(document.querySelector('#main-container')),
    layer1El = angular.element(document.querySelector('#layer1')),
    layer2El = angular.element(document.querySelector('#layer2'));

  $scope.parallaxChazel = function(element, attrs, scrollTop) {
    if (bodyEl.length === 0) {
      return;
    }

    var winInnerHeight = windowEl.prop('innerHeight'),
      bodyInnerHeight = bodyEl.prop('clientHeight');

    var lay1Height = layer1El.prop('clientHeight'),
      lay2Height = layer2El.prop('clientHeight'),
      scrollPerc = (scrollTop / (bodyInnerHeight - winInnerHeight));

    var layer1Offset = -((lay1Height - winInnerHeight) * scrollPerc),
      layer2Offset = (layer2Of * (1 - scrollPerc));

    layer1El.css(tranProperty, 'translate3d(0, ' + layer1Offset + 'px' + ', 0)');
    layer2El.css(tranProperty, 'translate3d(0, ' + layer2Offset + 'px' + ', 0)');

  };
}).directive('parallax', function($window) {

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationF,

    count = 0,
    mouseDelta = 0,
    mouseOffset = 15,
    wheelMaxCnt = 10,
    wheeling = false,
    scrolling = false,
    windowEl = angular.element($window),
    routines = [],

    handleScroll = function(e) {
      scrolling = true;
    },
    handleWheel = function(e) {
      wheeling = true;

      // cancel the default scroll behavior
      if (e.preventDefault) {
        e.preventDefault();
      }

      // deal with different browsers calculating the delta differently
      if (e.wheelDelta) {
        mouseDelta = e.wheelDelta / 120;
      } else if (e.detail) {
        mouseDelta = -e.detail / 3;
      }
    };

  function getScrollPosition() {
    var result = windowEl.prop('scrollY');

    if (result !== undefined) {
      return result;
    } else if (document.documentElement.scrollTop === 0) {
      return document.body.scrollTop;
    } else {
      return document.documentElement.scrollTop;
    }
  }

  function animationLoop() {

    if (scrolling) {
      routines.forEach(function(routine) {
        routine();
      });

      scrolling = false;
    }

    if (wheeling) {
      window.scrollBy(0, -mouseDelta * mouseOffset);
      count++;

      if (count > wheelMaxCnt) {
        count = 0;
        wheeling = false;
        mouseDelta = 0;
      }
    }

    requestAnimationFrame(animationLoop);
  }

  animationLoop();

  windowEl.on('scroll', handleScroll).on('mousewheel', handleWheel).on('dommousewheel', handleWheel);

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.parallaxFn, function(cV) {
        if (!angular.isFunction(cV)) {
          return;
        }

        routines.push(function() {
          cV(element, attrs, getScrollPosition());
        });

        cV(element, attrs, getScrollPosition());
      });
    }
  };
});