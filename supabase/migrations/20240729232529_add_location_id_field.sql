alter table "public"."keywords" add column "location_id" uuid;

alter table "public"."keywords" add constraint "public_keywords_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."keywords" validate constraint "public_keywords_location_id_fkey";



