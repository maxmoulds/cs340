function deleteClass(class_id){
    $.ajax({
        url: '/class/del/' + class_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCharacterFromClass(class_id, character_id){
  $.ajax({
      url: '/classes/del/' + class_id + '/' + character_id,
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
