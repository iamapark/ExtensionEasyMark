$('#addBookMark').click(function(){
	$('#bookMarkAdd').show();
	chrome.tabs.query({active: true}, function(data) {
		$('#bookMarkAddURl').val(data[0].url);
		$('#bookMarkAddName').val(data[0].title);
	} );
});

$('#bookMarkAddButton').click(function(e){
	e.preventDefault();
	var url = $('#bookMarkAddURl').val();
	var name = $('#bookMarkAddName').val();
	var desc = $('#bookMarkAddDesc').val();
	var category = $('#bookMarkAddCategory').val();
	var filename = $('#addBookMarkImage').val();
	
	if(filename == ''){
		alert('no file');
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
			kaka = e;
			alert('추가 성공!!');
		});
	}else{
		alert('file');
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
