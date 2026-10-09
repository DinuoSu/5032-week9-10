# FIT5032 Library

A library web application for FIT5032 coursework, built with Vue 3, Vite, Bootstrap, PrimeVue and Firebase.

## Features

- Library registration form with input validation, password confirmation, user cards and a data table.
- JSON exercises using computed properties, filtering and conditional rendering.
- Page navigation with Vue Router and a protected About page.
- Firebase email registration, sign-in and sign-out.
- Member and administrator roles enforced by Firestore rules.
- Book management with ISBN filters, sorting and result limits. Members can add books; administrators can also edit and delete them.
- A Book Counter page that calls the `countBooks` HTTP function through Axios.
- A Firestore function that capitalises text fields when a new book is added.

The registration form keeps its submitted records in page memory and displays masked passwords. Firebase accounts and book records use the local emulators. The book list defaults to `isbn > 1000`, sorted by ISBN in ascending order, with a limit of 10 results. The counter returns the total number of documents in the `books` collection.

## Getting started

Requirements: Node.js 22 or later and Java 21 or later.

Install the application and function dependencies:

```sh
npm install
npm install --prefix functions
```

Start the Firebase emulators in one terminal:

```sh
npm run emulators
```

In a second terminal, create the sample data and start the application:

```sh
npm run seed
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) to use the application, or [http://127.0.0.1:4000](http://127.0.0.1:4000) to view the Firebase Emulator UI.

The emulators use project ID `demo-fit5032` and listen on the following local ports:

| Service | Port |
| --- | --- |
| Authentication | 9099 |
| Firestore | 8080 |
| Functions | 5001 |
| Emulator UI | 4000 |

The first run downloads the Firebase emulator components. Emulator data is saved to `.emulator-data` when the process shuts down normally and loaded on the next start. Stop the emulators with Ctrl+C to allow the export to finish. The seed script adds missing sample books and local demo accounts.

## Demo accounts

These accounts are for the local application:

| Account | Password | Access |
| --- | --- | --- |
| `student` | `Library123!` | Demo member login for the About page |
| `member@library.test` | `Library123!` | Firebase member: view and add books |
| `admin@library.test` | `Library123!` | Firebase administrator: view, add, edit and delete books |

The demo member login and Firebase sign-in are separate. Newly registered Firebase users have member access. Administrator access is assigned through custom claims using the Admin SDK and checked by the Firestore rules.

## Project structure

| Path | Contents |
| --- | --- |
| `src/components/` | Registration form, navigation, book list and JSON exercises |
| `src/views/` | Pages, including Firebase sign-in and Book Counter |
| `src/router/` | Routes and navigation guards |
| `src/stores/` | Authentication state |
| `src/services/` | Firestore book operations |
| `src/firebase/` | Firebase client configuration |
| `functions/` | HTTP book counter and Firestore book creation function |
| `scripts/` | Emulator startup and sample data scripts |
| `firestore.rules` | Database access rules |

## Configuration

Local emulator settings are enabled by default. Available environment variables are listed in `.env.example`; overrides can be placed in `.env.local`.

The default Book Counter endpoint is:

```text
http://127.0.0.1:5001/demo-fit5032/us-central1/countBooks
```

Set `VITE_COUNT_BOOKS_URL` to change this endpoint. Cloud deployment requires a separate Firebase project configuration.

## Tests and build

Run unit tests and create a production build:

```sh
npm test
npm run build
```

With the emulators running, run the integration tests:

```sh
npm run test:integration
```

Alternatively, start temporary Authentication and Firestore emulators for the test run:

```sh
npm run test:emulators
```

Integration tests use the separate project `demo-fit5032-test` and reset its test data. Run only one emulator instance at a time because the instances share local ports.

## Cloud functions

The cloud project is `week9-10-4af68`. The local application continues to use the emulators by default.

To deploy the functions after signing in to the Firebase CLI:

```sh
npx firebase deploy --only functions --project week9-10-4af68
```

The cloud counter endpoint is:

```text
https://us-central1-week9-10-4af68.cloudfunctions.net/countBooks
```

Cloud Firestore data is separate from the local emulator data.
