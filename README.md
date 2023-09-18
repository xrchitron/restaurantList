# Restaurant in Taipei

This is a restaurant website which users are able to get restaurant information and promote different stores.

### Project snapshots

![Alt restaurantList_img_01](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_01.png)
![Alt restaurantList_img_02](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_02.png)
![Alt restaurantList_img_03](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_03.png)
![Alt restaurantList_img_04](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_04.png)
![Alt restaurantList_img_05](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_05.png)
![Alt restaurantList_img_06](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_06.png)
![Alt restaurantList_img_07](https://github.com/xrchitron/restaurantList/blob/main/public/img/restaurantList_img_07.png)

### Installation

1. Turn on the terminal and clone this file to your local device

```
git clone https://github.com/xrchitron/restaurantList.git
```

2. change directory to the correct position

```
cd restaurantList
```

3. install package

```
npm install
```

4. create database in mysql (not in the terminal)

```
CREATE DATABASE restaurant;
```

5. create migration

```
npm run migrate
```

6. create seeder

```
npm run seed
```

7. generate clientId and clientSecret by facebook and google
   The following website will guide you to handle the settings, and default CALLBACK_URL is http://localhost:3000/oauth2/redirect/facebook or google
   .env file should be created, please reference .env.example
   facebook: https://www.twilio.com/blog/facebook-oauth-login-node-js-app-passport-js
   google: https://www.makeuseof.com/nodejs-google-authentication/

8. execute project

```
npm run dev
```

if the following message shows up in the terminal which means that the server has started successfully

```
The Express server is running on http://localhost:3000
```

### Features

1. users are able to register as new users
2. users are able to register with facebook or google
3. users are able to create customized restaurant information
4. users are able to search restaurants by name and category
5. users are able to sort restaurants by different category
6. users are able to update restaurants' info
7. users are able to delete restaurants' info
8. users are able to visit restaurants by pagination

## Environment Setup

Node.js

## Authors

- **Yuhao Chen** - _Initial work_ - [xrchitron](https://github.com/xrchitron)

## License

This project is licensed under the MIT License
