export interface Product {
  id: string;
  team: string;
  name: string;
  price: string;
  image: string;
  etsyUrl: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [
  // Houston Astros
  {
    id: "astros-1",
    team: "astros",
    name: "Women's Houston Astros Sequin Game Day Jersey",
    price: "$49.99",
    image: "/products/astros-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.9,
    reviews: 34,
    badge: "Best Seller",
  },
  {
    id: "astros-2",
    team: "astros",
    name: "Houston Astros Glitter Top — Space City Edition",
    price: "$44.99",
    image: "/products/astros-glitter-top.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.8,
    reviews: 21,
  },
  // Texas Rangers
  {
    id: "rangers-1",
    team: "rangers",
    name: "Women's Texas Rangers Sequin Jersey — Lone Star Blue",
    price: "$49.99",
    image: "/products/rangers-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.9,
    reviews: 28,
    badge: "New",
  },
  {
    id: "rangers-2",
    team: "rangers",
    name: "Texas Rangers Women's Glitter Game Day Shirt",
    price: "$42.99",
    image: "/products/rangers-glitter-shirt.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.7,
    reviews: 15,
  },
  // Houston Texans
  {
    id: "texans-1",
    team: "texans",
    name: "Women's Houston Texans Sequin Jersey — Battle Red",
    price: "$52.99",
    image: "/products/texans-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.9,
    reviews: 47,
    badge: "Best Seller",
  },
  {
    id: "texans-2",
    team: "texans",
    name: "Houston Texans NFL Women's Glitter Game Day Top",
    price: "$46.99",
    image: "/products/texans-glitter-top.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.8,
    reviews: 33,
  },
  // Dallas Cowboys
  {
    id: "cowboys-1",
    team: "cowboys",
    name: "Women's Dallas Cowboys Sequin Jersey — Silver Star",
    price: "$54.99",
    image: "/products/cowboys-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 5.0,
    reviews: 62,
    badge: "Top Rated",
  },
  {
    id: "cowboys-2",
    team: "cowboys",
    name: "Dallas Cowboys Women's Glitter Game Day Fashion Top",
    price: "$48.99",
    image: "/products/cowboys-glitter-top.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.9,
    reviews: 41,
  },
  // Houston Rockets
  {
    id: "rockets-1",
    team: "rockets",
    name: "Women's Houston Rockets Sequin Jersey — Red Hot",
    price: "$47.99",
    image: "/products/rockets-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.8,
    reviews: 19,
    badge: "New",
  },
  {
    id: "rockets-2",
    team: "rockets",
    name: "Houston Rockets NBA Women's Glitter Top",
    price: "$43.99",
    image: "/products/rockets-glitter-top.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.7,
    reviews: 12,
  },
  // San Antonio Spurs
  {
    id: "spurs-1",
    team: "spurs",
    name: "Women's San Antonio Spurs Sequin Jersey — Silver Edition",
    price: "$49.99",
    image: "/products/spurs-sequin-jersey.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.9,
    reviews: 26,
    badge: "Best Seller",
  },
  {
    id: "spurs-2",
    team: "spurs",
    name: "San Antonio Spurs Women's Glitter Game Day Shirt",
    price: "$44.99",
    image: "/products/spurs-glitter-shirt.jpg",
    etsyUrl: "https://www.etsy.com/shop/GlitterGameDay",
    rating: 4.8,
    reviews: 18,
  },
];
