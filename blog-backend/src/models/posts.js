
import mongoose from 'mongoose';

//스키마 생성
const { Schema } = mongoose;

const PostSchema = new Schema({
    title : String,
    content: String,
    tags: [String], //문자열 배열
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
});

//모델 생성
const Post = mongoose.model('Post', PostSchema);
export default Post;