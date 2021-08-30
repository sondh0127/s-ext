<script>
  import { storage } from '@extend-chrome/storage'

  let winingUsers = []
  let interactiveUsers = []
  let template = ''

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
    template = metadata.template
  }

  const fetchData2 = async (id, backdoorToken) => {
    const request = await fetch(
      `https://cms-on-v2.gviet.vn:8443/ilp-engagement-service/v1/stats/internal-metrics/${id}`,
      {
        headers: {
          'X-Backdoor': `${backdoorToken}`,
        },
      },
    )
    const res = await request.json()
    interactiveUsers = res?.data?.metrics?._overlay_interacted?.userIds || []
  }


  async function refetchData() {
    if (overlayId) {
      storage.local.get('backdoorToken').then(({ backdoorToken }) => {
        fetchData(overlayId, backdoorToken)
        fetchData2(overlayId, backdoorToken)
      })
    } else {
      alert('Nhập overlay ID!')
    }
  }

  $: answerTheSameList = winingUsers?.map((item) => {
    return  template === 'FootballMain' ? `${item.userId}, ${item.answerTheSame}`: `${item.userId}`
  }).slice(0, length).join('\n')


  $: fileName = (() => {
    const nameArr = ['DSTG']
    nameArr.push(template === 'FootballMain' ? 'CHC': 'CHP')

    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  let textFile = ''

  $: href = (() => {
    const data = new Blob([answerTheSameList], { type: 'text/plain' })

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile)
  }
  textFile = window.URL.createObjectURL(data)
  return textFile
  })()

  $: interactiveList = interactiveUsers.join('\n')

  let textFile2 = ''

  $: fileName2 = (() => {
    const nameArr = ['DSTT']
    nameArr.push(template === 'FootballMain' ? 'CHC': 'CHP')

    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  $: href2 = (() => {
    const data = new Blob([interactiveList], { type: 'text/plain' })

  if (textFile2 !== null) {
    window.URL.revokeObjectURL(textFile2)
  }
  textFile2 = window.URL.createObjectURL(data)
  return textFile2
  })()

  $:disabled = !overlayId

</script>

<main class="p-4">
	<div class="mb-1 text-base">
		Tổng số: <span class="text-lg font-semibold"> {winingUsers?.length}</span>
	</div>
	<div class="mb-1 text-base">
		Loại: <span class="text-lg font-semibold"> {template === 'FootballMain' ? 'CHC': 'CHP'}</span>
	</div>
	<div class="flex flex-col space-y-2">
		<div class="relative">
			<div class="mb-1 text-base">ID: (Sao chép ID từ CMS)</div>
			<input
				type="text"
				bind:value={overlayId}
				class="flex-1 w-full px-3 py-1 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
				placeholder="Nhập overlay ID"
			/>
		</div>

		<button
			on:click={refetchData}
			type="button"
			{disabled}
			class="inline-block w-full px-3 py-1 text-base font-semibold text-center text-white transition duration-200 ease-in bg-pink-600 rounded-full shadow-md hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			Tải dữ liệu
		</button>
		<div class="relative">
			<div class="mb-1 text-base">Số lượng: (eg. 100 người đầu tiên)</div>
			<input
				type="text"
				bind:value={length}
				class="flex-1 w-full px-3 py-1 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
				placeholder="Nhập độ dài"
			/>
		</div>
		<a
			class="inline-block w-full px-3 py-1 text-base font-semibold text-center text-white transition duration-200 ease-in bg-green-600 rounded-full shadow-md hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
			{href}
			{disabled}
			download={fileName}
		>
			<span> Tải danh sách trả lời đúng </span>
		</a>

    <div class="w-full h-px bg-gray-600"> </div>

    <div class="mb-1 text-base">
      Tổng số: <span class="text-lg font-semibold"> {interactiveUsers?.length}</span>
    </div>
    <a
			class="inline-block w-full px-3 py-1 text-base font-semibold text-center text-white transition duration-200 ease-in bg-purple-600 rounded-full shadow-md hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
			href={href2}
			{disabled}
			download={fileName2}
		>
			<span> Tải danh sách tương tác </span>
		</a>
	</div>
</main>
