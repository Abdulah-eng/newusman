export interface HardcodedReview {
  id: string
  customerName: string
  rating: number
  title: string
  review: string
  date: string
  verified: boolean
  helpful: number
  product: string
  category: string
}

export const hardcodedReviews: HardcodedReview[] = [
  {
    id: 'hc-1',
    customerName: 'Sarah M.',
    rating: 5,
    title: 'Best mattress I\'ve ever slept on!',
    review: 'After struggling with back pain for years, this mattress has been a game-changer. The support is incredible and I wake up feeling refreshed every morning. The 14-night trial gave me confidence to try it, but I knew within the first week that this was the one!',
    date: '2 weeks ago',
    verified: true,
    helpful: 24,
    product: 'Premium Hybrid Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-2',
    customerName: 'James R.',
    rating: 5,
    title: 'Excellent quality and comfort',
    review: 'Outstanding mattress! The memory foam provides perfect pressure relief while the pocket springs give excellent support. My partner and I both sleep much better now. Delivery was quick and professional.',
    date: '1 month ago',
    verified: true,
    helpful: 18,
    product: 'Memory Foam Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-3',
    customerName: 'Emma L.',
    rating: 4,
    title: 'Great value for money',
    review: 'Really impressed with the quality for the price. The mattress is comfortable and supportive. The cooling technology works well - no more waking up hot! Would definitely recommend to friends.',
    date: '3 weeks ago',
    verified: true,
    helpful: 15,
    product: 'Cooling Gel Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-4',
    customerName: 'Michael T.',
    rating: 5,
    title: 'Perfect for side sleepers',
    review: 'As a side sleeper, I\'ve always struggled with shoulder pain. This mattress provides the perfect balance of softness and support. My shoulder pain has completely disappeared!',
    date: '1 week ago',
    verified: true,
    helpful: 22,
    product: 'Side Sleeper Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-5',
    customerName: 'Lisa K.',
    rating: 5,
    title: 'Amazing customer service',
    review: 'Not only is the mattress fantastic, but the customer service was outstanding. They helped me choose the right firmness level and the delivery team was professional and friendly.',
    date: '2 months ago',
    verified: true,
    helpful: 19,
    product: 'Luxury Hybrid Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-6',
    customerName: 'David P.',
    rating: 4,
    title: 'Good mattress, great price',
    review: 'Solid mattress that provides good support. The edge support is particularly impressive. Takes a few nights to get used to, but once you do, it\'s very comfortable.',
    date: '1 month ago',
    verified: true,
    helpful: 12,
    product: 'Firm Support Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-7',
    customerName: 'Rachel S.',
    rating: 5,
    title: 'Life-changing sleep quality',
    review: 'I\'ve never slept so well! The mattress contours perfectly to my body and the temperature regulation is excellent. My partner doesn\'t disturb me anymore thanks to the motion isolation.',
    date: '3 weeks ago',
    verified: true,
    helpful: 28,
    product: 'Motion Isolation Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-8',
    customerName: 'Tom W.',
    rating: 4,
    title: 'Comfortable and durable',
    review: 'Great mattress that has held up well over the past year. The materials feel high quality and the mattress maintains its shape. Good value for the price.',
    date: '2 months ago',
    verified: true,
    helpful: 16,
    product: 'Durable Support Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-9',
    customerName: 'Anna B.',
    rating: 5,
    title: 'Perfect for couples',
    review: 'My partner and I have very different sleep preferences, but this mattress works for both of us. The dual comfort zones are brilliant and we both sleep soundly now.',
    date: '1 week ago',
    verified: true,
    helpful: 21,
    product: 'Dual Comfort Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-10',
    customerName: 'Mark H.',
    rating: 4,
    title: 'Good mattress, minor issues',
    review: 'Overall a good mattress with excellent support. Had a small issue with delivery but customer service resolved it quickly. The mattress itself is very comfortable.',
    date: '2 weeks ago',
    verified: true,
    helpful: 8,
    product: 'Premium Support Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-11',
    customerName: 'Jennifer C.',
    rating: 5,
    title: 'Exceeded expectations',
    review: 'Was skeptical about buying online, but this mattress exceeded all my expectations. The quality is outstanding and the sleep trial gave me confidence to purchase.',
    date: '1 month ago',
    verified: true,
    helpful: 25,
    product: 'Online Exclusive Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-12',
    customerName: 'Robert M.',
    rating: 4,
    title: 'Solid choice',
    review: 'Good mattress that provides decent support. The edge support could be better, but overall it\'s comfortable and well-made. Good value for money.',
    date: '3 weeks ago',
    verified: true,
    helpful: 11,
    product: 'Value Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-13',
    customerName: 'Sophie T.',
    rating: 5,
    title: 'Amazing for back pain',
    review: 'I\'ve suffered from chronic back pain for years. This mattress has made such a difference! The lumbar support is incredible and I wake up pain-free.',
    date: '2 weeks ago',
    verified: true,
    helpful: 32,
    product: 'Back Pain Relief Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-14',
    customerName: 'Chris L.',
    rating: 4,
    title: 'Good mattress, great delivery',
    review: 'The mattress is comfortable and well-made. The delivery team was professional and set everything up perfectly. Would recommend the company for their service.',
    date: '1 month ago',
    verified: true,
    helpful: 14,
    product: 'Professional Delivery Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-15',
    customerName: 'Amanda R.',
    rating: 5,
    title: 'Perfect firmness',
    review: 'Finally found a mattress with the right firmness level! Not too soft, not too firm - just perfect. The quality is excellent and it feels like it will last for years.',
    date: '3 weeks ago',
    verified: true,
    helpful: 20,
    product: 'Perfect Firmness Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-16',
    customerName: 'Kevin D.',
    rating: 4,
    title: 'Good value mattress',
    review: 'Solid mattress that provides good support without breaking the bank. The materials feel quality and the mattress has held up well over the past few months.',
    date: '2 months ago',
    verified: true,
    helpful: 13,
    product: 'Budget Friendly Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-17',
    customerName: 'Helen W.',
    rating: 5,
    title: 'Excellent customer service',
    review: 'The customer service team was incredibly helpful in choosing the right mattress. They took the time to understand my needs and the mattress is perfect!',
    date: '1 week ago',
    verified: true,
    helpful: 17,
    product: 'Customer Service Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-18',
    customerName: 'Paul S.',
    rating: 4,
    title: 'Comfortable and supportive',
    review: 'Good mattress that provides excellent support for my back. The memory foam layer is comfortable and the mattress maintains its shape well. Happy with the purchase.',
    date: '2 weeks ago',
    verified: true,
    helpful: 15,
    product: 'Memory Support Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-19',
    customerName: 'Michelle F.',
    rating: 5,
    title: 'Best sleep I\'ve had in years',
    review: 'This mattress has transformed my sleep quality. I fall asleep faster and stay asleep longer. The cooling technology is fantastic - no more night sweats!',
    date: '1 month ago',
    verified: true,
    helpful: 29,
    product: 'Cooling Technology Mattress',
    category: 'Mattresses'
  },
  {
    id: 'hc-20',
    customerName: 'Daniel K.',
    rating: 4,
    title: 'Good mattress overall',
    review: 'Solid mattress that provides good support and comfort. The edge support is decent and the mattress feels well-constructed. Would recommend for the price.',
    date: '3 weeks ago',
    verified: true,
    helpful: 9,
    product: 'All-Round Mattress',
    category: 'Mattresses'
  }
]
