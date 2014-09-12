class PaginatedSetup extends Setup
  constructor: (@configuration_variable_names) ->
    @repeatString = "item in sorted_and_paginated_list"

  compile: (element) ->
    tbody = @setupTr(element, @repeatString)

    tds = element.find("td")
    tdString = ""
    for td in tds
      tdString += "<td>&nbsp;</td>"

    # TODO
    fillerTr = angular.element(document.createElement("tr"))
    fillerTr.attr("ng-show", @configuration_variable_names.fill_last_page)
    fillerTr.html(tdString)
    fillerTr.attr("ng-repeat", "item in filler_array")

    tbody.append(fillerTr)

    return

  link: ($scope, $element, $attributes, $filter) ->
    cvn = @configuration_variable_names

    w = new ScopeConfigWrapper($scope, cvn, $attributes.atList)

    get_sorted_and_paginated_list = (list, current_page, items_per_page, order_by, sort_context, predicate, descending, $filter) ->
      if list
        val = list
        from_page  = items_per_page * current_page - list.length
        if sort_context == "global"
          val = $filter(order_by)(val, predicate, descending)
          val = $filter("limitTo")(val, from_page)
          val = $filter("limitTo")(val, items_per_page)
        else
          val = $filter("limitTo")(val, from_page)
          val = $filter("limitTo")(val, items_per_page)
          val = $filter(order_by)(val, predicate, descending)

        return val
      else
        return []

    get_filler_array = (list, current_page, number_of_pages, items_per_page) ->
      items_per_page = parseInt(items_per_page)
      if list.length <= 0
        x for x in [0..items_per_page - 1]
      else if current_page == number_of_pages - 1
        itemCountOnLastPage = list.length % items_per_page
        if itemCountOnLastPage != 0
          fillerLength = items_per_page - itemCountOnLastPage - 1
          x for x in [(list.length)..(list.length + fillerLength)]
        else
          []

    update = () ->

      $scope.sorted_and_paginated_list = get_sorted_and_paginated_list(
        w.get_list(),
        w.get_current_page(),
        w.get_items_per_page(),
        w.get_order_by(),
        w.get_sort_context(),
        $scope.predicate,
        $scope.descending,
        $filter
      )

      nop = Math.ceil(w.get_list().length / w.get_items_per_page())

      $scope.filler_array = get_filler_array(
        w.get_list(),
        w.get_current_page(),
        nop,
        w.get_items_per_page()
      )

    $scope.$watch(cvn.current_page, () ->
      update()
    )

    $scope.$watch(cvn.items_per_page, () ->
      update()
    )

    $scope.$watch(cvn.sort_context, () ->
      update()
    )

    $scope.$watch("#{$attributes.atList}.length", () ->
      $scope[irk_number_of_pages] = Math.ceil(w.get_list().length / w.get_items_per_page())
      update()
    )

    $scope.$watch("predicate", () ->
      update()
    )

    $scope.$watch("descending", () ->
      update()
    )
