INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (title, department_id, salary)
VALUES
  ('Sales Lead', 4, 100000),
  ('Salesperson', 4, 80000),
  ('Lead Engineer', 1, 150000),
  ('Software Engineer', 1, 120000),
  ('Account Manager', 2, 160000),
  ('Accountant', 2, 125000),
  ('Legal Team Lead', 3, 250000),
  ('Lawyer', 3, 190000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, null),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, null),
  ('Charles', 'LeRoi', 4, 3),
  ('Katherine', 'Mansfield', 5, null),
  ('Dora', 'Carrington', 6, 5),
  ('Edward', 'Bellamy', 7, null),
  ('Montague', 'Summers', 8, 7);

  