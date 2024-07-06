alter table "public"."locations" drop column "is_fetching";

alter table "public"."users" add column "is_fetching" boolean not null default false;



