# Study
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


3. copy not reference

4. prevent from adding swp extension into github

# Bug
1. Data structure of setHoldLessPage have textTrigger key in all item in array of columni
2. Remove all files with swp extension

3. Click button forward and backward

