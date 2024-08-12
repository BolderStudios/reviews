create table "public"."highlighted_words" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "word" text,
    "sentiment" text
);


alter table "public"."highlighted_words" enable row level security;

create table "public"."needs_improvement" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "label" text,
    "summary" text,
    "review_excerpt" text,
    "suggestion" text
);


alter table "public"."needs_improvement" enable row level security;

create table "public"."people_dont_like" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "label" text
);


alter table "public"."people_dont_like" enable row level security;

create table "public"."people_hate" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "label" text
);


alter table "public"."people_hate" enable row level security;

create table "public"."people_love" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "label" text
);


alter table "public"."people_love" enable row level security;

create table "public"."peoples_pains" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "location_id" uuid,
    "label" text
);


alter table "public"."peoples_pains" enable row level security;

create table "public"."review_topics" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "review_id" uuid,
    "topic" text,
    "count" bigint
);


alter table "public"."review_topics" enable row level security;

alter table "public"."strengths" drop column "name";

alter table "public"."strengths" add column "review_id" uuid;

alter table "public"."strengths" add column "strength" text;

alter table "public"."weaknesses" drop column "name";

alter table "public"."weaknesses" add column "review_id" uuid;

alter table "public"."weaknesses" add column "weakness" text;

CREATE UNIQUE INDEX highlighted_words_pkey ON public.highlighted_words USING btree (id);

CREATE UNIQUE INDEX needs_improvement_pkey ON public.needs_improvement USING btree (id);

CREATE UNIQUE INDEX people_dont_like_pkey ON public.people_dont_like USING btree (id);

CREATE UNIQUE INDEX people_hate_pkey ON public.people_hate USING btree (id);

CREATE UNIQUE INDEX people_love_pkey ON public.people_love USING btree (id);

CREATE UNIQUE INDEX peoples_pains_pkey ON public.peoples_pains USING btree (id);

CREATE UNIQUE INDEX review_topics_pkey ON public.review_topics USING btree (id);

alter table "public"."highlighted_words" add constraint "highlighted_words_pkey" PRIMARY KEY using index "highlighted_words_pkey";

alter table "public"."needs_improvement" add constraint "needs_improvement_pkey" PRIMARY KEY using index "needs_improvement_pkey";

alter table "public"."people_dont_like" add constraint "people_dont_like_pkey" PRIMARY KEY using index "people_dont_like_pkey";

alter table "public"."people_hate" add constraint "people_hate_pkey" PRIMARY KEY using index "people_hate_pkey";

alter table "public"."people_love" add constraint "people_love_pkey" PRIMARY KEY using index "people_love_pkey";

alter table "public"."peoples_pains" add constraint "peoples_pains_pkey" PRIMARY KEY using index "peoples_pains_pkey";

alter table "public"."review_topics" add constraint "review_topics_pkey" PRIMARY KEY using index "review_topics_pkey";

alter table "public"."highlighted_words" add constraint "public_highlighted_words_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."highlighted_words" validate constraint "public_highlighted_words_location_id_fkey";

alter table "public"."highlighted_words" add constraint "public_highlighted_words_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."highlighted_words" validate constraint "public_highlighted_words_review_id_fkey";

alter table "public"."needs_improvement" add constraint "public_needs_improvement_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."needs_improvement" validate constraint "public_needs_improvement_location_id_fkey";

alter table "public"."needs_improvement" add constraint "public_needs_improvement_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."needs_improvement" validate constraint "public_needs_improvement_review_id_fkey";

alter table "public"."people_dont_like" add constraint "public_people_dont_like_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."people_dont_like" validate constraint "public_people_dont_like_location_id_fkey";

alter table "public"."people_dont_like" add constraint "public_people_dont_like_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."people_dont_like" validate constraint "public_people_dont_like_review_id_fkey";

alter table "public"."people_hate" add constraint "public_people_hate_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."people_hate" validate constraint "public_people_hate_location_id_fkey";

alter table "public"."people_hate" add constraint "public_people_hate_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."people_hate" validate constraint "public_people_hate_review_id_fkey";

alter table "public"."people_love" add constraint "public_people_love_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."people_love" validate constraint "public_people_love_location_id_fkey";

alter table "public"."people_love" add constraint "public_people_love_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."people_love" validate constraint "public_people_love_review_id_fkey";

alter table "public"."peoples_pains" add constraint "public_peoples_pains_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."peoples_pains" validate constraint "public_peoples_pains_location_id_fkey";

alter table "public"."peoples_pains" add constraint "public_peoples_pains_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."peoples_pains" validate constraint "public_peoples_pains_review_id_fkey";

