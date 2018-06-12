function updateCharacter(id){
    $.ajax({
        url: '/character/update/' + id,
        type: 'PUT',
        data: $('#update-character').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};


function selectHouse(house_id){
    $("#house-selector").val(house_id);
}
