var loginUserId;
init();

// 초기화 함수
function init(){
	if(localStorage.getItem('MEMBERID')!=null){
		$('#main').show();
		$('#loginForm').hide();
		$('#bookMarkAdd').hide();
	}else{
		$('#main').hide();
		$('#bookMarkAdd').hide();
	}
}

//현재 페이지 북마크에 추가하기 클릭했을 때
$('#addBookMark').click(function(){
	$('#bookMarkAdd').show();
	$('#main').hide();
	chrome.tabs.query({active: true}, function(data) {
		$('#bookMarkAddURl').val(data[0].url);
		$('#bookMarkAddName').val(data[0].title);
	} );
});

//북마크 추가 버튼을 클릭했을 때
$('#bookMarkAddButton').click(function(e){
	e.preventDefault();
	var url = $('#bookMarkAddURl').val();
	var name = encodeURI($('#bookMarkAddName').val());
	var desc = encodeURI($('#bookMarkAddDesc').val());
	var category = encodeURI($('#bookMarkAddCategory').val());
	var filename = $('#addBookMarkImage').val();
	
	if(filename == ''){
		$.ajax({
			url: targetUrl + 'addMark',
			dataType:'json',
			data:{
				url: url,
				name: name,
				description: desc,
				category:category,
				userId:loginUserId
			}
		}).done(function(d){
			kaka = e;
			alert('추가 성공!!');
		});
	}else{
		$("#bookMarkAddForm").ajaxSubmit({
        	dataType:'html',
        	success:function(data,rst){
        		alert('추가 성공');
        	}
		});
	}
});

//아이디와 비번을 입력하고 로그인 버튼을 눌렀을 때 서버측에서 호출하는 콜백 함수
var userCheckResult = function(data){
	if(data.result == 'true'){ // 로그인 성공
		if($('#loginIdKeep').is(':checked')){
			localStorage.setItem('MEMBERID', data.userId);
		}else{
			loginUserId = data.userd;
		}
		$('#main').show();
		$('#loginForm').hide();
	}else{ // 로그인 실패
		alert('로그인 정보가 알맞지 않습니다.');
	}
};

//아이디와 비번을 입력하고 로그인 버튼을 눌렀을 때
$('#loginButton').click(function(){
	 userId = $('#userId').val();
	 password = $('#password').val();
	 $.ajax({
	    url : targetUrl + 'extensionUserCheck',
	    dataType : "jsonp",
	    jsonp : "callback",
	    jsonpCallback:"userCheckResult",
	    crossDomain: true,
	    data : {
	        userId: userId,
	        password: password
	    }
	});
  });

//북마크 옮기기 클릭했을 때
$('#moveBookMark').click(function(){
	alert('moveBookMark');
});

//로그아웃 클릭했을 때
$('#logout').click(function(){
	alert('로그아웃');
	localStorage.removeItem('MEMBERID');
});