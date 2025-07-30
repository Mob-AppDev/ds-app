# DevSync - Unified Slack Clone

A complete Slack clone built with Spring Boot backend and React Native frontend, featuring real-time messaging, workspaces, channels, and advanced collaboration tools.

## Features

### 👥 User & Authentication
- User registration with email, password, profile photo, and name
- Login/logout with session persistence using JWT
- Forgot password and password reset functionality
- View and update user profile
- Presence/online status indicator
- OAuth2 integration (Google, GitHub)

### 📦 Workspaces & Channels
- Create/join/leave workspaces
- Create public or private channels
- Invite users to channels
- View list of channels in a workspace
- Archive/unarchive/delete channels
- Pin important messages in channels
- Channel topic and description

### 💬 Messaging
- Send and receive text messages in real-time
- Edit and delete messages
- Reply to messages (threaded replies)
- React to messages with emojis
- Mention users using @username
- View unread message counts
- Message pagination (load older messages)
- Mark messages as read/seen
- Typing indicator

### 📎 Attachments & Media
- Send/receive files (images, PDFs, etc.)
- Preview images and documents
- Take photo or select from gallery
- Download attachments
- Video and audio support
- Canvas collaboration tools

### 🔔 Notifications
- Push notifications for mentions, replies, and new messages
- In-app notifications
- Mute channels or entire workspaces
- Firebase Cloud Messaging integration

### 🔍 Search & Discovery
- Full-text message search
- Filter by user, channel, or date
- Highlighted keywords in results
- Advanced search filters

### 🎨 Advanced Features
- Canvas creation and collaboration
- List management with tasks and workflows
- External organization connections
- Workflow automation
- Dark/light theme support
- Mobile-optimized interface

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **PostgreSQL** database
- **Spring Security** with JWT authentication
- **WebSocket** for real-time messaging
- **Spring Data JPA** for database operations
- **Firebase Admin SDK** for push notifications
- **Maven** for dependency management

### Frontend
- **React Native** with **Expo**
- **React Navigation** for navigation
- **Lucide React Native** for icons
- **Socket.IO Client** for real-time communication
- **Expo Notifications** for push notifications
- **Expo Image Picker** for file uploads
- **React Native Gesture Handler** for interactions

## Project Structure

```
devsync/
├── backend/                  # Spring Boot backend
│   ├── src/main/java/com/devsync/
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── config/          # Configuration classes
│   │   ├── security/        # Security components
│   │   └── payload/         # Request/Response DTOs
│   └── pom.xml              # Maven dependencies
├── frontend/                 # React Native frontend
│   ├── app/                 # App screens and components
│   │   ├── (tabs)/         # Tab navigation screens
│   │   ├── auth/           # Authentication screens
│   │   ├── chat/           # Chat and messaging
│   │   ├── profile/        # User profile management
│   │   └── components/     # Reusable components
│   ├── src/                # Source utilities
│   │   ├── context/        # React contexts
│   │   ├── data/           # Mock data and utilities
│   │   └── services/       # API services
│   └── package.json        # NPM dependencies
└── database/               # Database schema and migrations
    ├── schema.sql          # Database schema
    └── sample_data.sql     # Sample data
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Expo CLI
- Android Studio or Xcode (for device testing)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devsync
   ```

2. **Setup PostgreSQL database**
   ```sql
   CREATE DATABASE devsync;
   CREATE USER devsync_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE devsync TO devsync_user;
   ```

3. **Configure application properties**
   ```bash
   cd backend
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   ```
   
   Update the database credentials and other configurations in `application.yml`.

4. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Install Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Features Overview

### Core Messaging
- Real-time chat with WebSocket support
- Message reactions and threading
- File attachments and media sharing
- Typing indicators and presence

### Collaboration Tools
- Canvas for visual collaboration
- Task lists with workflow automation
- External organization connections
- Advanced search and filtering

### User Experience
- Modern, intuitive interface
- Dark/light theme support
- Mobile-first design
- Gesture-based interactions

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Request password reset

### Channels & Messages
- `GET /api/channels` - Get user channels
- `POST /api/channels` - Create channel
- `GET /api/channels/{id}/messages` - Get channel messages
- `POST /api/channels/{id}/messages` - Send message

### Real-time Events (WebSocket)
- `new_message` - New message received
- `message_updated` - Message edited
- `user_typing` - User started typing
- `presence_update` - User status changed

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- Input validation and sanitization
- SQL injection prevention with JPA

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.