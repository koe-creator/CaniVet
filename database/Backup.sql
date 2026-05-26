--
-- PostgreSQL database dump
--

\restrict SXt0K6eW5CGWxrrAzqDFTEGvxnmehC69oDUVtur0Bcz1RtZpe7rraI1bWTf98Hm

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL AND ppt.tablename NOT LIKE '% %'),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  -- Count raw slot entries before apply_rls/subscription filter
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  -- Apply RLS and filter as before
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  -- Real rows with slot count attached
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  -- Sentinel row: always returned when no real rows exist so Elixir can
  -- always read slot_changes_count. Identified by wal IS NULL.
  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accion text,
    entidad text,
    entidad_id text,
    descripcion text,
    usuario_email text,
    sucursal_id text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mascota_id uuid,
    servicio_id uuid,
    fecha date,
    hora time without time zone,
    estado text DEFAULT 'pendiente'::text,
    created_at timestamp without time zone DEFAULT now(),
    notas text,
    cliente_id uuid
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    telefono text,
    email text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: facturas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facturas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero text,
    estado text DEFAULT 'pagado'::text,
    emitida_el timestamp with time zone,
    pago_id text,
    cliente_id uuid,
    cliente_nombre text,
    cliente_contacto text,
    sucursal_id text,
    sucursal_nombre text,
    fecha date,
    metodo text,
    subtotal numeric DEFAULT 0,
    impuesto numeric DEFAULT 0,
    total numeric DEFAULT 0,
    notas text,
    concepto text,
    items_json jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.facturas OWNER TO postgres;

--
-- Name: fotos_servicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fotos_servicio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cita_id text NOT NULL,
    tipo text NOT NULL,
    data_url text NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fotos_servicio OWNER TO postgres;

--
-- Name: guarderia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guarderia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mascota_id uuid,
    mascota_nombre text,
    cliente_id uuid,
    cliente_nombre text,
    fecha date NOT NULL,
    check_in time without time zone,
    check_out time without time zone,
    notas text,
    sucursal_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.guarderia OWNER TO postgres;

--
-- Name: historial_clinico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_clinico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mascota_id uuid,
    fecha_consulta date NOT NULL,
    motivo text NOT NULL,
    sintomas text,
    diagnostico text,
    tratamiento text,
    observaciones text,
    peso numeric,
    veterinario text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.historial_clinico OWNER TO postgres;

--
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    producto text,
    cantidad integer,
    precio numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- Name: mascotas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mascotas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    raza text,
    edad integer,
    cliente_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    tipo text DEFAULT 'Perro'::text,
    peso numeric
);


ALTER TABLE public.mascotas OWNER TO postgres;

