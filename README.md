# CalCalc - Next.js Weight Loss App

A modern, responsive calorie calculator and fitness tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🧮 Calorie Calculator
- Calculate daily calorie needs using the Mifflin-St Jeor formula
- Support for different activity levels and weight goals
- Real-time calculation with form validation
- Responsive design with modern UI

### 📊 Calorie Log
- Log daily calorie intake
- View calorie history with timestamps
- Calculate total and average calories
- Delete entries with confirmation
- Data persistence using localStorage

### ⚖️ Weight Log
- Track weight changes over time
- View weight history with change indicators
- Calculate total weight change and percentage
- Summary statistics (current, starting, and change)
- Data persistence using localStorage

### 🔍 Nutrition Search
- Search for food nutrition information
- View detailed nutrition facts
- Recent searches functionality
- Mock API integration (ready for USDA API)
- Responsive search interface

### 👤 My Account
- User profile management
- Body metrics tracking
- Fitness goals configuration
- Edit and save profile information
- Data persistence using localStorage

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Persistence**: localStorage (client-side)
- **Charts**: Recharts (ready for implementation)
- **Authentication**: NextAuth.js (ready for implementation)
- **Database**: Prisma (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calcalc2.9
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
calcalc2.9/
├── src/
│   ├── app/
│   │   ├── calorie-calculator/
│   │   │   └── page.tsx          # Calorie calculator page
│   │   ├── calorie-log/
│   │   │   └── page.tsx          # Calorie logging page
│   │   ├── weight-log/
│   │   │   └── page.tsx          # Weight logging page
│   │   ├── nutrition-search/
│   │   │   └── page.tsx          # Nutrition search page
│   │   ├── my-account/
│   │   │   └── page.tsx          # User account page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   └── components/
│       └── Header.tsx            # Navigation header
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

## Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

### Modern UI/UX
- Clean, minimalist design
- Smooth transitions and animations
- Intuitive navigation
- Accessible form controls

### Data Management
- Client-side data persistence
- Real-time updates
- Form validation
- Error handling

### Performance
- Optimized bundle size
- Fast page loads
- Efficient state management
- Lazy loading ready

## Future Enhancements

### Backend Integration
- User authentication with NextAuth.js
- Database integration with Prisma
- API routes for data persistence
- Real-time data synchronization

### Advanced Features
- D3.js data visualizations
- Progress charts and graphs
- Goal tracking and achievements
- Social features and sharing

### Nutrition API
- USDA Food Database integration
- Barcode scanning
- Meal planning
- Recipe suggestions

### Mobile App
- PWA capabilities
- Offline functionality
- Push notifications
- Native app features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
