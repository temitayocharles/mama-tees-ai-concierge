export const knowledgeBase = {
  restaurant: {
    name: "Mama Tee's Kitchen",
    type: 'Fast-casual Nigerian restaurant',
    address: '14 Adetokunbo Ademola Crescent, Wuse 2, Abuja, FCT',
    phone: '0812 345 6789',
    instagram: '@mamateeskitchen',
    summary: 'Home-style Nigerian meals made fresh daily. The restaurant does not use frozen ingredients.'
  },
  openingHours: {
    mondayToFriday: '8:00am to 9:00pm',
    saturday: '9:00am to 10:00pm',
    sunday: '11:00am to 7:00pm',
    publicHolidays: 'Open unless announced otherwise on Instagram.'
  },
  menu: {
    riceDishes: [
      { item: 'Jollof Rice', size: 'small', price: 1500 },
      { item: 'Jollof Rice', size: 'large', price: 2500 },
      { item: 'Fried Rice', size: 'small', price: 1500 },
      { item: 'Fried Rice', size: 'large', price: 2500 },
      { item: 'White Rice and Stew', price: 1500 },
      { item: 'Coconut Rice', price: 2000 }
    ],
    swallowAndSoup: [
      { item: 'Eba and Egusi Soup', price: 2000 },
      { item: 'Eba and Ogbono Soup', price: 2000 },
      { item: 'Eba and Bitterleaf Soup', price: 2000 },
      { item: 'Pounded Yam and Egusi Soup', price: 2500 },
      { item: 'Pounded Yam and Ogbono Soup', price: 2500 },
      { item: 'Amala and Ewedu with Gbegiri', price: 2000 },
      { item: 'Wheat and Oha Soup', price: 2500 }
    ],
    proteins: [
      { item: 'Chicken', portion: '1 piece', price: 1000 },
      { item: 'Turkey', portion: '1 piece', price: 1500 },
      { item: 'Beef', portion: '4 pieces', price: 1000 },
      { item: 'Fish', portion: '1 piece', price: 1200 },
      { item: 'Goat Meat', portion: '4 pieces', price: 1500 },
      { item: 'Ponmo', portion: '3 pieces', price: 500 },
      { item: 'Shaki', price: 800 }
    ],
    snacks: [
      { item: 'Puff Puff', portion: '10 pieces', price: 800 },
      { item: 'Moi Moi', portion: '1 wrap', price: 600 },
      { item: 'Akara', portion: '5 pieces', price: 500 },
      { item: 'Peppered Gizzard', portion: '5 pieces', price: 1500 },
      { item: 'Peppered Chicken Wings', portion: '4 pieces', price: 2000 },
      { item: 'Peppered Fish', price: 1500 }
    ],
    takeawaySoupsPerLitre: [
      { item: 'Egusi Soup', price: 3500 },
      { item: 'Ogbono Soup', price: 3500 },
      { item: 'Bitterleaf Soup', price: 3500 },
      { item: 'Oha Soup', price: 4000 },
      { item: 'Ewedu and Gbegiri', price: 3000 }
    ],
    drinks: [
      { item: 'Coke, Fanta, Sprite', portion: '50cl', price: 400 },
      { item: 'Malt', price: 500 },
      { item: 'Bottled Water', portion: '50cl', price: 200 },
      { item: 'Zobo', portion: '500ml', price: 600 },
      { item: 'Kunu', portion: '500ml', price: 600 },
      { item: 'Chapman', price: 800 }
    ]
  },
  specials: {
    friday: 'Catfish Pepper Soup with Agidi, available from 12pm until it finishes, ₦3,500 per portion. No advance orders. First come, first served.',
    sunday: 'Family Meal Deal: 2 large portions of Jollof Rice, 2 chicken pieces, 1 moi moi, and 2 drinks for ₦7,000.'
  },
  delivery: {
    availability: 'Monday to Saturday, 10:00am to 7:00pm. No Sunday delivery.',
    minimumOrder: 3000,
    estimatedTime: '30 to 60 minutes depending on traffic.',
    areas: [
      { names: ['wuse 2', 'maitama', 'asokoro', 'central area'], fee: 500 },
      { names: ['garki', 'utako', 'jabi', 'wuse 1'], fee: 800 },
      { names: ['gwarinpa', 'lugbe', 'kubwa', 'karu', 'nyanya'], fee: 1200 }
    ],
    thirdPartyApps: false
  },
  payment: {
    methods: ['cash', 'bank transfer'],
    bank: 'GTBank',
    accountName: "Mama Tee's Kitchen",
    accountNumber: '0123456789',
    deliveryRule: 'Payment must be made before dispatch.',
    walkInRule: 'Payment is made at the counter before food is served.'
  },
  reservations: {
    minimumGuests: 5,
    advanceNoticeHours: 24,
    deposit: 5000,
    depositPolicy: 'Deposit goes toward the total bill.',
    walkInRule: 'Walk-in customers are welcome for tables fewer than 5 people.'
  },
  faqs: {
    customization: 'Customers can request extra pepper, no pepper, no onions, or extra sauce. Customization is not guaranteed during very busy hours.',
    catering: 'Catering is available for office meetings, parties, and small weddings. Orders must be placed at least 5 days in advance.',
    kidsMenu: 'There is no separate kids menu, but smaller portions of rice dishes can be served for children.',
    halal: 'All meat is halal.',
    seating: 'Indoor seating is available for up to 40 people.',
    pickup: 'Customers can order ahead for pickup by calling or WhatsApp.',
    complaints: 'Customers should speak to any staff member or ask to see the manager on duty.'
  }
} as const;