--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo text,
    titulo text,
    mensaje text,
    canal text DEFAULT 'interna'::text,
    estado text DEFAULT 'enviada'::text,
    destinatario text,
    cliente_id uuid,
    cliente_nombre text,
    sucursal_id text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid,
    monto numeric,
    metodo text,
    estado text DEFAULT 'pagado'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: pagos_online; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos_online (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stripe_session_id text,
    referencia text,
    url_pago text,
    cita_id text,
    cliente_id uuid,
    cliente_nombre text,
    cliente_contacto text,
    mascota_nombre text,
    servicio_nombre text,
    monto numeric DEFAULT 0,
    moneda text DEFAULT 'DOP'::text,
    estado text DEFAULT 'enviado'::text,
    sucursal_id text,
    sucursal_nombre text,
    origen text DEFAULT 'manual'::text,
    notas text,
    pago_id text,
    expira_el timestamp with time zone,
    pagado_el timestamp with time zone,
    ultimo_evento text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.pagos_online OWNER TO postgres;

--
-- Name: paseos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paseos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mascota_id uuid,
    mascota_nombre text,
    cliente_id uuid,
    cliente_nombre text,
    fecha date,
    hora_inicio time without time zone,
    hora_fin time without time zone,
    duracion text,
    distancia numeric,
    paseador text,
    ruta text,
    estado text DEFAULT 'programado'::text,
    notas text,
    sucursal_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.paseos OWNER TO postgres;

--
-- Name: reservas_online; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas_online (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    email text,
    telefono text,
    mascota_nombre text,
    servicio_id uuid,
    servicio_nombre text,
    fecha date,
    hora time without time zone,
    notas text,
    estado text DEFAULT 'pendiente'::text,
    cita_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reservas_online OWNER TO postgres;

--
-- Name: servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    precio numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.servicios OWNER TO postgres;

--
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    ciudad text,
    estado text DEFAULT 'Activa'::text,
    es_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- Name: suscripciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suscripciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid,
    cliente_nombre text,
    mascota_id uuid,
    mascota_nombre text,
    servicio_nombre text,
    plan text DEFAULT 'mensual'::text,
    monto numeric DEFAULT 0,
    fecha_inicio date,
    proximo_cobro date,
    estado text DEFAULT 'activa'::text,
    notas text,
    sucursal_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.suscripciones OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: usuarios_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_sistema (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    nombre text,
    rol text DEFAULT 'user'::text,
    estado text DEFAULT 'activo'::text,
    sucursal_ids jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.usuarios_sistema OWNER TO postgres;

--
-- Name: vacunas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vacunas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mascota_id uuid,
    nombre text NOT NULL,
    aplicada_el date,
    proxima_dosis date,
    veterinario text,
    notas text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.vacunas OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
a227435c-4d8d-409f-a774-b068443a6f66	a227435c-4d8d-409f-a774-b068443a6f66	{"sub": "a227435c-4d8d-409f-a774-b068443a6f66", "email": "yeuriloren02@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-05-01 15:54:46.945528+00	2026-05-01 15:54:46.945597+00	2026-05-01 15:54:46.945597+00	5b1c0e10-c99b-49d2-bc9e-653f655741fd
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
ede3117b-b0f5-4cae-86e3-893dca7b16d2	2026-05-14 14:41:53.351968+00	2026-05-14 14:41:53.351968+00	password	46936a70-3255-4493-8f9f-6d3c4db738de
735bace9-e0f4-4f78-b3fd-79f49c25d802	2026-05-21 05:46:35.785306+00	2026-05-21 05:46:35.785306+00	password	7d938bf0-2a40-4cdb-9d21-bbc035b7d5b1
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	46	jzumijovjaw3	a227435c-4d8d-409f-a774-b068443a6f66	t	2026-05-14 14:41:53.336404+00	2026-05-21 05:46:29.61507+00	\N	ede3117b-b0f5-4cae-86e3-893dca7b16d2
00000000-0000-0000-0000-000000000000	47	hltv5d6ahnrk	a227435c-4d8d-409f-a774-b068443a6f66	f	2026-05-21 05:46:29.647713+00	2026-05-21 05:46:29.647713+00	jzumijovjaw3	ede3117b-b0f5-4cae-86e3-893dca7b16d2
00000000-0000-0000-0000-000000000000	48	4l3fksob6ukr	a227435c-4d8d-409f-a774-b068443a6f66	t	2026-05-21 05:46:35.782236+00	2026-05-21 06:49:17.957171+00	\N	735bace9-e0f4-4f78-b3fd-79f49c25d802
00000000-0000-0000-0000-000000000000	49	d6i6hvfqolah	a227435c-4d8d-409f-a774-b068443a6f66	t	2026-05-21 06:49:17.970917+00	2026-05-21 11:52:14.258714+00	4l3fksob6ukr	735bace9-e0f4-4f78-b3fd-79f49c25d802
00000000-0000-0000-0000-000000000000	50	36nknmun7sdk	a227435c-4d8d-409f-a774-b068443a6f66	t	2026-05-21 11:52:14.29233+00	2026-05-21 13:36:55.821807+00	d6i6hvfqolah	735bace9-e0f4-4f78-b3fd-79f49c25d802
00000000-0000-0000-0000-000000000000	51	4dswi4jv3xu4	a227435c-4d8d-409f-a774-b068443a6f66	f	2026-05-21 13:36:55.833953+00	2026-05-21 13:36:55.833953+00	36nknmun7sdk	735bace9-e0f4-4f78-b3fd-79f49c25d802
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
ede3117b-b0f5-4cae-86e3-893dca7b16d2	a227435c-4d8d-409f-a774-b068443a6f66	2026-05-14 14:41:53.305954+00	2026-05-21 05:46:29.673031+00	\N	aal1	\N	2026-05-21 05:46:29.672885	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	45.176.95.13	\N	\N	\N	\N	\N
735bace9-e0f4-4f78-b3fd-79f49c25d802	a227435c-4d8d-409f-a774-b068443a6f66	2026-05-21 05:46:35.774872+00	2026-05-21 13:36:55.861364+00	\N	aal1	\N	2026-05-21 13:36:55.861245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	149.2.82.62	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	a227435c-4d8d-409f-a774-b068443a6f66	authenticated	authenticated	yeuriloren02@gmail.com	$2a$10$B3oq16kyufyf9uWrNQHRyuKCKjBBY8TsE.inLiH8cEb0bkZctJy66	2026-05-01 15:54:46.966658+00	\N		\N		\N			\N	2026-05-21 05:46:35.774748+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-05-01 15:54:46.922172+00	2026-05-21 13:36:55.844279+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria (id, accion, entidad, entidad_id, descripcion, usuario_email, sucursal_id, created_at) FROM stdin;
0b1b7605-c611-4b0a-9637-2c23280029ef	crear	subscriptions	5c854a2b-dfa8-4616-9b72-39c6a742f297	Suscripcion creada: Daryl Diaz - m,	yeuriloren02@gmail.com	branch_central	2026-05-14 07:52:13.490332+00
2e1b2010-8f02-47b5-9b67-cbdcaf240349	crear	daycare	7e3fae0b-8360-48ef-9599-28dd8a76a54f	Asistencia guarderia registrada: Princesa - 2026-05-14	yeuriloren02@gmail.com	branch_central	2026-05-14 07:57:12.960721+00
abe68685-e466-4f4c-bc5e-feb2b1865253	crear	walks	78e8a0db-4b77-42d3-bfbb-66913abe7ed9	Paseo creado: Princesa - 2026-05-14	yeuriloren02@gmail.com	branch_central	2026-05-14 07:58:26.618548+00
\.


--
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id, mascota_id, servicio_id, fecha, hora, estado, created_at, notas, cliente_id) FROM stdin;
79df6935-0fcc-496a-852a-e550cde8b6fa	c624fb4c-6d07-4e56-b65f-168ca795a8a3	06dec459-85b1-464e-8e71-d8c6f1915f4d	2026-05-11	19:25:00	pendiente	2026-05-11 23:18:02.374754		6d0881f9-37d5-42ba-8d31-ced71a38b784
770a5012-98bc-4db0-8d27-4e4dece20fb6	981906cf-7d92-42c9-b8f9-32234c23d9ae	19b6c28f-7c76-4446-9458-0d7bd61f06e5	2026-05-15	06:12:00	pendiente	2026-05-14 08:11:34.958207	 .,,m ,m. ml	476c4c73-fec0-43f2-9384-bda512d5a496
8f234759-ba16-49de-8224-f5c1a9240e20	12917607-8aec-4829-9a04-0539ca7b84f6	3244ab3a-94cd-4998-971d-e99c79369f6c	2026-05-15	11:41:00	pendiente	2026-05-14 14:46:24.73351	Reserva online de carlooo (carloscamacho9700@gmail.com). Mascota: perry. Nota: Cortame las uñas	20ebd15e-3c54-4e10-b25a-7b944a958e13
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nombre, telefono, email, created_at) FROM stdin;
6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	849-387-3463	yeurilorenzo55@gmail.com	2026-05-11 23:15:18.515576
476c4c73-fec0-43f2-9384-bda512d5a496	Jefferson Lorenzo	989-989-3211	yeurilorenzo041@gmail.com	2026-05-14 05:49:21.933499
20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	893-223-2321	carloscamacho970@gmail.com	2026-05-14 14:44:31.932179
\.


--
-- Data for Name: facturas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facturas (id, numero, estado, emitida_el, pago_id, cliente_id, cliente_nombre, cliente_contacto, sucursal_id, sucursal_nombre, fecha, metodo, subtotal, impuesto, total, notas, concepto, items_json, created_at) FROM stdin;
\.


--
-- Data for Name: fotos_servicio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fotos_servicio (id, cita_id, tipo, data_url, descripcion, created_at) FROM stdin;
cb0f3e0c-ccc0-4a2f-b0e6-271080cdfcb6	e1b19aff-a8cf-4772-a536-810046cda156	antes	data:image/jpeg;base64,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	\N	2026-05-07 04:22:45.660709+00
aa4ca078-479b-4801-bcf2-81d1a6e7339a	e1b19aff-a8cf-4772-a536-810046cda156	despues	data:image/jpeg;base64,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	\N	2026-05-07 04:23:10.663007+00
3f32aa5d-397c-463a-a437-6c6b893f41a7	79df6935-0fcc-496a-852a-e550cde8b6fa	antes	data:image/jpeg;base64,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	\N	2026-05-14 08:11:58.217118+00
baf459e5-5865-410e-ae5c-1c81c642e2b8	79df6935-0fcc-496a-852a-e550cde8b6fa	despues	data:image/jpeg;base64,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	\N	2026-05-14 08:12:42.628333+00
\.


--
-- Data for Name: guarderia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guarderia (id, mascota_id, mascota_nombre, cliente_id, cliente_nombre, fecha, check_in, check_out, notas, sucursal_id, created_at, updated_at) FROM stdin;
7e3fae0b-8360-48ef-9599-28dd8a76a54f	c624fb4c-6d07-4e56-b65f-168ca795a8a3	Princesa	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	2026-05-14	03:56:00	06:00:00	m,	branch_central	2026-05-14 07:57:12.813152+00	2026-05-14 07:57:12.813152+00
\.


--
-- Data for Name: historial_clinico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_clinico (id, mascota_id, fecha_consulta, motivo, sintomas, diagnostico, tratamiento, observaciones, peso, veterinario, created_at, updated_at) FROM stdin;
c354067b-6695-4278-b875-7490cc8333c5	c624fb4c-6d07-4e56-b65f-168ca795a8a3	2026-05-21	SOBREPESO	vomitos	quien sabe 	no coma tantooo	come mucho\n	16	Dr. Yeu	2026-05-14 08:19:14.016708+00	2026-05-14 08:19:14.016708+00
\.


--
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id, producto, cantidad, precio, created_at) FROM stdin;
e5305b71-8823-4bf5-8cd7-33784a73e2f3	Bozal Para Perros 	7	500	2026-05-11 23:23:42.745721
\.


--
-- Data for Name: mascotas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mascotas (id, nombre, raza, edad, cliente_id, created_at, tipo, peso) FROM stdin;
c624fb4c-6d07-4e56-b65f-168ca795a8a3	Princesa	pitbull	1	6d0881f9-37d5-42ba-8d31-ced71a38b784	2026-05-11 23:17:06.371359	Perro	\N
1813e4f8-0c66-4d83-bdf3-1df1b0c63b86	Negritp	labrador	2	476c4c73-fec0-43f2-9384-bda512d5a496	2026-05-14 08:08:09.985	Perro	\N
981906cf-7d92-42c9-b8f9-32234c23d9ae	negriii	husky	7	476c4c73-fec0-43f2-9384-bda512d5a496	2026-05-14 08:11:01.751157	Perro	\N
12917607-8aec-4829-9a04-0539ca7b84f6	perry	labrador 	2	20ebd15e-3c54-4e10-b25a-7b944a958e13	2026-05-14 14:46:02.717381	Perro	\N
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notificaciones (id, tipo, titulo, mensaje, canal, estado, destinatario, cliente_id, cliente_nombre, sucursal_id, created_at) FROM stdin;
43ee5f9c-4dac-44b9-ac6d-0736e380f631	manual	mnbkbnok´{	jm k l 	email	enviada	yeurilorenzo55@gmail.com	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	branch_central	2026-05-14 07:52:53.097003+00
e21973e3-a895-4368-8efc-e17f25a3256b	vacuna	Vacuna programada	Rabia para Princesa queda proxima con proxima dosis el 2026-05-30.	email	enviada	yeurilorenzo55@gmail.com	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	branch_central	2026-05-14 08:02:13.053073+00
c7d797ec-6ab1-4709-8063-63d74861c768	cita	Estado de cita: Confirmada	Daryl Diaz fue notificado: cita confirmada para Princesa el 2026-05-11 a las 19:25:00 por Limpieza de dientes .	email	enviada	yeurilorenzo55@gmail.com	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	branch_central	2026-05-14 08:04:48.468571+00
347814b9-122e-4c3d-ba57-af4e1dda0e77	cita	Cita creada	Jefferson Lorenzo fue notificado: cita confirmada para negriii el 2026-05-15 a las 06:12 por baño.	email	enviada	yeurilorenzo041@gmail.com	476c4c73-fec0-43f2-9384-bda512d5a496	Jefferson Lorenzo	branch_central	2026-05-14 08:11:35.297653+00
6b9764ba-b308-451e-8b81-403a06767455	cita	Estado de cita: Completada	Daryl Diaz fue notificado: cita completada para Princesa el 2026-05-11 a las 19:25:00 por Limpieza de dientes .	email	enviada	yeurilorenzo55@gmail.com	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	branch_central	2026-05-14 08:11:42.604166+00
7fa460a6-c427-49da-b7d2-53071a16974f	historial	Nueva consulta registrada	Se actualizó el historial clínico de Princesa con consulta del 2026-05-21. Diagnóstico: quien sabe .	email	enviada	yeurilorenzo55@gmail.com	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	branch_central	2026-05-14 08:19:14.145258+00
51894980-e0e3-4d8a-a918-b2af2e6c506a	client_registered	Cliente registrado	carloss fue agregado al sistema en Sede Central.	interna	leida	carloscamacho970@gmail.com	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	branch_central	2026-05-14 14:44:32.234128+00
5c514e34-fd9f-4e34-a173-6eab51efed9a	pago_online	Link de pago enviado	carloss recibió el enlace undefined por $300 para vacuna.	email	enviada	carloscamacho970@gmail.com	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	branch_central	2026-05-14 14:50:33.333332+00
c7e42479-da72-4eb7-bd42-a625d12713f2	pago_online	Link de pago enviado	carloss recibió el enlace undefined por $300 para vacuna.	email	enviada	carloscamacho970@gmail.com	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	branch_central	2026-05-14 14:50:33.335363+00
f5dbd4dc-1675-4c31-9a51-052403fa6455	pago_online	Cobro online generado	carloss recibio el enlace STR-2026-0003 por $100 para cortado de uñas . Finaliza el simulador desde el modulo de Pagos.	email	enviada	carloscamacho970@gmail.com	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	branch_central	2026-05-14 14:52:22.799352+00
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, cliente_id, monto, metodo, estado, created_at) FROM stdin;
bc26232b-b51e-41bd-b1cd-5530223bdd2b	6d0881f9-37d5-42ba-8d31-ced71a38b784	500	stripe	pagado	2026-05-11 23:20:05.189106
\.


--
-- Data for Name: pagos_online; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos_online (id, stripe_session_id, referencia, url_pago, cita_id, cliente_id, cliente_nombre, cliente_contacto, mascota_nombre, servicio_nombre, monto, moneda, estado, sucursal_id, sucursal_nombre, origen, notas, pago_id, expira_el, pagado_el, ultimo_evento, created_at) FROM stdin;
44aa7fc8-96db-4ded-a8d0-249e1e0a668a	cs_test_8628ebvoyj	STR-2026-0001	https://checkout.stripe.local/session/cs_test_8628ebvoyj	\N	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	carloscamacho970@gmail.com	perry	vacuna	300	DOP	enviado	branch_central	Sede Central	manual		\N	2026-05-16 14:50:29.796+00	\N	link_generado	2026-05-14 14:50:31.29594+00
abe49476-ae8f-4278-98df-f7f115d8edbb	cs_test_wex1spo0uu	STR-2026-0002	https://checkout.stripe.local/session/cs_test_wex1spo0uu	\N	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	carloscamacho970@gmail.com	perry	vacuna	300	DOP	enviado	branch_central	Sede Central	manual		\N	2026-05-16 14:50:31.768+00	\N	link_generado	2026-05-14 14:50:32.763748+00
5abb293e-a79e-46d7-9b43-0a1b3138bdfa	cs_test_f88sgzlke8	STR-2026-0003	https://checkout.stripe.local/session/cs_test_f88sgzlke8	8f234759-ba16-49de-8224-f5c1a9240e20	20ebd15e-3c54-4e10-b25a-7b944a958e13	carloss	carloscamacho970@gmail.com	perry	cortado de uñas 	100	DOP	enviado	branch_central	Sede Central	appointment	Cobro online generado desde la cita del 2026-05-15 a las 11:41:00.	\N	2026-05-16 14:52:21.689+00	\N	link_generado	2026-05-14 14:52:22.620958+00
\.


--
-- Data for Name: paseos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paseos (id, mascota_id, mascota_nombre, cliente_id, cliente_nombre, fecha, hora_inicio, hora_fin, duracion, distancia, paseador, ruta, estado, notas, sucursal_id, created_at, updated_at) FROM stdin;
78e8a0db-4b77-42d3-bfbb-66913abe7ed9	c624fb4c-6d07-4e56-b65f-168ca795a8a3	Princesa	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	2026-05-14	04:00:00	06:00:00	2h 0min	3	yeuri	el puentee	completado	\N	branch_central	2026-05-14 07:58:26.490746+00	2026-05-14 07:58:26.490746+00
\.


--
-- Data for Name: reservas_online; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservas_online (id, nombre, email, telefono, mascota_nombre, servicio_id, servicio_nombre, fecha, hora, notas, estado, cita_id, created_at) FROM stdin;
c4f0c57c-f304-4487-a400-c248868c4efd	carlito	carloscamacho9700@gmail.com	623-232-2321	terry	19b6c28f-7c76-4446-9458-0d7bd61f06e5	baño	2026-05-07	10:14:00	que le laven el culo y que le cepillen los dientes	pendiente	\N	2026-05-05 12:14:52.597824+00
9f3c6d23-7d97-4ed0-bc97-3a6a075cbf4e	enyel	prueba123rs@gmail.com	829248667	chop	06dec459-85b1-464e-8e71-d8c6f1915f4d	Limpieza de dientes 	2026-05-19	08:08:00	nose	pendiente	\N	2026-05-14 12:06:10.461998+00
aa4e0a0c-59d0-4a3a-954d-1183dceca6e5	carlooo	carloscamacho9700@gmail.com	829-232-2311	perry	3244ab3a-94cd-4998-971d-e99c79369f6c	cortado de uñas 	2026-05-15	11:41:00	Cortame las uñas	confirmada	8f234759-ba16-49de-8224-f5c1a9240e20	2026-05-14 14:41:45.535114+00
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios (id, nombre, descripcion, precio, created_at) FROM stdin;
19b6c28f-7c76-4446-9458-0d7bd61f06e5	baño	ygfhgvhjhk	800	2026-05-05 07:35:06.889581
06dec459-85b1-464e-8e71-d8c6f1915f4d	Limpieza de dientes 	limpieza ddental para buena dentadura y olor bucal	500	2026-05-06 21:56:22.014514
3244ab3a-94cd-4998-971d-e99c79369f6c	cortado de uñas 	...............	100	2026-05-14 14:39:48.673148
\.


--
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursales (id, nombre, ciudad, estado, es_default, created_at) FROM stdin;
8582f07a-6bd3-4558-82c4-15ca4ac1ee90	Sede Central	Santo Domingo	Activa	t	2026-05-04 21:37:54.964369+00
66c6e8fe-f528-4d72-846e-3f6a4495fa49	Sucursal Norte	Santiago	Activa	f	2026-05-04 21:37:54.964369+00
b2a98141-3c3a-4320-9551-4b7aa12d6183	Sucursal Este	La Romana	Pausa	f	2026-05-04 21:37:54.964369+00
6d041e40-b8b1-4f57-b6d3-216175fde927	Sede Central	Santo Domingo	Activa	t	2026-05-04 21:37:54.961682+00
a2db59ef-e98f-45f6-9da2-ec0c1f8239ec	Sucursal Norte	Santiago	Activa	f	2026-05-04 21:37:54.961682+00
c638923c-2692-477b-b02e-41be19ff43dc	Sucursal Este	La Romana	Pausa	f	2026-05-04 21:37:54.961682+00
\.


--
-- Data for Name: suscripciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suscripciones (id, cliente_id, cliente_nombre, mascota_id, mascota_nombre, servicio_nombre, plan, monto, fecha_inicio, proximo_cobro, estado, notas, sucursal_id, created_at, updated_at) FROM stdin;
5c854a2b-dfa8-4616-9b72-39c6a742f297	6d0881f9-37d5-42ba-8d31-ced71a38b784	Daryl Diaz	c624fb4c-6d07-4e56-b65f-168ca795a8a3	Princesa	m,	mensual	900	2026-05-14	2026-06-14	activa	k	branch_central	2026-05-14 07:52:13.233723+00	2026-05-14 07:52:13.233723+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, phone, password_hash, created_at) FROM stdin;
\.


