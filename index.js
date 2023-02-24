const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
);

//  Questions array for prompt
const options = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit the application'
        ],
        name: 'options',
    }
];

async function init() {
    try {
        inquirer
            .prompt(options)
            .then(async (res) => {
                if ('View all departments' === res.options) {
                    const [results] = await db.promise().query(`SELECT * FROM department`)
                    console.table(results);
                    return init();

                } else if ('View all roles' === res.options) {
                    const [results] = await db.promise().query(`SELECT role.title, role.id, role.salary, department.name AS department_id
                    FROM  role
                    JOIN department ON role.department_id = department.id;`)
                    console.table(results);
                    return init();

                } else if ('View all employees' === res.options) {
                    const [results] = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.salary, role.title AS role, department.name AS department, CONCAT(manager.first_name, "_", manager.last_name) AS manager
                    FROM employee
                    JOIN role ON employee.role_id = role.id
                    JOIN department ON role.department_id = department.id
                    LEFT JOIN employee manager ON  manager.id = employee.manager_id;`)
                    console.table(results);
                    return init();

                } else if ('Add a department' === res.options) {
                    const res = await inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter department name:',
                            name: 'newDepartment',
                        }
                    ])
                    const [results] = await db.promise().query(`INSERT INTO department(name) VALUES (?)`, res.newDepartment)
                    console.table(results);
                    return init();

                } else if ('Add a role' === res.options) {
                    const [departments] = await db.promise().query(`SELECT name, id AS value FROM department`)
                    const res = await inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter job title:',
                            name: 'title',
                        },
                        {
                            type: 'input',
                            message: 'Enter salary:',
                            name: 'salary',
                        },
                        {
                            type: 'list',
                            message: 'Select a department:',
                            choices: departments,
                            name: 'department'
                        },
                    ]);
                    const [results] = await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`, [res.title, res.salary, res.department])
                    console.table(results);
                    return init();

                } else if ('Add an employee' === res.options) {
                    const [role] = await db.promise().query(`SELECT title AS name, id AS value FROM role`);
                    const [manager] = await db.promise().query(`SELECT CONCAT(first_name, "_", last_name) AS name, manager_id AS value FROM employee`); // query not working
                    const res = await inquirer.prompt([
                        {
                            type: 'input',
                            message: 'Enter first name:',
                            name: 'firstName',
                        },
                        {
                            type: 'input',
                            message: 'Enter last name:',
                            name: 'lastName',
                        },
                        {
                            type: 'list',
                            message: 'Select a role',
                            choices: role,
                            name: 'role'
                        },
                        {
                            type: 'list',
                            message: 'Select a manager',
                            chocies: manager,
                            name: 'manager'
                        }
                    ]);
                    const [results] = await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [res.first_name, res.last_name, res.role, res.manager])
                    console.table(results);
                    return init();

                } else if ('Update an employee role' === res.options) {
                    const [employee] = await db.promise().query(`SELECT CONCAT(first_name, "_", last_name) AS name, id AS value FROM employee`)
                    const [role] = await db.promise().query(`SELECT title AS name, id AS value FROM role`)
                    const res = await inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Select an employee:',
                            choices: employee,
                            name: 'employee'
                        },
                        {
                            type: 'list',
                            message: 'Select a role:',
                            choices: role,
                            name: 'role'
                        }
                    ]);
                    const [results] = await db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [res.role, res.employee])
                    console.table(results);
                    return init();
                } else {
                    process.exit(0);
                }
            })
    } catch (err) {
        console.log(err);
    }
};

init()