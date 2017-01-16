angular.module("angular-table").directive "atImplicit", [() ->
  restrict: "AC"

  compile: (element, attributes, transclude) ->
    attribute = element.attr("at-attribute")
    throw "at-implicit specified without at-attribute: #{element.html()}" if not attribute
    element.append "<span ng-bind='item[\"#{attribute}\"]'></span>"
]
