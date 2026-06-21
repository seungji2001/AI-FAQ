# Free Demo Deployment

This setup is intended for a free or near-free demo deployment:

- Frontend: Vercel Hobby
- Backend: Render Web Service Free
- Database: Neon Postgres Free

## 1. Neon

Create a Neon project and copy:

- JDBC URL: use as `JDBC_DATABASE_URL`
- Database user: use as `DB_USERNAME`
- Database password: use as `DB_PASSWORD`

The backend uses `DDL_AUTO=update` for the first demo deployment so Hibernate can create tables.

## 2. Render

Create a Blueprint from this repository using `render.yaml`.

Set these required environment variables:

- `JDBC_DATABASE_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `FRONTEND_URL`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `KAKAO_REDIRECT_URI`
- `AWS_ACCESS_KEY`
- `AWS_SECRET_KEY`
- `S3_BUCKET`
- `OPENAI_API_KEY`

For a read-only demo, Kakao, AWS S3, and OpenAI can be filled later, but features that use them will not work until real values are set.

## 3. Vercel

Import `fo/thingz-fo` as the project root.

Set the environment variable:

- `NEXT_PUBLIC_API_BASE=https://<render-backend-url>/api/fo`

After Vercel gives you the frontend URL, update Render:

- `FRONTEND_URL=https://<vercel-frontend-url>`
- `KAKAO_REDIRECT_URI=https://<render-backend-url>/login/oauth2/code/kakao`

## 4. After First Deploy

Once the database schema has been created, change Render `DDL_AUTO` from `update` to `none` for safer operation.
