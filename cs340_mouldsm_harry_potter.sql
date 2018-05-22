-- Data Definiton Queries for the sample bsg database for Project 
-- By Samarendra Hedaoo
--
--
--
-- Table structure for table `character`
--
CREATE TABLE IF NOT EXISTS `character` (
  `id` int UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT, -- `character_id` int IDENTITY(950000000,1) PRIMARY KEY, 
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `role_id` int(3) DEFAULT NULL,
  `dob` int(8) DEFAULT NULL,
  `house_id` int NOT NULL DEFAULT 0, -- foreign key
  -- `pack` int(11) UNIQUE NOT NULL DEFAULT 0, -- not needed any more. 
  -- `classes` int(11) UNIQUE NOT NULL DEFAULT 0, -- not needed any more. 
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- set the starting value for chracter id... yay onid numbers. 
ALTER TABLE `character` AUTO_INCREMENT=950000000;

-- create the house table. mainly to track points. 
CREATE TABLE IF NOT EXISTS `house` (
  `id` ENUM('0','1', '2', '3', '4'), -- this is probably not needed.
  `name` ENUM('None', 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'Democrat', 'Republican', 'Canadien'),
  `location` varchar(255) NOT NULL DEFAULT 'HOGWARTS',
  `color_primary` varchar(255) NOT NULL DEFAULT 'BLACK',
  `color_secondary` varchar(255) NOT NULL DEFAULT 'WHITE',
  `points` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- create the items table, this table just is a list of items (ID), name, and description of that item.
CREATE TABLE IF NOT EXISTS `items` (
  `id` int UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL DEFAULT 0,
  `description` varchar(255) NOT NULL DEFAULT 0, -- this should be much larger. 
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- lets start items at 100 for fun. 
ALTER TABLE `items` AUTO_INCREMENT=100;

-- create the table that associates a character and the items owned by them, and # of. 
CREATE TABLE IF NOT EXISTS `item_list` (
  `character_id` int UNSIGNED NOT NULL DEFAULT 0,
  `item_id` int UNSIGNED NOT NULL DEFAULT 0,
  `amount_of` int UNSIGNED NOT NULL DEFAULT 0, -- how to do fractions and the such... grrr. review later. 
  FOREIGN KEY (character_id) REFERENCES `character` (id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES `items` (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- create class table 
CREATE TABLE IF NOT EXISTS `class` (
  `id` int UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL DEFAULT 0,
  `instructor` int UNSIGNED DEFAULT 0,  -- is a character id from the character table, will have NULL due to InnoDB being a boo-boo.
  `description` varchar(255) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (instructor) REFERENCES `character` (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- set the auto increment starting num
ALTER TABLE `class` AUTO_INCREMENT=10000; -- yay crns

-- create the student_class_list table
CREATE TABLE IF NOT EXISTS `student_class_list` (
  `character_id` int UNSIGNED NOT NULL DEFAULT 0, 
  `class_id` int UNSIGNED NOT NULL DEFAULT 0, 
  FOREIGN KEY (character_id) REFERENCES `character` (id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES `class` (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- AND WE ARE DONE WITH CREATION, now constraints, default data, and some DELETES, INSERTS and others. 
-- DELETE character, done, but should test. 
-- DELETE house (cant happen...)
-- DELETE item from items. --works. 
-- DELETE class, works, but student_class_list does not update right. mark for review. 
-- DELETE done
-- UPDATE/INSERT character, doesnt enforce making a class list.

-- we now need to seed our db. 
INSERT INTO `house` (`id`, `name`, `location`, `color_primary`, `color_secondary`, `points`) VALUES(1, 'Gryffindor', 'behind some picture', 'red', 'gold', 1137);
INSERT INTO `house` (`id`, `name`, `location`, `color_primary`, `color_secondary`, `points`) VALUES(2, 'Hufflepuff', 'In the kitchen', 'yellow', 'green', 1009);
INSERT INTO `house` (`id`, `name`, `location`, `color_primary`, `color_secondary`, `points`) VALUES(3, 'Ravenclaw', 'By the statue of Roena Raveclaw dumbasses', 'blue', 'brown', 1243);
INSERT INTO `house` (`id`, `name`, `location`, `color_primary`, `color_secondary`, `points`) VALUES(4, 'Slytherin', 'In the dungeons', 'green', 'silver', 982);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000001, 'Harry', 'Potter', 1, 31071980, 1);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000002, 'Ronaldine', 'Weasley', 1, 01121980, 1);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000003, 'Hermoine', 'Granger', 1, 01011981, 1);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000004, 'Ned', 'Leadbetter', 1, 11081979, 1);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000005, 'Firenze', '', 1, 01101920, 2);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000006, 'Argus', 'Felcher', 3, 13091948, 0);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000007, 'Cemydick', 'Digerree', 1, 03021978, 2);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000008, 'Chow', 'Change', 1, 99011978, 3);
INSERT INTO `character` (`id`, `fname`, `lname`, `role_id`, `dob`, `house_id`) VALUES(951000009, 'Dracusinia', 'Malfoy', 4, 19121980, 4);
INSERT INTO `items` (`id`, `name`, `description`) VALUES(102, 'Simple Robe', 'basic robe consisting of high quality ballistic kevlar and natural elk sinew');
INSERT INTO `items` (`id`, `name`, `description`) VALUES(103, 'Generic Stick Wand', 'A basic twig that was picked up by a grifter and sold to easily manipulated children');
INSERT INTO `items` (`id`, `name`, `description`) VALUES(101, 'Galleon', 'Unit of currency');
INSERT INTO `items` (`id`, `name`, `description`) VALUES(100, 'Sickle', 'Unit of currency, partial denomination of a Galleon');
INSERT INTO `items` (`id`, `name`, `description`) VALUES(104, 'Berty Bots Every Flavor Bean - Booger', 'A booger that has been sold by a grifter to some easily manipulated children');
INSERT INTO `class` (`id`, `subject`, `instructor`, `description`) VALUES(1, 'POTIONS 101', 951000005, 'And Introduction to Potions and other Potent Potables of the Magical Making');
INSERT INTO `class` (`id`, `subject`, `instructor`, `description`) VALUES(2, 'ASTRONOMY 340', 951000005, 'Design and implementation of relational databases, including data modeling with ER or UML, diagrams, relational schema, SQL queries, relational algebra, user interfaces, and administration, ALL IN SPACE.');
INSERT INTO `class` (`id`, `subject`, `instructor`, `description`) VALUES(3, 'CHARMS 261', 951000005, 'Getting fat on lucky charms');
INSERT INTO `class` (`id`, `subject`, `instructor`, `description`) VALUES(4, 'TRANSFIGURATION 653', 951000005, 'Studying non-standard sexual dimorphisms that exist in the human species');
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000001, 1);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000002, 1);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000002, 2);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000001, 4);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000003, 1);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000003, 2);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000003, 3);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000003, 4);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000004, 4);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000005, 2);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000007, 3);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000008, 4);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000008, 1);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000009, 1);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000009, 3);
INSERT INTO `student_class_list` (`character_id`, `class_id`) VALUES(951000009, 4);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000001, 102, 0);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000002, 104, 90215912);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000003, 100, 99);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000003, 101, 9999999999);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000003, 102, 13);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000003, 103, 4);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000003, 104, 123);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000004, 102, 1);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000005, 102, 1);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000006, 102, 1);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000007, 102, 1);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000008, 102, 1);
INSERT INTO `item_list` (`character_id`, `item_id`, `amount_of`) VALUES(951000009, 102, 1);


-- done yay
