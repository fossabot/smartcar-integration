module.exports = {
  "extends": [
    "standard",
    "prettier",
    "prettier/standard"
  ],
  "plugins": [
    "import",
    "prettier",
    "standard",
    "chai-friendly"
  ],
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true,
    "mocha": true
  },
  "rules": {
    "space-before-function-paren": 0,
    "new-cap": 0,
    "prettier/prettier": 2,
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2,
    "no-unused-vars": ["error", { varsIgnorePattern: "should|expect" }]
  }
};
