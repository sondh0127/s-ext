console.log('content script working')
import { storage } from '@extend-chrome/storage'




const intervalRef = setInterval(() => {
	const iframeEle = document.querySelector('.app-container-inview > iframe')
	if (iframeEle) {
		console.log('🇻🇳 ~ file: index.js ~ line 3 ~ iframeEle', iframeEle)
		const regex = /token=(.*)&/gm
		let match
		if ((match = regex.exec(iframeEle.src)) !== null) {
			console.log('🇻🇳 ~ file: index.js ~ line 9 ~ match', match)
			// match[0]
			console.log('🇻🇳 ~ file: index.js ~ line 9 ~ match[0]', match[1])
			storage.local.set({ backdoorToken: match[1] })
		}

		storage.local.get('backdoorToken').then(({ backdoorToken }) => {
			console.log('🇻🇳 ~ file: index.js ~ line 17 ~ backdoorToken', backdoorToken)
		})

		clearInterval(intervalRef)
	}
}, 500)

