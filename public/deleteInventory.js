function deleteInventory(character_id, item_id){
	console.log("in deleteInventory");
  $.ajax({
    url: '/character-inventory/' + character_id + '/' + item_id,
    type: 'DELETE', //lack of comma here cost me over an hour of time.
    success: function(result){
      window.location.reload(true);
    }
  })
}