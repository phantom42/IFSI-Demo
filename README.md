# IFSI

Static HTML + TypeScript + jQuery + Day.js app, built with Vite.

# Live Url

https://ifsi-demo.vercel.app/

# Approach

The brief did not specify that the user should be able to create new students or courses. I opted to ensure data integrity by forcing the user to select from valid options. With more time and data, I would use a text input that searches and suggests students and courses. I would also write unit tests. I initially began writing a custom filter for the request table but decided to not reinvent the wheel and opted to use DataTables as it fulfilled all of the functional requirements.

# Tools + AI

For Task 2 I used Claude Code to generate the Vite project and occasionally used it to debug Typescript related errors as I am still learning TypeScript. I initially wrote the css myself but after changing directions of how I wanted the final project to appear and behave, I had it generate much of the final CSS in particular to handle responsiveness. Beyond fixes such as "this is throwing an typescript warning/error because it may return a null value", the only functional code written by AI was the getNewExamRequestId function. My initial version was much more verbose and I knew there had to be a better way. I used Google + Claude at times to remind me of specific things such as the correct pattern to do custom sorts of items in an array.

## Scripts

```sh
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Deploy

Hosted on Vercel, which auto-detects Vite (build `npm run build`, output `dist`).
