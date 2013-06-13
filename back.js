//var targetUrl = 'http://localhost:8080/EasyMark/';
var targetUrl = 'http://easymark.pe.kr/';

var loginFunc = function(userId, password){
	console.log('loginFunc');
	/*$.ajax({
		url : targetUrl + 'extensionUserCheck',
		dataType : "jsonp",
		jsonp : "callback",	
		jsonpCallback : "userCheckResult",
		crossDomain : true,
		data : {
			userId : userId,
			password : password
		}
	});*/
	
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", targetUrl + "extensionUserCheck?userId=a&password=a&callback=userCheckResult", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // WARNING! Might be injecting a malicious script!
	    /*document.getElementById("resp").innerHTML = xhr.responseText;*/
	    console.log('success');
	    kaka = xhr;
	    eval(xhr.response);
	  }
	}
	xhr.send();
	
	
};

chrome.commands.onCommand.addListener(function(command) {
	console.log('Command:', command);
	if(command == 'recording')
	  recordingStart();
});


var recordingStart = function(){
	chrome.experimental.speechInput.isRecording(function(recording) {
		/*alert('녹음 시작!!');*/
		playStart();
		
	    if (!recording) {
	      	chrome.experimental.speechInput.start({}, function() {
	      		if (chrome.runtime.lastError) {
	      			alert("음성인식을 시작할 수 없습니다: " +
	      					chrome.runtime.lastError.message);
	      			setStopIcon();
	      		} else {
	      			setStartIcon();
	      		}
	      	});
	    } else {
	    	alert('녹음이 안되영');
	    	setStopIcon();
	    	chrome.experimental.speechInput.stop(function() {
	      });
	    }
	  });
};

chrome.experimental.speechInput.onResult.addListener(function(result) {
	setStopIcon();
  
	var data = encodeURI(result.hypotheses[0].utterance);
	$.ajax({
	    url : targetUrl + 'speech',
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
			chrome.tabs.query({active: true}, function(data) {
				var url = data[0].url;
				var title = encodeURI(data[0].title);
				var userId = localStorage.getItem('MEMBERID');
				if(userId == undefined){
					playTTS('로그인을 한 후에 다시 시도 해주세요.');
					return;
				}
				$.ajax({
					url: targetUrl + 'addMark',
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
						category:0,
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
		
		// r==4 북마크 추가 후 '확인' 이라고 대답했을 때
		else if(data.r == '4'){
			// 탭 중에서 easymark에 접속되어 있는 탭이 있을 경우 해당 탭을 띄우고
			// 아닐 경우 새로운 탭에서 easymark 페이지를 띄운다.(로그인 되어 있어야 함)
			
		}
		
		// 예약어가 아닐 경우
		else if(data.r == 'false'){
			playTTS('다시 한 번 말씀해주세요.');
			setStopIcon();
			recordingStart();
		}
	}
};

// 인자로 전달받는 텍스트 값을 TTS화한다.
var playTTS = function(text){
	var tag = '<embed type="audio/mpeg" src="http://www.neospeech.com/GetAudio1.ashx?speaker=10&content='+escape(text)+'" hidden="true" volume="0"></embed>';
	$('html').append(tag);
};

var playStart = function(){
	var tag = '<embed type="audio/mpeg" src="start_sound.mp3" hidden="true" volume="0"></embed>';
	$('html').append(tag);
};

function setStartIcon() {
	chrome.browserAction.setIcon({ path: "start.png" });
}

function setStopIcon() {
	chrome.browserAction.setIcon({ path: "icon.png" });
}