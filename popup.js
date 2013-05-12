$('#addBookMark').click(function(){
	$('#bookMarkAdd').show();
	chrome.tabs.query({active: true}, function(data) {
		$('#bookMarkAddURl').val(data[0].url);
		$('#bookMarkAddName').val(data[0].title);
	} );
});

$('#bookMarkAddButton').click(function(){
	var url = $('#bookMarkAddURl').val();
	var name = $('#bookMarkAddName').val();
	var desc = $('#bookMarkAddDesc').val();
	var category = $('#bookMarkAddCategory').val();
	var filename = $('#addBookMarkImage').val();
	
	if(filename == ''){
		$.ajax({
			url: 'http://localhost:8080/EasyMark/addMark',
			dataType:'json',
			data:{
				url: url,
				name: name,
				description: desc,
				category:category,
				userId:loginUserId
			}
		}).done(function(d){
			alert('추가 성공!!');
		}).fail(function(e){
			console.log(e);
			kaka = e;
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

$('#moveBookMark').click(function(){
	alert('moveBookMark');
});

$('#main').hide();
$('#bookMarkAdd').hide();
