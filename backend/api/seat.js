const express = require('express');
const router = express.Router()

const Seat = require('../models/seat');

router.get('/', (req, res) => {
    Seat.find()
        .then(seats => res.json(seats))
        .catch(err => console.log(err))
})

router.post('/', (req, res)=>{
    const {num} = req.body;
    // console.log(num);
    Seat.find()
        .then(seats => {
            // console.log(seats[0].allseats);
            const [changedSeats, nums] = getOptimalPositons(num, seats[0].allseats);
            if(nums === -1)
                res.json(-1);
            // console.log(changedSeats);
            // console.log(nums);
            else
                Seat.updateMany({}, {$set: {allseats: changedSeats}})
                    .then(()=>res.json(nums))
        })
})

const fillSeats = (seats, row, col_st, col_end) => {
    let nums = [];
    for(var i=col_st; i<col_end; i++){
        seats[row][i] = 1;
        nums.push(row*7+i+1);
    }
    return [seats, nums];
}

const fillRemaining = (seats, row, col_st, col_ed, num) => {
    // console.log(row, col_st, col_ed, num);
    let dist = []
    for(let i=0; i<seats.length; i++){
        for(let j=0; j<seats[i].length; j++){
            if(seats[i][j] === 0){
                // console.log(i,j,i*7+j+1,Math.abs(i-row));
                if(j>=col_st-1 || j<col_ed)
                    dist.push([i*7+j+1,Math.abs(i-row)]);
                else
                    dist.push([i*7+j+1, Math.abs(i-row) + Math.min(Math.abs(j-col_st), Math.abs(j-col_ed))]);
            }
        }
    }
    dist.sort(function(first, second) {
        return first[1] - second[1];
    });
    // console.log('dist is ');
    // console.log(dist);
    let ansNums = dist.slice(0, num+1).map(x=>x[0]);
    // console.log('ansNums is ');
    // console.log(ansNums);
    for(let i=0; i<num; i++)
        seats[Math.floor(ansNums[i]/7)][ansNums[i]%7 - 1] = 1;
    return [seats, ansNums];

}

function getOptimalPositons(num, seats) {
    let maxi = -1, i=0, j=0, total_avai=0;
    let temp_avai;
    let sti, stj, edj;
    while(i<seats.length){
        j=0;
        while(j<seats[i].length){
            temp_avai = 0;
            let k = j;
            while(seats[i][j] === 0 && j<seats[i].length && temp_avai<num){
                temp_avai++;
                total_avai++;
                j++;
            }
            if(temp_avai===num){
                let [ changedSeats, nums ] = fillSeats(seats, i, k, j);
                return [changedSeats, nums];
            }
            else if(temp_avai > maxi){
                maxi = temp_avai;
                sti=i; stj=k; edj = j;
            }
            j++;
        }
        i++;
    }
    if(num>total_avai) {
        return [seats, -1];
    }
    let [ modifiedSeats, nums ] = fillSeats(seats, sti, stj, edj);
    // console.log('nums are ');
    // console.log(nums);
    num -= maxi;
    let [ bookedSeats, remainingNums ] = fillRemaining(modifiedSeats, sti, stj, edj, num);
    // console.log('remaining nums');
    // console.log(remainingNums);
    nums = nums.concat(remainingNums)
    // console.log('nums are ');
    // console.log(nums);
    return [bookedSeats, nums];
}


// router.post('/', (req, res) => {
//         const { name, email } = req.body;
//         const newUser = new User({
//             name: name, email: email
//         })
//         newUser.save()
//             .then(() => res.json({
//                 message: "Created account successfully"
//             }))
//             .catch(err => res.status(400).json({
//                 "error": err,
//                 "message": "Error creating account"
//             }))
//     })
module.exports = router