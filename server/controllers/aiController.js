const OpenAI = require('openai')
const pool = require('../config/db')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})




const analyzeProject = async (req, res) => {
    const { projectId, description } = req.body;

    const userId = req.user.id;
    const prompt = `You are a project management expert. Analyze this project description and break it down into actionable tasks.

  Project Description:
  "${description}"

  Return a JSON array of tasks. Each task should have:
  - title (string): Short, clear task name
  - description (string): Detailed explanation of what needs to be done
  - priority (string): "low", "medium", "high", or "urgent"
  - estimated_hours (number): Realistic time estimate
  - tags (array of strings): Relevant tags like "backend", "frontend", "database", etc.

  Return ONLY valid JSON array, no other text. Example format:
  [
    {
      "title": "Set up database schema",
      "description": "Create tables for users, projects, and tasks",
      "priority": "high",
      "estimated_hours": 4,
      "tags": ["database", "backend"]
    }
  ]`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: "You are a helpful project management assistant that breaks down projects into tasks"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });
        function extractJSON(text) {
            // Remove markdown code blocks if present
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                return jsonMatch[1].trim();
            }
            // If no code blocks, return as is
            return text.trim();
        }


        const aiResponse = completion.choices[0].message.content;
        const cleanedResponse = extractJSON(aiResponse);  // Clean the response
        const task = JSON.parse(cleanedResponse);         // Now parse

        return res.status(200).json({
            success: true,
            tasks: task,
            message: "Project analyxed successfuly"
        })
    } catch (error) {
        console.error("AI Anlysis Error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to analyze the project",
            error: error.message
        })

    }


}

module.exports = { analyzeProject };