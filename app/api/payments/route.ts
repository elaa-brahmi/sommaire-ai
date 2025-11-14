import {NextRequest,NextResponse} from 'next/server'
import { Buffer } from 'buffer';
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

    // Read raw body as ArrayBuffer and convert to Buffer to preserve
    // exact bytes for Stripe signature verification. Pass Buffer directly
    // to stripe.webhooks.constructEvent (avoid string conversions).
    const arr = await req.arrayBuffer();
    const payload = Buffer.from(arr);
    const sig = req.headers.get('stripe-signature');

    // Helpful debug info when developing locally (trimmed signature)
    console.log('Incoming Stripe signature header:', sig ? sig.slice(0, 80) : 'none');
    console.log('Incoming payload length (bytes):', payload.length);
    // Show a short payload preview to verify formatting (no more than 200 chars)
    try {
        console.log('Payload preview:', payload.toString('utf8', 0, 200));
    } catch (e) {
        console.log('Payload preview unavailable');
    }
    
    if (!sig) {
        return NextResponse.json({
            error: 'No stripe signature found in request'
        }, { status: 400 });
    }

    let event;
    
  try {
        event = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    // IMPORTANT: Process BEFORE returning
    try {
        await processEvent(event);
    } catch (err) {
        console.error("Webhook handler failed:", err);
        return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });

}

async function processEvent(event: Stripe.Event) {
    try {
        switch(event.type) {
            
            case 'checkout.session.completed':
                console.log('Checkout session completed:', event.data.object.id);
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