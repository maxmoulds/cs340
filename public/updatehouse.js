function updateHouse(id){
    $.ajax({
        url: '/house/' + id,
        type: 'PUT',
        data: $('#update-house').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
