class ColumnConfiguration
  constructor: (bodyMarkup, headerMarkup) ->
    @attribute      = bodyMarkup.attribute
    @title          = bodyMarkup.title
    @sortable       = bodyMarkup.sortable
    @width          = bodyMarkup.width
    @ngIf           = bodyMarkup.ngIf
    
    @initialSorting = bodyMarkup.initialSorting

    # TODO untested
    if headerMarkup
      @customContent = headerMarkup.customContent
      @attributes = headerMarkup.attributes

  createElement: () ->
    th = angular.element(document.createElement("th"))

  renderTitle: (element) ->
    element.html(@customContent || @title)

  renderAttributes: (element) ->
    if @customContent
      for attribute in @attributes
        element.attr(attribute.name, attribute.value)

  renderSorting: (element) ->
    if @sortable
      element.attr("ng-click", "predicate = '#{@attribute}'; descending = !descending;")
      icon = angular.element("<i style='margin-left: 10px;'></i>")
      icon.attr("ng-class", "getSortIcon('#{@attribute}', predicate, descending)")
      element.append(icon)

  renderWidth: (element) ->
    element.attr("width", @width)

  renderNgIf: (element) ->
    if @ngIf
      element.attr("ng-if", @ngIf)


  renderHtml: () ->
    th = @createElement()
    @renderTitle(th)
    @renderAttributes(th)
    @renderSorting(th)
    @renderWidth(th)
    @renderNgIf(th)
    return th
