alter table "public"."reviews" drop column "yelp_review_id";

alter table "public"."reviews" add column "source_review_id" text;



