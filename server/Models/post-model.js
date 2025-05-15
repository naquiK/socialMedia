const mongoose = require('mongoose');
const { create } = require('../../../upload-file/models/imageModel');

const postSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    publicId:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
        default:[]
    }
}, {timestamps:true});

module.exports = moongoose.model('Post', postSchema);