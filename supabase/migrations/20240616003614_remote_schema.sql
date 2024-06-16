revoke delete on table "public"."notes" from "anon";

revoke insert on table "public"."notes" from "anon";

revoke references on table "public"."notes" from "anon";

revoke select on table "public"."notes" from "anon";

revoke trigger on table "public"."notes" from "anon";

revoke truncate on table "public"."notes" from "anon";

revoke update on table "public"."notes" from "anon";

revoke delete on table "public"."notes" from "authenticated";

revoke insert on table "public"."notes" from "authenticated";

revoke references on table "public"."notes" from "authenticated";

revoke select on table "public"."notes" from "authenticated";

revoke trigger on table "public"."notes" from "authenticated";

revoke truncate on table "public"."notes" from "authenticated";

revoke update on table "public"."notes" from "authenticated";

revoke delete on table "public"."notes" from "service_role";

revoke insert on table "public"."notes" from "service_role";

revoke references on table "public"."notes" from "service_role";

revoke select on table "public"."notes" from "service_role";

revoke trigger on table "public"."notes" from "service_role";

revoke truncate on table "public"."notes" from "service_role";

revoke update on table "public"."notes" from "service_role";

revoke delete on table "public"."quotes" from "anon";

revoke insert on table "public"."quotes" from "anon";

revoke references on table "public"."quotes" from "anon";

revoke select on table "public"."quotes" from "anon";

revoke trigger on table "public"."quotes" from "anon";

revoke truncate on table "public"."quotes" from "anon";

revoke update on table "public"."quotes" from "anon";

revoke delete on table "public"."quotes" from "authenticated";

revoke insert on table "public"."quotes" from "authenticated";

revoke references on table "public"."quotes" from "authenticated";

revoke select on table "public"."quotes" from "authenticated";

revoke trigger on table "public"."quotes" from "authenticated";

revoke truncate on table "public"."quotes" from "authenticated";

revoke update on table "public"."quotes" from "authenticated";

revoke delete on table "public"."quotes" from "service_role";

revoke insert on table "public"."quotes" from "service_role";

revoke references on table "public"."quotes" from "service_role";

revoke select on table "public"."quotes" from "service_role";

revoke trigger on table "public"."quotes" from "service_role";

revoke truncate on table "public"."quotes" from "service_role";

revoke update on table "public"."quotes" from "service_role";

revoke delete on table "public"."todos" from "anon";

revoke insert on table "public"."todos" from "anon";

revoke references on table "public"."todos" from "anon";

revoke select on table "public"."todos" from "anon";

revoke trigger on table "public"."todos" from "anon";

revoke truncate on table "public"."todos" from "anon";

revoke update on table "public"."todos" from "anon";

revoke delete on table "public"."todos" from "authenticated";

revoke insert on table "public"."todos" from "authenticated";

revoke references on table "public"."todos" from "authenticated";

revoke select on table "public"."todos" from "authenticated";

revoke trigger on table "public"."todos" from "authenticated";

revoke truncate on table "public"."todos" from "authenticated";

revoke update on table "public"."todos" from "authenticated";

revoke delete on table "public"."todos" from "service_role";

revoke insert on table "public"."todos" from "service_role";

revoke references on table "public"."todos" from "service_role";

revoke select on table "public"."todos" from "service_role";

revoke trigger on table "public"."todos" from "service_role";

revoke truncate on table "public"."todos" from "service_role";

revoke update on table "public"."todos" from "service_role";

alter table "public"."notes" drop constraint "notes_pkey";

alter table "public"."quotes" drop constraint "quotes_pkey";

alter table "public"."todos" drop constraint "todos_pkey";

drop index if exists "public"."notes_pkey";

drop index if exists "public"."quotes_pkey";

drop index if exists "public"."todos_pkey";

drop table "public"."notes";

drop table "public"."quotes";

drop table "public"."todos";


