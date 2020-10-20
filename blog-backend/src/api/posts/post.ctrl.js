let postId = 1;

//posts 배열 초기 데이터
const posts = [
    {
        id: 1,
        title: '제목',
        content: '내용'
    }
];

/*
 포스트 작성
 POST /api/posts
 { title, content }
 */
exports.write = ctx => {
    // REST API의 요청바디는 ctx.request.body로 조회가능함
    const {title, content} = ctx.request.body;
    postId++;
    const newPost = { id: postId, title, content };
    posts.push(newPost);
    ctx.body = newPost;
};

/*
 포스트 목록 조회
 GET /api/posts
 */
exports.list = ctx => {
    ctx.body = posts;
};

/*
  특정 포스트 조회
  GET /api/posts/:id
 */
exports.findOne = ctx => {
    const {id} = ctx.params;

    const foundPost = posts.find(p => p.id.toString() === id);

    if (!foundPost) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }
    ctx.body = foundPost;
};

/*
  특정 포스트 제거
  DELETE /api/posts/:id
 */
exports.remove = ctx => {
    const {id} = ctx.params;

    const index = posts.findIndex(p => p.id.toString() === id);

    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }

    posts.splice(index, 1);
    ctx.status = 204; // No content
};

/*
  포스트 수정(전체 교체)
  PUT /api/posts/:id
  { title, content }
 */
exports.replace = ctx => {
    const {id} = ctx.params;

    const index = posts.findIndex(p => p.id.toString() === id);

    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }

    posts[index] = {
        id,
        ...ctx.request.body
    };
    ctx.body = posts[index];
};

/*
  포스트 수정(일부 수정)
  PATCH /api/posts/:id
  { title, content }
 */
exports.update = ctx => {
    const {id} = ctx.params;

    const index = posts.findIndex(p => p.id.toString() === id);

    if (index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않습니다.'
        };
        return;
    }

    posts[index] = {
        ...posts[index],
        ...ctx.request.body
    };
    ctx.body = posts[index];
};