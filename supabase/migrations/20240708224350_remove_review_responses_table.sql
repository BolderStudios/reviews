drop policy "Enable all CRUD operations" on "public"."review_responses";

revoke delete on table "public"."review_responses" from "anon";

revoke insert on table "public"."review_responses" from "anon";

revoke references on table "public"."review_responses" from "anon";

revoke select on table "public"."review_responses" from "anon";

revoke trigger on table "public"."review_responses" from "anon";

revoke truncate on table "public"."review_responses" from "anon";

revoke update on table "public"."review_responses" from "anon";

revoke delete on table "public"."review_responses" from "authenticated";

revoke insert on table "public"."review_responses" from "authenticated";

revoke references on table "public"."review_responses" from "authenticated";

revoke select on table "public"."review_responses" from "authenticated";

revoke trigger on table "public"."review_responses" from "authenticated";

revoke truncate on table "public"."review_responses" from "authenticated";

revoke update on table "public"."review_responses" from "authenticated";

revoke delete on table "public"."review_responses" from "service_role";

revoke insert on table "public"."review_responses" from "service_role";

revoke references on table "public"."review_responses" from "service_role";

revoke select on table "public"."review_responses" from "service_role";

revoke trigger on table "public"."review_responses" from "service_role";

revoke truncate on table "public"."review_responses" from "service_role";

revoke update on table "public"."review_responses" from "service_role";

alter table "public"."review_responses" drop constraint "public_review_responses_review_id_fkey";

alter table "public"."review_responses" drop constraint "review_responses_pkey";

drop index if exists "public"."review_responses_pkey";

drop table "public"."review_responses";

alter table "public"."business_category_mentions" drop column "content";

alter table "public"."business_category_mentions" add column "context" text;

alter table "public"."detailed_aspects" drop column "aspec";

alter table "public"."detailed_aspects" add column "aspect" text;

alter table "public"."reviews" add column "generated_response" text;



