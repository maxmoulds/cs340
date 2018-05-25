function updateInventory(id){
    $.ajax({
        url: '/items/inventory/' + id,
        type: 'PUT',
        data: $('#update-inventory').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
