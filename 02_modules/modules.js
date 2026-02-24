// // CommonJS (CJS) – The original Node module system

// // ES Modules (ESM) – The official JavaScript standard module system

// // What Are Modules?-----------------------------------------------------------------------

// // A module is simply a file that:

// // Encapsulates code

// // Exports functionality

// // Imports functionality from other files



// // CommonJS (CJS)

// // CommonJS is the original module system in Node.js.

// function fun1(a, b ){
//     return a+b;
// }

// module.exports = fun1; // Exporting the function

// // const fun1 = require('./fun1'); // Importing the function

// // console.log(fun1(2, 3)); // Output: 5


// // How It Works Internally

// // Uses require()

// // Modules are loaded synchronously

// // Uses module.exports

// // Wrapped in a function internally


// // Advantages of CommonJS

// // Simple

// // Mature ecosystem

// // Fully supported in older Node versions

// // Dynamic require possible

// // Limitations

// // Synchronous loading (not ideal for browsers)

// // Not aligned with modern JavaScript standard

// // Harder to tree-shake (dead code elimination)




// //  ES Modules (ESM)

// //  ES Modules are the official ECMAScript standard introduced in ES6.

// // Now fully supported in modern Node.js.


// // // math.js
// // export function add(a, b) {
// //   return a + b;
// // }

// // import { add } from './math.js';
// // console.log(add(2, 3));

// // | Feature         | CommonJS       | ES Modules          |
// // | --------------- | -------------- | ------------------- |
// // | Import          | require()      | import              |
// // | Export          | module.exports | export              |
// // | Loading         | Synchronous    | Asynchronous        |
// // | Standard        | Node-specific  | JavaScript standard |
// // | Tree shaking    | No             | Yes                 |
// // | Static analysis | Hard           | Easy                |


// How to Enable ES Modules in Node.js

// Option 1 – Add in package.json:

// {
//   "type": "module"
// }


// Option 2 – Use .mjs extension


// CommonJS:

// Slightly faster startup in some cases

// Mature caching system

// ES Modules:

// Better optimization in large-scale applications

// Cleaner dependency graph



// Use CommonJS if:

// Maintaining legacy project

// Working in older Node environments

// Use ES Modules if:

// Starting a new project

// Building scalable production backend

// Want future-proof architecture

// Using modern toolchains