How cart should work:

- If user is signed in, store cart data into database.
- If user is not signed in, store cart data into localStorage
- When user signs in, store cart data from localStorage to database and clear localStorage
