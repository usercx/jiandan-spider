const http = require("http");
const fs = require("fs");


// 保存图片
const saveImg = function(url){
  return new Promise((resolve) => {
    http.get(url, function(res){
      var imgData = "";
      res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
      res.on("data", function(chunk){
          imgData += chunk;
      });
      res.on("end", function(){
        fs.writeFile(`${__dirname}/images/${url.substring(url.lastIndexOf("/") + 1, url.length)}`, imgData, "binary", function(err){
          if(err){
            console.log(`error when download image: ${url}`);
          }
          resolve();
        });
      });
    });
  });
};

const dealPage = async function(page){
  return new Promise(async (resolve, reject) => {
    // 监听页面加载完成事件
    const list = await page.evaluate(() => {
      var l = document.querySelectorAll("#comments ol li p a");
      // 有些图片会过滤掉，过滤掉的图片的地址是javascript:开头的
      return [...l].map(dom => dom.href).filter(href => href && !href.startsWith("javascript"));
    });
  
    for(let i = 0; i < list.length; i++){
      let item = list[i];
      let href = item;
      console.log(href);
      if(!href.startsWith("http")){
        href = "http" + href;
      }
      try{
        await saveImg(href);
      } catch(e){
        console.log(`${href}  没有被下载`);
      }
    }
    resolve();
  });
};

module.exports = dealPage;