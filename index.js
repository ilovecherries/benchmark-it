"use strict";

const $ = el => document.querySelector(el);

let isRunning = false;

const createResultBlock = (code, stats) => {
	const parent = document.createElement('details');
	const titleNode = document.createElement('summary');
	const contentNode = document.createElement('p');
	const codeNode = document.createElement('code');

	titleNode.innerText = new Date();
	contentNode.innerText = JSON.stringify(stats);
	codeNode.innerText = code;
	parent.append(titleNode);
	contentNode.append(codeNode);
	parent.append(contentNode);
	return parent;
}

$('#input-form').addEventListener('submit', (event) => {
	event.preventDefault();
	if (isRunning) return;
	const js = $('#input').value;
	// try it one time to make sure it doesn't have a syntax error in it
	try {
		eval(js);
	} catch(e) {
		alert("There was an error in the code you submitted:\n" + e.message);
		return;
	}
	isRunning = true;
	$('#submit-button').setAttribute('aria-busy', 'true');
	const suite = new Benchmark.Suite;
	suite
		.add('Test', function() {
			eval(js);
		})
		.on('complete', function() {
			$('#output-region').prepend(createResultBlock(js, this['0'].stats));
			$('#submit-button').removeAttribute('aria-busy');
			isRunning = false;
		})
		.run({ async: true });
})