--
-- Data for Name: usuarios_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios_sistema (id, email, nombre, rol, estado, sucursal_ids, created_at, updated_at) FROM stdin;
8e5ddbff-5279-4d95-82bf-cac75aae244a	yeuriloren02@gmail.com	Admin	admin	activo	[]	2026-05-05 06:56:09.031257+00	2026-05-05 08:16:15.754943+00
\.


--
-- Data for Name: vacunas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vacunas (id, mascota_id, nombre, aplicada_el, proxima_dosis, veterinario, notas, created_at, updated_at) FROM stdin;
ffd482cb-8c5d-4e96-bbe6-307d5594d100	c624fb4c-6d07-4e56-b65f-168ca795a8a3	Rabia	2026-05-14	2026-05-30	dr. Jose	\N	2026-05-14 08:02:12.822165+00	2026-05-14 08:02:12.822165+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-05 15:38:54
20211116045059	2026-03-05 15:38:54
20211116050929	2026-03-05 15:38:54
20211116051442	2026-03-05 15:38:54
20211116212300	2026-03-05 15:38:54
20211116213355	2026-03-05 15:38:54
20211116213934	2026-03-05 15:38:54
20211116214523	2026-03-05 15:38:54
20211122062447	2026-03-05 15:38:54
20211124070109	2026-03-05 15:38:54
20211202204204	2026-03-05 15:38:54
20211202204605	2026-03-05 15:38:54
20211210212804	2026-03-05 15:38:54
20211228014915	2026-03-05 15:38:54
20220107221237	2026-03-05 15:38:54
20220228202821	2026-03-05 15:38:54
20220312004840	2026-03-05 15:38:54
20220603231003	2026-03-05 15:38:54
20220603232444	2026-03-05 15:38:54
20220615214548	2026-03-05 15:38:54
20220712093339	2026-03-05 15:38:54
20220908172859	2026-03-05 15:38:54
20220916233421	2026-03-05 15:38:54
20230119133233	2026-03-05 15:38:54
20230128025114	2026-03-05 15:38:54
20230128025212	2026-03-05 15:38:54
20230227211149	2026-03-05 15:38:54
20230228184745	2026-03-05 15:38:54
20230308225145	2026-03-05 15:38:54
20230328144023	2026-03-05 15:38:54
20231018144023	2026-03-05 15:38:54
20231204144023	2026-03-05 15:38:54
20231204144024	2026-03-05 15:38:54
20231204144025	2026-03-05 15:38:54
20240108234812	2026-03-05 15:38:54
20240109165339	2026-03-05 15:38:54
20240227174441	2026-03-05 15:38:54
20240311171622	2026-03-05 15:38:54
20240321100241	2026-03-05 15:38:54
20240401105812	2026-03-05 15:38:54
20240418121054	2026-03-05 15:38:54
20240523004032	2026-03-05 15:38:54
20240618124746	2026-03-05 15:38:54
20240801235015	2026-03-05 15:38:54
20240805133720	2026-03-05 15:38:54
20240827160934	2026-03-05 15:38:54
20240919163303	2026-03-05 15:38:55
20240919163305	2026-03-05 15:38:55
20241019105805	2026-03-05 15:38:55
20241030150047	2026-03-05 15:38:55
20241108114728	2026-03-05 15:38:55
20241121104152	2026-03-05 15:38:55
20241130184212	2026-03-05 15:38:55
20241220035512	2026-03-05 15:38:55
20241220123912	2026-03-05 15:38:55
20241224161212	2026-03-05 15:38:55
20250107150512	2026-03-05 15:38:55
20250110162412	2026-03-05 15:38:55
20250123174212	2026-03-05 15:38:55
20250128220012	2026-03-05 15:38:55
20250506224012	2026-03-05 15:38:55
20250523164012	2026-03-05 15:38:55
20250714121412	2026-03-05 15:38:55
20250905041441	2026-03-05 15:38:55
20251103001201	2026-03-05 15:38:55
20251120212548	2026-03-05 15:38:55
20251120215549	2026-03-05 15:38:55
20260218120000	2026-03-05 15:38:55
20260326120000	2026-04-29 11:59:03
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-05 15:08:09.325659
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-05 15:08:09.415914
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-05 15:08:09.425191
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-05 15:08:09.45218
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-05 15:08:09.473841
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-05 15:08:09.479201
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-05 15:08:09.48561
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-05 15:08:09.492688
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-05 15:08:09.499145
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-05 15:08:09.505546
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-05 15:08:09.511404
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-05 15:08:09.528696
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-05 15:08:09.537807
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-05 15:08:09.544474
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-05 15:08:09.550918
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-05 15:08:09.587801
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-05 15:08:09.594355
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-05 15:08:09.599738
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-05 15:08:09.605655
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-05 15:08:09.612901
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-05 15:08:09.618435
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-05 15:08:09.626265
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-05 15:08:09.648044
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-05 15:08:09.661481
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-05 15:08:09.667668
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-05 15:08:09.674969
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-05 15:08:09.681739
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-05 15:08:09.687591
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-05 15:08:09.692994
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-05 15:08:09.69779
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-05 15:08:09.702698
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-05 15:08:09.707519
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-05 15:08:09.712504
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-05 15:08:09.717423
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-05 15:08:09.722291
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-05 15:08:09.727214
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-05 15:08:09.73247
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-05 15:08:09.740818
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-05 15:08:09.74721
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-05 15:08:09.760406
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-05 15:08:09.765383
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-05 15:08:09.770509
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-05 15:08:09.775296
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-05 15:08:09.780439
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-05 15:08:09.787587
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-05 15:08:09.793409
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-05 15:08:09.808139
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-05 15:08:09.817142
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-05 15:08:09.822343
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-05 15:08:09.839404
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-05 15:08:09.845955
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-05 15:08:10.079975
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-05 15:08:10.082425
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-05 15:08:10.094702
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-05 15:08:10.097745
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-05 15:08:10.09981
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-03-05 15:08:10.106608
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-29 11:58:39.254415
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-29 11:58:39.284462
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-04-29 11:58:39.326225
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-05-01 04:42:53.651023
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 51, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: facturas facturas_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT facturas_numero_key UNIQUE (numero);


