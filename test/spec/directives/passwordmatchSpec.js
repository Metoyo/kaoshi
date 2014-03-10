/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: passwordMatch', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Passwordmatch'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<password-match></password-match>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the passwordMatch directive');
    }));
  });
});
