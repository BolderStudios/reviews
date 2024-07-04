create table "public"."locations" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "organization_name" text not null,
    "name_of_contact" text not null,
    "position_of_contact" text not null,
    "is_primary" boolean not null default false,
    "is_competitor" boolean not null default false,
    "clerk_id" text not null,
    "user_id" uuid not null
);


alter table "public"."locations" enable row level security;

alter table "public"."users" add column "customer_retention_challenges" text not null;

alter table "public"."users" add column "employee_count" bigint;

alter table "public"."users" add column "location_count" bigint;

alter table "public"."users" add column "organization_industry" text not null;

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (id);

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."locations" add constraint "public_locations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."locations" validate constraint "public_locations_user_id_fkey";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

create policy "Enable all CRUD operations"
on "public"."locations"
as permissive
for all
to public
using (true);




