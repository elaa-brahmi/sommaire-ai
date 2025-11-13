import {NextRequest,NextResponse} from 'next/server'
import Stripe from 'stripe';
import {handleCheckoutSessionCompleted,handleSubscriptionDeleted} from '@/lib/payments'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const GET = async () => {
    return NextResponse.json({
        status: 'Payments API is running',
        message: 'This endpoint handles Stripe webhook events via POST requests'
    });
}

export const POST = async (req: NextRequest) => {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({
            error: 'Stripe configuration is missing'
        }, { status: 500 });
    }

    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');
    
    if (!sig) {
        return NextResponse.json({
            error: 'No stripe signature found in request'
        }, { status: 400 });
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    try {
        // Verify the webhook signature
        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        
        // Create response
        const response = new NextResponse(JSON.stringify({ status: 'success' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Send response immediately
        response.headers.set('Connection', 'close');
        
        // Process the event after response is sent
        setTimeout(() => {
            processEvent(event).catch(error => {
                console.error('Error processing webhook event:', error);
            });
        }, 0);

        return response;
    } catch (err) {
        console.error('Webhook error:', err);
        return NextResponse.json({
            error: 'Failed to process webhook',
            details: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 400 });
    }
}

async function processEvent(event: Stripe.Event) {
    try {
        switch(event.type) {
            
            case 'checkout.session.completed':
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ['line_items']
                });
                await handleCheckoutSessionCompleted({session, stripe});
                break;
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                console.log('Subscription deleted:', subscription.id);
                const subscriptionId = event.data.object.id;
                await handleSubscriptionDeleted({subscriptionId,stripe});

                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error in processEvent:', error);
        // You might want to implement retry logic here or send to a dead letter queue
    }
}