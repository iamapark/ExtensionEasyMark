var loginUserId;

var userCheckResult = function(data){
	kaka = data;
	if(data.result == 'true'){ // 로그인 성공
		loginUserId = data.userId;
		console.log('로그인 성공');
		$('#main').show();
		$('#loginForm').hide();
	}else{ // 로그인 실패
		alert('로그인 정보가 알맞지 않습니다.');
	}
};

$('#loginButton').click(function(){
	 userId = $('#userId').val();
	 password = $('#password').val();
	 $.ajax({
	    url : "http://localhost:8080/EasyMark/extensionUserCheck",
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

