// User table
connection.query("CREATE TABLE IF NOT EXISTS users (" +
  "email varchar(40) NOT NULL," +
  "firstName varchar(25) NOT NULL," +
  "lastName varchar(25) NOT NULL," +
  "nickname varchar(25)," +
  "password varchar(40) NOT NULL," +
  "PRIMARY KEY (email)" +
  ")");

// Athlete table
connection.query("CREATE TABLE IF NOT EXISTS athletes (" +
  "aid varchar(40) NOT NULL," +
  "PRIMARY KEY (aid)," +
  "FOREIGN KEY (aid) REFERENCES users(email)"+
  ")");

// Coach table
connection.query("CREATE TABLE IF NOT EXISTS coaches (" +
  "cid varchar(40) NOT NULL," +
  "PRIMARY KEY (cid)," +
  "FOREIGN KEY (cid) REFERENCES users(email)"+
  ")");

// Invite table
connection.query("CREATE TABLE IF NOT EXISTS invite (" +
  "iid bigint NOT NULL AUTO_INCREMENT," +
  "aid varchar(25) NOT NULL," +
  "tid bigint NOT NULL," +
  "created timestamp default now()," +
  "PRIMARY KEY (iid)," +
  "FOREIGN KEY (aid) REFERENCES athletes(aid),"+
  "FOREIGN KEY (tid) REFERENCES teams(tid)"+
  ")");

// Message table
connection.query("CREATE TABLE IF NOT EXISTS messages (" +
  "mid bigint NOT NULL AUTO_INCREMENT," +
  "text text NOT NULL," +
  "fromid varchar(40) NOT NULL," +
  "toid varchar(40) NOT NULL," +
  "created timestamp default now()," +
  "PRIMARY KEY (mid)," +
  "FOREIGN KEY (fromid) REFERENCES users(email),"+
  "FOREIGN KEY (toid) REFERENCES users(email)"+
  ")");

// Team table
connection.query("CREATE TABLE IF NOT EXISTS teams (" +
  "tid bigint NOT NULL AUTO_INCREMENT," +
  "name varchar(45) NOT NULL," +
  "sport varchar(45) NOT NULL," +
  "PRIMARY KEY (tid)" +
  ")");

  // TeamAthlete table
connection.query("CREATE TABLE IF NOT EXISTS teamathletes (" +
  "tid bigint NOT NULL," +
  "aid varchar(40) NOT NULL," +
  "FOREIGN KEY (tid) REFERENCES teams(tid),"+
  "FOREIGN KEY (aid) REFERENCES athletes(aid)"+
  ")");

// TeamCoach table
connection.query("CREATE TABLE IF NOT EXISTS teamcoaches (" +
  "tid bigint NOT NULL," +
  "cid varchar(40) NOT NULL," +
  "FOREIGN KEY (tid) REFERENCES teams(tid),"+
  "FOREIGN KEY (cid) REFERENCES athletes(cid)"+
  ")");  
