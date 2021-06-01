'use strict'
const puppeteer = require('puppeteer')
const fs = require('fs')

// エラーが発生した場合はこの値を10000などに増やしてあげる
const waitTime = 1000

const options = {
  headless: true,
  defaultViewport: null,
  args: [
    '--no-sandbox',
    '--window-size=800,1200'
  ]
};

(async () => {

  // キャスト一覧情報
  const castList = {"153254":"恋摘いちご","153256":"練みるく","153258":"水葉しずく","153259":"野々ののこ","153346":"花陽ここあ","153349":"華城ヨミ","153350":"枢けい","157260":"桃園えりか"}

  // ブラウザを開く
  const browser = await puppeteer.launch(options)

  // タブを開く
  const page = await browser.newPage()

  // 偽装する
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', ()=>{});
    delete navigator.__proto__.webdriver;
  })

  // ファイル作成
  fs.writeFile('program/data.json', "", (err) => { if (err) throw err })
  let output = []

  for(let cast in castList)
  {
    console.log(`${castList[cast]} (ID:${cast}) の情報を取得中...`)

    // LaMerのベータテスト参加ページにアクセスする
    await page.goto(`https://select-type.com/rsv/?id=yQsFJyBS9zk&w_flg=1`, { waitUntil: 'networkidle0' })

    // 待機する
    await page.waitForTimeout(waitTime)

    // キャストを選択する
    await page.select('.row-fluid > .content > .content-body > .list-group > .span12', cast)
    await page.waitForTimeout(waitTime)

    // 30分を選択する
    await page.click('li:nth-child(1) > .box > .box-body > .box-footer > .btn')
    await page.waitForTimeout(waitTime)

    // 日時情報を取得する
    const scrapingData = await page.evaluate(() => {
      const dataList = []
      const nodeList = document.querySelectorAll("body > div.body > div > div.row-fluid > div > div.content-body > div.cl-type-week.rsvcal_cls > div > table > tbody > tr > td > div > div > a")
      nodeList.forEach(_node => dataList.push(_node.className.substr(-10)))
      return dataList
    })

    console.log(`${castList[cast]} (ID:${cast}) ${scrapingData}`)
    output.push(scrapingData)
  }
  fs.writeFile('program/data.json', JSON.stringify(output) , (err) => { if (err) throw err })
  await browser.close();
})()