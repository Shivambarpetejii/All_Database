/*

# What Is Node.js?

**Node.js** is a server-side JavaScript runtime built on the **Google Chrome V8 Engine** that allows you to execute JavaScript outside the browser.

It is designed for building **scalable, high-performance network applications**, especially I/O-heavy and real-time systems.

Node.js was created in 2009 by **Ryan Dahl** to solve performance limitations in traditional web servers.

---

## Key Concepts

### Scalable

A system is scalable when it can handle increasing numbers of users or requests without significant performance degradation.

### High-Performance Network Applications

Applications that:

* Handle thousands of concurrent connections
* Minimize latency
* Efficiently process I/O operations
* Use system resources optimally

---

# Traditional Web Server Model (Before Node.js)

Most traditional servers followed a **thread-per-request model**:

* Each incoming request → New thread
* Threads consume memory
* Context switching is expensive
* High concurrency → High overhead

Additionally:

> Web servers spend most of their time waiting on I/O (database, network, filesystem).

This waiting wastes CPU resources in blocking architectures.

---

# The Architecture of Node.js

Node.js has three fundamental pillars:

---

## 1. V8 Engine

Node.js runs on the **Google Chrome V8 Engine**.

It:

* Compiles JavaScript into machine code
* Uses Just-In-Time (JIT) compilation
* Is highly optimized for performance

---

## 2. Event Loop

The Event Loop is the heart of Node.js.

It enables:

* Non-blocking I/O
* Asynchronous execution
* High concurrency using a single thread

Instead of blocking while waiting for I/O, Node.js continues processing other tasks.

---

## 3. libuv

Node.js uses **libuv**, a C library that:

* Manages the event loop
* Handles asynchronous I/O
* Uses a thread pool internally
* Works across operating systems

libuv allows Node.js to interact efficiently with the operating system.

---

# Concurrency Model

Node.js is:

* Single-threaded (JavaScript execution layer)
* Event-driven
* Non-blocking
* Supported by a background thread pool for heavy tasks

---

## Why Single-Threaded?

Because:

* It avoids race conditions
* No complex thread synchronization
* Memory sharing issues are minimized

However:

* CPU-heavy tasks block the event loop
* For CPU-bound workloads, Node.js is not ideal unless using:

  * Worker Threads
  * Clustering

---

# Installation (Linux - Ubuntu/Debian)

```bash
sudo apt update
sudo apt install nodejs npm
```

After installation, verify:

```bash
node -v
npm -v
```

---

# NPM

When you install **Node.js**, you automatically get npm.

## npm = Node Package Manager

It is:

* A package manager
* A dependency installer
* A script runner
* A package registry client

It connects to the official npm registry to install libraries.

---

# NPX

## npx = Node Package Execute

It allows you to run packages without installing them globally.

Example:

```bash
npx create-react-app myapp
```

This executes the package without permanently installing it on your system.

---

# Summary

Node.js is built for:

* High concurrency
* I/O-heavy workloads
* Real-time applications
* Efficient memory usage

Its scalability comes from:

* Event-driven architecture
* Non-blocking I/O
* Lightweight runtime
* OS-level async handling via libuv





*/


