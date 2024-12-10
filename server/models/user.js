const con = require("./db_connect")

//create user table if doesn't exist (for when someone else downloads it)
async function createTable() {
  let sql = `create table if not exists user (
    user_id int auto_increment primary key,
    email varchar(255) not null,
    username varchar(50) not null, 
    password_hash varchar(72) not null,
    profile_pic blob, 
    bio varchar(255)
  );`

  await con.query(sql)
}

createTable()


//check to see if username is in use:
async function userExists() {
  let sql = `
    SELECT * FROM user
    WHERE username = ?
  `
  return await con.query(sql)
}

//logging in a user
async function login(user) {
    let cUser = await userExists(user.username)
    if(!cUsers[0]) throw Error("Username does not exist: " + error.message)
    if(cUser[0].password_hash !=user.password_hash) throw Error("Password is incorrect: " + error.message)

    return cUser[0]
}

//registering a user
async function register(user) {
    //check to see if username in use
    let cUser = await userExists(user.username)
    if(cUser.length>0) throw Error("Username already exists: " + error.message)

    //create new user
    let sql = `
        insert into user(username, password_hash)
        values (?, ?)
    `
    await con.query(sql)
    let newUser = await login(cUser)
    return newUser[0]
}

// delete a user
async function deleteAccount(user) {
  let sql = `
    DELETE from user
    WHERE username = ?
  `
  await con.query(sql)
}

async function updateEmail(user) {
  let cEmail = await getEmail(user)
  if(cEmail) throw Error("Email already in use!!")

  let sql = `
    UPDATE user SET email = ?
    WHERE username = ?
  `
  await con.query(sql)
  let updatedUser = await userExists(user)
  return updatedUser[0]
}

//function to get all users
let getUsers =  async () => {
  try {
    const [rows] = await pool.execute(`select * from user;`) //executing sql query and inserting into an array
    return rows
  } catch (error) {
    throw new Error("Couldn't get all users: " + error.message)
  }
}

//need to export to allow access
module.exports = { getUsers, login, register, deleteAccount, updateEmail }