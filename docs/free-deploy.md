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

The existing demo database is baselined by Flyway. New schema changes are applied from
`src/main/resources/db/migration`, and Hibernate validates the result with `DDL_AUTO=validate`.

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

## 4. Database Migration

Before every schema deployment:

1. Create a Neon snapshot or restore branch in **Backup & Restore**.
2. Export a logical backup with the direct, unpooled Neon connection URL:

   ```bash
   pg_dump -Fc "$NEON_DIRECT_DATABASE_URL" -f "thingz-$(date +%Y%m%d-%H%M%S).dump"
   ```

3. Confirm the dump with `pg_restore --list <dump-file>`.
4. Deploy the Flyway migration.
5. Verify `/actuator/health`, login refresh, article creation, and image upload.

Never commit dump files or database URLs. Keep `DDL_AUTO=validate` in Render so an
unexpected entity/schema mismatch fails deployment instead of changing production data.

For a brand-new empty database, bootstrap the original schema first, then deploy with
Flyway enabled. The current production baseline is version 1 and managed changes start at V2.

## 5. Recovery

- For a recent mistake, use Neon **Backup & Restore** to create a restore branch and inspect it first.
- For older or external recovery, restore the dump into a separate database:

  ```bash
  pg_restore --clean --if-exists --no-owner --no-acl \
    -d "$NEON_RECOVERY_DATABASE_URL" <dump-file>
  ```

- Point Render at the recovery database only after smoke tests pass.
