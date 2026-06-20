// 获取 API 脚本链接
const api = async () => {
  return new Promise(resolve => {
    chrome.storage.local.get('scriptUrl', result => {
      resolve(result.scriptUrl || '')
    })
  })
}

async function getToken () {
  const cookies = await new Promise(resolve => chrome.cookies.getAll({ domain: 'live.com' }, cookies => resolve(cookies)))
  const token = cookies.filter(x => x.name === 'skypetoken' && x.value.startsWith('B'))[0].value.replace(/^Bearer%3D|%26O.+/g, '')
  return token
}

let isRunning = false

chrome.windows.onCreated.addListener(async () => {
  // 未设置 API 链接
  const apiUrl = await api()
  if (!apiUrl) return

  if (isRunning) {
    console.log('任务已在运行，跳过新窗口触发')
    return
  }
  isRunning = true

  try {
    const token = await getToken()
    const body = new FormData()
    body.append('token', token)
    await fetch(apiUrl, {
      body,
      method: 'POST'
    }).then(response => response.text())
  } finally {
    isRunning = false
  }
})
