import Post from "../../models/posts";
import Joi from '@hapi/joi';

// 데이터베이스의 ObjectId값을 검증하는 미들웨어
import mongoose from 'mongoose';

const {ObjectId} = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const {id} = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    return next();
};

/*
 포스트 작성
 POST /api/posts
 {
    title: '제목',
    content: '내용',
    tags: ['tag1', 'tag2']
 }
 */
export const write = async ctx => {

    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), //required가 있으면 필수항목
        content: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required()
    });

    //검증 후 실패한 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const {title, content, tags} = ctx.request.body;
    const newPost = new Post({
        title, content, tags
    });

    try {
        await newPost.save();
        ctx.body = {saveSuccess: true};
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
 포스트 목록 조회
 GET /api/posts
 */
export const list = async ctx => {

    //query는 문자열이기 때문에 숫자로 변환한다.
    let page = parseInt(ctx.query.page || '1', 10);

    if (page < 1) {
        page = 1;
    }

    try {
        const posts = await Post.find()
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .exec();
        //커스텀 http헤더 설정으로 마지막페이지번호 클라이언트에 알려주기
        const postCount = await Post.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));

        //내용이 너무 길 경우 200자이상이면 뒤에 ... 붙여서 처리하기
        //find로 조회한 데이터는 몽구스 인스턴스 형태이므로 json으로 변환해야 자바스크립트 함수적용가능능
       ctx.body = posts
            .map(post => post.toJSON())
            .map(post => ({
                ...post,
                content: post.content.length < 200 ? post.content : `${post.content.slice(0, 200)}...`
            }));

    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
  특정 포스트 조회
  GET /api/posts/:id
 */
export const findOne = async ctx => {
    const {id} = ctx.params;
    try {
        const foundPost = await Post.findById(id).exec();
        if (!foundPost) {
            ctx.status = 404;
            return;
        }
        ctx.body = foundPost;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
  특정 포스트 제거
  DELETE /api/posts/:id
 */
export const remove = async ctx => {
    const {id} = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content ( 성공은 했지만 응답 데이터는 없음 )
    } catch (e) {
        ctx.throw(500, e);
    }
};


/*
  포스트 수정(일부 수정)
  PATCH /api/posts/:id
  { title, content }
 */
export const update = async ctx => {
    const {id} = ctx.params;

    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string(), //required가 없는 것에 주목
        content: Joi.string(),
        tags: Joi.array()
            .items(Joi.string())
    });

    //검증 후 실패한 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try {
        //option 객체에 new: true를 주면 업데이트된 데이터를 반환합니다. false면 업데이트 전의 데이터를 반환합니다.
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, { new: true }).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};