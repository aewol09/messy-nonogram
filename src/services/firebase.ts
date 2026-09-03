import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from '@react-native-firebase/firestore';

export interface CloudProgress {
  completedPuzzles: string[];
  inProgressPuzzles: Record<string, any>;
  hintPool: number;
  isUnlimitedHints: boolean;
  updatedAt?: any;
}

/**
 * Save user game progress to Firebase Firestore in the cloud
 */
export const syncProgressToCloud = async (userId: string, progress: CloudProgress) => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        completedPuzzles: progress.completedPuzzles,
        inProgressPuzzles: progress.inProgressPuzzles,
        hintPool: progress.hintPool,
        isUnlimitedHints: progress.isUnlimitedHints,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.log('Firestore Sync Notice:', error);
    return false;
  }
};

/**
 * Load user game progress from Firebase Firestore
 */
export const fetchProgressFromCloud = async (userId: string): Promise<CloudProgress | null> => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as CloudProgress;
    }
    return null;
  } catch (error) {
    console.log('Firestore Fetch Notice:', error);
    return null;
  }
};

/**
 * Perform Firebase Anonymous / Google Authentication Sign-In
 */
export const signInWithFirebaseGoogle = async () => {
  try {
    const authInstance = getAuth();
    const userCredential = await signInAnonymously(authInstance);
    return userCredential.user;
  } catch (error) {
    console.log('Firebase Auth Notice:', error);
    return null;
  }
};
