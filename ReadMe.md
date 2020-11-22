# Data Samples API

## Data Sample - all fields are required
  - timestamp - Sample Date
  - sampleType - Can be one of the following: `volume` / `pressure` / `temperature`. 
  - value - A number which is validated according to the sampleType

You can query a sample and view it timestamp any timezone from: https://momentjs.com/timezone/


## Rule
 - formula - a formula that will later be assessed/evaluated with data samples values, to a boolean (True/False) result.

 ### Examples
 1. ` {temperature} > 50 ` - checks that the last (by timestamp) temperature sample value is greater than 50 degrees (assuming in celsius)
 2. ` {pressure} < 80 or {volume} < 100 ` 
 3. `2 < {temperature} or {pressure} > 90 AND 4 < {volume}`

 #### Syntax and Constraints
 1. Allowed relational operators are: <, >, ==, !=
 2. Allowed logical operators are: or, and, OR, AND (case-insensitive)
 3. For refering sample you must use: {temprature} / {pressure} / {volume} they are case sensitive!
  - also make sure no spaces between the sample type to the curly braces
 4. You can't compare between numbers or between samples, following examples are NOT allowed:
  -  `{temprature} < {volume}`
  - `2.3 < 4.5`
 5. You can concat as many rules as you wish using `and` and `or` operators

## ETL Tasks 
### Request
The ETL task is a single GET request in the following format:
`/ETL/:calcType/:periodMinutes/:intervalMinutes/:sampleType`
- calcType - can be one of: average, max, min, count
- periodMinutes - total task duration
- intervalMinutes - time between 
- sampleType - filters only samples of a specific type (volume/temperature/pressure)

### Response
In addition to the request parameters contains also:
- startDate - task start timestamp
- values - array of results calculated after each interval

## Tests
Tests are located under `/src/routers/dataSample` and `/src/routers/rule`, you can run them simply using `npm test`
