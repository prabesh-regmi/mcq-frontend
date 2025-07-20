# MCQ Admin Dashboard

A comprehensive admin dashboard website built with Next.js 14, TypeScript, and modern web technologies for managing multiple choice questions and subjects.

## 🚀 Features

### Core Features
- **Authentication & Authorization**: Secure login/signup with role-based access control
- **Admin Dashboard**: Comprehensive statistics and analytics with interactive charts
- **Question Management**: CRUD operations for multiple choice questions
- **Subject Management**: Organize questions by subjects
- **Bulk Operations**: Import/export questions via CSV/Excel files
- **Mobile-First Design**: Fully responsive across all device sizes

### Technical Features
- **Next.js 14** with App Router and TypeScript
- **Static Site Generation (SSG)** - No server required for hosting
- **ShadCN/UI** component library with custom design system
- **Tailwind CSS** with green color palette
- **SWR** for data fetching and caching
- **React Hook Form** with Zod validation
- **Zustand** for state management
- **Recharts** for data visualizations
- **Bundle splitting** - Admin routes separate from public pages

## 🎨 Design System

### Color Palette
- **Primary**: Green (`hsl(142.1 76.2% 36.3%)`)
- **Secondary**: Neutral grays
- **Accent**: Light green tints
- **Destructive**: Red for errors/delete actions

### Design Principles
- Mobile-first responsive design
- Dual theme support (light/dark mode)
- Subtle hover effects
- Thin, auto-hiding scrollbars
- 100svh layouts for mobile compatibility

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin routes (protected)
│   │   ├── dashboard/     # Dashboard with charts
│   │   ├── questions/     # Question management
│   │   └── subjects/      # Subject management
│   ├── login/             # Authentication pages
│   ├── signup/
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/               # ShadCN/UI components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/
│   ├── api.ts           # API client and SWR hooks
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── store/
│   ├── auth.ts          # Authentication state
│   └── theme.ts         # Theme state
└── types/
    └── api.ts           # TypeScript interfaces
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN/UI** - Component library
- **SWR** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management
- **Recharts** - Data visualizations

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### Public Pages
- **Home** (`/`) - Landing page with login/signup links
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

### Admin Pages (Protected)
- **Dashboard** (`/admin/dashboard`) - Statistics and charts
- **Questions** (`/admin/questions`) - Question management with filters
- **Subjects** (`/admin/subjects`) - Subject management
- **Add Question** (`/admin/questions/add`) - Create new questions
- **Edit Question** (`/admin/questions/edit/[id]`) - Edit existing questions
- **View Question** (`/admin/questions/view/[id]`) - Question details

### Features by Page

#### Dashboard
- Real-time statistics with count-up animations
- Interactive charts (bar chart, area chart)
- Quick action buttons
- Responsive grid layout

#### Questions Management
- Data table with horizontal scroll on mobile
- Checkbox selection (individual + select all)
- Bulk delete functionality
- Search and filter capabilities
- Gmail-style pagination
- Three-dot action menus

#### Subjects Management
- Simple table layout
- Inline add/edit functionality
- Bulk operations
- Search functionality

## 🔐 Authentication

### User Roles
- **Admin**: Full access to all features
- **User**: Limited access (future feature)

### Authentication Flow
1. User logs in with email/password
2. JWT tokens stored in localStorage and Zustand
3. Role-based route protection
4. Auto-redirect based on user role
5. Token refresh handling

## 🎨 Theming

### Light Theme
- Clean white background
- Green primary color
- Subtle shadows and borders

### Dark Theme
- Dark background
- Adjusted green tones
- Proper contrast ratios

### Theme Switching
- Toggle button in admin header
- Persistent theme preference
- System theme detection

## 📊 Data Management

### API Integration
- RESTful API client with SWR
- Automatic caching and revalidation
- Error handling and loading states
- Type-safe API calls

### State Management
- **Zustand** for global state
- **SWR** for server state
- **React Hook Form** for form state

## 🚀 Deployment

### Static Export
```bash
npm run build
npm run export
```

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style
- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **TypeScript** strict mode enabled

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar
- Touch-friendly buttons
- Horizontal scroll tables
- Optimized charts
- Single column layouts

## 🔒 Security

### Authentication Security
- JWT token-based authentication
- Secure token storage
- Role-based access control
- Protected routes

### Data Security
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure API communication

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow
- [ ] Admin dashboard functionality
- [ ] Question CRUD operations
- [ ] Subject management
- [ ] Mobile responsiveness
- [ ] Theme switching
- [ ] Form validation
- [ ] Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation in `api.txt`

## 🔮 Future Enhancements

- [ ] User profile management
- [ ] Advanced analytics
- [ ] Question categories
- [ ] Quiz creation
- [ ] User progress tracking
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Multi-language support
