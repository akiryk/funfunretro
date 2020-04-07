const { db } = require('../utils/admin'); // db is firestore(), invoked from firebase admin's initilialized app.

exports.getColumns = (req, res) => {
  console.log('GET COLUMNS');
  db.collection('columns')
    .get()
    .then((columns) => {
      const data = columns.docs.map((column) => column.data());
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
