<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Subscription Confirmation</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #4f46e5; color: #ffffff; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px 30px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 20px 0; }
        .vendor-info { display: flex; align-items: center; margin-bottom: 20px; }
        .vendor-name { font-size: 18px; font-weight: 700; color: #1e293b; }
        .plan-details { margin-top: 15px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; }
        .detail-label { color: #64748b; font-size: 14px; }
        .detail-value { font-weight: 600; color: #0f172a; }
        .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
        .button { display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Subscription Confirmed!</h1>
        </div>
        <div class="content">
            <p>Hi {{ $subscription->user->name }},</p>
            <p>Thank you for subscribing! Your access to <strong>{{ $subscription->plan->vendor->name }}</strong> is now active. Here are your subscription details:</p>
            
            <div class="card">
                <div class="vendor-name">{{ $subscription->plan->vendor->name }}</div>
                
                <div class="plan-details">
                    <div class="detail-row">
                        <span class="detail-label">Plan Name</span>
                        <span class="detail-value">{{ $subscription->plan->name }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Price</span>
                        <span class="detail-value">${{ number_format($subscription->plan->price, 2) }}/month</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status</span>
                        <span class="detail-value" style="color: #10b981;">Active</span>
                    </div>
                    <div class="detail-row" style="border: none;">
                        <span class="detail-label">Expiration Date</span>
                        <span class="detail-value">{{ \Carbon\Carbon::parse($subscription->end_date)->format('F d, Y') }}</span>
                    </div>
                </div>
            </div>

            <p>You can manage your subscriptions at any time from your dashboard.</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173/dashboard" class="button">Go to Dashboard</a>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
            If you did not authorized this, please contact support.
        </div>
    </div>
</body>
</html>
