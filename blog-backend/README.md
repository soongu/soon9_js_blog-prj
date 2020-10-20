# Koa Backend configuration
```shell script
$ yarn init -y
$ yarn add koa
$ yarn add -D nodemon
```

- nodemon 설정
```json
{
  "name": "blog-backend",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "koa": "^2.13.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.6"
  },
  "scripts": {
    "start": "node src",
    "dev": "nodemon --watch src/ src/index.js"
  }
}

```

- bodyparser 설치 `$ yarn add koa-router koa-bodyparser`

- mongoose 설치 `$ yarn add mongoose`
  - mongoose 연결 
```js
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://soon9:<password>@soon9-youtube-clone.ynizg.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => console.log('Mongo DB connected!'))
    .catch(err => console.error(err));
```

- node.js에서 import/export 사용하기
  - `$ yarn add esm` 설치 후 package.json 수정
```
"scripts": {
    "start": "node -r esm src",
    "dev": "nodemon --watch src/ -r esm src/index.js"
  }
```