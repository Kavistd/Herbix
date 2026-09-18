# Herbix

Existing React/Vite frontend and Express/Mongoose API.

Run the API from `server/` with `npm run dev`, and the frontend from the project root with `npm run dev`. Configure the existing server environment (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`) and frontend `VITE_API_URL` as needed.

Product management is available from **Admin Dashboard > Manage products**:

- `/admin/products`: list, view, edit, and confirm deletion.
- `/admin/products/new` and `/admin/products/:id/edit`: manage product fields and image URLs.
- `/admin/products/:id/view`: protected preview, including inactive products.

Public `GET /api/products` and `GET /api/products/:id` return ACTIVE products only (ID or slug supported). Coming Soon and zero-stock products remain visible but cannot be purchased. Admin list/detail/create/update/delete use `/api/admin/products` and the existing authentication/ADMIN middleware. Existing protected product-write routes are retained for compatibility.

Run `npm run seed` from `server/` to insert Herbix Original. It uses the existing LKR 850 listing, product image, and basic ginger/lemon/black-pepper information. Unknown stock starts at zero; enter actual stock before selling. Missing specifications are not invented. Rerunning the seed never overwrites existing products or admin edits. The configured database is not seeded automatically.

Legacy products without a status remain hidden until an admin reviews and activates them. Legacy fields remain in the model for compatibility. Old prototype carts are replaced by an empty cart; new carts persist IDs and quantities only, with prices loaded from MongoDB. Checkout validates current product prices/status/stock on the backend and preserves product snapshots in existing orders after deletion. Existing demo card UI remains a demo; no payment gateway was added.

Validation: `npm run build` at the root; `npm test` in `server/`. API integration tests use an isolated in-memory MongoDB, never the configured application database. The test runner may download a MongoDB binary if none is cached.
