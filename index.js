const fs = require("fs");
const axios = require("axios");
const http = require("http");
const url = require("url");


function getData() {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/13")
    .then((res) => {
      console.log(res.data);
      fs.writeFile("readme.txt", JSON.stringify(res.data), (err) => {
        if (err) {
          console.log("Ошибочка записи");
        } else {
          console.log("Данные успешно записаны");
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
getData();

function getFileText(callback) {
  fs.readFile("readme.txt", "utf-8", (err, content) => {
    if (err) {
      console.log("Ошибка чтения файла", err);
      callback(err, null);
    } else {
      try {
        let data = JSON.parse(content);
        console.log(data);
        callback(null, data);
      } catch (parseError) {
        console.log("Ошибка парсинга JSON", parseError);
        callback(parseError, null);
      }
    }
  });
}

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
  
    if (pathname === '/') {
      response.writeHead(200, { "Content-Type": "application/json" });
      getFileText((err, data) => {
        if (err) {
          response.end(JSON.stringify({ error: "Ошибка получения данных" }));
        } else {
          response.end(JSON.stringify(data));
        }
      });
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Маршрут не найден" }));
    }
  });

server.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000/");
});
