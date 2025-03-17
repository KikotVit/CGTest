import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootTabs } from './tab.navigator';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';

export const RootStack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: RootTabs,
            options: {
                headerShown: false,
            },
        },
    },
});

type RootStackParamList = StaticParamList<typeof RootTabs>;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace ReactNavigation {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      interface RootParamList extends RootStackParamList {}
    }
  }

export const Navigation = createStaticNavigation(RootStack);
