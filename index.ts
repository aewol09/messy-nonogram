import { registerRootComponent } from 'expo';
import { Alert } from 'react-native';

// JS 런타임 에러 발생 시 앱이 그냥 튕기지 않고 화면에 에러 원인을 팝업으로 표시
if ((global as any).ErrorUtils) {
  const previousHandler = (global as any).ErrorUtils.getGlobalHandler();
  (global as any).ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    Alert.alert(
      '런타임 오류 발생',
      `${error?.name || 'Error'}: ${error?.message}\n\n${error?.stack}`,
      [{ text: '확인' }]
    );
    if (previousHandler) previousHandler(error, isFatal);
  });
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

