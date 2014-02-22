/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: lazyStyle', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Lazystyle'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<lazy-style></lazy-style>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the lazyStyle directive');
    }));
  });
});
