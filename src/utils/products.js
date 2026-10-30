
 
import tshirt01 from "../Images/t-shirt-01.png";
import tshirt02 from "../Images/t-shirt-02.png";
import tshirt03 from "../Images/t-shirt-03.png";
import custmug01 from "../Images/cust-mug-01.png";
import tshirt11 from "../Images/t-shirt-11.png";
import tshirt06 from "../Images/t-shirt-06.png";
import tshirt10 from "../Images/t-shirt-10.png";



import bag02 from "../Images/bag-02.png";
import bag03 from "../Images/bag-03.png";
import mug02F from "../Images/mug-02-F.png";




export const SliderData = [
  {
      id: 1,
      badge: "? Premium Tees",
      title: "Bold Graphic Streetwear",
      desc: "Soft-spun combed cotton tees engineered for all-day comfort and expressive style.",
      cover: tshirt02,
      ctaText: "Shop T-Shirts",
      categoryLink: "/shop",
  },
  {
      id: 2,
      badge: "?? Eco-Friendly",
      title: "Artisan Canvas Totes",
      desc: "Heavy-duty minimalist cotton canvas totes crafted for groceries, books, and coffee runs.",
      cover: bag02,
      ctaText: "Browse Totes",
      categoryLink: "/shop",
  },
  {
      id: 3,
      badge: "? Morning Rituals",
      title: "Ceramic Keepsake Mugs",
      desc: "Sleek ergonomic stoneware mugs designed to keep your brew piping hot.",
      cover: mug02F,
      ctaText: "Discover Mugs",
      categoryLink: "/shop",
  },
];

export const serviceData = [
  {
    icon: <ion-icon name="car"></ion-icon>,
    title: "Shipping Charges",
    subtitle: "Reasonable costs for shipping charges.",
    bg: "#fdefe6",
  },
  {
    icon: <ion-icon name="card"></ion-icon>,
    title: "Safe Payment",
    subtitle: "Safe payments using UPI.",
    bg: "#ceebe9",
  },
  {
    icon: <ion-icon name="shield-half-outline"></ion-icon>,
    title: "Customer Support",
    subtitle: "9-to-6 customer support weekdays.",
    bg: "#e2f2b2",
  },
  {
    icon: <ion-icon name="headset"></ion-icon>,
    title: "Back Guarantee",
    subtitle: "Return only if the products are damaged from our end or for incorrect items.",
    bg: "#d6e5fb",
  },
];

export const discoutProducts = [
  // {
  //   id: "01",
  //   productName: "Stone and Beam Westview ",
  //   imgUrl: productImg01,
  //    category: "sofa",
  //   price: 193,
  //   discount:30,
 
  // },
  // {
  //   id: "02",
  //   productName: "Rivet Bigelow Modern ",
  //   imgUrl: productImg02,
  //    category: "sofa",
  //   price: 253,
  //   discount:20,

  // },
  // {
  //   id: "08",
  //   productName: "Baltsar Chair",
  //   imgUrl: productImg08,
  //    category: "chair",
  //   price: 89,
  //   discount:15,

  // },
  // {
  //   id: "09",
  //   productName: "Helmar Chair",
  //   imgUrl: productImg09,
  //    category: "chair",
  //   price: 112,
  //   discount:35,

  // },
  {
    id: "12",
    productName: "Realme 8",
    imgUrl: tshirt03,
     category: "Tshirt",
    price: 599,
    discount:10,
    shortDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur iure quas illo voluptates labore tempore!",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio nostrum accusantium iste, voluptas cumque provident! Consequatur officiis animi rem tempore voluptate cumque hic similique aperiam ut consectetur distinctio repudiandae quia quam quos, quas illo, iusto, necessitatibus odio veniam exercitationem quis voluptatibus debitis laboriosam! Esse debitis obcaecati blanditiis at impedit quibusdam!",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },
  {
    id: "13",
    productName: "One Plus Nord",
    imgUrl: custmug01,
     category: "Tshirt",
    price: 799,
    discount:5,
    shortDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur iure quas illo voluptates labore tempore!",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio nostrum accusantium iste, voluptas cumque provident! Consequatur officiis animi rem tempore voluptate cumque hic similique aperiam ut consectetur distinctio repudiandae quia quam quos, quas illo, iusto, necessitatibus odio veniam exercitationem quis voluptatibus debitis laboriosam! Esse debitis obcaecati blanditiis at impedit quibusdam!",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },

]

