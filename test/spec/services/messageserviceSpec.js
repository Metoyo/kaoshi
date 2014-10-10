/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: messageService', function () {

    // load the service's module
    beforeEach(module('kaoshiApp.services.Messageservice'));

    // instantiate service
    var messageService;
    beforeEach(inject(function (_messageService_) {
      messageService = _messageService_;
    }));

    it('should do something', function () {
      expect(!!messageService).toBe(true);
    });

  });
});
