const puppeteer = require('puppeteer');
const dealPage = require("./dealPage.js");

let browser = null;

const pageLength = 40;

// 做初始化
let init = async function(){
  browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
  });
};

let mainfun = async function(){
  await init();

  (async () => {
    for(let i = 1; i <= pageLength; i++){
      let url = `http://jandan.net/ooxx/page-${i}#comments`;
      console.log(`正在爬取第${i}页的网址：${url}`);
      let page = null;
      try{
        page = await browser.newPage();
        await page.goto(url, {timeout: 0, waitUntil: "domcontentloaded"});
        console.log("load");
        await dealPage(page);
      } catch(e){
        console.log(e);
        console.log(`第${i}页抓取失败！`);
      } finally{
        await page.close();
      }
    }
    console.log("all is over");
    await browser.close();
  })();
};

mainfun();