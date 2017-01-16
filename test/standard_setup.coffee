describe "angular-table", () ->
  describe "standard setup", () ->

    expectedRows = [
      ["0", "Helsinki",  "Finland", "FI"],
      ["1", "Zurich",    "Switzerland", "CH"],
      ["2", "Amsterdam", "Netherlands", "NL"],
      ["3", "Berlin",    "Germany", "DE"]
    ]

    beforeEach(() ->
      comp = new TemplateCompiler("standard_setup.html")
      @element = comp.prepareElement((scope) ->
        scope.cities = [{
          id: 0
          name: "Helsinki"
          country: "Finland"
          "country-code": "FI"
        }, {
          id: 1
          name: "Zurich"
          country: "Switzerland"
          "country-code": "CH"
        }, {
          id: 2
          name: "Amsterdam"
          country: "Netherlands"
          "country-code": "NL"
        }]
      )

      @gui = new GUI(new TableGUI(@element), null, comp.scope, null)
    )

    it "allows to set an initial sorting direction", () ->
      expect(@gui.table.rows).toEqual [expectedRows[1], expectedRows[0], expectedRows[2]]

    it "makes columns sortable which are declared at-sortable", () ->
      @gui.table.sort(1)
      expect(@gui.table.rows).toEqual [expectedRows[2], expectedRows[0], expectedRows[1]]

    it "leaves columns unsortable if at-sortable is not declared", () ->
      @gui.table.sort(2)
      expect(@gui.table.rows).toEqual [expectedRows[1], expectedRows[0], expectedRows[2]]

    it "reloads the table if the entries change but the length doesn't", () ->
      @gui.alterScope((scopeWrapper, vars) ->
        cities = scopeWrapper.get("cities")
        cities.pop()
        cities.push({id: 3, name: "Berlin", country: "Germany", "country-code": "DE"})
      )
      expect(@gui.table.rows).toEqual [expectedRows[1], expectedRows[0], expectedRows[3]]
