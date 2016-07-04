class TableConfiguration
  constructor: (@tableElement, @attributes) ->
    @id              = @attributes.id
    @config          = @attributes.atConfig
    @paginated       = @attributes.atPaginated?
    @list            = @attributes.atList
    @createColumnConfigurations()

  capitaliseFirstLetter: (string) ->
    if string then string.charAt(0).toUpperCase() + string.slice(1) else ""

  extractWidth: (classes) ->
    width = /([0-9]+px)/i.exec classes
    if width then width[0] else ""

  isSortable: (classes) ->
    sortable = /(sortable)/i.exec classes
    if sortable then true else false

  getInitialSorting: (td) ->
    initialSorting = td.attr("at-initial-sorting")
    if initialSorting
      return initialSorting if initialSorting == "asc" || initialSorting == "desc"
      throw "Invalid value for initial-sorting: #{initialSorting}. Allowed values are 'asc' or 'desc'."
    return undefined

  collectHeaderMarkup: (table) ->
    customHeaderMarkups = {}

    tr = table.find("tr")
    for th in tr.find("th")
      th = angular.element(th)
      customHeaderMarkups[th.attr("at-attribute")] = {
        customContent: th.html(), attributes: th[0].attributes
      }

    return customHeaderMarkups

  collectBodyMarkup: (table) ->
    bodyDefinition = []

    for td in table.find("td")
      td = angular.element(td)

      attribute = td.attr("at-attribute")
      title = td.attr("at-title") || @capitaliseFirstLetter(td.attr("at-attribute"))
      sortable = td.attr("at-sortable") != undefined || @isSortable(td.attr("class"))
      width = @extractWidth(td.attr("class"))
      ngIf = td.attr("ng-if") != undefined || null
      initialSorting = @getInitialSorting(td)

      bodyDefinition.push {
        attribute: attribute, title: title, sortable: sortable,
        width: width, ngIf: ngIf, initialSorting: initialSorting
      }

    return bodyDefinition

  createColumnConfigurations: () ->
    headerMarkup = @collectHeaderMarkup(@tableElement)
    bodyMarkup = @collectBodyMarkup(@tableElement)

    @columnConfigurations = []

    for i in bodyMarkup
      @columnConfigurations.push new ColumnConfiguration(i, headerMarkup[i.attribute])

    return
