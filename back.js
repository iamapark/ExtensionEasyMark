var loginUserId;

var userCheckResult = function(data){
	if(data.result == 'true'){ // 로그인 성공
		loginUserId = data.userId;
		console.log('로그인 성공');
		$('#main').show();
		$('#loginForm').hide();
	}else{ // 로그인 실패
		console.log('로그인 실패');
	}
};

$('#loginButton').click(function(){
	 userId = $('#userId').val();
	 password = $('#password').val();
	 $.ajax({
	    url : "http://localhost:8080/EasyMark/extensionUserCheck",
	    dataType : "jsonp",
	    jsonp : "userCheckResult",
	    jsonpCallback:"userCheckResult",
	    crossDomain: true,
	    data : {
	        userId: userId,
	        password: password
	    }
	});
  });

$('#addBookMark').click(function(){
	alert('addBookMark');
	$('#bookMarkAdd').show();
});

$('#moveBookMark').click(function(){
	alert('moveBookMark');
});

$('#main').hide();
$('#bookMarkAdd').hide();