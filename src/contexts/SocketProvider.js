// import React, { useContext, useState } from "react";
// const SocketContext = React.createContext();

// const SocketProvider = ({children}) => {
//     const [socket, setSocket] = useState(undefined)
//     console.log("socket:     ", socket)
//     return (
//         <SocketContext.Provider value={{socket, setSocket}}>
//             {children}
//         </SocketContext.Provider>
//     )
// }

// export const useSocket = () => useContext(SocketContext);

// export {SocketProvider}