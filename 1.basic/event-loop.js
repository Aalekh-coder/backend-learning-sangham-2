const fs = require("fs");
const crypto = require("crypto");

console.log("1. script start");

setTimeout(() => {
  console.log("2. settimeout 0s callback (macrotask)");
}, 0);

setTimeout(() => {
  console.log("3. settimout 0s callback (macrotask)");
}, 0);

setImmediate(()=>{
    console.log("4. setImmeditate callback (check)");
})

Promise.resolve().then(()=>{
    console.log("5. primise resolve (microtask)");
})

process.nextTick(()=>{
    console.log("6. processnext tick callback (microtask)");
});

fs.readFile(__filename,()=>{
    console.log("7 file read operations (I/0 callback)");
})

crypto.pbkdf2("secret","salt",10000,64,"sha512",(err,key)=>{
    if(err) throw err

    console.log("8 . pbkdf3 opertation");
})


console.log("9. script end");