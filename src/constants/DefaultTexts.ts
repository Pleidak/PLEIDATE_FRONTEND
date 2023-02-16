const CREATIVITY_INTERESTS = ['Nhảy', 'Vẽ', 'Thủ công', 'Thiết kế', 'Make-up', 'Tạo video', 'Nhiếp ảnh', 'Hát', 'Viết']
const SPORT_INTERESTS = ['Chạy', 'Thể dục', 'Cầu lông', 'Bóng chày', 'Bóng rổ', 'Bowling', 'Boxing', 'Crew', 'Đạp xe', 'Bóng đá', 'Golf', 'Gym', 'Bóng ném', 'Khúc côn cầu', 'Thiền', 'Tennis', 'Bơi lội', 'Bóng chuyền', 'Yoga', 'Lướt sóng']
const GOINGOUT_INTERESTS = ['Bảo tàng & triển lãm', 'Bars', 'Cafe', 'Clubs', 'Hòa nhạc', 'Lễ hội', 'Karaoke', 'Trình diễn', 'Rạp hát']
const STAYINGIN_INTERESTS = ['Games', 'Nấu ăn', 'Làm vườn', 'Ngủ nướng', 'Đọc sách', 'Lướt web', 'Xem phim']
const FILMTV_INTERESTS = ['Lãng mạn', 'Hành động & phiêu lưu', 'Hoạt hình', 'Anime', 'Hài hước', 'Ngôn tình', 'Viễn tưởng', 'Kinh dị', 'Chính kịch', 'Game shows', 'Huyền bí', 'Tài liệu']
const MUSIC_INTEREST = ['Afro', 'Arab', 'Blues', 'Classical', 'Country', 'Desi', 'EDM', 'Electronic', 'Folk & Acoustic', 'Funk', 'Hip hop', 'House', 'Indie', 'Jazz', 'K-pop', 'Latin', 'Metal', 'Pop', 'Punk', 'R&B', 'Rap', 'Reggae', 'Rock', 'Soul', 'Techno', 'Vinahouse']
const FOODDRINK_INTERESTS = ['Bia', 'Trà sữa', 'Cà phê', 'Foodie', 'Rượu', 'Sushi', 'Trà', 'Ăn Chay', 'Rau củ', 'Sinh tố', 'Nước ép', 'Đồ ngọt', 'Đồ có ga']
const TRAVALING_INTERESTS = ['Bãi biển', 'Cắm trại', 'Câu cá', 'Leo lúi', 'Phượt', 'Spa', 'Tâm linh', 'Bất cứ đâu miễn là cùng nhau']
const PET_INTERESTS = ['Chó', 'Mèo', 'Chim cảnh', 'Cá', 'Hamster', 'Khỉ']
const VALUETRAIT_INTERESTS = ['Tham vọng', 'Năng động', 'Hiếu thảo', 'Cởi mở', 'Lãng mạn', 'Thấu hiểu', 'Tự tin', 'Sáng tạo', 'Thông minh', 'Tích cực', 'Nội tâm', 'Phiêu lưu', 'Hài hước', 'Nhận thức xã hội']

