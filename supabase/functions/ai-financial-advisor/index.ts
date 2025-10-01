import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, budget_data } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Create system prompt with budget context
    const systemPrompt = `You are an expert financial advisor AI. You provide personalized, practical financial advice based on the user's budget data.

${budget_data ? `User's Financial Profile:
- Monthly Income: $${budget_data.monthlyIncome?.toLocaleString() || 'Not provided'}
- Monthly Expenses: $${budget_data.monthlyExpenses?.toLocaleString() || 'Not provided'}
- Total Savings: $${budget_data.savings?.toLocaleString() || 'Not provided'}
- Emergency Fund: $${budget_data.emergencyFund?.toLocaleString() || 'Not provided'}
- Monthly Disposable Income: $${budget_data.monthlyIncome && budget_data.monthlyExpenses ? (budget_data.monthlyIncome - budget_data.monthlyExpenses).toLocaleString() : 'Not calculated'}

Guidelines:
1. Always reference their specific financial situation when giving advice
2. Be encouraging but realistic about their financial position
3. Provide actionable steps they can take immediately
4. Consider their risk tolerance based on their emergency fund and disposable income
5. Suggest specific dollar amounts or percentages when appropriate
6. Keep responses conversational but professional` : `The user hasn't provided budget data yet. Encourage them to share their financial information for personalized advice.`}

Always:
- Keep responses concise but comprehensive (2-3 paragraphs max)
- Use encouraging language while being realistic
- Provide specific, actionable advice
- Ask follow-up questions to better understand their goals
- Focus on practical steps they can implement today`;

    console.log('Sending request to OpenAI with message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    console.log('Generated AI response:', aiResponse);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI financial advisor:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});