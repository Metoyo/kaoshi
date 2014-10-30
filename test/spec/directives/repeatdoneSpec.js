/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: repeatDone', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Repeatdone'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<repeat-done></repeat-done>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the repeatDone directive');
    }));
  });
});
