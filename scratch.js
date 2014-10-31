/*
	types of object changes:
		add
		delete
		update
*/

module.exports = {
	persist: function(obj, name) {
		name = name || 'DB';

		console.log('scratch DB = ' + name);

		Object.observe(obj, theWatcher);
	}
}

function theWatcher(changes) {
	var changeType = changes.type || 'unk';
	var changeProp = obj[changes.name];

	// must register a new watcher for added child objects/arrays
//	if (changeType === 'add') {
//		if (typeof changeProp === 'object')
//			Object.observe(changeProp, theWatcher);
//	}

	changes.forEach(function(change) {
		console.log(change.type, change.name, change.oldValue);
	});
}
