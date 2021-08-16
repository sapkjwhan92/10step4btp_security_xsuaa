'use strict';

const { v4: uuidv4 } = require('uuid');

var jsonData = [];

function getAll(res) {
	res.status(200).json(jsonData);
}

function insertOne(res, newData, user) {
	var data = {
		"id": uuidv4(),
	  	"name": newData.name,
	  	"age": newData.age,
	  	"user": user
	}
	jsonData.push(data);
	res.status(201).json(data);
}

function deleteOne(res, id) {
	var i = jsonData.length;
	while (i--) {
		if (jsonData[i].id == id) {
    		jsonData.splice(i, 1);
    		res.status(200).end();
            return;
  		}
	}
	res.status(404).end();
}

module.exports = {
	getAll: getAll,
	insertOne: insertOne,
	deleteOne: deleteOne
};