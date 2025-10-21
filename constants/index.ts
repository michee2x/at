export interface Category {
  name: string;
  image: string;
}




export const categories: Category[] = [
  { name: "Woodwork", image: "/category/cc3405b8501b4d063a035365d089a3148ad76024.jpg" },
  { name: "Furniture", image: "/category/968050704a98f1c94e6a2da98de893be106c74a3.jpg" },
  { name: "Woodwork", image: "/category/cc3405b8501b4d063a035365d089a3148ad76024.jpg" },
  { name: "Tables", image: "/category/06b90a34e0ff3c368dd3e054cdd4eefb531611e9.jpg" },
  { name: "Earphones", image: "/category/7b3c2f2248986e280cb53ee6a882059da1d0183e.jpg" },
  { name: "Woodwork", image: "/category/cc3405b8501b4d063a035365d089a3148ad76024.jpg" },
  { name: "Earphones", image: "/category/7b3c2f2248986e280cb53ee6a882059da1d0183e.jpg" },
  { name: "Makeup", image: "/category/7b3c2f2248986e280cb53ee6a882059da1d0183e.jpg" },
  { name: "Makeup", image: "/category/46aad60f36c448c42fba60bb1e7c18f675359b91.jpg" },
  { name: "Earphones", image: "/category/46aad60f36c448c42fba60bb1e7c18f675359b91.jpg" },
  { name: "Watches", image: "/category/46aad60f36c448c42fba60bb1e7c18f675359b91.jpg" },
  { name: "Watches", image: "/category/06b90a34e0ff3c368dd3e054cdd4eefb531611e9.jpg" },
  { name: "Watches", image: "/category/de5d0a6dd041ccbcc9e4be3c88c39a9a1565227b.png" },
];
type CategoryItem = {
  title: string;
  items: {
    name: string;
    image: string;
  }[];
};


export const groups:CategoryItem[] = [
    {
      title: "Revamp your home in style",
      items: [
        {
          name: "Cushion covers",
          image:
            "/category-grid/cat-one/6c4e3fbe2fe9060c5ea8d58ce660fbd768da2905.png",
        },
        {
          name: "Figurines, vases",
          image:
            "/category-grid/cat-one/b0752c3dee0615f35319656454a301384fc0d4da.png",
        },
        {
          name: "Home storage",
          image:
            "/category-grid/cat-one/4e0477aa4f5dd4a25a45c18cd98b6c1952c42986.png",
        },
        {
          name: "Lighting solutions",
          image:
            "/category-grid/cat-one/a38a454dc2a0e0b2e195e0e42acd739af81f67d6.png",
        },
      ],
    },
    {
      title: "Appliances for your home",
      items: [
        {
          name: "Air Conditioners",
          image:
            "/category-grid/cat-two/45f8c8a340b2d725a6e40a4c69a5fd99e0132909.png",
        },
        {
          name: "Refrigerators",
          image:
            "/category-grid/cat-two/47f86ab1566c980d681040836993fd5651e02d7b.png",
        },
        {
          name: "Microwave",
          image:
            "/category-grid/cat-two/9f961058d436744c716042ee9b8a08a28466452e.png",
        },
        {
          name: "Washing machines",
          image:
            "/category-grid/cat-two/a33be4a8a339812deae723533bc81271dfa1cedb.png",
        },
      ],
    },
    {
      title: "Great Sound and Headphones",
      items: [
        {
          name: "boat",
          image:
            "/category-grid/cat-three/14ea876d180c5f743a16c3d2d073fb57765f1faf.png",
        },
        {
          name: "boult",
          image:
            "/category-grid/cat-three/a4ac2797a6c3a1c5b43e0d9d9dfa33206bf74409.png",
        },
        {
          name: "noise",
          image:
            "/category-grid/cat-three/cdaaf97a2638b10fbd39fd591bc89b3a4316706e.png",
        },
        {
          name: "zebronics",
          image:
            "/category-grid/cat-three/a24a858190f82e9f53ac8ea329d9f4a164ce1983.png",
        },
      ],
    },
    {
      title: "Accessories and more options",
      items: [
        {
          name: "Children Toys",
          image:
            "/category-grid/cat-four/32faf0d962772939829c2a2a13f725d471c98300.png",
        },
        {
          name: "Decor",
          image:
            "/category-grid/cat-four/48784c2e18aaaacf9ba03299e4cc09a3ce17a422.png",
        },
        {
          name: "Trays",
          image:
            "/category-grid/cat-four/38a872b0340350c3d500d09a3c0f405d19cb69a9.png",
        },
        {
          name: "Snack Jars",
          image:
            "/category-grid/cat-four/eb5794cbc3a5a783f8fa5c16a02401415c252727.png",
        },
      ],
    },
    {
      title: "Automotive Essentials | Up to 60% off",
      items: [
        {
          name: "Cleaning accessories",
          image:
            "/category-grid/cat-five/8f780cf36f95a5f5df30585c3de9c184a66fb25c.png",
        },
        {
          name: "Tyre & rims",
          image:
            "/category-grid/cat-five/cff40d6a5a1e4904edd939805f835d04b2e2b281.png",
        },
        {
          name: "Car vacuum cleaner",
          image:
            "/category-grid/cat-five/2829b67ef8574dee8714c8eb66ad1abcfc09ef80.png",
        },
        {
          name: "Vacuum cleaner",
          image:
            "/category-grid/cat-five/5d4f94b214b64fe112c06c1a248f68afb6600ab7.png",
        },
      ],
    },
    {
      title: "Styles for Women | Up to 30% off",
      items: [
        {
          name: "Women clothing",
          image:
            "/category-grid/cat-six/13fe5cbd1d4a91adff9ca7143d1810c05e570c3b.png",
        },
        {
          name: "Footwear",
          image:
            "/category-grid/cat-six/3984d8c69449a1e9d2affa36a71393e34b1efd4a.png",
        },
        {
          name: "Handbags",
          image:
            "/category-grid/cat-six/3e8f7c225296fd9e2115c870230434a44bf4c9c3.png",
        },
        {
          name: "Fashion jewellery",
          image:
            "/category-grid/cat-six/e37241c00bd9b438681a4c2e9d21dbd760daf192.png",
        },
      ],
    },
    {
      title: "Home Accessories | Up to 20%",
      items: [
        {
          name: "Bedsheets",
          image:
            "/category-grid/cat-seven/b7b4d06de006d551f6f0ef69834900fc9faaefa7.png",
        },
        {
          name: "Curtains",
          image:
            "/category-grid/cat-seven/cd030735871aff02059e9f1bdb6006aaec3d791b.png",
        },
        {
          name: "Floor mats",
          image:
            "/category-grid/cat-seven/1040233133b0e8fb2bd0941ce692063a455638fb.png",
        },
        {
          name: "Door mats",
          image:
            "/category-grid/cat-seven/a969fdcf2d1296b066d4b0c70dad673eaa2f1dc8.png",
        },
      ],
    },
    {
      title: "Work tools and Accessories",
      items: [
        {
          name: "Measuring tools",
          image:
            "/category-grid/cat-eight/49cbf3912abc7fd55e73599e099fe21ee0073a38.png",
        },
        {
          name: "Paint brushes",
          image:
            "/category-grid/cat-eight/e714a2d8e641a475271af416e2204f814428320e.png",
        },
        {
          name: "Toolboxes",
          image:
            "/category-grid/cat-eight/471280d77aa2fe13f3b93a65f60d29e30862a299.png",
        },
        {
          name: "Extension boards",
          image:
            "/category-grid/cat-eight/873ecdde95427bcce0395ee908bad4d9ccd3041f.png",
        },
      ],
    },
  ];


