function updateCharacterInventory(character_id, item_id){
	console.log("in updateCharacterInventory");
    $.ajax({
        url: '/character-inventory/update/' + character_id + '/' + item_id,
        type: 'PUT',
        data: $('#update-inventory').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};