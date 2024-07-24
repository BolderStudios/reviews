create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "email_address" text,
    "phone_number" text,
    "location_id" uuid
);


alter table "public"."customers" enable row level security;

create table "public"."requests" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "received" boolean not null default false,
    "opened" boolean not null default false,
    "clicked" boolean not null default false,
    "redirected" boolean not null default false,
    "passed" boolean not null default false,
    "location_id" uuid,
    "customer_id" uuid,
    "source" text,
    "date" text
);


alter table "public"."requests" enable row level security;

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX email_campaign_pkey ON public.requests USING btree (id);

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."requests" add constraint "email_campaign_pkey" PRIMARY KEY using index "email_campaign_pkey";

alter table "public"."customers" add constraint "public_customers_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "public_customers_location_id_fkey";

alter table "public"."requests" add constraint "public_email_campaigns_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE not valid;

alter table "public"."requests" validate constraint "public_email_campaigns_customer_id_fkey";

alter table "public"."requests" add constraint "public_email_campaigns_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."requests" validate constraint "public_email_campaigns_location_id_fkey";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."requests" to "anon";

grant insert on table "public"."requests" to "anon";

grant references on table "public"."requests" to "anon";

grant select on table "public"."requests" to "anon";

grant trigger on table "public"."requests" to "anon";

grant truncate on table "public"."requests" to "anon";

grant update on table "public"."requests" to "anon";

grant delete on table "public"."requests" to "authenticated";

grant insert on table "public"."requests" to "authenticated";

grant references on table "public"."requests" to "authenticated";

grant select on table "public"."requests" to "authenticated";

grant trigger on table "public"."requests" to "authenticated";

grant truncate on table "public"."requests" to "authenticated";

grant update on table "public"."requests" to "authenticated";

grant delete on table "public"."requests" to "service_role";

grant insert on table "public"."requests" to "service_role";

grant references on table "public"."requests" to "service_role";

grant select on table "public"."requests" to "service_role";

grant trigger on table "public"."requests" to "service_role";

grant truncate on table "public"."requests" to "service_role";

grant update on table "public"."requests" to "service_role";

create policy "Enable all CRUD operations"
on "public"."customers"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."requests"
as permissive
for all
to public
using (true);