export interface Headphone {
  name: string;
  price: string;
  image: string;
  features: string[];
}

export const headphones: Headphone[] = [
  {
    name: "boAt Airdrop 311 Pro",
    price: "$500",
    image: "/phones/32b3270e91688e7366699655b76b7b1257e83cb5.png",
    features: ["Transparent Design", "50 Hours Playback", "Ergonomic Fit"],
  },
  {
    name: "pTron Bassbud Pro",
    price: "$500",
    image: "/phones/32fa8dad6c77a48378c9f40a0a6027b7642f938d.png",
    features: ["45 Hours Playback", "AI ENC Noise Cancel", "Bluetooth 5.3"],
  },
  {
    name: "Sony WH1000XM5",
    price: "$500",
    image: "/phones/57fecc898883809315a3def501de220c4989a0d0.png",
    features: ["Advanced Noise Reduction", "Comfort Padding", "LDAC Support"],
  },
  {
    name: "Mivi SuperPods Halo",
    price: "$500",
    image: "/phones/5ac059011d8b6da083cfb8243483e58e27620390.png",
    features: [
      "AI ENC Mic with 3D Surround",
      "42 Hours Playback",
      "IPX4 Rating",
    ],
  },
  {
    name: "Boult Audio UFO",
    price: "$500",
    image: "/phones/6183a18aa1b80c5c4cccba06856b51c16edf51d1.png",
    features: ["48 Hours Playback", "Deep Bass Output", "Type-C Fast Charge"],
  },
  {
    name: "Hammer Bash Max",
    price: "$500",
    image: "/phones/676df93b0d9ca7e033ffc7a17bc9c5cc2b57b2a4.png",
    features: ["Active Noise Cancel", "Soft Ear Cushions", "40mm Drivers"],
  },
  {
    name: "Noise Buds N1",
    price: "$500",
    image: "/phones/715b1bc8214cfebc0d2639453796a61d22e76095.png",
    features: ["IPX5 Waterproof", "Environmental Noise Cancel", "Fast Pair"],
  },
  {
    name: "Crossbeats Arc Buds",
    price: "$500",
    image: "/phones/80c48e9870594929326a97b5d812c72fed58527b.png",
    features: ["38 Hours Playback", "SnapSound Audio", "Gaming Mode"],
  },
  {
    name: "JBL Wave Flex",
    price: "$500",
    image: "/phones/caeebc71f6ef1b265455c70621389a2fa15b83a5.png",
    features: ["32 Hours Playback", "Deep Bass Audio", "Dual EQ Modes"],
  },
  {
    name: "Bose QC Ultra",
    price: "$500",
    image: "/phones/cc3d3a3dd24894121979f7b360e77bf0466866eb.png",
    features: ["Immersive Audio", "Luxury Comfort", "ANC Enabled"],
  },
  {
    name: "Anker Space One",
    price: "$500",
    image: "/phones/ff7d8f98537b79b5613ae723616452027b334596.png",
    features: ["40 Hours Playback", "Hybrid ANC", "Comfort Fit"],
  },
  {
    name: "amazon basics",
    price: "$500",
    image: "/phones/ff7d8f98537b79b5613ae723616452027b334596.png",
    features: ["15 Hours Playback", "Lightweight", "Bluetooth 5.0"],
  },
];

export const productBrand = [
  {"id": 112,"name": "AIR MAX"}, 
  {"id": 104,"name": "AVEDA"},
  {"id": 107,"name": "COOLA"},
  {"id": 106,"name": "ELTA MD"},
  {"id": 105,"name": "FOREO"},
  {"id": 26, "name": "MZIZI"},
  {"id": 114,"name": "NOCTA"},
  {"id": 113,"name": "SNEAKERS"},
  {"id": 115,"name": "SNKRS"},
  {"id": 27, "name": "NIKE"}

]