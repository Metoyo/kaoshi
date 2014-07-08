/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: myFileUpload', function () {

    // load the service's module
    beforeEach(module('kaoshiApp.services.Myfileupload'));

    // instantiate service
    var myFileUpload;
    beforeEach(inject(function (_myFileUpload_) {
      myFileUpload = _myFileUpload_;
    }));

    it('should do something', function () {
      expect(!!myFileUpload).toBe(true);
    });

  });
});
