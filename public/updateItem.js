function updateItem(item_id){
    $.ajax({
        url: '/items/update/' + item_id,
        type: 'PUT',
        data: $('#update-item').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
