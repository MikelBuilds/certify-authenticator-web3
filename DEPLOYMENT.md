# Vercel deployment

Deploy from the repository root. `vercel.json` builds the React frontend and
routes `/api/*` to the Express function. Browser routes fall back to `index.html`.

## Configuration

Add these server-side environment variables in the Vercel project settings:

- `MONGO_URI`: a persistent MongoDB connection string, such as MongoDB Atlas.
- `JWT_SECRET`: a long, randomly generated secret.
- `ADMIN_REGISTRATION_CODE`: a private code needed to register institution admins.
- `RPC_URL`: the RPC endpoint for the deployed contract's Ethereum network.
- `ISSUER_PRIVATE_KEY`: the contract owner's testnet signing key.
- `CONTRACT_ADDRESS`: optional if the committed contractDetails.json is correct.
- `NODE_ENV`: `production`.

Do not prefix server secrets with `VITE_`. Local `.env` files are excluded from
deployment uploads. Configure variables for each Vercel environment you use,
then redeploy after changing them.

## MongoDB Atlas

1. Create a free cluster in MongoDB Atlas.
2. Create a database user with read/write access to the `certify` database.
3. Under Network Access, allow your development IP and the deployment's outbound
   addresses. A temporary `0.0.0.0/0` rule permits all source IPs and still requires
   database credentials; use restricted addresses when available.
4. Choose Connect > Drivers > Node.js and copy the connection string.
5. Replace the username/password placeholders (URL-encode special characters),
   and use `/certify` before the query string as the database name.
6. Save it as `MONGO_URI` in `backend/.env` and in Vercel's environment settings.

Example structure only:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/certify?retryWrites=true&w=majority
```

## Deploy and verify

```powershell
npx vercel login
npx vercel --prod
```

Select this repository's root as the project directory. The root configuration
supplies the install command, build command, output directory, and API routes.

Check the homepage, `/verify`, `/login`, and `/health`, then test registration
with your admin invitation code and a real certificate PDF. `/health` is a
liveness endpoint; it does not certify database or blockchain connectivity.

PDF uploads are limited to 4 MB to leave space within Vercel's 4.5 MB request
limit. Production never falls back to an in-memory database. Without MongoDB
and JWT configuration, API requests return 503 while the frontend remains
available. Existing local records are not automatically migrated to Atlas.

The application's existing database-only verification fallback still applies:
only results with `verificationSource: BLOCKCHAIN` confirm an on-chain match.
