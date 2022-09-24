// import React, { useContext, useState } from "react";
// const JoinStatusContext = React.createContext();

// const TrackingProvider = ({children}) => {
//     const [joinStatus, setJoinStatus] = useState(false)
//     setJoinStatus(true)
//     console.log(joinStatus)
//     return (
//         <JoinStatusContext.Provider value={{joinStatus, setJoinStatus}}>
//             {children}
//         </JoinStatusContext.Provider>
//     )
// }

// export const useJoinStatus = () => useContext(JoinStatusContext);

// export {TrackingProvider}