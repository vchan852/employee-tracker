-- View all employees query
SELECT employee.id, employee.first_name, employee.last_name, role.salary, role.title AS role, department.name AS department, CONCAT(manager.first_name, "_", manager.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON  manager.id = employee.manager_id;


-- View all roles query
SELECT role.title, role.id, role.salary, department.name AS department_id
FROM  role
JOIN department ON role.department_id = department.id;