--
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id);


--
-- Name: fotos_servicio fotos_servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_servicio
    ADD CONSTRAINT fotos_servicio_pkey PRIMARY KEY (id);


--
-- Name: guarderia guarderia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guarderia
    ADD CONSTRAINT guarderia_pkey PRIMARY KEY (id);


--
-- Name: historial_clinico historial_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_pkey PRIMARY KEY (id);


--
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id);


--
-- Name: mascotas mascotas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT mascotas_pkey PRIMARY KEY (id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: pagos_online pagos_online_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos_online
    ADD CONSTRAINT pagos_online_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: paseos paseos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paseos
    ADD CONSTRAINT paseos_pkey PRIMARY KEY (id);


--
-- Name: reservas_online reservas_online_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas_online
    ADD CONSTRAINT reservas_online_pkey PRIMARY KEY (id);


--
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id);


--
-- Name: suscripciones suscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suscripciones
    ADD CONSTRAINT suscripciones_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: usuarios_sistema usuarios_sistema_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_email_key UNIQUE (email);


--
-- Name: usuarios_sistema usuarios_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_pkey PRIMARY KEY (id);


--
-- Name: vacunas vacunas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vacunas
    ADD CONSTRAINT vacunas_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: facturas_pago_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX facturas_pago_idx ON public.facturas USING btree (pago_id);


