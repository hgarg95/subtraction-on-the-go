const params = ["questions", "minuend_digits", "subtrahend_digits", "borrowflag"];
var response = {valid: false, message: "Nil", missing_param: []}
const MAX_DIGIT = 9;
const MIN_DIGIT = 0;
const RETRY_LIMIT = 3;
var minuend; var subtrahend;


exports.questionlist = (req, res) => {
    var jsondata=[];
    requestvalidate(req);
    if(!response.valid){
        if(response.missing_param.length != 0){
            return res.status(400).send({
                message: response.message,
                missing_parameters: response.missing_param
            })
        }
        return res.status(400).send({
            message: response.message
        })
    }
    for(let i=0; i < JSON.parse(req.query.questions); i++){
        jsondata.push(generatequestion(req.query.minuend_digits, req.query.subtrahend_digits, JSON.parse(req.query.borrowflag)));
    }
    return res.status(200).send({
        message: "Success",
        questions: jsondata
    })

}


function generatequestion(minuend_digits,subtrahend_digits,borrowflag){
    var equal_digits = false;
    var _try = 0;
    var response_obj = {};
    if (minuend_digits === subtrahend_digits){
        equal_digits = true;
    }
    do{
        console.log("Trying for: ", _try, " time");
        [minuend, subtrahend] = generatenumbers(minuend_digits, subtrahend_digits, equal_digits);
        console.log(minuend,":: ", subtrahend);   
        if(borrowflag){
            if(checkborrow(minuend, subtrahend)){
                // Generate answer and options
            }else{
                [minuend,subtrahend] = generateborrow(minuend, subtrahend, subtrahend_digits);
                console.log(minuend," ", subtrahend);
                //Generate borrow, answer and options
            }
        }else{
            if(!checkborrow(minuend, subtrahend)){
                //Generate answer and options
            }else{
                [minuend,subtrahend] = removeborrow(minuend, subtrahend, subtrahend_digits);
                console.log(minuend," ", subtrahend);
                //Remove borrow, generate answer and options
            }
        }
    _try += 1; 
 }while ((minuend < subtrahend ) && (_try < RETRY_LIMIT))
 if(minuend < subtrahend){
     if(borrowflag){
         if(minuend_digits == 2){
            minuend = 91;
            subtrahend = 19;
         }else{
             minuend = 91 * Math.pow(10, (minuend_digits - 2)) + Math.floor(Math.random() * (9) + 1)
             subtrahend = 91 * Math.pow(10, (subtrahend_digits - 2)) + Math.floor(Math.random() * (9) + 1)
         }
     }else{
        if(minuend_digits == 2){
            minuend = 99;
            subtrahend = 11;
         }else{
             minuend = 99 * Math.pow(10, (minuend_digits - 2)) 
             subtrahend = 11 * Math.pow(10, (subtrahend_digits - 2))

     }
  }
 }
 var correct_answer = generateanswer(minuend, subtrahend);
 response_obj['minuend'] = minuend;
 response_obj['subtrahend'] = subtrahend;
 response_obj['answer'] = correct_answer;
 response_obj['options'] = ['1','2','3','4'];
 return response_obj;
//  console.log(jsondata);


}

function generateanswer(minuend, subtrahend){
    return minuend - subtrahend;
}

function generatenumbers(minuend_digits, subtrahend_digits, equal_digits){
    minuend = Math.floor(Math.pow(10,(minuend_digits - 1)) + Math.random() * (Math.pow(10,(minuend_digits - 1))*9));
    console.log("Minuend  ",minuend);
    if(equal_digits){
        var min = Math.pow(10,(minuend_digits - 1));  
        subtrahend = Math.floor(Math.random()*(minuend - min) + min);   // If minuend and subtrahend digits are equal, then generate subtrahend always lesser than minuend to maintain non-negative answers
    }else{
        subtrahend =  Math.floor(Math.pow(10,(subtrahend_digits - 1)) + Math.random() * (Math.pow(10,(subtrahend_digits - 1))*9));
    }

    return [minuend, subtrahend];

}

function removeborrow(minuend, subtrahend, subtrahend_digits){
    let minuend_c = minuend;
    let subtrahend_c = subtrahend;
    let count = 0; var borrow_places = [];
    while(subtrahend_c>0){
        if((subtrahend_c % 10) > (minuend_c % 10)){
            borrow_places.push(count);
        }
        subtrahend_c = subtrahend_c / 10;
        minuend_c = minuend_c/10;
        count+=1;
    }
    console.log(borrow_places);
    for (let i=0;i<borrow_places.length;i++){
        var subtrahend_digit = Math.floor((subtrahend/Math.pow(10,borrow_places[i])) % 10);
        var minuend_digit = Math.floor((minuend/Math.pow(10,borrow_places[i])) % 10);
        console.log(minuend_digit);
        console.log(subtrahend_digit);
        if(minuend_digit === MIN_DIGIT && subtrahend_digit === MAX_DIGIT){
            var delta_digit = Math.floor(Math.random() * (9 -5) + 5);
            console.log("Replacement Digit", delta_digit);
            minuend_digit = minuend_digit + (delta_digit * Math.pow(10,borrow_places[i]));
            subtrahend_digit = subtrahend_digit - (delta_digit * Math.pow(10,borrow_places[i]));

        }else if(minuend_digit === MIN_DIGIT){
            var digit_diff = subtrahend_digit - minuend_digit;
            var add_limit = MAX_DIGIT - subtrahend_digit;
            var digit_to_add = digit_diff + Math.floor(Math.random() * (add_limit + 1));
            console.log("Replacement Digit", digit_to_add);
            minuend = minuend + (digit_to_add * Math.pow(10,borrow_places[i]));
        }
        else{
           var digit_diff = subtrahend_digit - minuend_digit;
           var digit_to_sub = digit_diff + Math.floor(Math.random() * minuend_digit);
           console.log("Replacement Digit", digit_to_sub);
           subtrahend = subtrahend - (digit_to_sub * Math.pow(10,borrow_places[i]));         
        }
        console.log("New Minuend: ", minuend);
        console.log("New Subtrahend: ", subtrahend)
    }
    console.log("Final Subtrahend: ", subtrahend)
    console.log("Final Minuend: ", minuend)
    return [minuend,subtrahend];

}


