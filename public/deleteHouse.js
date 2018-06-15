function deleteHouse(id){
    $.ajax({
        url: '/house_characters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};