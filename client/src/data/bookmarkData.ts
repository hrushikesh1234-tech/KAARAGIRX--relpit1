
export type BookmarkCategory = 'architect' | 'contractor' | 'material' | 'machine/vehicle' | 'dealer' | 'rental company';

export interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  category: BookmarkCategory;
  image: string;
  location: string;
  rating: number;
  dateAdded: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

export const bookmarkData: BookmarkItem[] = [
  // Architects
  {
    id: 'arch-1',
    title: 'Modern Design Studio',
    description: 'Contemporary architectural designs with sustainable solutions for residential and commercial projects.',
    category: 'architect',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop',
    location: 'New York, NY',
    rating: 4.8,
    dateAdded: '2024-01-15',
    contact: {
      phone: '+1-555-0123',
      email: 'info@moderndesignstudio.com',
      website: 'www.moderndesignstudio.com'
    }
  },
  {
    id: 'arch-2',
    title: 'Heritage Architecture Co.',
    description: 'Specializing in restoration and preservation of historic buildings with modern functionality.',
    category: 'architect',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop',
    location: 'Boston, MA',
    rating: 4.6,
    dateAdded: '2024-01-12',
    contact: {
      phone: '+1-555-0124',
      email: 'contact@heritagearch.com',
      website: 'www.heritagearch.com'
    }
  },
  {
    id: 'arch-3',
    title: 'Green Building Architects',
    description: 'Eco-friendly architectural solutions focusing on energy efficiency and sustainable materials.',
    category: 'architect',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    location: 'Seattle, WA',
    rating: 4.9,
    dateAdded: '2024-01-10',
    contact: {
      phone: '+1-555-0125',
      email: 'hello@greenbuildingarch.com',
      website: 'www.greenbuildingarch.com'
    }
  },
  {
    id: 'arch-4',
    title: 'Urban Planning Associates',
    description: 'Large-scale urban development and city planning with focus on community integration.',
    category: 'architect',
    image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop',
    location: 'Chicago, IL',
    rating: 4.7,
    dateAdded: '2024-01-08',
    contact: {
      phone: '+1-555-0126',
      email: 'info@urbanplanningassoc.com',
      website: 'www.urbanplanningassoc.com'
    }
  },
  {
    id: 'arch-5',
    title: 'Residential Design Masters',
    description: 'Custom home designs and luxury residential architecture with personalized approach.',
    category: 'architect',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop',
    location: 'Los Angeles, CA',
    rating: 4.5,
    dateAdded: '2024-01-05',
    contact: {
      phone: '+1-555-0127',
      email: 'design@residentialmasters.com',
      website: 'www.residentialmasters.com'
    }
  },

  // Contractors
  {
    id: 'cont-1',
    title: 'Premier Construction Group',
    description: 'Full-service construction company specializing in commercial and residential projects.',
    category: 'contractor',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    location: 'Dallas, TX',
    rating: 4.7,
    dateAdded: '2024-01-14',
    contact: {
      phone: '+1-555-0200',
      email: 'info@premierconstructiongroup.com',
      website: 'www.premierconstructiongroup.com'
    }
  },
  {
    id: 'cont-2',
    title: 'Elite Building Services',
    description: 'High-end construction and renovation services with attention to detail and quality craftsmanship.',
    category: 'contractor',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    location: 'Miami, FL',
    rating: 4.8,
    dateAdded: '2024-01-11',
    contact: {
      phone: '+1-555-0201',
      email: 'contact@elitebuildingservices.com',
      website: 'www.elitebuildingservices.com'
    }
  },
  {
    id: 'cont-3',
    title: 'Rapid Response Contractors',
    description: 'Emergency repair and construction services available 24/7 for urgent building needs.',
    category: 'contractor',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    location: 'Phoenix, AZ',
    rating: 4.6,
    dateAdded: '2024-01-09',
    contact: {
      phone: '+1-555-0202',
      email: 'emergency@rapidresponsecontractors.com',
      website: 'www.rapidresponsecontractors.com'
    }
  },
  {
    id: 'cont-4',
    title: 'Green Construction Co.',
    description: 'Sustainable construction practices using eco-friendly materials and energy-efficient methods.',
    category: 'contractor',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    location: 'Portland, OR',
    rating: 4.9,
    dateAdded: '2024-01-07',
    contact: {
      phone: '+1-555-0203',
      email: 'info@greenconstructionco.com',
      website: 'www.greenconstructionco.com'
    }
  },
  {
    id: 'cont-5',
    title: 'Heritage Restoration Ltd.',
    description: 'Specialized in historic building restoration and preservation with traditional techniques.',
    category: 'contractor',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    location: 'Philadelphia, PA',
    rating: 4.4,
    dateAdded: '2024-01-04',
    contact: {
      phone: '+1-555-0204',
      email: 'restoration@heritageltd.com',
      website: 'www.heritagerestorationltd.com'
    }
  },

  // Materials
  {
    id: 'mat-1',
    title: 'BuildMax Supply Center',
    description: 'Comprehensive building materials supplier with wide range of construction products and tools.',
    category: 'material',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
    location: 'Houston, TX',
    rating: 4.5,
    dateAdded: '2024-01-13',
    contact: {
      phone: '+1-555-0300',
      email: 'sales@buildmaxsupply.com',
      website: 'www.buildmaxsupply.com'
    }
  },
  {
    id: 'mat-2',
    title: 'Premium Stone & Marble',
    description: 'High-quality natural stone, marble, and granite for luxury construction and renovation projects.',
    category: 'material',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
    location: 'Atlanta, GA',
    rating: 4.8,
    dateAdded: '2024-01-11',
    contact: {
      phone: '+1-555-0301',
      email: 'info@premiumstonemarble.com',
      website: 'www.premiumstonemarble.com'
    }
  },
  {
    id: 'mat-3',
    title: 'Eco-Friendly Building Materials',
    description: 'Sustainable and recycled building materials for environmentally conscious construction projects.',
    category: 'material',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop',
    location: 'Denver, CO',
    rating: 4.7,
    dateAdded: '2024-01-09',
    contact: {
      phone: '+1-555-0302',
      email: 'contact@ecofriendlybuilding.com',
      website: 'www.ecofriendlybuilding.com'
    }
  },
  {
    id: 'mat-4',
    title: 'Steel & Metal Works',
    description: 'Industrial-grade steel, aluminum, and metal fabrication services for construction industry.',
    category: 'material',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
    location: 'Detroit, MI',
    rating: 4.6,
    dateAdded: '2024-01-06',
    contact: {
      phone: '+1-555-0303',
      email: 'orders@steelmetalworks.com',
      website: 'www.steelmetalworks.com'
    }
  },
  {
    id: 'mat-5',
    title: 'Roofing Materials Depot',
    description: 'Complete roofing solutions including shingles, tiles, and waterproofing materials.',
    category: 'material',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=300&fit=crop',
    location: 'Nashville, TN',
    rating: 4.4,
    dateAdded: '2024-01-03',
    contact: {
      phone: '+1-555-0304',
      email: 'info@roofingmaterialsdepot.com',
      website: 'www.roofingmaterialsdepot.com'
    }
  },

  // Machine/Vehicle
  {
    id: 'mach-1',
    title: 'Heavy Equipment Solutions',
    description: 'Sales and service of excavators, bulldozers, and other heavy construction machinery.',
    category: 'machine/vehicle',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop',
    location: 'Las Vegas, NV',
    rating: 4.7,
    dateAdded: '2024-01-12',
    contact: {
      phone: '+1-555-0400',
      email: 'sales@heavyequipmentsolutions.com',
      website: 'www.heavyequipmentsolutions.com'
    }
  },
  {
    id: 'mach-2',
    title: 'Construction Vehicle Rental',
    description: 'Short and long-term rental of construction vehicles, trucks, and specialized equipment.',
    category: 'machine/vehicle',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop',
    location: 'San Antonio, TX',
    rating: 4.5,
    dateAdded: '2024-01-10',
    contact: {
      phone: '+1-555-0401',
      email: 'rentals@constructionvehiclerental.com',
      website: 'www.constructionvehiclerental.com'
    }
  },
  {
    id: 'mach-3',
    title: 'Crane & Lifting Services',
    description: 'Professional crane operations and heavy lifting services for construction and industrial projects.',
    category: 'machine/vehicle',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    location: 'San Diego, CA',
    rating: 4.8,
    dateAdded: '2024-01-08',
    contact: {
      phone: '+1-555-0402',
      email: 'operations@craneliftingservices.com',
      website: 'www.craneliftingservices.com'
    }
  },
  {
    id: 'mach-4',
    title: 'Power Tools & Equipment',
    description: 'Professional-grade power tools, generators, and construction equipment sales and rental.',
    category: 'machine/vehicle',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    location: 'Columbus, OH',
    rating: 4.6,
    dateAdded: '2024-01-05',
    contact: {
      phone: '+1-555-0403',
      email: 'info@powertoolsequipment.com',
      website: 'www.powertoolsequipment.com'
    }
  },
  {
    id: 'mach-5',
    title: 'Demolition Equipment Co.',
    description: 'Specialized demolition equipment and machinery for safe and efficient building demolition.',
    category: 'machine/vehicle',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    location: 'Kansas City, MO',
    rating: 4.3,
    dateAdded: '2024-01-02',
    contact: {
      phone: '+1-555-0404',
      email: 'demolition@equipmentco.com',
      website: 'www.demolitionequipmentco.com'
    }
  },

  // Dealers
  {
    id: 'deal-1',
    title: 'Construction Equipment Dealers',
    description: 'Authorized dealer for major construction equipment brands with financing options available.',
    category: 'dealer',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    location: 'Indianapolis, IN',
    rating: 4.6,
    dateAdded: '2024-01-11',
    contact: {
      phone: '+1-555-0500',
      email: 'sales@constructionequipmentdealers.com',
      website: 'www.constructionequipmentdealers.com'
    }
  },
  {
    id: 'deal-2',
    title: 'Building Materials Wholesale',
    description: 'Wholesale distributor of building materials with competitive pricing for contractors and builders.',
    category: 'dealer',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    location: 'Milwaukee, WI',
    rating: 4.7,
    dateAdded: '2024-01-09',
    contact: {
      phone: '+1-555-0501',
      email: 'wholesale@buildingmaterialswholesale.com',
      website: 'www.buildingmaterialswholesale.com'
    }
  },
  {
    id: 'deal-3',
    title: 'Tool & Hardware Dealers',
    description: 'Comprehensive tool and hardware supply with professional-grade equipment for all trades.',
    category: 'dealer',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
    location: 'Charlotte, NC',
    rating: 4.5,
    dateAdded: '2024-01-07',
    contact: {
      phone: '+1-555-0502',
      email: 'info@toolhardwaredealers.com',
      website: 'www.toolhardwaredealers.com'
    }
  },
  {
    id: 'deal-4',
    title: 'Specialty Construction Supplies',
    description: 'Specialized construction supplies and hard-to-find materials for unique building projects.',
    category: 'dealer',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    location: 'Sacramento, CA',
    rating: 4.8,
    dateAdded: '2024-01-04',
    contact: {
      phone: '+1-555-0503',
      email: 'specialty@constructionsupplies.com',
      website: 'www.specialtyconstructionsupplies.com'
    }
  },
  {
    id: 'deal-5',
    title: 'Industrial Equipment Brokers',
    description: 'Brokerage services for new and used industrial equipment with nationwide network.',
    category: 'dealer',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    location: 'Memphis, TN',
    rating: 4.4,
    dateAdded: '2024-01-01',
    contact: {
      phone: '+1-555-0504',
      email: 'brokers@industrialequipmentbrokers.com',
      website: 'www.industrialequipmentbrokers.com'
    }
  },

  // Rental Companies
  {
    id: 'rent-1',
    title: 'All-Purpose Equipment Rental',
    description: 'Complete equipment rental service for construction, landscaping, and general contracting needs.',
    category: 'rental company',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=300&fit=crop',
    location: 'Louisville, KY',
    rating: 4.6,
    dateAdded: '2024-01-10',
    contact: {
      phone: '+1-555-0600',
      email: 'rentals@allpurposeequipment.com',
      website: 'www.allpurposeequipment.com'
    }
  },
  {
    id: 'rent-2',
    title: 'Heavy Machinery Rentals',
    description: 'Specialized rental of heavy construction machinery with operator services available.',
    category: 'rental company',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=300&fit=crop',
    location: 'Oklahoma City, OK',
    rating: 4.7,
    dateAdded: '2024-01-08',
    contact: {
      phone: '+1-555-0601',
      email: 'heavy@machineryrentals.com',
      website: 'www.heavymachineryrentals.com'
    }
  },
  {
    id: 'rent-3',
    title: 'Construction Tool Rentals',
    description: 'Daily and weekly tool rentals for construction professionals and DIY enthusiasts.',
    category: 'rental company',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    location: 'Richmond, VA',
    rating: 4.5,
    dateAdded: '2024-01-06',
    contact: {
      phone: '+1-555-0602',
      email: 'tools@constructiontoolrentals.com',
      website: 'www.constructiontoolrentals.com'
    }
  },
  {
    id: 'rent-4',
    title: 'Temporary Building Solutions',
    description: 'Portable offices, storage containers, and temporary building structures for construction sites.',
    category: 'rental company',
    image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop',
    location: 'Salt Lake City, UT',
    rating: 4.8,
    dateAdded: '2024-01-03',
    contact: {
      phone: '+1-555-0603',
      email: 'temp@buildingsolutions.com',
      website: 'www.temporarybuildingsolutions.com'
    }
  },
  {
    id: 'rent-5',
    title: 'Individual Equipment Owner',
    description: 'Independent equipment owner renting excavator, backhoe, and small construction equipment.',
    category: 'rental company',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    location: 'Tucson, AZ',
    rating: 4.3,
    dateAdded: '2023-12-30',
    contact: {
      phone: '+1-555-0604',
      email: 'owner@individualequipment.com',
      website: 'www.individualequipmentowner.com'
    }
  }
];
