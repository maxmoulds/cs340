function deleteSingleItem(id){
	console.log("hello from deleteSingleItem");
  $.ajax({
    url: '/items/' + id,
    type: 'DELETE', //lack of comma here cost me over an hour of time.
    success: function(result){
      window.location.reload(true);
    }
  })
}