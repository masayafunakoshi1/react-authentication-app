import React, {useContext, useState, useEffect} from 'react'
import {auth} from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    //Not setting user while creating them becuase of Firebase's own method to notify you when the user is set
    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }

    //If you dont want to use Firebase, change this line to go to another database and everything will work fine
    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email){
        return currentUser.updateEmail(email)
    }

    function updatePassword(password){
        return currentUser.updatePassword(password)
    }

    //Firebase method to set the user from here, "user" will either currentUser or null
    //Unsubscribe from the onAuthStateChange listener whenever it's done
    //Does verification to see if there is a user
    useEffect(() => {
       const unsubscribe =  auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    //Passing value with useContext into App.js and it's children
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
