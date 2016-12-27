/*! angular-stepper - v0.1.4 - 2016-12-27
* Copyright (c) Julien Bouquillon [revolunet] 2016; Licensed  */
(function () {

    'use strict';

    angular
        .module('revolunet.stepper', [])
        .directive('rnStepper', function () {
            return {
                restrict: 'AE',
                require: 'ngModel',
                scope: {
                    min: '=',
                    max: '=',
                    ngModel: '=',
                    stepperName: '=',
                },
                template: '<button type="button" class="btn-minus" ng-disabled="!canBeDecremented()" ng-click="decrement()">-</button>' +
                '<input id="{{stepperName}}" name="{{stepperName}}" type="number" ng-model="ngModel" min="{{min}}" max="{{max}}">' +
                '<button type="button" class="btn-plus" ng-disabled="!canBeIncremented()" ng-click="increment()">+</button>',
                link: function (scope, iElement, iAttrs, ngModelController) {

                    // when model change, cast to integer
                    ngModelController.$formatters.push(formatValue);

                    // when view change, cast to integer
                    ngModelController.$parsers.push(formatValue);

                    ngModelController.$validators.outOfBounds = isOutOfBounds;

                    // watch out min/max and recheck validity when they change
                    scope.$watch('min+max', function () {
                        if (ngModelController.$viewValue) {
                            ngModelController.$$parseAndValidate();
                        }
                    });

                    scope.canBeIncremented = function () {
                        var val = ngModelController.$viewValue;
                        return (typeof(val) === 'number') && !isUnderMin(val, true) && !isOverMax(val);
                    };

                    scope.canBeDecremented = function () {
                        var val = ngModelController.$viewValue;
                        return (typeof(val) === 'number') && !isUnderMin(val) && !isOverMax(val, true);
                    };

                    scope.increment = function () {
                        updateModel(+1);
                    };

                    scope.decrement = function () {
                        updateModel(-1);
                    };

                    function formatValue(val) {
                        if (isNaN(val)) {
                            ngModelController.$setValidity('outOfBounds', false);
                            return null;
                        }
                        return +val;
                    }

                    function isOutOfBounds() {
                        var val = ngModelController.$viewValue;
                        var valid = (typeof(val) === 'number') && !isUnderMin(val, true) && !isOverMax(val, true);
                        return valid;
                    }

                    function updateModel(offset) {
                        if (!(typeof(ngModelController.$viewValue) === 'number')) {
                            return;
                        }
                        // update the model, call $parsers pipeline...
                        ngModelController.$setViewValue(+ngModelController.$viewValue + offset);
                        // update the local view
                        ngModelController.$render();
                    }

                    function isUnderMin(val, strict) {
                        var offset = strict ? 0 : 1;
                        return angular.isDefined(scope.min) && (val - offset) < parseInt(scope.min, 10);
                    }

                    function isOverMax(val, strict) {
                        var offset = strict ? 0 : 1;
                        return angular.isDefined(scope.max) && (val + offset) > parseInt(scope.max, 10);
                    }
                }
            };
        });
})();
