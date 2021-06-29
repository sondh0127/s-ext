<script>
  import { storage } from '@extend-chrome/storage'

  let winingUsers = []

  let overlayId = ``
  let length = 100

  const fetchData = async (id, backdoorToken) => {
    const request = await fetch(
      `https://cms-on-v2.gviet.vn:8443/ilp-campaign-service/v1/overlays/${id}`,
      {
        headers: {
          'X-Backdoor': `${backdoorToken}`,
        },
      },
    )
    const res = await request.json()
    const metadata = JSON.parse(res?.data?.overlay?.metadata || {})

    winingUsers = metadata.winingUsers
    console.log('🇻🇳 ~ file: Popup.svelte ~ line 22 ~ winingUsers', winingUsers)
  }


  async function refetchData() {
    if (overlayId) {
      storage.local.get('backdoorToken').then(({ backdoorToken }) => {
        console.log('🇻🇳 ~ file: index.js ~ line 17 ~ backdoorToken', backdoorToken)
        fetchData(overlayId, backdoorToken)
      })
    } else {
      alert('Nhập overlay ID!')
    }
  }

  $: answerTheSameList = winingUsers?.map((item) => {
    return `${item.userId}, ${item.answerTheSame}`
  }).slice(0, length).join('\n')


  $: fileName = (() => {
    const nameArr = ['DSTG']
    nameArr.push('CHC')
    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  let textFile = ''

  $: href = (() => {
    const data = new Blob([`SĐT, Dự đoán\n`+ answerTheSameList], { type: 'text/plain' })

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile)
  }
  textFile = window.URL.createObjectURL(data)
  return textFile 
  })()

  $:disabled = !overlayId

</script>

<main class="p-4">
	<div class="text-base mb-1">
		Tổng số: <span class="text-lg font-semibold"> {winingUsers?.length}</span>
	</div>
	<div class="flex flex-col space-y-2">
		<div class="relative">
			<div class="text-base mb-1">ID: (Copy overlayID từ CMS)</div>
			<input
				type="text"
				bind:value={overlayId}
				class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
				placeholder="Nhập overlay ID"
			/>
		</div>

		<button
			on:click={refetchData}
			type="button"
			{disabled}
			class="py-1 px-3 inline-block  bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
		>
			Fetch
		</button>
		<div class="relative">
			<div class="text-base mb-1">Số lượng: (eg. 100 người đầu tiên)</div>
			<input
				type="text"
				bind:value={length}
				class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-1 px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
				placeholder="Nhập độ dài"
			/>
		</div>
		<a
			class="py-1 px-3 inline-block bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
			{href}
			{disabled}
			download={fileName}
		>
			<span> Download </span>
		</a>
	</div>
</main>
