import { NavigationContainer } from '@react-navigation/native';
import Home from './src/screens/Home';
import ChooseLocation from './src/screens/ChooseLocation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from 'react-native-flash-message';
import GetBatteryInformation from './src/screens/GetBatteryInformation';



const Stack = createNativeStackNavigator();
const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="ChooseLocation" component={ChooseLocation}/>
        <Stack.Screen name="Information" component={GetBatteryInformation}/>
      </Stack.Navigator>
      <FlashMessage/>
    </NavigationContainer>
  )
}


export default App;