angular.module("angular-table").directive "atPagination", [() ->
  {
    replace: true
    restrict: "E"
    template: "
      <div class='pagination' style='margin: 0px;'>
        <ul>
          <li ng-class='{disabled: currentPage <= 0}'>
            <a href='' ng-click='goToPage(currentPage - 1)'>&laquo;</a>
          </li>
          <li ng-class='{active: currentPage == page}' ng-repeat='page in pages'>
            <a href='' ng-click='goToPage(page)'>{{page + 1}}</a>
          </li>
          <li ng-class='{disabled: currentPage >= numberOfPages - 1}'>
            <a href='' ng-click='goToPage(currentPage + 1); normalize()'>&raquo;</a>
          </li>
        </ul>
      </div>"
    scope: {
      itemsPerPage: "@"
      instance: "="
      list: "="
    }
    link: ($scope, $element, $attributes) ->

      $scope.instance = $scope
      $scope.currentPage = 0

      $scope.update = () ->
        $scope.currentPage = 0
        if $scope.list
          if $scope.list.length > 0
            $scope.numberOfPages = Math.ceil($scope.list.length / $scope.itemsPerPage)
            $scope.pages = for x in [0..($scope.numberOfPages - 1)]
              x
          else
            $scope.numberOfPages = 1
            $scope.pages = [0]
          $scope.list = $scope.list

      $scope.fromPage = () ->
        if $scope.list
          $scope.itemsPerPage * $scope.currentPage - $scope.list.length

      $scope.getFillerArray = () ->
        if $scope.currentPage == $scope.numberOfPages - 1
          itemCountOnLastPage = $scope.list.length % $scope.itemsPerPage
          if itemCountOnLastPage != 0 || $scope.list.length == 0
            fillerLength = $scope.itemsPerPage - itemCountOnLastPage - 1
            x for x in [($scope.list.length)..($scope.list.length + fillerLength)]
          else
            []

      $scope.goToPage = (page) ->
        page = Math.max(0, page)
        page = Math.min($scope.numberOfPages - 1, page)

        $scope.currentPage = page

      $scope.update()

      $scope.$watch "itemsPerPage", () ->
        $scope.update()
      $scope.$watch "list", () ->
        $scope.update()

  }
]
