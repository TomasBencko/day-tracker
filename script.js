
const actionList = document.querySelector('#action-list')
const outputField = document.querySelector('#output-field')
const data = JSON.parse(localStorage.getItem('data')) || []

let lastActive = null



/* ============================ Action list ============================ */

const actions = [
	{ text: 'Nezaradené' },

	{ text: 'Spánok' },
	{ text: 'Zapisovanie si sna' },
	{ text: 'Cvičenie' },
	{ text: 'Oddych' },
	{ text: 'Autogénny tréning' },

	{ text: 'Hygiena' },
	{ text: 'Stravovanie sa' },
	{ text: 'Obliekanie sa' },

	{ text: 'Venčenie' },
	{ text: 'Kŕmenie psa' },
	{ text: 'Hra so psom' },

	{ text: 'Čas na PC' },
	{ text: 'Čas na mobile' },
	{ text: 'Čítanie' },
	{ text: 'Film' },
	{ text: 'Upratovanie' },

	{ text: 'Stretnutie' },
	{ text: 'Presun' },
]

function populateActionList() {
	actionList.innerHTML = actions.map((item, i) => {
		return `
			<div>${item.text}</div>
		`
	}).join('')
	actionList.innerHTML += `<input type="text" name="custom" id="custom-field"><div id="custom-add">Pridať</div>`

	if (localStorage.getItem('last') !== 'null') {
		var divTags = document.getElementsByTagName("div")
		var searchText = localStorage.getItem('last')
	
		for (var i = 0; i < divTags.length; i++) {
		if (divTags[i].textContent == searchText) {
			lastActive = divTags[i]
			lastActive.classList.add('selected')
			break
		}
		}
	}
}

populateActionList() // Render actions when page is loaded


/* ============================ Action list ============================ */

actionList.addEventListener('click', addRecord)

function addRecord(e) {
	if (!e.target.matches('div')) return

	let action

	if (e.target === document.querySelector('#custom-add')) {
		action = document.querySelector('#custom-field').value
	} else {
		action = e.target.innerHTML
	}

	const timestamp = new Date()
	const formatedTime = timeFormat(timestamp)

	setDurationToPrevious(formatedTime)
	
	// Add new record
	if (!e.target.classList.contains('selected')) {
		newItem = {
			action,
			timestamp: formatedTime,
			duration: '(prebieha)'
		}
		data.unshift(newItem);

		if (lastActive) lastActive.classList.remove('selected')
		lastActive = e.target
		localStorage.setItem('last', lastActive.innerText) //////////////////////////////////
		e.target.classList.add('selected')

	// Finish action in progress
	} else {
		if (lastActive) lastActive.classList.remove('selected')
		lastActive = null
		localStorage.setItem('last', 'null') //////////////////////////////////
	}
	
	saveChanges()
	updateOutputField()
}



function setDurationToPrevious(currentTime) {
	if (data.length <= 0) return
	if (data[0].duration !== '(prebieha)') return
	const timeString = data[0].timestamp
	const timeStart = new Date('1970-01-01T' + timeString + 'Z');
	const timeEnd = new Date('1970-01-01T' + currentTime + 'Z');
	const duration = durationFormat(timeEnd - timeStart)
	data[0].duration = duration
}





function updateOutputField() {
	if (data === []) return

	let outputString = ''
	for (const item of data) {
		const action = item.action.charAt(0).toUpperCase() + item.action.slice(1);
		outputString += `${item.timestamp}&emsp;${action} ${item.duration}&#13;&#10;`
	}
	outputField.innerHTML = outputString // JSON.stringify(data)
}

updateOutputField()



/* ============================ Clear data ============================ */

document.querySelector('#clear-data').addEventListener('click', clearData)

function clearData() {
	// copyData()
	data.length = 0
	updateOutputField()
	saveChanges()
}

document.querySelector('#copy-data').addEventListener('click', copyData)

function copyData() {

	// outputField.innerHTML.select()
	// document.execCommand("copy")


	iosCopyToClipboard(outputField)
	// copyStringToClipboard(outputField.textContent)
}

document.querySelector('#undo-last').addEventListener('click', undoLast)

function undoLast() {
	if (lastActive) lastActive.classList.remove('selected')
	lastActive = null
	localStorage.setItem('last', 'null') //////////////////////////////////

	data.shift()
	updateOutputField()
	saveChanges()
}


/* ============================ Time formating ============================ */

function timeFormat(date) {
    hours = twoDigitsFormat(date.getHours());
    minutes = twoDigitsFormat(date.getMinutes());
    seconds = twoDigitsFormat(date.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

function twoDigitsFormat(n) {
    return n < 10 ? '0' + n : n;
}

function durationFormat(duration) {
	const milliseconds = parseInt((duration % 1000) / 100)
	const seconds = twoDigitsFormat(Math.floor((duration / 1000) % 60))
	const minutes = twoDigitsFormat(Math.floor((duration / (1000 * 60)) % 60))
	const hours = twoDigitsFormat(Math.floor((duration / (1000 * 60 * 60)) % 24))
	
	if (hours !== '00') {
		return `(${hours}:${minutes}:${seconds})`
	} else {
		return `(${minutes}:${seconds})`
	}
}


/* ============================ Local storage helpers ============================ */

function saveChanges() {
	localStorage.setItem('data', JSON.stringify(data));
}



function copyStringToClipboard (str) {
	// Create new element
	var el = document.createElement('textarea');
	// Set value (string to be copied)
	el.value = str;
	// Set non-editable to avoid focus and move outside of view
	el.setAttribute('readonly', '');
	el.style = {position: 'absolute', left: '-9999px'};
	document.body.appendChild(el);
	// Select text inside element
	el.select();
	// Copy text to clipboard
	document.execCommand('copy');
	// Remove temporary element
	// document.body.removeChild(el);
 }

 function iosCopyToClipboard(el) {
    var range = document.createRange();

    el.contentEditable = true;
    el.readOnly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

	document.execCommand('copy');
	
	console.log('copied');
	
}