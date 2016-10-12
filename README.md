# Middle-js

## Library to enable node-js microservices

The library goal is to provide the minimal bootstrap to enable a express application to be part of the opinionated microservices ecosystem designed by Serge Libotte and David Navarro for Proximus.

Couchbase is a dependency of this library, please refer to confluence in order to have this dependency installed in your computer without Visual Studio Professional.
 

### Configuration inherited by clients of this library

 The only configuration needed is the environment variable **COUCHBASE_CONFIG_BUCKET**. This should point to
the couchbase instance for a given environment. In this instance there should have a bucket named 'config' 
that stores all the configuration objects needed for the program (in json format).

  If the **COUCHBASE_CONFIG_BUCKET** is undefined the program fallback silently in the configuration object stored in *config/default.json*.  

### Components

The index.js creates a facade with the following components:

* Central Configuration Component
* Winston logger with default transports
* Express application with default settings
* Proxy application to enable CORS scenarios

### Development

If you want to participate on this development, please follow these guidelines:

#### Installation
```bash 
$ npm install gulp-cli -g
$ npm install
```

#### Development mode
```bash
$ gulp develop
```
