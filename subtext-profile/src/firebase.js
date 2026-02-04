import { initializeApp } from "firebase/app"
import { getAuth, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtZKxIqj_F1repSeHoCT0IEC5YcqwpV2w",
  authDomain: "subtext-profile.firebaseapp.com",
  projectId: "subtext-profile",
  storageBucket: "subtext-profile.firebasestorage.app",
  messagingSenderId: "785356388581",
  appId: "1:785356388581:web:57d1652a3f9e920b4a7c0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GithubAuthProvider();

// Request permissions
// 'read:user' - profile info
// 'repo:status' - public repo data
provider.addScope('read:user');
provider.addScope('repo:status');

export const signInWithGitHub = async () => {
    try {
        const result = await signInWithPopup(auth, provider);

        // Extract Github Token
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; 
        const user = result.user;
        
        return { user, token };
    } catch (error) {
        console.error("Login Failed:", error);
        throw error;
    }
};

export const logout = () => signOut(auth);