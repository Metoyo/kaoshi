/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: outTiGan', function () {

    // load the filter's module
    beforeEach(module('kaoshiApp.filters.Outtigan'));

    // initialize a new instance of the filter before each test
    var outTiGan;
    beforeEach(inject(function ($filter) {
      outTiGan = $filter('outTiGan');
    }));

    it('should return the input prefixed with "outTiGan filter:"', function () {
      var text = 'angularjs';
      expect(outTiGan(text)).toBe('outTiGan filter: ' + text);
    });

  });
});
