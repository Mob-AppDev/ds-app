# DevSync - Slack Clone

A complete Slack clone built with Spring Boot backend and React Native frontend, featuring real-time messaging, workspaces, channels, and push notifications.

## Features

### 👥 User & Authentication
- User registration with email, password, profile photo, and name
- Login/logout with session persistence using JWT
- Forgot password and password reset functionality
- View and update user profile
- Presence/online status indicator

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

### 📎 Attachments
- Send/receive files (images, PDFs, etc.)
- Preview images and documents
- Take photo or select from gallery
- Download attachments

### 🔔 Notifications
- Push notifications for mentions, replies, and new messages
- In-app notifications
- Mute channels or entire workspaces

### 🔍 Search
- Full-text message search
- Filter by user, channel, or date
- Highlighted keywords in results

### 🔗 Threads
- Start a thread from a message
- View all replies in a side view
- Reply in thread or main channel

### 😊 Reactions & Emojis
- Add emoji reactions to messages
- View who reacted and how
- Emoji picker with categories
- Recently used emojis

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
- **React Native Paper** for UI components
- **Socket.IO Client** for real-time communication
- **Expo Notifications** for push notifications
- **Expo Image Picker** for file uploads
- **React Native Gifted Chat** for chat interface

## Project Structure

```
devsync/
├── devsync-backend/          # Spring Boot backend
│   ├── src/main/java/com/devsync/
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── config/          # Configuration classes
│   │   ├── security/        # Security components
│   │   └── dto/             # Data transfer objects
│   └── pom.xml              # Maven dependencies
└── devsync-frontend/         # React Native frontend
    ├── src/
    │   ├── screens/         # App screens
    │   ├── services/        # API services
    │   ├── theme/           # App theme
    │   └── components/      # Reusable components
    ├── App.js               # Main app component
    └── package.json         # NPM dependencies
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
   cd devsync-backend
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
   cd devsync-frontend
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

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Workspaces
- `GET /api/workspaces/user` - Get user's workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/{id}/channels` - Get workspace channels
- `POST /api/workspaces/join` - Join workspace with invite code

### Channels
- `GET /api/channels/{id}/messages` - Get channel messages
- `POST /api/channels/{id}/messages` - Send message
- `PUT /api/messages/{id}` - Edit message
- `DELETE /api/messages/{id}` - Delete message

### Real-time Events (WebSocket)
- `new_message` - New message received
- `message_updated` - Message edited
- `message_deleted` - Message deleted
- `user_typing` - User started typing
- `user_stop_typing` - User stopped typing
- `user_online` - User came online
- `user_offline` - User went offline

## Database Schema

The application uses the following main entities:

- **User** - User accounts and profiles
- **Workspace** - Team workspaces
- **Channel** - Communication channels
- **Message** - Chat messages
- **MessageReaction** - Emoji reactions
- **Attachment** - File attachments

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- Input validation and sanitization
- SQL injection prevention with JPA

## Push Notifications

The app supports push notifications using Firebase Cloud Messaging (FCM):

1. Setup Firebase project and download `firebase-service-account.json`
2. Place the file in the backend resources directory
3. Configure Firebase in the frontend using Expo notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.