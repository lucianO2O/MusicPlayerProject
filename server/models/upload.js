const con = require("./db_connect")
const path = require('path') // for path.join
const fs = require('fs').promises;


async function createTable() {
    let sql = `create table if not exists song_uploads (
        upload_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        user_id INT NOT NULL,                              
        file_name VARCHAR(255) NOT NULL,                  
        file_size BIGINT DEFAULT NULL,                    
        file_type VARCHAR(100) DEFAULT NULL,              
        storage_path VARCHAR(255) NOT NULL,               
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        upload_status ENUM('pending', 'completed', 'failed') DEFAULT 'completed', 
        error_message VARCHAR(255) DEFAULT NULL,          
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );`
    await con.query(sql)

    sql = `create table if not exists songs (
        song_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        title VARCHAR(255) NOT NULL,                   
        genre VARCHAR(255) NOT NULL,                   
        description VARCHAR(255) DEFAULT NULL,          
        duration TIME DEFAULT NULL,                  
        user_id INT NOT NULL,                 
        upload_id INT NOT NULL,                         
        like_count INT DEFAULT 0,                      
        listen_count INT DEFAULT 0,                     
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        FOREIGN KEY (upload_id) REFERENCES song_uploads(upload_id)
    );`

}

createTable()


const UPLOAD_DIR = path.join('./uploads', 'uploads'); // local directory to store uploads

// insert upload details into song_uploads
async function createUploadRecord(user_id, file, status, errorMessage = null) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO song_uploads (user_id, file_name, file_size, file_type, storage_path, upload_status, error_message)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, // ? placeholder over template literals
        [                   // placing into array
          user_id,
          file.originalname,
          file.size,
          file.mimetype,
          file.path, 
          status,
          errorMessage,
        ]
      );
      return result.insertId; // return the upload id for further use
    } catch (error) {
      throw new Error('Failed to create upload record: ' + error.message)
    }
}

// adds record of song to songs table
// directly references upload_id, which links to a record in the song_uploads table
async function addSongRecord(upload_id, user_id, title, genre, description, duration) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO songs (upload_id, user_id, title, genre, description, duration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [upload_id, user_id, title, genre, description, duration]
      );
      return result.insertId; // return the song id
    } catch (error) {
      throw new Error('Failed to add song record: ' + error.message)
    }
}
//last 2 methods will just be used in uploadSong

// function that actually uploads the song to the 
async function uploadSong(user_id, file, songDetails) {
    try {
      //ensure the upload directory exists
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
  
      // generate a unique file name and save the file
      const fileName = `${Date.now()}_${file.originalname}` // creates a file name which is a combination of the timestamp (date.now() function) and original file name
      const filePath = path.join(UPLOAD_DIR, fileName) // creates the whole file path using the folder the file is going to and the name
      await fs.writeFile(filePath, file.buffer) //saves the file
  
      //create an upload record
      const upload_id = await createUploadRecord(user_id, { ...file, path: filePath }, 'completed')
  
      //add the song record
      const song_id = await addSongRecord(
        upload_id,
        user_id,
        songDetails.title,
        songDetails.genre,
        songDetails.description || null,
        songDetails.duration || null
      )
  
      return { message: 'Song uploaded successfully', song_id }
    } catch (error) {
      // record of failed uploads
      await createUploadRecord(user_id, file, 'failed', error.message)
  
      return { success: false, message: error.message }
    }
}

//delete uploaded song
async function deleteUpload(upload_id) {
    const query = `DELETE FROM song_uploads WHERE upload_id = ?;`
    const [result] = await pool.execute(query, [upload_id])
    return result.affectedRows > 0; // return true if the deletion was successful
  }

//stores uploads in array of table rows
let getUploads = async () => {
    try {
        const [rows] = await pool.execute(`select * from song_uploads;`) // puts each row of data into an array, "pool.execute" executes the sql query
        return rows
    } catch(error) {
        throw new Error('Failed to get uploads: ' + error.message)
    }
}

async function updateUpload(upload_id, updates) {
  try {
      const query = `UPDATE song_uploads SET ? WHERE upload_id = ?;`
      const [result] = await pool.query(query, [updates, upload_id]); 
      return result.affectedRows > 0; // return true if any row was updated
  } catch (error) {
      throw new Error('Failed to update upload: ' + error.message) //otherwise throws failed to upload error
  }
}

module.exports = { uploadSong, deleteUpload, getUploads, updateUpload }