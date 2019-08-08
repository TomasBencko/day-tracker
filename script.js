

const actionList = document.querySelector('#action-list')
const outputField = document.querySelector('#output-field')
const data = JSON.parse(localStorage.getItem('data')) || []

const actions = [
	{ action: 'sleep', text: 'Spánok', color: '#16a085' },
	{ action: 'lying', text: 'Ležanie v posteli', color: '#1abc9c' },
	{ action: 'exercise', text: 'Cvičenie', color: '#16a085' },
	{ action: 'shower', text: 'Sprchovanie sa', color: '#1abc9c' },
	{ action: 'aisha', text: 'Venčenie Aishi', color: '#16a085' },
	{ action: 'wc', text: 'WC', color: '#1abc9c' },
]

function loadActions() {
	actionList.innerHTML = actions.map((item, i) => {
		return `
			<div 
				data-action="${item.action}"
				style="background-color: ${item.color}"
			>
				${item.text}
			</div>
		`
	}).join('')
}

function updateOutput() {
	if (data === []) return

	let outputString = ''
	for (const item of data) {
		const action = item.action.charAt(0).toUpperCase() + item.action.slice(1);
		// const time = item.timestamp.getHours() + ":" + item.timestamp.getMinutes() + ":" + item.timestamp.getSeconds();
		// let duration = ''
		// if (item.duration !== '') {
		// 	duration = "(" + item.duration.getHours() + ":" + item.duration.getMinutes() + ":" + item.duration.getSeconds() + ")";
		// }
		// outputString += `${time}: ${action} ${duration}<br />`
		outputString += `${item.timestamp}: ${action}<br />`
	}
	// outputString = outputString.slice(0, outputString.length - 3)
	outputField.innerHTML = outputString // JSON.stringify(data)
}

function addRecord(e) {
	if (!e.target.matches('div')) return

	const timestamp = new Date();
	const time = timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();
	console.log(time);
	


	// if (data.length > 0) {
	// 	const elapsed = timestamp - data[0].timestamp
	// 	console.log(elapsed);
	// 	const difference = new Date(elapsed);
	// 	console.log(difference);
	// 	console.log(difference.getSeconds());

	// 	data[0].duration = difference
	// }


	newItem = {
		action: e.target.dataset.action,
		timestamp: time,
		duration: ''
	}
	data.unshift(newItem);
	
	localStorage.setItem('data', JSON.stringify(data));
	updateOutput()
}

actionList.addEventListener('click', addRecord)


loadActions()
updateOutput()