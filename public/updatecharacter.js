function updateCharacter(id){
	console.log("in updateCharacter");
    $.ajax({
        url: '/character/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};