const nodemailer = require("nodemailer");
let db = require("../models");

async function postEmails(Book_id) {

  try {
    let filter = {
      include: [
        {
          model: db.Comment,
          include: [
            {
              model: db.User
            }
          ]
        }
      ],
      order: [
          [ db.Comment, "created_at", "ASC" ]
      ]	
    };

    const book = await db.Book.findByPk(Book_id, filter);

    if(!book) {
      throw new Error("not found book on id");
    }

    if(book.Comments.length < 2) {
      throw new Error("it`s first comment");
    }

    const prevCommenterEmail = book.Comments[book.Comments.length - 2].User.email;
    const prevCommentContent = book.Comments[book.Comments.length - 2].content;
    const prevCommenterName = book.Comments[book.Comments.length - 2].commenter_name;
    const bookTitle = book.title;

    console.log(`Last commenter = ${prevCommenterEmail}`);
    console.log(`Text of last comment = ${prevCommentContent}`);
    console.log(`Name of last comment = ${prevCommenterName}`);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testfusion911@gmail.com', 
        pass: 'fusion911'
      }
    });

    var mailOptions = {
      from: 'testfusion911@gmail.com',
      to: 'shtokarev@gmail.com, shtokarev@mail.ru',  
      subject: `На ваш комментарий к книге ${bookTitle} ответили`,
      text: `Имя : ${prevCommenterName} \nТекст : ${prevCommentContent} \nEmail : ${prevCommenterEmail}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log("Error send messages to: " + mailOptions.to);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  catch(err) {
    console.error(err);
    return;
  }
  
  return;    
}

module.exports = postEmails;
