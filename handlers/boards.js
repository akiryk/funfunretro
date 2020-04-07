const { db } = require('../utils/admin'); // db is firestore(), invoked from firebase admin's initilialized app.

exports.getBoards = (req, res) => {
  db.collection('boards')
    .get()
    .then((boards) => {
      const data = boards.docs.map((board) => board.data());
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
