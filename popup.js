$('#addBookMark').click(function(){
	alert('addBookMark3');
	$('#bookMarkAdd').show();
	chrome.tabs.query({active: true}, function(data) {
		kaka = data;
		console.log(data);
		
		$('#bookMarkAddURl').val(data[0].url);
		$('#bookMarkAddName').val(data[0].title);
		
	} );
});

$('#bookMarkAddButton').click(function(){
	var url = $('#bookMarkAddURl').val();
	var name = $('#bookMarkAddName').val();
	var desc = $('#bookMarkAddDesc').val();
	console.log('name: ' + name);
	$.ajax({
		url: 'http://localhost:8080/EasyMark/extensionAddMark',
		dataType:'json',
		data:{
			url: url,
			name: name,
			desc: desc
		}
	}).done(function(){
		alert('추가 성공!!');
	});
});

$('#moveBookMark').click(function(){
	alert('moveBookMark');
});

$('#main').hide();
$('#bookMarkAdd').hide();
