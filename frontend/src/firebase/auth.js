import { auth, db } from "./firebase";
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";



export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user) //(save user info in firestore for that can simply use result.user property)
    if(result.user){
        await setDoc(doc(db,"Users",result.user.uid), {
            email: result.user.email,
            userName: result.user.displayName,
        });
    }
    return result
};

export const doSignInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user) //(save user info in firestore for that can simply use result.user property)
    if(result.user){
        await setDoc(doc(db,"Users",result.user.uid), {
            email: result.user.email,
            userName: result.user.displayName,
        });
    }
    return result
};

export const doSignInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user) //(save user info in firestore for that can simply use result.user property)
    if(result.user){
        await setDoc(doc(db,"Users",result.user.uid), {
            email: result.user.email,
            userName: result.user.displayName,
        });
    }
    return result
};


