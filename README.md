
# Getir Backend Challenge

## Intro

Challenge proposed by Getir on a selection process for a back-end Developer role that consists of developing a back-end application, with the following requirements:

- RESTful API with a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format.

- The code should be written in Node.js using express framework.

- The endpoint should just handle HTTP POST requests.

- The application should be deployed on AWS or Heroku. You don’t need to use any
API Gateway, Load Balancers or any other layer than the developed application.

- The up to date repo should be publicly available in Github, Bitbucket or equivalent.

First of all I would like to thank you for the opportunity to be able to take the test and have the chance to join a company as that has been breaking barriers, such as Getir.

## Demonstration

  Demo Video: [https://youtu.be/DEnKIZxv-2M](https://youtu.be/DEnKIZxv-2M)

  Heroku hosted API: [https://harbs-getir-challenge.herokuapp.com/api](https://harbs-getir-challenge.herokuapp.com)

  ![/api/records](/prints/records.png)


## Project Behavior

- **API**

  For the routes exposure on a RESTFul model I did use the Express micro-framework for being very lean and simple to work with. I did could use Hapi without or NestJS too.

- **TESTS**

  To perform unit and integration tests I did use Supertest and Jest for integration tests and Jest for unitary tests.


# Payload Codes

`SUCCESS:` **0 - Succesfull request.**

`PRECONDITION_FAILED:` **1 - Missing required fields.**

`BAD_REQUEST:` **2 - Extra fields in the request payload.**

`NOT_FOUND:` **3 - No query results for the search.**

`DATA_MISMATCH:` **4 - minCount greather than maxCount or startDate greathern than endDate.**

`SERVER_ERROR:` **5 - Any server error.**


# End-points

### Records

| resource                  | description                       |
| :------------------------ | :-------------------------------- |
| `/api/records` **POST** | Retrieve records |

`/api/records` **POST** - **[200 - Success]**

**REQUEST - Expected Payload**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 2892,
	"maxCount": 2906
}
```

**RESPONSE**
```shell
{
	"code": 0,
	"msg": "success",
	"records": [
		{
			"key": "ibfRLaFT",
			"createdAt": "2016-12-25T16:43:27.909Z",
			"totalCount": 2892
		},
		{
			"key": "XCiSazeS",
			"createdAt": "2016-12-13T18:58:33.864Z",
			"totalCount": 2906
		},
		{
			"key": "ohsXfpHi",
			"createdAt": "2016-03-30T20:01:01.948Z",
			"totalCount": 2894
		}
	]
}
```
___

`/api/records` **POST** - **[400 - Bad Request]**

**REQUEST - Field Don't Required in Payload**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 28921,
    "maxCount": 29061,
    "testing": true
}
```

**RESPONSE**
```shell
{
	"code": 2,
	"msg": "remove extra field(s): testing",
	"records": []
}
```
___

`/api/records` **POST** - **[400 - Bad Request]**

**REQUEST - minCount greather than maxCount**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 289211,
    "maxCount": 29061
}
```

**RESPONSE**
```shell
{
	"code": 4,
	"msg": "minCount greather than maxCount",
	"records": []
}
```
___

`/api/records` **POST** - **[400 - Bad Request]**

**REQUEST - startDate greather than endDate**
```shell
{
	"startDate": "2018-12-31",
	"endDate": "2016-01-01",
	"minCount": 28921,
    "maxCount": 29061
}
```

**RESPONSE**
```shell
{
	"code": 4,
	"msg": "startDate greather than endDate",
	"records": []
}
```
___

`/api/records` **POST** - **[404 - Not Found]**

**REQUEST - Records Not Found**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 28921,
	"maxCount": 29061
}
```

**RESPONSE**
```shell
{
	"code": 3,
	"msg": "no query results found",
	"records": []
}
```
___

`/api/records` **POST** - **[412 - Pre Condition Failed]**

**REQUEST - Missing maxCount or any required fields**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 28921
}
```

**RESPONSE**
```shell
{
	"code": 1,
	"msg": "missing field(s): maxCount",
	"records": []
}
```
___

`/api/records` **POST** - **[500 - Internal Server Error]**

**REQUEST - Malformed Payload or Another Server Error**
```shell
{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 28921,
    "maxCount": 29061
}
```

**RESPONSE**
```shell
{
	"code": 500,
	"msg": "Unexpected token } in JSON at position 96"
}
```

## Primarily Used Technologies

- [Node](https://nodejs.org/en/) - 14.17.0
- [Yarn](https://yarnpkg.com/) - 1.22.17
- [Jest](https://jestjs.io/) - 27.5.1
- [Dotenv-Safe](https://www.npmjs.com/package/dotenv-safe) - 8.2.0
- [Express](https://expressjs.com/) - 4.17.2
- [Mongoose](https://mongoosejs.com/) - 5.13.7
- [Supertest](https://www.npmjs.com/package/supertest) - 6.2.2
- [Babel](https://babeljs.io/) - 7.17.0
- [Eslint](https://eslint.org/) - 8.9.0
- [Heroku](https://www.heroku.com/)
- [GH Actions](https://github.com/features/actions)

## Instalation

### Prerequisites

To run the application it is only necessary to have Node installed in version v12.x.x or v14.x.x.

### Phases

To run the application on your machine, follow these steps:

1. git clone [https://github.com/devbarba/getir_challenge](https://github.com/devbarba/getir_challenge)

2. `cd getir_challenge` to access the project folder.

3. `yarn` or `npm install` to performs installation of dependencies.

4. `cp .env.example .env` to copy environment variables.

5. Go to `.env` file and put in `MONGO_URI` environment variable the mongo uri following this pattern: `mongodb+srv://[user]:[password]@[server_ip_or_url]/[database]?retryWrites=true`

6. `yarn build` or `npm run build` to build the application.

7. `yarn start` or `npm run start` to run the application.

PS: `yarn dev` to run on dev mode.
## CURL to test API

**Heroku**
```shell
curl --request POST \
  --url https://harbs-getir-challenge.herokuapp.com/api/records \
  --header 'Content-Type: application/json' \
  --data '{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 2892,
	"maxCount": 2906
}'
```

**Local**
```shell
curl --request POST \
  --url http://0.0.0.0:9004/api/records \
  --header 'Content-Type: application/json' \
  --data '{
	"startDate": "2016-01-01",
	"endDate": "2018-12-31",
	"minCount": 2892,
	"maxCount": 2906
}'
```

## Tests

Code coverage: `99.56%`.

To run the integration and unit tests run the following command: `yarn test`


## Author

[João Harbs](https://github.com/devbarba)
