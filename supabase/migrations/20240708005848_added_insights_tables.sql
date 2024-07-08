create table "public"."business_categories" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid not null,
    "location_id" uuid not null,
    "name" text not null,
    "context" text
);


alter table "public"."business_categories" enable row level security;

create table "public"."business_category_mentions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "business_category_id" uuid,
    "review_id" uuid,
    "content" text,
    "sentiment" text
);


alter table "public"."business_category_mentions" enable row level security;

create table "public"."detailed_aspects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "aspec" text,
    "detail" text,
    "impact" text,
    "sentiment" text
);


alter table "public"."detailed_aspects" enable row level security;

create table "public"."keywords" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "business_category_id" uuid,
    "review_id" uuid,
    "name" text,
    "sentiment" text
);


alter table "public"."keywords" enable row level security;

create table "public"."product_service_feedback" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "item" text,
    "feedback" text
);


alter table "public"."product_service_feedback" enable row level security;

create table "public"."review_responses" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "response_text" text
);


alter table "public"."review_responses" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "yelp_review_id" text not null,
    "timestamp" text,
    "rating" bigint,
    "customer_name" text,
    "customer_profile_url" text,
    "customer_image_url" text,
    "review_text" text,
    "has_responded_to" boolean not null default false,
    "sentiment" text,
    "summary" text,
    "return_likelihood" text,
    "source" text
);


alter table "public"."reviews" enable row level security;

create table "public"."staff_mentions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "location_id" uuid,
    "review_id" uuid,
    "employee_name" text,
    "context" text
);


alter table "public"."staff_mentions" enable row level security;

CREATE UNIQUE INDEX business_categories_pkey ON public.business_categories USING btree (id);

CREATE UNIQUE INDEX business_category_mentions_pkey ON public.business_category_mentions USING btree (id);

CREATE UNIQUE INDEX detailed_aspects_pkey ON public.detailed_aspects USING btree (id);

CREATE UNIQUE INDEX keywords_pkey ON public.keywords USING btree (id);

CREATE UNIQUE INDEX product_service_feedback_pkey ON public.product_service_feedback USING btree (id);

