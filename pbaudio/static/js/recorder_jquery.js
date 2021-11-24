var scenario;
var currentSentence;
var sentencesCount;
const element = document.querySelector(".pagination ul");

$.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:8000/get_scenario',
    success: function(json){
        scenario = json;
        UpdateScenarioBox(0);
        sentencesCount = scenario.sentences.length - 1;
        element.innerHTML = createPagination(sentencesCount, 0);
    },
    error: function(error) {
        callbackErr(error,self)
    }
})

jQuery(document).ready(function () {
    var $ = jQuery;
    var myRecorder = {
        objects: {
            context: null,
            stream: null,
            recorder: null
        },
        init: function () {
            if (null === myRecorder.objects.context) {
                myRecorder.objects.context = new (
                        window.AudioContext || window.webkitAudioContext
                        );
            }
        },
        start: function () {
            var options = {audio: true, video: false};
            navigator.mediaDevices.getUserMedia(options).then(function (stream) {
                myRecorder.objects.stream = stream;
                myRecorder.objects.recorder = new Recorder(
                        myRecorder.objects.context.createMediaStreamSource(stream),
                        {numChannels: 1}
                );
                myRecorder.objects.recorder.record();
            }).catch(function (err) {});
        },
        stop: function (listObject) {
            if (null !== myRecorder.objects.stream) {
                myRecorder.objects.stream.getAudioTracks()[0].stop();
            }
            if (null !== myRecorder.objects.recorder) {
                myRecorder.objects.recorder.stop();

                // Validate object
                if (null !== listObject
                        && 'object' === typeof listObject
                        && listObject.length > 0) {
                    // Export the WAV file
                    myRecorder.objects.recorder.exportWAV(function (blob) {
                        var url = (window.URL || window.webkitURL)
                                .createObjectURL(blob);

                        // Prepare the playback
                        var audioObject = $('<audio controls></audio>')
                                .attr('src', url);

                        function sendRecording(blob){
                            var dataPackage = new FormData();
                            dataPackage.append('speaker', document.getElementById('speakerName').value);
                            dataPackage.append('age', document.getElementById('speakerAge').value);
                            dataPackage.append('sex', document.getElementById('speakerSex').value);
                            dataPackage.append('quality', document.querySelector('input[name="voice-self-esteem"]:checked').value);
                            dataPackage.append('pitch', document.querySelector('input[name="voice-scale"]:checked').value);
                            dataPackage.append('recording', blob, new Date().toLocaleDateString("pl-PL") + '_.wav');


                            $.ajax({
                            url: "http://127.0.0.1:8000/pass_audio/",
                            type: "POST",
                            data: dataPackage,
                            enctype: 'multipart/form-data',
                            contentType: false,
                            processData: false,
                            context: url,
                        });
                        };

                        sendRecording(blob)

                        // Wrap everything in a row
                        var holderObject = $('<div class="row"></div>')
                                .append(audioObject)

                        // Append to the list
                        listObject.append(holderObject);
                    });
                }
            }
        }
    };

    // Prepare the recordings list
    var listObject = $('[data-role="recordings"]');

    // Prepare the record button
    $('[data-role="controls"] > button').click(function () {
        // Initialize the recorder
        myRecorder.init();

        // Get the button state 
        var buttonState = !!$(this).attr('data-recording');

        // Toggle
        if (!buttonState) {
            $(this).attr('data-recording', 'true');
            myRecorder.start();
        } else {
            $(this).attr('data-recording', '');
            myRecorder.stop(listObject);
            currentSentence++;
            UpdateScenarioBox(currentSentence);
            createPagination(sentencesCount, currentSentence)
        }
    });
});

function UpdateScenarioBox(curSen)
{
    currentSentence = curSen;
    document.getElementById("currentSentence").innerHTML = scenario.sentences[currentSentence];

    if(currentSentence > 0)
    {
        document.getElementById("previousSentence").innerHTML = scenario.sentences[currentSentence - 1];            
    }
    else
    {
        document.getElementById("previousSentence").innerHTML = " ";  
    }

    if(currentSentence < sentencesCount)
    {
        document.getElementById("nextSentence").innerHTML = scenario.sentences[currentSentence + 1];            
    }
    else
    {
        document.getElementById("nextSentence").innerHTML = " ";  
    }
}

function createPagination(sentencesCount, currentSentence){
  let liTag = '';
  let active;
  
  if(currentSentence < 0 || currentSentence > sentencesCount){
      return liTag;
  } 

  if(currentSentence > 0)
  {
    liTag += `<li class="btn prev" onclick="createPagination(sentencesCount, ${currentSentence - 1})"><span><i class="fas fa-angle-left"></i> Previous</span></li>`;
  }
  else
  {
    liTag += `<li class="btn prev" disabled><span><i class="fas fa-angle-left"></i> Previous</span></li>`;
  }

  if(currentSentence > 1){
    liTag += `<li class="first numb" onclick="createPagination(sentencesCount, 0)"><span>0</span></li>`;
    if(currentSentence > 2){
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  for (var plength = currentSentence; plength <= currentSentence + 1; plength++) {
    if (plength > sentencesCount) {
      continue;
    }
    
    if(currentSentence == plength){ //if currentSentence is equal to plength than assign active string in the active variable
      active = "active";
    }else{ //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(sentencesCount, ${plength})"><span>${plength}</span></li>`;
  }

  if(currentSentence < sentencesCount - 1){ //if currentSentence value is less than totalcurrentSentence value by -1 then show the last li or currentSentence
    if(currentSentence < sentencesCount - 2){ //if currentSentence value is less than totalcurrentSentence value by -2 then add this (...) before the last li or currentSentence
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(sentencesCount, ${sentencesCount})"><span>${sentencesCount}</span></li>`;
  }

  if (currentSentence < sentencesCount) { //show the next button if the currentSentence value is less than totalcurrentSentence(20)
    liTag += `<li class="btn next" onclick="createPagination(sentencesCount, ${currentSentence + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  else
  {
    liTag += `<li class="btn next" disabled><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
    
  UpdateScenarioBox(currentSentence);
  element.innerHTML = liTag; 
  return liTag;
}