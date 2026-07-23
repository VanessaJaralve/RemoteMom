module.exports = {
  setupFiles: ['<rootDir>/jest.globals.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|@react-navigation|react-native-screens|react-native-safe-area-context))'
  ]
};
