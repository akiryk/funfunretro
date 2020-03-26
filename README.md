# Fun Fun Retro

## Setup

Before anything else, make a Firebase project directory with necessary files:

- Install Firebase cli if you don't already have it
- `firebase login`
- `mddir myFirebaseProject`
- `cd myFirebaseProject`
- `firebase init`
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
