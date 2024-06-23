create table "public"."usernames" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "username" text not null
);


alter table "public"."usernames" enable row level security;

CREATE UNIQUE INDEX username_pkey ON public.usernames USING btree (id);

alter table "public"."usernames" add constraint "username_pkey" PRIMARY KEY using index "username_pkey";

grant delete on table "public"."usernames" to "anon";

grant insert on table "public"."usernames" to "anon";

grant references on table "public"."usernames" to "anon";

grant select on table "public"."usernames" to "anon";

grant trigger on table "public"."usernames" to "anon";

grant truncate on table "public"."usernames" to "anon";

grant update on table "public"."usernames" to "anon";

grant delete on table "public"."usernames" to "authenticated";

grant insert on table "public"."usernames" to "authenticated";

grant references on table "public"."usernames" to "authenticated";

grant select on table "public"."usernames" to "authenticated";

grant trigger on table "public"."usernames" to "authenticated";

grant truncate on table "public"."usernames" to "authenticated";

grant update on table "public"."usernames" to "authenticated";

grant delete on table "public"."usernames" to "service_role";

grant insert on table "public"."usernames" to "service_role";

grant references on table "public"."usernames" to "service_role";

grant select on table "public"."usernames" to "service_role";

grant trigger on table "public"."usernames" to "service_role";

grant truncate on table "public"."usernames" to "service_role";

grant update on table "public"."usernames" to "service_role";

create policy "Enable all CRUD operations"
on "public"."usernames"
as permissive
for all
to public
using (true);




