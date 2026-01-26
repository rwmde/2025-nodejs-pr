export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Student Management API',
    description:
      'API for managing students and user authentication with role-based access control',
    version: '1.0.0',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/students': {
      get: {
        tags: ['Students'],
        summary: 'Get all students',
        description: 'Retrieve a list of all students from the database',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of students retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Student',
                  },
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Create a new student',
        description:
          'Add a new student to the database. Requires teacher or admin role.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateStudentRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Student created successfully',
          },
          '400': {
            description: 'Invalid request body',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Replace all students',
        description:
          'Replace all students in the database with the provided data. Requires admin role.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/CreateStudentRequest',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'All students replaced successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Student',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request body',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get a student by ID',
        description: 'Retrieve a specific student by their ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Student ID',
          },
        ],
        responses: {
          '200': {
            description: 'Student retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Student',
                },
              },
            },
          },
          '404': {
            description: 'Student not found',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Update a student',
        description:
          'Update a specific student by their ID. Requires teacher or admin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Student ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateStudentRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Student updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Student',
                },
              },
            },
          },
          '404': {
            description: 'Student not found',
          },
          '400': {
            description: 'Invalid request body',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete a student',
        description:
          'Delete a specific student by their ID. Requires admin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Student ID',
          },
        ],
        responses: {
          '204': {
            description: 'Student deleted successfully',
          },
          '404': {
            description: 'Student not found',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/students/average-age': {
      get: {
        tags: ['Students'],
        summary: 'Get average age of students',
        description:
          'Calculate and retrieve the average age of all students. Requires teacher or admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Average age calculated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    averageAge: {
                      type: 'number',
                      example: 20.5,
                    },
                  },
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/students/group/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get students by group',
        description:
          'Retrieve all students from a specific group. Requires teacher or admin role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'Group number',
          },
        ],
        responses: {
          '200': {
            description: 'Students in group retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Student',
                  },
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/students/save': {
      post: {
        tags: ['Students'],
        summary: 'Save students to JSON file',
        description: 'Export all students to a JSON file. Requires admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': {
            description: 'Students saved to file successfully',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/students/load': {
      post: {
        tags: ['Students'],
        summary: 'Load students from JSON file',
        description: 'Import students from a JSON file. Requires admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Students loaded from file successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Student',
                  },
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/backup/start': {
      post: {
        tags: ['Backup'],
        summary: 'Start backup process',
        description:
          'Start the automatic backup mechanism. Requires admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Backup started successfully',
          },
          '400': {
            description: 'Backup is already running',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/backup/stop': {
      post: {
        tags: ['Backup'],
        summary: 'Stop backup process',
        description:
          'Stop the automatic backup mechanism. Requires admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Backup stopped successfully',
          },
          '400': {
            description: 'Backup is not running',
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/backup/status': {
      get: {
        tags: ['Backup'],
        summary: 'Get backup status',
        description:
          'Retrieve the current status of the backup mechanism. Requires admin role.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Backup status retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['running', 'stopped'],
                    },
                  },
                },
              },
            },
          },
          '401': {
            description:
              'Unauthorized - Missing or invalid authentication token',
          },
          '403': {
            description: 'Forbidden - User role does not have permission',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/user/registration': {
      post: {
        tags: ['User'],
        summary: 'Register a new user',
        description: 'Create a new user account. No authentication required.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegistrationRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
          },
          '400': {
            description: 'User registration failed or invalid request body',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['User'],
        summary: 'Login user',
        description: 'Authenticate a user and receive a JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          '400': {
            description: 'Login failed - invalid credentials',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Student: {
        type: 'object',
        properties: {
          studentId: {
            type: 'integer',
            example: 1,
          },
          studentName: {
            type: 'string',
            example: 'John Doe',
          },
          age: {
            type: 'integer',
            example: 20,
          },
          groupNumber: {
            type: 'integer',
            example: 101,
          },
        },
        required: ['studentName', 'age', 'groupNumber'],
      },
      CreateStudentRequest: {
        type: 'object',
        properties: {
          studentName: {
            type: 'string',
            example: 'Jane Smith',
          },
          age: {
            type: 'integer',
            example: 21,
          },
          groupNumber: {
            type: 'integer',
            example: 102,
          },
        },
        required: ['studentName', 'age', 'groupNumber'],
      },
      UserRegistrationRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'John',
          },
          surname: {
            type: 'string',
            example: 'Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            example: 'securePassword123',
          },
        },
        required: ['name', 'surname', 'email', 'password'],
      },
      UserLoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            example: 'securePassword123',
          },
        },
        required: ['email', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              userId: {
                type: 'integer',
              },
              email: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              surname: {
                type: 'string',
              },
              roleId: {
                type: 'integer',
              },
            },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /api/user/login endpoint',
      },
    },
  },
  tags: [
    {
      name: 'Students',
      description: 'Student management endpoints',
    },
    {
      name: 'Backup',
      description: 'Backup management endpoints',
    },
    {
      name: 'User',
      description: 'User authentication endpoints',
    },
  ],
};
