# smartcar-integration
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fansik-pitstop%2Fsmartcar-integration.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fansik-pitstop%2Fsmartcar-integration?ref=badge_shield)


Integration service of Smartcar -> Pitstop.

# Build
```shell
npm install && npm run build
```

# Test

```sh
# create a configuration file from the tamplate
cp conf-default.json conf-e2e.json

# unit test (requires postgres database connection)
npm run test:unit

# full test (requries access to Pitstop API server & postgres database connection)
npm test

# coverage test (requries access to Pitstop API server & postgres database connection)
npm run test:cov && npm run see-cov
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fansik-pitstop%2Fsmartcar-integration.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fansik-pitstop%2Fsmartcar-integration?ref=badge_large)