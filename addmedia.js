const db = firebase.firestore();
const storage = firebase.storage();
const image = document.getElementById("addmediaImg");
var imgFile = null;
var audioFile = null;
var videoFile = null;

// function add image
function readURL(input) {
  console.log(input.files);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    imgFile = input.files[0];
    const filesize = imgFile.size;
    if(filesize > 1000000)
    {
      alert('Must be less than 1MB')
      imgFile = null;
      $("#imgChooser").val(null);
    } else 
    
    {
      reader.onload = function (e) {
        $("#addmediaImg").attr("src", e.target.result);
      };
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
    
  }
}

const readAudio = (input) => {
  console.log(input.files[0]);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    audioFile = input.files[0];
    // const files = event.target.files;
    $("#addmediaAudioSrc").attr("src", URL.createObjectURL(audioFile));
    document.getElementById("addmediaAudio").load();
  }
};

const readVideo = (input) => {
  console.log({ input });
  const vplayer = document.getElementById("addmediaVideo");
  videoFile = document.getElementById("videoChooser").files[0];
  const fileURL = window.URL.createObjectURL(videoFile);
  vplayer.src = fileURL;
  vplayer.load();
};

$("#imgChooser").change(function () {
  readURL(this);
});

$("#audioChooser").change(function () {
  readAudio(this);
});

$("#videoChooser").change((e) => {
  readVideo(e);
});

const getFileByType = (type) => {
  console.log({ type });
  switch (type.toUpperCase()) {
    case "IMAGE":
      return imgFile;
    case "AUDIO":
      return audioFile;
    case "VIDEO":
      return videoFile;
    default:
      return null;
  }
};

const onUploadMedia = async (type = "media") => {
  $(".addmedia-body").css("opacity", "0.2");
  $(".addmedia-loading").css("display", "flex");
  try {
    // const imgName = $("#addmediaImgName").val();
    const key = Math.round(+new Date() / 1000);
    const file = await getFileByType(type);

    console.log({ file });
    const fileName = file.name;
    const storageRef = storage.ref().child(`media/${type}/${key}/${fileName}`);
    const snapshot = await storageRef.put(file);
    const price = $('#price').val();
    const iname = $('#iname').val();
    const condition = $('#condition').val();
    const area = $('#area').val();
    console.log(iname)

    const downloadUrl = await snapshot.ref.getDownloadURL();
    // add to database
    db.collection(type)
      .doc(key.toString())
      .set({
        name: fileName,
        type,
        url: downloadUrl,
        price,
        itemname:iname,
        condition:condition,
        area:area
      })

      .then(() => {
        location.reload();
        alert("Success");
        $(".addmedia-loading").css("display", "none");
        $(".addmedia-body").css("opacity", "1");
        console.log("Successfully uploaded");
      })

      .catch((error) => {
        alert("Error");
        $(".addmedia-loading").css("display", "none");
        $(".addmedia-body").css("opacity", "1");
        console.log({ error });
      });
  } catch (err) {
    alert("Error");
    $(".addmedia-loading").css("display", "none");
    $(".addmedia-body").css("opacity", "1");
    console.log({ err });
  }
};

//button add image 
$("#addmediaUploadImg").click(() => {
  if (imgFile === null) {
    alert("Please select an image");
  } else {
    onUploadMedia("image");
  }
});

//button add audio
$("#addmediaUploadAudio").click(() => {
  if (audioFile === null) {
    alert("Please select an audio");
  } else {
    onUploadMedia("audio");
  }
});

//button add video
$("#addmediaUploadVideo").click(() => {
  if (videoFile === null) {
    alert("Please select a video");
  } else {
    onUploadMedia("video");
  }
});

btnHome.addEventListener("click", () => {
  window.location.href = "homepage.html";
});