import { AppRegistry } from 'react-native';
import App from './App';

// Register the app component
AppRegistry.registerComponent('main', () => App);

// For web, we need to run the app
if (typeof document !== 'undefined') {
  AppRegistry.runApplication('main', {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}