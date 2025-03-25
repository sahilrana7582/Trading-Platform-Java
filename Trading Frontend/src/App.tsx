import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './components/home/HomePage';
import Navbar from './components/navigation/Navbar';
import MarketPage from './components/market/MarketPage';
import PortfolioPage from './components/portfolio/PortfolioPage';
import HistoryPage from './components/history/HistoryPage';
import ProfilePage from './components/profile/ProfilePage';
import websocketService from './services/websocketService';
import StockDetailPage from './components/stock/StockDetailPage';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6', // Blue-600
    },
    secondary: {
      main: '#8B5CF6', // Purple-600
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Gray-900
      secondary: '#4B5563', // Gray-600
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    // Connect to WebSocket when app loads
    websocketService.connect()
      .then(() => {
        console.log('WebSocket connected successfully');
        
        // Subscribe to stock updates
        const subscription = websocketService.subscribe('/topic/stock-updates', (message) => {
          // console.log('Received stock update:', message);
        });
        
        // Send a subscription message
        websocketService.sendMessage('/app/subscribe', 'Subscribing from React app');
      })
      .catch(error => {
        console.error('Failed to connect to WebSocket:', error);
      });
      
    // Cleanup on component unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
