alter table "public"."locations" add column "daily_customers_count" text;

alter table "public"."users" drop column "location_count";

alter table "public"."users" add column "daily_customers_count" text;



