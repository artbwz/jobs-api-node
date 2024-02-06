#### Setup

Install node 20.11.0
>> npm i for dependecies
create .env file, with PORT, MYSQL_PASSWORD, JWT_SECRET and JWT_LIFETIME
check the sequelize connection with mysql, some cases, use MYSQL_PASSWORD = ''
use xampp for local database

#### Routers

- auth.js:
-- Register User:
POST  >>  http://localhost:4000/api/v1/auth/register
-- Login User:
POST  >>  http://localhost:4000/api/v1/auth/login
- jobs.js
-- Create Job
POST  >>  http://localhost:4000/api/v1/jobs
-- Get All Jobs
GET   >>  http://localhost:4000/api/v1/jobs
-- Get Single Job
GET   >>  http://localhost:4000/api/v1/jobs/:id
-- Update Single Job
PATCH >>  http://localhost:4000/api/v1/jobs/:id
-- Delete Single Job
DELETE>>  http://localhost:4000/api/v1/jobs/:id


#### Register User

Body for creating user:
{
  "name":"Name",
  "email":"email@hot.com",
  "password":"password123"
}

#### Login User

Body for login:
{
  "email":"email@hot.com",
  "password":"password123"
}

#### Postman Setup

For testing, use global variables for the tokens
On "Register User" route, go to Test and copy this:
const jsonData = pm.response.json()
pm.globals.set("acessToken", jsonData.token);
Then, go to Authorization, select Bearer Token, and use {{acessToken}}