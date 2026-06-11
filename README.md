# Tailwind Fitness App Practice

A React + Vite fitness app practice project built with **Tailwind CSS**, a small component library, and modern frontend tooling. The UI is based on a Figma mobile fitness/community design, while the codebase is used to practice reusable components, forms, tables, routing, Firebase integration, and UI documentation with Storybook.

## Overview

This project is a frontend playground for building a fitness-focused interface with reusable UI patterns and scalable structure. It includes React 19, Vite, Tailwind CSS v4, TanStack Form, TanStack Table, React Router, Firebase, and Storybook in one setup. 

## Design reference

The visual direction comes from a Figma fitness mobile app design link included in the project notes. Access to Figma files may depend on the file's share settings or authentication, so teammates may need viewer access or a public link to inspect the design directly. 

- Figma design: [Fitness Mobile App UI – Community](https://www.figma.com/design/Z2ZbrNIsEbfSgXuSOOWER6/Fitness-Mobile-App-UI--Community-?node-id=206-281&p=f&t=N7XzinJsBXsZWfD6-0)

## Tech stack

- React 19
- Vite 8
- Tailwind CSS 4 with `@tailwindcss/vite`
- React Router DOM 7
- TanStack Form
- TanStack Table
- Firebase
- Storybook 10
- Vitest + Playwright
- ESLint + Storybook ESLint plugin

## Features practiced

- Reusable button, input, card, and table-oriented UI components.
- Tailwind-first styling with a lightweight component library approach.
- Form handling experiments with simple React state and TanStack Form.
- Interactive data tables with editing, filtering, sorting, pagination, or infinite scroll patterns.
- Firebase setup with environment variables and Firestore integration. 
- Isolated component development and documentation with Storybook. 

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Storybook

Storybook for React + Vite is meant for building, testing, and documenting UI components in isolation. In an app like this, it is especially useful for buttons, form fields, cards, table cells, empty states, and loading states. [web:268][web:277]

### Install Storybook

```bash
npm create storybook@latest
```

### Run Storybook

```bash
npm run storybook
```

### Build Storybook

```bash
npm run build-storybook
```

## Firebase setup

To connect the app to your own Firebase project, create a Firebase project, register a web app, and copy the Firebase config values into environment variables. Firebase’s web setup documentation shows this initialization flow, and Firestore’s quickstart covers database creation and reads. [web:209][web:207]

### Install Firebase

```bash
npm install firebase --save
```

### Example `.env`

```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_MEASUREMENT_ID=""
```

### Important

Never commit `.env` files, API keys, or secrets to the repository. Environment-specific values should stay outside version control. 

Add this to `.gitignore`:

```gitignore
.env
```

## Tailwind setup notes

Tailwind CSS can be used with Vite through the official Vite integration, which keeps the workflow lightweight in React projects. This project uses utility-first styling so UI can be composed directly in components without writing large custom CSS files for every element. 

Example:

```html
<div class="flex gap-2">
  <button class="px-4 py-2 rounded-lg bg-blue-600 text-white">
    Mentés
  </button>
  <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
    Mégse
  </button>
</div>
```

## Suggested project structure

```text
src/
  api/
  components/
  features/
  pages/
  stories/
  firebase.ts
  index.css
```

A structure like this keeps shared UI separate from feature-level logic and makes Storybook stories easier to maintain alongside components.

## Available scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

## Practice ideas

- Connect the workout list to Firestore.
- Display workout dates in the list UI.
- Add loading, empty, and error states.
- Combine search, filters, and sorting in tables.
- Build Storybook stories for every reusable component.
- Add form validation examples with TanStack Form.
- Compare simple React state forms with library-based forms.

## Useful links

- [Storybook for React + Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite) [web:268]
- [Storybook docs](https://storybook.js.org/docs) [web:277]
- [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite) [web:208]
- [Firebase web setup](https://firebase.google.com/docs/web/setup) [web:209]
- [Firestore quickstart](https://docs.cloud.google.com/firestore/native/docs/create-database-web-mobile-client-library) [web:207]
- [React Router](https://github.com/remix-run/react-router) [web:273]

## Notes

This repository is best used as a learning project for practicing frontend architecture, component reuse, styling discipline, and integration with external services. It can also serve as a base for a more complete fitness dashboard or mobile-inspired workout tracker.

## Dependency docs

dependency docs: https://github.com/sverweij/dependency-cruiser
graphviz vscode: "Graphviz Interactive Preview"

run
```
npx depcruise src --include-only "^src" --output-type dot > dependencygraph.dot
```

preview: run graphviz vscode extension on output.dot