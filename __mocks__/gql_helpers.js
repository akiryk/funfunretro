jest.getMockFromModule('../helpers/gql_helpers');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

firebase.__setMockFiles = __setMockFiles;
firebase.readdirSync = readdirSync;

module.exports = firebase;
