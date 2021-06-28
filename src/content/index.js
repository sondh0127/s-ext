console.log('content script working')
import { storage } from '@extend-chrome/storage'

window.addEventListener('load', () => {
	const iframeEle = document.querySelector('.app-container-inview > iframe')
	console.log('🇻🇳 ~ file: index.js ~ line 3 ~ iframeEle', iframeEle.src)
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
})
