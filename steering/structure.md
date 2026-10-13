# Structure conventions
- Group code by feature/domain (organisations, campaigns, donations, auth, admin).
- Shared UI in `components/ui`, domain components next to their feature.
- Types and schemas live in one place per domain; no duplicate model definitions.
- Seed data lives in a single seed script with documented demo credentials.