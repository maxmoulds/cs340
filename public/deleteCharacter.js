function deleteCharacter(id){
    $.ajax({
        url: '/character/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteItem(character_id, item_id, amount_of){
  $.ajax({
      url: '/items/info/' + character_id + '/' + item_id + '/' + amount_of,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true); //'/items/info/' + character_id + '/' + item_id)
          } 
      }
  })
};
