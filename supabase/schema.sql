create table events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  date timestamptz not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);

create table signups (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  email text not null,
  attended boolean not null default false,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

alter table events enable row level security;
alter table signups enable row level security;

-- events: anyone reads; only the owner writes
create policy "events are public" on events
  for select using (true);
create policy "owners create events" on events
  for insert to authenticated with check (owner_id = auth.uid());
create policy "owners update events" on events
  for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners delete events" on events
  for delete to authenticated using (owner_id = auth.uid());

-- signups: anyone can add one; only the event owner can see or change them
create policy "anyone can sign up" on signups
  for insert to anon, authenticated with check (attended = false);
create policy "owners read signups" on signups
  for select to authenticated
  using (exists (select 1 from events e
                 where e.id = signups.event_id and e.owner_id = auth.uid()));
create policy "owners update signups" on signups
  for update to authenticated
  using (exists (select 1 from events e
                 where e.id = signups.event_id and e.owner_id = auth.uid()))
  with check (exists (select 1 from events e
                 where e.id = signups.event_id and e.owner_id = auth.uid()));
