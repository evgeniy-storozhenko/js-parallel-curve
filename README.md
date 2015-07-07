# js-parallel-curve
This library builds a curve parallel to the given curve.

A parallel curve is also called an offset curve and this is the preferred term in CAGD. In other geometric contexts, the term offset can also refer also to translation.

## Add required
```
<script type="text/javascript" src="parallel-curve.js"></script>
```

## Example of use
```
var points = [{x:350, y:75}, {x:379, y:161}, {x:469, y:161}, {x:397, y:215}];
var offset = 10;
var isLeft = true;

var parallel = ParallelCurve.create(points, offset, isLeft);
```

Also you can find examples in a *demo* directory.

![alt tag](https://raw.githubusercontent.com/evgeniy-storozhenko/js-parallel-curve/master/demo/img/example.png)
