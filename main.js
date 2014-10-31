var db = require('./scratch');

var O = {
	a: 1,
	b: 2,
	c: 3
};

db.persist(O);

O.b = 3;
O.c = 4;
O.a = 2;

console.dir(O);
