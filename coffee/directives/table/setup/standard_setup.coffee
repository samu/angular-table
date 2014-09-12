class StandardSetup extends Setup
  constructor: (configuration_variable_names, @list) ->
    @repeatString = "item in #{@list} | #{configuration_variable_names.get_order_by()}:predicate:descending"

  compile: (element, attributes, transclude) ->
    @setupTr(element, @repeatString)

  link: () ->
