create table "public"."additional_categories" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "category_name" text
);


alter table "public"."additional_categories" enable row level security;

create table "public"."category_ids" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "category_name" text
);


alter table "public"."category_ids" enable row level security;

create table "public"."grouped_mentions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "supabase_attribute" text,
    "label" text,
    "total_count" bigint
);


alter table "public"."grouped_mentions" enable row level security;

create table "public"."people_also_search" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "cid" text,
    "search_term" text,
    "google_rating" bigint
);


alter table "public"."people_also_search" enable row level security;

create table "public"."place_topics" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "topic" text,
    "count" bigint
);


alter table "public"."place_topics" enable row level security;

create table "public"."review_images" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "single_image_url" text,
    "all_images_url" text,
    "alt_text" text
);


alter table "public"."review_images" enable row level security;

alter table "public"."locations" add column "address" text;

alter table "public"."locations" add column "business_phone_number" text;

alter table "public"."locations" add column "business_url" text;

alter table "public"."locations" add column "cid" text;

alter table "public"."locations" add column "domain_name" text;

alter table "public"."locations" add column "google_maps_category" text;

alter table "public"."locations" add column "google_maps_main_image_url" text;

alter table "public"."locations" add column "google_maps_url" text;

alter table "public"."locations" add column "last_updated_date_time" text;

CREATE UNIQUE INDEX additional_categories_pkey ON public.additional_categories USING btree (id);

CREATE UNIQUE INDEX category_ids_pkey ON public.category_ids USING btree (id);

CREATE UNIQUE INDEX grouped_mentions_pkey ON public.grouped_mentions USING btree (id);

CREATE UNIQUE INDEX people_also_search_pkey ON public.people_also_search USING btree (id);

CREATE UNIQUE INDEX place_topics_pkey ON public.place_topics USING btree (id);

CREATE UNIQUE INDEX review_images_pkey ON public.review_images USING btree (id);

alter table "public"."additional_categories" add constraint "additional_categories_pkey" PRIMARY KEY using index "additional_categories_pkey";

alter table "public"."category_ids" add constraint "category_ids_pkey" PRIMARY KEY using index "category_ids_pkey";

alter table "public"."grouped_mentions" add constraint "grouped_mentions_pkey" PRIMARY KEY using index "grouped_mentions_pkey";

alter table "public"."people_also_search" add constraint "people_also_search_pkey" PRIMARY KEY using index "people_also_search_pkey";

alter table "public"."place_topics" add constraint "place_topics_pkey" PRIMARY KEY using index "place_topics_pkey";

alter table "public"."review_images" add constraint "review_images_pkey" PRIMARY KEY using index "review_images_pkey";

alter table "public"."additional_categories" add constraint "public_additional_categories_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."additional_categories" validate constraint "public_additional_categories_location_id_fkey";

alter table "public"."category_ids" add constraint "public_category_ids_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."category_ids" validate constraint "public_category_ids_location_id_fkey";

alter table "public"."grouped_mentions" add constraint "public_grouped_mentions_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."grouped_mentions" validate constraint "public_grouped_mentions_location_id_fkey";

alter table "public"."people_also_search" add constraint "public_people_also_search_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."people_also_search" validate constraint "public_people_also_search_location_id_fkey";

alter table "public"."place_topics" add constraint "public_place_topics_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."place_topics" validate constraint "public_place_topics_location_id_fkey";

alter table "public"."review_images" add constraint "public_review_images_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."review_images" validate constraint "public_review_images_review_id_fkey";

grant delete on table "public"."additional_categories" to "anon";

grant insert on table "public"."additional_categories" to "anon";

grant references on table "public"."additional_categories" to "anon";

grant select on table "public"."additional_categories" to "anon";

grant trigger on table "public"."additional_categories" to "anon";

grant truncate on table "public"."additional_categories" to "anon";

grant update on table "public"."additional_categories" to "anon";

grant delete on table "public"."additional_categories" to "authenticated";

grant insert on table "public"."additional_categories" to "authenticated";

grant references on table "public"."additional_categories" to "authenticated";

grant select on table "public"."additional_categories" to "authenticated";

grant trigger on table "public"."additional_categories" to "authenticated";

grant truncate on table "public"."additional_categories" to "authenticated";

grant update on table "public"."additional_categories" to "authenticated";

grant delete on table "public"."additional_categories" to "service_role";

grant insert on table "public"."additional_categories" to "service_role";

grant references on table "public"."additional_categories" to "service_role";

grant select on table "public"."additional_categories" to "service_role";

grant trigger on table "public"."additional_categories" to "service_role";

grant truncate on table "public"."additional_categories" to "service_role";

grant update on table "public"."additional_categories" to "service_role";

grant delete on table "public"."category_ids" to "anon";

grant insert on table "public"."category_ids" to "anon";

grant references on table "public"."category_ids" to "anon";

grant select on table "public"."category_ids" to "anon";

grant trigger on table "public"."category_ids" to "anon";

grant truncate on table "public"."category_ids" to "anon";

grant update on table "public"."category_ids" to "anon";

grant delete on table "public"."category_ids" to "authenticated";

grant insert on table "public"."category_ids" to "authenticated";

grant references on table "public"."category_ids" to "authenticated";

grant select on table "public"."category_ids" to "authenticated";

grant trigger on table "public"."category_ids" to "authenticated";

grant truncate on table "public"."category_ids" to "authenticated";

