import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Container, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Card, CardContent, Grid, 
  Chip, Button, IconButton, Tooltip, Avatar, useTheme, alpha,
  LinearProgress, Divider
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import websocketService from '../../services/websocketService';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

// Fix the GlowingTableRow styled component
const GlowingTableRow = styled(TableRow)(({ theme, priceChange }: { theme: any; priceChange?: number }) => ({
  '& td': {
    transition: 'background-color 0.3s',
    backgroundColor: priceChange
      ? priceChange > 0
        ? alpha(theme.palette.success.main, 0.05)
        : alpha(theme.palette.error.main, 0.05)
      : 'transparent'
  },
  '&:hover td': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

interface StockData {
  'Stock Name': string;
  symbol: string;
  price: string;
  previousPrice?: string;
  priceChange?: number;
  favorite?: boolean;
  timestamp?: number;
}

const MarketPage = () => {
  const theme = useTheme();
  const [stocks, setStocks] = useState<{ [key: string]: StockData }>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marketTrend, setMarketTrend] = useState<'up' | 'down' | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to stock updates
    const subscription = websocketService.subscribe('/topic/stock-updates', (message) => {
      try {
        // Parse the message if it's a string
        const stockData: StockData = typeof message === 'string' 
          ? JSON.parse(message.replace(/'/g, '"')) 
          : message;
        
        setStocks(prevStocks => {
          const prevStock = prevStocks[stockData.symbol];
          const currentPrice = parseFloat(stockData.price);
          const previousPrice = prevStock ? parseFloat(prevStock.price) : currentPrice;
          
          return {
            ...prevStocks,
            [stockData.symbol]: {
              ...stockData,
              previousPrice: prevStock?.price || stockData.price,
              priceChange: currentPrice - previousPrice,
              favorite: prevStock?.favorite || false,
              timestamp: Date.now()
            }
          };
        });
        
        // Set loading to false once we receive data
        setLoading(false);
      } catch (error) {
        console.error('Error processing stock data:', error);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Add loading simulation - fallback if no websocket data
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (symbol: string) => {
    setStocks(prevStocks => ({
      ...prevStocks,
      [symbol]: {
        ...prevStocks[symbol],
        favorite: !prevStocks[symbol].favorite
      }
    }));

    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol) 
        : [...prev, symbol]
    );
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPriceChange = (change?: number) => {
    if (change === undefined) return '0.00%';
    return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
  };

  const stocksToDisplay = Object.values(stocks)
    .filter(stock => !showOnlyFavorites || stock.favorite);

  // Calculate overall market trend
  useEffect(() => {
    if (Object.keys(stocks).length > 0) {
      const totalChange = Object.values(stocks).reduce((acc, stock) => {
        return acc + (stock.priceChange || 0);
      }, 0);
      setMarketTrend(totalChange >= 0 ? 'up' : 'down');
    }
  }, [stocks]);

  return (
    <Container maxWidth="xl" sx={{
      mt: 4,
      mb: 8,
      minHeight: '90vh',
      transition: 'background-color 0.5s ease',
      backgroundColor: marketTrend === 'up'
        ? alpha(theme.palette.success.main, 0.05)
        : marketTrend === 'down'
        ? alpha(theme.palette.error.main, 0.05)
        : 'transparent'
    }}>
      {/* Header Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          mb: 6,
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              Market Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Real-time market insights and stock tracking
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={showOnlyFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            sx={{
              borderRadius: '28px',
              px: 4,
              py: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            {showOnlyFavorites ? "View All" : "Show Favorites"}
          </Button>
        </Box>
      </Box>

      {/* Enhanced Table */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: 2, // Changed from 4 to 2 for less rounded corners
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.7),
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
              height: '64px',
              '& .MuiTableCell-root': {
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                borderBottom: 'none',
              }
            }}>
              <TableCell width="25%" sx={{ pl: 3, fontWeight: 'bold', borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Stock Name</TableCell>
              <TableCell width="10%" sx={{ pl: 2, fontWeight: 'bold', borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Symbol</TableCell>
              <TableCell width="15%" align="right" sx={{ fontWeight: 'bold', pr: 3, borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Current Price</TableCell>
              <TableCell width="15%" align="right" sx={{ fontWeight: 'bold', pr: 3, borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Price Change</TableCell>
              <TableCell width="15%" align="center" sx={{ fontWeight: 'bold', borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Actions</TableCell>
              <TableCell width="20%" align="right" sx={{ fontWeight: 'bold', pr: 3 }}>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <LinearProgress sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : stocksToDisplay.length > 0 ? (
              stocksToDisplay.map((stock) => (
                <GlowingTableRow
                  key={stock.symbol}
                  priceChange={stock.priceChange}
                  component={motion.tr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  sx={{
                    height: '60px',
                    cursor: 'pointer',
                    '&:nth-of-type(odd)': {
                      backgroundColor: alpha(theme.palette.background.default, 0.4),
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 2
                        }}
                      >
                        {stock['Stock Name'][0]}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {stock['Stock Name']}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={stock.symbol} 
                      size="small"
                      sx={{ 
                        fontWeight: 'bold',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(stock.price)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {stock.priceChange && stock.priceChange > 0 ? (
                        <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} fontSize="small" />
                      ) : (
                        <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} fontSize="small" />
                      )}
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={stock.priceChange && stock.priceChange > 0 ? 'success.main' : 'error.main'}
                      >
                        {formatPriceChange(stock.priceChange)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(stock.symbol);
                      }}
                      sx={{ color: stock.favorite ? 'error.main' : 'text.secondary' }}
                    >
                      {stock.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : '-'}
                    </Typography>
                  </TableCell>
                </GlowingTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No stocks found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MarketPage;