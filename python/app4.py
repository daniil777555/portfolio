from copy import copy, deepcopy


class Person:
    def __init__(self, name, age) -> None:
        self.name = name
        self.age = age

class Company:
    def __init__(self, boss, employee) -> None:
        self.boss = boss
        self.employee = employee


p1 = Person('Mike', 33)
p2 = Person('Alex', 23)
company = Company(p1, p2)
c_clone = deepcopy(company)

c_clone.boss.age = 44

print(c_clone.boss.age, company.boss.age, p1.age)