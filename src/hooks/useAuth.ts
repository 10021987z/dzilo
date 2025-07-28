import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, googleProvider, db, storage } from '../config/firebase';
import toast from 'react-hot-toast';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'hr' | 'commercial' | 'comptable' | 'employee';
  department: string;
  createdAt: Date;
  lastLogin: Date;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Récupérer le profil utilisateur depuis Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Créer un profil par défaut pour les nouveaux utilisateurs
            const defaultProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Utilisateur',
              photoURL: user.photoURL || undefined,
              role: 'employee',
              department: 'Non assigné',
              createdAt: new Date(),
              lastLogin: new Date(),
              preferences: {
                language: 'fr',
                theme: 'light',
                notifications: true
              }
            };
            
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          setError('Erreur lors de la récupération du profil utilisateur');
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour la dernière connexion
      if (result.user) {
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }
      
      toast.success('Connexion réussie !');
      return result;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil
      await updateProfile(result.user, { displayName });
      
      // Créer le document utilisateur dans Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName,
        role: 'employee',
        department: 'Non assigné',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          language: 'fr',
          theme: 'light',
          notifications: true
        }
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      
      toast.success('Compte créé avec succès !');
      return result;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Vérifier si l'utilisateur existe déjà
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Créer le profil pour les nouveaux utilisateurs Google
        const userProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Utilisateur',
          photoURL: result.user.photoURL || undefined,
          role: 'employee',
          department: 'Non assigné',
          createdAt: new Date(),
          lastLogin: new Date(),
          preferences: {
            language: 'fr',
            theme: 'light',
            notifications: true
          }
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
      } else {
        // Mettre à jour la dernière connexion
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }
      
      toast.success('Connexion avec Google réussie !');
      return result;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de réinitialisation envoyé !');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie !');
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Ensure user is authenticated
      if (!user.uid) {
        throw new Error('User not authenticated');
      }
      
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profil mis à jour !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Créer une référence unique pour l'image
      const imageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}_${file.name}`);
      
      // Télécharger le fichier
      const snapshot = await uploadBytes(imageRef, file);
      
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Mettre à jour le profil utilisateur avec la nouvelle URL
      await updateUserProfile({ photoURL: downloadURL });
      
      // Mettre à jour aussi le profil Firebase Auth
      await updateProfile(user, { photoURL: downloadURL });
      
      toast.success('Photo de profil mise à jour !');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      throw error;
    }
  };

  const deleteProfileImage = async () => {
    if (!user || !userProfile?.photoURL) return;

    try {
      // Supprimer l'ancienne image si elle existe
      if (userProfile.photoURL.includes('firebase')) {
        const imageRef = ref(storage, userProfile.photoURL);
        await deleteObject(imageRef);
      }
      
      // Mettre à jour le profil
      await updateUserProfile({ photoURL: undefined });
      await updateProfile(user, { photoURL: null });
      
      toast.success('Photo de profil supprimée !');
    } catch (error) {
      console.error('Error deleting profile image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
      throw error;
    }
  };
  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    updateUserProfile,
    uploadProfileImage,
    deleteProfileImage
  };
};

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Aucun utilisateur trouvé avec cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères';
    case 'auth/invalid-email':
      return 'Format d\'email invalide';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard';
    default:
      return 'Une erreur est survenue';
  }
};