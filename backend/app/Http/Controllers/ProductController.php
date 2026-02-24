<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Get a list of products based on user subscription level.
     */
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();
        $isPremium = $user ? $user->isPremium() : false;

        $query = Product::query();

        if (!$isPremium) {
            // Only regular products for non-premium/guests
            $query->where('is_premium', false);
        }

        $products = $query->latest()->get();

        return response()->json([
            'products' => $products,
            'is_premium_user' => $isPremium,
            'premium_teaser_count' => $isPremium ? 0 : Product::where('is_premium', true)->count()
        ]);
    }
}
