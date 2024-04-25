import React, { useState, useMemo, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Easing, StatusBar, TouchableOpacity, Dimensions, Image, Modal, Alert, Pressable, Button } from "react-native";
import { createGiftCatching, getGiftCatchingRandom, getGiftColection } from "../api/Gift";
import { rarityGiftChecker } from "../utils/rarityGiftChecker";
import LottieView from "lottie-react-native";
import { DefaultColors } from "../constants/DefaultColors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircle, faCircleUser, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
const {width, height} = Dimensions.get('window');

const FlatListItem = ({
  flatKey,
  data,
  delay,
  setDelay,
  animatedLeftStartRef,
  setData,
  countRef,
  giftCatchingList,
  caughtGifts,
  setCaughtGifts,
  turn,
  setOpacity,
  setShowCaughtGift,
  setCurrentCatch,
  setIsError
}: any) => {
  const animated = new Animated.Value(0);
  let leftStartList = ['5%', '20%', '35%', '40%', '55%', '70%']
  leftStartList.splice(leftStartList.indexOf(animatedLeftStartRef.current), 1);
  const leftStart = leftStartList[Math.floor(Math.random() * leftStartList.length)];

  const setCaughtGiftsHandler = async () => {
    if (turn.current >= 0){
      const newCaughtGifts = caughtGifts
      newCaughtGifts.push(data)
      setCaughtGifts(newCaughtGifts)

      const res = await createGiftCatching(turn.current, data.giftId, data.name, data.rarity, Date.now())
      if (res){
        if (res.status !== 200) {
            setIsError(true)
        } else {
          if (res.data.success) {
            setIsError(false)
          }
          else {
            turn.current = 0
          }
        }
      } else{
          setIsError(true)
      }
      if (turn.current > 0){
        turn.current = turn.current - 1
      }
      setOpacity(0.5)
      setShowCaughtGift(true)
      setCurrentCatch(data)
      setTimeout(()=>{
        setOpacity(1)
        setShowCaughtGift(false)
      }, 1000)
    }
    else {
      console.log("Hết lượt rồi")
    }
  }

  useEffect(() => {
    if (countRef.current <= flatKey) {
      // countRef.current = countRef.current + 1;
      animatedLeftStartRef.current = leftStart;
      Animated.timing(animated, {
        toValue: height,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.linear,
        delay: delay
      }).start(({ finished }) => {
        // if (countRef.current >= 5) {
        //   countRef.current = 0;
        // }
        if (finished) {
          let idx = giftCatchingList.indexOf(data)
          if (idx >= giftCatchingList.length){idx = 0}
          setData(giftCatchingList[idx+5]);
          setDelay(0);
        }
      });
    }
  }, [animated]);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={[styles.dFlex, styles.maxWidth]}>
      {
        !caughtGifts.includes(data) ?
        <AnimatedTouchable
          style={[
            {
              transform: [{ translateY: animated }],
              top: 0,
              display: "flex",
              alignItems: "center",
              position: "absolute",
              left: leftStart
            }
          ]}
          onPress={()=>{setCaughtGiftsHandler()}}
        >
          <View style={{top: -150, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.dFlex}>
              <LottieView
                source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${data.giftId}.json`}}
                style={{width: rarityGiftChecker(data)?.size, height: rarityGiftChecker(data)?.size}}
                autoPlay={rarityGiftChecker(data)?.autoplay}
                loop={false}
              />
              <Text style={{ fontSize: 10, color: rarityGiftChecker(data)?.color, fontWeight: '600' }}>{data.name}</Text>
            </View>
          </View>
        </AnimatedTouchable>
        : undefined
      }
    </View>
  );
};

const Gift = () => {
  const initDataList = [
    { id: 0, giftId: '', name: '', rarity: '' },
  ]
  const giftInit = {
    giftId: '',
    name: '',
    rarity: '',
    amount: 0,
    ownOrReceived: 1,
    choice: 1
  }

  const givingUserInfoInit = {
    userId: 123456789,
    name: '',
    mainAvatar: ''
  }

  const initData = { id: 0, giftId: '', name: '', rarity: '' }
  const [giftCatchingList, setGiftCatchingList] = useState(initDataList)
  const [data1, setData1] = useState(initData);
  const [data2, setData2] = useState(initData);
  const [data3, setData3] = useState(initData);
  const [data4, setData4] = useState(initData);
  const [data5, setData5] = useState(initData);
  const [data6, setData6] = useState(initData);
  const [data7, setData7] = useState(initData);
  const countRef = useRef(1);
  const animatedLeftStartRef = useRef("10%");
  const [delay1, setDelay1] = useState(0);
  const [delay2, setDelay2] = useState(500);
  const [delay3, setDelay3] = useState(1000);
  const [delay4, setDelay4] = useState(1500);
  const [delay5, setDelay5] = useState(2000);
  // const [delay6, setDelay6] = useState(2000);
  // const [delay7, setDelay7] = useState(2000);
  const [tab, setTab] = useState(1)
  const [isError, setIsError] = useState(true)
  const [caughtGifts, setCaughtGifts] = useState([])
  const turn = useRef(0)
  const [opacity, setOpacity] = useState(1)
  const [bgColor, setbgColor] = useState('transparent')
  const [currentCatch, setCurrentCatch] = useState(initData)
  const [showCaughtGift, setShowCaughtGift] = useState(false)
  const [giftColection, setGiftColection] = useState([giftInit])
  const [topGivingUsers, setTopGivingUsers] = useState([givingUserInfoInit])
  const [topGivingGifts, setTopGivingGifts] = useState([giftInit])
  const [giftShowing, setGiftShowing] = useState(giftInit)
  const [modalVisible, setModalVisible] = useState(false)
  const [combineAmount, setCombineAmount] = useState(1)
  const [combineRate, setCombineRate] = useState(0)
  const [combineStart, setCombineStart] = useState(false)
  const [fireWorkStart, setFireWorkStart] = useState(false)

  const getGiftCatchingRandomHander = async () => {
    setTab(1)
    setDelay1(0)
    setDelay2(500)
    setDelay3(1000)
    setDelay4(1500)
    setDelay5(2000)
    const res = await getGiftCatchingRandom()
    if (res){
        const jsonRes = res.data
        if (res.status !== 200) {
            setIsError(true)
        } else {
            const DATA = jsonRes.randomGiftCatchingResult
            turn.current = jsonRes.giftRemaining ? jsonRes.giftRemaining.turnLeft: 10
            setGiftCatchingList(DATA)
            setData1(DATA[0])
            setData2(DATA[1])
            setData3(DATA[2])
            setData4(DATA[3])
            setData5(DATA[4])
            // setData6(DATA[6])
            // setData7(DATA[7])
            setIsError(false)
        }
    } else{
        setIsError(true)
    }
  }

  const getGiftColectionHandler = async () => {
    setTab(2)
    const res = await getGiftColection()
    if (res){
        const jsonRes = res.data
        if (res.status !== 200) {
            setIsError(true)
        } else {
            setGiftColection(jsonRes.giftColectionResult)
            setTopGivingUsers(jsonRes.topGivingUserInfo)
            setTopGivingGifts(jsonRes.topGivingGifts)
            console.log(jsonRes.topGivingUserInfo)
            setIsError(false)
        }
    } else{
        setIsError(true)
    }
  }

  useEffect(()=>{
    getGiftCatchingRandomHander()
  }, [])

  const FlatlistItem1 = useMemo(
    () => (
      <FlatListItem
        flatKey={1}
        delay={delay1}
        setDelay={setDelay1}
        animatedLeftStartRef={animatedLeftStartRef}
        data={data1}
        setData={setData1}
        countRef={countRef}
        giftCatchingList={giftCatchingList}
        caughtGifts={caughtGifts}
        setCaughtGifts={setCaughtGifts}
        turn={turn}
        opacity={opacity}
        setOpacity={setOpacity}
        setShowCaughtGift={setShowCaughtGift}
        setCurrentCatch={setCurrentCatch}
        setIsError={setIsError}
      />
    ),
    [data1]
  );
  const FlatlistItem2 = useMemo(
    () => (
      <FlatListItem
        flatKey={2}
        delay={delay2}
        setDelay={setDelay2}
        animatedLeftStartRef={animatedLeftStartRef}
        data={data2}
        setData={setData2}
        countRef={countRef}
        giftCatchingList={giftCatchingList}
        caughtGifts={caughtGifts}
        setCaughtGifts={setCaughtGifts}
        turn={turn}
        opacity={opacity}
        setOpacity={setOpacity}
        setShowCaughtGift={setShowCaughtGift}
        setCurrentCatch={setCurrentCatch}
        setIsError={setIsError}
      />
    ),
    [data2]
  );
  const FlatlistItem3 = useMemo(
    () => (
      <FlatListItem
        flatKey={3}
        delay={delay3}
        setDelay={setDelay3}
        animatedLeftStartRef={animatedLeftStartRef}
        data={data3}
        setData={setData3}
        countRef={countRef}
        giftCatchingList={giftCatchingList}
        caughtGifts={caughtGifts}
        setCaughtGifts={setCaughtGifts}
        turn={turn}
        opacity={opacity}
        setOpacity={setOpacity}
        setShowCaughtGift={setShowCaughtGift}
        setCurrentCatch={setCurrentCatch}
        setIsError={setIsError}
      />
    ),
    [data3]
  );
  const FlatlistItem4 = useMemo(
    () => (
      <FlatListItem
        flatKey={4}
        delay={delay4}
        setDelay={setDelay4}
        animatedLeftStartRef={animatedLeftStartRef}
        data={data4}
        setData={setData4}
        countRef={countRef}
        giftCatchingList={giftCatchingList}
        caughtGifts={caughtGifts}
        setCaughtGifts={setCaughtGifts}
        turn={turn}
        opacity={opacity}
        setOpacity={setOpacity}
        setShowCaughtGift={setShowCaughtGift}
        setCurrentCatch={setCurrentCatch}
        setIsError={setIsError}
      />
    ),
    [data4]
  );
  const FlatlistItem5 = useMemo(
    () => (
      <FlatListItem
        flatKey={5}
        delay={delay5}
        setDelay={setDelay5}
        animatedLeftStartRef={animatedLeftStartRef}
        data={data5}
        setData={setData5}
        countRef={countRef}
        giftCatchingList={giftCatchingList}
        caughtGifts={caughtGifts}
        setCaughtGifts={setCaughtGifts}
        turn={turn}
        opacity={opacity}
        setOpacity={setOpacity}
        setShowCaughtGift={setShowCaughtGift}
        setCurrentCatch={setCurrentCatch}
        setIsError={setIsError}
      />
    ),
    [data5]
  );
  // const FlatlistItem6 = useMemo(
  //   () => (
  //     <FlatListItem
  //       flatKey={6}
  //       delay={delay6}
  //       setDelay={setDelay6}
  //       animatedLeftStartRef={animatedLeftStartRef}
  //       data={data6}
  //       setData={setData6}
  //       countRef={countRef}
  //       giftCatchingList={giftCatchingList}
  //       caughtGifts={caughtGifts}
  //       setCaughtGifts={setCaughtGifts}
  //       turn={turn}
  //     />
  //   ),
  //   [data6]
  // );
  // const FlatlistItem7 = useMemo(
  //   () => (
  //     <FlatListItem
  //       flatKey={7}
  //       delay={delay7}
  //       setDelay={setDelay7}
  //       animatedLeftStartRef={animatedLeftStartRef}
  //       data={data7}
  //       setData={setData7}
  //       countRef={countRef}
  //       giftCatchingList={giftCatchingList}
  //       caughtGifts={caughtGifts}
  //       setCaughtGifts={setCaughtGifts}
  //       turn={turn}
  //     />
  //   ),
  //   [data7]
  // );

  const createThreeButtonAlert = () =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Ask me later",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );

  return (
    <View style={[styles.container, styles.dFlex]}>
      <StatusBar barStyle="dark-content" hidden = {false} backgroundColor = {DefaultColors.LIGHT_THEME} translucent = {true}/>
      <View style={[styles.topTabs, styles.maxWidth]}>
      <Button title={"3-Button Alert"} onPress={createThreeButtonAlert} />
          <TouchableOpacity onPress={async () => {
                  if (tab!=1){
                    await getGiftCatchingRandomHander()
                  }
              }}>
              <Text style={[styles.topBarText, tab==1? styles.topBarTextActive: undefined]}>Săn quà tặng</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
                  if (tab!=2){                         
                    await getGiftColectionHandler()
                  }
              }}>
              <Text style={[styles.topBarText, tab==2 ? styles.topBarTextActive: undefined]}>Bộ sưu tập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
                  if (tab!=3){                         
                      setTab(3)
                  }
              }}>
              <Text style={[styles.topBarText, tab==3 ? styles.topBarTextActive: undefined]}>Cửa hàng</Text>
          </TouchableOpacity>
      </View>
      {
        tab==1?(
          <View style={[styles.content, styles.mgTop]}>
          <View style={[styles.mainFrame, styles.themeBG]}>
            <View style={{opacity: opacity, width: '100%'}}>
              <View style={[styles.dFlex, styles.mgTop, styles.mgBottomSm]}>
                <Text style={[styles.buttonText, styles.textBold]}>Lượt bắt còn lại: {<Text style={{color: DefaultColors.RARE_GIFT}}>{turn.current}</Text>} lượt</Text>
                <Text style={[styles.buttonText, styles.textBold, styles.textSmall, styles.mgTopSm]}>
                  Lượt bắt của bạn sẽ được làm mới mỗi {<Text style={{color: DefaultColors.RARE_GIFT}}>3</Text>} giờ sau khi còn 0 lượt
                </Text>
                <View style={[styles.dFlexRow, styles.mgTopSm]}>
                  <View style={[styles.dFlexCol, styles.width20]}>
                    <FontAwesomeIcon style={{color: DefaultColors.NORMAL_GIFT}} icon={faCircle} size={16} />
                    <Text style={[styles.buttonText, styles.textBold, styles.textSmall]}>Thường</Text>
                  </View>
                  <View style={[styles.dFlexCol, styles.width20]}>
                    <FontAwesomeIcon style={{color: DefaultColors.MEDIUM_GIFT}} icon={faCircle} size={16} />
                    <Text style={[styles.buttonText, styles.textBold, styles.textSmall]}>Trung bình</Text>
                  </View>
                  <View style={[styles.dFlexCol, styles.width20]}>
                    <FontAwesomeIcon style={{color: DefaultColors.RARE_GIFT}} icon={faCircle} size={16} />
                    <Text style={[styles.buttonText, styles.textBold, styles.textSmall]}>Quý hiếm</Text>
                  </View>
                  <View style={[styles.dFlexCol, styles.width20]}>
                    <FontAwesomeIcon style={{color: DefaultColors.EPIC_GIFT}} icon={faCircle} size={16} />
                    <Text style={[styles.buttonText, styles.textBold, styles.textSmall]}>Sử thi</Text>
                  </View>
                  <View style={[styles.dFlexCol, styles.width20]}>
                    <FontAwesomeIcon style={{color: DefaultColors.LEGEND_GIFT}} icon={faCircle} size={16} />
                    <Text style={[styles.buttonText, styles.textBold, styles.textSmall]}>Huyền thoại</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.mainFrame]}>
              {FlatlistItem1}
              {FlatlistItem2}
              {FlatlistItem3}
              {FlatlistItem4}
              {FlatlistItem5}
              {/* {FlatlistItem6}
              {FlatlistItem7} */}
            </View>
            <View style={{position: 'absolute', top: '30%'}}>
            {
              showCaughtGift ? (
                <View style={{backgroundColor: 'transparent'}}>
                  {
                    turn.current > 0 ? 
                    <View style={{zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <LottieView
                          source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${currentCatch.giftId}.json`}}
                          style={{width: 150, height: 150}}
                          autoPlay={true}
                          loop={false}
                        />
                        <Text style={{ fontSize: 20, color: rarityGiftChecker(currentCatch)?.color, fontWeight: '600' }}>+1 {currentCatch.name}</Text>
                    </View>
                    : 
                    <View style={{zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', top: '20%'}}>
                      <Text style={{ fontSize: 16, color: rarityGiftChecker(currentCatch)?.color, fontWeight: '600', top: -110 }}>Bạn đã hết lượt bắt!</Text>
                    </View>
                  }
                  
                  <LottieView
                    source={require('../public/lotties/fireworks.json')}
                    style={{width: 350, height: 350, top: -110, zIndex: 0}}
                    autoPlay={true}
                    loop={false}
                  />
              </View>
              ): undefined
            }
            </View>
            
          </View>
  
        </View>
        ):
        tab==2?(
          <View style={[styles.content, styles.mgTop]}>
            <View style={[styles.mainFrame, styles.themeBG]}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setCombineAmount(0)
                    setCombineStart(false)
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={[styles.topBarTextActive, styles.mgTop]}>{giftShowing.name}</Text>
                      <Pressable
                        style={{position: 'absolute', top: 5, right: 10, padding: 10}}
                        onPress={() => {
                          setModalVisible(!modalVisible)
                          setCombineAmount(0)
                          setCombineStart(false)
                        }}
                      >
                        <FontAwesomeIcon style={{color: DefaultColors.NORMAL_GIFT}} icon={faXmark} size={18} />
                      </Pressable>
                      <View style={[styles.dFlex]}>
                        <LottieView
                          source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${giftShowing.giftId}.json`}}
                          style={{width: 150, height: 150}}
                          autoPlay={giftShowing.giftId.includes("stone")?combineStart?true:false:true}
                          loop={false}
                        />
                        {
                          fireWorkStart ? (
                            <LottieView
                            source={require('../public/lotties/fireworks.json')}
                              style={{width: 200, height: 200, position: 'absolute', top: 0}}
                              autoPlay={true}
                              loop={false}
                            />
                          ):undefined
                        }
                        {
                          giftShowing.giftId.includes("stone") ? (
                            <View style={styles.dFlexCol}>
                              <View style={[styles.dFlexRowStart, styles.mgBottomSm]}>
                                <Text style={[styles.textBold, styles.buttonText]}>Số lượng: {combineAmount}/{giftShowing.amount}</Text>
                                <Pressable
                                  onPress={() => {
                                    if (combineAmount < giftShowing.amount){
                                      setCombineAmount(combineAmount=>combineAmount+1)
                                      setCombineRate(combineRate=>combineRate + 1)
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon style={{backgroundColor: DefaultColors.THEME, color: 'white', borderRadius: 5, marginLeft: 5}} icon={faPlus} size={18} />
                                </Pressable>
                              </View>
                              <Text style={[styles.textBold, styles.buttonText]}>Tỉ lệ thành công: {combineRate} %</Text>
                              <Pressable style={[styles.button, styles.confirmBtn, styles.mgTopSm]} onPress={()=>{
                                setCombineStart(true)
                                setTimeout(()=>{
                                  setCombineStart(false)
                                }, 1000)
                                setTimeout(()=>{
                                  setFireWorkStart(true)
                                }, 2000)
                                setTimeout(()=>{
                                  setFireWorkStart(false)
                                }, 3000)
                              }}>
                                  <Text style={[styles.textBold, styles.white]}>Ghép mảnh</Text>
                              </Pressable>
                            </View>
                          ):
                          <View>
                            <Pressable style={[styles.button, styles.confirmBtn]} disabled={true}>
                              <Text style={[styles.textBold, styles.white]}>Quy đổi</Text>
                            </Pressable>
                            <Text style={[styles.buttonText, styles.mgTopSm]}>Quà tặng này chưa thể quy đổi</Text>
                          </View>
                        }
                        
                      </View>
                    </View>
                  </View>
                </Modal>
                <View style={[styles.dFlexRowStart, styles.mgTop, styles.mgBottomSm, styles.mgLeft]}>
                    <Text style={styles.topBarTextActive}>Đã thu thập</Text>
                    <View style={[styles.dFlexRowStart]}>
                        {
                            giftColection.map((gift)=>(
                                <TouchableOpacity key={giftColection.indexOf(gift)} style={styles.dFlexCol} onPress={async ()=>{
                                      setGiftShowing(gift)
                                      setModalVisible(!modalVisible);
                                      const defaultCombineRate = rarityGiftChecker(gift)?.combineRate
                                      if (defaultCombineRate) setCombineRate(defaultCombineRate)
                                    }}>
                                    <View style={[styles.dFlex, styles.mgRight]}>
                                        <LottieView
                                            source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${gift.giftId}.json`}}
                                            style={{width: 45, height: 45}}
                                            autoPlay={false}
                                        />
                                        <View style={styles.dFlex}>
                                            <Text style={{color: rarityGiftChecker(gift)?.color, 
                                                fontWeight: '400', fontSize: 10
                                            }}>{gift.name} <Text>({gift.amount}x)</Text></Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.mgTop, styles.mgBottomSm, styles.mgLeft]}>
                    <Text style={styles.topBarTextActive}>Top người tặng quà</Text>
                    <View style={[styles.dFlexRowStart, styles.mgTopSm]}>
                        {
                            topGivingUsers.map((userInfo)=>(
                              <TouchableOpacity key={topGivingUsers.indexOf(userInfo)} onPress={
                                async () => {
                                }
                                }>
                                {
                                    userInfo.mainAvatar ?
                                    <Image source={{uri: userInfo.mainAvatar}} style={{width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: DefaultColors.GREY}}></Image>:
                                    <FontAwesomeIcon icon={faCircleUser} color={DefaultColors.GREY} size={50} />
                                }
                                  <Text style={[styles.buttonText, styles.textBold]}>{userInfo.name}</Text>
                            </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.mgTop, styles.mgBottomSm, styles.mgLeft]}>
                    <Text style={styles.topBarTextActive}>Quà đã nhận</Text>
                    <View style={[styles.dFlexRowStart, styles.mgTopSm]}>
                        {
                            topGivingGifts.map((gift)=>(
                                <TouchableOpacity key={giftColection.indexOf(gift)} style={styles.dFlexCol} onPress={async ()=>{
                                      setGiftShowing(gift)
                                      setModalVisible(!modalVisible);
                                    }}>
                                    <View style={[styles.dFlex, styles.mgRight]}>
                                        <LottieView
                                            source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${gift.giftId}.json`}}
                                            style={{width: 45, height: 45}}
                                            autoPlay={false}
                                        />
                                        <View style={styles.dFlex}>
                                            <Text style={{color: rarityGiftChecker(gift)?.color, 
                                                fontWeight: '400', fontSize: 10
                                            }}>{gift.name} <Text>({gift.amount}x)</Text></Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </View>
          </View>
        ):(
          <View>

          </View>
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    height: "100%"
  },
  dFlex: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  dFlexRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dFlexSpaceBetween: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dFlexRowStart: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 0,
    position: 'relative',
    flexWrap: 'wrap'
  },
  dFlexCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content:{
    width: "93%",
    height: "90%",
    fontSize: 16,
    color: 'black',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10
  },
  mainFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  topTabs: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '12%',
    marginLeft: '12%',
    top: 5,
  },
  maxWidth: {
    width: '100%',
  },
  width20: {
    width: '20%',
  },
  maxHeight: {
      height: '100%',
  },
  buttons: {
    // display: 'flex',
    width: '100%',
    // flexDirection: 'column',
    marginTop: '10%',
    marginBot: '10%',
  },
  button: {
      // width: '100%',
      backgroundColor: DefaultColors.BUTTON_THEME,
      height: 32,
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
      marginBottom: 0
  },
  confirmBtn: {
    backgroundColor: 'black',
    color: 'white',
    height: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  topBarText: {
      color: DefaultColors.GREY,
      fontSize: 16,
      fontWeight: '400'
  },
  topBarTextActive: {
      color: DefaultColors.GREY_DARK,
      fontSize: 16,
      fontWeight: '800',
  },
  buttonText: {
      color: 'black',
      fontWeight: '400'
  },
  textBold: {
    fontWeight: '600'
  },
  textSmall: {
    fontSize: 10,
    textAlign: 'center'
  },
  mgTopLg: {
    marginTop: '10%',
  },
  mgTop: {
      marginTop: 15,
  },
  mgTopSm: {
      marginTop: 7,
  },
  mgBottomLg: {
      marginBottom: '30%',
  },
  mgBottom: {
      marginBottom: '15%',
  },
  mgBottomSm: {
      marginBottom: 10
  },
  mgRight: {
      marginRight: 15,
  },
  mgLeft: {
      marginLeft: 20,
  },
  mgLeftMd: {
      marginLeft: 10,
  },
  halfWidth: {
      width: '50%'
  },
  white: {
      color: 'white'
  },
  green: {
      color: DefaultColors.GREEN
  },
  theme: {
      color: DefaultColors.THEME
  },
  epic: {
    color: DefaultColors.EPIC_GIFT
  },
  red: {
      color: DefaultColors.RED
  },
  whiteBG: {
      backgroundColor: 'white'
  },
  greenBG: {
      backgroundColor: DefaultColors.GREEN
  },
  themeBG: {
      backgroundColor: DefaultColors.LIGHT_THEME
  },
  blueBg: {
      backgroundColor: DefaultColors.LIGHT_BLUE
  },
  epicBg: {
    backgroundColor: DefaultColors.EPIC_GIFT
  },
  redBG: {
      backgroundColor: DefaultColors.RED
  },
  whiteBoder: {
      borderColor: 'white'
  },
  greenBorder: {
      borderColor: DefaultColors.GREEN
  },
  themeBorder: {
      borderColor: DefaultColors.THEME
  },
  redBorder: {
      borderColor: DefaultColors.RED
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 300,
    height: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative'
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Gift;
