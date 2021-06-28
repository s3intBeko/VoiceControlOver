const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

pool.on('connect', () => {
console.log('connected to the db');
});
const createTables = () => {
    const queryText =
      `CREATE TABLE IF NOT EXISTS
        reflections(
          id UUID PRIMARY KEY,
          success VARCHAR(128) NOT NULL,
          low_point VARCHAR(128) NOT NULL,
          take_away VARCHAR(128) NOT NULL,
          created_date TIMESTAMP,
          modified_date TIMESTAMP
        )`;
  
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }
  
  /**
   * Drop Tables
   */
  const dropTables = () => {
    const queryText = 'DROP TABLE IF EXISTS reflections';
    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  }
  
  pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
  });
  
  module.exports = {
    createTables,
    dropTables
  };
  
  //require('make-runnable');
/*
-- auto-generated definition
create table players
(
    _id          serial                     not null
        constraint players_pk
            primary key,
    player_id    text,
    name         text                       not null,
    points       double precision default 0 not null,
    avatar_url   text,
    game_token   text,
    player_token text,
    level        integer,
    level_xp     integer,
    status       integer,
    socket_id    text,
    hearth_beat  interval,
    last_login   interval,
    game_state   jsonb,
    ip_address   inet,
    online       boolean,
    config       jsonb,
    password     text,
    email        text,
    userprefs    text,
    type         integer
);

alter table players
    owner to seint;




*/