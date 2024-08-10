alter table "public"."locations" drop column "daily_customers_count";

alter table "public"."locations" drop column "is_competitor";

alter table "public"."users" drop column "daily_customers_count";

alter table "public"."users" drop column "employee_count";

alter table "public"."users" drop column "organization_industry";

alter table "public"."users" drop column "pain_points";

alter table "public"."users" add column "business_category" text;

alter table "public"."users" add column "business_type" text;

alter table "public"."users" add column "testimonial_process" text;



