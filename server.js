
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = require('./db/connection');

// Prompt User for Choices
const promptUser = () => {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Update Employee Role',
          'Exit'
          ]
      }
    ])
    .then (answer => {

      const choice = answer.choices;

      if (choice === 'View All Employees') {

        viewAllEmployees()
        

      }
      if (choice === 'View All Roles') {

        ViewAllRoles();

        
      }
      if (choice === 'View All Departments') {

        ViewAllDepartment();

        
      }
      if (choice === 'Add Employee') {
         addEmployee();

      }
      if (choice === 'Add Role') {

        AddNewRole();

      }
      if (choice === 'Add Department') {

        AddNewDepartment();

      }
      if (choice === 'Update Employee Role') {
        UpdateEmployeeRole();

      }
      if (choice === 'Exit') {
        db.end();

      }
    })
  }

let viewAllEmployees = () => {
  let sql =  `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
              role.salary, department.name, CONCAT(m.first_name, " ", m.last_name) AS manager 
              FROM employee 
              LEFT JOIN role ON employee.role_id = role.id 
              LEFT JOIN department ON role.department_id = department.id 
              LEFT JOIN employee m ON employee.manager_id = m.id;`

  db.query(sql, (err, rows) => {
    if (err) throw error;
    console.table(rows);
    promptUser()
  })

}

let ViewAllRoles = () => {
  let sql =  `SELECT role.id, role.title, role.salary
  FROM role`

  db.query(sql, (err, rows) => {
    if (err) throw error;
    console.table(rows);
    promptUser()
  })

};


let ViewAllDepartment = () => {
  let sql =  `SELECT * FROM department`
  db.query(sql, (err, rows) => {
    if (err) throw error;
    console.table(rows);
    promptUser()
  })   
                   

};


let addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
        validate: firstname => {
          if (firstname) {
              return true;
          } else {
              console.log('Please enter a valid first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
        validate: lastname => {
          if (lastname) {
              return true;
          } else {
              console.log('Please enter a valid last name');
              return false;
          }
        }
      }
    ])
    .then(answer => {
      let info = [answer.first_name, answer.last_name]
      let sql = `SELECT role.id, role.title FROM role`;
      db.query(sql, (err, data) => {
        if (err) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                let role = roleChoice.role;
                info.push(role);
                let sql =  `SELECT * FROM employee`;
                db.query(sql, (err, data) => {
                  if (err) throw error;
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      info.push(manager);
                      const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                      db.query(sql, info, (err) => {
                        if (err) throw error;
                      console.log("New employee has been added!")
                      viewAllEmployees();
                });
              });
            });
          });
       });
    });
  };

// Add a New Role
let AddNewRole = () => {
  let RoleInfo = [];
  inquirer.prompt([
    {
      type: 'input',
      name: 'role_name',
      message: "What is the name of the role?",
      validate: roleName => {
        if (roleName) {
            return true;
        } else {
            console.log('Please enter a valid role name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the salary of the role?",
      validate: salary => {
        if (salary) {
            return true;
        } else {
            console.log('Please enter a valid salary');
            return false;
        }
      }
    }
  ])
    .then (answer => {
      RoleInfo.push(answer.role_name, answer.salary);
      let sql = `SELECT * FROM department`;
      db.query(sql, (err, rows) => {
        if (err) throw error;

        let departments =[];
        rows.forEach((department) => {departments.push(department.name)});
        inquirer.prompt ([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: departments
          }
        ])
          .then (answer => {
            let departmentId;
            rows.forEach((department) => {
              if (answer.departmentName === department.name) {departmentId = department.id;}
            });
            RoleInfo.push(departmentId)

            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(sql, RoleInfo, (err) => {
              if (err) throw error;

              console.log("New role is successfully added");
              ViewAllRoles();

      
            })

          })

      })
    })
};

let AddNewDepartment = () => {

  inquirer.prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of the department?',
          validate: department => {
            if (department) {
                return true;
            } else {
                console.log('Please enter a valid department name');
                return false;
            }
          }
        }
      ])
      .then((answer) => {
        let sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, answer.newDepartment, (err, response) => {
          if (err) throw error;
          
          ViewAllDepartment();
        });
      });

}

const UpdateEmployeeRole = () => {
  let sql =  `SELECT * FROM employee`;
  db.query(sql, (err, data) => {
    if (err) throw error;
    let employeeNamesArray = [];
    data.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    let sql =  `SELECT role.id, role.title FROM role`;
    db.query(sql, (err, rows) => {
      if (err) throw error;
      let rolesArray = [];
      rows.forEach((role) => {rolesArray.push(role.title);});

      inquirer.prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          rows.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
           
          });

          data.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
              
            }
            
          });

          let sql =  `UPDATE employee SET role_id = ? WHERE id = ?`;
          db.query(
            sql,
            [newTitleId, employeeId],
            (err) => {
              if (err) throw error;
              
              viewAllEmployees();
            }
          );
        });
    });
  });
};



promptUser();


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

