function updateItems(id){
    $.ajax({
        url: '/items/info/' + id,
        type: 'PUT',
        data: $('#update-items').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
