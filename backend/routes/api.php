<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    VendorController,
    PlanController,
    SubscriptionController,
    ProductController
};
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/vendors', [VendorController::class, 'index']);
Route::get('/vendors/{vendor}', [VendorController::class, 'show']);
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{plan}', [PlanController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // Authenticated Routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Only Routes
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('vendors', VendorController::class)->except(['index', 'show']);
        Route::apiResource('plans', PlanController::class)->except(['index', 'show']);
    });

    // Normal User Routes
    Route::post('/purchase', [SubscriptionController::class, 'purchase']);
    Route::get('/my-subscriptions', [SubscriptionController::class, 'mySubscriptions']);
});
