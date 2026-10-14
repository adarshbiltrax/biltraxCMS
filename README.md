# Biltrax CMS application
Laravel + Vue 3 CMS overlay with login, dashboard, searchable contact/career tables, detail drawer, status updates, notes, and private S3 resume download. Uses existing `users`, `demo_requests`, `career_applications` tables.

## Install
1. `composer create-project laravel/laravel biltrax-cms`
2. Copy overlay files into that Laravel project.
3. `composer require league/flysystem-aws-s3-v3` and `npm install`.
4. Configure `.env` with the same MySQL database as the website and AWS private bucket. Set a separate `APP_KEY`, `APP_URL`, and secure session cookie configuration for each app. **Do not** share APP_KEY or Laravel session cookie name between apps.
5. `php artisan serve --port=8001` and `npm run dev` (configure Vite port separately if both run simultaneously).
6. Sign in using a valid existing `users` account; no credentials are included.

**Security:** Keep CMS HTTPS-only, protect accounts with MFA/SSO and strong rate limits, use private S3 objects and minimum IAM permissions, and implement audit history before production. `reviewed_by` references `users.id`. Avoid running `migrate:fresh` on the existing database.
