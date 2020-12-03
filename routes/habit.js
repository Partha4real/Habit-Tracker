const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/User');
const Habit = require('../models/Habit');
const { format } = require('path');


//@desc     create habit
//@route    POST /habit/create-habit
//@access   PRIVATE
router.post('/create-habit', async(req, res) => {
    let days = {
        one:"none",
        two:"none",
        three:"none",
        four:"none",
        five:"none",
        six:"none",
        seven:"none",
    }
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
    const newhabit = new Habit({
        email: req.user.email,
        habit: req.body.habit,
        desc: req.body.desc,
        frequency: req.body.frequency,
        date: today.toLocaleDateString("en-US", options),
        days: days
    })
    try {
        newhabit.save();
        console.log(newhabit)
        req.flash('success_msg', 'Habit created');
        res.redirect('/user/dashboard')
    } catch (err) {
        console.error(err);
    }
    
});

//@desc     update habit
//@route    POST /habit/update-habit/:id/:day/:val
//@access   PRIVATE
router.post('/update-habit/:id/:day/:val', async(req, res) => {
    let {id, day, val} = req.params;
    //console.log(id, day, val);
    try {
        let habit = await Habit.findById(id);
        if (!habit) {
            req.flash('error_msg', 'Habit not found');
            res.redirect('/user/dashboard')
        }
        var newHabit = habit;
        for(let item in newHabit.days){
            if(item==day){
                console.log(val)
                if(val=="none"){
                    newHabit.days[day]="yes";
                    newHabit.streak++;
                    console.log(newHabit.streak);
                }else if(val=="yes"){
                    newHabit.days[day]="no";
                    newHabit.streak--;
                }else{
                    newHabit.days[day]="none";
                }
            }
        }
        console.log(newHabit);
        // updating habit
        try {
            console.log(id);
             await Habit.findOneAndUpdate({_id: req.params.id}, newHabit, {
                new: true,
                runValidators: true,
            });
            req.flash('success_msg', 'Habit Updated');
        res.redirect('/user/dashboard')
        } catch (err) {
            console.error(err);
        }
        
    } catch (err) {
        console.error(err);
    }
    
});


//@desc     Show streak
//@route    POST /habit/streak/:id
//@access   PRIVATE
router.get('/streak/:id', async(req, res) => {
    const {id} = req.params;
    console.log(id);
    let today = moment()
    try {
        let habit = await Habit.findById(id);
        res.render('streak', {
            //name: req.user.firstName,
            layout: "habit_layout",
            user: req.user,
            Habits: habit,
            today,
        })
    } catch (err) {
        console.error(err);
    }
});




//@desc     search
//@route    POST /habit/search/
//@access   PRIVATE
router.post('/search/', async(req, res) => {
    console.log(req.body.search)
    try {
        let habit = await Habit.find({habit: req.body.search});
        if (habit.length<=0) {
            req.flash('error_msg', 'Habit not found');
            return res.redirect('/user/dashboard')
        }
        res.render('dashboard', {
            //name: req.user.firstName,
            layout: "habit_layout",
            user: req.user,
            Habits: habit,
        })
    } catch (err) {
        console.error(err);
    }
});

//@desc     delete habit
//@route    POST /habit/delete-habit/:id
//@access   PRIVATE
router.get('/delete-habit/:id', async(req, res) => {
    try {
        await Habit.remove({_id: req.params.id});
        req.flash('success_msg', 'Habit deleted');
        res.redirect('/user/dashboard')
    } catch (err) {
        console.error(err);
    }
    
});
















module.exports = router;