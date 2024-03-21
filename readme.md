# InkMatch Back-End

## What's in it for me ?

- MariaDB Database
- A Adminer instance to manage the DB
- A Node Express Api
- Nginx based Web Server

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

# API ROUTES

## User

- [GET] : /api/users _Retreive all users_
- [PUT] : /api/users/{userId} _Update a user_
- [DELETE] : /api/users/{userId} _Delete a user_

## Auth

- [POST] : /api/auth/login _Login with credentials_
- [POST] : /api/auth/register _Register_
- [GET] : /api/auth/me _Retreive current user information_

## Medias

- [POST] : /api/medias _Upload a media object_
- [GET] : /api/medias/{mediaId} _Download a media object_
