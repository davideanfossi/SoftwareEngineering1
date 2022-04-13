# Project Estimation

Date:

Version:

# Estimation approach

Consider the EZWH project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course

# Estimate by size

###

|                                                                                                         | Estimate                           |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| NC = Estimated number of classes to be developed                                                        | 20 (At least 15 form U.C. Diagram) |
| A = Estimated average size per class, in LOC                                                            | 150 LOC                            |
| S = Estimated size of project, in LOC (= NC \* A)                                                       | 3000 LOC                           |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)                    | 300 ph                             |
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                                     | 9000 euros                         |
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | ~1.9 C. Weeks                      |

<!-- ((300/4)/8)/5 -->

# Estimate by product decomposition

###

| component name       | Estimated effort (person hours) |
| -------------------- | ------------------------------- |
| Requirement document | 40 ph                           |
| GUI prototype        | 24 ph                           |
| design document      | 24 ph                           |
| code                 | 120 ph                          |
| unit tests           | 32 ph                           |
| api tests            | 32 ph                            |
| management documents | 24 ph                           |
| Total                | 296 ph                          |

# Estimate by activity decomposition

###

| Activity name                           | Estimated effort (person hours) |
| --------------------------------------- | ------------------------------- |
| Requirements                            |                                 |
| - Analyze the problem and define a view | 16 ph                           |
| - Define system requirements            | 16 ph                           |
| - Analyze software requirements         | 4 ph                            |
| - Build user cases and scenarios        | 8 ph                            |
| - Prototype GUI                         | 24 ph                           |
| Design                                  |                                 |
| - Construct classes and functions       | 16 ph                           |
| - Generate a documentation              | 24 ph                           |
| - Verify completeness                    | 8 ph                            |
| - Evaluate design                       | 16 ph                           |
| Code                                    | 120 ph                          |
| Testing                                 | 64 ph                           |
| Project management                       |                                 |
| - Estimation                            | 4 ph                            |
| - Scheduling                            | 4 ph                            |
| - Replanning                            | 8 ph                            |
| Deployment                              | 40 ph                           |
| Total                                   | 368 ph                          |

### Gantt Chart

![gantt chart](Gantt.PNG "Gantt Chart")

# Summary

<!-- Report here the results of the three estimation approaches. The estimates may differ. Discuss here the possible reasons for the difference -->

|                                    | Estimated effort | Estimated duration |
| ---------------------------------- | ---------------- | ------------------ |
| estimate by size                   | 300 ph           | 1.9 weeks          |
| estimate by product decomposition  | 296 ph           | 1.8 weeks          |
| estimate by activity decomposition | 368 ph           | 2.3 weeks          |

\*(Assuming a team of 4 people, 8 hours per day, 5 days per week )
## Conclusion 
- The estimation by activity is the most detailed of the three systems and as it has more rows to assign time, this may result in the over estimation of the required person hours that each activity takes, in the other hand, the estimation by product decomposition may sub estimate the required time to develop an item as a result of confidence, although a pretty similar result to the estimation was achieved.
- Consistence among the estimations might not be always as a result and as a result similar activities may differ in the amount of work required, also, some activities may be assigned more time in the last estimation while the same effort is assumed to be a section of a product, thus resulting in a difference in time.
