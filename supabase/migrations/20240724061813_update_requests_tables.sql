alter table "public"."requests" drop column "passed";

alter table "public"."requests" drop column "received";

alter table "public"."requests" drop column "redirected";

alter table "public"."requests" add column "bounced" boolean not null default false;

alter table "public"."requests" add column "customer_email_address" text;

alter table "public"."requests" add column "delivered" boolean not null default false;

alter table "public"."requests" add column "sent" boolean not null default false;



