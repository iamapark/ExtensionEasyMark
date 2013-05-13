chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if(command == 'recording')
	  recordingStart();
});


var recordingStart = function(){
	chrome.experimental.speechInput.isRecording(function(recording) {
		alert('녹음 시작!!');
	    if (!recording) {
	      chrome.experimental.speechInput.start({}, function() {
	        if (chrome.runtime.lastError) {
	          alert("Couldn't start speech input: " +
	              chrome.runtime.lastError.message);
	         // setStartIcon();
	        } else {
	          //setStopIcon();
	        }
	      });
	    } else {
	    	alert('녹음이 안되영');
	      chrome.experimental.speechInput.stop(function() {
	        //setStartIcon();
	      });
	    }
	  });
};

chrome.experimental.speechInput.onResult.addListener(function(result) {
	alert(result.hypotheses[0].utterance);
	//setStartIcon();
  
	//chrome.tabs.create({url:'http://www.naver.com'});
	var data = encodeURI(result.hypotheses[0].utterance);
	$.ajax({
	    url : "http://localhost:8080/EasyMark/speech",
	    dataType : "jsonp",
	    jsonp : "callback",
	    jsonpCallback:"speechCallback",
	    crossDomain: true,
	    data : {
	        speech: data
	    }
	});
});

var speechCallback = function(data){
	kaka = data;
	if(data.result == 'true'){
		//r==1일때 현재 페이지를 북마크에 추가한다.
		if(data.r == '1'){
			playTTS('북마크 추가를 진행합니다.');
			chrome.tabs.query({active: true}, function(data) {
				var url = data[0].url;
				var title = encodeURI(data[0].title);
				var userId = localStorage.getItem('MEMBERID');
				if(userId == null){
					playTTS('로그인을 해야합니다.');
					return;
				}
				$.ajax({
					url: 'http://localhost:8080/EasyMark/addMark',
					dataType:'jsonp',
					jsonp : "callback",
				    jsonpCallback:function(data){
				    	kaka = data;
				    	playTTS('현재 페이지를 북마크에 추가했습니다.');
				    },
				    crossDomain: true,
					data:{
						url: url,
						name: title,
						description: '',
						category:'',
						userId: userId
					}
				});
			} );
		
		// r==2 일 때 웹 페이지에 접속한다.
		}else if(data.r == '2'){
			if(data.q != 'null'){
				playTTS(data.w + ' 페이지에 접속합니다.');
				chrome.tabs.create({url:data.q});
			}else{
				playTTS('말씀하신 페이지가 DB에 존재하지 않습니다. 다른 페이지에 접속해주세요.');
				recordingStart();
			}
		}
		
		// r==3 일 때 검색 모드
		else if(data.r == '3'){
			playTTS('검색 모드를 진행합니다.');
		}
		
		// 예약어가 아닐 경우
		else if(data.r == 'false'){
			playTTS('다시 한 번 말씀해주세요.');
			recordingStart();
		}
	}
};

// 인자로 전달받는 텍스트 값을 TTS화한다.
var playTTS = function(text){
	var tag = '<embed type="audio/mpeg" src="http://www.neospeech.com/GetAudio1.ashx?speaker=10&content='+escape(text)+'" hidden="true" volume="0"></embed>';
	$('html').append(tag);
};