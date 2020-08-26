SUBTRACTION-ON-THE-GO

This is an API which will dynamically generate questions based on the user input. 
Expected Input:
Number of questions : Any non-negative number
Minuend : First number in subtraction ( any non-negative number)
Subtrahend : Second number in subtraction ( any non-negative number)
Borrow : A boolean value to determine if all the returned questions should have borrow or not

This API is hosted on heroku.com:

URL: https://arcane-tor-78934.herokuapp.com

API Endpoint: https://arcane-tor-78934.herokuapp.com/question

Test Cases Input and Postman Collection are present inside the folder: Tests

To run Test cases:

newman run ./Tests/Subtraction-on-the-go.postman_collection.json --folder "Positive_Tests for status" -d ./Tests/Status_200.test.json;
newman run ./Tests/Subtraction-on-the-go.postman_collection.json --folder "Bad Request Tests" -d ./Tests/Status_400.test.json;
newman run ./Tests/Subtraction-on-the-go.postman_collection.json --folder "Positive Borrow Test" -d ./Tests/Positive_Borrow.test.json;
newman run ./Tests/Subtraction-on-the-go.postman_collection.json --folder "Negative Borrow Test" -d ./Tests/Negative_Borrow.test.json;
