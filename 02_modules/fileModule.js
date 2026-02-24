// # 📂 File System Module (`fs`) – Notes

// ## 1️⃣ What is the File System Module?

// The `fs` module allows Node.js applications to interact with the operating system’s file system.

// You can:

// * Create files
// * Read files
// * Update files
// * Delete files
// * Work with directories
// * Stream large files

// ---

// # 2️⃣ Why File System Access Matters

// Backend applications often need to:

// * Store logs
// * Read configuration files
// * Upload and process user files
// * Generate reports
// * Handle large datasets

// Reason:
// Servers frequently interact with disk storage. Efficient file handling is essential for scalability and performance.

// ---

// # 3️⃣ Importing the Module

// ### CommonJS

// ```js
// const fs = require('fs');
// ```

// ### ES Modules

// ```js
// import fs from 'fs';
// ```

// ### Modern (Recommended)

// ```js
// import fs from 'fs/promises';
// ```

// Reason:
// `fs/promises` provides a clean async/await interface and avoids callback complexity.

// ---

// # 4️⃣ Synchronous vs Asynchronous

// ## 🔹 Synchronous (Blocking)

// ```js
// const data = fs.readFileSync('file.txt', 'utf8');
// ```

// Reason:
// Blocks the event loop. Suitable only for startup scripts or CLI tools.

// ---

// ## 🔹 Asynchronous (Non-blocking – Callback Style)

// ```js
// fs.readFile('file.txt', 'utf8', (err, data) => {
//   console.log(data);
// });
// ```

// ---

// ## 🔹 Modern Async/Await Version

// ```js
// import fs from 'fs/promises';

// const data = await fs.readFile('file.txt', 'utf8');
// console.log(data);
// ```

// Reason:
// Non-blocking operations allow Node.js to handle multiple requests efficiently.

// ---

// # 5️⃣ Common File Operations

// ## 📖 Read a File

// ```js
// const data = await fs.readFile('file.txt', 'utf8');
// ```

// ---

// ## ✍️ Write a File

// ```js
// await fs.writeFile('file.txt', 'Hello World');
// ```

// Creates the file if it does not exist.

// ---

// ## ➕ Append to File

// ```js
// await fs.appendFile('file.txt', '\nNew Line');
// ```

// Adds content without overwriting.

// ---

// ## ❌ Delete a File

// ```js
// await fs.unlink('file.txt');
// ```

// ---

// ## 📁 Create Directory

// ```js
// await fs.mkdir('newFolder');
// ```

// ---

// ## 📂 Read Directory

// ```js
// const files = await fs.readdir('.');
// console.log(files);
// ```

// ---

// # 6️⃣ Streams (Handling Large Files)

// Used when working with large files to avoid loading everything into memory.

// ```js
// import fs from 'fs';

// const stream = fs.createReadStream('largefile.txt');

// stream.on('data', chunk => {
//   console.log(chunk.toString());
// });
// ```

// Reason:
// Streams process files in chunks, improving memory efficiency and scalability.

// ---

// # 7️⃣ Error Handling (Important)

// Always handle errors:

// ```js
// try {
//   const data = await fs.readFile('file.txt', 'utf8');
// } catch (error) {
//   console.error('File error:', error.message);
// }
// ```

// Reason:
// Files may not exist, permissions may fail, or disk errors can occur.