--
-- Name: fotos_cita_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fotos_cita_idx ON public.fotos_servicio USING btree (cita_id);


--
-- Name: guarderia_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX guarderia_fecha_idx ON public.guarderia USING btree (fecha);


--
-- Name: historial_mascota_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX historial_mascota_idx ON public.historial_clinico USING btree (mascota_id);


--
-- Name: notificaciones_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notificaciones_estado_idx ON public.notificaciones USING btree (estado);


--
-- Name: paseos_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX paseos_fecha_idx ON public.paseos USING btree (fecha);


--
-- Name: reservas_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reservas_estado_idx ON public.reservas_online USING btree (estado);


--
-- Name: reservas_fecha_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reservas_fecha_idx ON public.reservas_online USING btree (fecha);


--
-- Name: usuarios_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX usuarios_email_idx ON public.usuarios_sistema USING btree (email);


--
-- Name: vacunas_mascota_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vacunas_mascota_idx ON public.vacunas USING btree (mascota_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: citas citas_mascota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_mascota_id_fkey FOREIGN KEY (mascota_id) REFERENCES public.mascotas(id) ON DELETE CASCADE;


--
-- Name: citas citas_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id);


--
-- Name: mascotas mascotas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT mascotas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: pagos pagos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE auditoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.auditoria TO anon;
GRANT ALL ON TABLE public.auditoria TO authenticated;
GRANT ALL ON TABLE public.auditoria TO service_role;


