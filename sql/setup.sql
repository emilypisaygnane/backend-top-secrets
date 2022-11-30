-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS secrets;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE secrets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO 
    secret (title, description) 
    
VALUES
('Spy Kids', 'My parents cant be spies, theyre not cool enough'),
('Cats & Dogs', 'You fight like a poodle'),
('G-Force', 'Dont pay any attention to him. Hes a quarter ferret');