const nHentaiApi = require("nhentai-api-js");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

let api = new nHentaiApi();
const nhentaiCode = 243254;

const downloadImage = async (url, path) => {
  const writer = fs.createWriteStream(path);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

api.g(nhentaiCode).then(gallery => {
  const title = gallery.title.english
    .normalize()
    .replace(/[\<\>\:\"\\\/\|\?\*]/, "");

  const images = gallery.getPages();

  try {
    if (!fs.existsSync("downloads")) {
      try {
        fs.mkdirSync("downloads");
      } catch (error) {
        console.log("Error occured when creating folder: ", error);
      }
    }
    if (!fs.existsSync(`downloads/${title}`)) {
      try {
        fs.mkdirSync(`downloads/${title}`);
        console.log("Folder created!");
      } catch (error) {
        console.log("Error occured when creating folder: ", error);
      }
    }
  } catch (error) {
    console.log("Error occured when creating folder: ", error);
  }

  for (let i = 0; i < images.length; i++) {
    let imgPath = path.resolve(__dirname, `downloads/${title}`, `${i + 1}.jpg`);
    downloadImage(images[i], imgPath).then(
      console.log(`Image ${i + 1} downloaded`)
    );
  }
  setTimeout(() => {
    console.log("Done downloading images!");
  }, 0);
});
