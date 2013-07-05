# angular-table

Lets you declare sortable, pageable tables with minimal effort while providing high flexibilty.

[Written in CoffeeScript.](https://github.com/ssmm/angular-table/blob/master/coffee)

Check out the [examples](http://ssmm.github.io/angular-table/examples.html) for more information.

## How

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

## Implicit Elements

Implicit declariation of table attributes is avaliable using the following controls. 

1) Specify the at-implicit attribute on any td element  

2) pass desired column names in as attribute tags on table rows:
  `<td at-implicit title="Random word" attribute="description"></td>`
  
  - Set fixed widths on elements by passing size into a class:
      `<td at-implicit class="100px"></td>`





Example: 
```
<table at-table class="table table-striped table-bordered" list="shortLoremList">
  <thead></thead>
  <tbody>
    <tr>
      <td at-implicit class="50px" attribute="id"></td>
      <td at-implicit title="Random word" attribute="description"></td>
    </tr>
  </tbody>
</table>
```

## Sorting/Pagination

## Custom Headers and Cells

## Filtering





