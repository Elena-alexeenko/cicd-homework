# CI/CD Homework

We've selected the [GoodReads API](https://www.goodreads.com/api) for our assignment.

Limitations:
* Don't request any method more than once a second. (from GoodReads Developer Terms of Service)

## API

Import the library and instantiate an object with your API key:

```js
const GoodReads = require('goodReads');
const goodReads = new GoodReads(YOUR_API_KEY);
```

The following methods are available:

```js
goodReads.searchBook(query, field, page);
goodReads.getAuthorByName(authorName);
```

## Set up

1. Install [NodeJS](https://nodejs.org/en/download/)
2. `npm install`
3. [Register a Developer Key](https://www.goodreads.com/api/keys)
3. Create an `.env` file.
    In it, set up: `GOODREADS_KEY`, `GOODREADS_SECRET`

# TODO

* PDF file
    * Short description of the features and API used
    * Tests passing on the local system for each unit (screenshots)
    * CICD pipeline for each unit (screenshots)
    * Link to services used