export const defaultText = {
    FACEBOOK_LOGIN_BTN: "Tiếp tục với Facebook",
    PHONE_LOGIN_BTN: "Sử dụng số diện thoại",
    PRIVACY_REMINDER: "Bằng việc đăng ký, bạn đồng ý với Chính sách của chúng tôi. Xem cách chúng tôi sử dụng dữ liệu của bạn trong Chính sách quyền riêng tư.",
    PHONE_SUBMIT_TITLE: "Số điện thoại của bạn là?",
    PHONE_SUBMIT_CONTENT: "Bằng việc tiếp tục, Pleidate sẽ gửi một mã xác thực đến số điện thoại của bạn. Khi xác thực thành công, Pleidate sẽ dùng số điện thoại của bạn làm tài khoản đăng nhập",
    INFO_NOT_SHARING_PRIVACY: "Thông tin này sẽ không được chia sẻ với mọi người và sẽ không hiển thị trong hồ sơ của bạn",
    INFO_SHARING_PRIVACY: "Thông tin này sẽ được hiển thị trong hồ sơ của bạn",
    CODE_SUBMIT_TITLE: "Mã của tôi là?",
    CODE_SUBMIT_CONTENT: "Nhập mã xác thực được gửi đến",
    NAME_SUBMIT_TITLE: "Tên của bạn là gì?",
    NAME_SUBMIT_CONTENT: "Bạn sẽ không thể thay đổi thông tin này về sau",
    AGE_SUBMIT_TITLE: "Ngày sinh của bạn là?",
    AGE_SUBMIT_CONTENT: "Bạn không thể thay đổi thông tin này về sau",
    AVATAR_SUBMIT_TITLE: "Thêm ảnh đầu tiên của bạn",
    AVATAR_SUBMIT_CONTENT: "Hãy thêm ít nhất 3 ảnh của bạn để nổi bật hơn vơi mọi người",
    LOOKING_FOR_SUBMIT_TITLE: "Đối tượng bạn muốn tìm kiếm là?",
    CAN_CHANGE_ANSWER_ANYTIME: "Bạn có thể chọn nhiều hơn một câu trả lời và có thể thay đổi bất cứ lúc nào",
    EMAIL_SUBMIT_TITLE: "Địa chỉ email của bạn là gì?",
    EMAIL_SUBMIT_CONTENT: "Chúng tôi sử dụng thông tin này để lấy lại tài khoản của bạn trong trường hợp bạn không thể đăng nhập",
    INTEREST_SUBMIT_TITLE: "Sở thích của bạn",
    INTEREST_SUBMIT_CONTENT: "Chọn tối đa 5 điều bạn thích. Điều này sẽ giúp bạn ghép đôi với người cũng thích chúng",
    HEIGHT_SUBMIT_TITLE: "Bạn cao bao nhiêu",
    STARSIGN_SUBMIT_TITLE: "Cung hoàng đạo của bạn là gì",
    EDUCATIONLEVEL_SUBMIT_TITTLE: "Học vấn của bạn?",
    DRINKING_SUBMIT_TITLE: "Bạn có hay đi uống không?",
    SMOKING_SUBMIT_TITLE: "Bạn có hút thuốc không?",
    RELIGION_SUBMIT_TITLE: "Tôn giáo của bạn?",
    BIO_SUBMIT_TITLE: "Thêm thông tin thêm về bạn",
    BIO_SUBMIT_CONTENT: "Những người mà bạn gặp gỡ hoặc lướt tìm thấy bạn sẽ yêu thích nếu thấy bio cho biết bạn là ai",
    USERINFO_BEGIN_DONE_TITLE: "Bạn đã sẵn sàng để có một mối quan hệ mới",
    STARSIGN_SUBMIT_ITEMS: ["Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ", "Thiên Bình", "Thiên Yết", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"],
    EDUCATIONLEVEL_ITEMS: ["THPT", "Đại học", "Cao đẳng", "Tốt nghiệp"],
    DRINKING_ITEMS: ["Xã giao", "Không bao giờ", "Thường xuyên"],
    SMOKING_ITEMS: ["Xã giao", "Không bao giờ", "Thường xuyên"],
    RELIGION_ITEMS: ["Phật giáo", "Kitô giáo", "Tin Lành", "Hòa Hảo", "Cao Đài", "Vô thần", "Khác"],
    CREATIVITY_INTERESTS: ['Nhảy', 'Vẽ', 'Thủ công', 'Thiết kế', 'Make-up', 'Tạo video', 'Nhiếp ảnh', 'Hát', 'Viết'],
    SPORT_INTERESTS: ['Chạy', 'Thể dục', 'Cầu lông', 'Bóng chày', 'Bóng rổ', 'Bowling', 'Boxing', 'Crew', 'Đạp xe', 'Bóng đá', 'Golf', 'Gym', 'Bóng ném', 'Khúc côn cầu', 'Thiền', 'Tennis', 'Bơi lội', 'Bóng chuyền', 'Yoga', 'Lướt sóng'],
    GOINGOUT_INTERESTS: ['Bảo tàng & triển lãm', 'Bars', 'Cafe', 'Clubs', 'Hòa nhạc', 'Lễ hội', 'Karaoke', 'Trình diễn', 'Rạp hát'],
    STAYINGIN_INTERESTS: ['Games', 'Nấu ăn', 'Làm vườn', 'Ngủ nướng', 'Đọc sách', 'Lướt web', 'Xem phim'],
    FILMTV_INTERESTS: ['Lãng mạn', 'Hành động & phiêu lưu', 'Hoạt hình', 'Anime', 'Hài hước', 'Ngôn tình', 'Viễn tưởng', 'Kinh dị', 'Chính kịch', 'Game shows', 'Huyền bí', 'Tài liệu'],
    MUSIC_INTEREST: ['Afro', 'Arab', 'Blues', 'Classical', 'Country', 'Desi', 'EDM', 'Electronic', 'Folk & Acoustic', 'Funk', 'Hip hop', 'House', 'Indie', 'Jazz', 'K-pop', 'Latin', 'Metal', 'Pop', 'Punk', 'R&B', 'Rap', 'Reggae', 'Rock', 'Soul', 'Techno', 'Vinahouse'],
    FOODDRINK_INTERESTS: ['Bia', 'Trà sữa', 'Cà phê', 'Foodie', 'Rượu', 'Sushi', 'Trà', 'Ăn Chay', 'Rau củ', 'Sinh tố', 'Nước ép', 'Đồ ngọt', 'Đồ có ga'],
    TRAVALING_INTERESTS: ['Bãi biển', 'Cắm trại', 'Câu cá', 'Leo lúi', 'Phượt', 'Spa', 'Tâm linh', 'Bất cứ đâu miễn là cùng nhau'],
    PET_INTERESTS: ['Chó', 'Mèo', 'Chim cảnh', 'Cá', 'Hamster', 'Khỉ'],
    VALUETRAIT_INTERESTS: ['Tham vọng', 'Năng động', 'Hiếu thảo', 'Cởi mở', 'Lãng mạn', 'Thấu hiểu', 'Tự tin', 'Sáng tạo', 'Thông minh', 'Tích cực', 'Nội tâm', 'Phiêu lưu', 'Hài hước', 'Nhận thức xã hội'],
    ALL_INTEREST: CREATIVITY_INTERESTS.concat(SPORT_INTERESTS, GOINGOUT_INTERESTS, STAYINGIN_INTERESTS, FILMTV_INTERESTS, MUSIC_INTEREST, FOODDRINK_INTERESTS, TRAVALING_INTERESTS, PET_INTERESTS, VALUETRAIT_INTERESTS)
}