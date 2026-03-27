import { Question } from '../utils/quizUtils';

export const QUIZ_QUESTIONS_PER_ATTEMPT = 3;

export interface Topic {
  id: string;
  icon: string;
  title: string;
  summary: string;
  duration: string;
  type: 'lesson' | 'guide';
  keyPoints: string[];
  content: string;
  quiz?: Question[];
}

// ─── LESSONS (sequential, quiz-gated) ────────────────────────────────────────

export const TOPICS: Topic[] = [
  {
    id: '1',
    icon: 'trending-up-outline',
    title: 'What is Investing?',
    summary: 'Learn the basics of growing your money over time.',
    duration: '6 min read',
    type: 'lesson',
    keyPoints: [
      'Higher returns come with higher risk — understanding your tolerance is key',
      'Diversification across assets protects you when one investment fails',
      'Starting early is the single biggest advantage — time multiplies every dollar',
    ],
    content: `Investing means putting your money to work so it can grow over time. Instead of letting money sit idle in a low-interest savings account, you deploy it into assets — things that have the potential to increase in value or generate income.

The Core Concepts

Return: The profit you make on an investment. Returns can come from price appreciation (the asset becomes worth more over time) or income such as dividends or interest payments. Return is how you measure whether an investment was worthwhile.

Risk: The possibility that your investment loses value. Higher potential returns almost always come with higher risk. A startup stock might triple in value — or go to zero. A government bond is unlikely to do either. Understanding your personal risk tolerance means being honest about how much loss you could stomach without making a panicked decision.

Diversification: Spreading your investments across different assets, sectors, and geographies to reduce risk. If all your money is in one company's stock and that company fails, you lose everything. Spread across 500 companies via an index fund and one failure barely moves the needle.

Time Horizon: How long you plan to keep money invested before needing it. A 20-year-old investing for retirement has a 40+ year time horizon and can afford to ride out downturns. Someone saving for a car purchase next year should not be in volatile stocks.

Asset Classes Explained

Stocks represent ownership in companies. They offer the highest long-term return potential but the highest short-term volatility. Bonds are loans to governments or corporations — steadier, lower returns. Real estate includes physical property or REITs (Real Estate Investment Trusts), a good inflation hedge. Cash equivalents like money market funds and CDs carry the lowest risk and the lowest return.

Index Funds vs Active Funds

An index fund passively tracks a market index like the S&P 500 — the 500 largest US companies — and charges very low fees. Active funds are managed by professionals who try to beat the market. They charge higher fees and, statistically, most fail to outperform index funds over the long run. For beginners, low-cost index funds are the recommended starting point by nearly every financial expert.

Why Start Early?

Compound interest is the single biggest reason to start now. One thousand dollars invested at 7% annual return becomes approximately $1,967 in 10 years, $3,870 in 20 years, $7,612 in 30 years, and $14,974 in 40 years — without adding a single additional dollar. Waiting just 10 years to start cuts your ending balance nearly in half.

Common Beginner Mistakes

Trying to time the market means waiting for the "perfect" moment to invest, which almost always results in missing gains. Time in the market beats timing the market. Checking your portfolio daily leads to emotional decisions — set it and review quarterly at most. Investing money you might need soon is another trap: keep at least 3 to 6 months of expenses as accessible cash before putting anything in the market.

Where to Start as a Student

Open a Roth IRA if you have any earned income — contributions and gains grow completely tax-free, and withdrawals in retirement are not taxed at all. Use a free brokerage like Fidelity or Schwab with no account minimums. Start with a total market or S&P 500 index fund. Automate a small monthly contribution — even $10 builds the habit. The amount matters far less than getting started.`,
    quiz: [
      {
        question: 'What does diversification mean in investing?',
        options: [
          'Putting all your money in one stock',
          'Spreading investments across different assets to reduce risk',
          'Only investing in government bonds',
          'Saving money in a bank account',
        ],
        answer: 1,
      },
      {
        question: 'Why is starting to invest early beneficial?',
        options: [
          'You pay less taxes when you start young',
          'The stock market always goes up',
          'Compound interest has more time to grow your money',
          'Banks give you better interest rates',
        ],
        answer: 2,
      },
      {
        question: 'What is a Roth IRA best known for?',
        options: [
          'High guaranteed interest savings',
          'Tax-free growth on contributions',
          'Government-guaranteed returns',
          'No contribution limits whatsoever',
        ],
        answer: 1,
      },
      {
        question: 'What is a "return" in investing?',
        options: [
          'The fee you pay a broker',
          'The profit made on an investment',
          'The original amount you invested',
          'The interest rate on a savings account',
        ],
        answer: 1,
      },
      {
        question: 'What is "risk" in an investment context?',
        options: [
          'The guaranteed profit you earn',
          'The chance that you could lose money',
          'The cost of buying a stock',
          'The annual management fee charged by a fund',
        ],
        answer: 1,
      },
      {
        question: 'What is an index fund?',
        options: [
          'A fund that hand-picks the best individual stocks',
          'A fund that automatically diversifies across many companies by tracking a market index',
          'A government-guaranteed savings product',
          'A type of high-yield savings account',
        ],
        answer: 1,
      },
      {
        question: 'What does "time horizon" mean for an investor?',
        options: [
          'How long the stock market has existed',
          'The number of stocks currently in your portfolio',
          'How long you plan to keep your money invested',
          'The time it takes a stock to recover from a loss',
        ],
        answer: 2,
      },
      {
        question: 'What is the key advantage of a Roth IRA over a traditional IRA for a young investor?',
        options: [
          'You can contribute more money per year',
          'Contributions and gains grow tax-free and withdrawals in retirement are not taxed',
          'There is no income limit to contribute',
          'Employers are required to match your contributions',
        ],
        answer: 1,
      },
      {
        question: 'What does it mean to "rebalance" a portfolio?',
        options: [
          'Sell all investments and start over from scratch',
          'Adjust holdings back to your target allocation after market movements have shifted it',
          'Move money from bonds to stocks only when markets are at a low',
          'Remove any investments that have lost money',
        ],
        answer: 1,
      },
      {
        question: 'What is the main argument against actively managed funds compared to index funds?',
        options: [
          'They are illegal in most states',
          'Most fail to beat the market over the long run while charging higher fees',
          'They cannot hold bonds in the same portfolio',
          'They only invest in foreign companies',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '2',
    icon: 'bar-chart-outline',
    title: 'Stocks vs Bonds',
    summary: 'Understand the two most common investment types.',
    duration: '6 min read',
    type: 'lesson',
    keyPoints: [
      'Stocks offer higher returns with higher risk; bonds offer stability with lower returns',
      'Your age and time horizon should determine your stock-to-bond ratio',
      'ETFs let you own hundreds of stocks or bonds in a single, low-cost purchase',
    ],
    content: `Stocks and bonds are the two most fundamental building blocks of any investment portfolio. Understanding how they differ — and how they complement each other — is essential before investing a single dollar.

Stocks: Owning a Piece of a Business

When you buy a stock, you become a part-owner of that company. If the company's profits grow, your shares increase in value. Many companies also pay dividends — regular cash payments to shareholders from profits.

Key characteristics of stocks: The S&P 500 has returned approximately 7 to 10 percent per year historically. Prices can swing 20 to 30 percent in a single year, so stocks carry high volatility. There is no guaranteed return — you can lose your entire investment in a failing company. Stocks are best for goals five or more years away, giving time to ride out downturns.

Stocks are further divided by company size. Large-cap companies like Apple and Microsoft are more stable but slower-growing. Small-cap companies offer higher growth potential with higher risk. Mid-cap sits in between.

Bonds: Lending Money for a Promised Return

When you buy a bond, you are lending money to a government or corporation. In return, they promise to pay you a fixed interest rate (called the coupon) for a set period, then return your original investment (the principal) at maturity.

Key characteristics of bonds: Typical returns range from 2 to 5 percent per year. Risk is lower because income is predictable and contractual. Bonds are best for short-term goals or preserving existing wealth. One important dynamic: bond prices and interest rates move in opposite directions. When interest rates rise, existing bond values fall.

Types of bonds include US Treasury bonds (the safest, backed by the government), corporate bonds (higher yield, more risk), and municipal bonds (often tax-advantaged for the investor).

How Stocks and Bonds Work Together

Stocks and bonds often move in opposite directions. When the stock market drops, investors frequently move money into bonds as a safe haven, pushing bond prices up. This inverse relationship is exactly why owning both reduces overall portfolio volatility — when one is falling, the other often holds steady or rises.

The classic 60/40 portfolio — 60% stocks, 40% bonds — was the standard balanced allocation for decades. Today, with longer life expectancies and students having 40+ years until retirement, many financial advisors suggest younger investors lean more heavily toward stocks.

Finding Your Allocation

The "110 minus your age" rule of thumb is a practical starting point. A 20-year-old puts 90% in stocks and 10% in bonds. A 50-year-old moves to 60% stocks and 40% bonds. As you approach your goal, you shift toward bonds to protect accumulated gains.

Asset allocation is not a one-time decision. It should be reviewed and rebalanced at least once a year. If stocks have a great year, your 90/10 split might drift to 95/5, leaving you more exposed to a market drop than intended.

ETFs: The Practical Solution for Beginners

Exchange-Traded Funds (ETFs) let you own a basket of stocks or bonds in a single purchase. A total stock market ETF gives you instant exposure to thousands of companies. A bond ETF does the same for fixed income. For most students, a simple two-fund portfolio — one broad stock ETF and one bond ETF — covers the essentials at minimal cost and effort.`,
    quiz: [
      {
        question: 'When you buy a stock, what are you actually buying?',
        options: [
          'A loan to a company',
          'A small ownership stake in a company',
          'A government savings bond',
          'A certificate of deposit',
        ],
        answer: 1,
      },
      {
        question: 'Which investment type is generally considered lower risk?',
        options: ['Stocks', 'Cryptocurrency', 'Bonds', 'Real estate'],
        answer: 2,
      },
      {
        question: 'What is asset allocation?',
        options: [
          'Buying only one type of investment',
          'Distributing investments across different asset types based on goals and time horizon',
          'Selling all investments when the market drops',
          'Only investing in index funds',
        ],
        answer: 1,
      },
      {
        question: 'What is the approximate historical annual return of the S&P 500?',
        options: ['1–3%', '4–6%', '7–10%', '15–20%'],
        answer: 2,
      },
      {
        question: 'What makes bonds generally less risky than stocks?',
        options: [
          'They are backed by physical gold',
          'They offer a fixed, predictable return through contractual interest payments',
          'They never lose value under any circumstances',
          'They are only issued by governments',
        ],
        answer: 1,
      },
      {
        question: 'Which is generally better suited for a financial goal 10+ years away?',
        options: ['Bonds', 'Savings accounts', 'Stocks', 'Cash held at home'],
        answer: 2,
      },
      {
        question: 'Using the "110 minus age" rule, what stock allocation fits a 20-year-old?',
        options: ['70%', '80%', '90%', '100%'],
        answer: 2,
      },
      {
        question: 'What does it mean when a company "pays a dividend"?',
        options: [
          'The company buys back its own shares from the market',
          'The company distributes a portion of its profits directly to shareholders',
          'The stock price automatically increases by the dividend amount',
          'Shareholders pay an extra annual fee to hold the stock',
        ],
        answer: 1,
      },
      {
        question: 'What happens to existing bond prices when interest rates rise?',
        options: [
          'Bond prices rise as well',
          'Bond prices stay the same',
          'Bond prices fall',
          'Bond prices double immediately',
        ],
        answer: 2,
      },
      {
        question: 'What is a two-fund portfolio?',
        options: [
          'A portfolio with exactly two individual stocks',
          'A simple portfolio combining one total stock market ETF and one bond ETF',
          'A portfolio split between two separate brokerage accounts',
          'Two savings accounts at different banks',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '3',
    icon: 'stats-chart-outline',
    title: 'Compound Interest',
    summary: 'The most powerful force in personal finance.',
    duration: '6 min read',
    type: 'lesson',
    keyPoints: [
      'Compound interest earns returns on your returns — the effect accelerates dramatically over time',
      'The Rule of 72: divide 72 by your return rate to find how long it takes to double your money',
      'Compound interest also works against you in high-interest debt — that always comes first',
    ],
    content: `Compound interest is often called the eighth wonder of the world, and for good reason. It is the mechanism by which small amounts of money, given enough time, transform into life-changing wealth.

Simple vs Compound: The Core Difference

Simple interest means you earn interest only on your original principal.
$1,000 at 10% simple interest for 5 years gives you $500 in interest — $100 each year — for a total of $1,500.

Compound interest means you earn interest on your principal AND on all previously earned interest.
$1,000 at 10% compound interest for 5 years gives you $1,611 — $111 more than simple interest, and the gap widens every year.

Over decades, the difference becomes staggering. $1,000 at 7% compound interest: after 10 years, $1,967. After 20 years, $3,870. After 30 years, $7,612. After 40 years, $14,974. That is nearly 15 times your original money without contributing a single additional dollar.

The Formula

A = P(1 + r/n)^(nt)

A is the final amount. P is the principal, your starting amount. r is the annual interest rate as a decimal — so 7% becomes 0.07. n is how many times interest compounds per year — monthly compounding means n equals 12. t is time in years.

The more frequently interest compounds, the faster your money grows. Monthly compounding produces slightly more than annual compounding at the same stated rate, because each month's interest starts earning its own interest one month sooner.

The Rule of 72

A fast mental shortcut: divide 72 by your annual return rate to estimate how many years it takes to double your money.

At 6% return, 72 divided by 6 equals 12 years to double. At 8%, you double in 9 years. At 12%, in just 6 years. This rule works reasonably well for rates between 4% and 15%.

The Power of Starting Early

Two students, identical income and investment amounts:

Alex invests $200 per month starting at age 22 and stops at age 32. Total invested: $24,000 over 10 years.
Jordan waits until age 32 and invests $200 per month all the way to age 62. Total invested: $72,000 over 30 years.

At age 62, assuming 7% annual returns: Alex ends up with approximately $560,000. Jordan ends up with approximately $243,000.

Alex invested one-third as much money but ends up with more than twice as much — because of that 10-year head start. This is the most important lesson in personal finance.

Compounding Works Against You Too

The exact same mathematical force that builds wealth through investing destroys it through debt. A $3,000 credit card balance at 20% APR, making only minimum payments, could take 10 or more years to pay off and cost over $5,000 in interest — more than the original balance.

This is why eliminating high-interest debt is always the first financial priority, before investing a single dollar. The compound interest working against you on that debt is a guaranteed 20% loss that no investment can reliably overcome.

The Practical Takeaway

You do not need a high salary, perfect timing, or a financial advisor. You need three things: start as early as possible, invest consistently, and leave the money alone. A $25 automatic monthly transfer today — through the power of compound growth — is worth dramatically more than a large investment made 10 years from now. Time is the one ingredient that money cannot buy back.`,
    quiz: [
      {
        question: 'What makes compound interest different from simple interest?',
        options: [
          'It has higher stated interest rates',
          'You earn interest on both your principal and previously earned interest',
          'It is only available through investment banks',
          'It guarantees that you will not lose money',
        ],
        answer: 1,
      },
      {
        question: 'In the formula A = P(1 + r/n)^(nt), what does P represent?',
        options: [
          'The final amount after growth',
          'The annual interest rate',
          'The principal or starting amount',
          'Time in years',
        ],
        answer: 2,
      },
      {
        question: 'What is the biggest factor that maximizes compound interest growth?',
        options: [
          'Having the highest possible interest rate',
          'Starting early and giving your money more time to grow',
          'Making one large deposit rather than regular contributions',
          'Choosing monthly rather than annual compounding',
        ],
        answer: 1,
      },
      {
        question: 'In the formula A = P(1 + r/n)^(nt), what does "n" represent?',
        options: [
          'The number of years you invest',
          'How many times interest compounds per year',
          'The annual interest rate as a decimal',
          'The final amount you receive',
        ],
        answer: 1,
      },
      {
        question: '$1,000 at 10% simple interest for 3 years totals how much?',
        options: ['$1,100', '$1,200', '$1,300', '$1,331'],
        answer: 2,
      },
      {
        question: '$1,000 at 10% compound interest for 3 years totals approximately how much?',
        options: ['$1,300', '$1,331', '$1,100', '$1,210'],
        answer: 1,
      },
      {
        question: 'Why does more frequent compounding (monthly vs annually) produce slightly more growth?',
        options: [
          'It changes the principal amount each month',
          'Interest is added more often, so it starts earning its own interest sooner',
          'It reduces the effective interest rate charged',
          'Banks waive fees for monthly compounding',
        ],
        answer: 1,
      },
      {
        question: 'Using the Rule of 72, how many years does it take to double money at a 9% return?',
        options: ['6 years', '8 years', '9 years', '12 years'],
        answer: 1,
      },
      {
        question: 'Alex invests for 10 years starting at 22 then stops. Jordan starts at 32 and invests for 30 years. Same rate and monthly amount. Who has more at 62?',
        options: [
          'Jordan, because they invested more total dollars',
          'Alex, because the early decade of compounding outweighs Jordan\'s larger total contribution',
          'They end up with exactly the same amount',
          'It depends entirely on what they invested in',
        ],
        answer: 1,
      },
      {
        question: 'How does compound interest work against you in debt?',
        options: [
          'It automatically reduces your credit score',
          'Unpaid interest gets added to your balance, so you owe interest on interest',
          'Banks charge a compound fee for any late payments',
          'It only applies to investment accounts, not to debt',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '4',
    icon: 'shield-checkmark-outline',
    title: 'Emergency Fund',
    summary: 'Why every student needs one and how to build it.',
    duration: '5 min read',
    type: 'lesson',
    keyPoints: [
      'An emergency fund prevents one bad day from becoming months of high-interest debt',
      'Keep it in a High-Yield Savings Account — accessible, separate, never invested in stocks',
      'Start with a $500 goal, automate small transfers, and build from there',
    ],
    content: `An emergency fund is not optional. It is the single most important financial step you can take before doing anything else with your money — before investing, before aggressively paying down debt, before anything else.

Why It Matters More Than You Think

Without an emergency fund, every unexpected expense becomes a financial crisis. A $400 car repair, an ER visit, a laptop dying before finals, a flight home for a family emergency — these become high-interest credit card debt. And credit card debt at 20%+ APR compounds against you at the same relentless rate that investments compound for you.

Statistics make this stark: roughly 40% of Americans cannot cover a $400 emergency without borrowing. If that happens repeatedly, you never escape the cycle — each emergency wipes out whatever progress you have made. With a funded emergency fund, you handle the unexpected without disrupting your financial plan at all.

How Much Do You Need?

For students, $500 to $1,000 is a realistic starting goal. This amount covers most common emergencies — a textbook you forgot to budget for, a plane ticket home, a broken phone, a car registration fee you forgot about.

For working adults, the standard is 3 to 6 months of essential living expenses. Calculate your real monthly costs: rent, utilities, groceries, transportation, and minimum loan payments. Multiply by 3 or 6. This is your target.

For self-employed individuals or people with irregular income, 6 to 12 months provides the necessary buffer because income variability makes a longer cushion essential.

What Counts as an Emergency?

Legitimate emergencies include job loss, unexpected medical or dental bills, essential car or appliance repairs, and emergency travel. These are things you could not have predicted and cannot delay addressing.

Not emergencies: a sale on something you wanted, concert tickets, a holiday gift, a new phone because your current one is two years old. Having an emergency fund does not make these things affordable — it exists specifically to protect against genuine crises. Using it for non-emergencies defeats the entire purpose.

Where to Keep It

A High-Yield Savings Account (HYSA) at an online bank is the right answer. Online banks like Marcus by Goldman Sachs, Ally, SoFi, and American Express High Yield Savings consistently offer rates well above what traditional banks pay — compare current APYs at bankrate.com or nerdwallet.com, as rates shift with the broader interest rate environment. The money is FDIC insured, just as safe as any bank account, and accessible within 1 to 2 business days.

Three non-negotiable rules: Keep it completely separate from your checking account — proximity to money creates temptation to spend it. Do not invest it in stocks or any market-linked product — emergency funds must be available immediately, not subject to whether the market is up or down. Keep it liquid, not locked in a CD or retirement account where early withdrawal carries penalties.

Building It From Zero

Start with a target of $500. Break it down: $500 over 10 months is $50 per month, or about $12 per week. Set up an automatic transfer on payday — even $10. You will not notice it leaving, and in six months you will have a meaningful cushion. Treat this transfer exactly like a bill payment: non-negotiable, automatic, not something you think about.

Every time your income increases — a raise, a new job, a tax refund — increase your transfer amount. Once you hit your initial $500 target, set the next goal at $1,000. Once employed full-time, build toward 3 months of expenses.

The Psychological Benefit

Beyond the math, an emergency fund changes how you feel about your finances. Knowing you can handle a bad day without going into debt removes a specific kind of financial anxiety that sits in the background of everyday life. Financial security is not just about the numbers — it is about removing fear. Build the fund. Keep it funded. Everything else in personal finance gets easier from there.`,
    quiz: [
      {
        question: 'What is the recommended emergency fund size for a working adult?',
        options: [
          '$500',
          '$1,000',
          '3 to 6 months of essential living expenses',
          'Exactly 1 year of your salary',
        ],
        answer: 2,
      },
      {
        question: 'Where is the best place to keep an emergency fund?',
        options: [
          'Invested in stocks for long-term growth',
          'Under your mattress for fastest access',
          'In a high-yield savings account',
          'In a cryptocurrency wallet',
        ],
        answer: 2,
      },
      {
        question: 'Why is an emergency fund important?',
        options: [
          'It helps you afford luxury purchases',
          'It prevents unexpected expenses from forcing you into high-interest debt',
          'It replaces the need for any kind of insurance',
          'It earns the highest possible investment returns',
        ],
        answer: 1,
      },
      {
        question: 'How much should a student aim for as an initial emergency fund target?',
        options: [
          '$50 to $100',
          '$500 to $1,000',
          '$5,000 to $10,000',
          '$20,000',
        ],
        answer: 1,
      },
      {
        question: 'Why should an emergency fund be kept separate from your checking account?',
        options: [
          'It is required by law to keep them separate',
          'Separation earns you better interest automatically',
          'Keeping it separate reduces the temptation to spend it on non-emergencies',
          'Checking accounts cannot legally hold large balances',
        ],
        answer: 2,
      },
      {
        question: 'What is a High-Yield Savings Account (HYSA)?',
        options: [
          'A checking account with no monthly fees',
          'A savings account that earns significantly more interest than a traditional bank account',
          'An investment account for buying stocks',
          'A type of personal loan with low interest',
        ],
        answer: 1,
      },
      {
        question: 'What is the most effective strategy for building an emergency fund?',
        options: [
          'Save a large lump sum once per year from your tax refund',
          'Set up automatic small transfers on each payday so it happens without thinking',
          'Only save whatever money is left over at the end of each month',
          'Invest in stocks and sell them whenever an emergency arises',
        ],
        answer: 1,
      },
      {
        question: 'Which of the following is NOT a legitimate use of an emergency fund?',
        options: [
          'Unexpected car engine failure',
          'Emergency dental work',
          'A sale on a new TV you have been wanting',
          'An unexpected medical bill',
        ],
        answer: 2,
      },
      {
        question: 'What is the recommended emergency fund size for self-employed individuals?',
        options: [
          '$500 to $1,000',
          '3 months of expenses',
          '6 to 12 months of expenses',
          '1 month of expenses',
        ],
        answer: 2,
      },
      {
        question: 'Why should an emergency fund NOT be invested in stocks?',
        options: [
          'Stocks are illegal to hold in savings accounts',
          'Emergency funds must be immediately accessible and cannot be subject to market swings',
          'Stocks never earn as much as savings accounts',
          'The government taxes stock gains at a higher rate for emergency funds',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '5',
    icon: 'card-outline',
    title: 'Credit Score Basics',
    summary: 'What it is, why it matters, and how to build it.',
    duration: '7 min read',
    type: 'lesson',
    keyPoints: [
      'Payment history is 35% of your score — one late payment can drop it 60–100 points',
      'Keep your credit utilization below 30%, ideally below 10%',
      'Start with a secured card or become an authorized user on a parent\'s account',
    ],
    content: `Your credit score is a three-digit number between 300 and 850. It represents one thing: how likely you are to repay debt on time. Lenders, landlords, and even some employers use it to make important decisions about you.

Why It Has a Massive Financial Impact

The difference between a 620 and a 760 credit score on a $30,000 car loan could mean paying $5,000 to $8,000 more in interest over the life of the loan. On a 30-year mortgage, the gap between excellent and poor credit can represent tens of thousands of dollars in extra interest paid. A high credit score also affects your ability to rent an apartment — many landlords run credit checks before approving applications. Building good credit early is one of the highest-return actions you can take, measured purely in money saved.

The Five Factors That Make Up Your FICO Score

Payment history accounts for 35% and is the single most important factor. Pay every bill on time, every time. A single 30-day late payment can drop your score by 60 to 100 points and remains on your credit report for 7 years. Setting up autopay for at least the minimum on every account eliminates this risk entirely.

Credit utilization accounts for 30%. This is the ratio of your current balance to your total credit limit. If your limit is $1,000 and your balance is $400, your utilization is 40% — which is too high. Keep it below 30%. Below 10% earns you the best scores. An important nuance: this is measured when your statement closes each month, not when you make your payment.

Length of credit history accounts for 15%. Older accounts improve your score because they demonstrate a longer track record. This is why you should never close your oldest credit card, even if you have not used it in years. Average age of all accounts matters, so opening many new cards at once damages this factor.

Credit mix accounts for 10%. Having both revolving credit (credit cards) and installment loans (student loans, car loans) helps slightly. You should not take on debt purely for this factor — your existing student loans already contribute positively here.

New inquiries account for 10%. Each time you formally apply for credit, a hard inquiry appears on your report and temporarily lowers your score by a few points. Multiple applications in a short window are particularly damaging. Space out credit applications and only apply when you have a specific need.

FICO vs VantageScore

FICO scores are used by 90% of top lenders and are the most important for major financial decisions. VantageScore is a competing model used by many free credit monitoring services like Credit Karma. The scores may differ slightly but are calculated from similar factors. When planning for a loan, your FICO score is what matters most.

Score Ranges

Exceptional scores of 800 to 850 qualify you for the best available rates on any loan. Very Good scores from 740 to 799 mean approval for almost everything at competitive rates. Good scores from 670 to 739 mean most loans are approved but at slightly higher rates. Fair scores from 580 to 669 result in higher rates and some denials. Below 580 is considered Poor — you may need a co-signer or secured loan to get approved at all.

Building Credit as a Student

A secured credit card requires you to deposit $200 to $500 as collateral, which becomes your credit limit. Use it for small recurring expenses like a streaming subscription or gas, and pay the full balance monthly. After 6 to 12 months of on-time payments, you will have a meaningful credit history.

Becoming an authorized user means asking a parent with good credit to add you to their existing card account. You inherit their positive payment history — you do not even need to use the card or see the statements for it to benefit your score.

Monitor your credit for free using Credit Karma, Experian's free tier, or your bank's built-in credit score tools. Check monthly and dispute anything inaccurate at annualcreditreport.com, where you are entitled to one free report per bureau per year.`,
    quiz: [
      {
        question: 'What is the most important factor affecting your credit score?',
        options: [
          'Credit utilization',
          'Payment history',
          'Length of credit history',
          'Credit mix',
        ],
        answer: 1,
      },
      {
        question: 'What credit utilization rate is generally recommended for a good score?',
        options: [
          'Below 70%',
          'Below 50%',
          'Below 30%',
          'It does not matter as long as you pay on time',
        ],
        answer: 2,
      },
      {
        question: 'What credit score range is considered "Exceptional"?',
        options: [
          '670 to 739',
          '740 to 799',
          '800 to 850',
          '580 to 669',
        ],
        answer: 2,
      },
      {
        question: 'What percentage of your credit score does payment history represent?',
        options: ['10%', '20%', '30%', '35%'],
        answer: 3,
      },
      {
        question: 'What credit score range is considered "Good"?',
        options: [
          '580 to 669',
          '670 to 739',
          '740 to 799',
          '800 to 850',
        ],
        answer: 1,
      },
      {
        question: 'What typically happens to your score when you apply for new credit?',
        options: [
          'It always improves because it shows financial activity',
          'It is temporarily lowered by a small amount due to the hard inquiry',
          'It stays exactly the same',
          'It is permanently and significantly damaged',
        ],
        answer: 1,
      },
      {
        question: 'What is a secured credit card?',
        options: [
          'A card only available to people with an exceptional credit score',
          'A card where you deposit money as collateral which becomes your credit limit',
          'A card with no credit limit at all',
          'A prepaid gift card you can reload',
        ],
        answer: 1,
      },
      {
        question: 'How long can a late payment remain on your credit report?',
        options: [
          '1 year',
          '3 years',
          '5 years',
          '7 years',
        ],
        answer: 3,
      },
      {
        question: 'What is the difference between a hard inquiry and a soft inquiry?',
        options: [
          'Soft inquiries hurt your score; hard inquiries do not',
          'Hard inquiries from loan applications can lower your score; soft inquiries like checking your own score do not',
          'Both affect your score equally',
          'Neither type of inquiry ever affects your credit score',
        ],
        answer: 1,
      },
      {
        question: 'What is the best free way to monitor your credit score?',
        options: [
          'Pay a credit bureau a monthly fee for access',
          'Use services like Credit Karma, Experian free tier, or your bank\'s credit monitoring tools',
          'Hire a personal financial advisor to monitor it for you',
          'Apply for a new credit card each year and check the approval outcome',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: '6',
    icon: 'school-outline',
    title: 'Student Loan Strategy',
    summary: 'Smart ways to manage and pay off student debt.',
    duration: '7 min read',
    type: 'lesson',
    keyPoints: [
      'Always exhaust federal loans first — they offer protections private loans never will',
      'Unsubsidized loan interest grows while you\'re in school — small payments now save thousands',
      'PSLF can forgive your entire remaining balance after 10 years in qualifying public service',
    ],
    content: `Student loan debt in the US has surpassed $1.7 trillion. For many college students, it will be the largest financial commitment of their young adult lives. Having a clear, informed strategy — before graduation, not after — can save tens of thousands of dollars and years of repayment stress.

Federal vs Private: Always Exhaust Federal First

Federal loans come from the government and carry protections that private loans simply cannot match: fixed, lower interest rates; income-driven repayment options that cap monthly payments based on your earnings; deferment and forbearance if you lose your job or face hardship; access to loan forgiveness programs; and no credit check required for most types.

Private loans come from banks and credit unions. They may offer lower introductory rates in some cases, but they carry variable rates that can rise, fewer protections when circumstances change, and no access to federal forgiveness or income-driven repayment plans. Only consider private loans after fully exhausting every federal option available to you.

Subsidized vs Unsubsidized Federal Loans

Subsidized loans are need-based. The government pays the interest while you are enrolled in school at least half-time, which means your balance does not grow during your education.

Unsubsidized loans accrue interest from the day they are disbursed, including during school. A $10,000 unsubsidized loan at 6.5% will have grown to approximately $11,300 by the time you graduate after 4 years — before you have made a single payment. If you can afford to make interest-only payments on unsubsidized loans while in school — even $25 to $50 per month — you prevent this capitalization and save real money.

The Grace Period

Federal loans provide a 6-month grace period after graduation before repayment begins. Use this time to set up your repayment plan, research your options, and understand what you owe — not to ignore the loans. Importantly, unsubsidized interest continues to accrue during the grace period and capitalizes when repayment begins.

Repayment Strategies

The avalanche method means making minimum payments on all loans, then directing every extra dollar toward the loan with the highest interest rate first. This is mathematically optimal — it saves the most total interest over the repayment period.

The snowball method means making minimum payments on all loans, then focusing extra payments on the smallest balance first. Individual loans get paid off faster, providing psychological wins that help maintain motivation. It costs more in total interest but works better for people who need tangible progress to stay on track.

Income-Driven Repayment (IDR) means enrolling in federal plans that cap your monthly payment at 5 to 10% of your discretionary income. If your income is low relative to your debt load, this prevents payments that would otherwise be unaffordable. After 20 to 25 years of qualifying payments, any remaining balance is forgiven — though the forgiven amount may be taxable.

Public Service Loan Forgiveness (PSLF)

If you work full-time for a qualifying government agency or nonprofit organization, PSLF forgives your entire remaining federal loan balance after 120 qualifying monthly payments — 10 years of service. This program is potentially worth hundreds of thousands of dollars for high-debt borrowers entering public service, education, healthcare, or nonprofit work. It requires being enrolled in an income-driven repayment plan, so this must be set up correctly from the start.

Smart Moves Before Graduation

Know exactly what you owe, who your loan servicer is, and what your interest rates are. Log into studentaid.gov for a complete picture of every federal loan you have. Do not borrow more than your expected starting salary — this is the most widely cited rule of thumb among financial advisors for keeping debt manageable. Think carefully before refinancing federal loans into private loans: you may secure a lower interest rate, but you permanently give up access to IDR plans, deferment, and all forgiveness programs. That trade-off is rarely worth it for most borrowers.`,
    quiz: [
      {
        question: 'Which repayment strategy saves the most money in total interest?',
        options: [
          'Snowball method',
          'Minimum payments only on all loans',
          'Avalanche method',
          'Income-driven repayment',
        ],
        answer: 2,
      },
      {
        question: 'What is a major risk of refinancing federal student loans into private loans?',
        options: [
          'Your monthly payments always increase immediately',
          'You permanently lose access to federal protections and forgiveness programs',
          'Your interest rate is guaranteed to increase',
          'You cannot pay them off ahead of schedule',
        ],
        answer: 1,
      },
      {
        question: 'What does PSLF stand for?',
        options: [
          'Private Student Loan Forgiveness',
          'Public Service Loan Forgiveness',
          'Partial Student Loan Forgiveness',
          'Primary School Loan Forgiveness',
        ],
        answer: 1,
      },
      {
        question: 'What is the key advantage of federal loans over private student loans?',
        options: [
          'Federal loans are always larger amounts',
          'Federal loans offer lower fixed rates, income-driven repayment, and forgiveness options',
          'Private loans always have higher interest rates in every situation',
          'Federal loans require no repayment after graduation',
        ],
        answer: 1,
      },
      {
        question: 'What does the snowball repayment method focus on?',
        options: [
          'Paying the highest interest loan first to save the most money',
          'Paying the smallest balance loan first to build momentum with quick wins',
          'Making only minimum payments on every loan indefinitely',
          'Consolidating all loans into one single payment',
        ],
        answer: 1,
      },
      {
        question: 'Why is it beneficial to make interest payments on unsubsidized loans while still in school?',
        options: [
          'It immediately reduces your loan principal',
          'It prevents interest from capitalizing and growing your total balance',
          'It automatically qualifies you for PSLF',
          'It permanently lowers your interest rate',
        ],
        answer: 1,
      },
      {
        question: 'What is income-driven repayment (IDR)?',
        options: [
          'A plan where payments increase as your income grows each year',
          'A federal plan that caps payments at a percentage of your discretionary income',
          'A one-time lump sum payment option for graduates',
          'A form of automatic loan forgiveness after 5 years',
        ],
        answer: 1,
      },
      {
        question: 'How long is the grace period on most federal student loans after graduation?',
        options: [
          '3 months before repayment begins',
          '6 months before repayment begins',
          '12 months before repayment begins',
          'There is no grace period on federal loans',
        ],
        answer: 1,
      },
      {
        question: 'What happens to unsubsidized loan interest during the 6-month grace period?',
        options: [
          'It is paused by the government during the grace period',
          'It continues to accrue and capitalizes when repayment begins',
          'It is forgiven automatically at graduation',
          'It is converted to subsidized interest during grace period',
        ],
        answer: 1,
      },
      {
        question: 'According to common financial advice, how much should you borrow in student loans?',
        options: [
          'As much as the school offers in your financial aid package',
          'No more than your expected first-year starting salary',
          'Exactly $20,000 regardless of your major',
          'Never more than $50,000 in total',
        ],
        answer: 1,
      },
    ],
  },
];

// ─── GUIDES (free-access reading articles, no quiz) ───────────────────────────

export const GUIDES: Topic[] = [
  {
    id: 'g1',
    icon: 'podium-outline',
    title: 'Beginner\'s Guide to the Stock Market',
    summary: 'How the market works, what moves prices, and how to start.',
    duration: '8 min read',
    type: 'guide',
    keyPoints: [
      'The S&P 500 tracks the 500 largest US companies and is the standard market benchmark',
      'Stock prices are driven by earnings, expectations, and sentiment — short-term volatility is normal',
      'ETFs offer instant diversification at low cost — the best starting point for new investors',
    ],
    content: `The stock market can feel intimidating — a world of flashing numbers, confusing jargon, and stories of both fortunes made and lost overnight. In reality, for a long-term investor, the stock market is the most accessible and historically reliable wealth-building tool available to ordinary people. Understanding a few core concepts removes most of the mystery.

What Is the Stock Market?

The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When a private company wants to raise money from the public, it sells shares for the first time through an Initial Public Offering (IPO), listing its stock on an exchange like the New York Stock Exchange (NYSE) or NASDAQ.

Once listed, anyone with a brokerage account can buy or sell shares during market hours. Prices change constantly based on supply and demand — driven by company earnings reports, economic data, investor sentiment, and breaking news.

Key Indices: The Market's Report Card

You cannot buy "the market" directly as a single asset, but you can measure and track it through indices — collections of stocks that represent a segment of the market.

The S&P 500 tracks the 500 largest US companies by market capitalization. It is the most widely cited benchmark for US stock market performance. When news reports say "the market was up 1% today," they usually mean the S&P 500. The Dow Jones Industrial Average (DJIA) tracks just 30 large, established US companies and is older but less representative of the broad market. The NASDAQ Composite is heavily weighted toward technology companies and carries higher growth potential alongside higher volatility. The Russell 2000 tracks 2,000 smaller US companies, representing a higher-risk, higher-potential segment.

How Stock Prices Are Determined

A stock's price is ultimately determined by what buyers are willing to pay and what sellers are willing to accept at any given moment. This depends on several factors: company earnings (the most important long-term driver — a company growing profits consistently will see its stock rise over time); expectations (markets are forward-looking, so a stock's price reflects anticipated future earnings, not just current ones); and market sentiment (fear and greed move markets in the short term, causing prices to deviate significantly from underlying value — this creates both risks and opportunities for patient investors).

Market Capitalization and Company Size

Market capitalization equals share price multiplied by total shares outstanding. Large-cap companies with market caps above $10 billion, like Apple and JPMorgan, offer lower risk and steadier long-term returns. Mid-cap companies between $2 billion and $10 billion offer a balance of growth and stability. Small-cap companies below $2 billion are younger and faster-growing but carry higher risk. For new investors, large-cap companies and diversified index funds covering the full market are the appropriate starting point.

Bull vs Bear Markets

A bull market is a sustained period of rising prices, typically defined as a 20% or greater rise from a recent low. Historically, bull markets last an average of four to five years. A bear market is a sustained decline of 20% or more from a recent peak. Bear markets feel intensely uncomfortable but historically last only 9 to 12 months on average.

The critical insight: every bear market in history has been followed by a bull market that eventually reached new highs. Investors who stayed invested through the downturns participated in the recovery. Those who sold during the decline locked in their losses permanently.

How to Actually Invest

You do not buy stocks through a bank. You need a brokerage account — an account specifically designed for buying and selling investments. Fidelity and Charles Schwab are both excellent for beginners: no account minimums, strong educational resources, and full investment capabilities. Robinhood is simpler to use but offers limited research tools.

Once your account is open and funded, you can buy individual stocks (higher risk, requires research and ongoing attention), ETFs (instant diversification at low cost — recommended for most beginners), or set up automatic recurring investments to build wealth consistently over time without requiring constant decisions.

The Single Most Important Rule

Do not try to time the market. Research consistently demonstrates that even professional fund managers with teams of analysts fail to reliably buy at market lows and sell at highs. The strategy that has historically worked best for long-term wealth building is deceptively simple: invest regularly, diversify broadly, and leave it alone. Time in the market beats timing the market — every single time.`,
  },
  {
    id: 'g2',
    icon: 'save-outline',
    title: 'The Complete Savings Guide',
    summary: 'Every account type explained and when to use each one.',
    duration: '7 min read',
    type: 'guide',
    keyPoints: [
      'High-Yield Savings Accounts pay 8–10× more than traditional banks with zero added risk',
      'Match the account type to the time horizon: HYSA for emergencies, CDs for fixed-term goals',
      'Automate savings before you spend — treat it like a non-negotiable bill',
    ],
    content: `Saving money sounds deceptively simple — spend less than you earn and set the rest aside. But where you save, how you structure your savings, and which account types you use for which goals dramatically affect both your returns and your behavior. This guide covers every major savings option and the strategy behind each one.

Why Savings Accounts Still Matter in an Investing World

Even if you plan to invest for the long term, cash savings serve a purpose that no investment can replace: immediate liquidity without risk of loss. Investments fluctuate. A portfolio worth $10,000 today might be worth $7,000 when you urgently need the money in three months. Cash savings are always worth exactly what you deposited, accessible immediately, with no downside scenario.

Cash savings serve three distinct roles in a healthy financial life: your emergency fund (3 to 6 months of essential expenses), short-term goals with a defined timeline (a trip, a car down payment, a laptop, first and last month's rent), and a buffer between paychecks to smooth out irregular expenses.

Traditional Savings Account

Offered by traditional brick-and-mortar banks and credit unions. FDIC insured up to $250,000 per depositor. These accounts are very safe but pay extremely low interest — typically well under 1% APY at most traditional banks. This is a fine place to start when you are opening your first account, but it is not where you want money sitting for any significant length of time.

High-Yield Savings Account (HYSA)

Offered primarily by online banks, which have no physical branches and therefore lower operating costs — savings they pass along to customers as higher interest rates. Rates vary with the broader interest rate environment but are consistently and significantly higher than traditional banks — often many times more. The money is just as safe (FDIC insured up to $250,000), just as accessible (funds available within 1 to 2 business days via transfer), and strictly better in every measurable way than a traditional savings account for an emergency fund or savings goal.

Well-regarded options include Ally Bank, Marcus by Goldman Sachs, SoFi, American Express High Yield Savings, and Discover Online Savings. Always compare current APYs at bankrate.com or nerdwallet.com before opening an account, as rates shift over time.

Money Market Account

A hybrid between a checking and savings account. Often comes with a debit card or limited check-writing ability for faster access. Interest rates are typically competitive with HYSAs. Ideal for emergency funds where you might need money quickly without waiting for a bank transfer. May have minimum balance requirements to earn the advertised rate.

Certificates of Deposit (CDs)

When you open a CD, you agree to leave a fixed sum of money deposited for a specified term — 3 months, 6 months, 1 year, or up to 5 years — in exchange for a guaranteed, fixed interest rate that is usually higher than an HYSA. The trade-off is an early withdrawal penalty, typically 3 to 6 months of interest, if you need the money before maturity.

CDs are ideal for money you are confident you will not need for a specific period. A CD ladder — splitting a lump sum across multiple CDs with different maturity dates — gives you both the benefit of higher rates and periodic access to a portion of your funds as each CD matures.

Treasury Bills (T-Bills)

Issued by the US federal government, T-Bills mature in 4, 8, 13, 17, 26, or 52 weeks. They are currently yielding competitive rates, and crucially, the interest earned is exempt from state and local taxes — an advantage over bank savings accounts. Purchased through TreasuryDirect.gov or through a standard brokerage account. As safe as any investment can possibly be, backed by the full faith and credit of the US government. Ideal for cash you do not need for 3 to 12 months.

Matching the Right Account to Each Goal

Your emergency fund belongs in an HYSA: accessible within 48 hours, earning 4%+, held separately from spending money, and untouched except for genuine emergencies. For savings goals with a defined 3 to 12 month timeline, a CD or T-Bill locks in a guaranteed rate for exactly the period you need. For daily spending and bill payments, a checking account with no access penalties is correct. For long-term savings of 5 years or more, these savings accounts are the wrong tool — money with that kind of time horizon should be invested.

A Simple System That Works

Open an HYSA at a different institution than your primary checking account. The physical separation matters — money that requires a 2-day transfer feels less spendable than money one tap away. Set up automatic transfers on payday, before you have a chance to spend the money. Name your savings buckets — "Emergency Fund," "Spring Break," "New Laptop" — to keep goals concrete. And treat the automatic savings transfer like a non-negotiable bill: it comes out first, automatically, every time. What remains is yours to spend.`,
  },
  {
    id: 'g3',
    icon: 'calculator-outline',
    title: 'Budgeting 101',
    summary: 'Three proven frameworks to take control of your money.',
    duration: '7 min read',
    type: 'guide',
    keyPoints: [
      'The 50/30/20 rule splits income into needs, wants, and savings — a great starting framework',
      'Zero-based budgeting gives every dollar a job before the month begins',
      'The best budget is the simplest one you will actually stick to consistently',
    ],
    content: `A budget is not a punishment. It is a plan. The most widespread misconception about budgeting is that it restricts your life and takes the joy out of spending. In reality, a well-designed budget does the opposite — it tells your money exactly where to go so you stop wondering where it went.

Why Most People Avoid Budgeting (and Why That Is Costly)

Without a budget, spending decisions are made in the moment, often driven by emotion, convenience, or social pressure. That $15 lunch, the streaming subscription you forgot about, the late-night online order — individually they seem minor. Collectively, they can account for hundreds of dollars a month with no clear benefit or intention behind them.

A person earning $2,500 per month with no budget often cannot explain where half of it went at the end of the month. Budgeting creates awareness first and control second. You cannot deliberately change behavior you are not tracking.

The 50/30/20 Rule

The most beginner-friendly budgeting framework divides your after-tax income into three categories.

Fifty percent goes to Needs: housing, utilities, groceries, transportation, and minimum loan payments. These are non-negotiable expenses you must pay regardless of circumstances.

Thirty percent goes to Wants: dining out, entertainment, streaming subscriptions, clothing beyond basics, travel, and hobbies. These are enjoyable and contribute to quality of life, but they are not essential.

Twenty percent goes to Savings and debt payoff: contributions to your emergency fund, retirement accounts, and making extra payments on debt above the minimum.

On a $2,000 monthly take-home income, this means $1,000 toward needs, $600 toward wants, and $400 toward savings and debt. This framework is a starting point, not a rigid prescription. If you carry significant student debt, your savings percentage should be higher. If you live in an expensive city, your needs may naturally exceed 50% of income — adjust your wants category accordingly.

Zero-Based Budgeting

In this method, every single dollar has a specific job assigned before the month begins. Income minus all expenses, savings, and debt payments equals zero. Nothing is unallocated.

Example on $2,000 income: Rent $700. Groceries $200. Transportation $150. Streaming services $50. Dining out $100. Clothing $100. Emergency fund contribution $200. Student loan extra payment $300. Vacation savings $200. Total: $2,000.

Zero-based budgeting requires more effort than the 50/30/20 rule but completely eliminates the "where did my money go" problem. Every dollar is accounted for before you spend it. This method is particularly effective for people who have tried simpler frameworks and found themselves consistently overspending in variable categories like dining and entertainment. YNAB (You Need a Budget) is the most popular tool for implementing this approach.

The Envelope Method

A physical version of zero-based budgeting: withdraw cash for each spending category at the start of the month and place it in labeled envelopes. When an envelope is empty, that category is done for the month. No exceptions.

Research in behavioral economics consistently shows that people spend less with physical cash than with cards. The act of handing over physical bills activates the brain's loss-aversion response in a way that tapping a card or scanning a phone simply does not. This method is particularly powerful for people who struggle with overspending in specific categories like dining, entertainment, or clothing. Many budgeting apps offer a digital equivalent using virtual "spending buckets" within each category.

Tracking Your Budget

A budget only works if you actually track it. Three realistic approaches:

A spreadsheet in Google Sheets or Excel gives you total control over categories and calculations, requires manual entry, and works well for detail-oriented people who enjoy working with numbers.

A budgeting app like YNAB, Copilot, or Monarch Money connects to your bank accounts and automatically categorizes transactions, reducing manual effort significantly. Best for people who want insight without constant manual work.

A simple bank statement review means downloading your statement at the end of each month and categorizing expenses manually in a notes app or spreadsheet. Low-tech, takes 15 minutes, and is surprisingly effective for straightforward situations.

The specific tool matters far less than the consistency of use. A basic system you check weekly is infinitely more effective than a sophisticated system you abandon after two months.

Common Budgeting Mistakes

Starting too complicated means tracking 25 categories in month one, getting overwhelmed, and quitting. Start with 5 categories. Add detail as you get comfortable over several months. Budgeting too tightly means leaving no room for enjoyment, which makes the budget impossible to follow and unsustainable. Build in breathing room. Not adjusting when life changes — a new job, a move, a new expense — means the budget becomes inaccurate and useless. Review and update it whenever your circumstances change meaningfully. Only budgeting when in financial trouble means missing the most effective time to build the habit, which is when things are fine and there is no pressure.

A budget is not a document you set once and follow forever. It is a living plan — a monthly conversation with yourself about what actually matters to you. The numbers reflect your priorities. Adjust them until they reflect the life you want to live.`,
  },
  {
    id: 'g4',
    icon: 'document-text-outline',
    title: 'Understanding Your First Paycheck',
    summary: 'Taxes, deductions, W-4s, and what every line means.',
    duration: '7 min read',
    type: 'guide',
    keyPoints: [
      'Net pay is typically 20–35% less than gross pay due to taxes, Social Security, and benefits',
      'Always contribute enough to your 401(k) to capture the full employer match — it\'s free money',
      'Your tax bracket taxes only your highest dollars earned, not your entire income',
    ],
    content: `Getting your first real paycheck is exciting — until you notice the number deposited in your bank account is significantly less than what you were told you would earn. Understanding where the difference went is one of the most practically useful things you can learn in personal finance, and it affects decisions you will make for the rest of your working life.

Gross Pay vs Net Pay

Gross pay is the salary or hourly rate you agreed to when you accepted the job. It is what your employer pays in total, before any deductions.

Net pay — also called take-home pay — is what actually arrives in your bank account after all deductions have been taken out. The gap between these two numbers typically ranges from 20 to 35% of your gross pay. On a $40,000 annual salary, you might actually take home $28,000 to $33,000 depending on your state, your benefits elections, and your retirement contributions.

Federal Income Tax

The United States uses a progressive tax system, meaning you pay different rates on different portions of your income. The bracket thresholds adjust each year for inflation — check irs.gov for the current year's figures. As a general pattern, the lowest bracket taxes income at 10%, with rates rising through 12%, 22%, 24%, and higher tiers for larger incomes, reaching 37% at the top.

The critical concept here: your tax bracket refers to the rate applied to your highest dollar earned, not to all of your income. A student earning $30,000 does not pay their marginal rate on the entire amount — they pay 10% on income that falls in the lowest bracket and the higher rate only on the portion above that threshold. Many people overestimate their tax burden because they confuse marginal rates with effective rates. See irs.gov for the exact thresholds for the current tax year.

State Income Tax

Most US states impose an additional income tax. Rates vary enormously — from 0% in Texas, Florida, Nevada, Washington, and several other states to over 13% for the highest earners in California. Knowing your state's rate helps you estimate your realistic take-home pay before accepting a job offer.

Social Security and Medicare (FICA)

These federal payroll taxes are always deducted from every paycheck, regardless of other circumstances. Social Security is 6.2% of your gross pay (up to an annual income cap that adjusts each year). Medicare is 1.45% of all wages with no income cap. Your employer matches both of these amounts on their end. Together, your share of FICA totals 7.65% of your gross pay.

Health Insurance and Other Benefits

If your employer offers health, dental, or vision insurance and you opt in, your share of the premium is deducted from each paycheck. Importantly, these deductions typically come out pre-tax, which reduces your taxable income — a meaningful benefit rather than merely a cost.

401(k) Retirement Contributions

If your employer offers a 401(k) retirement plan and you choose to contribute, that money comes out of your paycheck before taxes are calculated, reducing your taxable income for the year. If your employer offers a matching contribution — for example, matching 50% of your contributions up to 6% of your salary — contributing at least enough to capture the full match is the single most valuable financial move available to you. An employer match is an immediate 50% or even 100% return on that portion of your contribution. Not taking it is leaving free money on the table.

The W-4 Form

When you start a new job, you fill out a W-4 form, which tells your employer how much federal income tax to withhold from each paycheck. Getting this right matters.

If too much is withheld, you receive a tax refund in April. While a refund feels good, it means you gave the government an interest-free loan for up to 12 months — money that could have been earning interest in your savings account. If too little is withheld, you will owe money when you file your taxes in April, which can be stressful and may trigger underpayment penalties.

The IRS offers a free withholding estimator at irs.gov/W4App that helps you fill out your W-4 accurately. For students with simple tax situations — one job, standard deductions, no dependents — the default settings on a W-4 usually work fine.

Reading Your Pay Stub

Every paycheck comes with a pay stub detailing exactly what happened to your gross pay. Key items to verify: your gross pay matches your agreed rate times hours worked; your federal and state tax withholding look reasonable; your 401(k) contribution percentage is set where you want it; only benefits you actually enrolled in are being deducted; and the year-to-date (YTD) totals are accumulating correctly for tax season.

Filing Your Taxes as a Student

Filing your taxes for the first time feels intimidating but is usually straightforward for students. The IRS Free File program at freefile.irs.gov allows lower-income filers to file their federal return for free — check the current income eligibility threshold at irs.gov, as it adjusts over time. Most states have similar free filing programs.

Key documents you will receive: a W-2 from your employer (summarizing all wages earned and taxes withheld for the year); a 1098-T if you paid tuition at a college or university (you may qualify for education tax credits worth hundreds or thousands of dollars); and 1099 forms for any freelance, gig economy, or investment income you received. Gather these documents and file by the April deadline each year. Understanding your first paycheck is the foundation for everything from negotiating job offers to planning your budget to making smart choices about benefits and retirement contributions throughout your career.`,
  },
];
