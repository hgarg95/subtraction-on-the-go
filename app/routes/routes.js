const question = require('../controller/controller.js');

module.exports = (routes) => {

    routes.get('/question', question.questionlist);

}