export const products = [
  // {
  //   id: "01",
  //   productName: "Stone and Beam Westview ",
  //   imgUrl: productImg01,
  //    category: "sofa",
  //   price: 193,

  // },

  // {
  //   id: "02",
  //   productName: "Rivet Bigelow Modern ",
  //   imgUrl: productImg02,
  //    category: "sofa",
  //   price: 253,

  // },

  // {
  //   id: "03",
  //   productName: "Amazon Brand Modern Sofa",
  //   imgUrl: productImg03,
  //    category: "sofa",
  //   price: 173,

  // },
  // {
  //   id: "26",
  //   productName: "Rivet Bigelow Modern ",
  //   imgUrl: productImg02,
  //    category: "sofa",
  //   price: 253,

  // },
  // {
  //   id: "04",
  //   productName: "Fllufy Sheep Sofa",
  //   imgUrl: productImg04,
  //    category: "sofa",
  //   price: 163,

  // },

  // {
  //   id: "05",
  //   productName: "Faux Velvet Sofa",
  //   imgUrl: productImg05,
  //    category: "sofa",
  //   price: 163,

  // },

  // {
  //   id: "06",
  //   productName: "Fllufy Sheep Sofa",
  //   imgUrl: productImg06,
  //    category: "sofa",
  //   price: 163,

  // },
  // {
  //   id: "07",
  //   productName: "Sakarias Armchair",
  //   imgUrl: productImg07,
  //    category: "chair",
  //   price: 99,

  // },

  // {
  //   id: "27",
  //   productName: "Modern Arm Sofa",
  //   imgUrl: productImg007,
  //    category: "sofa",
  //   price: 173,

  // },

  // {
  //   id: "08",
  //   productName: "Baltsar Chair",
  //   imgUrl: productImg08,
  //    category: "chair",
  //   price: 89,

  // },

  // {
  //   id: "09",
  //   productName: "Helmar Chair",
  //   imgUrl: productImg09,
  //    category: "chair",
  //   price: 112,

  // },

  

  {
    id: "10",
    productName: "Dynamic Bull T-Shirt",
    imgUrl:  tshirt02,
     category: "T-Shirts",
    price: 349,
    shortDesc:
      "Premium, soft fabric Striking graphic design with a bronze bull and bold text Comfortable fit for everyday wear",
    description:
      "Unleash your inner strength with our Dynamic Bull T-Shirt. Featuring a bold design of a bronze bull statue and the repeated word “BULL,” this shirt symbolizes power and resilience.Made from premium, soft fabric, this T-shirt offers a comfortable fit perfect for everyday wear.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },
  // {
  //   id: "25",
  //   productName: "Sakarias Armchair",
  //   imgUrl: productImg10,
  //    category: "chair",
  //   price: 99,

  // },
  {
    id: "11",
    productName: "Stylish Profit & Loss Hoodie",
    imgUrl: tshirt01,
     category: "T-Shirts",
    price: 319,
    shortDesc: 
      "Soft, high-quality fabric Unique graphic design Relaxed fit with ribbed cuffs and hem Cozy hood and kangaroo pocket.",
    description:
     "Crafted from soft, high-quality fabric, it offers a relaxed fit with ribbed cuffs and hem. The cozy hood and front kangaroo pocket add comfort and convenience.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },

  {
    id: "12",
    productName: "Playful Bear T-Shirt",
    imgUrl: tshirt03,
     category: "T-Shirts",
    price: 349,
    shortDesc:
      "Soft, high-quality fabric Adorable bear design with bold text Comfortable fit for everyday wear",
    description:
      "Add a touch of charm to your wardrobe with our Playful Bear T-Shirt. Featuring a cute, smiling bear illustration and bold BEAR text, this shirt is perfect for casual wear. Crafted from soft, high-quality fabric, it ensures comfort all day long.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },

  {
    id: "13",
    productName: "AURA Moai T-Shirt",
    imgUrl: tshirt06,
     category: "T-Shirts",
    price: 349,
    shortDesc:
      "Soft, high-quality fabric Stylish Moai statues design with bold text Comfortable fit for everyday wear",
    description:
      "Express your unique style with our AURA Moai T-Shirt. Featuring three stylized Moai statues from Easter Island and bold AURA text, this shirt is perfect for casual wear. Crafted from soft, high-quality fabric, it ensures all-day comfort.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },

  {
    id: "14",
    productName: "Festive Antlers T-Shirt",
    imgUrl: tshirt11,
     category: "T-Shirts",
    price: 299,
    shortDesc:
      "Soft, high-quality fabric Festive antlers design with Happy X'mas text Comfortable fit for everyday wear",
    description:
      "Celebrate the holiday season with our Festive Antlers T-Shirt. Featuring a pair of stylish brown antlers and the cheerful message Happy X'mas, this shirt brings a touch of festive fun to your wardrobe.Made from soft, high-quality fabric, it ensures comfort for all your holiday activities.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },

  {
    id: "15",
    productName: "Ho Ho Ho T-Shirt",
    imgUrl: tshirt10,
     category: "T-Shirts",
    price: 349,
    shortDesc:
      "Soft, high-quality fabric Cheerful 'Ho ho ho!' design with sparkling stars Comfortable fit for everyday wear",
    description:
      "Celebrate the festive season with our Ho Ho Ho T-Shirt. Featuring cheerful green text 'Ho ho ho!' surrounded by sparkling stars, this shirt brings the joy and spirit of Christmas to your wardrobe.Crafted from soft, high-quality fabric, it ensures comfort for all your holiday festivities.",
    reviews: [
      {
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        rating: 4.9,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    avgRating: 4.8,
  },



  {
    id: "41",
    productName: "Classic Minimalist Mug",
    imgUrl: mug02F,
    category: "Mugs",
    price: 279,
    shortDesc:
      "High-grade ceramic with sleek minimalist finish, perfect for your morning brew.",
    description:
      "Start your day with simplicity and style. Our Classic Minimalist Mug is crafted from high-grade ceramic, offering a smooth finish and ergonomic handle for comfortable sipping.",
    reviews: [
      {
        rating: 4.7,
        text: "Looks fantastic on my desk.",
      },
    ],
    avgRating: 4.7,
  },
  {
    id: "50",
    productName: "Face Art Canvas Tote Bag",
    imgUrl: bag02,
    category: "Tote Bags",
    price: 349,
    shortDesc:
      "Eco-friendly canvas tote featuring minimalist abstract face art line drawing.",
    description:
      "Elevate your style with our Face Art Tote Bag. Featuring a minimalist line drawing of a face and a bold orange circle, this tote combines abstract art with functional everyday fashion. Made from durable, eco-friendly cotton canvas.",
    reviews: [
      {
        rating: 4.9,
        text: "Very spacious and durable canvas material.",
      },
    ],
    avgRating: 4.9,
  },
  {
    id: "51",
    productName: "Elegant Floral Canvas Tote Bag",
    imgUrl: bag03,
    category: "Tote Bags",
    price: 349,
    shortDesc:
      "Durable white cotton canvas tote with delicate floral branch artwork in earth tones.",
    description:
      "Add a touch of elegance to your style with our Elegant Floral Tote Bag. Featuring a delicate floral branch design in shades of brown and beige, this white tote bag is perfect for books, groceries, and daily essentials.",
    reviews: [
      {
        rating: 4.8,
        text: "Love the floral design and sturdy straps!",
      },
    ],
    avgRating: 4.8,
  },

  // {
  //   id: "16",
  //   productName: "Rolex Watch",
  //   imgUrl: watch01,
  //    category: "watch",
  //   price: 299,

  // },

  // {
  //   id: "17",
  //   productName: "Timex Easy Reader Watch",
  //   imgUrl: watch02,
  //    category: "watch",
  //   price: 299,

  // },

  // {
  //   id: "18",
  //   productName: "Rolex Watch",
  //   imgUrl: watch03,
  //    category: "watch",
  //   price: 299,

  // },

  // {
  //   id: "19",
  //   productName: "Apple Watch",
  //   imgUrl: watch04,
  //    category: "watch",
  //   price: 399,

  // },

  // {
  //   id: "20",
  //   productName: "Beat Studio Wireless",
  //   imgUrl: wireless01,
  //    category: "wireless",
  //   price: 199,
 
  // },

  // {
  //   id: "21",
  //   productName: "Beat EP Headphones",
  //   imgUrl: wireless03,
  //    category: "wireless",
  //   price: 199,

  // },
  // {
  //   id: "22",
  //   productName: "Black Headphones",
  //   imgUrl: wireless02,
  //    category: "wireless",
  //   price: 169,

  // },
  // {
  //   id: "23",
  //   productName: "Bluetooth Headphones",
  //   imgUrl: wireless04,
  //    category: "wireless",
  //   price: 139,
 
  // },

];
