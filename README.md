# Complete Database Notes 

---

## 📚 Table of Contents

| Level | Topics |
|-------|--------|
| [Level 1](#-level-1--foundations-0-2-years) | Fundamentals, Tables, Keys, SQL Basics, JOINs |
| [Level 2](#-level-2--intermediate-2-4-years) | Indexing, Constraints, Normalization |
| [Level 3](#-level-3--advanced-4-6-years) | Transactions, ACID, Isolation Levels |
| [Level 4](#-level-4--senior-level-6-years) | Internals, B-Tree, Locking, Deadlock |
| [Level 5](#-level-5--postgresql-advanced) | MVCC, VACUUM, WAL, Checkpoints |
| [Level 6](#-level-6--mysql-advanced) | InnoDB, MyISAM, Redo/Undo Logs |
| [Level 7](#-level-7--mongodb--nosql) | NoSQL, MongoDB, Sharding, Replica Sets |
| [Level 8](#-level-8--performance-optimization) | Slow Queries, EXPLAIN, Optimization |
| [Level 9](#-level-9--architecture--scaling) | Replication, Sharding, Scaling |
| [Level 10](#-level-10--real-production-scenarios) | Millions of users, Crash recovery |
| [Level 11](#-level-11--tricky--faang-questions) | FAANG-level tricky questions |
| [Level 12](#-level-12--scenario-based-questions) | Real-world scenarios |
| [Level 13-15](#-level-13-15--sqlite-sql-server-mariadb) | SQLite, SQL Server, MariaDB |
| [Level 16-18](#-level-16-18--expert--architect) | Expert, Coding, CAP Theorem |

---

## 🟢 Level 1 — Foundations 

---

### 📌 What is a Database?

A **database** is an organized system for storing, managing, and retrieving data **persistently** — meaning data survives even after the application crashes or restarts.

Think of it like this:
- Your **application** (Node.js, NestJS, etc.) handles the business logic.
- Your **database** is the long-term memory — the single source of truth.

**Real-world example:**
When a user signs up on your app, the backend processes the request, but the user's name, email, and password are stored permanently in the database. Even if the server restarts 100 times, that data is still there.

**Key guarantees a database provides:**

| Guarantee | What it means |
|-----------|---------------|
| **Durability** | Data is not lost after a crash |
| **Consistency** | Data follows defined rules at all times |
| **Concurrency Control** | Multiple users can access data safely at the same time |
| **Transactions** | A group of operations either all succeed or all fail together |

> 🏭 **Production systems** use databases like PostgreSQL (strong consistency, transactions) or MongoDB (flexibility, horizontal scaling) depending on what the system needs.

---

### 📌 What is a DBMS?

**DBMS (Database Management System)** is the software layer between your application and the raw data stored on disk.

- The **database** = the organized data (tables, documents, key-value pairs)
- The **DBMS** = the intelligent engine that manages, protects, and serves that data

Without a DBMS, you'd have to manually write code to handle file storage, indexing, locking, crash recovery, and concurrent access — essentially writing your own database from scratch.

**What a real DBMS handles in production:**

| Responsibility | Examples |
|----------------|----------|
| Data Definition (DDL) | `CREATE TABLE`, `ALTER TABLE`, migrations |
| Data Manipulation (DML) | `INSERT`, `UPDATE`, `DELETE`, `SELECT` |
| Concurrency Control | Transactions, isolation levels, MVCC |
| Data Integrity | Primary keys, foreign keys, constraints |
| Durability & Recovery | Write-Ahead Logging (WAL), crash recovery, backups |
| Security | Authentication, authorization, encryption |
| Performance | Indexing, query planning, partitioning |

> 💡 In production, you don't just *use* a database. You *operate* a DBMS — you tune it, monitor it, scale it, and maintain it.

---

### 📌 What is an RDBMS?

**RDBMS (Relational Database Management System)** is a specific type of DBMS that:
- Stores data in **tables** (rows and columns)
- Supports **relationships** between tables using primary and foreign keys
- Enforces **ACID** transactions
- Supports **normalization** and **SQL**

**Popular RDBMS systems:**
- PostgreSQL
- MySQL
- Microsoft SQL Server
- Oracle
- MariaDB

**DBMS vs RDBMS comparison:**

| Feature | DBMS | RDBMS |
|---------|------|-------|
| Data Storage | Files or simple structures | Structured tables |
| Relationships | ❌ Not supported | ✅ Supported via foreign keys |
| Normalization | ❌ Limited | ✅ Fully supported |
| ACID Transactions | ❌ Limited | ✅ Fully supported |
| Data Consistency | Weaker | Stronger |
| Examples | File systems, simple stores | PostgreSQL, MySQL, SQL Server |

> **One-liner:** RDBMS is an advanced version of DBMS with table-based structure and relationship support.

---

### 📌 Database Building Blocks

#### 🔷 Table
A **table** is a structured collection of data organized into rows and columns. Each table represents one entity or concept (e.g., `users`, `orders`, `products`).

```
users table:
+----+----------+---------------------+
| id | name     | email               |
+----+----------+---------------------+
| 1  | Alice    | alice@example.com   |
| 2  | Bob      | bob@example.com     |
+----+----------+---------------------+
```

#### 🔷 Row (Record)
A **row** is a single, complete entry in a table. Each row holds values for every column.

#### 🔷 Column (Field/Attribute)
A **column** defines a specific type of data stored. Every value in a column must match that column's data type.

---

### 📌 Keys

#### 🔑 Primary Key
A **primary key** uniquely identifies each row in a table.

**Rules:**
- Must be **UNIQUE** — no two rows can have the same value
- Cannot be **NULL** — must always have a value
- Only **ONE** primary key per table
- Usually auto-incremented (e.g., `id SERIAL PRIMARY KEY`)

**Why it matters in production:**
- Used for fast lookups
- Used to create relationships between tables
- Database automatically creates an index on the primary key

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);
```

---

#### 🔑 Foreign Key
A **foreign key** is a column that references the primary key of another table, establishing a relationship between the two.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),  -- foreign key
    amount DECIMAL
);
```

**Foreign keys enforce:**
- **Referential integrity** — you can't have an order referencing a non-existent user
- **Data consistency** — deleting a user can be controlled (CASCADE, RESTRICT, SET NULL)

---

#### 🔑 Unique Key
Ensures all values in a column are different (no duplicates). Unlike primary keys:

| Feature | Primary Key | Unique Key |
|---------|-------------|------------|
| Number allowed | Only ONE per table | Multiple allowed |
| NULL values | ❌ Not allowed | ✅ Allowed (usually one NULL) |
| Purpose | Identify rows | Prevent duplicates |

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE  -- unique key
);
```

---

#### 🔑 Candidate Key
Any column (or set of columns) that **could** serve as a primary key — it uniquely identifies rows and has no NULLs.

A table can have multiple candidate keys. The one you choose becomes the primary key; the rest become **alternate keys**.

**Example:** In a `users` table, both `id` and `email` could uniquely identify a user — both are candidate keys.

---

#### 🔑 Composite Key
A **primary key made up of two or more columns** combined. Used when no single column can uniquely identify a row.

```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)  -- composite key
);
```

---

#### 🔑 Super Key
A **super key** is any combination of columns that can uniquely identify rows — including combinations with "extra" columns that aren't strictly necessary.

**Hierarchy:**
```
Super Key ⊇ Candidate Key ⊇ Primary Key
```

> Every candidate key is a super key, but not every super key is a candidate key.

---

### 📌 SQL — Structured Query Language

**SQL** is the standard language used to communicate with relational databases. It is used to store, retrieve, modify, and manage data.

> **Simple way to remember:** SQL is the language you use to talk to the database.

---

### 📌 Types of SQL Commands

#### 📂 DDL — Data Definition Language
Used to **define and modify the structure** of the database.

| Command | Purpose |
|---------|---------|
| `CREATE` | Create a new table, index, or database |
| `ALTER` | Modify an existing table structure |
| `DROP` | Delete a table (structure + all data, permanently) |
| `TRUNCATE` | Delete all data from a table (keeps structure) |

> ⚠️ `DROP` removes everything permanently. `TRUNCATE` keeps the table but empties it. Both cannot be rolled back easily.

#### 📂 DML — Data Manipulation Language
Used to **work with the data** inside tables.

| Command | Purpose |
|---------|---------|
| `INSERT` | Add new rows |
| `UPDATE` | Modify existing rows |
| `DELETE` | Remove specific rows |
| `SELECT` | Retrieve data |

#### 📂 DCL — Data Control Language
Used to **control access and permissions**.

| Command | Purpose |
|---------|---------|
| `GRANT` | Give a user permission |
| `REVOKE` | Remove a user's permission |

#### 📂 TCL — Transaction Control Language
Used to **manage transactions**.

| Command | Purpose |
|---------|---------|
| `BEGIN` | Start a transaction |
| `COMMIT` | Save all changes permanently |
| `ROLLBACK` | Undo all changes since BEGIN |
| `SAVEPOINT` | Create a checkpoint within a transaction |

---

### 📌 Commonly Confused Commands

#### DELETE vs TRUNCATE vs DROP

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| Removes | Specific rows | All rows | Entire table |
| Structure kept? | ✅ Yes | ✅ Yes | ❌ No |
| Rollback possible? | ✅ Yes | ❌ Usually No | ❌ No |
| WHERE clause | ✅ Supported | ❌ Not supported | ❌ Not applicable |
| Triggers fired? | ✅ Yes | ❌ No | ❌ No |
| Speed | Slower (logs each row) | Faster | Fastest |

---

#### WHERE vs HAVING

| Feature | WHERE | HAVING |
|---------|-------|--------|
| When it filters | Before grouping | After grouping |
| Works with | Individual rows | Groups / aggregated results |
| Used with | Any query | Must be used with `GROUP BY` |

```sql
-- WHERE filters rows before grouping
SELECT department, COUNT(*) 
FROM employees 
WHERE salary > 50000        -- filter rows first
GROUP BY department;

-- HAVING filters after grouping
SELECT department, COUNT(*) 
FROM employees 
GROUP BY department
HAVING COUNT(*) > 10;       -- filter groups
```

---

#### GROUP BY vs ORDER BY

| Feature | GROUP BY | ORDER BY |
|---------|----------|----------|
| Purpose | Group rows with same values together | Sort results |
| Used with | Aggregate functions (COUNT, SUM, AVG) | Any column |
| Position in query | Before HAVING | Last clause |

```sql
SELECT city, COUNT(*) as total
FROM users
GROUP BY city        -- groups by city
ORDER BY total DESC; -- sorts by count
```

---

### 📌 JOINs

A **JOIN** combines rows from two or more tables based on a related column.

#### 🔗 INNER JOIN
Returns only the rows where there is a **match in both tables**.

```sql
SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```
> Think: "Give me users who HAVE orders."

---

#### 🔗 LEFT JOIN (LEFT OUTER JOIN)
Returns **all rows from the left table**, plus matched rows from the right table. If no match, right side shows NULL.

```sql
SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```
> Think: "Give me ALL users, and their orders if they have any."

---

#### 🔗 RIGHT JOIN (RIGHT OUTER JOIN)
Returns **all rows from the right table**, plus matched rows from the left table. If no match, left side shows NULL.

```sql
SELECT users.name, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

---

#### 🔗 FULL JOIN (FULL OUTER JOIN)
Returns **all rows from both tables**. Shows NULL where there's no match on either side.

```sql
SELECT users.name, orders.amount
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
```

---

#### 🔗 CROSS JOIN
Returns the **Cartesian product** — every row from table A combined with every row from table B.

```sql
SELECT users.name, products.name
FROM users
CROSS JOIN products;
```
> ⚠️ If users has 100 rows and products has 50 rows → result has 5,000 rows. Use carefully!

---

#### 🔗 SELF JOIN
A table joined **with itself**. Useful for hierarchical data (e.g., employees and their managers).

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id;
```

---

## 🟡 Level 2 — Intermediate (2-4 Years)

---

### 📌 Indexing

#### What is an Index?
An **index** is a separate data structure that the database maintains to speed up data retrieval.

**Without index:** Database scans every row one by one — O(n) time — very slow for large tables.

**With index:** Database uses the index to jump directly to matching rows — O(log n) time — very fast.

> 📖 Think of it like a book's index. Instead of reading every page to find "PostgreSQL", you look it up in the index and jump straight to page 47.

---

#### How Index Works Internally

Most databases use a **B-Tree (Balanced Tree)** structure for indexes. Data is stored in sorted order and the tree is balanced, meaning:
- Search takes `O(log n)` time regardless of table size
- For 1 million rows: only ~20 comparisons needed

```
Without index: Scan all 1,000,000 rows → slow
With B-Tree index: ~20 page reads to find exact row → fast
```

---

#### Types of Indexes

| Type | Description | Example |
|------|-------------|---------|
| **Primary Index** | Auto-created on Primary Key | Created with `PRIMARY KEY` |
| **Unique Index** | Prevents duplicates | `CREATE UNIQUE INDEX idx_email ON users(email)` |
| **Single Column Index** | Index on one column | `CREATE INDEX idx_name ON users(name)` |
| **Composite Index** | Index on multiple columns | `CREATE INDEX idx_name_email ON users(name, email)` |
| **Full-Text Index** | For text search | Used in search engines |
| **Partial Index** | Index on a subset of rows | `CREATE INDEX ON users(email) WHERE active = true` |

---

#### Composite Index — Column Order Matters!
```sql
CREATE INDEX idx_city_age ON users(city, age);

-- ✅ This query USES the index (city is the leading column)
SELECT * FROM users WHERE city = 'Delhi' AND age = 25;

-- ✅ This also uses the index (partial match on leading column)
SELECT * FROM users WHERE city = 'Delhi';

-- ❌ This does NOT use the index (skips leading column)
SELECT * FROM users WHERE age = 25;
```
> **Rule:** Composite index works only if you query starting from the **leftmost column**.

---

#### Advantages vs Disadvantages of Indexes

| Advantages ✅ | Disadvantages ❌ |
|--------------|----------------|
| Faster SELECT queries | Uses extra disk storage |
| Faster sorting (ORDER BY) | Slows down INSERT, UPDATE, DELETE (index must be updated) |
| Faster joins | Needs periodic maintenance |
| Better overall read performance | Too many indexes = overhead |

---

#### Clustered vs Non-Clustered Index

| Feature | Clustered Index | Non-Clustered Index |
|---------|-----------------|---------------------|
| Data storage | Rows physically stored in index order | Separate structure; points to actual rows |
| Number allowed | Only ONE per table | Multiple allowed |
| Speed | Fastest for range queries | Slightly slower (extra pointer lookup) |
| Example | Primary Key in InnoDB | Any additional `CREATE INDEX` |

> 💡 In MySQL InnoDB, the primary key IS the clustered index — the entire table is stored sorted by primary key.

---

### 📌 Constraints

Constraints are rules applied to columns to ensure data quality and integrity.

#### NOT NULL
Ensures a column **must always have a value** — it cannot be empty/missing.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,  -- name is required
    bio TEXT                     -- bio is optional
);
```

> 🔹 **What is NULL?** NULL means "no value" / "unknown". It is NOT the same as `0`, `''` (empty string), or `false`.

---

#### UNIQUE
Ensures all values in a column are **different from each other**.

```sql
CREATE TABLE users (
    email VARCHAR(255) UNIQUE  -- no two users can have the same email
);
```

---

#### DEFAULT
Provides an **automatic value** if none is specified during INSERT.

```sql
CREATE TABLE orders (
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### CHECK
Ensures values **satisfy a specific condition**.

```sql
CREATE TABLE products (
    price DECIMAL CHECK (price > 0),  -- price must be positive
    age INT CHECK (age >= 18)         -- must be adult
);
```

---

### 📌 Normalization

#### What is Normalization?
**Normalization** is the process of organizing database tables to:
- **Reduce redundancy** (no duplicate data)
- **Improve data integrity** (no anomalies during INSERT/UPDATE/DELETE)
- **Ensure logical data storage**

> 📖 **Simple analogy:** Instead of writing someone's full address on every order receipt, you store their address once and just reference it. That's normalization.

---

#### Why Normalization Matters
Without normalization:
```
orders table (BAD - denormalized):
+----+----------+---------------------+----------+-------+
| id | user_name| user_email          | product  | price |
+----+----------+---------------------+----------+-------+
| 1  | Alice    | alice@example.com   | Laptop   | 999   |
| 2  | Alice    | alice@example.com   | Mouse    | 29    |
```
Problem: Alice's email is repeated. If she changes email, you must update EVERY row.

---

#### Normal Forms

##### 1NF — First Normal Form
**Rule:** Each column must contain **atomic (indivisible) values** — no lists or multiple values in one cell.

❌ **Violates 1NF:**
```
| id | name  | phones              |
| 1  | Alice | 9876543210, 1234567 |  ← two values in one cell
```

✅ **Satisfies 1NF:**
```
| id | name  | phone      |
| 1  | Alice | 9876543210 |
| 2  | Alice | 1234567    |
```

---

##### 2NF — Second Normal Form
**Rules:**
1. Must be in 1NF
2. **No partial dependency** — every non-key column must depend on the ENTIRE primary key (not just part of it)

> Applies only when you have a **composite primary key**.

❌ **Violates 2NF:**
```
order_items table — PK is (order_id, product_id)

| order_id | product_id | product_name | quantity |
|----------|------------|--------------|----------|
| 1        | 101        | Laptop       | 2        |

product_name depends only on product_id — not the full PK!
```

✅ **Fix:**
- Separate `products` table: `(product_id, product_name)`
- Keep `order_items` table: `(order_id, product_id, quantity)`

---

##### 3NF — Third Normal Form
**Rules:**
1. Must be in 2NF
2. **No transitive dependency** — non-key columns must NOT depend on other non-key columns

❌ **Violates 3NF:**
```
| student_id | zip_code | city   |
|------------|----------|--------|
| 1          | 110001   | Delhi  |

city depends on zip_code, not student_id (transitive dependency)
```

✅ **Fix:**
- `zip_codes` table: `(zip_code, city)`
- `students` table: `(student_id, zip_code)`

---

##### BCNF — Boyce-Codd Normal Form
**Rule:** A stricter version of 3NF. For every functional dependency `A → B`, `A` must be a **super key**.

> BCNF fixes rare edge cases that 3NF misses when there are multiple overlapping candidate keys.

---

#### What is Denormalization?
**Denormalization** is intentionally adding redundancy back into a normalized database to **improve read performance**.

> You break normalization rules on purpose because query speed is more important than storage efficiency.

**When to use denormalization:**
- Read-heavy systems (analytics, dashboards, reporting)
- When JOINs across many tables are too slow
- When you need sub-millisecond response times

```sql
-- Instead of joining 3 tables every time:
SELECT u.name, SUM(o.amount) 
FROM users u JOIN orders o ON u.id = o.user_id 
GROUP BY u.id;

-- Store the total directly in users table (denormalized):
UPDATE users SET total_spent = (SELECT SUM(amount) FROM orders WHERE user_id = users.id);
```

> ⚠️ Trade-off: Faster reads, but data can become inconsistent and updates are more complex.

---

## 🔴 Level 3 — Advanced (4-6 Years)

---

### 📌 Transactions

#### What is a Transaction?
A **transaction** is a sequence of one or more database operations executed as a **single logical unit of work**.

**The golden rule:** Either **ALL operations succeed** (COMMIT) or **ALL operations fail** (ROLLBACK). There is NO partial execution.

**Real-world scenario — Bank Transfer:**
```
Transfer ₹100 from Account A → Account B

Step 1: Deduct ₹100 from Account A
Step 2: Add ₹100 to Account B

If Step 1 succeeds but Step 2 fails → ₹100 disappears! ❌
Transaction prevents this.
```

```sql
BEGIN;  -- start transaction

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;  -- save both changes permanently

-- If anything goes wrong:
ROLLBACK;  -- undo everything, back to original state
```

---

#### Transaction Commands

| Command | Purpose |
|---------|---------|
| `BEGIN` / `START TRANSACTION` | Starts a new transaction |
| `COMMIT` | Saves all changes permanently |
| `ROLLBACK` | Undoes all changes since BEGIN |
| `SAVEPOINT name` | Creates a named checkpoint within the transaction |
| `ROLLBACK TO name` | Rolls back only to the named savepoint |

---

#### What is SAVEPOINT?
A **SAVEPOINT** allows you to partially undo a transaction — rolling back only to a specific point instead of the entire transaction.

```sql
BEGIN;

INSERT INTO orders VALUES (1, 100);

SAVEPOINT after_first_order;  -- checkpoint

INSERT INTO orders VALUES (2, 200);

-- Oops, second insert had an error
ROLLBACK TO after_first_order;  -- only undo the second insert

COMMIT;  -- first insert is saved
```

---

### 📌 ACID Properties

ACID is a set of four properties that guarantee database transactions are processed reliably.

---

#### ⚛️ A — Atomicity
**"All or nothing."**

A transaction is treated as a single unit. Either all operations complete successfully, or none of them do. The database uses **transaction logs** and **undo logs** to achieve this.

```
❌ Without Atomicity:
Transfer: Deduct ₹100 from A ✅, Add ₹100 to B ❌ → Money lost!

✅ With Atomicity:
Transfer either fully completes or fully rolls back. No partial state.
```

---

#### ✅ C — Consistency
**"Database moves from one valid state to another valid state."**

Every transaction must take the database from one consistent state to another. Business rules (constraints, triggers) are never violated.

**Enforced by:**
- `PRIMARY KEY` constraints
- `FOREIGN KEY` constraints
- `UNIQUE` constraints
- `CHECK` constraints
- `NOT NULL` constraints

---

#### 🔒 I — Isolation
**"Transactions don't interfere with each other."**

When multiple transactions run simultaneously, each one appears to run in isolation — as if it's the only transaction running. This prevents one transaction from seeing another's incomplete work.

> Isolation level (how strict this is) can be configured. See [Isolation Levels](#-isolation-levels) below.

---

#### 💾 D — Durability
**"Once committed, data is permanent."**

After a transaction is committed, data is saved permanently — even if the server crashes, loses power, or reboots immediately after.

**How it's achieved:**
- **Write-Ahead Logging (WAL)** — changes written to log before being applied to actual data
- **Checkpoints** — periodic flushing of data from memory to disk

---

### 📌 Isolation Levels

#### Why Do Isolation Levels Exist?
In production, hundreds of transactions run simultaneously. Without proper isolation, one transaction can interfere with another and cause data corruption.

Isolation levels let you **trade off between consistency and performance** — stricter isolation = safer but slower.

---

#### The 4 Problems Isolation Prevents

##### 1. Dirty Read
Reading data that another transaction has modified but NOT yet committed.

```
Transaction A: UPDATE balance = 0  -- not committed yet
Transaction B: SELECT balance      -- sees 0 (dirty read!)
Transaction A: ROLLBACK            -- oops, it rolled back
Transaction B: operated on wrong data ❌
```

##### 2. Non-Repeatable Read
Reading the same row twice within a transaction gets **different results** because another transaction modified it in between.

```
Transaction A: SELECT balance → 100
Transaction B: UPDATE balance = 200; COMMIT;
Transaction A: SELECT balance → 200  ← changed! Non-repeatable read ❌
```

##### 3. Phantom Read
A query returns **different rows** when executed twice within the same transaction because another transaction inserted/deleted rows.

```
Transaction A: SELECT * FROM users WHERE city='Delhi' → 5 rows
Transaction B: INSERT INTO users (city='Delhi'); COMMIT;
Transaction A: SELECT * FROM users WHERE city='Delhi' → 6 rows ← phantom! ❌
```

##### 4. Lost Update
Two transactions read a value, both modify it, and one overwrites the other's change.

```
Initial: balance = 1000

Transaction A reads: 1000, computes: 900
Transaction B reads: 1000, computes: 800
Transaction A writes: 900
Transaction B writes: 800  ← A's update is lost! ❌
Correct should be: 700
```

---

#### The 4 Isolation Levels

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|----------------|-----------|---------------------|--------------|
| Read Uncommitted | ✅ Possible | ✅ Possible | ✅ Possible |
| Read Committed | ❌ Prevented | ✅ Possible | ✅ Possible |
| Repeatable Read | ❌ Prevented | ❌ Prevented | ✅ Possible* |
| Serializable | ❌ Prevented | ❌ Prevented | ❌ Prevented |

*PostgreSQL's Repeatable Read also prevents phantom reads via MVCC.

---

##### 1. Read Uncommitted (Lowest Safety)
- Can read dirty (uncommitted) data
- Highest performance, lowest safety
- **Almost never used in production**

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```

##### 2. Read Committed (Default for Most DBs)
- Can only read committed data — no dirty reads
- But the same row can look different if re-read after another transaction commits
- **Default in PostgreSQL and Oracle**

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```
> ✅ Use case: Bank app showing latest committed balance, e-commerce reads

##### 3. Repeatable Read
- Snapshot is taken at start of transaction — data won't change even if others commit
- Same row always returns same value within the transaction
- **Default in MySQL (InnoDB)**

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```
> ✅ Use case: Financial reports, inventory systems where data must be consistent throughout

##### 4. Serializable (Highest Safety)
- Transactions appear to execute one at a time, sequentially
- No concurrency problems at all
- But it's the slowest — uses range locks or predicate locks

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```
> ✅ Use case: Banking transfers, critical financial operations

---

**Production Usage Guide:**

| System Type | Recommended Level |
|-------------|-------------------|
| Banking / Finance | Serializable or Repeatable Read |
| E-commerce | Read Committed |
| Analytics / Reporting | Read Committed |
| Activity/Audit Logging | Read Uncommitted |

---

## ⚫ Level 4 — Senior Level (6+ Years)

---

### 📌 Database Internals

#### How Does a Database Store Data Internally?

At the lowest level, databases store data in **pages** (also called blocks):

- A **page** is a fixed-size chunk of data on disk (usually **8 KB** in PostgreSQL, **16 KB** in MySQL)
- All reads and writes to disk happen at the **page level** — even if you only need one row
- Related pages are grouped into **extents**

```
Disk
 └── File
      └── Extents (group of pages)
           └── Pages (8KB each)
                └── Row data, index entries, metadata
```

---

#### What is a Buffer Pool?
The **buffer pool** is the database's main memory cache — it holds recently accessed pages in RAM to avoid slow disk reads.

| Database | Name for Buffer Pool |
|----------|---------------------|
| MySQL (InnoDB) | InnoDB Buffer Pool |
| PostgreSQL | Shared Buffers |

**How it works:**
1. Query arrives → database checks buffer pool first
2. If page is in RAM (cache hit) → returns immediately ⚡
3. If page is NOT in RAM (cache miss) → reads from disk 🐢 then caches it

> 💡 Tuning buffer pool size is one of the most impactful database performance optimizations.

---

#### What is a Query Optimizer / Query Planner?

The **query optimizer** (also called query planner) is the database component that figures out the **most efficient way to execute your SQL query**.

When you write:
```sql
SELECT * FROM users WHERE city = 'Delhi' ORDER BY name;
```

The optimizer decides:
- Should it use an index? Which one?
- In what order should it scan tables?
- Which join algorithm should it use?
- Should it sort in memory or on disk?

The optimizer generates an **execution plan** and picks the cheapest one (measured in estimated cost/time).

```sql
-- See the execution plan:
EXPLAIN SELECT * FROM users WHERE city = 'Delhi';
EXPLAIN ANALYZE SELECT * FROM users WHERE city = 'Delhi';  -- actually runs it
```

---

### 📌 B-Tree Index Internals

#### What is a B-Tree?
**B-Tree (Balanced Tree)** is a self-balancing tree data structure used by databases to store indexes.

**Properties:**
- Always balanced — all leaf nodes at the same depth
- Data stored in sorted order
- Each node contains multiple keys (reducing tree height)
- Supports fast search, insert, delete — all O(log n)

```
          [30 | 70]
         /    |    \
    [10|20] [40|60] [80|90]
```

**Why not Binary Search Tree (BST)?**
- BST becomes unbalanced → degrades to O(n) in worst case
- BST nodes hold only 1 key → very tall tree → many disk reads
- B-Tree nodes hold many keys → short, wide tree → few disk reads

**Why not Hash Index?**
- Hash is O(1) for exact match but can't do range queries (`WHERE age > 25`)
- B-Tree supports range queries, sorting, and prefix matching

> **One-liner:** B-Tree minimizes disk reads by keeping the tree short and wide.

---

#### How Index Search Works Internally

```
Query: SELECT * FROM users WHERE id = 47

1. Start at B-Tree root node
2. Compare 47 with keys in root → go to correct child
3. Traverse down levels
4. Reach leaf node → find row pointer
5. Follow pointer to actual data page
6. Return row

Total disk reads: ~3-4 (regardless of table having 1M rows)
```

---

### 📌 Locking

#### What is a Lock?
A **lock** is a mechanism the database uses to control concurrent access to data, preventing multiple transactions from corrupting data when they access the same rows simultaneously.

**Without locks:** The Lost Update problem occurs (see above) — two transactions overwrite each other.

---

#### Types of Locks by Level

| Lock Level | Scope | Granularity | Concurrency |
|------------|-------|-------------|-------------|
| Row-level Lock | Individual row | Most granular | Highest |
| Page-level Lock | Group of rows (a page) | Medium | Medium |
| Table-level Lock | Entire table | Least granular | Lowest |
| Database-level Lock | Entire database | Coarsest | None |

---

#### Row-Level Lock
Locks only a **specific row**, leaving all other rows accessible.

```sql
-- This locks only the row where id=5
UPDATE users SET name = 'Ram' WHERE id = 5;
```

Used in: **PostgreSQL, MySQL (InnoDB), SQL Server**
- Highest concurrency
- Best for OLTP (Online Transaction Processing)

---

#### Table-Level Lock
Locks the **entire table** — nobody else can read or write while the lock is held.

```sql
LOCK TABLE users;  -- everyone else must wait
```

Used in: **MySQL (MyISAM engine)**
- Very low concurrency
- Used for bulk operations, admin tasks

---

#### Shared Lock (S Lock) vs Exclusive Lock (X Lock)

| Feature | Shared Lock (S) | Exclusive Lock (X) |
|---------|-----------------|-------------------|
| Operation | READ | WRITE |
| Others can read? | ✅ Yes | ❌ No |
| Others can write? | ❌ No | ❌ No |
| Multiple allowed? | ✅ Yes (many readers) | ❌ No (only one writer) |

```
Multiple SELECT queries → multiple shared locks → all allowed ✅
UPDATE + SELECT at same time → exclusive + shared conflict → second must wait ⏳
Two UPDATE at same time → exclusive + exclusive conflict → second must wait ⏳
```

---

### 📌 Deadlock

#### What is a Deadlock?
A **deadlock** occurs when two or more transactions are each waiting for the other to release a lock — creating a circular dependency where none can proceed.

**Classic deadlock scenario:**

```
Transaction A:
  1. Locks Row 1 (Account A)
  2. Waits for Row 2 (Account B) — locked by B

Transaction B:
  1. Locks Row 2 (Account B)
  2. Waits for Row 1 (Account A) — locked by A

Both are waiting. Neither can proceed. Deadlock! 🔒🔒
```

---

#### How Database Resolves Deadlock
The database **automatically detects** deadlocks using a "wait-for graph":
1. DB continuously monitors which transactions are waiting for which locks
2. Detects a cycle in the wait graph
3. Selects a **victim** transaction (usually the youngest or least costly one)
4. **Kills/rolls back** the victim transaction
5. Returns an error to the victim's client
6. The other transaction(s) can now proceed

```
Deadlock detected → DB rolls back Transaction A → Transaction B completes → Application retries A
```

---

#### How to Prevent Deadlocks in Application Code

1. **Always access resources in the same order** across all transactions
2. **Keep transactions short** — minimize lock hold time
3. **Use lower isolation levels** where appropriate
4. **Retry logic** — when deadlock error occurs, retry the transaction
5. **Lock multiple rows at once** using `SELECT ... FOR UPDATE` instead of one by one

```javascript
// Application-level deadlock retry pattern:
async function transferWithRetry(fromId, toId, amount, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await db.transaction(async (trx) => {
        await trx.raw(`UPDATE accounts SET balance = balance - ? WHERE id = ?`, [amount, fromId]);
        await trx.raw(`UPDATE accounts SET balance = balance + ? WHERE id = ?`, [amount, toId]);
      });
      return; // success
    } catch (err) {
      if (err.code === 'DEADLOCK' && attempt < maxRetries - 1) continue;
      throw err;
    }
  }
}
```

---

## 🐘 Level 5 — PostgreSQL Advanced

---

### 📌 MVCC (Multi-Version Concurrency Control)

#### What is MVCC?
**MVCC (Multi-Version Concurrency Control)** is a technique that allows multiple transactions to read and write the same data simultaneously **without blocking each other**, by keeping multiple versions of each row.

> MVCC is the reason PostgreSQL is so fast for concurrent workloads — readers never block writers, and writers never block readers.

---

#### How MVCC Works Internally

PostgreSQL does **NOT update rows in place**. Instead:

1. When you UPDATE a row, PostgreSQL **creates a new version** of that row
2. The old version is kept for other transactions that still need to see it
3. Each row has hidden system columns:
   - `xmin` — the transaction ID that created this row version
   - `xmax` — the transaction ID that deleted/updated this row version

```
Before UPDATE:
Row: { id: 1, name: "Alice", xmin: 100, xmax: null }  ← visible to all

After UPDATE name to "Alicia":
Row: { id: 1, name: "Alice",  xmin: 100, xmax: 200 }  ← dead (marked deleted)
Row: { id: 1, name: "Alicia", xmin: 200, xmax: null }  ← new version

Transaction 150 (started before 200): still sees "Alice"
Transaction 300 (started after 200 commits): sees "Alicia"
```

**Benefits of MVCC:**
- ✅ Readers never block writers
- ✅ Writers never block readers
- ✅ Each transaction sees a consistent snapshot
- ✅ High concurrency without excessive locking

---

### 📌 VACUUM

#### What is VACUUM?
**VACUUM** is a PostgreSQL maintenance process that **cleans up dead row versions** left behind by MVCC.

Because every UPDATE and DELETE creates dead rows (old versions), over time the table fills with "dead tuples" — wasted space that slows queries.

VACUUM:
- Removes dead rows (reclaims space logically)
- Updates statistics for the query planner
- Prevents **transaction ID wraparound** (a critical issue in old PostgreSQL)

```sql
-- Manual vacuum:
VACUUM users;           -- basic vacuum
VACUUM ANALYZE users;   -- vacuum + update statistics
VACUUM FULL users;      -- reclaims disk space (locks table!)
```

> ⚠️ `VACUUM FULL` rewrites the entire table and requires an exclusive lock. Use only during maintenance windows.

---

### 📌 Autovacuum

**Autovacuum** is a background process in PostgreSQL that automatically runs VACUUM (and ANALYZE) on tables that need it.

**Why it's critical:**
- Without autovacuum: dead rows accumulate → disk fills up → queries slow down → eventually the database can crash due to transaction ID wraparound
- With autovacuum: tables stay clean automatically

**Key autovacuum settings:**
```sql
-- Check autovacuum settings:
SHOW autovacuum;
SHOW autovacuum_vacuum_threshold;     -- minimum dead rows before vacuum
SHOW autovacuum_vacuum_scale_factor;  -- % of table that must be dead rows
```

> 💡 Monitoring autovacuum in production is essential. Check `pg_stat_user_tables` for bloat.

---

### 📌 WAL (Write-Ahead Log)

#### What is WAL?
**WAL (Write-Ahead Logging)** is PostgreSQL's mechanism for ensuring **durability** (the D in ACID).

**The rule:** Before any data change is written to the actual data files, it must first be written to the WAL log.

**How it works:**
```
1. Transaction modifies data
2. Change written to WAL log file first (sequential write, very fast)
3. COMMIT
4. WAL log is flushed to disk (guaranteed durable)
5. Data pages updated in memory (buffer pool)
6. Eventually, checkpoint writes data pages to disk
```

**Benefits of WAL:**
- ✅ **Crash recovery** — on restart, replay WAL to recover lost changes
- ✅ **Replication** — WAL can be streamed to replica servers
- ✅ **Point-in-time recovery** — replay WAL up to any specific moment

---

### 📌 Checkpoint

A **checkpoint** is when PostgreSQL flushes all dirty pages (modified pages in buffer pool) from memory to the actual disk data files.

```
Normal operation:
  Data modified → stays in memory (buffer pool)
  WAL log → written to disk (for durability)

Checkpoint (periodic):
  All dirty pages → written to disk
  WAL position recorded → crash recovery can start from here
```

**Why checkpoints matter:**
- After a crash, PostgreSQL only needs to replay WAL **from the last checkpoint**, not from the beginning
- Checkpoint frequency controls crash recovery time vs write performance trade-off

```sql
-- Manual checkpoint:
CHECKPOINT;

-- Configure checkpoint frequency:
checkpoint_timeout = 5min          -- how often
max_wal_size = 1GB                 -- or when WAL hits this size
```

---

## 🐬 Level 6 — MySQL Advanced

---

### 📌 InnoDB vs MyISAM

#### InnoDB
**InnoDB** is the default and recommended storage engine for MySQL. It is designed for modern production systems.

**Key features:**
- Full **ACID** transaction support
- **Row-level locking** (high concurrency)
- **MVCC** for consistent reads
- **Foreign key** support
- **Crash recovery** via redo log and undo log
- Clustered index (data stored sorted by primary key)

---

#### MyISAM
**MyISAM** is an older MySQL storage engine, mostly legacy.

**Key features:**
- **No transaction** support
- **Table-level locking** (low concurrency — entire table locks on write)
- No foreign keys
- No crash recovery
- Very fast for read-only workloads
- Used in MySQL full-text search (historically)

---

#### InnoDB vs MyISAM Comparison

| Feature | InnoDB | MyISAM |
|---------|--------|--------|
| Transactions | ✅ Full ACID | ❌ None |
| Lock Type | Row-level | Table-level |
| Foreign Keys | ✅ Supported | ❌ Not supported |
| Crash Recovery | ✅ Yes (redo log) | ❌ No |
| MVCC | ✅ Yes | ❌ No |
| Full-text Search | ✅ Yes (MySQL 5.6+) | ✅ Yes |
| Use Case | OLTP, production apps | Read-only legacy systems |
| Default | ✅ Yes (MySQL 5.5+) | No |

---

### 📌 Redo Log
The **redo log** stores changes that need to be **re-applied** after a crash. It records the *new state* of data.

- Written BEFORE data pages are updated (WAL principle)
- On crash recovery: MySQL reads redo log and re-applies all committed changes
- Circular file (fixed size): `ib_logfile0`, `ib_logfile1`

> "Redo" = replay committed changes that weren't yet written to data files.

---

### 📌 Undo Log
The **undo log** stores the *old version* of data before modification.

Used for:
1. **ROLLBACK** — restores data to its pre-transaction state
2. **MVCC** — provides older row versions to read transactions that started before the change
3. **Consistent reads** — `SELECT` sees data as it was at transaction start

> "Undo" = reverse a transaction or see old data.

---

## 🍃 Level 7 — MongoDB & NoSQL

---

### 📌 NoSQL Databases

#### What is NoSQL?
**NoSQL** (Not Only SQL) is a category of databases designed for storing and managing **large-scale, distributed, flexible, and unstructured data**.

NoSQL databases were created to solve problems that relational databases struggle with:
- Flexible/changing schema requirements
- Massive horizontal scaling needs
- High-speed reads/writes for specific data patterns
- Storing complex, nested, or varied data structures

---

#### Types of NoSQL Databases

| Type | How data is stored | Best For | Examples |
|------|-------------------|----------|---------|
| **Document** | JSON/BSON documents | Variable structure, nested data | MongoDB, CouchDB |
| **Key-Value** | Simple key → value pairs | Caching, sessions, real-time | Redis, DynamoDB |
| **Column-Family** | Columns grouped together | Wide-column analytics, time-series | Cassandra, HBase |
| **Graph** | Nodes and edges | Social networks, relationships | Neo4j, Amazon Neptune |

---

### 📌 MongoDB

#### What is MongoDB?
**MongoDB** is a document-based NoSQL database that stores data in **BSON** (Binary JSON) format — a superset of JSON that supports more data types.

**Why MongoDB is popular:**
- ✅ Flexible, schema-less design (no migrations for adding fields)
- ✅ Natural mapping to programming objects (JSON-like)
- ✅ Easy to store nested/complex data
- ✅ Horizontal scaling via sharding built-in
- ✅ Rich query language with aggregation framework

---

#### MongoDB Building Blocks

| SQL Term | MongoDB Equivalent | Description |
|----------|--------------------|-------------|
| Database | Database | Container for collections |
| Table | **Collection** | Group of documents |
| Row | **Document** | Single record (JSON object) |
| Column | **Field** | Key in a document |
| Primary Key | **_id** (ObjectId) | Unique identifier, auto-generated |
| JOIN | **$lookup** | Left outer join equivalent |

---

#### What is a Document?
A document is a single record stored as a JSON-like structure in MongoDB.

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice",
  "email": "alice@example.com",
  "age": 28,
  "address": {             // nested object
    "city": "Delhi",
    "zip": "110001"
  },
  "hobbies": ["reading", "coding"],  // array
  "createdAt": ISODate("2024-01-15")
}
```

Compared to SQL: in a relational database, `address` would be a separate table. In MongoDB, it's embedded naturally.

---

#### What is ObjectId?
**ObjectId** is the default unique identifier for MongoDB documents.

Format: 12 bytes = `4 bytes timestamp + 3 bytes machine ID + 2 bytes process ID + 3 bytes random counter`

```
507f1f77bcf86cd799439011
└──────┘└──────┘└──┘└────┘
timestamp machine  pid  counter
```

Benefits: Globally unique, contains creation timestamp, sortable by time.

---

#### MongoDB vs SQL Comparison

| Feature | SQL (PostgreSQL/MySQL) | MongoDB |
|---------|----------------------|---------|
| Schema | Fixed (must define columns) | Flexible (any structure) |
| Relationships | Strong (foreign keys) | Embedded or `$lookup` |
| Joins | Native, efficient | `$lookup` (limited) |
| Scaling | Vertical (bigger server) | Horizontal (more servers/sharding) |
| Transactions | Full ACID | Multi-document transactions (since v4.0) |
| Best for | Structured, relational data | Flexible, hierarchical, high-volume |

---

### 📌 MongoDB Indexing

MongoDB supports indexes similar to relational databases.

| Index Type | Description |
|------------|-------------|
| **Single Field** | Index on one field: `db.users.createIndex({email: 1})` |
| **Compound Index** | Index on multiple fields: `db.users.createIndex({city:1, age:-1})` |
| **Unique Index** | No duplicate values: `{unique: true}` |
| **Text Index** | Full-text search on string fields |
| **Geospatial Index** | Location-based queries (`2dsphere`) |
| **TTL Index** | Auto-expires documents after time |

---

### 📌 MongoDB Aggregation Framework

**Aggregation** is MongoDB's pipeline system for transforming and analyzing data — equivalent to SQL's `GROUP BY`, `HAVING`, `JOIN`, etc.

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },          // filter (like WHERE)
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },  // group (like GROUP BY)
  { $sort: { total: -1 } },                     // sort (like ORDER BY)
  { $limit: 10 }                                // top 10
]);
```

| Stage | Purpose | SQL Equivalent |
|-------|---------|----------------|
| `$match` | Filter documents | `WHERE` |
| `$group` | Group documents | `GROUP BY` |
| `$sort` | Sort results | `ORDER BY` |
| `$project` | Include/exclude fields | `SELECT` |
| `$lookup` | Join with another collection | `LEFT JOIN` |
| `$limit` | Limit results | `LIMIT` |
| `$skip` | Skip results | `OFFSET` |
| `$unwind` | Deconstruct arrays | — |

---

### 📌 Sharding

#### What is Sharding?
**Sharding** is a method of **horizontally distributing data across multiple servers** (called shards). Each shard holds a subset of the total data.

**Why sharding is needed:**
A single server has limits:
- Storage limit (e.g., max 10 TB per server)
- RAM limit (can't cache more data than fits in RAM)
- CPU limit (can only handle so many queries per second)

Sharding solves this by distributing data across many servers.

**Example:**
```
Without sharding:
Single server → 100 million users → getting slow

With sharding (by city):
Shard 1: users in Delhi, Mumbai
Shard 2: users in Chennai, Bangalore
Shard 3: users in Hyderabad, Kolkata

Each server handles only 1/3 of the load!
```

**Shard Key:** The field used to determine which shard a document goes to. Choosing the right shard key is critical — bad shard keys cause "hot spots" (one shard doing all the work).

---

### 📌 Replica Set

A **replica set** is a group of MongoDB servers that maintain **identical copies of the same data**, providing:
- **High Availability** — if primary fails, a secondary is automatically promoted
- **Data Redundancy** — multiple copies prevent data loss
- **Read Scaling** — reads can be distributed to secondaries

```
Primary (Read + Write)
    ↓ replication
Secondary 1 (Read-only)
    ↓ replication  
Secondary 2 (Read-only) + Arbiter (votes for elections only)
```

**Automatic failover:**
- If primary goes down, secondaries elect a new primary automatically (usually within seconds)
- Application reconnects to new primary

---

### 📌 How MongoDB Stores Data Internally

MongoDB uses the **WiredTiger** storage engine (since MongoDB 3.2):

- Data stored in **B-Tree** structures
- Documents stored in **BSON** format on disk
- Uses **document-level concurrency control** (similar to row-level locking)
- Supports **compression** (Snappy or Zlib)
- Has its own **journal** (like WAL) for crash recovery
- **In-memory cache** for frequently accessed data

---

## ⚡ Level 8 — Performance Optimization

---

### 📌 Why Is a Query Slow?

A query becomes slow when the database does more work than necessary. Common reasons:

| Reason | Explanation | Fix |
|--------|-------------|-----|
| **No index** | Full table scan for every row | Add appropriate index |
| **Wrong index** | Index exists but query doesn't use it | Review query & index design |
| **SELECT *** | Fetching all columns including unused ones | Select only needed columns |
| **Function on indexed column** | `WHERE YEAR(created_at) = 2024` bypasses index | Rewrite query |
| **Missing composite index** | Multiple WHERE conditions, no combined index | Add composite index |
| **Too many JOINs** | Joining 6+ tables with no indexes | Optimize joins, consider denormalization |
| **Large result set** | No LIMIT clause, returning millions of rows | Add pagination/LIMIT |
| **Lock contention** | Queries waiting for locks held by others | Reduce transaction size, check deadlocks |
| **Table bloat** | Dead rows accumulating (PostgreSQL) | Run VACUUM, tune autovacuum |
| **Outdated statistics** | Query planner uses wrong plan | Run ANALYZE to update stats |

---

### 📌 How to Find Slow Queries

**PostgreSQL:**
```sql
-- Enable slow query logging:
-- In postgresql.conf:
log_min_duration_statement = 1000  -- log queries > 1 second

-- Check slow queries from pg_stat_statements extension:
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**MySQL:**
```sql
-- Enable slow query log:
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- queries > 1 second

-- View slow queries:
SHOW STATUS LIKE 'Slow_queries';
```

**MongoDB:**
```javascript
// Enable profiling for queries > 100ms:
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries:
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

---

### 📌 How to Optimize a Query

#### 1. Use EXPLAIN to Analyze the Query
```sql
-- PostgreSQL:
EXPLAIN ANALYZE SELECT * FROM users WHERE city = 'Delhi';

-- MySQL:
EXPLAIN SELECT * FROM users WHERE city = 'Delhi';
```

**What to look for in EXPLAIN output:**
- `Seq Scan` → full table scan → BAD (needs index)
- `Index Scan` → using index → GOOD
- `Nested Loop` → can be expensive with large tables
- `rows` estimate vs actual — if very different, run ANALYZE

---

#### 2. Add Proper Indexes
```sql
-- Single column index:
CREATE INDEX idx_city ON users(city);

-- Composite index for multiple WHERE conditions:
CREATE INDEX idx_city_age ON users(city, age);

-- Partial index (only index active users):
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

---

#### 3. Avoid SELECT *
```sql
-- ❌ Bad: fetches everything including large TEXT/BLOB columns
SELECT * FROM users WHERE city = 'Delhi';

-- ✅ Good: fetch only what you need
SELECT id, name, email FROM users WHERE city = 'Delhi';
```

---

#### 4. Avoid Functions on Indexed Columns
```sql
-- ❌ Bad: function prevents index usage
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- ✅ Good: range query uses index
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
AND created_at < '2025-01-01';
```

---

#### 5. Use Proper Pagination
```sql
-- ❌ Bad: OFFSET becomes slow for large pages
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 100000;

-- ✅ Good: Cursor-based pagination (keyset pagination)
SELECT * FROM users WHERE id > 100000 ORDER BY id LIMIT 20;
```

---

#### 6. Optimize JOINs
```sql
-- Ensure columns used in JOIN have indexes:
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Avoid joining unnecessary tables
-- Use EXISTS instead of IN for large subqueries:
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

---

## 🏗️ Level 9 — Architecture & Scaling

---

### 📌 Replication

#### What is Replication?
**Replication** is the process of copying data from one database server (primary/master) to one or more other servers (replicas/slaves) automatically and continuously.

**Why replication:**
- ✅ **High availability** — if primary fails, replica takes over
- ✅ **Read scaling** — read traffic distributed across replicas
- ✅ **Disaster recovery** — replica in different datacenter protects against outages
- ✅ **Backups** — take backups from replica without impacting primary

---

#### Types of Replication

| Type | How it works | Pros | Cons |
|------|-------------|------|------|
| **Synchronous** | Primary waits for replica to confirm write | No data loss | Slower writes (waits for replica) |
| **Asynchronous** | Primary doesn't wait — replica catches up | Fast writes | Risk of small data loss if primary crashes |
| **Semi-synchronous** | Primary waits for at least ONE replica | Balance | Slightly slower than async |

---

### 📌 Vertical vs Horizontal Scaling

| Feature | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---------|----------------------------|-------------------------------|
| Method | Add more CPU/RAM/storage to existing server | Add more servers |
| Complexity | Simple | More complex (need sharding, load balancing) |
| Cost | Expensive (diminishing returns) | More cost-effective at scale |
| Limit | Physical hardware limits | Virtually unlimited |
| Downtime | Usually requires restart | Can be done with zero downtime |
| Best for | Small-medium systems | Very large systems |

---

## 🌐 Level 10 — Real Production Scenarios

---

### 📌 How Database Handles Millions of Users

**Strategies used in production:**

1. **Connection Pooling** — Instead of each request opening a new DB connection, a pool of connections is reused.
   ```
   App → PgBouncer/HikariCP → Pool of 100 connections → PostgreSQL
   (100,000 requests share 100 connections efficiently)
   ```

2. **Read Replicas** — Read-heavy operations (75%+ of queries) go to replicas; writes go to primary.

3. **Caching Layer** — Add Redis/Memcached in front of database for frequently read data.

4. **Database Sharding** — Split data across multiple databases based on user ID range, geography, etc.

5. **Indexing** — Proper indexes to ensure queries don't scan millions of rows.

6. **CDN for Static Data** — Serve static content from CDN, not database.

---

### 📌 How Database Handles Concurrency

1. **MVCC** (PostgreSQL, MySQL InnoDB) — multiple versions of rows so readers and writers don't block each other
2. **Row-level locking** — only the specific row being modified is locked
3. **Isolation levels** — configured appropriately for each use case
4. **Optimistic locking** — check version/timestamp before updating, retry if changed
5. **Connection pooling** — manages how many concurrent connections the DB handles

---

### 📌 How Database Handles Crash & Recovery

```
Timeline:
  10:00 AM - Checkpoint (all data flushed to disk)
  10:05 AM - Transactions T1, T2, T3 run (in memory + WAL)
  10:07 AM - Server crashes unexpectedly 💥

Recovery process:
  1. Database restarts
  2. Reads WAL log from last checkpoint (10:00 AM)
  3. Replays committed transactions (T1, T2)
  4. Rolls back uncommitted transaction (T3)
  5. Database is consistent again ✅

Total recovery time: seconds to minutes (not hours)
```

---

## 🎯 Level 11 — Tricky & FAANG Questions

---

### Why does index use B-Tree instead of Binary Search Tree?

| Concern | Binary Search Tree | B-Tree |
|---------|-------------------|--------|
| Balance | Can become unbalanced → O(n) | Always balanced → O(log n) |
| Keys per node | 1 | Many (hundreds) |
| Tree height | Very tall | Very short (3-4 levels) |
| Disk reads | Many (tall tree = many reads) | Few (short tree = few reads) |
| Range queries | Inefficient | Efficient (sorted leaf nodes linked) |

> Database storage is on **disk**, and disk reads are 1000x slower than RAM reads. B-Tree minimizes disk reads by being wide and short.

---

### Why is Full Table Scan Slow?

A full table scan reads **every single page** of the table from disk.

For a table with 10 million rows at 100 bytes each:
- Total data: ~1 GB
- Must read every page from disk
- Time: seconds to minutes

With an index:
- B-Tree traversal: 3-4 page reads
- Time: milliseconds

> The bigger the table, the more dramatic the difference.

---

### Why are JOINs Expensive?

JOINs are expensive because:
1. **Multiple table reads** — data must be fetched from multiple tables
2. **Hash/Sort operations** — for large tables, DB must hash or sort both sides
3. **Memory** — join results must fit in memory (or spill to disk)
4. **Missing indexes** on join columns → full scan of both tables

Mitigation:
- Index all foreign key columns
- Limit rows before joining with WHERE
- Consider denormalization for frequently-joined tables

---

### Why is MongoDB Sometimes Faster?

MongoDB can be faster in specific scenarios because:
1. **No JOINs needed** — embedded documents avoid cross-collection joins
2. **Schema flexibility** — no ALTER TABLE migrations required
3. **Horizontal sharding** — built-in, easier to scale out
4. **Document locality** — all related data in one document = one read

> But PostgreSQL is typically faster for complex queries, aggregations, and transactions.

---

### Why is PostgreSQL More Reliable?

1. ✅ **Full ACID compliance** — strict transaction guarantees
2. ✅ **WAL** — no data loss on crash
3. ✅ **MVCC** — consistent reads without blocking
4. ✅ **Strong type system** — data integrity enforced at DB level
5. ✅ **Mature ecosystem** — 35+ years of battle-tested stability
6. ✅ **Excellent tooling** — pg_stat, pg_badger, pgBouncer, etc.
7. ✅ **Logical replication, streaming replication** — built-in

---

## 🎭 Level 12 — Scenario-Based Questions

---

### Scenario 1: Query is Suddenly Slow — What Do You Do?

**Systematic approach:**

```
Step 1: Run EXPLAIN ANALYZE on the slow query
  → Is it doing a Seq Scan? (needs index)
  → Is it scanning too many rows?
  → Is the row estimate wildly off? (run ANALYZE to update stats)

Step 2: Check if index exists and is being used
  → SELECT * FROM pg_indexes WHERE tablename = 'users';
  → Did table grow beyond a threshold where a new index is needed?

Step 3: Check for locking
  → SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL;
  → Is the query waiting for a lock?

Step 4: Check for table bloat (PostgreSQL)
  → SELECT n_dead_tup FROM pg_stat_user_tables WHERE relname = 'users';
  → If high: run VACUUM ANALYZE

Step 5: Check slow query logs for patterns
  → Is it a new query or one that suddenly got slow?
  → Did data volume grow significantly?

Step 6: Fix and test
  → Add index
  → Rewrite query to avoid functions on indexed columns
  → Add LIMIT if missing
  → Consider denormalization if joins are the bottleneck
```

---

### Scenario 2: Database Crashed — How Do You Recover?

```
Immediate response:
1. Don't panic — check database logs first
   → /var/log/postgresql/postgresql.log
   → Look for the crash reason (OOM, disk full, corruption, etc.)

2. Restart the database
   → systemctl restart postgresql
   → PostgreSQL will automatically replay WAL and recover
   → This handles most crashes

If automatic recovery fails:
3. Check disk space — db won't start if disk is full
   → df -h
   → Remove old WAL files or logs if safe

4. If data corruption:
   → Restore from latest backup
   → Apply WAL archives up to point of failure (Point-in-Time Recovery)

5. If using replication:
   → Promote replica to new primary
   → Update application connection strings
   → Rebuild failed server and add back as replica

After recovery:
6. Post-mortem analysis
   → What caused the crash?
   → How to prevent it? (monitoring, alerting, disk autoscaling)
```

---

### Scenario 3: System Must Handle Millions of Users — How to Scale?

```
Phase 1: Optimize the single server
  ✅ Add indexes for slow queries
  ✅ Tune buffer pool / shared_buffers (25-40% of RAM)
  ✅ Add connection pooling (PgBouncer for PostgreSQL)
  ✅ Implement application-level caching (Redis)
  ✅ Optimize most expensive queries

Phase 2: Read scaling
  ✅ Add read replicas
  ✅ Route SELECT queries to replicas
  ✅ Route INSERT/UPDATE/DELETE to primary

Phase 3: Cache layer
  ✅ Cache frequently-read data in Redis
  ✅ Cache at application level (CDN, in-memory)
  ✅ Implement cache-aside pattern

Phase 4: Horizontal scaling (if still not enough)
  ✅ Implement database sharding
  ✅ Shard by user_id or geography
  ✅ Consider microservices with separate databases per service

Phase 5: Specialized databases
  ✅ Move search to Elasticsearch
  ✅ Move time-series data to TimescaleDB or InfluxDB
  ✅ Move session data to Redis
  ✅ Move analytics to BigQuery/Snowflake
```

---

### Scenario 4: Deadlock Detected — How to Resolve?

```
Immediate:
  → The DB automatically killed one transaction (the victim)
  → Implement retry logic in your application for deadlock errors
  → The killed transaction must be retried by the application

Investigation:
  → Check database logs for deadlock details
  → PostgreSQL logs which transactions were involved
  → Identify which tables/rows they were competing for

Root cause analysis:
  → Are transactions accessing tables in inconsistent order?
  → Are transactions too long (holding locks for too long)?
  → Is the isolation level too high for the use case?

Fix:
  1. Standardize lock order across all transactions
     (always lock accounts table before orders table)
  
  2. Reduce transaction duration
     (move non-DB logic outside BEGIN/COMMIT block)
  
  3. Use SELECT ... FOR UPDATE to acquire all needed locks upfront
     SELECT * FROM accounts WHERE id IN (1,2) ORDER BY id FOR UPDATE;
  
  4. Consider lower isolation level if business rules allow
  
  5. Implement retry with exponential backoff in application
```

---

## 📦 Level 13-15 — SQLite, SQL Server, MariaDB

---

### SQLite

#### What is SQLite?
SQLite is a **self-contained, serverless, file-based** relational database. The entire database is stored in a single `.db` file on disk.

**Key characteristics:**
- No separate server process needed
- Zero configuration
- Embedded directly into applications
- ACID compliant
- Single writer at a time (limited concurrency)

#### Why SQLite is Fast?
- No network overhead (embedded, in-process)
- No client-server communication
- Minimal setup and overhead
- Optimized for single-user or low-concurrency scenarios

#### Where is SQLite Used?
- Mobile apps (iOS/Android — it's the built-in database)
- Desktop applications (browsers, Electron apps)
- Prototyping and development
- Embedded systems (IoT devices)
- Test environments
- Browser storage (Web SQL, though deprecated)

---

### Microsoft SQL Server

#### Clustered Index vs Non-Clustered Index
(Same concept as covered in Level 2, but SQL Server terminology differs slightly)

- **Clustered Index:** Data rows physically sorted and stored in index order. Only one per table. Primary Key automatically creates a clustered index.
- **Non-Clustered Index:** Separate structure with pointers to actual data rows. Multiple allowed per table.

#### What is an Execution Plan?
SQL Server's visual representation of how it will execute a query — showing operations, estimated cost, index usage, and join strategies.

```sql
-- View execution plan:
SET SHOWPLAN_ALL ON;
SELECT * FROM users WHERE city = 'Delhi';
SET SHOWPLAN_ALL OFF;
```

---

### MariaDB

#### What is MariaDB?
MariaDB is a **community-driven fork of MySQL**, created in 2009 by the original MySQL developers after Oracle acquired MySQL.

#### Why was MariaDB Created?
- Concern that Oracle would commercialize/restrict MySQL
- Community wanted an open-source alternative
- Better transparency and development pace

#### Differences Between MySQL and MariaDB

| Feature | MySQL | MariaDB |
|---------|-------|---------|
| License | Dual (GPL + commercial) | GPL (fully open-source) |
| Storage engines | InnoDB, MyISAM | + Aria, ColumnStore, Spider |
| Performance | Good | Often slightly faster |
| Compatibility | Original | Drop-in replacement for MySQL |
| Oracle backed | ✅ Yes | ❌ No (community) |

---

## 🏆 Level 16-18 — Expert & Architect Level

---

### Top 10 Senior Interview Topics

| Topic | One-Line Answer |
|-------|-----------------|
| **How indexing works internally** | B-Tree data structure that keeps sorted data for O(log n) lookups |
| **What is MVCC** | Multiple row versions so readers and writers never block each other |
| **What is WAL** | Write-Ahead Logging — changes logged before applied, enables crash recovery |
| **Database concurrency** | MVCC + row-level locking + isolation levels working together |
| **How replication works** | Primary streams WAL/binlog changes to replica servers continuously |
| **How sharding works** | Shard key routes each document/row to the correct server shard |
| **How B-Tree works** | Self-balancing tree, wide & short, minimizes disk reads |
| **How transactions work** | BEGIN → operations → COMMIT (or ROLLBACK) with WAL for durability |
| **How locking works** | Shared locks for reads, exclusive locks for writes, row/table granularity |
| **How query optimizer works** | Analyzes possible plans, estimates costs, picks cheapest execution plan |

---

### CAP Theorem

**CAP Theorem** states that a distributed database can only guarantee **two out of three** of the following properties simultaneously:

| Property | Meaning |
|----------|---------|
| **C — Consistency** | Every read returns the most recent write (or an error) |
| **A — Availability** | Every request receives a response (no timeout/error) |
| **P — Partition Tolerance** | System continues despite network partitions (split nodes) |

> **The catch:** Network partitions are unavoidable in distributed systems. So the real choice is **CP vs AP**.

**CP systems (Consistency + Partition Tolerance):**
- Prioritize correct data over availability
- Will refuse requests if unsure about consistency
- Examples: PostgreSQL, HBase, Zookeeper

**AP systems (Availability + Partition Tolerance):**
- Always respond, even if data might be slightly stale
- Examples: DynamoDB, Cassandra, CouchDB (in some configs)

---

### Consistency Models

| Model | Description | Example |
|-------|-------------|---------|
| **Strong Consistency** | Read always returns latest write. All nodes see same data. | PostgreSQL with synchronous replication |
| **Eventual Consistency** | Reads may return stale data but will eventually converge | DynamoDB, Cassandra default |
| **Causal Consistency** | Operations causally related appear in order | Some MongoDB configurations |
| **Read-your-writes** | You always see your own writes immediately | Session consistency |

---

### Design Database for E-Commerce

```sql
-- Core tables:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id INT REFERENCES categories(id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id)  -- composite key
);

-- Key indexes:
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
```

---

### SQL Coding: Find Nth Highest Salary

```sql
-- Find 2nd highest salary:
SELECT MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- More flexible: Find Nth highest (works for any N):
SELECT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank
    FROM employees
) ranked
WHERE rank = 2;  -- change N here

-- PostgreSQL approach:
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;  -- OFFSET 0 = 1st, OFFSET 1 = 2nd, etc.
```

---

## 🔥 Quick Reference Cheatsheet

---

### Key Definitions to Memorize

| Term | One-liner |
|------|-----------|
| **Database** | Persistent, organized data storage system |
| **DBMS** | Software engine managing the database |
| **RDBMS** | DBMS using tables and relationships |
| **Primary Key** | Unique, non-null identifier for each row |
| **Foreign Key** | References primary key of another table |
| **Index** | Data structure for fast lookups (B-Tree) |
| **Transaction** | Group of operations that succeed or fail together |
| **ACID** | Atomicity, Consistency, Isolation, Durability |
| **MVCC** | Multiple row versions; readers/writers don't block |
| **WAL** | Changes logged before applied; enables crash recovery |
| **VACUUM** | Removes dead rows in PostgreSQL |
| **Sharding** | Distributing data across multiple servers |
| **Replication** | Copying data to replica servers |
| **Deadlock** | Two transactions waiting for each other's locks |
| **Normalization** | Removing data redundancy |
| **Denormalization** | Adding redundancy for read performance |

---

### Isolation Level Quick Reference

```
READ UNCOMMITTED → sees dirty data (almost never use)
READ COMMITTED   → default for PostgreSQL/Oracle (most common)
REPEATABLE READ  → default for MySQL; snapshot prevents non-repeatable reads
SERIALIZABLE     → safest; transactions appear sequential (banking)
```

---

### Index Quick Reference

```
When to add index:
  ✅ Column used in WHERE clause frequently
  ✅ Column used in JOIN ON clause
  ✅ Column used in ORDER BY (for large tables)
  ✅ Foreign key columns

When NOT to add index:
  ❌ Small tables (full scan is faster)
  ❌ Columns with very few distinct values (e.g., boolean)
  ❌ Tables with heavy INSERT/UPDATE/DELETE (index overhead)
  ❌ Columns rarely used in queries
```

---

### SQL vs NoSQL Decision Guide

```
Choose SQL (PostgreSQL/MySQL) when:
  ✅ Data is structured and relationships are important
  ✅ ACID transactions are required
  ✅ Complex queries and reporting needed
  ✅ Data integrity is critical (banking, healthcare)

Choose NoSQL (MongoDB/Redis/Cassandra) when:
  ✅ Schema changes frequently
  ✅ Need massive horizontal scaling
  ✅ Data is hierarchical/nested
  ✅ Need very high write throughput (logging, events)
  ✅ Key-value access pattern (caching with Redis)
```

---

*📌 Last updated: February 2026 | Covers: PostgreSQL, MySQL, MongoDB, SQLite, SQL Server, MariaDB*

*🎯 These notes cover 0 → Senior Engineer level. Practice the scenarios and SQL coding questions before interviews.*
