# Node.js REST API with authorization Example with Express 4, Passport, Mongoose

Brief instructions:
```
$ git clone git@github.com:stgoge/rest-api.git
$ cd allmax
$ npm install
$ node app.js
```
You can use package.json command:
```
$ npm start
```
Setup your MongoDb settings in mongo-settings-default.js (rename to mongo-settings.js)

Authorization with JWT, token expects in authorization header.

By default creates admin/admin in db with access to all records.  

Routes:
-------
### /signup ###
http request body:
```
{
  "username": "", //string, required
  "password": "" //string, required
}
```
respond: token
### /signin ###
http request body:
```
{
  "username": "", //string, required
  "password": "" //string, required
}
```
respond: token
### get /records?status= &priority= ###
query values are optional
http request header:
```
{
  "authorization": token
}
```
respond: all match user records in
```
{
  "priority": ,
  "status": ,
  "_id": "",
  "record": "",
  "date": "",
  "userID": "",
  "__v": 0
}
```

### post /records ###
http request header:
```
{
  "authorization": token
}
```
body
```
{
  "record": "", //string, required
  "priority": , //number, default = 0
  "status":  //number, default = 0
}
```
respond: status 200
### put /records ###
http request header:
```
{
  "authorization": token
}
```
body
```
{
  "record": "", //string, required
  "priority": "", //number, default = 0
  "status": "", //number, default = 0
  "recordID": "" //string
}
```
respond: status 200
### delete /records ###
http request header:
```
{
  "authorization": token
}
```
body
```
{
  "recordID": "" //string
}
```
respond: status 200
