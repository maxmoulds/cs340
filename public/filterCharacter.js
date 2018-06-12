function filterCharacterByHouse() {
    //get the id of the selected homeworld from the filter dropdown
    var homeworld_id = document.getElementById('house_filter').value
    //construct the URL and redirect to it
    window.location = '/character/filter/' + parseInt(house_id)
}
