import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import api from './api';

//몽구스 연결
import config from './config/key';
import mongoose from 'mongoose';

// import createFakeData from "./createFakeData";

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => {
    console.log('Mongo DB connected!');
    // createFakeData();
}).catch(err => console.error(err));

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