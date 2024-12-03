let upload_form = document.getElementById("upload_form")
if (upload_form) upload_form.addEventListener('submit', upload)

function upload(e) {
    e.preventDefault()

    const upload = {
        song_link: document.getElementById("song_link").value,
        song_description: document.getElementById("song_description").value
    }

    console.log(upload)
}