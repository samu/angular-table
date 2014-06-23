// author:   Samuel Mueller 
// version: 1.0.0 
// license:  MIT 
// homepage: http://github.com/samu/angular-table 
(function() {
  var ColumnConfiguration, ConfigurationVariableNames, PageSequence, PaginatedSetup, ScopeConfigWrapper, Setup, StandardSetup, Table, TableConfiguration, irk_number_of_pages, pagination_template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module("angular-table", []);

  irk_number_of_pages = "number_of_pages";

  ColumnConfiguration = (function() {
    function ColumnConfiguration(body_markup, header_markup) {
      this.attribute = body_markup.attribute;
      this.title = body_markup.title;
      this.sortable = body_markup.sortable;
      this.width = body_markup.width;
      this.initialSorting = body_markup.initialSorting;
      if (header_markup) {
        this.custom_content = header_markup.custom_content;
        this.attributes = header_markup.attributes;
      }
    }

    ColumnConfiguration.prototype.create_element = function() {
      var th;
      return th = angular.element(document.createElement("th"));
    };

    ColumnConfiguration.prototype.render_title = function(element) {
      return element.html(this.custom_content || this.title);
    };

    ColumnConfiguration.prototype.render_attributes = function(element) {
      var attribute, _i, _len, _ref, _results;
      if (this.custom_content) {
        _ref = this.attributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attribute = _ref[_i];
          _results.push(element.attr(attribute.name, attribute.value));
        }
        return _results;
      }
    };

    ColumnConfiguration.prototype.render_sorting = function(element) {
      var icon;
      if (this.sortable) {
        element.attr("ng-click", "predicate = '" + this.attribute + "'; descending = !descending;");
        icon = angular.element("<i style='margin-left: 10px;'></i>");
        icon.attr("ng-class", "getSortIcon('" + this.attribute + "', predicate)");
        return element.append(icon);
      }
    };

    ColumnConfiguration.prototype.render_width = function(element) {
      return element.attr("width", this.width);
    };

    ColumnConfiguration.prototype.render_html = function() {
      var th;
      th = this.create_element();
      this.render_title(th);
      this.render_attributes(th);
      this.render_sorting(th);
      this.render_width(th);
      return th;
    };

    return ColumnConfiguration;

  })();

  ConfigurationVariableNames = (function() {
    function ConfigurationVariableNames(config_object_name) {
      this.config_object_name = config_object_name;
      this.items_per_page = "" + this.config_object_name + ".itemsPerPage";
      this.sort_context = "" + this.config_object_name + ".sortContext";
      this.fill_last_page = "" + this.config_object_name + ".fillLastPage";
      this.max_pages = "" + this.config_object_name + ".maxPages";
      this.current_page = "" + this.config_object_name + ".currentPage";
    }

    return ConfigurationVariableNames;

  })();

  ScopeConfigWrapper = (function() {
    function ScopeConfigWrapper(scope, configuration_variable_names, list_name) {
      this.scope = scope;
      this.configuration_variable_names = configuration_variable_names;
      this.list_name = list_name;
    }

    ScopeConfigWrapper.prototype.get_list = function() {
      return this.scope.$eval(this.list_name);
    };

    ScopeConfigWrapper.prototype.get_items_per_page = function() {
      return this.scope.$eval(this.configuration_variable_names.items_per_page) || 10;
    };

    ScopeConfigWrapper.prototype.get_current_page = function() {
      return this.scope.$eval(this.configuration_variable_names.current_page) || 0;
    };

    ScopeConfigWrapper.prototype.get_max_pages = function() {
      return this.scope.$eval(this.configuration_variable_names.max_pages) || void 0;
    };

    ScopeConfigWrapper.prototype.get_sort_context = function() {
      return this.scope.$eval(this.configuration_variable_names.sort_context) || 'global';
    };

    ScopeConfigWrapper.prototype.set_current_page = function(current_page) {
      return this.scope.$eval("" + this.configuration_variable_names.current_page + "=" + current_page);
    };

    return ScopeConfigWrapper;

  })();

  TableConfiguration = (function() {
    function TableConfiguration(table_element, attributes) {
      this.table_element = table_element;
      this.attributes = attributes;
      this.id = this.attributes.id;
      this.config = this.attributes.atConfig;
      this.paginated = this.attributes.atPaginated != null;
      this.list = this.attributes.atList;
      this.create_column_configurations();
    }

    TableConfiguration.prototype.capitaliseFirstLetter = function(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
        return "";
      }
    };

    TableConfiguration.prototype.extractWidth = function(classes) {
      var width;
      width = /([0-9]+px)/i.exec(classes);
      if (width) {
        return width[0];
      } else {
        return "";
      }
    };

    TableConfiguration.prototype.isSortable = function(classes) {
      var sortable;
      sortable = /(sortable)/i.exec(classes);
      if (sortable) {
        return true;
      } else {
        return false;
      }
    };

    TableConfiguration.prototype.getInitialSorting = function(td) {
      var initialSorting;
      initialSorting = td.attr("at-initial-sorting");
      if (initialSorting) {
        if (initialSorting === "asc" || initialSorting === "desc") {
          return initialSorting;
        }
        throw "Invalid value for initial-sorting: " + initialSorting + ". Allowed values are 'asc' or 'desc'.";
      }
      return void 0;
    };

    TableConfiguration.prototype.collect_header_markup = function(table) {
      var customHeaderMarkups, th, tr, _i, _len, _ref;
      customHeaderMarkups = {};
      tr = table.find("tr");
      _ref = tr.find("th");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        th = _ref[_i];
        th = angular.element(th);
        customHeaderMarkups[th.attr("at-attribute")] = {
          custom_content: th.html(),
          attributes: th[0].attributes
        };
      }
      return customHeaderMarkups;
    };

    TableConfiguration.prototype.collect_body_markup = function(table) {
      var attribute, bodyDefinition, initialSorting, sortable, td, title, width, _i, _len, _ref;
      bodyDefinition = [];
      _ref = table.find("td");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        td = _ref[_i];
        td = angular.element(td);
        attribute = td.attr("at-attribute");
        title = td.attr("at-title") || this.capitaliseFirstLetter(td.attr("at-attribute"));
        sortable = td.attr("at-sortable") !== void 0 || this.isSortable(td.attr("class"));
        width = this.extractWidth(td.attr("class"));
        initialSorting = this.getInitialSorting(td);
        bodyDefinition.push({
          attribute: attribute,
          title: title,
          sortable: sortable,
          width: width,
          initialSorting: initialSorting
        });
      }
      return bodyDefinition;
    };

    TableConfiguration.prototype.create_column_configurations = function() {
      var body_markup, header_markup, i, _i, _len;
      header_markup = this.collect_header_markup(this.table_element);
      body_markup = this.collect_body_markup(this.table_element);
      this.column_configurations = [];
      for (_i = 0, _len = body_markup.length; _i < _len; _i++) {
        i = body_markup[_i];
        this.column_configurations.push(new ColumnConfiguration(i, header_markup[i.attribute]));
      }
      return this.column_configurations;
    };

    return TableConfiguration;

  })();

  Setup = (function() {
    function Setup() {}

    Setup.prototype.setupTr = function(element, repeatString) {
      var tbody, tr;
      tbody = element.find("tbody");
      tr = tbody.find("tr");
      tr.attr("ng-repeat", repeatString);
      return tbody;
    };

    return Setup;

  })();

  StandardSetup = (function(_super) {
    __extends(StandardSetup, _super);

    function StandardSetup(configuration_variable_names, list) {
      this.list = list;
      this.repeatString = "item in " + this.list + " | orderBy:predicate:descending";
    }

    StandardSetup.prototype.compile = function(element, attributes, transclude) {
      return this.setupTr(element, this.repeatString);
    };

    StandardSetup.prototype.link = function() {};

    return StandardSetup;

  })(Setup);

  PaginatedSetup = (function(_super) {
    __extends(PaginatedSetup, _super);

    function PaginatedSetup(configuration_variable_names) {
      this.configuration_variable_names = configuration_variable_names;
      this.repeatString = "item in sorted_and_paginated_list";
    }

    PaginatedSetup.prototype.compile = function(element) {
      var fillerTr, tbody, td, tdString, tds, _i, _len;
      tbody = this.setupTr(element, this.repeatString);
      tds = element.find("td");
      tdString = "";
      for (_i = 0, _len = tds.length; _i < _len; _i++) {
        td = tds[_i];
        tdString += "<td>&nbsp;</td>";
      }
      fillerTr = angular.element(document.createElement("tr"));
      fillerTr.attr("ng-show", this.configuration_variable_names.fill_last_page);
      fillerTr.html(tdString);
      fillerTr.attr("ng-repeat", "item in filler_array");
      tbody.append(fillerTr);
    };

    PaginatedSetup.prototype.link = function($scope, $element, $attributes, $filter) {
      var cvn, get_filler_array, get_sorted_and_paginated_list, update, w;
      cvn = this.configuration_variable_names;
      w = new ScopeConfigWrapper($scope, cvn, $attributes.atList);
      get_sorted_and_paginated_list = function(list, current_page, items_per_page, sort_context, predicate, descending, $filter) {
        var from_page, val;
        if (list) {
          val = list;
          from_page = items_per_page * current_page - list.length;
          if (sort_context === "global") {
            val = $filter("orderBy")(val, predicate, descending);
            val = $filter("limitTo")(val, from_page);
            val = $filter("limitTo")(val, items_per_page);
          } else {
            val = $filter("limitTo")(val, from_page);
            val = $filter("limitTo")(val, items_per_page);
            val = $filter("orderBy")(val, predicate, descending);
          }
          return val;
        } else {
          return [];
        }
      };
      get_filler_array = function(list, current_page, number_of_pages, items_per_page) {
        var fillerLength, itemCountOnLastPage, x, _i, _j, _ref, _ref1, _ref2, _results, _results1;
        items_per_page = parseInt(items_per_page);
        if (list.length <= 0) {
          _results = [];
          for (x = _i = 0, _ref = items_per_page - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
            _results.push(x);
          }
          return _results;
        } else if (current_page === number_of_pages - 1) {
          itemCountOnLastPage = list.length % items_per_page;
          if (itemCountOnLastPage !== 0) {
            fillerLength = items_per_page - itemCountOnLastPage - 1;
            _results1 = [];
            for (x = _j = _ref1 = list.length, _ref2 = list.length + fillerLength; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; x = _ref1 <= _ref2 ? ++_j : --_j) {
              _results1.push(x);
            }
            return _results1;
          } else {
            return [];
          }
        }
      };
      update = function() {
        var nop;
        $scope.sorted_and_paginated_list = get_sorted_and_paginated_list(w.get_list(), w.get_current_page(), w.get_items_per_page(), w.get_sort_context(), $scope.predicate, $scope.descending, $filter);
        nop = Math.ceil(w.get_list().length / w.get_items_per_page());
        return $scope.filler_array = get_filler_array(w.get_list(), w.get_current_page(), nop, w.get_items_per_page());
      };
      $scope.$watch(cvn.current_page, function() {
        return update();
      });
      $scope.$watch(cvn.items_per_page, function() {
        return update();
      });
      $scope.$watch(cvn.sort_context, function() {
        return update();
      });
      $scope.$watch($attributes.atList, function() {
            return update();
        });
      $scope.$watch("" + $attributes.atList + ".length", function() {
        $scope[irk_number_of_pages] = Math.ceil(w.get_list().length / w.get_items_per_page());
        return update();
      });
      $scope.$watch("predicate", function() {
        return update();
      });
      return $scope.$watch("descending", function() {
        return update();
      });
    };

    return PaginatedSetup;

  })(Setup);

  Table = (function() {
    function Table(element, table_configuration, configuration_variable_names) {
      this.element = element;
      this.table_configuration = table_configuration;
      this.configuration_variable_names = configuration_variable_names;
    }

    Table.prototype.constructHeader = function() {
      var i, tr, _i, _len, _ref;
      tr = angular.element(document.createElement("tr"));
      _ref = this.table_configuration.column_configurations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        tr.append(i.render_html());
      }
      return tr;
    };

    Table.prototype.setup_header = function() {
      var header, thead, tr;
      thead = this.element.find("thead");
      if (thead) {
        header = this.constructHeader();
        tr = angular.element(thead).find("tr");
        tr.remove();
        return thead.append(header);
      }
    };

    Table.prototype.get_setup = function() {
      if (this.table_configuration.paginated) {
        return new PaginatedSetup(this.configuration_variable_names);
      } else {
        return new StandardSetup(this.configuration_variable_names, this.table_configuration.list);
      }
    };

    Table.prototype.compile = function() {
      this.setup_header();
      this.setup = this.get_setup();
      return this.setup.compile(this.element);
    };

    Table.prototype.setup_initial_sorting = function($scope) {
      var bd, _i, _len, _ref, _results;
      _ref = this.table_configuration.column_configurations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bd = _ref[_i];
        if (bd.initialSorting) {
          if (!bd.attribute) {
            throw "initial-sorting specified without attribute.";
          }
          $scope.predicate = bd.attribute;
          _results.push($scope.descending = bd.initialSorting === "desc");
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Table.prototype.post = function($scope, $element, $attributes, $filter) {
      this.setup_initial_sorting($scope);
      if (!$scope.getSortIcon) {
        $scope.getSortIcon = function(predicate, current_predicate) {
          if (predicate !== $scope.predicate) {
            return "glyphicon glyphicon-minus";
          }
          if ($scope.descending) {
            return "glyphicon glyphicon-chevron-down";
          } else {
            return "glyphicon glyphicon-chevron-up";
          }
        };
      }
      return this.setup.link($scope, $element, $attributes, $filter);
    };

    return Table;

  })();

  PageSequence = (function() {
    function PageSequence(lower_bound, upper_bound, start, length) {
      this.lower_bound = lower_bound != null ? lower_bound : 0;
      this.upper_bound = upper_bound != null ? upper_bound : 1;
      if (start == null) {
        start = 0;
      }
      this.length = length != null ? length : 1;
      if (this.length > (this.upper_bound - this.lower_bound)) {
        throw "sequence is too long";
      }
      this.data = this.generate(start);
    }

    PageSequence.prototype.generate = function(start) {
      var x, _i, _ref, _results;
      if (start > (this.upper_bound - this.length)) {
        start = this.upper_bound - this.length;
      } else if (start < this.lower_bound) {
        start = this.lower_bound;
      }
      _results = [];
      for (x = _i = start, _ref = parseInt(start) + parseInt(this.length) - 1; start <= _ref ? _i <= _ref : _i >= _ref; x = start <= _ref ? ++_i : --_i) {
        _results.push(x);
      }
      return _results;
    };

    PageSequence.prototype.reset_parameters = function(lower_bound, upper_bound, length) {
      this.lower_bound = lower_bound;
      this.upper_bound = upper_bound;
      this.length = length;
      if (this.length > (this.upper_bound - this.lower_bound)) {
        throw "sequence is too long";
      }
      return this.data = this.generate(this.data[0]);
    };

    PageSequence.prototype.relocate = function(distance) {
      var new_start;
      new_start = this.data[0] + distance;
      return this.data = this.generate(new_start, new_start + this.length);
    };

    PageSequence.prototype.realign_greedy = function(page) {
      var new_start;
      if (page < this.data[0]) {
        new_start = page;
        return this.data = this.generate(new_start);
      } else if (page > this.data[this.length - 1]) {
        new_start = page - (this.length - 1);
        return this.data = this.generate(new_start);
      }
    };

    PageSequence.prototype.realign_generous = function(page) {};

    return PageSequence;

  })();

  pagination_template = "<div style='margin: 0px;'> <ul class='pagination'> <li ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='step_page(-" + irk_number_of_pages + ")'>First</a> </li> <li ng-show='show_sectioning()' ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='jump_back()'>&laquo;</a> </li> <li ng-class='{disabled: get_current_page() <= 0}'> <a href='' ng-click='step_page(-1)'>&lsaquo;</a> </li> <li ng-class='{active: get_current_page() == page}' ng-repeat='page in page_sequence.data'> <a href='' ng-click='go_to_page(page)'>{{page + 1}}</a> </li> <li ng-class='{disabled: get_current_page() >= " + irk_number_of_pages + " - 1}'> <a href='' ng-click='step_page(1)'>&rsaquo;</a> </li> <li ng-show='show_sectioning()' ng-class='{disabled: get_current_page() >= " + irk_number_of_pages + " - 1}'> <a href='' ng-click='jump_ahead()'>&raquo;</a> </li> <li ng-class='{disabled: get_current_page() >= " + irk_number_of_pages + " - 1}'> <a href='' ng-click='step_page(" + irk_number_of_pages + ")'>Last</a> </li> </ul> </div>";

  angular.module("angular-table").directive("atTable", [
    "$filter", function($filter) {
      return {
        restrict: "AC",
        scope: true,
        compile: function(element, attributes, transclude) {
          var cvn, table, tc;
          tc = new TableConfiguration(element, attributes);
          cvn = new ConfigurationVariableNames(attributes.atConfig);
          table = new Table(element, tc, cvn);
          table.compile();
          return {
            post: function($scope, $element, $attributes) {
              return table.post($scope, $element, $attributes, $filter);
            }
          };
        }
      };
    }
  ]);

  angular.module("angular-table").directive("atPagination", [
    function() {
      return {
        restrict: "E",
        scope: true,
        replace: true,
        template: pagination_template,
        link: function($scope, $element, $attributes) {
          var cvn, get_number_of_pages, keep_in_bounds, set_number_of_pages, update, w;
          cvn = new ConfigurationVariableNames($attributes.atConfig);
          w = new ScopeConfigWrapper($scope, cvn, $attributes.atList);
          keep_in_bounds = function(val, min, max) {
            val = Math.max(min, val);
            return Math.min(max, val);
          };
          get_number_of_pages = function() {
            return $scope[irk_number_of_pages];
          };
          set_number_of_pages = function(number_of_pages) {
            return $scope[irk_number_of_pages] = number_of_pages;
          };
          update = function(reset) {
            var new_number_of_pages, pages_to_display;
            if (w.get_list()) {
              if (w.get_list().length > 0) {
                new_number_of_pages = Math.ceil(w.get_list().length / w.get_items_per_page());
                set_number_of_pages(new_number_of_pages);
                if ($scope.show_sectioning()) {
                  pages_to_display = w.get_max_pages();
                } else {
                  pages_to_display = new_number_of_pages;
                }
                $scope.page_sequence.reset_parameters(0, new_number_of_pages, pages_to_display);
                w.set_current_page(keep_in_bounds(w.get_current_page(), 0, get_number_of_pages() - 1));
                return $scope.page_sequence.realign_greedy(w.get_current_page());
              } else {
                set_number_of_pages(1);
                $scope.page_sequence.reset_parameters(0, 1, 1);
                w.set_current_page(0);
                return $scope.page_sequence.realign_greedy(0);
              }
            }
          };
          $scope.show_sectioning = function() {
            return w.get_max_pages() && get_number_of_pages() > w.get_max_pages();
          };
          $scope.get_current_page = function() {
            return w.get_current_page();
          };
          $scope.step_page = function(step) {
            step = parseInt(step);
            w.set_current_page(keep_in_bounds(w.get_current_page() + step, 0, get_number_of_pages() - 1));
            return $scope.page_sequence.realign_greedy(w.get_current_page());
          };
          $scope.go_to_page = function(page) {
            return w.set_current_page(page);
          };
          $scope.jump_back = function() {
            return $scope.step_page(-w.get_max_pages());
          };
          $scope.jump_ahead = function() {
            return $scope.step_page(w.get_max_pages());
          };
          $scope.page_sequence = new PageSequence();
          $scope.$watch(cvn.items_per_page, function() {
            return update();
          });
          $scope.$watch(cvn.max_pages, function() {
            return update();
          });
          $scope.$watch($attributes.atList, function() {
            return update();
          });
          $scope.$watch("" + $attributes.atList + ".length", function() {
            return update();
          });
          return update();
        }
      };
    }
  ]);

  angular.module("angular-table").directive("atImplicit", [
    function() {
      return {
        restrict: "AC",
        compile: function(element, attributes, transclude) {
          var attribute;
          attribute = element.attr("at-attribute");
          if (!attribute) {
            throw "at-implicit specified without at-attribute: " + (element.html());
          }
          return element.append("{{item." + attribute + "}}");
        }
      };
    }
  ]);

}).call(this);
