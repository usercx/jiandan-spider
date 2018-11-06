const puppeteer = require('puppeteer');
const dealPage = require("./dealPage.js");

let browser = null;

const pageLength = 39;

// 做初始化
let init = async function(){
  browser = await puppeteer.launch();
};

let mainfun = async function(){
  await init();
  const page = await browser.newPage();

  (async () => {
    for(let i = 28; i <= pageLength; i++){
      let url = `http://jandan.net/ooxx/page-${i}#comments`;
      console.log(`正在爬取第${i}页的网址：${url}`);
      try{
        await page.goto(url, {waitUntil: 'networkidle2'});
        await dealPage(page);
      } catch(e){
        console.log(`第${i}页抓取失败！`);
      }
    }
    console.log("all is over");
    await page.close();
    await browser.close();
  })();
};

mainfun();