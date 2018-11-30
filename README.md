# Kryssplatform_Exam

This repo contains my project for the exam delivery for TDS200 - Kryssplatform App-utvikling.
This is an application made in Ionic 3 and represents an application where a user can sell used books.

## Installation

To use this app you need to register an account in Google Firebase and create a file in `src/app/` named `GoogleFirebaseApiKey`. <br/>
Template to this file:

```
export default {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
```

To get Google Maps to work you also need to register a API-key for Google Maps and create a file in  `src/app/` named `GoogleFirebaseApiKey`. <br/>
Template to this file:
```
export default "";
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
