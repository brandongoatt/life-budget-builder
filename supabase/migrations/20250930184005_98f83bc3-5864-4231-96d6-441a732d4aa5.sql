-- Remove premium restrictions from AI conversations and messages
-- Drop existing policies
DROP POLICY IF EXISTS "Premium users can create conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Premium users can delete their conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Premium users can update their conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Premium users can view their own conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Premium users can create messages in their conversations" ON ai_messages;
DROP POLICY IF EXISTS "Premium users can view messages in their conversations" ON ai_messages;

-- Create new policies for all authenticated users
CREATE POLICY "Users can create their own conversations"
ON ai_conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON ai_conversations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON ai_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversations"
ON ai_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages in their conversations"
ON ai_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM ai_conversations
    WHERE ai_conversations.id = ai_messages.conversation_id
    AND ai_conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view messages in their conversations"
ON ai_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM ai_conversations
    WHERE ai_conversations.id = ai_messages.conversation_id
    AND ai_conversations.user_id = auth.uid()
  )
);