--
-- Name: TABLE citas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.citas TO anon;
GRANT ALL ON TABLE public.citas TO authenticated;
GRANT ALL ON TABLE public.citas TO service_role;


--
-- Name: TABLE clientes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clientes TO anon;
GRANT ALL ON TABLE public.clientes TO authenticated;
GRANT ALL ON TABLE public.clientes TO service_role;


--
-- Name: TABLE facturas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.facturas TO anon;
GRANT ALL ON TABLE public.facturas TO authenticated;
GRANT ALL ON TABLE public.facturas TO service_role;


--
-- Name: TABLE fotos_servicio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fotos_servicio TO anon;
GRANT ALL ON TABLE public.fotos_servicio TO authenticated;
GRANT ALL ON TABLE public.fotos_servicio TO service_role;


--
-- Name: TABLE guarderia; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.guarderia TO anon;
GRANT ALL ON TABLE public.guarderia TO authenticated;
GRANT ALL ON TABLE public.guarderia TO service_role;


--
-- Name: TABLE historial_clinico; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.historial_clinico TO anon;
GRANT ALL ON TABLE public.historial_clinico TO authenticated;
GRANT ALL ON TABLE public.historial_clinico TO service_role;


--
-- Name: TABLE inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario TO anon;
GRANT ALL ON TABLE public.inventario TO authenticated;
GRANT ALL ON TABLE public.inventario TO service_role;


