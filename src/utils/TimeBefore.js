const timeBefore = (time) => {
    let result = ''
    if ((Date.now() - time)/1000 < 5){
        result = 'Vừa xong'
    }
    if ((Date.now() - time)/1000 > 5 && (Date.now() - time)/1000 < 60) {
        result = `${Math.floor((Date.now() - time)/1000)} giây trước`
    }
    if ((Date.now() - time)/1000/60 >= 1 && (Date.now() - time)/1000/60 < 60){
        result = `${Math.floor((Date.now() - time)/1000/60)} phút trước`
    }
    if ((Date.now() - time)/1000/3600 >= 1 && (Date.now() - time)/1000/3600 < 24) {
        result = `${Math.floor((Date.now() - time)/1000/3600)} giờ trước`
    }
    if ((Date.now() - time)/1000/3600/24 >= 1 && (Date.now() - time)/1000/3600/24 < 8) {
        result = `${Math.floor((Date.now() - time)/1000/3600)} ngày trước`
    }
    if ((Date.now() - time)/1000/3600/24 >= 8) {
        result = time.getDate() + " tháng " + (time.getMonth() + 1) + " lúc " + time.getHours() + ':' + (time.getMinutes() < 10 ? `0${time.getMinutes()}`: time.getMinutes())
    }
    return result
}

export {timeBefore}