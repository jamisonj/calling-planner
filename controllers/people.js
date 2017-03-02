'use strict';

const store = {};
let id = 0;

exports.addPerson = function(obj) {
	const o = {id: id++};
	o.name = obj.name;
	o.age = obj.age;
	store[o.id] = o;
	return o;
}

exports.getPeople = function() {
	const keys = Object.keys(store);
	const result = [];
	keys.forEach(function(key) {
		result.push(store[key]);
	});
	return result;
}

exports.setPerson = function(id, obj) {
	// If the ID is changed.
	if (id !== obj.id) {
		delete store[id];
	}
	
	store[obj.id] = obj;
	return obj;
}