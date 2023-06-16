CREATE TABLE IF NOT EXISTS "operation" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"cost" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "record" (
	"id" serial PRIMARY KEY NOT NULL,
	"operation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"user_balance" integer NOT NULL,
	"operation_response" text NOT NULL,
	"date_time" timestamp NOT NULL,
	"is_deleted" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"status" text DEFAULT 'active'
);

CREATE UNIQUE INDEX IF NOT EXISTS "unique_operation_type" ON "operation" ("type");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_username_idx" ON "user" ("username");
DO $$ BEGIN
 ALTER TABLE "record" ADD CONSTRAINT "record_operation_id_operation_id_fk" FOREIGN KEY ("operation_id") REFERENCES "operation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "record" ADD CONSTRAINT "record_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- SEED OPERATIONS
INSERT INTO "operation" (
	"type",
	"cost"
) VALUES ( 'add', 10 ), ( 'sub', 10 ), ( 'multi', 10 ), ( 'div', 10 ), ( 'sqrt', 10 ), ( 'str', 20 );
