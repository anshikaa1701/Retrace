import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Product, 
  LifecycleEvent, 
  Repairer, 
  RepairReview,
  SparePart, 
  RecoveryPartner, 
  ResaleListing, 
  RepairRequest, 
  RecoveryRequest, 
  AppNotification 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_LIFECYCLE_EVENTS, 
  INITIAL_REPAIRERS, 
  INITIAL_REPAIR_REVIEWS,
  INITIAL_SPARE_PARTS, 
  INITIAL_RECOVERY_PARTNERS, 
  INITIAL_RESALE_LISTINGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  
  products: Product[];
  getProduct: (idOrCode: string) => Product | undefined;
  getProductEvents: (productCode: string) => LifecycleEvent[];
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'repairCount' | 'verifiedRepairsCount'>) => string;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  
  lifecycleEvents: LifecycleEvent[];
  addLifecycleEvent: (event: Omit<LifecycleEvent, 'id'>) => void;
  
  repairers: Repairer[];
  getTopRepairers: (limit?: number) => Repairer[];
  getRepairer: (id: string) => Repairer | undefined;
  addRepairShop: (shopData: Omit<Repairer, 'id' | 'rating' | 'reviewCount' | 'completedRepairs' | 'verified' | 'verificationStatus' | 'createdAt'>) => string;
  updateRepairShop: (id: string, updates: Partial<Repairer>) => void;
  verifyRepairerShop: (repairerId: string, status: 'VERIFIED' | 'REJECTED') => void;

  repairReviews: RepairReview[];
  getRepairerReviews: (repairerId: string) => RepairReview[];
  addRepairReview: (reviewData: Omit<RepairReview, 'id' | 'createdAt'>) => void;

  spareParts: SparePart[];
  recoveryPartners: RecoveryPartner[];
  
  resaleListings: ResaleListing[];
  createResaleListing: (listing: Omit<ResaleListing, 'id' | 'createdAt' | 'status'>) => string;
  
  repairRequests: RepairRequest[];
  createRepairRequest: (request: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => string;
  acceptRepairRequest: (requestId: string) => void;
  declineRepairRequest: (requestId: string) => void;
  completeRepair: (requestId: string, details: { workDone: string; partsUsed: string[]; finalCost: number; invoiceName?: string }) => void;
  verifyRepair: (requestId: string, invoiceName?: string) => void;
  
  recoveryRequests: RecoveryRequest[];
  createRecoveryRequest: (request: Omit<RecoveryRequest, 'id' | 'createdAt' | 'status'>) => string;
  acceptRecoveryPickup: (requestId: string) => void;
  verifyRecovery: (requestId: string, proofDocName?: string) => void;
  
  transferOwnership: (productCode: string, recipientEmail: string, recipientName: string) => boolean;
  
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('retrace_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default Avi Sharma (Owner)
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('retrace_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [lifecycleEvents, setLifecycleEvents] = useState<LifecycleEvent[]>(() => {
    const saved = localStorage.getItem('retrace_lifecycle_events');
    return saved ? JSON.parse(saved) : INITIAL_LIFECYCLE_EVENTS;
  });

  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>(() => {
    const saved = localStorage.getItem('retrace_repair_requests');
    if (saved) return JSON.parse(saved);
    // Seed an initial pending request for the demo
    return [
      {
        id: 'req-init-1',
        productId: 'prod-dell-72891',
        productName: 'Dell Inspiron 15 5000',
        productCode: 'RP-DL-72891',
        customerId: 'user-avi',
        customerName: 'Avi Sharma',
        repairerId: 'rep-techfix',
        repairerName: 'TechFix Solutions',
        issue: 'Thermal Management & Fan Rattle',
        description: 'Machine overheats during moderate workload, shutting down automatically after 15 minutes of use.',
        preferredDate: '2026-09-28',
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
        quoteAmount: 3000
      }
    ];
  });

  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>(() => {
    const saved = localStorage.getItem('retrace_recovery_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rec-req-1',
        productId: 'prod-hp-19830',
        productName: 'HP Pavilion Aero 13',
        productCode: 'RP-HP-19830',
        partnerId: 'rec-greencycle',
        partnerName: 'GreenCycle Circular Hub',
        recoveryType: 'E_WASTE_RECYCLING',
        condition: 'Irreparable motherboard liquid damage',
        estimatedValue: 800,
        pickupAddress: 'Indiranagar 100ft Rd, Bangalore 560038',
        pickupDate: '2026-09-26',
        status: 'REQUESTED',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  const [resaleListings, setResaleListings] = useState<ResaleListing[]>(() => {
    const saved = localStorage.getItem('retrace_resale_listings');
    return saved ? JSON.parse(saved) : INITIAL_RESALE_LISTINGS;
  });

  const [repairers, setRepairers] = useState<Repairer[]>(() => {
    const saved = localStorage.getItem('retrace_repairers');
    return saved ? JSON.parse(saved) : INITIAL_REPAIRERS;
  });

  const [repairReviews, setRepairReviews] = useState<RepairReview[]>(() => {
    const saved = localStorage.getItem('retrace_repair_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REPAIR_REVIEWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('retrace_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('retrace_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retrace_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('retrace_lifecycle_events', JSON.stringify(lifecycleEvents));
  }, [lifecycleEvents]);

  useEffect(() => {
    localStorage.setItem('retrace_repair_requests', JSON.stringify(repairRequests));
  }, [repairRequests]);

  useEffect(() => {
    localStorage.setItem('retrace_recovery_requests', JSON.stringify(recoveryRequests));
  }, [recoveryRequests]);

  useEffect(() => {
    localStorage.setItem('retrace_resale_listings', JSON.stringify(resaleListings));
  }, [resaleListings]);

  useEffect(() => {
    localStorage.setItem('retrace_repairers', JSON.stringify(repairers));
  }, [repairers]);

  useEffect(() => {
    localStorage.setItem('retrace_repair_reviews', JSON.stringify(repairReviews));
  }, [repairReviews]);

  useEffect(() => {
    localStorage.setItem('retrace_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Switch role between predefined demo accounts
  const switchRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      setCurrentUser({
        id: `user-${role.toLowerCase()}`,
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
        email: `${role.toLowerCase()}@retrace.io`,
        role
      });
    }
  };

  const getProduct = (idOrCode: string) => {
    if (!idOrCode) return undefined;
    const clean = idOrCode.trim().toUpperCase();
    return products.find(p => p.productId.toUpperCase() === clean || p.id === idOrCode);
  };

  const getProductEvents = (productCode: string) => {
    if (!productCode) return [];
    const clean = productCode.trim().toUpperCase();
    return lifecycleEvents
      .filter(e => e.productId.toUpperCase() === clean)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const addLifecycleEvent = (eventData: Omit<LifecycleEvent, 'id'>) => {
    const newEvent: LifecycleEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    setLifecycleEvents(prev => [newEvent, ...prev]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'repairCount' | 'verifiedRepairsCount'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      repairCount: 0,
      verifiedRepairsCount: 0,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);

    // Automatically mint initial lifecycle event
    const displayIdentifier = newProduct.maskedImei || (newProduct.category === 'Smartphone' && newProduct.serialNumber.length === 15 ? `••••••••••••${newProduct.serialNumber.slice(-4)}` : newProduct.serialNumber);
    addLifecycleEvent({
      productId: newProduct.productId,
      eventType: 'REGISTERED',
      title: 'Digital Passport Minted',
      description: `Initial product identity registered by ${currentUser.name}. Identifier: ${displayIdentifier}`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'USER_REPORTED',
      actorName: currentUser.name,
      actorRole: currentUser.role
    });

    addNotification({
      title: 'Product Passport Minted',
      message: `Passport created for ${newProduct.brand} ${newProduct.model} (${newProduct.productId}).`,
      type: 'system',
      link: `/passport/${newProduct.productId}`
    });

    return newProduct.productId;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id || p.productId === id ? { ...p, ...updates } : p));
  };

  const createRepairRequest = (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: RepairRequest = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'REQUESTED'
    };

    setRepairRequests(prev => [newReq, ...prev]);

    // Update product status
    updateProduct(req.productId, { lifecycleStatus: 'IN_REPAIR' });

    addNotification({
      title: 'Repair Request Submitted',
      message: `Request for ${req.productName} dispatched to ${req.repairerName}.`,
      type: 'repair',
      link: `/repair-requests`
    });

    return newReq.id;
  };

  const acceptRepairRequest = (requestId: string) => {
    setRepairRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r));
    const req = repairRequests.find(r => r.id === requestId);
    if (req) {
      addNotification({
        title: 'Repair Request Accepted',
        message: `${req.repairerName} accepted the diagnostic ticket for ${req.productName}.`,
        type: 'repair',
        link: `/passport/${req.productCode}`
      });
    }
  };

  const completeRepair = (requestId: string, details: { workDone: string; partsUsed: string[]; finalCost: number; invoiceName?: string }) => {
    setRepairRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'COMPLETED',
          completedDetails: {
            ...details,
            completedAt: new Date().toISOString()
          }
        };
      }
      return r;
    }));
  };

  const verifyRepair = (requestId: string, invoiceName = 'TechFix_Official_Repair_Verification_Invoice.pdf') => {
    const req = repairRequests.find(r => r.id === requestId);
    if (!req) return;

    // Update request state
    setRepairRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'VERIFIED' } : r));

    const workDone = req.completedDetails?.workDone || 'Precision Thermal Fan Assembly Replacement & System Stress Validation';
    const partsUsed = req.completedDetails?.partsUsed || ['Dell OEM Dual-Fan Assembly (DL-FAN-5510)', 'Arctic MX-6 Thermal Compound'];
    const finalCost = req.completedDetails?.finalCost || req.quoteAmount || 3000;

    // 1. Append verified event to product passport lifecycle timeline
    addLifecycleEvent({
      productId: req.productCode,
      eventType: 'REPAIR',
      title: 'Cooling System Replaced & Thermal Overhaul',
      description: `${workDone}. Bench burn-in test passed. Thermal throttle eliminated under 100% stress load.`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'REPAIRER_VERIFIED',
      actorName: req.repairerName || 'TechFix Solutions (Marcus Vance)',
      actorRole: 'REPAIRER',
      cost: finalCost,
      partsReplaced: partsUsed,
      documentName: invoiceName,
      documentUrl: '#'
    });

    // 2. Update product condition and increment verified repair count
    setProducts(prev => prev.map(p => {
      if (p.productId === req.productCode || p.id === req.productId) {
        return {
          ...p,
          condition: 'GOOD',
          lifecycleStatus: 'ACTIVE',
          repairCount: p.repairCount + 1,
          verifiedRepairsCount: p.verifiedRepairsCount + 1
        };
      }
      return p;
    }));

    // 3. Dispatch notification
    addNotification({
      title: '✓ Repair Verified & Passport Updated',
      message: `${req.repairerName} verified repair for ${req.productName}. New verification badge and certificate appended.`,
      type: 'verification',
      link: `/passport/${req.productCode}`
    });
  };

  const declineRepairRequest = (requestId: string) => {
    setRepairRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' } : r));
    const req = repairRequests.find(r => r.id === requestId);
    if (req) {
      addNotification({
        title: 'Repair Request Declined',
        message: `${req.repairerName} could not accommodate the ticket at this time.`,
        type: 'repair',
        link: `/passport/${req.productCode}`
      });
    }
  };

  const getTopRepairers = (limit = 5): Repairer[] => {
    // Dynamic ranking based on database rating + verified completed repairs + valid reviews count
    // Uses Bayesian prior (m=4.5, C=10) to avoid 1-review 5.0 dominating
    const priorRating = 4.5;
    const priorCount = 10;

    return [...repairers]
      .map(r => {
        const revs = repairReviews.filter(rev => rev.repairerId === r.id);
        const count = r.reviewCount || revs.length;
        const avg = r.rating || (revs.length > 0 ? revs.reduce((sum, rev) => sum + rev.rating, 0) / revs.length : 0);
        
        // Weighted rating
        const weightedRating = count > 0 
          ? (avg * count + priorRating * priorCount) / (count + priorCount)
          : 0;

        // Factor in number of verified/completed repairs
        const repairBonus = (r.completedRepairs || 0) * 0.005;

        // Verified repairers prioritized over pending
        const verificationMultiplier = r.verificationStatus === 'VERIFIED' ? 1.0 : (r.verificationStatus === 'PENDING' ? 0.05 : 0);

        const compositeScore = (weightedRating + repairBonus) * verificationMultiplier;
        return { repairer: r, score: compositeScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.repairer);
  };

  const getRepairer = (id: string): Repairer | undefined => {
    if (!id) return undefined;
    return repairers.find(r => r.id === id || r.id === `rep-${id}`);
  };

  const addRepairShop = (shopData: Omit<Repairer, 'id' | 'rating' | 'reviewCount' | 'completedRepairs' | 'verified' | 'verificationStatus' | 'createdAt'>): string => {
    const newId = `rep-${Date.now()}`;
    const newShop: Repairer = {
      ...shopData,
      id: newId,
      rating: 0,
      reviewCount: 0,
      completedRepairs: 0,
      verified: false,
      verificationStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setRepairers(prev => [newShop, ...prev]);

    addNotification({
      title: 'Repair Shop Registered',
      message: `${newShop.name} registration submitted. Current status: PENDING VERIFICATION.`,
      type: 'verification',
      link: `/repairers/${newId}`
    });

    return newId;
  };

  const updateRepairShop = (id: string, updates: Partial<Repairer>) => {
    setRepairers(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const verifyRepairerShop = (repairerId: string, status: 'VERIFIED' | 'REJECTED') => {
    setRepairers(prev => prev.map(r => {
      if (r.id === repairerId) {
        return {
          ...r,
          verificationStatus: status,
          verified: status === 'VERIFIED'
        };
      }
      return r;
    }));

    const shop = repairers.find(r => r.id === repairerId);
    if (shop) {
      addNotification({
        title: status === 'VERIFIED' ? '✓ Repair Shop Verified' : 'Registration Declined',
        message: `${shop.name} has been ${status === 'VERIFIED' ? 'approved with ReTrace Verified status' : 'rejected'}.`,
        type: 'verification',
        link: `/repairers/${repairerId}`
      });
    }
  };

  const getRepairerReviews = (repairerId: string): RepairReview[] => {
    return repairReviews
      .filter(rev => rev.repairerId === repairerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addRepairReview = (reviewData: Omit<RepairReview, 'id' | 'createdAt'>) => {
    const newReview: RepairReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setRepairReviews(prev => [newReview, ...prev]);

    // Recalculate average rating for that repairer
    setRepairers(prev => prev.map(r => {
      if (r.id === reviewData.repairerId) {
        const existing = repairReviews.filter(rev => rev.repairerId === r.id);
        const all = [newReview, ...existing];
        const newCount = all.length;
        const newAvg = Number((all.reduce((s, rev) => s + rev.rating, 0) / newCount).toFixed(1));
        return {
          ...r,
          rating: newAvg,
          reviewCount: newCount,
          completedRepairs: (r.completedRepairs || 0) + 1
        };
      }
      return r;
    }));

    addNotification({
      title: 'Review Verified & Submitted',
      message: `Rating of ${reviewData.rating}★ added. Repairer database rank refreshed automatically.`,
      type: 'verification',
      link: `/repairers/${reviewData.repairerId}`
    });
  };

  const createResaleListing = (listing: Omit<ResaleListing, 'id' | 'createdAt' | 'status'>) => {
    const newListing: ResaleListing = {
      ...listing,
      id: `resale-${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    setResaleListings(prev => [newListing, ...prev]);

    addLifecycleEvent({
      productId: listing.productCode,
      eventType: 'RESALE',
      title: 'Listed on Circular Resale Marketplace',
      description: `Listed for ₹${listing.askingPrice.toLocaleString('en-IN')} with digital passport attached.`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'USER_REPORTED',
      actorName: currentUser.name,
      actorRole: currentUser.role
    });

    addNotification({
      title: 'Marketplace Listing Active',
      message: `${listing.productName} is now live on ReTrace Resale with verified passport.`,
      type: 'system',
      link: '/resale'
    });

    return newListing.id;
  };

  const createRecoveryRequest = (req: Omit<RecoveryRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: RecoveryRequest = {
      ...req,
      id: `rec-req-${Date.now()}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString()
    };
    setRecoveryRequests(prev => [newReq, ...prev]);

    updateProduct(req.productId, { lifecycleStatus: 'IN_RECOVERY' });

    addLifecycleEvent({
      productId: req.productCode,
      eventType: 'RECOVERY',
      title: 'Recovery Pickup Dispatched',
      description: `Dispatched to ${req.partnerName} for ${req.recoveryType.replace(/_/g, ' ')}. Estimated value: ₹${req.estimatedValue}.`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'USER_REPORTED',
      actorName: currentUser.name,
      actorRole: currentUser.role
    });

    addNotification({
      title: 'Recovery Scheduled',
      message: `Pickup scheduled with ${req.partnerName} for ${req.productName}.`,
      type: 'recovery',
      link: '/recovery'
    });

    return newReq.id;
  };

  const acceptRecoveryPickup = (requestId: string) => {
    setRecoveryRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' } : r));
    const req = recoveryRequests.find(r => r.id === requestId);
    if (req) {
      addNotification({
        title: 'Recovery Pickup Accepted',
        message: `${req.partnerName} confirmed courier dispatch for ${req.productName}.`,
        type: 'recovery',
        link: '/recovery'
      });
    }
  };

  const verifyRecovery = (requestId: string, proofDocName = 'GreenCycle_Destruction_And_Smelt_Certificate_R2v3.pdf') => {
    const req = recoveryRequests.find(r => r.id === requestId);
    if (!req) return;

    setRecoveryRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'VERIFIED', proofUrl: '#' } : r));

    // Update product to END_OF_LIFE / RECYCLED
    setProducts(prev => prev.map(p => {
      if (p.productId === req.productCode || p.id === req.productId) {
        return {
          ...p,
          lifecycleStatus: 'END_OF_LIFE',
          condition: 'IRREPARABLE'
        };
      }
      return p;
    }));

    // Add End of Life event
    addLifecycleEvent({
      productId: req.productCode,
      eventType: 'END_OF_LIFE',
      title: 'End of Life: R2v3 Smelted & Materials Extracted',
      description: `Zero-landfill closed loop verified by ${req.partnerName}. Gold, copper, and silicon successfully recovered. Certificate of Destruction minted.`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'DOCUMENT_VERIFIED',
      actorName: req.partnerName,
      actorRole: 'RECYCLER',
      documentName: proofDocName,
      documentUrl: '#'
    });

    addNotification({
      title: 'End-of-Life Certified',
      message: `Final circular lifecycle certificate generated for ${req.productName}.`,
      type: 'verification',
      link: `/passport/${req.productCode}`
    });
  };

  const transferOwnership = (productCode: string, recipientEmail: string, recipientName: string) => {
    const clean = productCode.trim().toUpperCase();
    const product = products.find(p => p.productId.toUpperCase() === clean);
    if (!product) return false;

    // Update owner
    setProducts(prev => prev.map(p => {
      if (p.productId.toUpperCase() === clean) {
        return {
          ...p,
          ownerId: `user-${Date.now()}`,
          ownerName: recipientName
        };
      }
      return p;
    }));

    // Add event
    addLifecycleEvent({
      productId: clean,
      eventType: 'TRANSFER',
      title: 'Ownership Transferred Cryptographically',
      description: `Ownership transferred from ${currentUser.name} to ${recipientName} (${recipientEmail}). Historical maintenance trail preserved intact.`,
      timestamp: new Date().toISOString(),
      verified: true,
      verificationLevel: 'DOCUMENT_VERIFIED',
      actorName: 'ReTrace Protocol Escrow',
      actorRole: 'ADMIN'
    });

    addNotification({
      title: 'Ownership Transfer Complete',
      message: `Digital passport for ${product.brand} ${product.model} transferred to ${recipientName}.`,
      type: 'transfer',
      link: `/passport/${clean}`
    });

    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setProducts(INITIAL_PRODUCTS);
    setLifecycleEvents(INITIAL_LIFECYCLE_EVENTS);
    setResaleListings(INITIAL_RESALE_LISTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setRepairRequests([
      {
        id: 'req-init-1',
        productId: 'prod-dell-72891',
        productName: 'Dell Inspiron 15 5000',
        productCode: 'RP-DL-72891',
        customerId: 'user-avi',
        customerName: 'Avi Sharma',
        repairerId: 'rep-techfix',
        repairerName: 'TechFix Solutions',
        issue: 'Thermal Management & Fan Rattle',
        description: 'Machine overheats during moderate workload, shutting down automatically after 15 minutes of use.',
        preferredDate: '2026-09-28',
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
        quoteAmount: 3000
      }
    ]);
    setRecoveryRequests([
      {
        id: 'rec-req-1',
        productId: 'prod-hp-19830',
        productName: 'HP Pavilion Aero 13',
        productCode: 'RP-HP-19830',
        partnerId: 'rec-greencycle',
        partnerName: 'GreenCycle Circular Hub',
        recoveryType: 'E_WASTE_RECYCLING',
        condition: 'Irreparable motherboard liquid damage',
        estimatedValue: 800,
        pickupAddress: 'Indiranagar 100ft Rd, Bangalore 560038',
        pickupDate: '2026-09-26',
        status: 'REQUESTED',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
    setRepairers(INITIAL_REPAIRERS);
    setRepairReviews(INITIAL_REPAIR_REVIEWS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users: INITIAL_USERS,
        products,
        getProduct,
        getProductEvents,
        createProduct,
        updateProduct,
        lifecycleEvents,
        addLifecycleEvent,
        repairers,
        getTopRepairers,
        getRepairer,
        addRepairShop,
        updateRepairShop,
        verifyRepairerShop,
        repairReviews,
        getRepairerReviews,
        addRepairReview,
        spareParts: INITIAL_SPARE_PARTS,
        recoveryPartners: INITIAL_RECOVERY_PARTNERS,
        resaleListings,
        createResaleListing,
        repairRequests,
        createRepairRequest,
        acceptRepairRequest,
        declineRepairRequest,
        completeRepair,
        verifyRepair,
        recoveryRequests,
        createRecoveryRequest,
        acceptRecoveryPickup,
        verifyRecovery,
        transferOwnership,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
