
let controller = require("../controllers/commentController");

module.exports = router => {
  router.get("/:userId", controller.comment_id_get);
  router.post("/:BookId", controller.comment_id_book);
};




/*

var express = require('express');
var router = express.Router();
let db = require("../models");


// GET users listing. 
//curl -v -i -H "Content-Type: application/json" -H "authorization:Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDQ4ODQ1MjI3MzIsImlkIjo0LCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVtcEBnbWFpbC5jb20ifQ.Q7_KlBWCjNiLvb10E1KWuvEWmgLPqTQpR3OvL5oWzDg" --request GET  http://localhost:3000/users/comments/2  
router.get('/:userId', function (req, res, next) {

  db.User.findByPk(req.params.userId, {
    include: [
      { model: db.Comment } // raw: true 
    ]
  })
    .then(user => {
      if (!user)
        throw new Error("not found user id in db");

      let answer = {
        user: user.full_name,
        comments: user.Comments.map(comments => {
          return { authtor: comments.commenter_name, content: comments.content };
        })
      }
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.json(JSON.stringify(answer));
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).send("No found user id");
    });
});

//curl -v -i -H "Content-Type: application/json" -H "authorization:Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDQ4ODQ1MjI3MzIsImlkIjo0LCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVtcEBnbWFpbC5jb20ifQ.Q7_KlBWCjNiLvb10E1KWuvEWmgLPqTQpR3OvL5oWzDg" --request POST --data '{"content":"Some comment 333", "commenter_name":"Petya"}'  http://localhost:3000/users/comments/2  
//curl -v -i -H "Content-Type: application/json" -H "authorization:Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDQ4ODQ1MjI3MzIsImlkIjo0LCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVtcEBnbWFpbC5jb20ifQ.Q7_KlBWCjNiLvb10E1KWuvEWmgLPqTQpR3OvL5oWzDg" --request POST --data '{"content":"Some comment 333"}'  http://localhost:3000/users/comments/2  
router.post('/:BookId', function (req, res, next) {

  let { content, commenter_name } = req.body;

  if (!commenter_name)
    db.User.findByPk(req.userId)
      .then((user) => {
        commenter_name = user.full_name;
      });

  db.Comment.create({
    content,
    commenter_name,
    book_id: req.params.BookId,
    user_id: req.userId
  })
  .then(newComment => {
      console.log(`New comment, with id ${newComment.id} has been created.`);
      console.log(commenter_name);

      newComment.updateAttributes({
        commenter_name
      })
        .catch(err => console.log(`Error on update commenter name in base ${err}`));

      return res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("Error on create new comment");
    });
});

router.post('/:BookId', async (req, res, next) => {

  let { content, commenter_name } = req.body;
  try {
    if (!commenter_name) {
      let user = await db.User.findByPk(req.userId)
      commenter_name = user.full_name;
    }
  
    const newComment = await db.Comment.create({
      content,
      commenter_name,
      book_id: req.params.BookId,
      user_id: req.userId
    })
    console.log(`New comment, with id ${newComment.id} has been created.`);
    console.log(commenter_name);

    newComment.updateAttributes({
      commenter_name
    })
          // .catch(err => console.log(`Error on update commenter name in base ${err}`));
  
    return res.sendStatus(201);
      
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error on create new comment");
  }
});

module.exports = router;
*/

