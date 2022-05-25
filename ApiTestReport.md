# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration and API Test Report](#integration-and-api-test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Integration Tests](#integration-tests)
  - [Step 1](#step-1)
  - [Step 2](#step-2)
- [API testing - Scenarios](#api-testing---scenarios)
  - [Scenario UCx.y](#scenario-ucxy)
- [Coverage of Scenarios and FR](#coverage-of-scenarios-and-fr)
- [Coverage of Non Functional Requirements](#coverage-of-non-functional-requirements)
    - [](#)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

    The integration sequence adopted is Bottom Up.
    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | Jest test cases |
|--|--|
| controlUser | get supplier, get supplier wrong, get user , create new user, create new user with bad type, check user for new user good, check user for new user bad, check user for delete/update good, check user for delete/update bad, do session good, do session bad, modify user right, delete user|
| controlOrder(restock Order) | retriving a new restock order, retriving a single order, unexpected data format, 'modify state of order, add transport note, add SKUItems |
| controlOrder(internal Order) | modify a single order |
| controlOrder(return Order)| get a new order|


## Step 2
| Classes  | Jest test cases |
|--|--|
|controlUser + userService| create and retrive new User, create new User that already exist, get new supplier, get supplier without supplier in db, check for newUser done, check for newUser bad, check for update/del user done, check for update/del user bad, do session with right credentials, do session with credentials incorrect, change user right, delete user|
| controlTest (testDescriptor) + testService | get testDescriptor, create testDescriptor data, testDescriptor no sku associated idSKU, modify testDescriptor data with success, testDescriptor no test descriptor associated id or no sku associated to IDSku, delete testDescriptor, delete testDescriptor validation of id failed |
| controlTest (testResult) + testService| get testResult, create testResult data, testResult no sku item associated to rfid or no test descriptor associated to idTestDescriptor, modify testResult data, testResult no sku item associated to rfid or no test descriptor associated to idTestDescriptor, delete testResults, delete testResults validation of id failed |
|controlSKU (SKUItem) + SKUService| get SKUItem, modify SKUItem data with success, create SKUItem data, SKUItem with 404, get SKUItemAvailable|
|controlSKU (Position) + SKUService| get Position, Positions modification success, Positions modification error (newOccupiedWeight > newMaxWeight), Positions modification error (not only digits in newRow), Position with success, Postion with 422 (not derived error), Postion with 422 (wrong aisleid length), PositionID modification success, PositionID modification error (not only digits), PositionID modification error (not only digits in old position)  |
|controlSKU (Item) + SKUService| get Item, modify Item data with success, modify Item data with error (new price negative), delete Items, delete Item empty, delete Item with 404 error |
|controlOrder (restock Order) + orderService | create an order, delete an order, fail to cerate an order, modify state of an order, fail to modify an order by its ID, retrive de SKUs and try wrong ID, try to modify note with wrong ID |





# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UCx.y

| Scenario |  name |
| ------------- |:-------------:| 
|  Precondition     |  |
|  Post condition     |   |
| Step#        | Description  |
|  1     |  ... |  
|  2     |  ... |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| 1-1 (create SKU) | FR2.1 (create/modify) | createSKUItem() |             
| 1-2 (modify SKU location)  | FR2.4(search) <br/> FR2.1 | getSKUItems() <br/> modifySKUItem() |             
| 1-3 (modify SKU weight volume) | FR2.4 <br/> FR2.1 | getSKUItems() <br/> modifySKUItem() |             
| 2-1 (create Position) | FR3.1.1 (create/modify) | createPosition() |             
| 2-2 (modify Position ID) | FR3.1.3 (list) <br/> FR3.1.1  | getPositions() <br/> modifyPositionID() |             
| 2-3 (modify weight volume of p) | FR3.1.3 <br/> FR3.1.4 (modify attr)  |  getPositions() <br/> modifyPosition()   |  
| 2-4 (Modify aisle ID, row and column of P) | FR3.1.3 <br/> FR3.1.4 | getPositions() <br/> modifyPosition()|  
| 2-5 (Delete Position) | FR3.1.3 <br/> FR3.1.2 (delete) | getPositions() <br/> deletePosition()|           
| 3-1 (Restock Order of SKU S issued by quantity) | FR5.1 <br/> FR5.3  <br/> FR5.5 <br/> FR5.6 ?? ||           
| 3-2 (Restock Order of SKU S issued by supplier) | FR5.1 <br/> FR5.5  <br/> FR5.3 <br/> FR5.6 ?? ||      
| 4-1 (Create user and define rights) |  FR1.1 <br/> FR1.5 | newUser() <br/> updateUserType()|           
| 4-2 (Modify user rights) | FR1.4 <br/> FR1.3 <br/> FR1.5 | getUsers() <br/> updateUserType()|  
| 4-3 (Delete user) | FR1.4 <br/> FR1.3 <br/> FR1.2 | getUsers() <br/> deleteUser()|  
| 5-1-1 (Record restock order arrival) | FR5.8.1 <br/> FR5.8.3 <br/> FR5.7 ??  ||  
| 5-2-1 (Record positive test results of all SKU items of a RestockOrder) | FR5.8.2 <br/> FR5.7 ?? ||  
| 5-2-2 (Record negative test results of all SKU items of a RestockOrder) | FR5.8.2 <br/> FR5.7 ?? ||  
| 5-2-3 (Record negative and positive test results of all SKU items of a) | FR5.8.2 <br/> FR5.7 ?? ||  
| 5-3-1 (Stock all SKU items of a RO) | (BOH) <br/> FR3.1.4 <br/> FR2.1 <br/>FR5.7 ?? ||  
| 5-3-2 (Stock zero SKU items of a RO) | ||
| 5-3-3 (Stock some SKU items of a RO) | ||  
| 6-1 (Stock some SKU items of a RO) | ||  
| 6-2 (Stock some SKU items of a RO) | ||  






         





# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|                            |           |

