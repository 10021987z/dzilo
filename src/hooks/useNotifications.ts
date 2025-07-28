import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'hr' | 'admin' | 'commercial' | 'system' | 'security';
  category: 'conge' | 'contrat' | 'facture' | 'document' | 'formation' | 'alerte' | 'info';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  urgent: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    entityId?: string;
    entityType?: string;
    amount?: number;
    dueDate?: Date;
  };
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Écouter les notifications en temps réel
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          readAt: data.readAt?.toDate(),
          metadata: {
            ...data.metadata,
            dueDate: data.metadata?.dueDate?.toDate()
          }
        } as Notification);
      });

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      setLoading(false);
    }, (error) => {
      console.error('Erreur lors de la récupération des notifications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      toast.error('Erreur lors du marquage de la notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const promises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
          readAt: Timestamp.now()
        })
      );

      await Promise.all(promises);
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
      toast.error('Erreur lors du marquage des notifications');
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.now(),
        metadata: {
          ...notification.metadata,
          dueDate: notification.metadata?.dueDate ? Timestamp.fromDate(notification.metadata.dueDate) : undefined
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  };

  const getUrgentNotifications = () => {
    return notifications.filter(n => n.urgent && !n.read);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'hr': return '👥';
      case 'admin': return '⚙️';
      case 'commercial': return '💼';
      case 'system': return '🔧';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    getNotificationsByType,
    getUrgentNotifications,
    getNotificationIcon,
    getNotificationColor
  };
};

// Fonctions utilitaires pour créer des notifications prédéfinies
export const createHRNotification = (userId: string, type: 'conge_valide' | 'conge_refuse' | 'nouveau_contrat', data: any) => {
  const notifications = {
    conge_valide: {
      type: 'hr' as const,
      category: 'conge' as const,
      title: 'Congé validé',
      message: `Votre demande de congé du ${data.startDate} au ${data.endDate} a été approuvée.`,
      urgent: false
    },
    conge_refuse: {
      type: 'hr' as const,
      category: 'conge' as const,
      title: 'Congé refusé',
      message: `Votre demande de congé du ${data.startDate} au ${data.endDate} a été refusée. Motif: ${data.reason}`,
      urgent: true
    },
    nouveau_contrat: {
      type: 'hr' as const,
      category: 'contrat' as const,
      title: 'Nouveau contrat signé',
      message: `Le contrat de ${data.employeeName} a été signé et est maintenant actif.`,
      urgent: false
    }
  };

  return {
    ...notifications[type],
    userId,
    read: false
  };
};

export const createAdminNotification = (userId: string, type: 'echeance_fiscale' | 'document_expire' | 'facture_impayee', data: any) => {
  const notifications = {
    echeance_fiscale: {
      type: 'admin' as const,
      category: 'alerte' as const,
      title: 'Échéance fiscale à venir',
      message: `Une échéance fiscale de ${data.amount}€ arrive à échéance le ${data.dueDate}.`,
      urgent: true,
      metadata: { amount: data.amount, dueDate: new Date(data.dueDate) }
    },
    document_expire: {
      type: 'admin' as const,
      category: 'document' as const,
      title: 'Document expiré',
      message: `Le document "${data.documentName}" a expiré le ${data.expiryDate}.`,
      urgent: true
    },
    facture_impayee: {
      type: 'admin' as const,
      category: 'facture' as const,
      title: 'Facture impayée',
      message: `La facture ${data.invoiceNumber} de ${data.amount}€ est en retard de paiement.`,
      urgent: true,
      metadata: { amount: data.amount, entityId: data.invoiceId }
    }
  };

  return {
    ...notifications[type],
    userId,
    read: false
  };
};