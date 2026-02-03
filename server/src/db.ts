import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const isLocalConnection =
  connectionString?.includes("localhost") ||
  connectionString?.includes("127.0.0.1");

const pool = new Pool({
  connectionString,
  ssl: isLocalConnection ? undefined : { rejectUnauthorized: false },
});

export default pool;
