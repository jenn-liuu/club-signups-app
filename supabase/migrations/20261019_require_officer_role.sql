alter table events enable row level security;
alter table signups enable row level security;

-- Remove permissive owner-only policies before adding officer-only policies.
drop policy if exists "owners create events" on events;
drop policy if exists "owners update events" on events;
drop policy if exists "owners delete events" on events;
drop policy if exists "owners read signups" on signups;
drop policy if exists "owners update signups" on signups;

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
