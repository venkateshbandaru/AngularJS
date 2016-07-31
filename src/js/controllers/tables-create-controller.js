'use strict';

angular.module('app').controller('TablesCreateController', function ($scope, $controller, $state, DecisionTable, DecisionVariant) {

  $scope.isSaving = false;

  $scope.table = new DecisionTable();
  $scope.variant = new DecisionVariant();

  $scope.table.variants.push($scope.variant);

  $scope.onChangeDecisionType = function (type) {
    $scope.table.setDecisionType (type);
  };


  $scope.onChangeMatchingType = function (type) {
    $scope.table.setMatchingType(type);
  };

  $scope.submit = function (form) {

    if (form.$invalid) return;

    $scope.variant.title = $scope.table.title;
    $scope.variant.description = $scope.table.description;

    $scope.isSaving = true;
    $scope.table.create().then(function (resp) {
      $scope.error = null;
      $state.go('tables-details.edit', {id: resp.id});
    }).catch(function (resp) {
      $scope.error = resp;
    }).finally(function () {
      $scope.isSaving = false;
    })
  }

});