alter table "public"."review_topics" add constraint "public_review_topics_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."review_topics" validate constraint "public_review_topics_review_id_fkey";

alter table "public"."strengths" add constraint "public_strengths_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."strengths" validate constraint "public_strengths_review_id_fkey";

alter table "public"."weaknesses" add constraint "public_weaknesses_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."weaknesses" validate constraint "public_weaknesses_review_id_fkey";

grant delete on table "public"."highlighted_words" to "anon";

grant insert on table "public"."highlighted_words" to "anon";

grant references on table "public"."highlighted_words" to "anon";

grant select on table "public"."highlighted_words" to "anon";

grant trigger on table "public"."highlighted_words" to "anon";

grant truncate on table "public"."highlighted_words" to "anon";

grant update on table "public"."highlighted_words" to "anon";

grant delete on table "public"."highlighted_words" to "authenticated";

grant insert on table "public"."highlighted_words" to "authenticated";

grant references on table "public"."highlighted_words" to "authenticated";

grant select on table "public"."highlighted_words" to "authenticated";

grant trigger on table "public"."highlighted_words" to "authenticated";

grant truncate on table "public"."highlighted_words" to "authenticated";

grant update on table "public"."highlighted_words" to "authenticated";

grant delete on table "public"."highlighted_words" to "service_role";

grant insert on table "public"."highlighted_words" to "service_role";

grant references on table "public"."highlighted_words" to "service_role";

grant select on table "public"."highlighted_words" to "service_role";

grant trigger on table "public"."highlighted_words" to "service_role";

grant truncate on table "public"."highlighted_words" to "service_role";

grant update on table "public"."highlighted_words" to "service_role";

grant delete on table "public"."needs_improvement" to "anon";

grant insert on table "public"."needs_improvement" to "anon";

grant references on table "public"."needs_improvement" to "anon";

grant select on table "public"."needs_improvement" to "anon";

grant trigger on table "public"."needs_improvement" to "anon";

grant truncate on table "public"."needs_improvement" to "anon";

grant update on table "public"."needs_improvement" to "anon";

grant delete on table "public"."needs_improvement" to "authenticated";

grant insert on table "public"."needs_improvement" to "authenticated";

grant references on table "public"."needs_improvement" to "authenticated";

grant select on table "public"."needs_improvement" to "authenticated";

grant trigger on table "public"."needs_improvement" to "authenticated";

grant truncate on table "public"."needs_improvement" to "authenticated";

grant update on table "public"."needs_improvement" to "authenticated";

grant delete on table "public"."needs_improvement" to "service_role";

grant insert on table "public"."needs_improvement" to "service_role";

grant references on table "public"."needs_improvement" to "service_role";

grant select on table "public"."needs_improvement" to "service_role";

grant trigger on table "public"."needs_improvement" to "service_role";

grant truncate on table "public"."needs_improvement" to "service_role";

grant update on table "public"."needs_improvement" to "service_role";

grant delete on table "public"."people_dont_like" to "anon";

grant insert on table "public"."people_dont_like" to "anon";

grant references on table "public"."people_dont_like" to "anon";

grant select on table "public"."people_dont_like" to "anon";

grant trigger on table "public"."people_dont_like" to "anon";

grant truncate on table "public"."people_dont_like" to "anon";

grant update on table "public"."people_dont_like" to "anon";

grant delete on table "public"."people_dont_like" to "authenticated";

grant insert on table "public"."people_dont_like" to "authenticated";

grant references on table "public"."people_dont_like" to "authenticated";

grant select on table "public"."people_dont_like" to "authenticated";

grant trigger on table "public"."people_dont_like" to "authenticated";

grant truncate on table "public"."people_dont_like" to "authenticated";

grant update on table "public"."people_dont_like" to "authenticated";

grant delete on table "public"."people_dont_like" to "service_role";

grant insert on table "public"."people_dont_like" to "service_role";

grant references on table "public"."people_dont_like" to "service_role";

grant select on table "public"."people_dont_like" to "service_role";

grant trigger on table "public"."people_dont_like" to "service_role";

grant truncate on table "public"."people_dont_like" to "service_role";

grant update on table "public"."people_dont_like" to "service_role";

grant delete on table "public"."people_hate" to "anon";

grant insert on table "public"."people_hate" to "anon";

grant references on table "public"."people_hate" to "anon";

grant select on table "public"."people_hate" to "anon";

grant trigger on table "public"."people_hate" to "anon";

grant truncate on table "public"."people_hate" to "anon";

grant update on table "public"."people_hate" to "anon";

grant delete on table "public"."people_hate" to "authenticated";

