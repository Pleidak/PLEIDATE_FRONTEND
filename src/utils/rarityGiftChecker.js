import { DefaultColors } from "../constants/DefaultColors"

const rarityGiftChecker = (data) => {
    const stoneList = ['medium_stone', 'rare_stone', 'epic_stone', 'legend_stone']

    switch (data.rarity) {
        case ("Thường"): {
            if (data.giftId == "gift_box"){
                return {color: DefaultColors.BLUE, size: 60, autoplay: true, combineRate: 0}
            }
            else {
                return {color: DefaultColors.NORMAL_GIFT, size: 60, autoplay: true, combineRate: 0}
            }
        }
        case ("Trung bình"): {
            if (stoneList.includes(data.giftId)) return {color: DefaultColors.MEDIUM_GIFT, size: 100, autoplay: false, combineRate: 30}
            else return {color: DefaultColors.MEDIUM_GIFT, size: 70, autoplay: true, combineRate: 0}
        }
        case ("Quý hiếm"): 
            if (stoneList.includes(data.giftId)) return {color: DefaultColors.RARE_GIFT, size: 100, autoplay: false, combineRate: 20}
            else return {color: DefaultColors.RARE_GIFT, size: 80, autoplay: true, combineRate: 0}
        case ("Sử thi"): 
            if (stoneList.includes(data.giftId)) return {color: DefaultColors.EPIC_GIFT, size: 100, autoplay: false, combineRate: 10}
            else return {color: DefaultColors.EPIC_GIFT, size: 90, autoplay: true, combineRate: 0}
        case ("Huyền thoại"): 
            if (stoneList.includes(data.giftId)) return {color: DefaultColors.LEGEND_GIFT, size: 100, autoplay: false, combineRate: 5}
            else return {color: DefaultColors.LEGEND_GIFT, size: 100, autoplay: true, combineRate: 0}
    }
}

export {rarityGiftChecker}