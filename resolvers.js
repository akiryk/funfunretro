const admin = require('firebase-admin');

const getCollection = collection =>
  admin
    .firestore()
    .collection(collection)
    .get();

const getByIdFromCollection = (id, collection) =>
  admin
    .firestore()
    .collection(collection)
    .doc(id)
    .get();

module.exports = {
  Query: {
    boards: async () => {
      try {
        const boards = await getCollection('boards');
        return boards.docs.map(board => {
          return {
            ...board.data(),
            id: board.id,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    board: async (_, { id }) => {
      try {
        const board = await getByIdFromCollection(id, 'boards');
        return {
          ...board.data(),
          id,
        };
      } catch (error) {
        console.log(error);
      }
    },
    columns: async () => {
      try {
        const columns = await getCollection('columns');
        return columns.docs.map(column => {
          return {
            ...column.data(),
            id: column.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    column: async (_, { id }) => {
      try {
        const column = await getByIdFromCollection(id, 'columns');
        return {
          ...column.data(),
          id,
        };
      } catch (error) {
        console.log(error);
      }
    },
    comments: async () => {
      try {
        const comments = await getCollection('comments');
        return comments.docs.map(comment => {
          return {
            ...comment.data(),
            id: comment.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    comment: async (_, { id }) => {
      try {
        const comment = await getByIdFromCollection(id, 'comments');
        return {
          ...comment.data(),
          id,
        };
      } catch (error) {
        console.log(error);
      }
    },
    users: async () => {
      try {
        const users = await getCollection('users');
        return users.docs.map(user => {
          return {
            ...user.data(),
            id: user.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await getByIdFromCollection(id, 'users');
        return {
          ...user.data(),
          id,
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Board: {
    users: async board => {
      try {
        const boardUsers = await admin
          .firestore()
          .collection('users')
          .where('boardIds', 'array-contains', board.id)
          .get();
        return boardUsers.docs.map(user => {
          return {
            ...user.data(),
            id: user.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    columns: async board => {
      try {
        const boardColumns = await admin
          .firestore()
          .collection('columns')
          .where('boardId', '==', board.id)
          .get();
        return boardColumns.docs.map(column => {
          return {
            ...column.data(),
            id: column.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    comments: async board => {
      try {
        const boardComments = await admin
          .firestore()
          .collection('comments')
          .where('boardId', '==', board.id)
          .get();
        return boardComments.docs.map(comment => {
          return {
            ...comment.data(),
            id: comment.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  Column: {
    comments: async column => {
      console.log('COLUMN ID', column.id);
      try {
        const columnComments = await admin
          .firestore()
          .collection('comments')
          .where('columnId', '==', column.id)
          .get();
        return columnComments.docs.map(comment => {
          return {
            ...comment.data(),
            id: comment.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  User: {
    boards: async user => {
      try {
        const userBoards = await admin
          .firestore()
          .collection('boards')
          .where('userIds', 'array-contains', user.id)
          .get();
        return userBoards.docs.map(board => {
          return {
            ...board.data(),
            id: board.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
    comments: async user => {
      try {
        const userComments = await admin
          .firestore()
          .collection('comments')
          .where('userId', '==', user.id)
          .get();
        return userComments.docs.map(comment => {
          return {
            ...comment.data(),
            id: comment.id,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  Comment: {
    user: async comment => {
      console.log('USER ID', comment.userId);
      try {
        const commentUser = await getByIdFromCollection(
          comment.userId,
          'users',
        );
        return commentUser.data();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
