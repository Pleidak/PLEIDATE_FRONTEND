import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackPrams';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();
console.log(Stack)
type screenProp = NativeStackNavigationProp<RootStackParamList, 'PhoneSubmit'>
const navigationStack = useNavigation<screenProp>()

export { navigationStack, Stack }