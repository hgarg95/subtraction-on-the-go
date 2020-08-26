Create Table Questions(
    question_id uuid primary key,
    minuend_digits integer not null,
    subtrahend_digits integer not null,
    borrowflag boolean not null,
    correct_answer integer not null,
    options integer[]
)
