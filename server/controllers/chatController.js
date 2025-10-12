const pool = require('../config/db');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Available functions the AI can call
const availableFunctions = {
    getProjects: async (userId) => {
        const result = await pool.query(
            'SELECT id, name, status FROM projects WHERE user_id = $1',
            [userId]
        );
        return result.rows;
    },

    getTasks: async (userId, status = null) => {
        let query = `
              SELECT t.*, p.name as project_name
              FROM tasks t
              JOIN projects p ON t.project_id = p.id
              WHERE p.user_id = $1
          `;
        const params = [userId];

        if (status) {
            query += ' AND t.status = $2';
            params.push(status);
        }

        const result = await pool.query(query, params);
        return result.rows;
    },

    // Add more functions as we go
};

const functionSchemas = [
      {
          name: "getProjects",
          description: "Get all projects for the user. Returns project id, name, and status.",
          parameters: {
              type: "object",
              properties: {},
              required: []
          }
      },
      {
          name: "getTasks",
          description: "Get tasks for the user. Can optionally filter by status (todo, in-progress, review, done, blocked).",
          parameters: {
              type: "object",
              properties: {
                  status: {
                      type: "string",
                      enum: ["todo", "in-progress", "review", "done", "blocked"],
                      description: "Filter tasks by status"
                  }
              },
              required: []
          }
      }
  ];


  //Main chat handler

  // Main chat handler
  const chat = async (req, res) => {
      const { message, conversationHistory = [] } = req.body;
      const userId = req.user.id;

      try {
          // Build messages array
          const messages = [
              {
                  role: "system",
                  content: `You are a helpful assistant for Kitaab, a project management platform.
                  You help users manage their projects, tasks, clients, and finances.
                  Be concise and professional. Use the available functions to fetch real data when needed.`
              },
              ...conversationHistory,
              { role: "user", content: message }
          ];

          // Call OpenAI with function calling
          let response = await openai.chat.completions.create({
              model: "gpt-4",
              messages: messages,
              functions: functionSchemas,
              function_call: "auto"
          });

          let assistantMessage = response.choices[0].message;

          // If AI wants to call a function
          if (assistantMessage.function_call) {
              const functionName = assistantMessage.function_call.name;
              const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

              // Execute the function
              const functionResult = await availableFunctions[functionName](userId, ...Object.values(functionArgs));

              // Send result back to AI
              messages.push(assistantMessage);
              messages.push({
                  role: "function",
                  name: functionName,
                  content: JSON.stringify(functionResult)
              });

              // Get final response from AI
              response = await openai.chat.completions.create({
                  model: "gpt-4",
                  messages: messages
              });

              assistantMessage = response.choices[0].message;
          }

          return res.status(200).json({
              success: true,
              message: assistantMessage.content,
              conversationHistory: [...conversationHistory,
                  { role: "user", content: message },
                  { role: "assistant", content: assistantMessage.content }
              ]
          });

      } catch (error) {
          console.error('Chat error:', error);
          return res.status(500).json({
              success: false,
              message: "Failed to process chat request"
          });
      }
  };
module.exports = { availableFunctions,chat };