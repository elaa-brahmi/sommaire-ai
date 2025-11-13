/* eslint-disable @typescript-eslint/no-unused-vars */
import Stripe from "stripe";
import { getDbConnection } from "./db";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

export async function handleCheckoutSessionCompleted({session,stripe}:{session:Stripe.Checkout.Session,stripe:Stripe}){
    console.log('checkout session completed',session);
    const customer_id = session.customer as string;
    const customer = await stripe.customers.retrieve(customer_id);
    const price_id = session.line_items?.data[0]?.price?.id;
    
    if('email' in customer && price_id){
        const {email, name} = customer;
        const sql = await getDbConnection();
        
        if (!sql) {
            throw new Error('Failed to get database connection');
        }

        try {
            // First create/update the user
            await createOrUpdateUser({
                sql,
                email: email as string,
                full_name: name as string,
                customer_id,
                price_id: price_id as string,
                status: 'active'
            });

            // Then create the payment
            await createPayment({
                sql,
                session,
                price_id: price_id as string,
                user_email: email as string
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }
}

export async function handleSubscriptionDeleted({
    subscriptionId,
    stripe
}: {
    subscriptionId: string;
    stripe: Stripe;
}) {
    console.log('subscription deleted');
    try {
        // Retrieve the subscription
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const sql = await getDbConnection();
        
        if (!sql) {
            throw new Error('Failed to get database connection');
        }

        // Update user status to cancelled
        await sql`
            UPDATE users 
            SET status = 'cancelled' 
            WHERE customer_id = ${subscription.customer}
        `;
        
        console.log('Successfully updated user status to cancelled');
    } catch (error) {
        console.error('Error deleting subscription:', error);
        throw error;
    }
}

async function createOrUpdateUser({
    sql,
    email,
    full_name,
    customer_id,
    price_id,
    status
}: {
    sql: NeonQueryFunction<false, false>,
    email: string,
    full_name: string,
    customer_id: string,
    price_id: string,
    status: string,
}){
    try {
        // Use UPSERT instead of SELECT + INSERT
        await sql`
            INSERT INTO users (email, full_name, customer_id, price_id, status)
            VALUES (${email}, ${full_name}, ${customer_id}, ${price_id}, ${status})
            ON CONFLICT (email) DO UPDATE
            SET full_name = EXCLUDED.full_name,
                customer_id = EXCLUDED.customer_id,
                price_id = EXCLUDED.price_id,
                status = EXCLUDED.status
        `;
    } catch(error) {
        console.error('error creating or updating user', error);
        throw error;
    }
}

async function createPayment({
    sql,
    session,
    price_id,
    user_email
}: {
    sql: NeonQueryFunction<false, false>,
    session: Stripe.Checkout.Session,
    price_id: string,
    user_email: string
}){
    try {
        const {amount_total, id, status} = session;
        await sql`
            INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email)
            VALUES (${amount_total}, ${status}, ${id}, ${price_id}, ${user_email})
        `;
    } catch(err) {
        console.error('error creating payment', err);
        throw err;
    }
}