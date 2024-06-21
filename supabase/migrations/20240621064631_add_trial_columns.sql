alter table "public"."subscriptions" add column "trial_start" bigint;

alter table "public"."subscriptions" alter column "updated_at" drop not null;



