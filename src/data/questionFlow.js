/**
 * QUESTION FLOW & DECISION TREE FOR UPASANA
 * 
 * Instructions:
 * - Each question presents choices (default 2 options).
 * - Once an option is chosen, it is PERMANENTLY locked.
 * - Sia delivers a calibrated response grounded in memory.md without overexposing raw notes.
 * - The final summary dynamically reflects the exact answers selected.
 */

export const INITIAL_GREETING = {
  id: "greeting",
  sender: "sia",
  text: "Hi Upasana. I'm Sia. I'm here to have an honest, calm, and private conversation with you about what happened between you two. There are no judgments here—just clarity. Whenever you are ready, let's go step by step.",
  timestamp: "Just now"
};

export const QUESTION_FLOW = [
  {
    id: "step_1_intent",
    badge: "Step 1 of 4",
    title: "Understanding The Silence",
    question: "When communication suddenly paused after everything that happened, how did you perceive the reason behind it?",
    options: [
      {
        id: "opt_1_a",
        letter: "A",
        text: "I thought it was just unnecessary ignoring or avoidance without a clear reason.",
        siaResponse: "I understand why it felt that way on the surface. But in reality, it wasn't random avoidance—it was because small moments of feeling dismissed and talked down to kept piling up over time, until silence felt like the only way to prevent another argument.",
        category: "clarity"
      },
      {
        id: "opt_1_b",
        letter: "B",
        text: "I felt like there was unspoken frustration and misunderstandings that never got cleared up.",
        siaResponse: "You're right about the unspoken frustration. The challenge was that whenever attempts were made to explain things in the moment, it felt like it quickly turned into yelling or blame, making it feel unsafe to speak openly.",
        category: "communication"
      }
    ]
  },
  {
    id: "step_2_respect",
    badge: "Step 2 of 4",
    title: "Tone & Daily Interactions",
    question: "Looking back at instances like the scooty arrangement or the shopping trip, how do you see the tone between you two?",
    options: [
      {
        id: "opt_2_a",
        letter: "A",
        text: "I felt comments and demands were just casual, and didn't realize they felt hurtful or disrespectful.",
        siaResponse: "Thank you for acknowledging that. It's helpful to know. What felt casual to you often felt like harsh judgment to him—like when effort was made to borrow and fix a vehicle so plans wouldn't get cancelled, only for it to be called 'khatara' or dismissed.",
        category: "respect_awareness"
      },
      {
        id: "opt_2_b",
        letter: "B",
        text: "Things were rushed and stressful, and neither of us handled our words in the best possible way.",
        siaResponse: "That's very true. Stress and rush definitely amplified things. But when tone turns into commands rather than asking, or when words dismiss the effort being made behind the scenes, it leaves a lasting sting.",
        category: "mutual_stress"
      }
    ]
  },
  {
    id: "step_3_handling_conflicts",
    badge: "Step 3 of 4",
    title: "Conflict Resolution",
    question: "When disagreements arose in the past, what made it difficult to resolve them calmly?",
    options: [
      {
        id: "opt_3_a",
        letter: "A",
        text: "Conversations felt defensive, with both sides wanting to prove who was right or wrong.",
        siaResponse: "Exactly. Blaming rather than listening created a loop where speaking up only led to escalating tension and days of stress. That's why he often chose to change the topic or hold back the full story.",
        category: "defensiveness"
      },
      {
        id: "opt_3_b",
        letter: "B",
        text: "We lacked the patience to listen before jumping to conclusions.",
        siaResponse: "That hit the core of it. Feeling judged before even finishing a sentence made him hold back. A relationship or friendship only works when both people feel safe to express their side without fear of being shouted at.",
        category: "listening"
      }
    ]
  },
  {
    id: "step_4_moving_forward",
    badge: "Step 4 of 4",
    title: "Perspective & Closure",
    question: "Going forward, what is the most important takeaway for you from this conversation?",
    options: [
      {
        id: "opt_4_a",
        letter: "A",
        text: "Mutual respect and speaking with consideration matter more than winning an argument.",
        siaResponse: "That's a very mature perspective. Respect is the baseline—without it, even genuine efforts get overshadowed by resentment.",
        category: "growth_respect"
      },
      {
        id: "opt_4_b",
        letter: "B",
        text: "We are different in how we process things, and clarity is better than holding onto unspoken bitterness.",
        siaResponse: "True peace comes from clarity. Accepting differences without harboring bitterness allows both people to move forward with a lighter heart.",
        category: "peace_closure"
      }
    ]
  }
];

export const getFinalMessage = (selectedOptions) => {
  const choices = Object.values(selectedOptions);
  const categories = choices.map(c => c.category);

  if (categories.includes("respect_awareness") || categories.includes("growth_respect")) {
    return {
      title: "Clarity & Mutual Dignity",
      body: "Upasana, thank you for walking through these questions with an open mind. The silence wasn't born out of malice or games—it came from feeling persistently disrespected and judged when trying his best. Knowing that you can reflect on the impact of tone and words brings genuine closure. Both of you deserve relationships where respect is mutual and effortless.",
      footer: "Generated by Sia • Grounded in honesty & peace"
    };
  } else {
    return {
      title: "Understanding & Peace",
      body: "Upasana, thank you for completing this session honestly. The past trips, words, and silence were the culmination of accumulated tension, stress, and incompatible ways of handling conflict. Recognizing these differences without blame is the healthiest step forward for both of you.",
      footer: "Generated by Sia • Grounded in honesty & peace"
    };
  }
};
