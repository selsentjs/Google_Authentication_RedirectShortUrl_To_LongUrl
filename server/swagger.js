const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      description: "Example of CRUD API ",
      version: "1.0.0",
    },
  },
  components: {
    schemas: {
      Analytics: {
        type: 'object',
        properties: {
          totalClicks: {
            type: 'integer',
          },
          uniqueUsers: {
            type: 'integer',
          },
          clicksByDate: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', format: 'date' },
                clickCount: { type: 'integer' },
              },
            },
          },
          osType: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                osType: { type: 'string' },
                uniqueClicks: { type: 'integer' },
              },
            },
          },
          deviceType: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                deviceType: { type: 'string' },
                uniqueClicks: { type: 'integer' },
              },
            },
          },
        },
      },
    },
  },

  
  apis: ["./Register_Login/route/*.js", "./Google_SignIn_Using_MySQL/route/*.js", "./createShortenUrl/route/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;