function generateborrow(minuend, subtrahend, subtrahend_digits){
    console.log("sub dig", subtrahend_digits);
    var max_num_of_borrows = Math.floor(Math.random() * (subtrahend_digits - 1) + 1);
    console.log(max_num_of_borrows);
    var borrow_places = [];
    for(let i=0; i < max_num_of_borrows; i++){
        borrow_places.push(Math.floor(Math.random() * (max_num_of_borrows)));
    }
    borrow_places = borrow_places.filter((value,index) => {
        return borrow_places.indexOf(value) === index;
    });
    console.log(borrow_places);
    for(let i=0; i<borrow_places.length; i++){
        var minuend_digit = Math.floor((minuend/Math.pow(10,borrow_places[i])) % 10);
        console.log(minuend_digit);
        var subtrahend_digit = Math.floor((subtrahend/Math.pow(10,borrow_places[i])) % 10);
        console.log(subtrahend_digit);

        if (minuend_digit === MAX_DIGIT && subtrahend_digit === MIN_DIGIT){
            var delta_digit = Math.floor(Math.random() * (9 -5) + 5);
            console.log("Replacement Digit", delta_digit);
            minuend = minuend - (delta_digit * Math.pow(10,borrow_places[i]));
            subtrahend = subtrahend + (delta_digit * Math.pow(10,borrow_places[i]));
        }
        else if(minuend_digit == MAX_DIGIT){
            var digit_diff = minuend_digit - subtrahend_digit;
            var digit_to_sub = digit_diff + Math.floor(Math.random() * (subtrahend_digit) +1 );
            console.log("Replacement Digit", digit_to_sub);
            minuend = minuend - (digit_to_sub * Math.pow(10,borrow_places[i]));

        }
        else {
            var digit_diff = minuend_digit - subtrahend_digit;
            var add_limit = MAX_DIGIT - minuend_digit;
            var digit_to_add = digit_diff + Math.floor(Math.random() * (add_limit) + 1);
            console.log("Replacement Digit", digit_to_add);
            subtrahend = subtrahend + (digit_to_add * Math.pow(10,borrow_places[i]));
        }
        console.log("New Minuend: ", minuend);
        console.log("New Subtrahend: ", subtrahend)
    }
    console.log("Final Subtrahend: ", subtrahend)
    console.log("Final Minuend: ", minuend)
    return [minuend,subtrahend];
}


function checkborrow(minuend, subtrahend){
    var is_borrow = false;
    while(subtrahend>0){
        if((subtrahend % 10) > (minuend % 10)){
            is_borrow = true;
            break;
        }
        subtrahend = subtrahend/10;
        minuend = minuend/10;
    }
    console.log(is_borrow);
    if(is_borrow){
        return true;
    }else{
        return false;
    }
}




function requestvalidate(req) {
    var req_params = Object.keys(req.query);
    switch(req_params.length){
        case 0:
            response.valid = false;
            response.message = "No Params in this request. Params are required";
            response.missing_param = [];
            break;
        case 1:
        case 2:
        case 3:
            response.valid = false;
            response.missing_param = params.filter( p =>{
                return req_params.indexOf(p) === -1;
            });
            response.message = "Insufficient params"
            break;
        case 4:
            response.missing_param = params.filter( p =>{
                return req_params.indexOf(p) === -1;
            });
            if(response.missing_param.length > 0){
                response.valid = false;
                response.message = "Invalid Params"
            }else{
                if(typevalidation(req)){
                response.valid = true;
                response.message = "Success"
                response.missing_param = [];

            }}
            break;
        default:
            response.missing_param = [];
            response.valid = false;
            response.message = "Only 4 params are reqd"        
    }
}

function typevalidation(req){
    if (!(req.query.questions.match(/^[0-9]+$/g))){
        response.valid = false;
        response.missing_param = [];
        response.message = "Number of questions can only be a non-negative number"
        return false;
    }
    if (!(req.query.minuend_digits.match(/^[0-9]+$/g))){
        response.valid = false;
        response.missing_param = [];
        response.message = "Minuend Digits can only be a non-negative number"
        return false;
    }
    if (!(req.query.subtrahend_digits.match(/^[0-9]+$/g))){
        response.valid = false;
        response.missing_param = [];
        response.message = "Subtrahend digits can only be a non-negative number"
        return false;
    }
    if (!(req.query.borrowflag.match(/^(true|false)$/g))){
        response.valid = false;
        response.missing_param = [];
        response.message = "Borrowflag can only be a boolean value"
        return false;
    }
    if (req.query.minuend_digits < req.query.subtrahend_digits){
        response.valid = false;
        response.missing_param = [];
        response.message = "No. of minuend digits should always be greater than subtrahend digits as this subtraction does not involve negative answers"
        return false;       
    }
    if ((req.query.minuend_digits == 1) && (req.query.subtrahend_digits == 1) && (JSON.parse(req.query.borrowflag)) ){
        response.valid = false;
        response.missing_param = [];
        response.message = "Single digit subtraction with borrow flag is not possible"
        return false;       
    }
    return true;


}