export const pricingPlans = [
    {
        name: 'Basic',
        price: 9,
        description: 'Perfect for occasional use',
        items: [
        '5 PDF summaries per month',
        'Standard processing speed',
        'Email support',
        ],
        id: 'basic',
        paymentLink:process.env.BASIC_PLAN_URL || '/#pricing',
        priceId: process.env.PRICE_ID_BASIC,
        },

    {
        id:'pro',
        name:'Pro',
        price:19,
        description: 'For professionals and teams',
        items: [
        'Unlimited PDF summaries',
        'Priority processing',
        '24/7 priority support',
        'Markdown Export',
        ],
        paymentLink:process.env.PRO_PLAN_URL || '/#pricing',
        priceId: process.env.PRICE_ID_PRO,

    },
];