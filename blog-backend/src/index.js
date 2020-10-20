
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const api = require('./api');

//몽구스 연결
const config = require('./config/key');
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => console.log('Mongo DB connected!'))
    .catch(err => console.error(err));

const app = new Koa();
const port = 4000;
const router = new Router();

//라우터 설정
router.use('/api', api.routes());

//라우터 적용 전에 bodyParser적용
app.use(bodyParser());

//app인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});