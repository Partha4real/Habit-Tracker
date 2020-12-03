const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    habit: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    date:{
        type:String
    },
    streak:{
        type:Number,
        default:0
    },
    days:{
        one:{
            type:String,
            default:null
        },
        two:{
            type:String,
            default:null
        },
        three:{
            type:String,
            default:null
        },
        four:{
            type:String,
            default:null
        },
        five:{
            type:String,
            default:null
        },
        six:{
            type:String,
            default:null
        },
        seven:{
            type:String,
            default:null
        }
    }
});

module.exports = mongoose.model('Habit', HabitSchema);
