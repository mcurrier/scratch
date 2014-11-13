var watcher = require('watch');

watcher.watchTree('./', function(file, curr, prev) {
	if (typeof file == 'object' && prev === null && curr === null) {
		// finished walking the tree
		console.info('Scratch| finished walking the tree')
	} else if (prev === null) {
		// new file
		console.info('Scratch| new file = ' + file);
	} else if (curr.nlink === 0) {
		// file was removed
		console.info('Scratch| removed file = ' + file);
	} else {
		// file was changed
		console.info('Scratch| changed file = ' + file);
	}
});
