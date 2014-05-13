/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: bnSlideShow', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Bnslideshow'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<bn-slide-show></bn-slide-show>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the bnSlideShow directive');
    }));
  });
});
