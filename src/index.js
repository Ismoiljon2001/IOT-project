import { getDatabase, onValue, ref, set } from 'firebase/database'
import { initializeApp } from 'firebase/app'

const rfIdWhiteList = ['c1889d24', 'd2ef6e19']

const led = document.getElementById('led')
const rfid = document.getElementById('rfid')
const temp = document.getElementById('temp')
const humidity = document.getElementById('humidity')
const thermometer = document.getElementById('thermometer')
const humidityScale = document.getElementById('humidity-scale')

const rfidArray = new Proxy([], {
	get: function (target, property) {
		return target[property]
	},
	set: function (target, property, value) {
		target[property] = value

		rfid.querySelector('tbody').innerHTML = target
			.map((item, index) => {
				return `<tr>
							<td class="border">${index + 1}</td><td class="border">${item.rfid}</td>
							${item.status ? "<td class='border text-green-800'>accepted</td>" : "<td class='border text-red-800'>denied</td>"}
						</tr>`
			})
			.join('')

		return true
	},
})

const firebaseConfig = {
	measurementId: 'G-1199WP4M4K',
	projectId: 'iot-project-fef83',
	messagingSenderId: '366002552675',
	storageBucket: 'iot-project-fef83.appspot.com',
	authDomain: 'iot-project-fef83.firebaseapp.com',
	apiKey: 'AIzaSyBULAZ5mBP_2By_Qz6Xv_7SKiSknks1dOo',
	appId: '1:366002552675:web:98340b632b7dec79461d56',
	databaseURL: 'https://iot-project-fef83-default-rtdb.firebaseio.com',
}

const speak = str => window.speechSynthesis.speak(new SpeechSynthesisUtterance(str))

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

const dataRef = ref(db, 'data')

temp.addEventListener('click', ev => {
	speak(`The temperature is ${ev.target.textContent}`)
})

humidity.addEventListener('click', ev => {
	speak(`The humidity is ${ev.target.textContent}`)
})

led.addEventListener('click', async ev => {
	set(ref(db, 'a'), ev.target.dataset.status).then(() => {
		const el = ev.target.closest('#led')

		el.dataset.status = el.dataset.status === '0' ? '1' : '0'
		el.innerText = el.dataset.status === '0' ? 'close' : 'open'
	})
})

onValue(dataRef, snapshot => {
	const [tempV, humidityV, rfidV, ledV, flameV] = snapshot.val().split(':')

	led.dataset.status = ledV
	temp.innerText = `${tempV}°`
	led.innerText = led ? 'close' : 'open'
	humidity.innerText = `${humidityV ?? 0}%`

	thermometer.querySelector('div').style.height = `${100 - +tempV}%`
	humidityScale.querySelector('div').style.height = `${100 - +humidityV}%`

	if (rfidV && rfidV !== 'null') {
		rfidArray.push({ rfid: rfidV, status: rfIdWhiteList.includes(rfidV) })
	}
})
