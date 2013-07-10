# angular-table

Lets you declare sortable, pageable tables with minimal effort while providing high flexibilty.

[Written in CoffeeScript.](https://github.com/ssmm/angular-table/blob/master/coffee)

Check out the [examples](http://ssmm.github.io/angular-table/examples.html) for more information.

## Setup

All you have to do in your controller is set up a list on your `$scope`:

```javascript
$scope.nameList = [{name: "Laura"}, {name: "Lea"}, {name: "Sara"}]
```

Defining a table is 100% declarative. Here's a simple example:

```html
<table at-table list="nameList">
  <!-- the header will automatically be created according to the body definition. -->
  <thead></thead>
  <tbody>
    <tr>
      <!-- for each item in list a cell will be rendered, containing the value in attribute. -->
      <td at-implicit attribute="name"></td>
      <!-- you can still render custom cells if you need to. -->
      <td title="Custom cell">
        The name is {{item.name}}
      </td>
    </tr>
  </tbody>
</table>
```


