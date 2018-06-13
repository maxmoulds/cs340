function updateClasses(id){
    $.ajax({
        url: '/classes/' + id,
        type: 'PUT',
        data: $('#update-classes').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
