/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: nanduStar', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Nandustar'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<nandu-star></nandu-star>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the nanduStar directive');
    }));
  });
});
