# Fun Fun Retro

## Setup

Before anything else, make a Firebase project directory with necessary files:

- Install Firebase cli if you don't already have it
- `firebase login`
- `mddir myFirebaseProject`
- `cd myFirebaseProject`
- `firebase init`
- Before going further: it saves time not to install NPM dependencies during setup process.
- Select "use functions"
- Select to use an existing project if you have access privileges to funfunretro; otherwise, create a new one.
- Use JS or TS; use eslint or roll your own
- No, don't install NPM dependencies now.

Now you're ready to clone the repo. If you created a `functions` folder already, `rm -rf functions`. Otherwise:

- `git clone https://github.com/akiryk/funfunretro.git functions`
- Before you can run the functions locally, you need to get a service account key Firebase.
  - `https://console.firebase.google.com/project/YOUR-PROJECT/settings/serviceaccounts/adminsdk`
  - click "Generate new private key"
  - Put the generated json file somewhere outside of git repo.
- `cd functions`
- `npm install`
- Find the place where we `admin.initializeApp()` and ensure `serviceAccount` is properly defined/required — e.g. `var serviceAccount = require('../serviceAccountKey.json');`

You can now run `firebase deploy` to use the deployed functions or you can test them locally.

- `cd myFirebaseProject` or `cd myFirebaseProject/functions` it doesn't matter
- `firebase serve` or `firebase serve --only functions`
- If you have Postman installed, copy the endpoing, e.g. `http://localhost:5000/funfunretro/us-central1/getUsers` and use it to test and profit...

## Eslint

- At the top level of your directory (not in the functions directory):
- create an `.eslintrc` file

```json
{
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  "extends": ["eslint:recommended", "eslint-config-prettier"],
  "rules": {
    "strict": ["error", "never"],
    "no-unused-vars": [
      "error",
      { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
    ]
  },
  "env": {
    "browser": true,
    "node": true
  }
}
```

## Prettier

- Assuming you use Prettier and have the Prettier extension installed in VSCode...
- Create an `.prettierrc` file at the top level of your project, outside of functions directory

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

### Authentication

Todo: Need to implement some kind of authentication because as of now:

- no auth is developed for this app
- there is a user type with username but that's about it
- the bare bones of creating auth are taken from the classed video series

Consider these alternatives

- Firebase has a plug and play authentication solution.

* Go to Firebase Project Settings/Authentication and enable email signin
* Go to Firebase Project Settings/General and click the `</>` web platform button to create an app
  - Copy the config settings and put it in your project
* `npm install firebase` to your project
* Use `firebase.auth().createUserWithEmailAndPassword(email, password)` where email and password are data from client.

### Resolvers

To create a new resolver

- Create or modify any typeDefs in `gql/schema`
- Add new resolver function in the appropriate place,
  - `gql/mutations/comment_mutations`
  - or a new file for a new type
- Import it into `gql/resolvers.js`
- test in Graphiql and/or write e2e tests

### Queries

- boards
- board
- columns
- column
- users
- user
- comments
- comment

Example format

```
query getBoards {
  boards {
    name
    desc
    id
  }
}

query getColumnsByBoard {
  board(id:"fSOyvOyR3k1owjAKv88o") {
    name
    desc
    columns {
      name
    }
  }
}
```

### Mutations

**Graphiql**

```
// In the main query builder:

mutation createComment($input:CommentInput) {
  createComment(input:$input){
    boardId
    columnId
    userId
    text
    id
  }
}

---------------------------------------------
In the Query Variables section
{
  "input": {
    "boardId": "07hqwKZjcMoPwagAmgfi",
    "columnId":"23234234",
    "userId":"ADKDJDF",
    "text":"This comment added from graphiql"
  }
}
```

```gql
mutation {
  createComment(
    text: "Here is a comment for you?"
    boardId: "123"
    columnId: "ADS"
    userId: "Ssdfsdfdsf"
  ) {
    id
    text
  }
}
```
