# angular-table [![Build Status](https://travis-ci.org/samu/angular-table.png?branch=master)](https://travis-ci.org/samu/angular-table)

[DEMO](http://samu.github.io/angular-table/examples/examples.html)

Angular directive which allows to declare sortable tables and to add
pagination with very little effort.

Available via bower: `bower install at-table`

## Features
  * Adds sorting to any column
  * Adds pagination
  * Implicitly renders cell contents by name convention and allows custom cell content if needed
  * Implicitly renders header titles by name convention and allows custom header content if needed

## Dependencies
This directive depends on angular only. No jQuery or Bootstrap required! It has been
tested on angular 1.2, but it should also work with 1.1 releases.

## How
Lets assume we have an array containing objects representing people. A person object has the
following format:

```javascript
{name: ..., age: ..., birthdate: ...}
```

The list contains about 100 entries and we would like to represent that data in a nice, sortable
html table and eventually make it paginated so we don't have to scroll like a madman. With
`angular-table` in our toolbelt, this task becomes easy. Lets write some markup:

```html
  <table at-table at-list="people">
  <thead></thead>
  <tbody>
    <tr>
      <td at-implicit at-attribute="name"></td>
      <td at-implicit at-attribute="age"></td>
      <td at-implicit at-attribute="birthdate"></td>
    </tr>
  </tbody>
</table>
```
[result](http://samu.github.io/angular-table/walkthrough/1.html)

This renders a simple html table with an automatically generated header, showing every entry in
our list. Four attributes have been used that need further explanation:

  * `at-table` indicate that we want to use the `angular-table` directive to extend
  our table
  * `at-list` point to the data source in our scope
  * `at-attribute` the attribute in each object the respective columns are dedicated to
  * `at-implicit` implicitly render the content of each object's attribute defined in `at-attribute`

Our table looks kind of unspectacular by now, so lets use some css, assuming we have twitter
bootstrap in our sources:

```html
<table class="table table-striped" ...>...</table>
```
[result](http://samu.github.io/angular-table/walkthrough/2.html)

Now that looks better! Next, lets make the birthdate column sortable. We want to see the
youngest people first, therefore sort descending. We're also going to customize the content
of the birthdate cell since the raw date format looks ugly:

```html
<td at-attribute="birthdate" at-sortable at-initial-sorting="desc">
  {{item.birthdate.substring(0, 10)}}
</td>
```
[result](http://samu.github.io/angular-table/walkthrough/3.html)

And thats it, our table is sortable by birthdate instantly! We can make the other columns
sortable aswell, by using the `at-sortable` attribute only. Also, note how we removed the
`at-implicit` attribute and rendered our own content by using a custom angular expression.

Also, you can also specify which element to use for sorting:

```html
<td at-sortable="birthdate" at-initial-sorting="desc">
  {{item.birthdate.substring(0, 10)}}
</td>
```

Our list of people is pretty long though, and we hate scrolling, so breaking up the table into
smaller chunks and making it possible to go through it with a pagination would be cool. A task
done within seconds: We need to define two additional keywords in our table ...

```html
<table ... at-config="config" at-paginated>...</table>
```

... and add an additional element to our view ...

```html
<at-pagination at-config="config" at-list="people"></at-pagination>
```

... and we end up with a sortable, paginated table!

[result](http://samu.github.io/angular-table/walkthrough/4.html)

## Hacking on angular-table
### Coffee Script
This directive is written in Coffee Script. If you want to contribute, please make sure to
work on the coffee sources only. If you are familiar with Javascript and aren't with
Coffee Script, i highly recommend to [take look at it and try it out](http://coffeescript.org).
It has a powerful and beautiful syntax and is easy to learn. You'll probably need no more than
~2 hours to learn about all the basic concepts.

### Running the tests
The code for this directive is well covered with tests, which can be run with PhantomJS and
Karma. Run `npm install` to install the required packages. Then, run `karma start` to run
the tests. Make sure all the tests pass before you send a pull request.
