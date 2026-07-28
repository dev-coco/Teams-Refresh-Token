const scriptUrl = document.getElementById('scriptUrl')
const status = document.getElementById('status')

scriptUrl.addEventListener('change', () => {
  chrome.storage.local.set({ scriptUrl: scriptUrl.value })
})

chrome.storage.local.get('scriptUrl', result => {
  scriptUrl.value = result.scriptUrl || ''
})

async function getToken () {
  const cookies = await new Promise(resolve => chrome.cookies.getAll({ domain: 'live.com' }, cookies => resolve(cookies)))
  const token = cookies.filter(x => x.name === 'skypetoken' && x.value.startsWith('B'))[0].value.replace(/^Bearer%3D|%26O.+/g, '')
  return token
}

document.getElementById('update').addEventListener('click', async () => {
  // 未设置 API 链接
  const apiUrl = scriptUrl.value || ''
  if (!apiUrl) return

  status.innerText = '正在更新...'

  const token = await getToken()
  const body = new FormData()
  body.append('token', token)
  await fetch(apiUrl, {
    body,
    method: 'POST'
  }).then(response => response.text())

  status.innerText = '✅ 已更新'
})
