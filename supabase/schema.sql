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

-- events: anyone reads; only an officer who owns the event can write
create policy "events are public" on events
  for select using (true);
create policy "officers create events" on events
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
  );
create policy "officers update events" on events
  for update to authenticated
  using (
    owner_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
  )
  with check (
    owner_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
  );
create policy "officers delete events" on events
  for delete to authenticated
  using (
    owner_id = auth.uid()
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
  );

-- signups: anyone can add one; only an officer who owns the event can see or change them
create policy "anyone can sign up" on signups
  for insert to anon, authenticated with check (attended = false);
create policy "officers read signups" on signups
  for select to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
    and exists (select 1 from events e
                where e.id = signups.event_id and e.owner_id = auth.uid())
  );
create policy "officers update signups" on signups
  for update to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
    and exists (select 1 from events e
                where e.id = signups.event_id and e.owner_id = auth.uid())
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'officer'
    and exists (select 1 from events e
                where e.id = signups.event_id and e.owner_id = auth.uid())
  );
