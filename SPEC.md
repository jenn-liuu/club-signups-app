# Club Event Sign-ups
Officers create events; members sign up with name and email; officers
track attendance. Used by one club, mostly on phones.

## Must do
- Public page listing upcoming events
- Public event page with sign-up form (name, email)
- Officer login (Supabase Auth), create/delete events
- Officer view of signups per event, with attended checkbox
- Officer accounts are provisioned by an administrator with the trusted
  `app_metadata.role` claim set to `officer`; public account creation is disabled.

## Data
- events(id, owner_id, title, date, location, description)
- signups(id, event_id, name, email, attended)

## Rules
- RLS on every table. Anyone can read events and insert signups.
  Only an officer who owns an event can read/update its signups or modify it.
- No duplicate sign-ups (same email + event)
- Phone first. Show every error to the user.

## Out of scope
Emails, reminders, payments, comments, profiles, member accounts
