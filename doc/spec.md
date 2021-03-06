# SmartcarDataSyncService

## Overview

![img](https://i.imgur.com/fAv274K.png)

## Data schema

### DTO

#### SmartcarDataSyncRequest

``` javascript
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

``` javascript
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

#### prepareDataSyncRequest()

- fetches a list of refresh token from persistence layer
- for each refresh token:
  - exchanges access token
  - fetches a list of cars from smartcar api
  - for each car:
    - computes a _SmartcarDataSyncRequest_
    - delivers _SmartcarDataSyncRequest_ to the callback

### DataSyncExecutor

#### processDataSyncRequest(SmartcarDataSyncRequest)

- fetches data from smartcar api (e.g. last odometer reading)
- computes a _SmartcarDataSyncResult_
- delivers _SmartcarDataSyncResult_ to the callback