--
-- Name: TABLE mascotas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mascotas TO anon;
GRANT ALL ON TABLE public.mascotas TO authenticated;
GRANT ALL ON TABLE public.mascotas TO service_role;


--
-- Name: TABLE notificaciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notificaciones TO anon;
GRANT ALL ON TABLE public.notificaciones TO authenticated;
GRANT ALL ON TABLE public.notificaciones TO service_role;


--
-- Name: TABLE pagos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pagos TO anon;
GRANT ALL ON TABLE public.pagos TO authenticated;
GRANT ALL ON TABLE public.pagos TO service_role;


--
-- Name: TABLE pagos_online; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pagos_online TO anon;
GRANT ALL ON TABLE public.pagos_online TO authenticated;
GRANT ALL ON TABLE public.pagos_online TO service_role;


--
-- Name: TABLE paseos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.paseos TO anon;
GRANT ALL ON TABLE public.paseos TO authenticated;
GRANT ALL ON TABLE public.paseos TO service_role;


--
-- Name: TABLE reservas_online; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reservas_online TO anon;
GRANT ALL ON TABLE public.reservas_online TO authenticated;
GRANT ALL ON TABLE public.reservas_online TO service_role;


--
-- Name: TABLE servicios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.servicios TO anon;
GRANT ALL ON TABLE public.servicios TO authenticated;
GRANT ALL ON TABLE public.servicios TO service_role;


--
-- Name: TABLE sucursales; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sucursales TO anon;
GRANT ALL ON TABLE public.sucursales TO authenticated;
GRANT ALL ON TABLE public.sucursales TO service_role;


--
-- Name: TABLE suscripciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.suscripciones TO anon;
GRANT ALL ON TABLE public.suscripciones TO authenticated;
GRANT ALL ON TABLE public.suscripciones TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE usuarios_sistema; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuarios_sistema TO anon;
GRANT ALL ON TABLE public.usuarios_sistema TO authenticated;
GRANT ALL ON TABLE public.usuarios_sistema TO service_role;


--
-- Name: TABLE vacunas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vacunas TO anon;
GRANT ALL ON TABLE public.vacunas TO authenticated;
GRANT ALL ON TABLE public.vacunas TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict SXt0K6eW5CGWxrrAzqDFTEGvxnmehC69oDUVtur0Bcz1RtZpe7rraI1bWTf98Hm

