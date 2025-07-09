# !/bin/bash

# starter-express-app.sh
# Creates a basic Express.js application with modular structure

# Check if project name was provided
if [ -z "$1" ]; then
  echo "Usage: ./starter-express-app.sh <project-name>"
  exit 1
fi

PROJECT_NAME=$1

# Create project directory
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Initialize npm project
pnpm init -y

# Create basic folder structure
mkdir -p src/{config,modules,shared/{middleware,utils,errors},public}
mkdir -p tests

# Create main application files
touch src/{app.js,server.js}
touch src/config/{db.js,env.js,middleware.js}

# Create a sample module (users)
mkdir -p src/modules/users/{controllers,services,repositories,models,tests}
touch src/modules/users/{routes.js,validation.js}

# Create shared utilities
touch src/shared/middleware/{auth.js,logger.js,errorHandler.js}
touch src/shared/utils/{apiResponse.js,asyncHandler.js}
touch src/shared/errors/{ApiError.js,errorConverter.js}

# Create .env file
touch .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env
echo "DB_URI=mongodb://localhost:27017/$PROJECT_NAME" >> .env

# Create .gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

# Install basic dependencies
npm install express cors morgan helmet dotenv
npm install --save-dev nodemon

# Add basic scripts to package.json
jq '.scripts += {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}' package.json > package.tmp.json && mv package.tmp.json package.json

# Create basic app.js content
cat > src/app.js << 'EOL'
const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Global middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// TODO: Add module routes here
// app.use('/users', require('./modules/users/routes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
EOL

# Create basic server.js content
cat > src/server.js << 'EOL'
const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOL

# Create basic config files
cat > src/config/env.js << 'EOL'
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbUri: process.env.DB_URI,
  // Add other environment variables here
};
EOL

cat > src/config/db.js << 'EOL'
const mongoose = require('mongoose');
const { dbUri } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
EOL

# Create sample module files
cat > src/modules/users/routes.js << 'EOL'
const express = require('express');
const router = express.Router();
const controller = require('./controllers/user.controller');

// User routes
router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
EOL

cat > src/modules/users/controllers/user.controller.js << 'EOL'
const userService = require('../services/user.service');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
EOL

echo "Express.js application '$PROJECT_NAME' created successfully!"
echo "To get started:"
echo "1. cd $PROJECT_NAME"
echo "2. npm run dev"
echo "3. Open http://localhost:3000/health in your browser"
