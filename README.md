# smartcar-integration

Integration service of Smartcar -> Pitstop.

# Build
```shell
npm install && npm run build
```

# Test

```shell
# create a configuration file from the tamplate
cp conf-default.json conf-e2e.json

# unit test
npm run test:unit

# full test (requries access to Pitstop API server & postgres database connection)
npm test

# coverage test (requries access to Pitstop API server & postgres database connection)
npm run test:cov && npm run see-cov
```
