// 第五章习题
// 1
// const arrays = [[1, 2, 3], [4, 5], [6]]
// console.log(arrays.reduce((acc, item) => acc.concat(...item), []))
// 2
// function loop (value, testFn, updateFn, fn) {
//   while (testFn(value)) {
//     fn(value)
//     value = updateFn(value)
//   }
// }
// function loop (start, test, update, body) {
//   for (let value = start; test(value); value = update(value)) {
//     body(value)
//   }
// }
// loop(3, n => n > 0, n => n - 1, console.log)
// 3
// function every (arr, fn) {
//   for (const i of arr) {
//     if (!fn(i)) return false
//   }
//   return true
// }
// function every (arr, fn) {
//   return !arr.some(i => !fn(i))
// }
// 4
// function characterScript (code) {
//   for (const script of window.SCRIPTS) {
//     if (script.ranges.some(([from, to]) => {
//       return code >= from && code < to
//     })) {
//       return script
//     }
//   }
//   return null
// }
// function countBy (items, groupName) {
//   const counts = []
//   for (const item of items) {
//     const name = groupName(item)
//     const known = counts.findeIndex(c => c.name == name)
//     if (known == -1) {
//       counts.push({ name, count: 1 })
//     } else {
//       counts[name].count++
//     }
//   }
//   return counts
// }
// function dominantDirection (text) {
//   const counted = countBy(text, char => {
//     const script = characterScript(char.codePointAt(0))
//     return script ? script.direction : 'none'
//   }).filter(({ name }) => name != 'none')

//   if (counted.length == 0) return 'ltr'

//   return counted.reduce((a, b) => a.count > b.count ? a : b).name
// }
// 第四章习题
// 1
// function range (start, end, step = start > end ? -1 : 1) {
//   const arr = []
//   if (step > 0) for (let i = start; i <= end; i += step)arr.push(i)
//   else if (step < 0) for (let i = start; i >= end; i += step)arr.push(i)
//   return arr
// }
// function sum (arr) {
//   let sum = 0
//   for (const i of arr) {
//     sum += i
//   }
//   return sum
// }
// console.log(sum(range(1, 10)))

// 2
// function reverseArray (arr) {
//   console.time(1)
//   const array = []
//   for (const i of arr) {
//     array.unshift(i)
//   }
//   console.timeEnd(1)
//   return array
// }
// function reverseArrayInPlace (arr) {
//   console.time(2)
//   for (let i = 0; i < Math.floor(arr.length / 2); i++) {
//     const old = arr[i]
//     arr[i] = arr[arr.length - 1 - i]
//     arr[arr.length - 1 - i] = old
//   }
//   console.timeEnd(2)
// }
// const arrayValue = [1, 2, 3, 4, 5]
// reverseArrayInPlace(arrayValue)
// reverseArray(arrayValue)
// console.log(arrayValue)
// 3
// function arrayToList (array) {
//   let list = null
//   for (let i = array.length - 1; i >= 0; i--) {
//     list = {
//       value: array[i],
//       rest: list
//     }
//   }
//   return list
// }
// function listToArray (list) {
//   const arr = []
//   // while (list) {
//   //   arr.push(list.value)
//   //   list = list.rest
//   // }
//   for (; list; list = list.rest) arr.push(list.value)
//   return arr
// }
// function prepend (value, list) {
//   return { value, rest: list }
// }
// function nth (list, num) {
//   if (!list) return undefined
//   else if (num === 0) return list.value
//   else return nth(list.rest, num - 1)
// }
// console.log(arrayToList([1, 2, 3]))
// console.log(listToArray(arrayToList([1, 2, 3])))
// console.log(prepend(0, arrayToList([1, 2, 3])))
// console.log(nth(arrayToList([1, 2, 3]), 1))
// 4
// function deepEqual (a, b) {
//   if (a === b) return true
//   if (a == null || typeof a !== 'object' || b == null || typeof b !== 'object') return false
//   const aKeys = Object.keys(a); const bKeys = Object.keys(b)
//   if (aKeys.length !== bKeys.length) return false
//   for (const key in aKeys) {
//     if (!bKeys.includes(key) || !deepEqual(a[key], b[key])) return false
//   }
//   return true
// }
// console.log(deepEqual(null, null))
// 第三章习题
// 1
// function min (num1, num2) {
//   if (num1 > num2) {
//     return num2
//   } else {
//     return num1
//   }
// }
// console.log(min(1, 2))
// 2
// function isEven (num) {
//   if (num === 0) return true
//   else if (num === 1) return false
//   else if (num < 0) return isEven(-num)
//   else return isEven(num - 2)
// }
// console.log(isEven(-1))
// 3
// function countChar (str, char) {
//   let count = 0
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] === char) {
//       count++
//     }
//   }
//   return count
// }
// console.log(countChar('apple', 'p'))
// 第二章习题
// 1
// for (let i = '#'; i.length <= 7; i += '#') {
//   console.log(i)
// }
// 2
// for (let n = 1; n <= 100; n++) {
//   let output = ''
//   if (n % 3 === 0) output += 'Fizz'
//   if (n % 5 === 0) output += 'Buzz'
//   console.log(output || n)
// }
// 3
// const size = 8
// let board = ''
// for (let y = 0; y < size; y++) {
//   for (let x = 0; x < size; x++) {
//     if ((x + y) % 2 === 0) {
//       board += ' '
//     } else {
//       board += '#'
//     }
//   }
//   board += '\n'
// }
// console.log(board)
