<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\SubscriptionConfirmation;

use App\Http\Requests\PurchaseSubscriptionRequest;

class SubscriptionController extends Controller
{
    /**
     * Simulate a purchase and create a subscription.
     */
    public function purchase(PurchaseSubscriptionRequest $request)
    {
        $plan = Plan::with('vendor')->findOrFail($request->plan_id);
        $user = auth()->user();

        DB::beginTransaction();

        try {
            // Check if user already has an active subscription for any plan from this vendor
            $existing = Subscription::where('user_id', $user->id)
                ->whereHas('plan', function ($query) use ($plan) {
                    $query->where('vendor_id', $plan->vendor_id);
                })
                ->where('status', 'active')
                ->where('end_date', '>', Carbon::now())
                ->first();

            if ($existing) {
                if ($existing->plan_id == $plan->id) {
                    return response()->json(['message' => 'You already have an active subscription for this plan.'], 422);
                }

                // Upgrade: Update existing subscription
                $existing->update([
                    'plan_id' => $plan->id,
                    'start_date' => Carbon::now(),
                    'end_date' => Carbon::now()->addMonth(),
                ]);

                // Queue confirmation email
                Mail::to($user->email)->queue(new SubscriptionConfirmation($existing));
                DB::commit();
                return response()->json([
                    'message' => 'Subscription upgraded successfully!',
                    'subscription' => $existing->load('plan.vendor'),
                ], 200);
            }

            // New Purchase
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addMonth(),
                'status' => 'active',
            ]);

            // Queue confirmation email
            Mail::to($user->email)->queue(new SubscriptionConfirmation($subscription));

            DB::commit();

            return response()->json([
                'message' => 'Plan purchased successfully!',
                'subscription' => $subscription->load('plan.vendor'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Transaction failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the authenticated user's subscriptions.
     */
    public function mySubscriptions()
    {
        $subscriptions = Subscription::with('plan.vendor')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($subscriptions);
    }
}
