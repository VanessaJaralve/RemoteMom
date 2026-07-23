global.__DEV__ = true;
global.IS_REACT_ACT_ENVIRONMENT = true;
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;

jest.mock('react-native', () => {
  const React = require('react');
  const createHostComponent = (name) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(name, { ...props, ref }, children)
    );

  return {
    Text: createHostComponent('Text'),
    View: createHostComponent('View'),
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => style
    },
    Platform: {
      OS: 'ios',
      select: (specifics) => specifics.ios ?? specifics.default
    }
  };
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children
}));

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => {
        const screens = React.Children.toArray(children);
        const firstScreen = screens[0];
        const FirstComponent = firstScreen.props.component;

        return React.createElement(
          View,
          null,
          React.createElement(
            View,
            null,
            screens.map((screen) =>
              React.createElement(Text, { key: screen.props.name }, screen.props.name)
            )
          ),
          React.createElement(FirstComponent)
        );
      },
      Screen: () => null
    })
  };
});
