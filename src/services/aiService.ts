import { Product, LifecycleEvent, AIAssessmentResponse, NextPathOption } from '../types';

export interface AIServiceConfig {
  apiKey?: string;
  provider?: 'local-heuristic' | 'gemini' | 'openai';
}

class AIService {
  private config: AIServiceConfig = {
    provider: 'local-heuristic'
  };

  public setConfig(config: AIServiceConfig) {
    this.config = { ...this.config, ...config };
  }

  public async assessProductIssue(
    product: Product,
    symptoms: string,
    history: LifecycleEvent[] = []
  ): Promise<AIAssessmentResponse> {
    // Artificial latency for authentic tech feel
    await new Promise((resolve) => setTimeout(resolve, 900));

    const symLower = symptoms.toLowerCase();
    
    // Check for thermal / overheating (Primary Hackathon Demo Flow)
    if (symLower.includes('overheat') || symLower.includes('shutting down') || symLower.includes('thermal') || symLower.includes('fan') || symLower.includes('hot')) {
      const paths: NextPathOption[] = [
        {
          type: 'REPAIR',
          title: 'Precision Thermal Overhaul & Fan Replacement',
          costEstimate: '₹3,000',
          remainingLife: '2–3 years',
          pros: [
            'Keeps machine in prime active service',
            'Saves ~82% compared to purchasing equivalent replacement laptop',
            'Prevents ~280kg CO2e embodied hardware emissions',
            'Preserves current software licenses and local development environment'
          ],
          cons: [
            'Requires 1–2 days bench inspection and ultrasonic heatsink cleaning'
          ],
          actionLabel: 'Find Verified Repairer',
          actionRoute: '/repairers',
          confidence: 94,
          recommended: true
        },
        {
          type: 'RESELL',
          title: 'Certified Circular Resale with Digital Passport',
          valueEstimate: '₹9,000 – ₹11,000',
          remainingLife: 'Secondary Owner (2+ years)',
          pros: [
            'Liquidates machine value into cash for next upgrade',
            'Verified ReTrace passport guarantees historical transparency to buyers'
          ],
          cons: [
            'Selling with unresolved thermal shutdown will trigger price penalty',
            'Buying a new comparable laptop requires ~₹45,000–₹65,000 outlay'
          ],
          actionLabel: 'Estimate Resale Value',
          actionRoute: '/resale',
          confidence: 78,
          recommended: false
        },
        {
          type: 'RECOVER',
          title: 'Modular Component Harvest',
          valueEstimate: '₹2,000 – ₹3,500',
          remainingLife: 'Spare component harvest',
          pros: [
            'Fast harvest of 16GB DDR4 RAM, 512GB NVMe SSD, and 15.6" FHD IPS Panel'
          ],
          cons: [
            'Prematurely scraps an otherwise healthy motherboard and processor'
          ],
          actionLabel: 'Explore Parts Recovery',
          actionRoute: '/recovery',
          confidence: 45,
          recommended: false
        },
        {
          type: 'RECYCLE',
          title: 'Responsible E-Waste Smelting & Rare-Earth Recovery',
          valueEstimate: '₹500 – ₹800 (Scrap value)',
          remainingLife: 'Zero-landfill closed loop',
          pros: [
            'Certified R2v3 destruction certificate & toxic material neutralisation'
          ],
          cons: [
            'Lowest economic return; only advised if motherboard PCB has burned layers'
          ],
          actionLabel: 'Find Recycler',
          actionRoute: '/recovery',
          confidence: 20,
          recommended: false
        }
      ];

      return {
        productModel: `${product.brand} ${product.model}`,
        possibleIssue: 'Cooling / Thermal Management Degradation & Fan RPM Fault',
        confidenceScore: 92,
        repairability: 'HIGH',
        professionalInspection: 'RECOMMENDED',
        partAvailability: 'AVAILABLE',
        diagnosticSummary: `Cross-referencing the ${product.brand} ${product.model} hardware profile and reported symptoms indicates thermal throttling inducing safety power-off. While thermal re-pasting was recorded in 2026, the dual-fan assembly or heat-pipe vacuum seal is likely degraded. OEM fan parts (DL-FAN-5510) and thermal interface compounds are immediately available locally.`,
        repairEstimateAmount: 3000,
        replacementCostAmount: 15000,
        potentialRemainingLife: '2–3 years',
        paths
      };
    }

    // Battery / Power issues
    if (symLower.includes('battery') || symLower.includes('drain') || symLower.includes('charge') || symLower.includes('power')) {
      return {
        productModel: `${product.brand} ${product.model}`,
        possibleIssue: 'Battery Cell Degradation & Power Management System',
        confidenceScore: 88,
        repairability: 'HIGH',
        professionalInspection: 'RECOMMENDED',
        partAvailability: 'AVAILABLE',
        diagnosticSummary: `Internal telemetry indicates reduced charge density and elevated internal resistance. A battery cell swap restores 100% mobility.`,
        repairEstimateAmount: 3400,
        replacementCostAmount: 16000,
        potentialRemainingLife: '2–4 years',
        paths: [
          {
            type: 'REPAIR',
            title: 'OEM Battery Pack Replacement',
            costEstimate: '₹3,400',
            remainingLife: '3+ years',
            pros: ['Restores OEM battery life', 'Immediate 100% capacity'],
            cons: ['Requires genuine certified battery source'],
            actionLabel: 'Find Repairer',
            actionRoute: '/repairers',
            confidence: 90,
            recommended: true
          },
          {
            type: 'RESELL',
            title: 'Resell Device as Secondary System',
            valueEstimate: '₹8,000',
            remainingLife: '2+ years',
            pros: ['Immediate cash value'],
            cons: ['Lower resale price with degraded battery'],
            actionLabel: 'View Resale Range',
            actionRoute: '/resale',
            confidence: 70,
            recommended: false
          },
          {
            type: 'RECOVER',
            title: 'Component Recovery',
            valueEstimate: '₹2,500',
            remainingLife: 'N/A',
            pros: ['Useful for spare screen and motherboard'],
            cons: ['Sub-optimal value'],
            actionLabel: 'Check Recovery',
            actionRoute: '/recovery',
            confidence: 40,
            recommended: false
          },
          {
            type: 'RECYCLE',
            title: 'Hazardous Battery Recycling',
            valueEstimate: '₹400',
            remainingLife: '0',
            pros: ['Safe disposal of lithium cells'],
            cons: ['Device is still functional on AC power'],
            actionLabel: 'Find Recycler',
            actionRoute: '/recovery',
            confidence: 25,
            recommended: false
          }
        ]
      };
    }

    // Screen / Display issues
    if (symLower.includes('screen') || symLower.includes('display') || symLower.includes('flicker') || symLower.includes('cracked') || symLower.includes('line')) {
      return {
        productModel: `${product.brand} ${product.model}`,
        possibleIssue: 'Display Panel Damage / EDP Ribbon Cable Failure',
        confidenceScore: 89,
        repairability: 'HIGH',
        professionalInspection: 'RECOMMENDED',
        partAvailability: 'AVAILABLE',
        diagnosticSummary: `Display module replacement or EDP cable reseating will resolve visual artifacts without replacing core computational components.`,
        repairEstimateAmount: 4500,
        replacementCostAmount: 15000,
        potentialRemainingLife: '2–3 years',
        paths: [
          {
            type: 'REPAIR',
            title: 'FHD IPS Panel Replacement',
            costEstimate: '₹4,500',
            remainingLife: '3 years',
            pros: ['Restores crystal clear display', 'Keeps all files and software intact'],
            cons: ['Slightly higher part cost than fan/battery'],
            actionLabel: 'Find Screen Specialist',
            actionRoute: '/repairers',
            confidence: 88,
            recommended: true
          },
          {
            type: 'RESELL',
            title: 'Sell for Refurbishment',
            valueEstimate: '₹6,000',
            remainingLife: 'Refurbished life',
            pros: ['Quick cash without paying for repair'],
            cons: ['Heavily discounted due to cracked screen'],
            actionLabel: 'Resale Marketplace',
            actionRoute: '/resale',
            confidence: 65,
            recommended: false
          },
          {
            type: 'RECOVER',
            title: 'Motherboard & RAM Extraction',
            valueEstimate: '₹3,000',
            remainingLife: 'Harvest',
            pros: ['Salvages pristine logic board'],
            cons: ['Disassembles good computer'],
            actionLabel: 'Recover',
            actionRoute: '/recovery',
            confidence: 50,
            recommended: false
          },
          {
            type: 'RECYCLE',
            title: 'Electronic Glass Reclamation',
            valueEstimate: '₹600',
            remainingLife: 'Circular material',
            pros: ['Prevents mercury/indium contamination'],
            cons: ['Lowest financial return'],
            actionLabel: 'Recycle',
            actionRoute: '/recovery',
            confidence: 30,
            recommended: false
          }
        ]
      };
    }

    // Default general diagnostic
    return {
      productModel: `${product.brand} ${product.model}`,
      possibleIssue: 'General Hardware / Power Management Diagnostic Required',
      confidenceScore: 76,
      repairability: 'MEDIUM',
      professionalInspection: 'RECOMMENDED',
      partAvailability: 'AVAILABLE',
      diagnosticSummary: `Based on the reported symptoms on this ${product.model} (Age: ~2.5 yrs), a multimeter electrical trace and bench isolation is recommended to identify whether the issue is concentrated on power distribution or modular components.`,
      repairEstimateAmount: 2800,
      replacementCostAmount: 15000,
      potentialRemainingLife: '2 years',
      paths: [
        {
          type: 'REPAIR',
          title: 'Bench Diagnostic & Targeted Component Fix',
          costEstimate: '₹2,800',
          remainingLife: '2+ years',
          pros: ['Cost-effective fix compared to new purchase', 'Extends device circular lifetime'],
          cons: ['Requires diagnostic fee if non-repairable'],
          actionLabel: 'Book Bench Diagnostic',
          actionRoute: '/repairers',
          confidence: 82,
          recommended: true
        },
        {
          type: 'RESELL',
          title: 'Resell Device As-Is / Parts Grade',
          valueEstimate: '₹7,500',
          remainingLife: '1–2 years',
          pros: ['Avoids diagnostic or repair expense'],
          cons: ['Lower buyer demand for uncertified faults'],
          actionLabel: 'Estimate Value',
          actionRoute: '/resale',
          confidence: 60,
          recommended: false
        },
        {
          type: 'RECOVER',
          title: 'Salvage Storage & Memory Modules',
          valueEstimate: '₹2,200',
          remainingLife: 'Secondary parts',
          pros: ['Extract functional RAM and SSD drives'],
          cons: ['Requires technical disassembly'],
          actionLabel: 'Recovery Options',
          actionRoute: '/recovery',
          confidence: 55,
          recommended: false
        },
        {
          type: 'RECYCLE',
          title: 'R2v3 Certified E-Waste Recycling',
          valueEstimate: '₹500',
          remainingLife: '0',
          pros: ['Responsible circular extraction of noble metals'],
          cons: ['Zero hardware utility remaining'],
          actionLabel: 'Schedule Recycler Pickup',
          actionRoute: '/recovery',
          confidence: 35,
          recommended: false
        }
      ]
    };
  }
}

export const aiService = new AIService();
