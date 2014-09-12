class ConfigurationVariableNames
  constructor: (@config_object_name) ->
    @items_per_page = "#{@config_object_name}.itemsPerPage"
    @sort_context = "#{@config_object_name}.sortContext"
    @fill_last_page = "#{@config_object_name}.fillLastPage"
    @max_pages = "#{@config_object_name}.maxPages"
    @current_page = "#{@config_object_name}.currentPage"
    @order_by = "#{@config_object_name}.orderBy"