grant update on table "public"."category_ids" to "authenticated";

grant delete on table "public"."category_ids" to "service_role";

grant insert on table "public"."category_ids" to "service_role";

grant references on table "public"."category_ids" to "service_role";

grant select on table "public"."category_ids" to "service_role";

grant trigger on table "public"."category_ids" to "service_role";

grant truncate on table "public"."category_ids" to "service_role";

grant update on table "public"."category_ids" to "service_role";

grant delete on table "public"."grouped_mentions" to "anon";

grant insert on table "public"."grouped_mentions" to "anon";

grant references on table "public"."grouped_mentions" to "anon";

grant select on table "public"."grouped_mentions" to "anon";

grant trigger on table "public"."grouped_mentions" to "anon";

grant truncate on table "public"."grouped_mentions" to "anon";

grant update on table "public"."grouped_mentions" to "anon";

grant delete on table "public"."grouped_mentions" to "authenticated";

grant insert on table "public"."grouped_mentions" to "authenticated";

grant references on table "public"."grouped_mentions" to "authenticated";

grant select on table "public"."grouped_mentions" to "authenticated";

grant trigger on table "public"."grouped_mentions" to "authenticated";

grant truncate on table "public"."grouped_mentions" to "authenticated";

grant update on table "public"."grouped_mentions" to "authenticated";

grant delete on table "public"."grouped_mentions" to "service_role";

grant insert on table "public"."grouped_mentions" to "service_role";

grant references on table "public"."grouped_mentions" to "service_role";

grant select on table "public"."grouped_mentions" to "service_role";

grant trigger on table "public"."grouped_mentions" to "service_role";

grant truncate on table "public"."grouped_mentions" to "service_role";

grant update on table "public"."grouped_mentions" to "service_role";

grant delete on table "public"."people_also_search" to "anon";

grant insert on table "public"."people_also_search" to "anon";

grant references on table "public"."people_also_search" to "anon";

grant select on table "public"."people_also_search" to "anon";

grant trigger on table "public"."people_also_search" to "anon";

grant truncate on table "public"."people_also_search" to "anon";

grant update on table "public"."people_also_search" to "anon";

grant delete on table "public"."people_also_search" to "authenticated";

grant insert on table "public"."people_also_search" to "authenticated";

grant references on table "public"."people_also_search" to "authenticated";

grant select on table "public"."people_also_search" to "authenticated";

grant trigger on table "public"."people_also_search" to "authenticated";

grant truncate on table "public"."people_also_search" to "authenticated";

grant update on table "public"."people_also_search" to "authenticated";

grant delete on table "public"."people_also_search" to "service_role";

grant insert on table "public"."people_also_search" to "service_role";

grant references on table "public"."people_also_search" to "service_role";

grant select on table "public"."people_also_search" to "service_role";

grant trigger on table "public"."people_also_search" to "service_role";

grant truncate on table "public"."people_also_search" to "service_role";

grant update on table "public"."people_also_search" to "service_role";

grant delete on table "public"."place_topics" to "anon";

grant insert on table "public"."place_topics" to "anon";

grant references on table "public"."place_topics" to "anon";

grant select on table "public"."place_topics" to "anon";

grant trigger on table "public"."place_topics" to "anon";

grant truncate on table "public"."place_topics" to "anon";

grant update on table "public"."place_topics" to "anon";

grant delete on table "public"."place_topics" to "authenticated";

grant insert on table "public"."place_topics" to "authenticated";

grant references on table "public"."place_topics" to "authenticated";

grant select on table "public"."place_topics" to "authenticated";

grant trigger on table "public"."place_topics" to "authenticated";

grant truncate on table "public"."place_topics" to "authenticated";

grant update on table "public"."place_topics" to "authenticated";

grant delete on table "public"."place_topics" to "service_role";

grant insert on table "public"."place_topics" to "service_role";

grant references on table "public"."place_topics" to "service_role";

grant select on table "public"."place_topics" to "service_role";

grant trigger on table "public"."place_topics" to "service_role";

grant truncate on table "public"."place_topics" to "service_role";

grant update on table "public"."place_topics" to "service_role";

grant delete on table "public"."review_images" to "anon";

grant insert on table "public"."review_images" to "anon";

grant references on table "public"."review_images" to "anon";

grant select on table "public"."review_images" to "anon";

grant trigger on table "public"."review_images" to "anon";

grant truncate on table "public"."review_images" to "anon";

grant update on table "public"."review_images" to "anon";

grant delete on table "public"."review_images" to "authenticated";

grant insert on table "public"."review_images" to "authenticated";

grant references on table "public"."review_images" to "authenticated";

grant select on table "public"."review_images" to "authenticated";

grant trigger on table "public"."review_images" to "authenticated";

grant truncate on table "public"."review_images" to "authenticated";

grant update on table "public"."review_images" to "authenticated";

grant delete on table "public"."review_images" to "service_role";

grant insert on table "public"."review_images" to "service_role";

grant references on table "public"."review_images" to "service_role";

grant select on table "public"."review_images" to "service_role";

grant trigger on table "public"."review_images" to "service_role";

grant truncate on table "public"."review_images" to "service_role";

grant update on table "public"."review_images" to "service_role";

create policy "Enable all CRUD operations"
on "public"."additional_categories"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."category_ids"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."people_also_search"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."place_topics"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."review_images"
as permissive
for all
to public
using (true);




