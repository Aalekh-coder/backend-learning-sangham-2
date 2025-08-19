const buffOne = Buffer.alloc(10);
// console.log(buffOne);

const buffFromString = Buffer.from("hello");
// console.log(buffFromString);

const buffFromArrayOfIntegers = Buffer.from([1,2,3,4,5]);
console.log(buffFromArrayOfIntegers);

buffOne.write("Node js");
// console.log("after writing node js to bufferone", buffOne.toString());

// console.log(buffFromString[0]);

console.log(buffFromString.slice(0,3));

const concatBuffs = buffer.concat([buffOne,buffFromString]);
console.log(concatBuffs.toJSON());

