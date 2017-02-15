'use strict';

/**
 * @ngdoc service
 * @name clientApp.activitiesService
 * @description
 * # activitiesService
 * Service in the clientApp.
 */
angular.module('clientApp')
  .service('activitiesService', function (apiURL, $http) {

    /* Private variables */

    /* Public variables */
    return {
      /* Gets users activities using http request */
      getUserActivities: function(callback) {
        $http({
          method: 'GET',
          url: apiURL + '/activity',
          params: {'userID': 'me'}
        }).then(function(response) {
          /* Success */
          if (response.data) {
            callback(true, response.data);
          }
        }, function(response) {
          /* Error */
          if (response.data && response.data.message) {
            callback(false, response.data.message);
          } else {
            callback(false, 'Error getting user activities.');
          }
        });
      },

      /* Function for adding a new activity */
      addActivity: function(title, tripData, callback) {
        $http({
          method: 'POST',
          url: apiURL + '/activity/add',
          data: {"title": title, "tripdata": tripData}
        }).then(function(response) {
          /* Success */
          if (response.data && response.data.message) {
            callback(true, response.data.message);
          } else {
            callback(false, "Unable to add activity.");
          }
        }, function(response) {
          /* Error */
          if (response.data && response.data.message) {
            callback(false, response.data.message);
          } else {
            callbacl(false, "Unable to add activity.");
          }
        });
      }
    };
  });
