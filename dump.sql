CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT('user'),
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  price INT NOT NULL
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
  order_id TEXT,
  user_id INT REFERENCES users(id),
  value INT
);

CREATE TABLE orders_items (
	id SERIAL PRIMARY KEY,
  product_id INT,
  user_id INT REFERENCES users(id)
);
