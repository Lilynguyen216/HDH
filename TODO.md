1. Tìm hiểu arrow function và function bình thường
2. Tìm hiểu dấu = ở đây
const obj = {}
var icol = 0
let num = 1
const test = () => {
  if(icol === 0)
    obj[`col${icol}`] = []
  else
    //BUG
    obj[`col${icol}`] = obj[`col${icol - 1}`] // copy the array from the previous index
  obj[`col${icol}`].push(num++)
  icol++;
}
test()
test()
for(const key in obj)
console.log(key, obj[key])
3. BUG replacedPage 


const posRowArr = {
    row1: [{posX: 100, posY: 100}, {posX: 150, posY: 100}]
}
const setReplacedPageFalse = arrItemObj => {
  for (let i = 0; i < this.iMaxFrames; i++) {
    arrItemObj[i].replacedPage = false;
  }
};

const obj = {};
var icol = 0;
let num = 1;
const test = () => {
  if (icol === 0) obj[`col${icol}`] = [];
  //BUG
  else obj[`col${icol}`] = [...obj[`col${icol - 1}`]]; // copy the array from the previous index
  obj[`col${icol}`].push({pageRepaced: false});
  icol++;
};
test();
test();
for (const key in obj) console.log(key, obj[key]);

copy in js not reference 

const obj[i] = [...obj[i - 1]] if item in that array is complex it still a referece



