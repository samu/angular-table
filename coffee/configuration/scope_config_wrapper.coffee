class ScopeConfigWrapper
  constructor: (@scope, @configuration_variable_names, @list_name) ->

  get_list: () ->
    @scope.$eval(@list_name)

  get_items_per_page: () ->
    @scope.$eval(@configuration_variable_names.items_per_page) || 10

  get_current_page: () ->
    @scope.$eval(@configuration_variable_names.current_page) || 0

  get_max_pages: () ->
    @scope.$eval(@configuration_variable_names.max_pages) || undefined

  get_sort_context: () ->
    @scope.$eval(@configuration_variable_names.sort_context) || 'global'

  set_current_page: (current_page) ->
    @scope.$eval("#{@configuration_variable_names.current_page}=#{current_page}")

  get_order_by: () ->
    @scope.$eval(@configuration_variable_names.order_by) || 'orderBy'
