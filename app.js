angular.module('ngApp', ['ngMaterial'])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('black', {
    '50': '000000',
    '100': '000000',
    '200': '000000',
    '300': '000000',
    '400': '000000',
    '500': '000000',
    '600': '000000',
    '700': '000000',
    '800': '000000',
    '900': '000000',
    'A100': '000000',
    'A200': '000000',
    'A400': '000000',
    'A700': '000000',
    'contrastDefaultColor': 'light'
  })

  $mdThemingProvider.theme('default')
    .primaryPalette('black')
    .accentPalette('yellow')
    .backgroundPalette('yellow');
})

.controller('ParallaxCtrl', function($scope, $window) {
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
})

.controller('GalleryCtrl', function($scope) {
  $scope.images = [
    'images/bar.jpg',
    'images/staff.jpg',
    'images/food1.jpg',
    'images/food2.jpg',
    'images/food3.jpg',
    'images/food4.jpg',
    'images/food5.jpg',
    'images/three.jpg',
    'images/inside1.jpg',
    'images/place4.jpg',
    'images/place5.jpg',
    'images/review1.jpg',
    'images/review2.jpg',
    'images/review3.jpg',
    'images/review4.jpg',
  ];
})

.controller('AboutCtrl', function($scope) {
  $scope.images = [
    'images/place1.jpg',
    'images/place2.jpg',
    'images/place3.jpg',
  ];

  $scope.menus = [
    'images/menu1.jpg',
    'images/menu2.jpg',
  ];
})

.directive('parallax', function($window) {
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
