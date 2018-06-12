function updateItems(id){
    $.ajax({
        url: '/items/' + id,
        type: 'PUT',
        data: $('#update-items').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
