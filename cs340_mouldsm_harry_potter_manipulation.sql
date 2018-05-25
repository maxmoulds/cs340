-- SELECT
-- getCharacters... get all characters and their information from the character table
SELECT id, fname, lname, role_id, dob, house_id FROM `character`

-- getCharacter... Get a specific character from the character table whose id matches a supplied integer. 
SELECT id, fname, lname, dob FROM `character` WHERE id = [auto-incrementing int]

-- getItems. Used to display all items on the items page.
SELECT id, name, description FROM `items`

-- getAllInventory… This grabs all items from all characters and allows a user to see the whole inventory and possible run local filtering to further parse down the dataset. When the database gets larger this function will be problematic.
SELECT C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id

-- getCharacterInventory... Populates data for all items currently possessed by a character specified. This includes description and amount of (quantity).
SELECT C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE C.id = [user supplied id]

-- getItemOwners… Given an item ID gather all character IDs that possess one or more of that item and return those characters. This may not work as expected with zeroing a quantity or if we are not actually deleting a row but instead just zeroing the amount. Need to test with larger datasets.  
SELECT C.id, C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE I.id = [idInput]

-- getHouses... getHouseID. These functions help populate data for the forms to display. While getHouses does show all the houses getHouseID just returns all the possible house IDs so a dropdown can populate. 
SELECT id, name, location, color_primary, color_secondary, points FROM `house`

-- getHouseStudents... Gathers all characters that belong to a house. The function will be renamed to getHouseCharacters in future submissions. 
SELECT id, fname, lname, dob, house_id FROM `character` WHERE house_id = [houseInput]

-- getRoleID… Populates a unique list of possible roles for a character. This is used to help display data and used in drop downs for that field. 
SELECT DISTINCT role_id FROM `character`

-- getCharacterClasses… This populates a list of 
SELECT class.id, class.description, class.instructor, class.instructor, class.subject FROM `class` INNER JOIN`student_class_list` ClassList ON class.id = ClassList.class_id WHERE ClassList.character_id = [character_id]

-- getClasses…. Gets all the information about classes from the class table
SELECT DISTINCT id, subject, instructor, description FROM `class`


-- UPDATE
-- updateCharacter... Update the information for a particular character that is already in the database. The only thing a user can’t change about the character with this update is the character’s ID.
UPDATE `character` SET fname=[fnameInput], lname=[lnameInput], dob=[dobInput], house_id=[house_idInput] role_id=[role_idInput] WHERE id=[auto_incremented int]

-- updateHouse(need to think this one through)…
UPDATE `house` SET name=[name], location=[location], color_primary=[color_primary], color_secondary=[color_secondary], points=[points] WHERE id=[id]

-- updateEnroll(...enroll flag)  Enroll a student in a class
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES([character_idInput], [class_idInput])

-- INSERT
-- newCharacter... Create a new character and put their information into the character table
INSERT INTO `character` (fname, lname, dob, house_id) VALUES ([fnameInput], [lnameInput], [dobInput], [house_idInput])

-- newHouse... Create new house and put its information into the house table
INSERT INTO `house` (`id`, `name`, `location`, `color_primary`, `color_secondary`, `points`) VALUES([idInput], [name], [location], [color_primary], [color_secondary], [points])

-- newCourse... Create new class and put its information into the class table
INSERT INTO `class` (`id`, `subject`, `instructor`, `description`) VALUES([idInput], '[subjectInput]', [instructor character id], '[descriptionInput]')

-- newItem…  Create a new item and put its information into the items table
INSERT INTO `items` (name, description) VALUES ([nameInput], [descriptionInput])

-- updateInventory… Change item that is possessed by a character by changing amount of. 
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES([character_idInput], [item_idInput], [amount_ofInput]);

-- DELETE
-- deleteItem...
DELETE FROM `items` WHERE id = [idInput]

-- deleteCharacter... Delete a character from the character table
DELETE FROM `character` WHERE character_id = [character_idInput]

-- deleteHouse…
DELETE FROM `house` WHERE id = [idInput]

-- updateEnroll... Remove a student from a class
DELETE FROM `student_class_list` WHERE character_id = [character_idInput] AND class_id = [class_idInput]

-- deleteCourse… Delete a course  from the class table
DELETE FROM `class` WHERE id = [idInput]

-- updateInventory
DELETE FROM `item_list` WHERE character_id = [character_idInput] AND item_id = [item_idInput]

