/*jshint unused: vars */
define(['angular', 'angularMocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: examStatus', function () {

    // load the filter's module
    beforeEach(module('kaoshiApp.filters.Examstatus'));

    // initialize a new instance of the filter before each test
    var examStatus;
    beforeEach(inject(function ($filter) {
      examStatus = $filter('examStatus');
    }));

    it('should return the input prefixed with "examStatus filter:"', function () {
      var text = 'angularjs';
      expect(examStatus(text)).toBe('examStatus filter: ' + text);
    });

  });
});
