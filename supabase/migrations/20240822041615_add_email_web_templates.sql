revoke delete on table "public"."grouped_mentions" from "anon";

revoke insert on table "public"."grouped_mentions" from "anon";

revoke references on table "public"."grouped_mentions" from "anon";

revoke select on table "public"."grouped_mentions" from "anon";

revoke trigger on table "public"."grouped_mentions" from "anon";

revoke truncate on table "public"."grouped_mentions" from "anon";

revoke update on table "public"."grouped_mentions" from "anon";

revoke delete on table "public"."grouped_mentions" from "authenticated";

revoke insert on table "public"."grouped_mentions" from "authenticated";

revoke references on table "public"."grouped_mentions" from "authenticated";

revoke select on table "public"."grouped_mentions" from "authenticated";

revoke trigger on table "public"."grouped_mentions" from "authenticated";

revoke truncate on table "public"."grouped_mentions" from "authenticated";

revoke update on table "public"."grouped_mentions" from "authenticated";

revoke delete on table "public"."grouped_mentions" from "service_role";

revoke insert on table "public"."grouped_mentions" from "service_role";

revoke references on table "public"."grouped_mentions" from "service_role";

revoke select on table "public"."grouped_mentions" from "service_role";

revoke trigger on table "public"."grouped_mentions" from "service_role";

revoke truncate on table "public"."grouped_mentions" from "service_role";

revoke update on table "public"."grouped_mentions" from "service_role";

alter table "public"."grouped_mentions" drop constraint "public_grouped_mentions_location_id_fkey";

alter table "public"."grouped_mentions" drop constraint "grouped_mentions_pkey";

drop index if exists "public"."grouped_mentions_pkey";

drop table "public"."grouped_mentions";

create table "public"."templates_email" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "company_logo_url" text,
    "subject_line" text,
    "message" text,
    "testimonial_page_url" text
);


alter table "public"."templates_email" enable row level security;

create table "public"."templates_web" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "template_id" text,
    "is_existing_customer" boolean,
    "primary_color" text,
    "background_color" text,
    "welcome_page_title" text,
    "welcome_page_intro_message" text,
    "response_page_title" text,
    "response_page_prompt" text,
    "can_redirect" boolean,
    "redirect_link" text,
    "customer_name" text,
    "is_collecting_email" boolean,
    "is_email_address_required" boolean,
    "email_address" text,
    "is_collecting_phone" boolean,
    "is_phone_number_required" boolean,
    "phone_number" text
);


alter table "public"."templates_web" enable row level security;

alter table "public"."locations" add column "stored_logo_url" text;

CREATE UNIQUE INDEX email_templates_pkey ON public.templates_email USING btree (id);

CREATE UNIQUE INDEX web_templates_pkey ON public.templates_web USING btree (id);

alter table "public"."templates_email" add constraint "email_templates_pkey" PRIMARY KEY using index "email_templates_pkey";

alter table "public"."templates_web" add constraint "web_templates_pkey" PRIMARY KEY using index "web_templates_pkey";

alter table "public"."templates_email" add constraint "public_email_templates_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."templates_email" validate constraint "public_email_templates_location_id_fkey";

alter table "public"."templates_web" add constraint "public_web_templates_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."templates_web" validate constraint "public_web_templates_location_id_fkey";

grant delete on table "public"."templates_email" to "anon";

grant insert on table "public"."templates_email" to "anon";

grant references on table "public"."templates_email" to "anon";

grant select on table "public"."templates_email" to "anon";

grant trigger on table "public"."templates_email" to "anon";

grant truncate on table "public"."templates_email" to "anon";

grant update on table "public"."templates_email" to "anon";

grant delete on table "public"."templates_email" to "authenticated";

grant insert on table "public"."templates_email" to "authenticated";

grant references on table "public"."templates_email" to "authenticated";

grant select on table "public"."templates_email" to "authenticated";

grant trigger on table "public"."templates_email" to "authenticated";

grant truncate on table "public"."templates_email" to "authenticated";

grant update on table "public"."templates_email" to "authenticated";

grant delete on table "public"."templates_email" to "service_role";

grant insert on table "public"."templates_email" to "service_role";

grant references on table "public"."templates_email" to "service_role";

grant select on table "public"."templates_email" to "service_role";

grant trigger on table "public"."templates_email" to "service_role";

grant truncate on table "public"."templates_email" to "service_role";

grant update on table "public"."templates_email" to "service_role";

grant delete on table "public"."templates_web" to "anon";

grant insert on table "public"."templates_web" to "anon";

grant references on table "public"."templates_web" to "anon";

grant select on table "public"."templates_web" to "anon";

grant trigger on table "public"."templates_web" to "anon";

grant truncate on table "public"."templates_web" to "anon";

grant update on table "public"."templates_web" to "anon";

grant delete on table "public"."templates_web" to "authenticated";

grant insert on table "public"."templates_web" to "authenticated";

grant references on table "public"."templates_web" to "authenticated";

grant select on table "public"."templates_web" to "authenticated";

grant trigger on table "public"."templates_web" to "authenticated";

grant truncate on table "public"."templates_web" to "authenticated";

grant update on table "public"."templates_web" to "authenticated";

grant delete on table "public"."templates_web" to "service_role";

grant insert on table "public"."templates_web" to "service_role";

grant references on table "public"."templates_web" to "service_role";

grant select on table "public"."templates_web" to "service_role";

grant trigger on table "public"."templates_web" to "service_role";

grant truncate on table "public"."templates_web" to "service_role";

grant update on table "public"."templates_web" to "service_role";



