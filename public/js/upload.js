/**
 * Created by quanquan.sun on 2017/8/15.
 */
function fileSelected() {
    var file = document.getElementById('thumbnail').files[0];
    if (file) {
        var fileSize = 0;
        if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
        document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
        document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
    }
}

function uploadFile() {
    /*var fd = new FormData();
     fd.append("thumbnail", document.getElementById('thumbnail').files[0]);
     console.log(fd);
     var xhr = new XMLHttpRequest();
     xhr.upload.addEventListener("progress", uploadProgress, false);
     xhr.addEventListener("load", uploadComplete, false);
     xhr.addEventListener("error", uploadFailed, false);
     xhr.addEventListener("abort", uploadCanceled, false);
     xhr.open("POST", "/upload");
     xhr.send(fd);
     xhr.onreadystatechange = function(){
     if(xhr.readyState == 4){
     if(xhr.status == 200){
     var data ={};
     data = JSON.parse(xhr.responseText);
     var name = data.verName;
     document.getElementById('name').value=name;
     }
     }
     };*/

    var fd = new FormData();
    fd.append("thumbnail", document.getElementById('thumbnail').files[0]);
    $.ajax({
        type: 'post',
        url: "/upload",
        data: fd,
        contentType: false,
        processData: false,
        xhr: function(){
            var xhr = $.ajaxSettings.xhr();
            if(uploadProgress && xhr.upload) {
                xhr.upload.addEventListener("progress" , uploadProgress, false);
                xhr.addEventListener("load", uploadComplete, false);
                xhr.addEventListener("error", uploadFailed, false);
                xhr.addEventListener("abort", uploadCanceled, false);
                return xhr;
             }
        },
        success: function (data) {
            document.getElementById('name').value=data.verName;
        }
    });
}

function uploadProgress(evt) {
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
    }
    else {
        document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
}

function uploadComplete(evt) {
    alert(evt.target.responseText);
}

function uploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
}