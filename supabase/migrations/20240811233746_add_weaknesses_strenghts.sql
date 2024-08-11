create table "public"."strengths" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "name" text
);


alter table "public"."strengths" enable row level security;

create table "public"."weaknesses" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "name" text
);


alter table "public"."weaknesses" enable row level security;

alter table "public"."business_categories" add column "mixed_mentions" bigint;

alter table "public"."business_categories" add column "negative_mentions" bigint;

alter table "public"."business_categories" add column "positive_mentions" bigint;

alter table "public"."customers" drop column "name";

alter table "public"."customers" add column "clerk_id" text;

alter table "public"."customers" add column "first_name" text;

alter table "public"."detailed_aspects" add column "location_id" uuid;

CREATE UNIQUE INDEX strengths_pkey ON public.strengths USING btree (id);

CREATE UNIQUE INDEX weaknesses_pkey ON public.weaknesses USING btree (id);

alter table "public"."strengths" add constraint "strengths_pkey" PRIMARY KEY using index "strengths_pkey";

alter table "public"."weaknesses" add constraint "weaknesses_pkey" PRIMARY KEY using index "weaknesses_pkey";

alter table "public"."detailed_aspects" add constraint "public_detailed_aspects_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."detailed_aspects" validate constraint "public_detailed_aspects_location_id_fkey";

alter table "public"."strengths" add constraint "public_strengths_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."strengths" validate constraint "public_strengths_location_id_fkey";

alter table "public"."weaknesses" add constraint "public_weaknesses_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."weaknesses" validate constraint "public_weaknesses_location_id_fkey";

grant delete on table "public"."strengths" to "anon";

grant insert on table "public"."strengths" to "anon";

grant references on table "public"."strengths" to "anon";

grant select on table "public"."strengths" to "anon";

grant trigger on table "public"."strengths" to "anon";

grant truncate on table "public"."strengths" to "anon";

grant update on table "public"."strengths" to "anon";

grant delete on table "public"."strengths" to "authenticated";

grant insert on table "public"."strengths" to "authenticated";

grant references on table "public"."strengths" to "authenticated";

grant select on table "public"."strengths" to "authenticated";

grant trigger on table "public"."strengths" to "authenticated";

grant truncate on table "public"."strengths" to "authenticated";

grant update on table "public"."strengths" to "authenticated";

grant delete on table "public"."strengths" to "service_role";

grant insert on table "public"."strengths" to "service_role";

grant references on table "public"."strengths" to "service_role";

grant select on table "public"."strengths" to "service_role";

grant trigger on table "public"."strengths" to "service_role";

grant truncate on table "public"."strengths" to "service_role";

grant update on table "public"."strengths" to "service_role";

grant delete on table "public"."weaknesses" to "anon";

grant insert on table "public"."weaknesses" to "anon";

grant references on table "public"."weaknesses" to "anon";

grant select on table "public"."weaknesses" to "anon";

grant trigger on table "public"."weaknesses" to "anon";

grant truncate on table "public"."weaknesses" to "anon";

grant update on table "public"."weaknesses" to "anon";

grant delete on table "public"."weaknesses" to "authenticated";

grant insert on table "public"."weaknesses" to "authenticated";

grant references on table "public"."weaknesses" to "authenticated";

grant select on table "public"."weaknesses" to "authenticated";

grant trigger on table "public"."weaknesses" to "authenticated";

grant truncate on table "public"."weaknesses" to "authenticated";

grant update on table "public"."weaknesses" to "authenticated";

grant delete on table "public"."weaknesses" to "service_role";

grant insert on table "public"."weaknesses" to "service_role";

grant references on table "public"."weaknesses" to "service_role";

grant select on table "public"."weaknesses" to "service_role";

grant trigger on table "public"."weaknesses" to "service_role";

grant truncate on table "public"."weaknesses" to "service_role";

grant update on table "public"."weaknesses" to "service_role";

create policy "Enable all CRUD operations"
on "public"."strengths"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."weaknesses"
as permissive
for all
to public
using (true);




