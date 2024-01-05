DROP DATABASE IF EXISTS flyguy2023;

CREATE DATABASE flyguy2023;

\c flyguy2023;

CREATE EXTENSION "uuid-ossp";

CREATE TYPE order_status AS ENUM ('new', 'paid', 'canceled', 'fulfilled');

CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID,
    reviewer VARCHAR(50),
    content VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50),
    price MONEY,
    current_price MONEY,
    photo_url VARCHAR(100),
    description TEXT,
    long_description TEXT,
    ingredients TEXT
);

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    external_provider_id VARCHAR(255) UNIQUE,
    name VARCHAR(50),
    email VARCHAR(50),
    role VARCHAR(50),
    stripe_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    customer_name VARCHAR(255) NOT NULL,
    user_id UUID,
    order_total MONEY,
    status order_status
);

CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id INT,
    product_id UUID,
    quantity INT NOT NULL,
    order_item_total MONEY NOT NULL
    -- FOREIGN KEY (order_id) REFERENCES orders(id),
    -- FOREIGN KEY (product_id) REFERENCES products(id)
);



INSERT INTO products (name, price, current_price, photo_url, description, long_description, ingredients)
VALUES 
    ('Moon Dust', 16, 10, 'https://flyguy-store.s3.us-east-2.amazonaws.com/moondust.jpg', 'Matte texture powder', 'Matte texture powder', 'Aloe Barbadensis (Aloe Vera) Leaf Juice*, Water (Aqua), Silica Silylate, Silica Dimethicone Silylate, Hydrolyzed Chestnut Extract, Hydrolyzed Adansonia Digitata (Baobab) Seed Protein, Hydrolyzed Soy Protein, Hydrolyzed Quinoa, Lavandula Angustifolia (Lavender) Flower Extract*, Camellia Sinensis (Green Tea) Leaf Extract*, Tapioca Starch, Galactoarabinan, Coco-glucoside, Fragrance, Dimethicone/Vinyl Dimethicone Crosspolymer, Silica, VP/VA Copolymer, Phenoxyethanol, Sodium Benzoate, Citric Acid'),
    ('Solar Wind', 18, 12, 'https://flyguy-store.s3.us-east-2.amazonaws.com/solarwind.jpg', 'Sea-salt spray', 'Sea-salt spray', 'Aloe Barbadensis (Aloe Vera) Leaf Juice*, Water (Aqua), Alcohol Denat., Glycerin*, Hydrolyzed Quinoa, Hydrolyzed Adansonia Digitata (Baobab) Seed Protein, Hydrolyzed Rice Protein, Lavandula Angustifolia (Lavender) Flower Extract*, Camellia Sinensis (Green Tea) Leaf Extract*, Xylitylglucoside, Coco-glucoside, Anhydroxylitol, Dead Sea Salt, Xylitol, Galactoarabinan, Fragrance, VP/VA Copolymer, Phenoxyethanol, Benzyl Alcohol'),
    ('Star Dew', 20, 14, 'https://flyguy-store.s3.us-east-2.amazonaws.com/stardew.jpg', 'Hybrid grooming cream and curl enhancer', 'Hybrid grooming cream and curl enhancer', 'Aloe Barbadensis (Aloe Vera) Leaf Juice*, Water (Aqua), Caprylic/Capric Triglyceride, Glyceryl Sterate SE, Cetearyl Alcohol, Glycerin*, Dimethicone Cetearyl Glucoside, Hydrolyzed Chestnut Extract, Adansonia Digitata (Baobab) Seed Protein, Hydrolyzed Quinoa, Lavandula Angustifolia (Lavender) Flower Extract*, Camellia Sinensis (Green Tea) Leaf Extract*, Hydrolyzed Soy Protein, Panthenol, Coconut Alkanes, Pullulan, Sorbitol, Xylitol, Trehalose, Coco-caprylate/Caprate, Acacia Senegal Gum, Simmondsia Chinensis (Jojoba) Seed Oil*, Salvia Hispanica (Chia) Seed Oil, Galactoarabinan, Tocopheryl Acetate, Cinnamidopropyltrimonium, Chloride, Behentrimonium Methosulfate, Fragrance, Olealkonium Chloride, Guar Hydroxypropyltrimonium Chloride, Polyquaternium-7, Polyquaternium-55, Phenoxyethanol, Benzyl Alcohol');