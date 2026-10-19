# Club Event Sign-ups
Officers create events; members sign up with name and email; officers
track attendance. Used by one club, mostly on phones.

## Must do
- Public page listing upcoming events
- Public event page with sign-up form (name, email)
- Officer login (Supabase Auth), create/delete events
- Officer view of signups per event, with attended checkbox

## Data
- events(id, owner_id, title, date, location, description)
- signups(id, event_id, name, email, attended)

## Rules
- RLS on every table. Anyone can read events and insert signups.
  Only the event owner can read/update signups or modify events.
- No duplicate sign-ups (same email + event)
- Phone first. Show every error to the user.

## Out of scope
Emails, reminders, payments, comments, profiles, member accounts
