export const STORE_CONFIG = {
  name: "RN Fashion BD House",
  banglaName: "আরএন ফ্যাশন বিডি হাউস",
  tagline: "Elegance Woven for You",
  subTagline: "প্রিমিয়াম বেনারসি, কাতান, জামদানি ও সিল্ক শাড়ির বিশ্বস্ত প্রতিষ্ঠান",
  phone: "01748631806",
  phoneDisplay: "01748-631806",
  whatsapp: "+8801748631806",
  whatsappDisplay: "01748-631806",
  bkashNumber: "01748631806",
  nagadNumber: "01748631806",
  email: "support@rnfashionbd.com",
  place: "শেরপুর (Sherpur)",
  showroom: "শেরপুর সদর, শেরপুর, বাংলাদেশ (Sherpur, Bangladesh)",
  delivery: {
    insideDhaka: 80,
    outsideDhaka: 150,
    freeDeliveryThreshold: 5000,
    insideDhakaDays: "১-২ দিন",
    outsideDhakaDays: "২-৪ দিন",
  },
  coupons: [
    { code: "EID2026", type: "percent", value: 10, minOrder: 2000, description: "১০% ঈদ স্পেশাল ডিসকাউন্ট" },
    { code: "FIRST10", type: "percent", value: 10, minOrder: 1500, description: "প্রথম অর্ডারে ১০% ছাড়" },
    { code: "RN500", type: "fixed", value: 500, minOrder: 4000, description: "৳৫০০ ফ্ল্যাট ডিসকাউন্ট" },
  ],
  adminPasscode: "rnadmin123",
  currencySymbol: "৳",
  paymentMethods: [
    { id: "cod", name: "ক্যাশ অন ডেলিভারি (Cash on Delivery)", note: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" },
    { id: "bkash", name: "বিকাশ (bKash Send Money)", number: "01748631806" },
    { id: "nagad", name: "নগদ (Nagad Send Money)", number: "01748631806" }
  ]
};

export default STORE_CONFIG;
