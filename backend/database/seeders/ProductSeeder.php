<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Getting Started with Subscriptions', 'description' => 'A basic guide for regular users.', 'is_premium' => false],
            ['name' => 'Monthly Trends Report', 'description' => 'Public trends and insights.', 'is_premium' => false],
            ['name' => 'Community Forum Access', 'description' => 'Discuss with other users.', 'is_premium' => false],
            ['name' => 'Exclusive Masterclass Video', 'description' => 'Deep dive into advanced topics for Premium members.', 'is_premium' => true],
            ['name' => 'Premium Strategy Blueprint', 'description' => 'The ultimate guide to success, only for our best subscribers.', 'is_premium' => true],
            ['name' => 'Early Access: Feature X', 'description' => 'Be the first to try out our upcoming features.', 'is_premium' => true],
            ['name' => 'Ad-Free Content Bundle', 'description' => 'Enjoy all content without interruptions.', 'is_premium' => true],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
