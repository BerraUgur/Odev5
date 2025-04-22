const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Library Management System API",
      version: "1.0.0",
      description: "API documentation for the Online Library Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "Username of the user",
            },
            email: {
              type: "string",
              description: "Email address of the user",
            },
            password: {
              type: "string",
              description: "Password of the user",
            },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Title of the book",
            },
            author: {
              type: "string",
              description: "Author of the book",
            },
            category: {
              type: "string",
              description: "Category of the book",
            },
          },
        },
        Favorite: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Favorite ID",
            },
            userId: {
              type: "string",
              description: "ID of the user who favorited the book",
            },
            bookId: {
              type: "string",
              description: "ID of the favorited book",
            },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Review ID",
            },
            bookId: {
              type: "string",
              description: "ID of the book being reviewed",
            },
            reviewText: {
              type: "string",
              description: "Text of the review",
            },
            rating: {
              type: "integer",
              description: "Rating given in the review",
              minimum: 1,
              maximum: 5,
            },
          },
        },
        Loan: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Loan ID",
            },
            bookId: {
              type: "string",
              description: "ID of the borrowed book",
            },
            userId: {
              type: "string",
              description: "ID of the user who borrowed the book",
            },
            loanDate: {
              type: "string",
              format: "date",
              description: "Date when the book was borrowed",
            },
            returnDate: {
              type: "string",
              format: "date",
              description: "Date when the book was returned",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);