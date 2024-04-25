import { faGift, faHeart, faLineChart, faXmark } from "@fortawesome/free-solid-svg-icons"
import React, { useEffect, useRef, useState } from "react"
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler, ScrollView, Dimensions, ImageBackground, TextInput } from "react-native"
import { Image } from "react-native-elements"
import { getGiftColection, getMeetings, getSuggestionUsers, likeUser, postGift } from "../api/Home"
import { DefaultColors } from "../constants/DefaultColors"
import { defaultText } from "../constants/DefaultTexts"
import { timeBefore } from "../utils/TimeBefore"
import { getAge } from "../utils/GetAge"
import LottieView from "lottie-react-native";
import { useLogin } from "../contexts/LoginProvider"
import { navigationStack } from "./NavigationStack"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { MESSAGES } from "../constants/Messages"
import MapView, {Marker} from "react-native-maps";
import { rarityGiftChecker } from "../utils/rarityGiftChecker"
import MapTracker from "./MapTracker"


const Mettings = ()=> {

    const LATITUDE_DELTA = 0.00922;
    const LONGITUDE_DELTA = 0.00421;
    const DEFAULT_LATITUDE = 21.028511
    const DEFAULT_LONGITUDE = 105.804817

    const meetingInfoInit = [
        {
            userId: 123456789,
            name: 'Unknown',
            age: 18,
            matchTime: '0 phút trước',
            imagePaths: [],
            proactiveLongitude: DEFAULT_LONGITUDE.toString(),
            proactiveLatitude: DEFAULT_LATITUDE.toString(),
            userInfoView: {
                location: '',
                bio: '',
                extra: {
                    height: '',
                    exercise: '',
                    educationLevel: '',
                    drinking: '',
                    smoking: '',
                    kids: '',
                    starSign: '',
                    politics: '',
                    religion: '',
                    language: ''
                },
                interests: [
                    { 
                        hobby: ''
                    }   
                ]
            }
        }
    ]

    const giftInit = {
        giftId: '',
        name: '',
        rarity: '',
        amount: 0,
        ownOrReceived: 1,
        choice: 1
    }

    const giftColectionInit = [
        giftInit
    ]
    
    const [tab, setTab] = useState(0)
    const [meetingInfo, setMeetingInfo] = useState(meetingInfoInit)
    const [infoView, setInfoView] = useState(0)
    const [suggestionInfo, setSuggestionInfo] = useState(meetingInfoInit)
    const [suggestionIndex, setSuggestionIndex] = useState(0)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [meetingView, setMeetingView] = useState(0)
    const [showMeetingInfo, setShowMeetingInfo] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState('')
    const [liked, setLiked] = useState(false)
    const [matched, setMatched] = useState(false)
    const [showLikeResultAnimation, setShowLikeResultAnimation] = useState(false)
    const [showGiftResultAnimation, setShowGiftResultAnimation] = useState(false)
    const [showGiftGiving, setShowGiftGiving] = useState(false)
    const {userInfo} = useLogin()
    const [mapCenter, setMapCenter] = React.useState({
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
    const [gifts, setGifts] = useState(giftColectionInit)
    const [giftShowing, setGiftShowing] = useState(giftInit)
    const [giftChoiceNumber, setGiftChoiceNumber] = useState(1)
    const [giftChange, setGiftChange] = useState('')
    const navigateIndex = useRef(1)
    const scrollRef = React.createRef<ScrollView>()

    scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})

    const updateUserInfo = (resData: any) => {
        const userInfoList = resData.userInfo
        let newMeetingInfo = meetingInfo
        for (let i=0; i<userInfoList.length; i++){
            newMeetingInfo.push({
                userId: userInfoList[i].userId,
                name: userInfoList[i].name,
                age: getAge(userInfoList[i].age),
                matchTime: resData.meeting[i] ? timeBefore(new Date(resData.meeting[i].matchTime)): "0 phút trước",
                imagePaths: resData.userImage[i],
                proactiveLongitude: resData.meeting[i] ? resData.meeting[i].proactiveLongitude: DEFAULT_LONGITUDE,
                proactiveLatitude:  resData.meeting[i] ? resData.meeting[i].proactiveLatitude: DEFAULT_LATITUDE,
                userInfoView: {
                    location: userInfoList[i].location,
                    bio: userInfoList[i].bio,
                    extra: {
                        height: resData.userExtra[i].height,
                        exercise: resData.userExtra[i].exercise,
                        educationLevel: resData.userExtra[i].educationLevel,
                        drinking: resData.userExtra[i].drinking,
                        smoking: resData.userExtra[i].smoking,
                        kids: resData.userExtra[i].kids,
                        starSign: resData.userExtra[i].starSign,
                        politics: resData.userExtra[i].politics,
                        religion: resData.userExtra[i].religion,
                        language: resData.userExtra[i].language
                    },
                    interests: resData.userInterest
                }
            })
        }
        const result = newMeetingInfo.filter((e)=>{
            return e.name != 'Unknown'
        })
        if (result.length == userInfoList.length){
            setMeetingInfo(result)
        }
    }

    const getMeetingHandler = async () => {
        console.log("=======================================")
        const res = await getMeetings()
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
            } else {
                setIsError(false)
                updateUserInfo(jsonRes.meetingResult)
            }   
        } else{
            setIsError(true)
        }
    }

    const likeUserHandler = async (isLiked: boolean, meetOrSurf: boolean, userTarget: number) => {
        const res = await likeUser(isLiked, meetOrSurf, userTarget)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
            } else {
                setMatched(jsonRes.result.isMatched)
                setIsError(false)
            }   
        }else{
            setIsError(true)
        }
    }

    const getGiftHandler = async (userId: number) => {
        const res = await getGiftColection(userId)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
            } else {
                setMatched(jsonRes.result.isMatched)
                setIsError(false)
                let newGifts = gifts
                for (let i=0; i<jsonRes.result.length; i++){
                    newGifts.push({
                        giftId: jsonRes.result[i].giftId,
                        name: jsonRes.result[i].name,
                        rarity: jsonRes.result[i].rarity,
                        amount: jsonRes.result[i].amount,
                        ownOrReceived: jsonRes.result[i].ownOrReceived,
                        choice: 1
                    })
                }
                const result = newGifts.filter((e)=>{
                    return e.giftId != ''
                })
                setGifts(result)
                setGiftShowing(result[0])
                setGiftChange(result[0].giftId)
            }   
        }else{
            setIsError(true)
        }
    }

    const postGiftHandler = async (userId: number, userTarget: number, giftId: string, name: string, rarity: string, total: number, ownOrReceived: boolean, message: string) => {
        const res = await postGift(userId, userTarget, giftId, name, rarity, total, ownOrReceived, message)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
            } else {
                setIsError(false)
            }   
        } else{
            setIsError(true)
        }
    }

    const getUserSuggestionHandler = async (userId: number) => {
        const res = await getSuggestionUsers(userId)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
            } else {
                setIsError(false)
                updateUserInfo(jsonRes.suggestionResult)
            }   
        } else{
            setIsError(true)
        }
    }

    useEffect(()=>{
        if (tab%2==0){
            getMeetingHandler()
        }
        else {
            getUserSuggestionHandler(userInfo.userId)
        }
        setShowGiftGiving(false)
        setGifts(giftColectionInit)
        scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})
    }, [tab])

    useEffect(()=>{
        const backAction = () => {
            navigateIndex.current = navigateIndex.current - 1
            setShowMeetingInfo(false)
            if (showGiftGiving) {
                setShowGiftGiving(false)
                setGifts(giftColectionInit)
            scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})

            }
            else {
                if (showUserInfo) {
                    setShowUserInfo(false)
            scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})

                }
            }

            if (navigateIndex.current === 0){
                BackHandler.exitApp()
            }
            return true
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
      
        return () => backHandler.remove();
    },[showGiftGiving, showUserInfo])

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         setShowLikeResultAnimation(false)
    //         setShowGiftResultAnimation(false)
    //     }, 2000)
    // }, [showLikeResultAnimation, showGiftResultAnimation])

    return (
        <View style={[styles.container, styles.dFlex]}>
            <MapTracker/>
            <StatusBar barStyle="dark-content" hidden = {false} backgroundColor = {DefaultColors.LIGHT_THEME} translucent = {true}/>
            <View style={[styles.topTabs, styles.maxWidth]}>
                <TouchableOpacity onPress={async () => {
                        if (tab%2!=0){
                            setTab(0)
                            setMeetingInfo(meetingInfoInit)
                            await getMeetingHandler()
                        }
                    }}>
                    <Text style={[styles.topBarText, tab%2==0? styles.topBarTextActive: undefined]}>Đã gặp gần đây</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                        if (tab%2!=1){                         
                            setTab(1)
                            setMeetingInfo(meetingInfoInit)
                            await getUserSuggestionHandler(userInfo.userId)
                        }
                    }}>
                    <Text style={[styles.topBarText, tab%2==1 ? styles.topBarTextActive: undefined]}>Lướt thêm gợi ý</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.content, styles.mgTop]}>
            {
                !showUserInfo && tab%2==0 ? (
                    showMeetingInfo ? (
                        <View style={styles.mainFrame}>
                            <MapView
                                style={[styles.map, styles.dFlex]}
                                region={mapCenter}>
                                    <Marker 
                                        coordinate={{longitude: parseFloat(meetingInfo[meetingView].proactiveLongitude), latitude: parseFloat(meetingInfo[meetingView].proactiveLatitude)}}
                                    >
                                        <View style={[styles.nameAndMatchTime, styles.dFlexColStart, styles.mgBottomSm]}>
                                            <Text style={styles.buttonText}>Bạn và {meetingInfo[meetingView].name}</Text>
                                            <Text>{meetingInfo[meetingView].matchTime}</Text>
                                        </View>
                                        <View style={{width: 100}}>
                                            <Image source={{uri: userInfo.mainAvatar}} style={{width: 50, height: 50, borderRadius: 50,
                                                borderWidth: 1, borderColor: DefaultColors.GREY, justifyContent: 'center', alignItems: 'center'}}/>  
                                            <View style={{position: "absolute", right: 0, left: 0, bottom: 0, top: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image source={{uri: meetingInfo[meetingView].imagePaths[0]}} style={{width: 50, height: 50, borderRadius: 50,
                                                    borderWidth: 1, borderColor: DefaultColors.GREY}}/> 
                                            </View>
                                        </View>
                                    </Marker>
                            </MapView>
                        </View>
                    ): (
                        meetingInfo.length > 0 ?  
                        meetingInfo.map((e, i)=>(
                            <View key={e.userId} style={[styles.dFlexSpaceBetween, styles.metFrame, styles.mgBottomSm]}>
                                {
                                    showLikeResultAnimation && e.userId == meetingInfo[infoView].userId  ? (
                                        <View style={[styles.likeUserResultLayer, styles.dFlex]}>
                                            {
                                                liked ? (
                                                    <LottieView
                                                    source={require('../public/lotties/liked.json')}
                                                    style={{width: 200, height: 200}}
                                                    autoPlay 
                                                    duration={2000}
                                                    loop={false}
                                                    />
                                                ): (
                                                    <LottieView
                                                    source={require('../public/lotties/disliked.json')}
                                                    style={{width: 200, height: 200}}
                                                    duration={2000}
                                                    autoPlay 
                                                    loop={false}
                                                    />
                                                )
                                            }
    
                                        </View>
                                    ): undefined
                                }
                                    {
                                        tab==0 ? (
                                            <View style={[styles.maxWidth, styles.maxHeight, styles.dFlexSpaceBetween]}>
                                                <View style={[styles.metAvt]}>
                                                    {
                                                        e.imagePaths[0]? 
                                                        <Image source={{uri: e.imagePaths[0]}} style={{width: '100%', height: '100%'}}></Image>
                                                        : <LottieView
                                                            source={require('../public/lotties/loader.json')}
                                                            style={{width: 80, height: 80}}
                                                            autoPlay
                                                        />
                                                    }
                                                </View>
                                                <View style={[styles.metInfo, styles.mgLeftMd, styles.dFlexStart]}>
                                                    <Text style={styles.username}>{e.name}, {e.age}</Text>
                                                    <Text style={styles.greenText}>{e.matchTime}</Text>
                                                    <TouchableOpacity style={styles.button} onPress={
                                                            ()=>{
                                                                setInfoView(i)
                                                                setShowUserInfo(true)
                                                                navigateIndex.current = 2
                                                            }
                                                        }>
                                                        <Text style={[styles.buttonText]}>Xem chi tiết</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.button} onPress={
                                                            ()=>{
                                                                setMeetingView(i)
                                                                setShowMeetingInfo(true)
                                                                scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})
                                                                setMapCenter({
                                                                    latitude: parseFloat(e.proactiveLatitude),
                                                                    longitude: parseFloat(e.proactiveLongitude),
                                                                    latitudeDelta: LATITUDE_DELTA,
                                                                    longitudeDelta: LONGITUDE_DELTA
                                                                })
                                                            }
                                                        }>
                                                        <Text style={[styles.buttonText]}>Thông tin gặp gỡ</Text>
                                                    </TouchableOpacity>
                                                    <Text style={[styles.buttonText, styles.mgTopSm]}>{'Lưu đối tượng'}</Text>
                                                    <Text style={[styles.buttonText, styles.mgTopSm]}>{'Bỏ qua người này'}</Text>
                                                </View>
                                            </View>
                                        ): undefined
                                    }
                                    
                            </View>
                        ))
                        : (
                            <View style={styles.mainFrame}>
                                <View style={[styles.likeUserResultLayer, styles.dFlex, styles.themeBG]}>
                                    <View style={[styles.mgBottomLg]}>
                                        <Text style={styles.textLink}>Oop! Chưa có gặp gỡ mới nào!</Text>
                                        <LottieView
                                        source={require('../public/lotties/walking-with-my-dog.json')}
                                        style={{width: 450, height: 350}}
                                        autoPlay 
                                        // duration={3000}
                                        loop={true}
                                        />
                                        <Text style={styles.textLink}>Ra ngoài đi dạo thôi nào!</Text>
                                    </View>
                                </View>
                            </View>

                        )
                    )
                ):(
                    !showGiftGiving ? (
                    <View style={styles.mainFrame}>
                        <ScrollView keyboardShouldPersistTaps={'handled'} ref={scrollRef}>
                            {
                                meetingInfo[infoView] && meetingInfo[infoView].imagePaths.length > 0 ? (
                                    meetingInfo[infoView].imagePaths.map((imgPath, i)=>(
                                        <View key={i} style={[styles.themeBG]}>
                                            <View>
                                                <Image key={i} source={{uri: imgPath}} style={{width: '100%', height: 540, overflow: "hidden"}}></Image>
                                                {
                                                     i==0? (
                                                        <View style={styles.infoLayer}>
                                                            <Text style={styles.usernameLg}>{meetingInfo[infoView].name}, {meetingInfo[infoView].age}</Text>
                                                            <View style={[styles.dFlexRowStart]}>
                                                                <FontAwesomeIcon style={{color: DefaultColors.WHITE}} icon={faLocationDot} size={18} />
                                                                <Text style={styles.infoLayerText}>{meetingInfo[infoView].userInfoView.location? meetingInfo[infoView].userInfoView.location: "Chưa xác định"}</Text>
                                                            </View>
                                                            <Text style={[styles.infoLayerText, styles.mgTopSm]}>{meetingInfo[infoView].userInfoView.bio}</Text>
                                                        </View>
                                                    ): undefined
                                                }
                                               
                                            </View>
                                            {
                                                i==0? (
                                                    <View>
                                                        <View style={[styles.mgTop, styles.mgLeftMd, styles.mgRight]}>
                                                            <Text style={styles.username}>Cơ bản</Text>
                                                            <View style={styles.hobbies}>
                                                            {
                                                                meetingInfo[infoView].userInfoView.extra ? (
                                                                    Object.entries(meetingInfo[infoView].userInfoView.extra).map(([k, v]) => 
                                                                            v? (
                                                                                <View key={k} style={[styles.mgRight, styles.mgTopSm]}>
                                                                                    <TouchableOpacity style={styles.button} disabled={true}>
                                                                                        <Text style={[styles.buttonText]}>{v}</Text>
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                            ): undefined
                                                                    )
                                                                
                                                                ): undefined
                                                            }
                                                            </View>
                                                        </View>
                                                        <View style={[styles.mgTop, styles.mgLeftMd, styles.mgRight]}>
                                                            <Text style={styles.username}>Sở thích</Text>
                                                            <View style={styles.hobbies}>
                                                            {
                                                                meetingInfo[infoView].userInfoView.extra ? (
                                                                    meetingInfo[infoView].userInfoView.interests.map((interest, i) => 
                                                                    interest? (
                                                                            <View key={i} style={[styles.mgRight, styles.mgTopSm]}>
                                                                                <TouchableOpacity style={styles.button} disabled={true}>
                                                                                    <Text style={[styles.buttonText]}>{interest.hobby}</Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        ): undefined
                                                                    )
                                                                
                                                                ): undefined
                                                            }
                                                            </View>
                                                        </View>
                                                    </View>
                                                    
                                                ): undefined
                                            }
                                            <TouchableOpacity style={[styles.confirmBtn, styles.dFlex]}  onPress={
                                            async () => {
                                               
                                            }
                                            }>
                                            {
                                                // waiting ? (
                                                //     <LottieView
                                                //         source={require('../public/lotties/loader.json')}
                                                //         style={{width: 50, height: 50}}
                                                //         autoPlay
                                                //     />
                                                // ):
                                                i == meetingInfo[infoView].imagePaths.length - 1?
                                                <Text style={[styles.topBarText]}>Xem hồ sơ</Text>
                                                : undefined
                                            }
                                        </TouchableOpacity>
                                        </View>
                                        
                                    )
                                    )
                                )
                                : (
                                    tab==0? (
                                        <LottieView
                                            source={require('../public/lotties/loader.json')}
                                            style={{width: 80, height: 80}}
                                            autoPlay
                                        />
                                    ): (
                                        <View style={[styles.dFlex, styles.mgTopLg]}>
                                             <LottieView
                                                source={require('../public/lotties/loader.json')}
                                                style={{width: 100, height: 100}}
                                                autoPlay
                                            />
                                        </View>
                                    )
                                )
                            }
                            
                        </ScrollView>
                        {
                            showGiftResultAnimation ? (
                                <View style={[styles.likeUserResultLayer, styles.dFlex]}>
                                    <LottieView
                                    source={require('../public/lotties/gift-giving.json')}
                                    style={{width: 200, height: 200}}
                                    autoPlay 
                                    duration={2000}
                                    loop={false}
                                    />
                                </View>
                            ): undefined
                        }
                        <View style={[styles.interactiveLayer]}>
                            <TouchableOpacity style={[styles.borderIconFrame, styles.greenBorder]} onPress={
                                async () => {
                                    await likeUserHandler(true, true, meetingInfo[infoView].userId)
                                    if (!isError){
                                        setLiked(true)
                                        setShowLikeResultAnimation(true)
                                        let newMeetingInfo = meetingInfo.filter((m)=>{return m.userId != meetingInfo[infoView].userId})
                                        setTimeout(()=>{
                                            setShowLikeResultAnimation(false)
                                            setMeetingInfo(newMeetingInfo)
                                        }, 2000)
                                        if (tab%2==0){
                                            setTimeout(()=>{
                                                setShowUserInfo(false)
                                            }, 500)
                                        }
                                        else {
                                            setInfoView(infoView=>infoView+1)
                                        }
                                    }
                                }}>
                                <FontAwesomeIcon style={{color: DefaultColors.GREEN}} icon={faHeart} size={35} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.borderIconFrame, styles.themeBorder, styles.mgTop]} onPress={
                                async () => {
                                    navigateIndex.current = 2
                                    setShowGiftGiving(true)
                                    await getGiftHandler(meetingInfo[infoView].userId)
                                    scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})
                                }}>
                                <FontAwesomeIcon style={{color: DefaultColors.THEME}} icon={faGift} size={35} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.borderIconFrame, styles.redBorder, styles.mgTop]} onPress={
                                async () => {
                                    await likeUserHandler(false, true, meetingInfo[infoView].userId)
                                    if (!isError){
                                        setLiked(false)
                                        setShowLikeResultAnimation(true)
                                        let newMeetingInfo = meetingInfo.filter((m)=>{return m.userId != meetingInfo[infoView].userId})
                                        setTimeout(()=>{
                                            setShowLikeResultAnimation(false)
                                            setMeetingInfo(newMeetingInfo)
                                        }, 2000)
                                        if (tab%2==0){
                                            setTimeout(()=>{
                                                setShowUserInfo(false)
                                            }, 500)
                                        }
                                        else {
                                            setInfoView(infoView=>infoView+1)
                                        }
                                    }
                                }}>
                                <FontAwesomeIcon style={{color: DefaultColors.RED}} icon={faXmark} size={35} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    )
                    : (
                        <View style={[styles.mainFrame, styles.themeBG]}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} ref={scrollRef}>
                                <View style={styles.dFlexRowStart}>
                                    <View style={[styles.mgLeftMd, styles.mgTop, styles.metAvt]}>
                                        {
                                            meetingInfo[infoView].imagePaths[0] ? 
                                            <Image source={{uri: meetingInfo[infoView].imagePaths[0]}} style={{width: '100%', height: 180, borderRadius: 10, overflow: 'hidden'}}></Image>
                                            : <LottieView
                                                source={require('../public/lotties/loader.json')}
                                                style={{width: 80, height: 80}}
                                                autoPlay
                                            />
                                        }
                                    </View>
                                    <View style={[styles.metInfoGiftGiving, styles.dFlex, styles.mgTop, styles.mgLeftMd]}>
                                        <Text style={styles.topBarTextActive}>Chọn quà tặng</Text>
                                            {
                                                giftShowing ? (
                                                    <LottieView
                                                        key={giftShowing.giftId}
                                                        source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${giftShowing.giftId}.json`}}
                                                        style={{width: 135, height: 135}}
                                                        autoPlay
                                                    />
                                                ): (
                                                    <LottieView
                                                        source={require('../public/lotties/loader.json')}
                                                        style={{width: 135, height: 135}}
                                                        autoPlay
                                                    />
                                                )
                                            }
                                        {
                                            // giftShowing.choice ? 
                                            // <Text style={[styles.buttonText, styles.mgTopSm]}>Đã chọn {giftChoiceNumber} {giftShowing.name}</Text>
                                            // : <Text style={[styles.buttonText, styles.mgTopSm]}>Đã chọn {giftChoiceNumber} {giftShowing.name}</Text>
                                            // ()=>{
                                                // giftChoiceNumber ? console.log(giftChoiceNumber): undefined
                                            // }
                                            <Text style={[styles.buttonText, styles.mgTopSm]}>Đã chọn {giftShowing.choice} <Text style={{color: rarityGiftChecker(giftShowing)?.color, fontWeight: '800'}}>{giftShowing.name}</Text></Text>
                                        }
                                    </View>
                                </View>
                                <View style={[styles.dFlexColStart, styles.mgLeftMd]}>
                                    <Text style={styles.topBarTextActive}>Bộ sưu tập</Text>
                                    <View style={[styles.metInfoGiftGiving, styles.dFlexRowStart, styles.mgTopSm]}>
                                        {
                                            gifts.map((gift)=>(
                                                <TouchableOpacity style={styles.dFlex} key={gift.giftId} onPress={async ()=>{
                                                        // let giftChoice = gift
                                                        // giftChoice.choice ++
                                                        // console.log(giftChoice.choice)
                                                        if (giftChange == gift.giftId && gift.choice < gift.amount){
                                                            gift.choice += 1
                                                        }
                                                        else {gift.choice = 1}
                                                        setGiftShowing(gift)
                                                        setGiftChange(gift.giftId)
                                                        setGiftChoiceNumber(giftChoiceNumber=>giftChoiceNumber +1)
                                                    }}>
                                                    <View style={[styles.dFlex, styles.mgRight]}>
                                                        <LottieView
                                                            source={{uri: `https://res.cloudinary.com/dyrjg8n6f/raw/upload/${gift.giftId}.json`}}
                                                            style={{width: 50, height: 50}}
                                                            autoPlay={false}
                                                        />
                                                        <View style={styles.dFlexRowStart}>
                                                            <Text style={{color: rarityGiftChecker(gift)?.color, 
                                                                fontWeight: giftChange == gift.giftId? '800': '400', fontSize: 12
                                                            }}>{gift.name} <Text>({gift.amount}x)</Text></Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        giftShowing.choice && giftChange == gift.giftId ? (
                                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: DefaultColors.LEGEND_GIFT, borderRadius: 50, width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                                <Text style={{color: 'white', fontSize: 12, fontWeight: '800'}}>+{giftShowing.choice}</Text>
                                                            </View>
                                                        ): undefined
                                                    }
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                    <TouchableOpacity style={[styles.button, styles.mgTop]} onPress={
                                            ()=>{
                                               
                                            }
                                        }>
                                        <Text style={[styles.buttonText]}>Đi tới cửa hàng</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.topBarTextActive, styles.mgTop]}>Để lại lời nhắn</Text>
                                    <View style={{width: '93%'}}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={5}
                                            style={[styles.input, styles.mgTopSm, styles.textInputArea]}
                                            onChangeText={setMessage}
                                        />
                                    </View>
                                    
                                </View>
                                <View style={styles.dFlex}>
                                    <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, styles.mgTop, styles.mgBottom]} onPress={
                                        async () => {
                                            await postGiftHandler(userInfo.userId, meetingInfo[infoView].userId, giftShowing.giftId, giftShowing.name, giftShowing.rarity, giftShowing.choice, false, message)
                                            if (!isError){
                                                setShowGiftGiving(false)
                                                setGifts(giftColectionInit)
                                                setShowGiftResultAnimation(true)
                                                scrollRef.current?.scrollTo({x: 0, y: 0, animated: false})
                                            }
                                        }
                                        }>
                                        {
                                            // waiting ? (
                                            //     <LottieView
                                            //         source={require('../public/lotties/loader.json')}
                                            //         style={{width: 50, height: 50}}
                                            //         autoPlay
                                            //     />
                                            // ):
                                            <Text style={[styles.buttonText]}>Xác nhận</Text>
                                        }
                                    </TouchableOpacity>
                                    </View>
                            </ScrollView>
                        </View>
                    )
                )
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dFlex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dFlexStart: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
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
    dFlexColStart: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dFlexSpaceBetween: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
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
    maxWidth: {
        width: '100%',
    },
    maxHeight: {
        height: '100%',
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
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    half: {
        height: '50%',
        width: '100%',
    },
    topTabs: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        top: 5,
    },
    content:{
        width: "93%",
        height: "90%",
        fontSize: 16,
        color: 'black',
    },
    mainFrame: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    likeUserResultLayer: {
        position: 'absolute',
        bottom: 0,
        left: 0, 
        right: 0,
        top: 0,
        zIndex: 1000
    },
    infoLayer: {
        position: 'absolute',
        bottom: 30,
        left: 20, 
        right: 70
    },
    infoLayerText: {
        color: 'white',
        marginLeft: 5,
    },
    interactiveLayer: {
        position: 'absolute',
        right: 20,
        bottom: 30,
    },
    borderIconFrame: {
        borderWidth: 3,
        borderRadius: 50,
        padding: 5,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10
    },
    metFrame: {
        width: '100%',
        height: '35%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: DefaultColors.LIGHT_THEME,
        position: 'relative'
    },
    metAvt: {
        width: '40%',
    },
    metInfo: {
        width: '60%'
    },
    metAvtGiftGiving: {
        width: '50%',
    },
    metInfoGiftGiving: {
        width: '50%'
    },
    hobbies: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metAvtGiftGivingFrame: {
        height: 200
    },
    footer: {
        postition: 'fixed',
        bottom: 5
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
    topBarText: {
        color: DefaultColors.GREY,
        fontSize: 18,
        fontWeight: '400'
    },
    topBarTextActive: {
        color: DefaultColors.GREY_DARK,
        fontSize: 18,
        fontWeight: '600',
    },
    buttonText: {
        color: 'black',
        fontWeight: '400'
    },
    inputs: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginTop: '10%',
        marginBottom: '10%',
        color: DefaultColors.GREY_DARK
    },  
    input: {
        width: '100%',
        height: '90%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: DefaultColors.THEME,
        fontSize: 16, 
        minHeight: 40,
        paddingLeft: 15
    },
    confirmBtn: {
        height: 35,
        paddingLeft: 15,
        paddingRight: 15,
    },
    textLink: {
        color: DefaultColors.GREY,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    username: {
        color: DefaultColors.GREY_DARK,
        fontWeight: '600',
        fontSize: 20,
    },
    usernameLg: {
        color:'white',
        fontWeight: '600',
        fontSize: 30,
    },
    greenText: {
        color: DefaultColors.GREEN
    },
    map: {
        flex: 1,
    },
    markerIcon: {
        borderWidth:1,
        borderColor:'#000000',
        backgroundColor: DefaultColors.POLYLINE,
        //backgroundColor: 'rgba(0,179,253, 0.6)',
        width: 10,
        height: 10,
        borderRadius: 5
    },
    nameAndMatchTime: {backgroundColor: DefaultColors.LIGHT_THEME, borderRadius: 10, padding: 7},
    textInputArea: {
        textAlignVertical: 'top',
        height: 200
    },
    normalGift: {
        color: DefaultColors.NORMAL_GIFT
    },
    mediumGift: {
        color: DefaultColors.MEDIUM_GIFT
    },
    rareGift: {
        color: DefaultColors.RARE_GIFT
    },
    epicGift: {
        color: DefaultColors.EPIC_GIFT
    },
    legendGift: {
        color: DefaultColors.LEGEND_GIFT
    }
})

export default Mettings