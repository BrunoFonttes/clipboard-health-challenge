# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

I am [Refactoring - Martin Fowler](https://martinfowler.com/books/refactoring.html) fan, so I applied some concepts addressed in the book in this challenge.

I developed the unit tests first and made little refactors step by step until I got a good improvement, and even so, I re-refactored the suposed "final version" of the code some times.


1. Firstly I added unity tests to cover the function. To do that I analysed all the conditions(ifs) in the code and created a test case for each.

2. I created a coverage script so I could confirm that my tests were covering all the code.

3. I realized that there was no need for checking `if candidate !== "string"` if event doesnt existed once the default value of the candidate for such case is the `TRIVIAL_PARTITION_KEY="0"`, so I moved this code to inside if(event) code block.

4. I realized the the candidate length checking also didnt make sense to be outside the if (event) code block once the `TRIVIAL_PARTITION_KEY` is "0" and it will always be smaller in size than `MAX_PARTITION_KEY_LENGTH(256)`.

5. Reading the code again, I also realized that the candidate typeof string checking didnt make sense to be in the global scope of the `if(event)` code block because if event doesnt have a partition key, the event is already going to be stringified, so I moved it to `if(event.partitionKey)` scope.

6. The candidate.length checking also didnt make sense to be on `if(event)` scope since if there is no event.partitionKey, we already stringify and create a hash of the event, so I moved it to `if(event.partitionKey)` scope as well.

7. I decided to create a new function called `getCandidateFrom` receiving `partitionKey` as parameter to isolate the deterministic partition key logic implemented on the `event.partionKey`

8. I removed the let candidate variable and returned the result of the function in the conditions itself

9. I created the `createHash` function so I could make it more easy to call on the main code(twice in case)

10. I replaced some if/else conditions in the code by ternary operators so the reading could get more concise and easier to read.

11. Despite the code being very small at step 10, it was not readable as much as it could be, at least in my opinion, so I decide to write a little bit more to achieve that by removing the ternary operators, creating the auxiliar function `getStringCandidate` and replacing the if(event) from the end of `deterministicPartitionKey` with if(!event) at the beginning.

12. At last I decided to rename the function `getCandidateFrom` to 
`getPartitionKeyFrom` so it could represent the real meaning of the function and I also named the `event.partitionKey` as `candidate` so it could get more meaningful.

Conclusion: 

Now its possible to read the code and see the following:
- if there is no event, is returned a trivial key,
- if there is an event and it has a partitionKey property, we are gonna use it as a candidate and treat it in a separate function
- if there is an event, but there is no partitionKey to be a candidate, so we are gonna use the whole event to generate the partitionKey.

Hope you like it. :)
