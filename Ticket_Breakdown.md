# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

All the tasks are suposed to be developed including unity tests.

Task template:
### Task X - Title of the task
- **Description**: Description of the task
- **Deploy depends on**: Task deploy dependency(only). The other tasks may be developed in parallel but they will still depends on the mentioned task here for e2e testing and deploy.
- **Acceptance criteria**: The definition of done of the task
- **Effort estimation**:based on fibonacci(1,2,3,5,8,13)


### Task 1 - Title: create a migration to add external_id field in the Agent table

- **Description**: create a migration to add external_id(the agent facility id) as a string nullable field to Agent table
- **Deploy depends on**: -
- **Acceptance criteria**: external_id string null field added to Agent table in production
- **Effort estimation**: 1 (simple ALTER migration)

### Task 2 - Title: Add external_id to "Agents" resource "CRUD" methods:
- **Description**: Add the external_id in the following methods of the Agents resource:

    **POST**: 

    - **in the repository layer**: add in the create "Agent" query the new field external_id
    - **add the external_id field to the request body contract as a *required* field and pass it to the next layers of the app until the repository layer

    **GET**:

    - **in the repository layer**: return the new field external_id in the select query
    - **map the new external_id field returned by the select query on all the layers of the app until it is returned in the response of the GET request. 

    **GET /:id**:

    - **in the repository layer**: return the new field external_id in the "select by id" query
    - map the new external_id field returned by the "select by id" query on all the layers of the app until it is returned in the response of the GET /:id request. 

    **PUT**: (Probably not necessary since it is dangerous to let a field of identifier nature to be updated)
       
        
    **PATCH**: (Probably not necessary since it is dangerous to let a field of identifier nature to be updated)
        
       

- **Deploy depends on**: Task 1
- **Acceptance criteria**: 

    having external_id implemented in the POST, GET(if this route exists) and GET /:id(if it exists).

- **Effort estimation**: 

    3 - if it happens to be an update only in the POST route

    5 - if it happens to be an update in the POST, GET and GET /:id routes

    Though this change is not complex, it may cause changes to many files.

### Task 3 - Title: Returns the agent external_id as the agent id the `getShiftsByFacility`

- **Description**:    
    **In the query used by this function**: replace the internal id of the agent by the external_id of the agent 
    **In the rest of the code related to this function**: replaces the `id` variable name by `externalId` in the context of this function and related code.
    Obs.: Keep the `generateReport` function generating the pdf with the agent id field named the same way

- **Deploy depends on**: Task 1
- **Acceptance criteria**: 
    generate a pdf displaying on the Agent id column of the table, the external ids of the agents instead of its internal ids.
- **Effort estimation**: 3
    The core rules of this feature is already built. The task here is mainly about remapping a field. 


## Task 4 and 5 must be deployed together

### Task 4 - Title: Load "legacy" Agents facilities ids
- **Description**:
    given a list of custom agent ids and current internal agent ids informed by the facilities in a csv formatted just like this:

    ```
    internal_agent_id, facility_agent_id
    1                   "idhere"
    2                   "idhere2"
    .
    .
    .
    ```

    - create a script to load the custom agent ids in the external_id columnn in the Agents table
    
- **Deploy depends on**: Task 5
- **Acceptance criteria**: all the current agents with the external_id field loaded.
- **Effort estimation**: 2
    
    This task will probably need to be run outside business hours since the goal here is to load all the current agents external ids so we can run the Task 5 and add the NOT NULL constraint to the external_id field in the Agents table

### Task 5 - Title: Add NOT NULL constraint to the external_id field of Agents table
- **Deploy depends on**: Task 4
- **Acceptance criteria**: The external_id field of the agents table being not nullable.
- **Effort estimation**: 1

    Simple ALTER TABLE migration.