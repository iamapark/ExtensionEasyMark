var loginUserId;
init();

// 초기화 함수
function init() {
	if (localStorage.getItem('MEMBERID') != null) {
		$('#main').show();
		$('#loginForm').hide();
		$('#bookMarkAdd').hide();
	} else {
		$('#main').hide();
		$('#bookMarkAdd').hide();
	}
}

//현재 페이지 북마크에 추가하기 클릭했을 때
$('#addBookMark').click(function() {
	$('#bookMarkAdd').show();
	$('#main').hide();
	chrome.tabs.query({
		active : true
	}, function(data) {
		$('#bookMarkAddURl').val(data[0].url);
		$('#bookMarkAddName').val(data[0].title);
	});
});

//북마크 추가 버튼을 클릭했을 때
$('#bookMarkAddButton').click(function(e) {
	e.preventDefault();
	var url = $('#bookMarkAddURl').val();
	var name = encodeURI($('#bookMarkAddName').val());
	var desc = encodeURI($('#bookMarkAddDesc').val());
	var category = encodeURI($('#bookMarkAddCategory').val());
	var filename = $('#addBookMarkImage').val();

	if (filename == '') {
		$.ajax({
			url : targetUrl + 'addMark',
			dataType : 'json',
			data : {
				url : url,
				name : name,
				description : desc,
				category : category,
				userId : loginUserId
			}
		}).done(function(d) {
			kaka = e;
			alert('추가 성공!!');
		});
	} else {
		$("#bookMarkAddForm").ajaxSubmit({
			dataType : 'html',
			success : function(data, rst) {
				alert('추가 성공');
			}
		});
	}
});

//아이디와 비번을 입력하고 로그인 버튼을 눌렀을 때 서버측에서 호출하는 콜백 함수
var userCheckResult = function(data) {
	if (data.result == 'true') { // 로그인 성공
		if ($('#loginIdKeep').is(':checked')) {
			localStorage.setItem('MEMBERID', data.userId);
		} else {
			loginUserId = data.userd;
		}
		$('#main').show();
		$('#loginForm').hide();
	} else { // 로그인 실패
		alert('로그인 정보가 알맞지 않습니다.');
	}
};

//아이디와 비번을 입력하고 로그인 버튼을 눌렀을 때
$('#loginButton').click(function() {
	userId = $('#userId').val();
	password = $('#password').val();
	loginFunc(userId, password);
});

//북마크 옮기기 클릭했을 때
$('#moveBookMark').click(function() {
	dumpBookmarks();
});

//로그아웃 클릭했을 때
$('#logout').click(function() {
	alert('로그아웃');
	localStorage.removeItem('MEMBERID');
});

//Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
	var bookmarkTreeNodes = chrome.bookmarks
			.getTree(function(bookmarkTreeNodes) {
				data = bookmarkTreeNodes;
				
				$.ajax({
					url: targetUrl + 'getBookmarkTree',
					dataType:'json',
					type:'POST',
					data:{
						treeData:encodeURI(JSON.stringify($(data)))
					}
				}).done(function(data){
					if(data == true){
						alert('크롬 계정의 북마크가 EasyMark 계정으로 옮겨졌습니다.');
					}
				});
			});
}
function dumpTreeNodes(bookmarkNodes, query) {
	var list = $('<ul>');
	var i;
	for (i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i], query));
	}
	return list;
}
function dumpNode(bookmarkNode, query) {
	if (bookmarkNode.title) {
		if (query && !bookmarkNode.children) {
			if (String(bookmarkNode.title).indexOf(query) == -1) {
				return $('<span></span>');
			}
		}
		var anchor = $('<a>');
		anchor.attr('href', bookmarkNode.url);
		anchor.text(bookmarkNode.title);
		/*
		 * When clicking on a bookmark in the extension, a new tab is fired with
		 * the bookmark url.
		 */
		anchor.click(function() {
			chrome.tabs.create({
				url : bookmarkNode.url
			});
		});
		var span = $('<span>');
		var options = bookmarkNode.children ? $('<span>[<a href="#" id="addlink">Add</a>]</span>')
				: $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" '
						+ 'href="#">Delete</a>]</span>');
		var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>'
				+ '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">'
				+ '</td></tr></table>')
				: $('<input>');
		// Show add and edit links when hover over.
		span.hover(function() {
			span.append(options);
			$('#deletelink').click(function() {
				$('#deletedialog').empty().dialog({
					autoOpen : false,
					title : 'Confirm Deletion',
					resizable : false,
					height : 140,
					modal : true,
					overlay : {
						backgroundColor : '#000',
						opacity : 0.5
					},
					buttons : {
						'Yes, Delete It!' : function() {
							chrome.bookmarks.remove(String(bookmarkNode.id));
							span.parent().remove();
							$(this).dialog('destroy');
						},
						Cancel : function() {
							$(this).dialog('destroy');
						}
					}
				}).dialog('open');
			});
			$('#addlink').click(function() {
				$('#adddialog').empty().append(edit).dialog({
					autoOpen : false,
					closeOnEscape : true,
					title : 'Add New Bookmark',
					modal : true,
					buttons : {
						'Add' : function() {
							chrome.bookmarks.create({
								parentId : bookmarkNode.id,
								title : $('#title').val(),
								url : $('#url').val()
							});
							$('#bookmarks').empty();
							$(this).dialog('destroy');
							window.dumpBookmarks();
						},
						'Cancel' : function() {
							$(this).dialog('destroy');
						}
					}
				}).dialog('open');
			});
			$('#editlink').click(function() {
				edit.val(anchor.text());
				$('#editdialog').empty().append(edit).dialog({
					autoOpen : false,
					closeOnEscape : true,
					title : 'Edit Title',
					modal : true,
					show : 'slide',
					buttons : {
						'Save' : function() {
							chrome.bookmarks.update(String(bookmarkNode.id), {
								title : edit.val()
							});
							anchor.text(edit.val());
							options.show();
							$(this).dialog('destroy');
						},
						'Cancel' : function() {
							$(this).dialog('destroy');
						}
					}
				}).dialog('open');
			});
			options.fadeIn();
		},
		// unhover
		function() {
			options.remove();
		}).append(anchor);
	}
	var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
	if (bookmarkNode.children && bookmarkNode.children.length > 0) {
		li.append(dumpTreeNodes(bookmarkNode.children, query));
	}
	return li;
}
