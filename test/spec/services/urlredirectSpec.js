/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: urlRedirect', function () {

    // load the service's module
    beforeEach(module('kaoshiApp.services.Urlredirect'));

    // instantiate service
    var urlRedirect;
    beforeEach(inject(function (_urlRedirect_) {
      urlRedirect = _urlRedirect_;
    }));

    it('should do something', function () {
      expect(!!urlRedirect).toBe(true);
    });

  });
});
