
module.exports = {
  rootDir: 'src',
  transform: {
    '^.+\\.jsx?$': 'buble-jest' // so we can do ES6 module imports
  }
}
