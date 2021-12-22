<script>
  import { storage } from '@extend-chrome/storage'
  import { onMount } from 'svelte'

  let res = {
    data: [],
    total: 0
  }
  let template = ''

  let link = ``
  let length = 100



  const fetchData = async (link, backdoorToken) => {
    storage.local.set((data) => {
      return {
        ...data,
        link
      }
    })
    const url = new URL(link);
    const search_params = url.searchParams;

    search_params.set('perPage', '100');

    url.search = search_params.toString();

    const new_url = url.toString();

    const request = await fetch(
      new_url,
      {
        headers: {
          'X-Backdoor': `${backdoorToken}`,
        },
      },
    )
    res = await request.json()

  }

  onMount(() => {
    storage.local.get({ link: ''}).then(({ link: _link }) => {
      link = _link || ''
      setTimeout(() => {
        storage.local.get('backdoorToken').then(({ backdoorToken }) => {
          fetchData(link, backdoorToken)
        })
      }, 0)

    })
  })

  async function refetchData() {
    if (link) {
      storage.local.get('backdoorToken').then(({ backdoorToken }) => {
        fetchData(link, backdoorToken)
      })
    } else {
      alert('Nhập link request')
    }
  }

  $: prizeData = res.data.map(item => ({ userData: { phone: item.userData.phone }}))


  $: fileName = (() => {
    const nameArr = ['DSTG']
    nameArr.push(template === 'FootballMain' ? 'CHC': 'CHP')
    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  let textFile = ''

  $: href = (() => {
    const data = new Blob([JSON.stringify(prizeData, null, 2)], { type: "application/json" })

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile)
  }
  textFile = window.URL.createObjectURL(data)
  return textFile
  })()

  //
  $: prizeDataFull = res.data.map(item => ({ userData: { phone: item.userData.phone, interactiveTime: item.interactiveTime }}))

  let textFile2 = ''

  $: fileName2 = (() => {
    const nameArr = ['DSFULL']
    nameArr.push(template === 'FootballMain' ? 'CHC': 'CHP')

    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  $: href2 = (() => {
    const data = new Blob([JSON.stringify(prizeDataFull, null, 2)], { type: "application/json" })

  if (textFile2 !== null) {
    window.URL.revokeObjectURL(textFile2)
  }
  textFile2 = window.URL.createObjectURL(data)
  return textFile2
  })()

   //
   $: filterData = res.data.map(item => item.userData.phone)

  let textFile3 = ''

  $: fileName3 = (() => {
    const nameArr = ['DSFULL']
    nameArr.push(template === 'FootballMain' ? 'CHC': 'CHP')

    const date = Date.now().toString()
    nameArr.push(date)
    return nameArr.join('_')
  })()

  $: href3 = (() => {
    const data = new Blob([filterData.join('\n')], { type: "text/plain" })

  if (textFile3 !== null) {
    window.URL.revokeObjectURL(textFile3)
  }
  textFile3 = window.URL.createObjectURL(data)
  return textFile3
  })()

  $:disabled = !link

</script>

<main class="p-4">
	<div class="text-base mb-1">
		Tổng số: <span class="font-semibold text-lg"> {res.total}</span>
	</div>
	<div class="text-base mb-1">
		Loại: <span class="font-semibold text-lg">
			{template === 'FootballMain' ? 'CHC' : 'CHP'}</span
		>
	</div>
	<div class="flex flex-col space-y-2">
		<div class="relative">
			<div class="text-base mb-1">Link:

        <a class="cursor-pointer text-sm italic text-blue-500" href="https://drive.google.com/file/d/1DxScba6ay-ECIE9FMeBGg_6jtiDyfEJY/view?usp=sharing" target="__blank">Hướng dẫn lấy link</a>
      </div>
			<textarea
				type="text"
				rows="5"
				bind:value={link}
				class="bg-white border border-transparent rounded-lg border-gray-300 flex-1 shadow-sm text-base w-full py-1 px-3 placeholder-gray-400 text-gray-700 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
				placeholder="Nhập payload"
			/>
		</div>

		<div class="relative">
			<div class="text-base mb-1">Số lượng: (eg. 100 người đầu tiên)</div>
			<input
				type="text"
				bind:value={length}
				class="bg-white border border-transparent rounded-lg border-gray-300 flex-1 shadow-sm text-base w-full py-1 px-3 placeholder-gray-400 text-gray-700 appearance-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
				placeholder="Nhập độ dài"
			/>
		</div>
		<button
			on:click={refetchData}
			type="button"
			{disabled}
			class="rounded-full font-semibold bg-pink-600 shadow-md text-base text-center text-white w-full py-1 px-3 transition ease-in duration-200 inline-block hover:bg-pink-700 focus:outline-none focus:ring-pink-500 focus:ring-offset-pink-200 focus:ring-2 focus:ring-offset-2"
		>
			Tải dữ liệu
		</button>
    <hr/>
		<div class="flex flex-col space-y-2">
			<a
				class="rounded-full flex-grow font-semibold bg-green-600 shadow-md text-center text-white w-full py-1 px-3 transition ease-in duration-200 inline-block hover:bg-green-700 focus:outline-none focus:ring-green-500 focus:ring-offset-green-200 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-sm"
				{href}
				{disabled}
				download={fileName}
			>
        Danh sách cộng thưởng (ON CMS)
			</a>
			<a
				class="rounded-full font-semibold bg-blue-600 flex-grow-0 shadow-md text-center text-white w-full py-1 px-3 transition ease-in duration-200 inline-block hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-blue-200 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-sm"
				href={href2}
				{disabled}
				download={fileName2}
			>
        Danh sách (thông tin thời gian)
      </a>
      <a
				class="rounded-full font-semibold bg-yellow-600 flex-grow-0 shadow-md text-center text-white w-full py-1 px-3 transition ease-in duration-200 inline-block hover:bg-yellow-700 focus:outline-none focus:ring-yellow-500 focus:ring-offset-yellow-200 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-sm"
				href={href3}
				{disabled}
				download={fileName3}
			>
        Danh sách filters (Interactive CMS)
			</a>
		</div>
	</div>
</main>
