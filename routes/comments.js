var express = require('express');
var router = express.Router();
let db = require("../models");


/* GET users listing. */
//curl -v -i --header "Content-Type: application/json" --request GET  http://localhost:3000/users/comments/2  
router.get('/:userId', function(req, res, next) {

  db.User.findByPk(req.params.userId, {
    include: [
      { model: db.Comment } // raw: true 
    ]
  })
  .then(user => {
    if(!user)
      throw new Error("not found user id in db");

    let answer = Object.assign({}, {user: user.full_name, comments: user.Comments.map(comments=>{
      return Object.assign( {}, { authtor: comments.commenter_name, content: comments.content});
    })});
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.json(JSON.stringify(answer));
  })
  .catch((err) => {
    console.error(err);
    return res.status(404).send("No found user id");
  });
});

module.exports = router;