/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: outputDaAn', function () {

    // load the filter's module
    beforeEach(module('kaoshiApp.filters.Outputdaan'));

    // initialize a new instance of the filter before each test
    var outputDaAn;
    beforeEach(inject(function ($filter) {
      outputDaAn = $filter('outputDaAn');
    }));

    it('should return the input prefixed with "outputDaAn filter:"', function () {
      var text = 'angularjs';
      expect(outputDaAn(text)).toBe('outputDaAn filter: ' + text);
    });

  });
});
