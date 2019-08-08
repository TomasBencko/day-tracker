
const actionList = document.querySelector('#action-list')
const outputField = document.querySelector('#output-field')
const data = JSON.parse(localStorage.getItem('data')) || []


/* ============================ Action list ============================ */

const actions = [
	{ text: 'Spánok', color: '#16a085' },
	{ text: 'Ležanie v posteli', color: '#1abc9c' },
	{ text: 'Cvičenie', color: '#16a085' },
	{ text: 'Sprchovanie sa', color: '#1abc9c' },
	{ text: 'Venčenie Aishi', color: '#16a085' },
	{ text: 'WC', color: '#1abc9c' },
]

function populateActionList() {
	actionList.innerHTML = actions.map((item, i) => {
		return `
			<div>${item.text}</div>
		`
	}).join('')
}

populateActionList() // Render actions when page is loaded


/* ============================ Action list ============================ */

actionList.addEventListener('click', addRecord)

function addRecord(e) {
	if (!e.target.matches('div')) return

	const timestamp = new Date()
	const formatedTime = timeFormat(timestamp)

	setDurationToPrevious(formatedTime)
	
	newItem = {
		action: e.target.innerHTML,
		timestamp: formatedTime,
		duration: ''
	}
	data.unshift(newItem);
	
	saveChanges()
	updateOutputField()
}

function setDurationToPrevious(currentTime) {
	if (data.length <= 0) return
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
		outputString += `${item.timestamp}&emsp;${action} ${item.duration}<br />`
	}
	outputField.innerHTML = outputString // JSON.stringify(data)
}

updateOutputField()



/* ============================ Clear data ============================ */

document.querySelector('#clear-data').addEventListener('click', clearData)

function clearData() {
	copyData()
	data.length = 0
	updateOutputField()
	saveChanges()
}

document.querySelector('#copy-data').addEventListener('click', copyData)

function copyData() {

	// outputField.innerHTML.select()
	// document.execCommand("copy")


	copyStringToClipboard(outputField.textContent)
}

document.querySelector('#undo-last').addEventListener('click', undoLast)

function undoLast() {
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