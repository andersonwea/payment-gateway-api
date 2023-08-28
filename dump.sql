CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  price INT NOT NULL
);
