INSERT INTO department (name)
VALUES ("Engineering"),
        ("Communications"),
        ("Legal"),
        ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 150000, 1),
        ("Lead Engineer", 190000, 1),
        ("Communications Lead", 50000, 2),
        ("Communications Assistant", 20000, 2),
        ("Lawyer", 200000, 3),
        ("Paralegal", 20000, 3),
        ("Bookkeeper", 10000, 4),
        ("Controller", 120000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kim", "K", 1, NULL),
        ("Johnny", "King", 3, NULL),
        ("Joshua", "Hong", 5, NULL),
        ("DK", "Lee", 8, NULL),
        ("Vernon", "Choi", 2, NULL),   
		("Hope", "Street", 4, NULL),
		("Do", "Young", 6, NULL),
        ("Jae", "Hyun", 7, NULL);