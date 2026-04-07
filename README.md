# Auth0 JavaScript Sample

A minimal single-page application demonstrating Auth0 login, logout, and user profile using the [Auth0 SPA SDK](https://github.com/auth0/auth0-spa-js).

## Requirements

- Node.js 20+
- An [Auth0](https://auth0.com) account with an application configured for this sample

## Setup

Install dependencies and configure the app with your Auth0 credentials:

```bash
npm install

npm run auth0-config -- --domain YOUR_DOMAIN --clientId YOUR_CLIENT_ID
```

This writes your credentials into `index.html` and saves the port to `.auth0.config.json`.

## Run

```bash
npm run dev
```

The app starts at `http://localhost:3000`.

## Try it out

1. Click **Signup** to create a new user in your Auth0 tenant.
2. Complete the signup flow on the Auth0 Universal Login page.
3. Once redirected back, view the newly created user's details in the **User Profile** section.
