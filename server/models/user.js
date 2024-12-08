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


//logging in a user
async function login(user) {
    let cUser = await userExists(user.username)
    if(!cUsers[0]) throw Error("Username does not exist!")
    if(cUser[0].password_hash !=user.password_hash) throw Error("Password is incorrect!")

    return cUser[0]
}

//registering a user
async function register(user) {
    //check to see if username in use
    let cUser = await userExists(user.username)
    if(cUser.length>0) throw Error("Username already exists!")

    //create new user
    let sql = `
        insert into user(username, password_hash)
        values ("${user.username}", "${user.password_hash})
    `

    await con.query(sql)
    let newUser = await login(cUser)
    return newUser[0]
}

//function to get all users
let getUsers =  () => user

//need to export to allow access
module.exports = { getUsers, login, register }