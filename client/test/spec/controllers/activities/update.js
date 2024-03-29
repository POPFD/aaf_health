'use strict';

describe('Controller: ActivitiesUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ActivitiesUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitiesUpdateCtrl = $controller('ActivitiesUpdateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivitiesUpdateCtrl.awesomeThings.length).toBe(3);
  });
});
