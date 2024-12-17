let upload_form = document.getElementById("upload_form")
if (upload_form) upload_form.addEventListener("submit", upload)

async function upload(e) {
    e.preventDefault()

    const upload = {
        song_link: document.getElementById("song_link").value,
        song_description: document.getElementById("song_description").value,
    }

    try {
        const data = await fetchData("/uploads", upload, "POST")
        console.log("Upload successful:", data)
        // Optionally, redirect or take further actions
    } catch (err) {
        console.error("Upload failed:", err.message)
    }
}