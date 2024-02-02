# PapoteCar Back-End

## What's in it for me ?

- MariaDB Database
- A Adminer instance to manage the DB
- An empty Express Api
- Nginx based Web Server
- A RabbitMq instance

# Installation guide

## What you need

| Runtime / Software |
| ------------------ |
| Docker             |
| Docker Compose     |

## Create a .env file following the .env.dist template

## Start the containers with Docker

```sh
docker-compose up --build
```
# You can access to :
- The API on :
```sh
localhost:5000/api
```
- Adminer on (Env value to log in):
```sh
localhost:8080
```

- RabbitMq on (guest / guest to log in): 
```sh
localhost:15672
```

# API ROUTES

## User

- [GET] : /api/users *Retreive all users*
- [PUT] : /api/users/{userId} *Update a user*
- [DELETE] : /api/users/{userId} *Delete a user*

## Auth

- [POST] : /api/auth/login *Login with credentials*
- [POST] : /api/auth/register *Register*
- [GET] : /api/auth/me *Retreive current user information*

## Car

- [CREATE] : /api/cars *Create a car*
- [GET] : /api/cars *Retreive all cars*

## Trips

- [CREATE] : /api/trips *Create a trip*
- [GET] : /api/trips *Retreive all trips*