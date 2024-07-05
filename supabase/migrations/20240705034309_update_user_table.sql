alter table "public"."locations" add column "google_place_coordinates" text;

alter table "public"."locations" add column "google_place_id" text;

alter table "public"."locations" add column "is_fetching" boolean not null default false;

alter table "public"."locations" add column "is_google_configured" boolean not null default false;

alter table "public"."locations" add column "is_yelp_configured" boolean not null default false;

alter table "public"."locations" add column "yelp_profile_url" text;

alter table "public"."users" add column "selected_location_id" text;



