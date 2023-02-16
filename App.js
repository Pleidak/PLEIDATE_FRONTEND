import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginProvider from './src/contexts/LoginProvider';
import MainNavigator from './src/navigations/MainNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions, FlatList, Image, StyleSheet, View, Animated, Easing} from 'react-native';
import { DefaultColors } from './src/constants/DefaultColors';
import { Text } from 'react-native-elements';


const animated1 = new Animated.Value(0) 

const App = () => {
  return (
    <LoginProvider>
        <NavigationContainer>
            <MainNavigator/>
        </NavigationContainer>
    
    </LoginProvider>
  )
}


//   const DATA = [

//   ];

//   for (let i=0;  i< 1000; i++){
//     DATA.push({
//       id: i.toString(),
//       title: `Item ${i}`,
//     })
//   }

//   const [data, setData] = useState(DATA)
//   const fetchMore = () => {
//     let newData = data
//     const l = newData.length
//     for (let i=l;i<l+10;i++){
//       newData.push({
//         id: i.toString(),
//         title: `Item ${i}`,
//       })
//     }
   
//     setData(newData)
//   }
//   const flatListRef =  useRef(null)
//   let index=0;
//   const totalIndex = data.length - 1;
  
//     useEffect (() => { 

//     setInterval (() => {
//     index++;
//     console.log(index%10)
//     console.log(index%10==0)
//       // if (index % 10 == 0){
//       //   fetchMore()
//       // }
//       Animated.sequence([
//         Animated.timing(animated1, {
//         toValue: 500,
//         duration: 500,
//         useNativeDriver: true,
//         easing: Easing.linear,
//         }),
//     ]).start()
//     if (flatListRef.current != null){
//       if(index < totalIndex) {
//         flatListRef?.current?.scrollToIndex({animated: true, index: index})
//     } 
//     else {
//         flatListRef?.current?.scrollToIndex({animated: true, index: 0})
//         // index = 0
//     }
//     }

//     }, 1000)
//     }, []);

// const renderItem = ({item}) => {
//     return (
//       <Animated.View style={styles.cardView}>
//         <Text style={{fontSize: 12, color: 'red'}}>{item.id}</Text>
//       </Animated.View>     
//     )
// } 


// return (
//     <View style={{paddingHorizontal: 10}} >
//         <FlatList 
//         //  contentContainerStyle = {{ flex: 1 }}
//             ref={flatListRef}
//             data={DATA} 
//             keyExtractor={data => data.id}
//             inverted
//             pagingEnabled
//             scrollEnabled={true}
//             snapToAlignment="center"
//             scrollEventThrottle={30}
//             decelerationRate={0.99}
//             onEndReached={fetchMore}
//             showsHorizontalScrollIndicator={true}
//             persistentScrollbar={true}
//             renderItem={renderItem}
//         /> 
//     </View>
// );
// }
// const {width, height} = Dimensions.get('window');



// const styles = StyleSheet.create({
//   cardView: {
//     flex: 1, 
//     width: width - 20,  
//     height: height * 0.42,
//     backgroundColor: DefaultColors.LIGHT_THEME,
//     alignItems: 'center',
//     justifyContent: 'center', 
//     marginVertical: 10,
//     transform: [{translateY: animated1}], display: 'flex', alignItems: 'center'

// },
// image: {
//     backgroundColor: DefaultColors.BLUE,
//     width: width - 20,  
//     height: height * 0.21,
// }, 
// })

export default App;
