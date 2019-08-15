# SmartcarDatSyncService

## Data schema

### DTO

#### SmartcarDataSyncRequest

```
{
    "meta": {
        "dataSyncRequestId": "string",
    }
    "data": {
        "identifier": {
            "vin": "string"
        },
        "accessToken": "string"
    }
}
```

#### SmartcarDataSyncResult

```
{
    "meta": {
        "timestamp": "string" // ISO 8601 timestamp
        "request": SmartcarDataSyncRequest
    },
    "data": {
        "status": "ok" || "error",
        "error": [ // if exists; see common/errors for definition
            {
                "name": "string",
                "message": "string"
            }
        ]
    }
}
```

## Components

### PersistenceLayer

### DataSyncScheduler

#### run()

- fetches a list of refresh token from persistence layer
- for each refresh token:
  - exchanges access token
  - fetches a list of cars from smartcar api
  - for each car:
    - generates a _SmartcarDataSyncRequest_
    - deliver the 

given refresh token, it generates a list of _SmartcarDataSyncRequest_ and delivers to the registered callback

### DataSyncRunner
