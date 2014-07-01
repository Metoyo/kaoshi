/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: panDuanToZh', function () {

    // load the filter's module
    beforeEach(module('kaoshiApp.filters.Panduantozh'));

    // initialize a new instance of the filter before each test
    var panDuanToZh;
    beforeEach(inject(function ($filter) {
      panDuanToZh = $filter('panDuanToZh');
    }));

    it('should return the input prefixed with "panDuanToZh filter:"', function () {
      var text = 'angularjs';
      expect(panDuanToZh(text)).toBe('panDuanToZh filter: ' + text);
    });

  });
});
