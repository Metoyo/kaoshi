/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: fileUpload', function () {

    // load the directive's module
    beforeEach(module('kaoshiApp.directives.Fileupload'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<file-upload></file-upload>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the fileUpload directive');
    }));
  });
});
