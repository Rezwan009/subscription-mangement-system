<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vendor;
use App\Models\Plan;
use Illuminate\Support\Facades\Schema;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Plan::truncate();
        Vendor::truncate();
        Schema::enableForeignKeyConstraints();

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
            
            $vendor = Vendor::create($vendorData);

            foreach ($plans as $planData) {
                $planData['vendor_id'] = $vendor->id;
                Plan::create($planData);
            }
        }
    }
}