CREATE UNIQUE INDEX review_responses_pkey ON public.review_responses USING btree (id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX staff_mentions_pkey ON public.staff_mentions USING btree (id);

alter table "public"."business_categories" add constraint "business_categories_pkey" PRIMARY KEY using index "business_categories_pkey";

alter table "public"."business_category_mentions" add constraint "business_category_mentions_pkey" PRIMARY KEY using index "business_category_mentions_pkey";

alter table "public"."detailed_aspects" add constraint "detailed_aspects_pkey" PRIMARY KEY using index "detailed_aspects_pkey";

alter table "public"."keywords" add constraint "keywords_pkey" PRIMARY KEY using index "keywords_pkey";

alter table "public"."product_service_feedback" add constraint "product_service_feedback_pkey" PRIMARY KEY using index "product_service_feedback_pkey";

alter table "public"."review_responses" add constraint "review_responses_pkey" PRIMARY KEY using index "review_responses_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."staff_mentions" add constraint "staff_mentions_pkey" PRIMARY KEY using index "staff_mentions_pkey";

alter table "public"."business_categories" add constraint "public_business_categories_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."business_categories" validate constraint "public_business_categories_location_id_fkey";

alter table "public"."business_categories" add constraint "public_business_categories_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."business_categories" validate constraint "public_business_categories_review_id_fkey";

alter table "public"."business_category_mentions" add constraint "public_business_category_mentions_business_category_id_fkey" FOREIGN KEY (business_category_id) REFERENCES business_categories(id) ON DELETE CASCADE not valid;

alter table "public"."business_category_mentions" validate constraint "public_business_category_mentions_business_category_id_fkey";

alter table "public"."business_category_mentions" add constraint "public_business_category_mentions_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."business_category_mentions" validate constraint "public_business_category_mentions_review_id_fkey";

alter table "public"."detailed_aspects" add constraint "public_detailed_aspects_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."detailed_aspects" validate constraint "public_detailed_aspects_review_id_fkey";

alter table "public"."keywords" add constraint "public_keywords_business_category_id_fkey" FOREIGN KEY (business_category_id) REFERENCES business_categories(id) ON DELETE CASCADE not valid;

alter table "public"."keywords" validate constraint "public_keywords_business_category_id_fkey";

alter table "public"."keywords" add constraint "public_keywords_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."keywords" validate constraint "public_keywords_review_id_fkey";

alter table "public"."product_service_feedback" add constraint "public_product_service_feedback_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."product_service_feedback" validate constraint "public_product_service_feedback_location_id_fkey";

alter table "public"."product_service_feedback" add constraint "public_product_service_feedback_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."product_service_feedback" validate constraint "public_product_service_feedback_review_id_fkey";

alter table "public"."review_responses" add constraint "public_review_responses_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."review_responses" validate constraint "public_review_responses_review_id_fkey";

alter table "public"."reviews" add constraint "public_reviews_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "public_reviews_location_id_fkey";

alter table "public"."staff_mentions" add constraint "public_staff_mentions_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."staff_mentions" validate constraint "public_staff_mentions_location_id_fkey";

alter table "public"."staff_mentions" add constraint "public_staff_mentions_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."staff_mentions" validate constraint "public_staff_mentions_review_id_fkey";

grant delete on table "public"."business_categories" to "anon";

grant insert on table "public"."business_categories" to "anon";

grant references on table "public"."business_categories" to "anon";

grant select on table "public"."business_categories" to "anon";

grant trigger on table "public"."business_categories" to "anon";

grant truncate on table "public"."business_categories" to "anon";

grant update on table "public"."business_categories" to "anon";

grant delete on table "public"."business_categories" to "authenticated";

grant insert on table "public"."business_categories" to "authenticated";

grant references on table "public"."business_categories" to "authenticated";

grant select on table "public"."business_categories" to "authenticated";

grant trigger on table "public"."business_categories" to "authenticated";

grant truncate on table "public"."business_categories" to "authenticated";

grant update on table "public"."business_categories" to "authenticated";

grant delete on table "public"."business_categories" to "service_role";

grant insert on table "public"."business_categories" to "service_role";

grant references on table "public"."business_categories" to "service_role";

grant select on table "public"."business_categories" to "service_role";

grant trigger on table "public"."business_categories" to "service_role";

grant truncate on table "public"."business_categories" to "service_role";

grant update on table "public"."business_categories" to "service_role";

grant delete on table "public"."business_category_mentions" to "anon";

grant insert on table "public"."business_category_mentions" to "anon";

grant references on table "public"."business_category_mentions" to "anon";

grant select on table "public"."business_category_mentions" to "anon";

grant trigger on table "public"."business_category_mentions" to "anon";

grant truncate on table "public"."business_category_mentions" to "anon";

grant update on table "public"."business_category_mentions" to "anon";

grant delete on table "public"."business_category_mentions" to "authenticated";

grant insert on table "public"."business_category_mentions" to "authenticated";

grant references on table "public"."business_category_mentions" to "authenticated";

grant select on table "public"."business_category_mentions" to "authenticated";

grant trigger on table "public"."business_category_mentions" to "authenticated";

grant truncate on table "public"."business_category_mentions" to "authenticated";

grant update on table "public"."business_category_mentions" to "authenticated";

grant delete on table "public"."business_category_mentions" to "service_role";

grant insert on table "public"."business_category_mentions" to "service_role";

grant references on table "public"."business_category_mentions" to "service_role";

grant select on table "public"."business_category_mentions" to "service_role";

grant trigger on table "public"."business_category_mentions" to "service_role";

grant truncate on table "public"."business_category_mentions" to "service_role";

grant update on table "public"."business_category_mentions" to "service_role";

grant delete on table "public"."detailed_aspects" to "anon";

grant insert on table "public"."detailed_aspects" to "anon";

grant references on table "public"."detailed_aspects" to "anon";

grant select on table "public"."detailed_aspects" to "anon";

grant trigger on table "public"."detailed_aspects" to "anon";

grant truncate on table "public"."detailed_aspects" to "anon";

grant update on table "public"."detailed_aspects" to "anon";

grant delete on table "public"."detailed_aspects" to "authenticated";

grant insert on table "public"."detailed_aspects" to "authenticated";

grant references on table "public"."detailed_aspects" to "authenticated";

grant select on table "public"."detailed_aspects" to "authenticated";

grant trigger on table "public"."detailed_aspects" to "authenticated";

grant truncate on table "public"."detailed_aspects" to "authenticated";

grant update on table "public"."detailed_aspects" to "authenticated";

grant delete on table "public"."detailed_aspects" to "service_role";

grant insert on table "public"."detailed_aspects" to "service_role";

grant references on table "public"."detailed_aspects" to "service_role";

grant select on table "public"."detailed_aspects" to "service_role";

grant trigger on table "public"."detailed_aspects" to "service_role";

grant truncate on table "public"."detailed_aspects" to "service_role";

grant update on table "public"."detailed_aspects" to "service_role";

grant delete on table "public"."keywords" to "anon";

grant insert on table "public"."keywords" to "anon";

grant references on table "public"."keywords" to "anon";

grant select on table "public"."keywords" to "anon";

grant trigger on table "public"."keywords" to "anon";

grant truncate on table "public"."keywords" to "anon";

grant update on table "public"."keywords" to "anon";

grant delete on table "public"."keywords" to "authenticated";

grant insert on table "public"."keywords" to "authenticated";

grant references on table "public"."keywords" to "authenticated";

grant select on table "public"."keywords" to "authenticated";

grant trigger on table "public"."keywords" to "authenticated";

grant truncate on table "public"."keywords" to "authenticated";

grant update on table "public"."keywords" to "authenticated";

grant delete on table "public"."keywords" to "service_role";

grant insert on table "public"."keywords" to "service_role";

grant references on table "public"."keywords" to "service_role";

grant select on table "public"."keywords" to "service_role";

grant trigger on table "public"."keywords" to "service_role";

grant truncate on table "public"."keywords" to "service_role";

grant update on table "public"."keywords" to "service_role";

grant delete on table "public"."product_service_feedback" to "anon";

grant insert on table "public"."product_service_feedback" to "anon";

grant references on table "public"."product_service_feedback" to "anon";

grant select on table "public"."product_service_feedback" to "anon";

grant trigger on table "public"."product_service_feedback" to "anon";

grant truncate on table "public"."product_service_feedback" to "anon";

grant update on table "public"."product_service_feedback" to "anon";

grant delete on table "public"."product_service_feedback" to "authenticated";

grant insert on table "public"."product_service_feedback" to "authenticated";

grant references on table "public"."product_service_feedback" to "authenticated";

grant select on table "public"."product_service_feedback" to "authenticated";

grant trigger on table "public"."product_service_feedback" to "authenticated";

grant truncate on table "public"."product_service_feedback" to "authenticated";

grant update on table "public"."product_service_feedback" to "authenticated";

grant delete on table "public"."product_service_feedback" to "service_role";

grant insert on table "public"."product_service_feedback" to "service_role";

grant references on table "public"."product_service_feedback" to "service_role";

grant select on table "public"."product_service_feedback" to "service_role";

grant trigger on table "public"."product_service_feedback" to "service_role";

grant truncate on table "public"."product_service_feedback" to "service_role";

grant update on table "public"."product_service_feedback" to "service_role";

grant delete on table "public"."review_responses" to "anon";

grant insert on table "public"."review_responses" to "anon";

grant references on table "public"."review_responses" to "anon";

grant select on table "public"."review_responses" to "anon";

grant trigger on table "public"."review_responses" to "anon";

grant truncate on table "public"."review_responses" to "anon";

grant update on table "public"."review_responses" to "anon";

grant delete on table "public"."review_responses" to "authenticated";

grant insert on table "public"."review_responses" to "authenticated";

grant references on table "public"."review_responses" to "authenticated";

grant select on table "public"."review_responses" to "authenticated";

grant trigger on table "public"."review_responses" to "authenticated";

grant truncate on table "public"."review_responses" to "authenticated";

grant update on table "public"."review_responses" to "authenticated";

grant delete on table "public"."review_responses" to "service_role";

grant insert on table "public"."review_responses" to "service_role";

grant references on table "public"."review_responses" to "service_role";

grant select on table "public"."review_responses" to "service_role";

grant trigger on table "public"."review_responses" to "service_role";

grant truncate on table "public"."review_responses" to "service_role";

grant update on table "public"."review_responses" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."staff_mentions" to "anon";

grant insert on table "public"."staff_mentions" to "anon";

grant references on table "public"."staff_mentions" to "anon";

grant select on table "public"."staff_mentions" to "anon";

grant trigger on table "public"."staff_mentions" to "anon";

grant truncate on table "public"."staff_mentions" to "anon";

grant update on table "public"."staff_mentions" to "anon";

grant delete on table "public"."staff_mentions" to "authenticated";

grant insert on table "public"."staff_mentions" to "authenticated";

grant references on table "public"."staff_mentions" to "authenticated";

grant select on table "public"."staff_mentions" to "authenticated";

grant trigger on table "public"."staff_mentions" to "authenticated";

grant truncate on table "public"."staff_mentions" to "authenticated";

grant update on table "public"."staff_mentions" to "authenticated";

grant delete on table "public"."staff_mentions" to "service_role";

grant insert on table "public"."staff_mentions" to "service_role";

grant references on table "public"."staff_mentions" to "service_role";

grant select on table "public"."staff_mentions" to "service_role";

grant trigger on table "public"."staff_mentions" to "service_role";

grant truncate on table "public"."staff_mentions" to "service_role";

grant update on table "public"."staff_mentions" to "service_role";

create policy "Enable all CRUD operations"
on "public"."business_categories"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."business_category_mentions"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."detailed_aspects"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."keywords"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."product_service_feedback"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."review_responses"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."reviews"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."staff_mentions"
as permissive
for all
to public
using (true);




