<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'user',
            ]
        );

        // Clear existing vendors and plans to start fresh (cascading delete should handle plans)
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \App\Models\Plan::truncate();
        \App\Models\Vendor::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 2. Create Vendors and Plans
        $vendors = [
            [
                'name' => 'Netflix',
                'description' => 'Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime.',
                'logo' => 'https://i.pcmag.com/imagery/reviews/05cItXL96l4LE9n02WfDR0h-5..v1582751026.png',
                'plans' => [
                    ['name' => 'Basic', 'price' => 9.99, 'features' => ['720p resolution', 'Watch on 1 device', 'Unlimited movies']],
                    ['name' => 'Standard', 'price' => 15.49, 'features' => ['1080p resolution', 'Watch on 2 devices', 'Unlimited movies']],
                    ['name' => 'Premium', 'price' => 19.99, 'features' => ['4K+HDR resolution', 'Watch on 4 devices', 'Download on 6 devices']],
                ]
            ],
            [
                'name' => 'Spotify',
                'description' => 'Millions of songs and podcasts. No credit card needed.',
                'logo' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF4i2h_y9d6x6SR8ozro3iSxCMrF48ibbBIw&s',
                'plans' => [
                    ['name' => 'Individual', 'price' => 10.99, 'features' => ['Ad-free music', 'Play anywhere', 'Offline playback']],
                    ['name' => 'Duo', 'price' => 14.99, 'features' => ['2 Premium accounts', 'Ad-free music', 'Offline playback']],
                    ['name' => 'Family', 'price' => 16.99, 'features' => ['6 Premium accounts', 'Block explicit music', 'Offline playback']],
                ]
            ],
            [
                'name' => 'Amazon Prime',
                'description' => 'Fast delivery, Prime Video, and exclusive deals.',
                'logo' => 'https://variety.com/wp-content/uploads/2018/04/amazon-prime.jpg?w=942&h=530&crop=1',
                'plans' => [
                    ['name' => 'Monthly', 'price' => 14.99, 'features' => ['Prime Video', 'Free delivery', 'Prime Music']],
                    ['name' => 'Annual', 'price' => 139.00, 'features' => ['Best value', 'Prime Video', 'Free delivery', 'Prime Music']],
                ]
            ],
            [
                'name' => 'YouTube',
                'description' => 'Enjoy YouTube ad-free, offline, and in the background.',
                'logo' => 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png',
                'plans' => [
                    ['name' => 'Premium', 'price' => 13.99, 'features' => ['Ad-free video', 'Background play', 'YouTube Music Premium']],
                    ['name' => 'Family', 'price' => 22.99, 'features' => ['Up to 5 family members', 'Ad-free video', 'Background play']],
                ]
            ],
        ];

        foreach ($vendors as $vendorData) {
            $plans = $vendorData['plans'];
            unset($vendorData['plans']);
            
            $vendor = \App\Models\Vendor::create($vendorData);

            foreach ($plans as $planData) {
                $planData['vendor_id'] = $vendor->id;
                \App\Models\Plan::create($planData);
            }
        }

        // 3. Create Products
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
            \App\Models\Product::create($productData);
        }
    }
}
