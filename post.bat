set arg1=%1
curl -F "reqtype=fileupload" -F "fileToUpload=@%arg1%" https://catbox.moe/user/api.php