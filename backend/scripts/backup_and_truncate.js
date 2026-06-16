import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DB = process.env.MYSQL_DATABASE;
const OUT_DIR = path.resolve(process.cwd(), 'backup');
const OUT_FILE = path.join(OUT_DIR, `backup-${DB}-${new Date().toISOString().slice(0,10)}.sql`);

async function main(){
  if(!DB) throw new Error('MYSQL_DATABASE not set in .env');
  if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: DB,
    waitForConnections: true,
    connectionLimit: 5,
  });

  const out = fs.createWriteStream(OUT_FILE, { encoding: 'utf8' });
  out.write(`-- Backup for database ${DB} on ${new Date().toISOString()}\n`);
  out.write('SET FOREIGN_KEY_CHECKS=0;\n\n');

  try{
    const [tablesRows] = await pool.query(`SHOW TABLES`);
    const tableKey = Object.keys(tablesRows[0])[0];
    const tables = tablesRows.map(r => r[tableKey]);

    for(const table of tables){
      out.write(`-- Dumping table ${table}\n`);
      const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
      if(rows.length === 0) {
        out.write(`-- Table ${table} is empty\n\n`);
        continue;
      }

      const cols = Object.keys(rows[0]).map(c => `\`${c}\``).join(', ');
      const values = rows.map(r => {
        const vals = Object.values(r).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'number') return v;
          // escape single quotes and backslashes
          return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        }).join(', ');
        return `(${vals})`;
      });

      // Write DELETE + INSERT sequence
      out.write(`DELETE FROM \`${table}\`;\n`);
      out.write(`INSERT INTO \`${table}\` (${cols}) VALUES\n`);
      // chunk inserts to avoid huge single line
      const chunkSize = 500;
      for(let i=0;i<values.length;i+=chunkSize){
        const chunk = values.slice(i, i+chunkSize).join(',\n');
        out.write(chunk + (i + chunkSize < values.length ? ',\n' : ';\n'));
      }
      out.write('\n');
    }

    out.write('\nSET FOREIGN_KEY_CHECKS=0;\n');
    out.write('-- Truncating all tables\n');
    for(const table of tables){
      out.write(`TRUNCATE TABLE \`${table}\`;\n`);
    }
    out.write('SET FOREIGN_KEY_CHECKS=1;\n');

    console.log('Backup written to', OUT_FILE);

    // execute truncates now
    const conn = await pool.getConnection();
    try{
      await conn.query('SET FOREIGN_KEY_CHECKS=0');
      for(const table of tables){
        console.log('Truncating', table);
        await conn.query(`TRUNCATE TABLE \`${table}\``);
      }
      await conn.query('SET FOREIGN_KEY_CHECKS=1');
    } finally {
      conn.release();
    }

    console.log('All tables truncated');
  }catch(err){
    console.error('Error during backup/truncate:', err);
  }finally{
    out.end();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