grant insert on table "public"."people_hate" to "authenticated";

grant references on table "public"."people_hate" to "authenticated";

grant select on table "public"."people_hate" to "authenticated";

grant trigger on table "public"."people_hate" to "authenticated";

grant truncate on table "public"."people_hate" to "authenticated";

grant update on table "public"."people_hate" to "authenticated";

grant delete on table "public"."people_hate" to "service_role";

grant insert on table "public"."people_hate" to "service_role";

grant references on table "public"."people_hate" to "service_role";

grant select on table "public"."people_hate" to "service_role";

grant trigger on table "public"."people_hate" to "service_role";

grant truncate on table "public"."people_hate" to "service_role";

grant update on table "public"."people_hate" to "service_role";

grant delete on table "public"."people_love" to "anon";

grant insert on table "public"."people_love" to "anon";

grant references on table "public"."people_love" to "anon";

grant select on table "public"."people_love" to "anon";

grant trigger on table "public"."people_love" to "anon";

grant truncate on table "public"."people_love" to "anon";

grant update on table "public"."people_love" to "anon";

grant delete on table "public"."people_love" to "authenticated";

grant insert on table "public"."people_love" to "authenticated";

grant references on table "public"."people_love" to "authenticated";

grant select on table "public"."people_love" to "authenticated";

grant trigger on table "public"."people_love" to "authenticated";

grant truncate on table "public"."people_love" to "authenticated";

grant update on table "public"."people_love" to "authenticated";

grant delete on table "public"."people_love" to "service_role";

grant insert on table "public"."people_love" to "service_role";

grant references on table "public"."people_love" to "service_role";

grant select on table "public"."people_love" to "service_role";

grant trigger on table "public"."people_love" to "service_role";

grant truncate on table "public"."people_love" to "service_role";

grant update on table "public"."people_love" to "service_role";

grant delete on table "public"."peoples_pains" to "anon";

grant insert on table "public"."peoples_pains" to "anon";

grant references on table "public"."peoples_pains" to "anon";

grant select on table "public"."peoples_pains" to "anon";

grant trigger on table "public"."peoples_pains" to "anon";

grant truncate on table "public"."peoples_pains" to "anon";

grant update on table "public"."peoples_pains" to "anon";

grant delete on table "public"."peoples_pains" to "authenticated";

grant insert on table "public"."peoples_pains" to "authenticated";

grant references on table "public"."peoples_pains" to "authenticated";

grant select on table "public"."peoples_pains" to "authenticated";

grant trigger on table "public"."peoples_pains" to "authenticated";

grant truncate on table "public"."peoples_pains" to "authenticated";

grant update on table "public"."peoples_pains" to "authenticated";

grant delete on table "public"."peoples_pains" to "service_role";

grant insert on table "public"."peoples_pains" to "service_role";

grant references on table "public"."peoples_pains" to "service_role";

grant select on table "public"."peoples_pains" to "service_role";

grant trigger on table "public"."peoples_pains" to "service_role";

grant truncate on table "public"."peoples_pains" to "service_role";

grant update on table "public"."peoples_pains" to "service_role";

grant delete on table "public"."review_topics" to "anon";

grant insert on table "public"."review_topics" to "anon";

grant references on table "public"."review_topics" to "anon";

grant select on table "public"."review_topics" to "anon";

grant trigger on table "public"."review_topics" to "anon";

grant truncate on table "public"."review_topics" to "anon";

grant update on table "public"."review_topics" to "anon";

grant delete on table "public"."review_topics" to "authenticated";

grant insert on table "public"."review_topics" to "authenticated";

grant references on table "public"."review_topics" to "authenticated";

grant select on table "public"."review_topics" to "authenticated";

grant trigger on table "public"."review_topics" to "authenticated";

grant truncate on table "public"."review_topics" to "authenticated";

grant update on table "public"."review_topics" to "authenticated";

grant delete on table "public"."review_topics" to "service_role";

grant insert on table "public"."review_topics" to "service_role";

grant references on table "public"."review_topics" to "service_role";

grant select on table "public"."review_topics" to "service_role";

grant trigger on table "public"."review_topics" to "service_role";

grant truncate on table "public"."review_topics" to "service_role";

grant update on table "public"."review_topics" to "service_role";

create policy "Enable all CRUD operations"
on "public"."highlighted_words"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."needs_improvement"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."people_dont_like"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."people_hate"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."people_love"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."peoples_pains"
as permissive
for all
to public
using (true);


create policy "Enable all CRUD operations"
on "public"."review_topics"
as permissive
for all
to public
using (true);




