export type UserRole = 'OWNER' | 'REPAIRER' | 'BUYER' | 'RECYCLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
}

export type ProductCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED' | 'IRREPARABLE';

export type LifecycleStatus = 
  | 'ACTIVE' 
  | 'IN_REPAIR' 
  | 'RESOLD' 
  | 'IN_RECOVERY' 
  | 'COLLECTED' 
  | 'RECYCLED' 
  | 'END_OF_LIFE';

export type VerificationLevel = 'USER_REPORTED' | 'REPAIRER_VERIFIED' | 'DOCUMENT_VERIFIED';

export type LifecycleEventType = 
  | 'MANUFACTURED'
  | 'REGISTERED'
  | 'MAINTAINED'
  | 'REPAIR'
  | 'RESALE'
  | 'TRANSFER'
  | 'RECOVERY'
  | 'END_OF_LIFE';

export interface LifecycleEvent {
  id: string;
  productId: string;
  eventType: LifecycleEventType;
  title: string;
  description: string;
  timestamp: string;
  verified: boolean;
  verificationLevel: VerificationLevel;
  actorName: string;
  actorRole: UserRole;
  cost?: number;
  partsReplaced?: string[];
  documentUrl?: string;
  documentName?: string;
}

export type ProductType = 
  | 'Smartphone' 
  | 'Laptop' 
  | 'Tablet' 
  | 'Smartwatch' 
  | 'Television' 
  | 'Refrigerator' 
  | 'Washing Machine' 
  | 'Bicycle' 
  | 'Audio'
  | 'Wearable'
  | 'Other';

export interface Product {
  id: string;
  productId: string; // e.g. RP-DL-72891
  brand: string;
  model: string;
  category: ProductType;
  serialNumber: string; // IMEI or Serial Number
  identifierType?: 'IMEI' | 'SERIAL_NUMBER' | 'MODEL_IDENTIFIER' | 'FRAME_NUMBER';
  purchaseDate: string;
  manufactureDate?: string;
  invoiceName?: string;
  invoiceUrl?: string;
  condition: ProductCondition;
  warranty: string;
  repairabilityScore: number; // 1-10
  estimatedResaleMin: number;
  estimatedResaleMax: number;
  lifecycleStatus: LifecycleStatus;
  ownerId: string;
  ownerName: string; // Shown only to owner or admin
  image: string;
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    batteryHealth?: string;
    display?: string;
    color?: string;
  };
  repairCount: number;
  verifiedRepairsCount: number;
  createdAt: string;
  notes?: string;
  deviceCatalogId?: string;
  modelNumber?: string;
  imeiHash?: string;
  maskedImei?: string;
  repathProductId?: string;
  qrCode?: string;
  source?: string;
}

export interface RepairRecord {
  id: string;
  productId: string;
  repairerId: string;
  repairerName: string;
  problem: string;
  repairAction: string;
  partsReplaced: string[];
  cost: number;
  date: string;
  verificationLevel: VerificationLevel;
  invoiceUrl?: string;
  notes?: string;
}

export interface RepairRequest {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  customerId: string;
  customerName: string;
  repairerId: string;
  repairerName: string;
  issue: string;
  description: string;
  preferredDate: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'IN_REPAIR' | 'COMPLETED' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  quoteAmount?: number;
  completedDetails?: {
    workDone: string;
    partsUsed: string[];
    finalCost: number;
    completedAt: string;
    invoiceName?: string;
  };
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface RepairReview {
  id: string;
  repairerId: string;
  ownerId: string;
  ownerName: string;
  repairRequestId?: string;
  rating: number;
  review: string;
  verified: boolean;
  createdAt: string;
}

export interface Repairer {
  id: string;
  userId?: string;
  name: string; // Shop Name (e.g. TechFix)
  ownerName: string;
  specialty: string;
  category: string[];
  distanceKm: number;
  verified: boolean;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  completedRepairs: number;
  location: string;
  address?: string;
  city: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  experienceYears: number;
  openingHours: string;
  availability: 'OPEN' | 'BUSY' | 'CLOSED';
  description: string;
  services: string[];
  specializations: string[];
  issueTypes: string[];
  hourlyRate: number;
  avatar: string; // Shop Photo URL
  responseTime: string;
  phone: string;
  email: string;
  certifications: string[];
  createdAt?: string;
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  compatibleModels: string[];
  type: 'ORIGINAL' | 'COMPATIBLE';
  source: string;
  availability: 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
  price: number;
  verified: boolean;
  lastUpdated: string;
  warrantyMonths: number;
  image?: string;
}

export interface ResaleListing {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  brand: string;
  model: string;
  condition: ProductCondition;
  age: string;
  repairCount: number;
  verifiedRepairsCount: number;
  askingPrice: number;
  originalPrice: number;
  description: string;
  accessories: string[];
  images: string[];
  sellerId: string;
  sellerName: string;
  status: 'ACTIVE' | 'PENDING' | 'SOLD';
  createdAt: string;
  hasPassport: boolean;
  batteryHealth?: string;
}

export interface RecoveryPartner {
  id: string;
  name: string;
  type: 'E_WASTE' | 'MATERIAL_RECOVERY' | 'PARTS_HARVEST';
  typeLabel: string;
  distanceKm: number;
  verified: boolean;
  pickupAvailable: boolean;
  rating: number;
  location: string;
  acceptedCategories: string[];
  description: string;
}

export interface RecoveryRequest {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  partnerId: string;
  partnerName: string;
  recoveryType: 'SELL_FOR_PARTS' | 'MATERIAL_RECOVERY' | 'E_WASTE_RECYCLING';
  condition: string;
  estimatedValue: number;
  pickupAddress: string;
  pickupDate: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'COLLECTED' | 'VERIFIED';
  createdAt: string;
  notes?: string;
  proofUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'repair' | 'verification' | 'transfer' | 'recovery' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface NextPathOption {
  type: 'REPAIR' | 'RESELL' | 'RECOVER' | 'RECYCLE';
  title: string;
  costEstimate?: string;
  valueEstimate?: string;
  remainingLife?: string;
  pros: string[];
  cons: string[];
  actionLabel: string;
  actionRoute: string;
  confidence: number;
  recommended: boolean;
}

export interface AIAssessmentResponse {
  productModel: string;
  possibleIssue: string;
  confidenceScore: number; // 0 - 100
  repairability: 'HIGH' | 'MEDIUM' | 'LOW';
  professionalInspection: 'RECOMMENDED' | 'OPTIONAL' | 'SELF_SERVICE';
  partAvailability: 'AVAILABLE' | 'SCARCE' | 'UNAVAILABLE';
  diagnosticSummary: string;
  repairEstimateAmount: number;
  replacementCostAmount: number;
  potentialRemainingLife: string;
  paths: NextPathOption[];
}
